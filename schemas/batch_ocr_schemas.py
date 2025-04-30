"""
Batch OCR Schema Definitions

Defines schema validation for batch OCR processing requests and responses
"""

from marshmallow import Schema, fields, validate

class BatchProcessRequestSchema(Schema):
    """Schema for batch document processing requests"""
    file_paths = fields.List(
        fields.String(required=True), 
        required=True,
        validate=validate.Length(min=1),
        description="List of file paths to process"
    )
    document_type = fields.String(
        missing="invoice", 
        validate=validate.OneOf(["invoice", "receipt", "purchase_order", "grn"]),
        description="Type of documents to process"
    )
    use_nlp = fields.Boolean(
        missing=False, 
        description="Whether to use NLP for enhanced extraction"
    )

class BatchResultItemSchema(Schema):
    """Schema for individual document processing result"""
    file_path = fields.String(required=True, description="Path to the processed file")
    status = fields.String(required=True, description="Processing status (success or error)")
    result = fields.Dict(keys=fields.String(), values=fields.Raw(), allow_none=True, description="Processing result if successful")
    error = fields.String(allow_none=True, description="Error message if processing failed")

class BatchErrorItemSchema(Schema):
    """Schema for individual document processing error"""
    file_path = fields.String(required=True, description="Path to the file that failed processing")
    status = fields.String(required=True, description="Processing status (error)")
    error = fields.String(required=True, description="Error message")

class BatchProcessResponseSchema(Schema):
    """Schema for batch document processing response"""
    batch_id = fields.String(required=True, description="Unique batch identifier")
    total_documents = fields.Integer(required=True, description="Total number of documents in batch")
    processed_documents = fields.Integer(required=True, description="Number of successfully processed documents")
    failed_documents = fields.Integer(required=True, description="Number of documents that failed processing")
    results = fields.List(
        fields.Nested(BatchResultItemSchema), 
        required=True,
        description="Results of successful document processing"
    )
    errors = fields.List(
        fields.Nested(BatchErrorItemSchema),
        required=True, 
        description="Details of failed document processing"
    )