"""Stub service for OCR processing with no actual OCR, NLP, or Document AI functionality."""
import logging
import os
import uuid
from typing import Dict, Any, List, Optional
from utils.bill_utils import check_vendor_exists, format_date
from datetime import datetime

logger = logging.getLogger(__name__)

# Define a DocumentType enum replacement to maintain API compatibility
class DocumentType:
    RECEIPT = "receipt"
    INVOICE = "invoice"
    PURCHASE_ORDER = "purchase_order"
    GRN = "grn"  # Goods Receipt Note
    EXPENSE_POLICY = "expense_policy"
    UNKNOWN = "unknown"
    GENERIC = "generic"

class OCRService:
    """Service class for OCR processing operations - stripped of OCR/NLP/Document AI."""
    def __init__(self, tenant_id: int):
        self.tenant_id = tenant_id

    def process_invoice_file(self, file, use_nlp: bool = False) -> Dict[str, Any]:
        """Process an invoice file - no actual OCR processing."""
        allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg'}
        if not file.filename or not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError('Invalid file type')

        upload_dir = os.path.join('static', 'uploads', str(self.tenant_id))
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        logger.info(f"Received invoice file: {file.filename}, but OCR processing is disabled")
        
        # Since we're not using OCR, check for vendor without any extracted data
        vendor_exists, vendor_details, potential_vendors = check_vendor_exists(
            vendor_name=None,
            vendor_gstin=None,
            tenant_id=self.tenant_id
        )

        # Return empty data structure that matches the original API
        response_data = {
            'invoice_file': file_path,
            'vendor_exists': False,
            'vendor_details': None,
            'potential_vendors': [],
            'nlp_enabled': False,
            'message': "OCR processing is disabled. Please enter invoice details manually.",
            'extracted_data': {
                'vendor_name': '',
                'vendor_address': '',
                'vendor_gstin': '',
                'invoice_number': '',
                'invoice_date': None,
                'due_date': None,
                'po_number': '',
                'eway_bill_number': '',
                'payment_terms': '',
                'payment_mode': '',
                'total_amount': 0,
                'subtotal_amount': 0,
                'tax_amount': 0,
                'cgst_amount': 0,
                'sgst_amount': 0,
                'igst_amount': 0,
                'line_items': [],
                'confidence_scores': {}
            }
        }

        return response_data
        
    def extract_text_from_document(self, file) -> Dict[str, Any]:
        """Store the document but don't perform text extraction."""
        allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg'}
        if not file.filename or not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError('Invalid file type')

        upload_dir = os.path.join('static', 'uploads', str(self.tenant_id))
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        logger.info(f"Received document for text extraction: {file.filename}, but OCR is disabled")
            
        return {
            'success': True,
            'file_path': file_path,
            'text': "",
            'message': "OCR text extraction is disabled. Please enter text manually."
        }
        
    def process_receipt(self, file, use_nlp: bool = False) -> Dict[str, Any]:
        """Store receipt file but no OCR processing."""
        allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg'}
        if not file.filename or not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError('Invalid file type')

        upload_dir = os.path.join('static', 'uploads', str(self.tenant_id))
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        logger.info(f"Received receipt: {file.filename}, but OCR processing is disabled")
        
        return {
            'success': True,
            'file_path': file_path,
            'message': "OCR processing is disabled. Please enter receipt details manually.",
            'receipt_data': {
                'merchant_name': '',
                'receipt_number': '',
                'receipt_date': None,
                'total_amount': 0,
                'tax_amount': 0,
                'payment_method': '',
                'items': [],
                'confidence_scores': {}
            }
        }
    
    def save_document_extraction_result(self, file_path: str, document_type: str, extraction_result: Dict[str, Any], tenant_id: Optional[int] = None) -> int:
        """Save document file reference to database without extraction results."""
        from models import Document, db
        
        if tenant_id is None:
            tenant_id = self.tenant_id
            
        document = Document(
            file_path=file_path,
            original_filename=os.path.basename(file_path),
            document_type=document_type,
            status='completed',
            result='{"message": "OCR processing disabled"}',
            processed_at=datetime.utcnow(),
            tenant_id=tenant_id
        )
        
        db.session.add(document)
        db.session.commit()
        logger.info(f"Document record saved: ID {document.id} for tenant {tenant_id}")
        
        return document.id
        
    def process_document(self, file, document_type: str = "unknown", use_nlp: bool = False) -> Dict[str, Any]:
        """Store document but don't perform OCR processing."""
        allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg'}
        if not file.filename or not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError('Invalid file type')

        upload_dir = os.path.join('static', 'uploads', str(self.tenant_id))
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)

        logger.info(f"Received document of type {document_type}, but OCR processing is disabled")
        
        # Create a stub result for tracking
        result = {
            'success': True,
            'document_type': document_type,
            'file_path': file_path,
            'message': 'OCR processing is disabled. Please enter document details manually.'
        }
        
        # Save the file record
        self.save_document_extraction_result(
            file_path=file_path, 
            document_type=document_type,
            extraction_result=result
        )
        
        # Return type-specific format for API compatibility
        if document_type == "invoice":
            return self.process_invoice_file(file, False)
        elif document_type == "receipt":
            return self.process_receipt(file, False)
        elif document_type == "generic":
            return self.extract_text_from_document(file)
        else:
            # For other document types, return a stub response
            return {
                'success': True,
                'document_type': document_type,
                'file_path': file_path,
                'message': 'OCR processing is disabled. Please enter document details manually.',
                'extracted_data': {},
                'raw_text': ''
            }
            
    def get_available_processor_types(self) -> List[str]:
        """Return dummy list of processor types for API compatibility."""
        return ["invoice", "receipt", "purchase_order", "grn", "expense_policy", "unknown", "generic"]
        
    def is_nlp_enabled(self) -> bool:
        """NLP is disabled."""
        return False