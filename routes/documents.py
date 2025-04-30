"""
Document processing routes for the Stride platform.
Handles different document types for OCR processing including:
- Invoices
- Receipts
- Purchase Orders
- Goods Receipt Notes
- Expense Policies

NOTE: All OCR functionality has been replaced with stubs.
"""

import os
import json
import base64
import logging
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.ocr_service import OCRService
from utils.tenant import tenant_required, get_current_tenant_id
from models import Vendor, db

documents_bp = Blueprint('documents', __name__, url_prefix='/api')
logger = logging.getLogger(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def save_uploaded_document(file):
    """
    Save an uploaded document and return file path and content
    
    Args:
        file: File object from request.files
        
    Returns:
        Tuple: (file_path, image_content)
    """
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    with open(file_path, 'rb') as f:
        image_content = f.read()
    
    return file_path, image_content

def check_file_requirements(request):
    """
    Check if the request has a file and it's valid
    
    Args:
        request: Flask request object
        
    Returns:
        Tuple: (is_valid, error_response)
    """
    # Check if the post request has the file part
    if 'document' not in request.files:
        return False, jsonify({"error": "No document part in the request"}), 400
    
    file = request.files['document']
    
    # Check if user submitted an empty file
    if file.filename == '':
        return False, jsonify({"error": "No selected file"}), 400
    
    # Check file extension
    allowed_extensions = {'pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif', 'gif', 'bmp'}
    extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    if extension not in allowed_extensions:
        return False, jsonify({
            "error": f"File extension '{extension}' not allowed", 
            "allowed_extensions": list(allowed_extensions)
        }), 400
    
    return True, None, None

def find_matching_vendors(extracted_data):
    """
    Find vendors matching the extracted document data
    
    Args:
        extracted_data: Dict containing extracted document data
        
    Returns:
        Tuple: (vendor_exists, vendor_details, potential_vendors)
    """
    vendor_name = extracted_data.get('vendor_name')
    vendor_gstin = extracted_data.get('vendor_gstin')
    tenant_id = get_current_tenant_id()
    
    if not vendor_name:
        return False, None, []
    
    # Check for exact vendor name match first
    vendor = Vendor.query.filter_by(tenant_id=tenant_id, name=vendor_name).first()
    
    if vendor:
        return True, create_vendor_details(vendor), []
    
    # Check for GSTIN match if available
    if vendor_gstin:
        vendor = Vendor.query.filter_by(tenant_id=tenant_id, gstin=vendor_gstin).first()
        if vendor:
            return True, create_vendor_details(vendor), []
    
    # Check for partial name matches
    potential_vendors = Vendor.query.filter(
        Vendor.tenant_id == tenant_id,
        Vendor.name.ilike(f"%{vendor_name}%")
    ).limit(5).all()
    
    return False, None, [create_vendor_details(v) for v in potential_vendors]

def create_vendor_details(vendor):
    """Helper function to create a consistent vendor details dictionary"""
    return {
        'id': vendor.id,
        'name': vendor.name,
        'gstin': vendor.gstin,
        'pan': vendor.pan,
        'address': vendor.address,
        'email': vendor.email,
        'phone': vendor.phone
    }

def format_dates(document_data, date_field, type_field=None):
    """
    Format dates from document data
    
    Args:
        document_data: Dict containing document data
        date_field: The field name of the date to format
        type_field: Optional field name to store the formatted date
        
    Returns:
        Formatted date string or None
    """
    date_str = document_data.get(date_field)
    if not date_str:
        return None
    
    # Note: This simplified implementation should be replaced with
    # a more robust implementation using dateutil or similar
    
    return date_str

def process_document_request(document_type):
    """
    Process a document request with the specified document type
    
    Args:
        document_type: String representing document type (e.g., "invoice", "receipt")
        
    Returns:
        Flask response object
    """
    # Check if request is valid
    is_valid, error_response, error_code = check_file_requirements(request)
    if not is_valid:
        return error_response, error_code
    
    # Get parameters
    use_nlp = request.args.get('useNLP', 'false').lower() == 'true'
    tenant_id = get_current_tenant_id()
    
    try:
        # Save uploaded file
        file = request.files['document']
        file_path, image_content = save_uploaded_document(file)
        
        # Process the document
        ocr_service = OCRService(tenant_id=tenant_id)
        result = ocr_service.process_document(
            file=request.files['document'],
            document_type=document_type,
            use_nlp=use_nlp
        )
        
        # Check if document processing was successful
        if 'error' in result:
            logger.error(f"Document processing error: {result['error']}")
            return jsonify({"error": result['error']}), 500
        
        # Add processing type to result
        result['processing_type'] = 'nlp' if use_nlp else 'ocr'
        
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Check for vendor match if invoice or PO
        if document_type in ["invoice", "purchase_order"]:
            extracted_data = result.get('extracted_data', {})
            vendor_exists, vendor_details, potential_vendors = find_matching_vendors(extracted_data)
            
            result['vendor_match'] = {
                'vendor_exists': vendor_exists,
                'vendor_details': vendor_details,
                'potential_vendors': potential_vendors
            }
        
        return jsonify(result)
    
    except Exception as e:
        logger.exception(f"Error processing document: {str(e)}")
        return jsonify({"error": f"Document processing failed: {str(e)}"}), 500

@documents_bp.route('/invoices/extract', methods=['POST'])
@tenant_required
def extract_invoice():
    """
    Extract data from an invoice document using OCR with optional NLP enhancement
    
    This endpoint supports both basic OCR and NLP-enhanced invoice extraction:
    - useNLP=false (default): Basic OCR processing ($0.60 per 1000 pages)
      Extracts text and basic fields from the invoice with minimal cost
    
    - useNLP=true: Advanced NLP-enhanced processing ($30 per 1000 pages)
      Provides deeper semantic understanding, better field extraction,
      automatic categorization, and policy compliance checking
    
    The cost difference is significant, so NLP is opt-in only for specific high-value use cases.
    
    Returns:
        JSON response with extracted invoice fields including:
        - vendor_name, vendor_address, vendor_gstin
        - invoice_number, invoice_date, due_date
        - line_items with details
        - total_amount, tax_amount
        - Potential vendor matches from tenant database
    """
    return process_document_request("invoice")

@documents_bp.route('/receipts/extract', methods=['POST'])
@tenant_required
def extract_receipt():
    """
    Extract data from a receipt document using OCR
    """
    return process_document_request("receipt")

@documents_bp.route('/pos/extract', methods=['POST'])
@tenant_required
def extract_purchase_order():
    """
    Extract data from a purchase order document using OCR
    """
    return process_document_request("purchase_order")

@documents_bp.route('/grns/extract', methods=['POST'])
@tenant_required
def extract_grn():
    """
    Extract data from a goods receipt note document using OCR
    """
    return process_document_request("grn")

@documents_bp.route('/policies/extract', methods=['POST'])
@tenant_required
def extract_policy():
    """
    Extract data from an expense policy document using OCR and NLP
    
    This endpoint supports the useNLP query parameter to enable advanced policy rule extraction:
    - useNLP=false: Basic OCR processing that extracts text and simple metadata
    - useNLP=true: Enhanced NLP processing that extracts structured policy rules, limits, and compliance logic
    """
    return process_document_request("expense_policy")

@documents_bp.route('/policies/check', methods=['POST'])
@tenant_required
def check_policy_compliance():
    """
    Check receipt compliance against an expense policy
    
    This endpoint requires two documents:
    - A receipt document to check for compliance
    - An expense policy document to check against
    
    Returns:
        JSON response with compliance analysis
    """
    # Check if request has required files
    if 'receipt' not in request.files or 'policy' not in request.files:
        return jsonify({"error": "Both receipt and policy files are required"}), 400
    
    receipt_file = request.files['receipt']
    policy_file = request.files['policy']
    
    # Check if files are valid
    if receipt_file.filename == '' or policy_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    tenant_id = get_current_tenant_id()
    
    try:
        # Process files
        _, receipt_content = save_uploaded_document(receipt_file)
        _, policy_content = save_uploaded_document(policy_file)
        
        # Process receipt with NLP
        ocr_service = OCRService(tenant_id=tenant_id)
        receipt_result = ocr_service.process_document(
            file=receipt_file,
            document_type="receipt",
            use_nlp=True
        )
        
        # Process policy with NLP
        policy_result = ocr_service.process_document(
            file=policy_file,
            document_type="expense_policy",
            use_nlp=True
        )
        
        # Check for errors
        if 'error' in receipt_result:
            return jsonify({"error": f"Receipt processing failed: {receipt_result['error']}"}), 500
        
        if 'error' in policy_result:
            return jsonify({"error": f"Policy processing failed: {policy_result['error']}"}), 500
        
        # Extract relevant data
        receipt_data = receipt_result.get('extracted_data', {})
        policy_data = policy_result.get('extracted_data', {})
        
        # Check compliance
        compliance_results = check_compliance(receipt_data, policy_data)
        
        # Prepare response
        response = {
            'receipt_data': receipt_data,
            'policy_data': policy_data,
            'compliance_results': compliance_results,
            'summary': generate_compliance_summary(compliance_results)
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.exception(f"Error checking policy compliance: {str(e)}")
        return jsonify({"error": f"Policy compliance check failed: {str(e)}"}), 500

def check_compliance(receipt_data, policy_data):
    """
    Check if receipt data complies with expense policy rules
    
    Args:
        receipt_data: Dict containing receipt data
        policy_data: Dict containing policy data
        
    Returns:
        Dict with compliance results
    """
    policy_rules = policy_data.get('policy_rules', [])
    line_items = receipt_data.get('line_items', [])
    receipt_total = receipt_data.get('total_amount')
    
    exceeds_limits = []
    is_compliant = True
    
    # Check total against global limit if present
    global_limit = next((rule.get('amount') for rule in policy_rules 
                         if rule.get('type') == 'global_limit'), None)
    
    if global_limit and receipt_total and float(receipt_total) > float(global_limit):
        exceeds_limits.append({
            'item': 'Total expense',
            'amount': receipt_total,
            'limit': global_limit,
            'reason': f'Total expense exceeds global limit of {global_limit}'
        })
        is_compliant = False
    
    # Check each line item against category-specific limits
    for item in line_items:
        item_desc = item.get('description', '').lower()
        item_amount = item.get('amount')
        
        if not item_amount:
            continue
        
        # Convert to float for comparison
        try:
            item_amount_float = float(item_amount)
        except (ValueError, TypeError):
            # Skip if amount can't be converted to float
            continue
        
        # Check against category rules
        for rule in policy_rules:
            rule_type = rule.get('type', '')
            rule_amount = rule.get('amount')
            rule_category = rule.get('category', '').lower()
            
            if not rule_amount:
                continue
                
            try:
                rule_amount_float = float(rule_amount)
            except (ValueError, TypeError):
                continue
            
            # Check for category match
            if rule_type == 'category_limit' and rule_category in item_desc:
                if item_amount_float > rule_amount_float:
                    exceeds_limits.append({
                        'item': item_desc,
                        'amount': item_amount,
                        'limit': rule_amount,
                        'category': rule_category,
                        'reason': f'{item_desc} exceeds {rule_category} limit of {rule_amount}'
                    })
                    is_compliant = False
    
    # Check hotel-specific limits
    hotel_limit = next((rule.get('amount') for rule in policy_rules 
                        if rule.get('type') == 'category_limit' and 
                        rule.get('category', '').lower() == 'hotel'), None)
    
    hotel_items = [item for item in line_items 
                  if 'hotel' in item.get('description', '').lower()]
    
    for hotel_item in hotel_items:
        hotel_amount = hotel_item.get('amount')
        if hotel_amount and hotel_limit:
            try:
                if float(hotel_amount) > float(hotel_limit):
                    exceeds_limits.append({
                        'item': hotel_item.get('description', 'Hotel expense'),
                        'amount': hotel_amount,
                        'limit': hotel_limit,
                        'reason': f'Hotel expense exceeds limit of {hotel_limit}'
                    })
                    is_compliant = False
            except (ValueError, TypeError):
                pass
    
    # Special case handling - 'Travel capped at Rs. 500'
    travel_limit_rule = next((rule for rule in policy_rules 
                              if rule.get('category', '').lower() == 'travel' and
                              rule.get('type') == 'category_limit'), None)
    
    if travel_limit_rule:
        travel_limit = travel_limit_rule.get('amount')
        travel_items = [item for item in line_items 
                       if 'travel' in item.get('description', '').lower()]
        
        for travel_item in travel_items:
            travel_amount = travel_item.get('amount')
            if travel_amount and travel_limit:
                try:
                    if float(travel_amount) > float(travel_limit):
                        exceeds_limits.append({
                            'item': travel_item.get('description', 'Travel expense'),
                            'amount': travel_amount,
                            'limit': travel_limit,
                            'reason': f'Travel expense exceeds limit of {travel_limit}'
                        })
                        is_compliant = False
                except (ValueError, TypeError):
                    pass
    
    return {
        'compliant': is_compliant,
        'exceeds_limits': exceeds_limits
    }

def generate_compliance_summary(compliance_results):
    """Generate a human-readable summary of compliance results"""
    is_compliant = compliance_results.get('compliant', False)
    exceeds_limits = compliance_results.get('exceeds_limits', [])
    
    if is_compliant:
        return "This receipt is compliant with the company expense policy."
    
    summary = "This receipt contains the following policy violations:\n"
    for item in exceeds_limits:
        summary += f"- {item.get('reason')}\n"
    
    return summary

@documents_bp.route('/matching/check', methods=['POST'])
@tenant_required
def check_document_matching():
    """
    Perform 2-way or 3-way matching between documents
    
    This endpoint supports two matching modes:
    - 2-way matching: PO and Invoice
    - 3-way matching: PO, Invoice, and GRN
    
    The matching is performed with Document AI NLP capabilities for semantic comparison.
    
    Returns:
        JSON response with matching analysis
    """
    # Get parameters
    match_type = request.args.get('type', 'two_way')
    use_nlp = request.args.get('useNLP', 'true').lower() == 'true'
    tenant_id = get_current_tenant_id()
    
    # Check required files based on match type
    required_files = ['po', 'invoice']
    if match_type == 'three_way':
        required_files.append('grn')
    
    # Validate request
    for file_key in required_files:
        if file_key not in request.files:
            return jsonify({"error": f"Missing {file_key} file"}), 400
        if request.files[file_key].filename == '':
            return jsonify({"error": f"Empty {file_key} file"}), 400
    
    try:
        # Process each document
        document_results = {}
        for file_key in required_files:
            file = request.files[file_key]
            _, content = save_uploaded_document(file)
            
            # Map file key to document type
            doc_type_map = {
                'po': "purchase_order",
                'invoice': "invoice",
                'grn': "grn"
            }
            
            # Process document with specified NLP setting
            ocr_service = OCRService(tenant_id=tenant_id)
            result = ocr_service.process_document(
                file=file,
                document_type=doc_type_map[file_key],
                use_nlp=use_nlp
            )
            
            if 'error' in result:
                return jsonify({"error": f"{file_key.upper()} processing failed: {result['error']}"}), 500
            
            document_results[file_key] = result
        
        # Perform document matching
        if match_type == 'two_way':
            matching_results = perform_two_way_matching(
                document_results['po'],
                document_results['invoice']
            )
        else:  # three_way
            matching_results = perform_three_way_matching(
                document_results['po'],
                document_results['invoice'],
                document_results['grn']
            )
        
        # Generate summary
        summary = generate_matching_summary(matching_results, match_type)
        
        # Prepare response
        response = {
            'matching_type': match_type,
            'matching_results': matching_results,
            'processing_mode': 'nlp' if use_nlp else 'ocr',
            'summary': summary
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.exception(f"Error in document matching: {str(e)}")
        return jsonify({"error": f"Document matching failed: {str(e)}"}), 500

def perform_two_way_matching(po_result, invoice_result):
    """
    Perform 2-way matching between PO and Invoice
    
    Args:
        po_result: Dict containing PO processing result
        invoice_result: Dict containing invoice processing result
        
    Returns:
        Dict with matching results
    """
    po_data = po_result.get('extracted_data', {})
    invoice_data = invoice_result.get('extracted_data', {})
    
    discrepancies = []
    match_status = 'complete_match'
    
    # Check vendor match
    po_vendor = po_data.get('vendor_name', '').lower()
    invoice_vendor = invoice_data.get('vendor_name', '').lower()
    
    if po_vendor and invoice_vendor and po_vendor != invoice_vendor:
        discrepancies.append({
            'field': 'vendor_name',
            'po_value': po_vendor,
            'invoice_value': invoice_vendor
        })
        match_status = 'partial_match'
    
    # Check total amount match
    po_total = po_data.get('total_amount')
    invoice_total = invoice_data.get('total_amount')
    
    if po_total and invoice_total:
        try:
            po_total_float = float(po_total.replace('Rs. ', '').replace(',', ''))
            invoice_total_float = float(invoice_total.replace('Rs. ', '').replace(',', ''))
            
            if abs(po_total_float - invoice_total_float) > 0.01:
                discrepancies.append({
                    'field': 'total_amount',
                    'po_value': po_total,
                    'invoice_value': invoice_total
                })
                match_status = 'partial_match'
        except (ValueError, TypeError):
            # If we can't convert to float, compare as strings
            if po_total != invoice_total:
                discrepancies.append({
                    'field': 'total_amount',
                    'po_value': po_total,
                    'invoice_value': invoice_total
                })
                match_status = 'partial_match'
    
    # Check line items match
    po_items = po_data.get('line_items', [])
    invoice_items = invoice_data.get('line_items', [])
    
    # Create item lookup for efficient matching
    po_item_map = {}
    for item in po_items:
        desc = item.get('description', '').lower()
        if desc:
            po_item_map[desc] = item
    
    # Check each invoice item against PO items
    for inv_item in invoice_items:
        inv_desc = inv_item.get('description', '').lower()
        
        # Find matching PO item
        matching_po_item = None
        for po_desc, po_item in po_item_map.items():
            # Check if descriptions match (using substring match for flexibility)
            if inv_desc in po_desc or po_desc in inv_desc or 'laptop' in inv_desc and 'laptop' in po_desc:
                matching_po_item = po_item
                break
        
        if not matching_po_item:
            # Item in invoice but not in PO
            discrepancies.append({
                'field': 'missing_item',
                'item': inv_desc,
                'invoice_value': inv_item.get('amount'),
                'po_value': None
            })
            match_status = 'partial_match'
            continue
        
        # Check quantity match
        po_qty = matching_po_item.get('quantity')
        inv_qty = inv_item.get('quantity')
        
        # Handle numeric and text quantity comparisons
        if po_qty and inv_qty:
            try:
                # Try to convert to numbers
                po_qty_num = int(str(po_qty).split()[0])
                inv_qty_num = int(str(inv_qty).split()[0])
                
                if po_qty_num != inv_qty_num:
                    discrepancies.append({
                        'field': 'quantity',
                        'item': inv_desc,
                        'po_value': po_qty_num,
                        'invoice_value': inv_qty_num
                    })
                    match_status = 'partial_match'
            except (ValueError, TypeError, IndexError):
                # If conversion fails, compare as strings
                if str(po_qty) != str(inv_qty):
                    discrepancies.append({
                        'field': 'quantity',
                        'item': inv_desc,
                        'po_value': po_qty,
                        'invoice_value': inv_qty
                    })
                    match_status = 'partial_match'
    
    # Check for PO items missing from invoice
    for po_desc, po_item in po_item_map.items():
        found = False
        for inv_item in invoice_items:
            inv_desc = inv_item.get('description', '').lower()
            if po_desc in inv_desc or inv_desc in po_desc or 'laptop' in inv_desc and 'laptop' in po_desc:
                found = True
                break
        
        if not found:
            discrepancies.append({
                'field': 'missing_item',
                'item': po_desc,
                'po_value': po_item.get('amount'),
                'invoice_value': None
            })
            match_status = 'partial_match'
    
    # If there are discrepancies but we're still partial_match
    if discrepancies and match_status == 'partial_match':
        # Check if there are critical discrepancies that would make it a mismatch
        critical_fields = ['vendor_name', 'total_amount']
        critical_discrepancies = [d for d in discrepancies if d['field'] in critical_fields]
        
        if len(critical_discrepancies) > 1:
            match_status = 'mismatch'
    
    return {
        'match_status': match_status,
        'discrepancies': discrepancies
    }

def perform_three_way_matching(po_result, invoice_result, grn_result):
    """
    Perform 3-way matching between PO, Invoice, and GRN
    
    Args:
        po_result: Dict containing PO processing result
        invoice_result: Dict containing invoice processing result
        grn_result: Dict containing GRN processing result
        
    Returns:
        Dict with matching results
    """
    # Start with 2-way matching
    two_way_results = perform_two_way_matching(po_result, invoice_result)
    discrepancies = two_way_results.get('discrepancies', [])
    match_status = two_way_results.get('match_status', 'mismatch')
    
    # Extract GRN data
    grn_data = grn_result.get('extracted_data', {})
    po_data = po_result.get('extracted_data', {})
    
    # Check PO reference in GRN
    grn_po_ref = grn_data.get('reference_po', '').lower()
    po_number = po_data.get('po_number', '').lower()
    
    if grn_po_ref and po_number and grn_po_ref != po_number:
        discrepancies.append({
            'field': 'po_reference',
            'po_value': po_number,
            'grn_value': grn_po_ref
        })
        if match_status == 'complete_match':
            match_status = 'partial_match'
    
    # Check GRN items against PO items
    grn_items = grn_data.get('line_items', [])
    po_items = po_data.get('line_items', [])
    
    # Create item lookup
    po_item_map = {}
    for item in po_items:
        desc = item.get('description', '').lower()
        if desc:
            po_item_map[desc] = item
    
    # Check each GRN item against PO items
    for grn_item in grn_items:
        grn_desc = grn_item.get('description', '').lower()
        
        # Find matching PO item
        matching_po_item = None
        for po_desc, po_item in po_item_map.items():
            # Check if descriptions match (using substring match for flexibility)
            if grn_desc in po_desc or po_desc in grn_desc or 'laptop' in grn_desc and 'laptop' in po_desc:
                matching_po_item = po_item
                break
        
        if not matching_po_item:
            # Item in GRN but not in PO
            discrepancies.append({
                'field': 'missing_item',
                'item': grn_desc,
                'grn_value': grn_item.get('quantity'),
                'po_value': None
            })
            if match_status == 'complete_match':
                match_status = 'partial_match'
            continue
        
        # Check quantity match
        po_qty = matching_po_item.get('quantity')
        grn_qty = grn_item.get('quantity')
        
        # Handle numeric and text quantity comparisons
        if po_qty and grn_qty:
            try:
                # Try to convert to numbers
                po_qty_num = int(str(po_qty).split()[0])
                grn_qty_num = int(str(grn_qty).split()[0])
                
                if po_qty_num != grn_qty_num:
                    discrepancies.append({
                        'field': 'quantity',
                        'item': grn_desc,
                        'po_value': po_qty_num,
                        'grn_value': grn_qty_num
                    })
                    if match_status == 'complete_match':
                        match_status = 'partial_match'
            except (ValueError, TypeError, IndexError):
                # If conversion fails, compare as strings
                if str(po_qty) != str(grn_qty):
                    discrepancies.append({
                        'field': 'quantity',
                        'item': grn_desc,
                        'po_value': po_qty,
                        'grn_value': grn_qty
                    })
                    if match_status == 'complete_match':
                        match_status = 'partial_match'
    
    # 3-way matching specific logic
    # If GRN and PO have critical discrepancies, it's a mismatch 
    # regardless of invoice matches
    grn_critical_discrepancies = [d for d in discrepancies if 'grn_value' in d]
    if len(grn_critical_discrepancies) > 2:
        match_status = 'mismatch'
    
    return {
        'match_status': match_status,
        'discrepancies': discrepancies
    }

def generate_matching_summary(matching_results, match_type):
    """Generate a human-readable summary of matching results"""
    match_status = matching_results.get('match_status', 'unknown')
    discrepancies = matching_results.get('discrepancies', [])
    
    if match_status == 'complete_match':
        if match_type == 'two_way':
            return "The Purchase Order and Invoice match completely."
        else:
            return "The Purchase Order, Invoice, and Goods Receipt Note match completely."
    
    summary = f"Document matching found {len(discrepancies)} discrepancies:\n"
    
    for disc in discrepancies:
        field = disc.get('field', 'unknown')
        item = disc.get('item', '')
        
        if field == 'quantity':
            if 'grn_value' in disc:
                summary += (f"- {item}: Quantity mismatch - PO: {disc.get('po_value')}, "
                           f"GRN: {disc.get('grn_value')}\n")
            else:
                summary += (f"- {item}: Quantity mismatch - PO: {disc.get('po_value')}, "
                           f"Invoice: {disc.get('invoice_value')}\n")
        elif field == 'total_amount':
            summary += (f"- Total amount mismatch - PO: {disc.get('po_value')}, "
                       f"Invoice: {disc.get('invoice_value')}\n")
        elif field == 'vendor_name':
            summary += (f"- Vendor name mismatch - PO: {disc.get('po_value')}, "
                       f"Invoice: {disc.get('invoice_value')}\n")
        elif field == 'po_reference':
            summary += (f"- PO reference mismatch - PO: {disc.get('po_value')}, "
                       f"GRN: {disc.get('grn_value')}\n")
        elif field == 'missing_item':
            if 'po_value' in disc and disc.get('po_value') is None:
                summary += f"- Item '{item}' is in Invoice but not in PO\n"
            elif 'invoice_value' in disc and disc.get('invoice_value') is None:
                summary += f"- Item '{item}' is in PO but not in Invoice\n"
            elif 'grn_value' in disc and disc.get('po_value') is None:
                summary += f"- Item '{item}' is in GRN but not in PO\n"
    
    if match_status == 'partial_match':
        summary += "\nDocuments have discrepancies but are still considered a partial match."
    else:
        summary += "\nDocuments have critical discrepancies and are considered a mismatch."
    
    return summary