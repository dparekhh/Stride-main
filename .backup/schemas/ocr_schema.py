"""OCR schema validation using marshmallow."""
from marshmallow import Schema, fields, validate, ValidationError

class OCRUploadSchema(Schema):
    """Schema for OCR upload requests."""
    use_nlp = fields.Boolean(required=False, default=False)
    
class DocumentExtractionSchema(Schema):
    """Schema for document extraction results."""
    file_path = fields.String(required=True)
    document_type = fields.String(required=True)
    success = fields.Boolean(required=True)
    extracted_data = fields.Dict(required=False, allow_none=True)
    error = fields.String(required=False, allow_none=True)
    
class InvoiceExtractedDataSchema(Schema):
    """Schema for invoice extracted data."""
    vendor_name = fields.String(required=False, allow_none=True)
    vendor_address = fields.String(required=False, allow_none=True)
    vendor_gstin = fields.String(required=False, allow_none=True)
    invoice_number = fields.String(required=False, allow_none=True)
    invoice_date = fields.String(required=False, allow_none=True)
    due_date = fields.String(required=False, allow_none=True)
    po_number = fields.String(required=False, allow_none=True)
    eway_bill_number = fields.String(required=False, allow_none=True)
    payment_terms = fields.String(required=False, allow_none=True)
    payment_mode = fields.String(required=False, allow_none=True)
    total_amount = fields.Float(required=False, allow_none=True)
    subtotal_amount = fields.Float(required=False, allow_none=True)
    tax_amount = fields.Float(required=False, allow_none=True)
    cgst_amount = fields.Float(required=False, allow_none=True)
    sgst_amount = fields.Float(required=False, allow_none=True)
    igst_amount = fields.Float(required=False, allow_none=True)
    line_items = fields.List(fields.Dict(), required=False, allow_none=True)
    confidence_scores = fields.Dict(required=False, allow_none=True)
    
class TextExtractionResultSchema(Schema):
    """Schema for text extraction results."""
    success = fields.Boolean(required=True)
    file_path = fields.String(required=True)
    text = fields.String(required=False, allow_none=True)
    error = fields.String(required=False, allow_none=True)
    
class ReceiptDataSchema(Schema):
    """Schema for receipt data."""
    merchant_name = fields.String(required=False, allow_none=True)
    receipt_number = fields.String(required=False, allow_none=True)
    receipt_date = fields.String(required=False, allow_none=True)
    total_amount = fields.Float(required=False, allow_none=True)
    tax_amount = fields.Float(required=False, allow_none=True)
    payment_method = fields.String(required=False, allow_none=True)
    items = fields.List(fields.Dict(), required=False, allow_none=True)
    confidence_scores = fields.Dict(required=False, allow_none=True)
    
class ReceiptExtractionResultSchema(Schema):
    """Schema for receipt extraction results."""
    success = fields.Boolean(required=True)
    file_path = fields.String(required=True)
    receipt_data = fields.Nested(ReceiptDataSchema, required=False, allow_none=True)
    error = fields.String(required=False, allow_none=True)