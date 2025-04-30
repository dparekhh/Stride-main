"""
Bill management routes for the Stride platform.

This module handles bill creation, editing, approval, and invoice processing
using the refactored service and schema layers.
"""

import logging
from flask import Blueprint, request, jsonify, g
import os
from datetime import datetime
from marshmallow import ValidationError

from services.bill_service import (
    get_bills, get_bill, create_bill, update_bill, delete_bill,
    submit_bill_for_approval, approve_bill, reject_bill, mark_bill_as_paid
)
from services.ocr_service import OCRService
from schemas.bill_schemas import (
    BillSchema, BillUpdateSchema, ApprovalRequestSchema, 
    ApprovalActionSchema, PaymentSchema, InvoiceExtractionSchema
)
from utils.response_utils import (
    create_success_response, create_error_response, format_pagination_response
)
from utils.validation_utils import validate_file_type

logger = logging.getLogger(__name__)

bills_bp = Blueprint('bills', __name__, url_prefix='/api/bills')

@bills_bp.route('/', methods=['GET'])
def get_all_bills():
    """Get bills with optional filtering and pagination"""
    # Parse query parameters
    status = request.args.get('status')
    vendor_id = request.args.get('vendor_id')
    if vendor_id:
        try:
            vendor_id = int(vendor_id)
        except ValueError:
            return create_error_response("Invalid vendor ID format", status_code=400)
    
    # Pagination parameters
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 25))
    except ValueError:
        return create_error_response("Invalid pagination parameters", status_code=400)
    
    # Call service to get bills
    bills_data, total_count = get_bills(
        tenant_id=g.tenant_id,
        status=status,
        vendor_id=vendor_id,
        page=page,
        per_page=per_page
    )
    
    # Format paginated response
    response = format_pagination_response(
        items=bills_data,
        total=total_count,
        page=page,
        per_page=per_page
    )
    
    return jsonify(response)

@bills_bp.route('/<int:bill_id>', methods=['GET'])
def get_bill_by_id(bill_id):
    """Get a specific bill by ID with line items"""
    bill_data = get_bill(bill_id, tenant_id=g.tenant_id)
    
    if not bill_data:
        return create_error_response("Bill not found", status_code=404)
    
    return create_success_response(data=bill_data)

@bills_bp.route('/', methods=['POST'])
def create_new_bill():
    """Create a new bill"""
    # Validate request data
    try:
        bill_data = BillSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to create bill
    success, result, error = create_bill(bill_data, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(
        data=result,
        message="Bill created successfully",
        status_code=201
    )

@bills_bp.route('/<int:bill_id>', methods=['PUT'])
def update_existing_bill(bill_id):
    """Update an existing bill"""
    # Check if bill exists
    bill_data = get_bill(bill_id, tenant_id=g.tenant_id)
    if not bill_data:
        return create_error_response("Bill not found", status_code=404)
    
    # Validate request data
    try:
        # For updates, use the update schema with optional fields
        bill_update_data = BillUpdateSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to update bill
    success, result, error = update_bill(bill_id, bill_update_data, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(
        data=result,
        message="Bill updated successfully"
    )

@bills_bp.route('/<int:bill_id>', methods=['DELETE'])
def delete_existing_bill(bill_id):
    """Delete a bill"""
    # Call service to delete bill
    success, error = delete_bill(bill_id, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Bill deleted successfully")

@bills_bp.route('/upload-invoice', methods=['POST'])
def upload_invoice():
    """Upload an invoice and extract data using OCR and NLP"""
    if 'invoice' not in request.files:
        return create_error_response("No invoice file provided", status_code=400)
    
    file = request.files['invoice']
    if not file or not file.filename:
        return create_error_response("No file selected", status_code=400)
    
    # Validate file type
    allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg'}
    if not validate_file_type(file.filename, allowed_extensions):
        return create_error_response("Invalid file type", status_code=400)
    
    # Parse NLP flag from form data or query parameter
    use_nlp_form = request.form.get('use_nlp', 'false').lower() == 'true'
    use_nlp_query = request.args.get('useNLP', 'false').lower() == 'true'
    use_nlp = use_nlp_form or use_nlp_query
    
    # Process the invoice using OCR service
    ocr_service = OCRService(tenant_id=g.tenant_id)
    result = ocr_service.process_invoice_file(
        file=file,
        use_nlp=use_nlp
    )
    
    # If processing failed but the file was uploaded, return partial success
    if not result.get('success'):
        if 'invoice_file' in result:
            result['message'] = "File uploaded successfully, but automatic data extraction failed. Please enter details manually."
            return jsonify(result), 200
        else:
            return create_error_response(
                message="Failed to process invoice",
                errors=result.get('details'),
                status_code=500
            )
    
    return jsonify(result)

@bills_bp.route('/submit-for-approval/<int:bill_id>', methods=['POST'])
def submit_for_bill_approval(bill_id):
    """Submit a bill for approval"""
    # Validate request data
    try:
        approval_data = ApprovalRequestSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to submit bill for approval
    success, error = submit_bill_for_approval(
        bill_id=bill_id,
        approver_id=approval_data['approver_id'],
        notes=approval_data.get('notes'),
        tenant_id=g.tenant_id
    )
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Bill submitted for approval")

@bills_bp.route('/approve/<int:bill_id>', methods=['POST'])
def approve_bill_route(bill_id):
    """Approve a bill"""
    # Validate request data
    try:
        approval_data = ApprovalActionSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to approve bill
    success, error = approve_bill(
        bill_id=bill_id,
        approver_id=approval_data['approver_id'],
        approval_notes=approval_data.get('notes'),
        tenant_id=g.tenant_id
    )
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Bill approved successfully")

@bills_bp.route('/reject/<int:bill_id>', methods=['POST'])
def reject_bill_route(bill_id):
    """Reject a bill"""
    # Validate request data
    try:
        rejection_data = ApprovalActionSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    if 'reason' not in rejection_data:
        return create_error_response("Rejection reason is required", status_code=400)
    
    # Call service to reject bill
    success, error = reject_bill(
        bill_id=bill_id,
        approver_id=rejection_data['approver_id'],
        rejection_reason=rejection_data['reason'],
        tenant_id=g.tenant_id
    )
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Bill rejected successfully")

@bills_bp.route('/mark-as-paid/<int:bill_id>', methods=['POST'])
def mark_bill_paid(bill_id):
    """Mark a bill as paid"""
    # Validate request data
    try:
        payment_data = PaymentSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Convert date to string if it's a datetime object
    payment_date = None
    if 'payment_date' in payment_data:
        if isinstance(payment_data['payment_date'], datetime):
            payment_date = payment_data['payment_date'].strftime('%Y-%m-%d')
        else:
            payment_date = payment_data['payment_date']
    
    # Call service to mark bill as paid
    success, error = mark_bill_as_paid(
        bill_id=bill_id,
        payment_date=payment_date,
        payment_reference=payment_data.get('payment_reference'),
        payment_method=payment_data.get('payment_method'),
        payment_notes=payment_data.get('payment_notes'),
        tenant_id=g.tenant_id
    )
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Bill marked as paid successfully")