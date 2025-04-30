"""
OCR Vision Utilities - Stub Module

This module previously provided OCR document processing capabilities, but
all functionality has been removed. This stub maintains API compatibility
while returning empty/default values.
"""

import os
import logging
import datetime
import enum
from typing import Dict, List, Any, Optional, Tuple, Union, BinaryIO

# Configure logging
logger = logging.getLogger(__name__)

class DocumentType(enum.Enum):
    """Document type enumeration."""
    INVOICE = "invoice"
    RECEIPT = "receipt"
    PURCHASE_ORDER = "purchase_order"
    GRN = "grn"
    GENERIC = "generic"
    UNKNOWN = "unknown"

# Stub functions to maintain API compatibility

def process_document_image(
    image_content: bytes, 
    document_type: str = 'invoice', 
    use_nlp: bool = False,
    tenant_id: int = 1
) -> Dict[str, Any]:
    """
    Stub for document image processing (OCR removed)
    
    Args:
        image_content: Binary content of the image
        document_type: Type of document (invoice, receipt, etc.)
        use_nlp: Whether to use NLP for enhanced extraction
        tenant_id: Tenant ID for tracking
        
    Returns:
        Empty result dictionary
    """
    logger.info(f"OCR processing requested but functionality removed (document type: {document_type})")
    
    # Return empty data structure
    return {
        "raw_text": "",
        "document_type": document_type,
        "processing_timestamp": datetime.datetime.now().isoformat(),
        "error": "OCR processing has been disabled"
    }

def process_full_document_image(
    image_content: Union[str, bytes],
    document_type: Optional[DocumentType] = None,
    tenant_id: Optional[int] = None,
    use_nlp: bool = False
) -> Dict[str, Any]:
    """
    Stub for full document processing (OCR removed)
    
    Args:
        image_content: Binary content or base64 string of the image
        document_type: Type of document
        tenant_id: Tenant ID for tracking
        use_nlp: Whether to use NLP for enhanced extraction
        
    Returns:
        Empty result dictionary with standard keys
    """
    logger.info(f"OCR document processing requested but functionality removed (document type: {document_type})")
    
    # Return standardized empty result
    return {
        "success": True,
        "document_type": document_type.value if document_type else "unknown",
        "text": "",
        "extracted_data": {},
        "processing_timestamp": datetime.datetime.now().isoformat(),
        "message": "OCR processing has been disabled - please enter data manually"
    }

def get_document_ocr_text(image_content: bytes) -> str:
    """
    Stub for text extraction (OCR removed)
    
    Args:
        image_content: Binary content of the image
        
    Returns:
        Empty string
    """
    logger.info("OCR text extraction requested but functionality removed")
    return ""

def detect_document_type(text: str) -> DocumentType:
    """
    Stub for document type detection
    
    Args:
        text: Text content to analyze
        
    Returns:
        Default unknown document type
    """
    logger.info("Document type detection requested but functionality removed")
    return DocumentType.UNKNOWN

def extract_vendor_name(text: str) -> str:
    """Stub for vendor name extraction"""
    return ""

def extract_vendor_address(text: str) -> str:
    """Stub for vendor address extraction"""
    return ""

def extract_gstin(text: str) -> str:
    """Stub for GSTIN extraction"""
    return ""

def extract_invoice_number(text: str) -> str:
    """Stub for invoice number extraction"""
    return ""

def extract_date(text: str, date_type: str) -> Optional[str]:
    """Stub for date extraction"""
    return None

def extract_po_number(text: str) -> str:
    """Stub for PO number extraction"""
    return ""

def extract_eway_bill_number(text: str) -> str:
    """Stub for e-way bill number extraction"""
    return ""

def extract_payment_terms(text: str) -> str:
    """Stub for payment terms extraction"""
    return ""

def extract_payment_mode(text: str) -> str:
    """Stub for payment mode extraction"""
    return ""

def extract_amount(text: str, amount_type: str) -> float:
    """Stub for amount extraction"""
    return 0.0

def extract_line_items(text: str) -> List[Dict[str, Any]]:
    """Stub for line items extraction"""
    return []

def generate_confidence_scores() -> Dict[str, float]:
    """Generate dummy confidence scores for compatibility"""
    return {
        "vendor_name": 0.0,
        "invoice_number": 0.0,
        "invoice_date": 0.0,
        "due_date": 0.0,
        "total_amount": 0.0,
        "tax_amount": 0.0,
        "line_items": 0.0
    }