"""Utility module for document type definitions."""
from enum import Enum

class DocumentType(Enum):
    """Enum representing supported document types."""
    INVOICE = 'invoice'
    RECEIPT = 'receipt'
    PURCHASE_ORDER = 'purchase_order'
    GRN = 'grn'
    UNKNOWN = 'unknown'