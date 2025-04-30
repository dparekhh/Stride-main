"""Schema definitions for document processing."""
from marshmallow import Schema, fields, validates, ValidationError

class DocumentProcessSchema(Schema):
    """Schema for document processing parameters."""
    use_nlp = fields.Bool(missing=True)
    document_type = fields.Str(required=True)
    
    @validates('document_type')
    def validate_document_type(self, value):
        """Validate document type."""
        valid_types = ['invoice', 'receipt', 'purchase_order', 'grn', 'unknown']
        if value.lower() not in valid_types:
            raise ValidationError(f"Invalid document type. Must be one of: {', '.join(valid_types)}")

class InvoiceProcessSchema(Schema):
    """Schema for invoice processing parameters."""
    use_nlp = fields.Bool(missing=False)
    vendor_id = fields.Int(allow_none=True)
    include_line_items = fields.Bool(missing=True)