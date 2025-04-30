"""
Stub module for Document AI functionality.

This module provides empty placeholder implementations of Document AI related classes
to maintain API compatibility with existing code while removing actual OCR, NLP, and
Document AI functionality.
"""

import logging

logger = logging.getLogger(__name__)

class DocumentAIUsageTracker:
    """
    Placeholder class that previously tracked Document AI API usage.
    All methods now return empty/zero values for compatibility.
    """
    
    @staticmethod
    def track_ocr_call(tenant_id=None, page_count=1):
        """Placeholder for OCR call tracking (no-op)."""
        logger.debug("OCR call tracking disabled - Document AI has been removed")
        return
    
    @staticmethod
    def track_nlp_call(tenant_id=None, page_count=1):
        """Placeholder for NLP call tracking (no-op)."""
        logger.debug("NLP call tracking disabled - Document AI has been removed")
        return
    
    @staticmethod
    def get_usage_stats():
        """Return empty usage statistics for API compatibility."""
        return {
            "overall": {
                "total_calls": 0,
                "total_pages": 0,
                "total_cost": 0.0,
                "ocr_calls": 0,
                "ocr_pages": 0,
                "ocr_cost": 0.0,
                "nlp_calls": 0,
                "nlp_pages": 0,
                "nlp_cost": 0.0
            },
            "by_tenant": {}
        }

# Enum for document types (for backward compatibility)
class DocumentType:
    """Document types enum for backward compatibility."""
    RECEIPT = "receipt"
    INVOICE = "invoice"
    PURCHASE_ORDER = "purchase_order"
    GRN = "grn"  # Goods Receipt Note
    EXPENSE_POLICY = "expense_policy"
    UNKNOWN = "unknown"
    GENERIC = "generic"