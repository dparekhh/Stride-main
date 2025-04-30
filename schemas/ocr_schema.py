"""
OCR schema validation - Compatibility Module.

This module is maintained for backward compatibility.
All schema definitions have been consolidated in ocr_schemas.py.
"""

import logging
from schemas.ocr_schemas import (
    OCRUploadSchema,
    DocumentExtractionSchema,
    InvoiceExtractedDataSchema,
    TextExtractionResultSchema,
    ReceiptDataSchema,
    ReceiptExtractionResultSchema
)

logging.getLogger(__name__).info("Using consolidated OCR schemas from ocr_schemas.py")