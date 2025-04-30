"""
OCR Schema Definitions

Defines schema validation for OCR-related API requests and responses.
This module consolidates all OCR-related schemas for the application.
"""

from marshmallow import Schema, fields, validate, ValidationError

class OCRProcessSchema(Schema):
    """Schema for OCR processing requests"""
    use_nlp = fields.Boolean(missing=False, description="Whether to use NLP for enhanced extraction")
    document_type = fields.String(
        missing="invoice", 
        validate=validate.OneOf(["invoice", "receipt", "purchase_order", "grn"]),
        description="Type of document to process"
    )

class LineItemSchema(Schema):
    """Schema for invoice line items"""
    description = fields.String(required=True, description="Item description")
    quantity = fields.Float(missing=1.0, description="Quantity")
    unit_price = fields.Float(required=True, description="Price per unit")
    amount = fields.Float(required=True, description="Total amount for this line")
    tax_rate = fields.Float(missing=0.0, description="Tax rate percentage")
    tax_amount = fields.Float(missing=0.0, description="Tax amount")
    category_id = fields.Integer(allow_none=True, description="Expense category ID")

class ConfidenceScoreSchema(Schema):
    """Schema for confidence scores of extracted fields"""
    vendor_name = fields.Float(missing=0.0)
    vendor_address = fields.Float(missing=0.0)
    vendor_gstin = fields.Float(missing=0.0)
    invoice_number = fields.Float(missing=0.0)
    invoice_date = fields.Float(missing=0.0)
    due_date = fields.Float(missing=0.0)
    total_amount = fields.Float(missing=0.0)
    subtotal_amount = fields.Float(missing=0.0)
    tax_amount = fields.Float(missing=0.0)

class ExtractedDataSchema(Schema):
    """Schema for extracted invoice data"""
    vendor_name = fields.String(missing="", description="Vendor name")
    vendor_address = fields.String(missing="", description="Vendor address")
    vendor_gstin = fields.String(missing="", description="Vendor GSTIN")
    invoice_number = fields.String(missing="", description="Invoice number")
    invoice_date = fields.String(missing=None, allow_none=True, description="Invoice issue date (YYYY-MM-DD)")
    due_date = fields.String(missing=None, allow_none=True, description="Invoice due date (YYYY-MM-DD)")
    po_number = fields.String(missing="", description="Purchase order number")
    eway_bill_number = fields.String(missing="", description="E-way bill number")
    payment_terms = fields.String(missing="", description="Payment terms")
    payment_mode = fields.String(missing="", description="Payment mode")
    total_amount = fields.Float(missing=0.0, description="Total invoice amount")
    subtotal_amount = fields.Float(missing=0.0, description="Subtotal amount")
    tax_amount = fields.Float(missing=0.0, description="Total tax amount")
    cgst_amount = fields.Float(missing=0.0, description="CGST amount")
    sgst_amount = fields.Float(missing=0.0, description="SGST amount")
    igst_amount = fields.Float(missing=0.0, description="IGST amount")
    line_items = fields.List(fields.Nested(LineItemSchema), missing=[], description="Invoice line items")
    confidence_scores = fields.Nested(ConfidenceScoreSchema, missing={}, description="Confidence scores for extracted fields")

class VendorDetailsSchema(Schema):
    """Schema for vendor details"""
    id = fields.Integer(required=True, description="Vendor ID")
    name = fields.String(required=True, description="Vendor name")
    gstin = fields.String(missing="", description="Vendor GSTIN")
    pan = fields.String(missing="", description="Vendor PAN")
    email = fields.String(missing="", description="Vendor email")
    phone = fields.String(missing="", description="Vendor phone")
    address = fields.String(missing="", description="Vendor address")
    category = fields.String(missing="", description="Vendor category")

class SuggestedVendorSchema(Schema):
    """Schema for suggested vendor from extraction"""
    name = fields.String(required=True, description="Vendor name")
    gstin = fields.String(missing="", description="Vendor GSTIN")
    address = fields.String(missing="", description="Vendor address")

class OCRResponseSchema(Schema):
    """Schema for OCR processing response"""
    invoice_file = fields.String(required=True, description="Path to uploaded invoice file")
    vendor_exists = fields.Boolean(required=True, description="Whether the vendor exists in the system")
    vendor_details = fields.Nested(VendorDetailsSchema, allow_none=True, description="Vendor details if found")
    potential_vendors = fields.List(fields.Nested(VendorDetailsSchema), missing=[], description="Potential vendor matches")
    nlp_enabled = fields.Boolean(required=True, description="Whether NLP was used for extraction")
    extracted_data = fields.Nested(ExtractedDataSchema, required=True, description="Extracted data from the invoice")
    nlp_fields = fields.Dict(keys=fields.String(), values=fields.Raw(), missing={}, description="Additional fields extracted with NLP")
    suggested_vendor = fields.Nested(SuggestedVendorSchema, allow_none=True, description="Suggested vendor to create")

# Legacy schemas from ocr_schema.py (consolidated)
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