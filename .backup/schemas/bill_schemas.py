"""
Bill Schemas Module

This module contains Marshmallow schemas for bill-related requests and responses.
"""

from marshmallow import Schema, fields, validate, ValidationError, validates_schema
from datetime import datetime

class LineItemSchema(Schema):
    """Schema for line items within bills"""
    description = fields.String(required=True, validate=validate.Length(min=1, max=255))
    quantity = fields.Float(required=True, validate=validate.Range(min=0.01))
    unit_price = fields.Float(required=True, validate=validate.Range(min=0))
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    tax_rate = fields.Float(load_default=0, validate=validate.Range(min=0))
    tax_amount = fields.Float(load_default=0, validate=validate.Range(min=0))
    category_id = fields.Integer(allow_none=True)

class BillSchema(Schema):
    """Schema for bill creation"""
    vendor_id = fields.Integer(required=True, validate=validate.Range(min=1))
    invoice_number = fields.String(required=False, allow_none=True)
    issue_date = fields.String(required=True)
    due_date = fields.String(required=False, allow_none=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.01))
    currency = fields.String(load_default='INR')
    subtotal_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    tax_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    cgst_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    sgst_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    igst_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    po_number = fields.String(required=False, allow_none=True)
    eway_bill_number = fields.String(required=False, allow_none=True)
    payment_terms = fields.String(required=False, allow_none=True)
    payment_mode = fields.String(required=False, allow_none=True)
    notes = fields.String(required=False, allow_none=True)
    invoice_file = fields.String(required=False, allow_none=True)
    line_items = fields.List(fields.Nested(LineItemSchema), required=False)
    
    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate date formats and relationships"""
        date_format = '%Y-%m-%d'
        
        # Validate issue_date format
        try:
            issue_date = datetime.strptime(data['issue_date'], date_format)
        except ValueError:
            raise ValidationError('Issue date must be in the format YYYY-MM-DD', 'issue_date')
        
        # Validate due_date format if provided
        if 'due_date' in data and data['due_date']:
            try:
                due_date = datetime.strptime(data['due_date'], date_format)
                
                # Validate due_date is after issue_date
                if due_date < issue_date:
                    raise ValidationError('Due date must be on or after the issue date', 'due_date')
            except ValueError:
                raise ValidationError('Due date must be in the format YYYY-MM-DD', 'due_date')
        
    @validates_schema
    def validate_amount_consistency(self, data, **kwargs):
        """Validate that amount values are consistent"""
        subtotal = data.get('subtotal_amount')
        tax_amount = data.get('tax_amount')
        total_amount = data.get('amount')
        
        if subtotal is not None and tax_amount is not None:
            # If both subtotal and tax are provided, check consistency with total
            calculated_total = subtotal + tax_amount
            if abs(calculated_total - total_amount) > 0.01:  # Allow small floating point differences
                raise ValidationError(
                    'Amount must equal subtotal_amount + tax_amount',
                    'amount'
                )

class BillUpdateSchema(BillSchema):
    """Schema for bill updates - all fields are optional"""
    vendor_id = fields.Integer(required=False, validate=validate.Range(min=1))
    issue_date = fields.String(required=False)
    amount = fields.Float(required=False, validate=validate.Range(min=0.01))

class ApprovalRequestSchema(Schema):
    """Schema for bill approval requests"""
    approver_id = fields.Integer(required=True, validate=validate.Range(min=1))
    notes = fields.String(required=False, allow_none=True)

class ApprovalActionSchema(Schema):
    """Schema for approval actions (approve/reject)"""
    approver_id = fields.Integer(required=True, validate=validate.Range(min=1))
    notes = fields.String(required=False, allow_none=True)
    reason = fields.String(required=False, allow_none=True)  # Required for rejection

class PaymentSchema(Schema):
    """Schema for payment details"""
    payment_date = fields.String(required=True)
    payment_reference = fields.String(required=False, allow_none=True)
    payment_method = fields.String(required=True, validate=validate.OneOf([
        'bank_transfer', 'credit_card', 'cash', 'check', 'other'
    ]))
    payment_notes = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_payment_date(self, data, **kwargs):
        """Validate payment date format"""
        try:
            datetime.strptime(data['payment_date'], '%Y-%m-%d')
        except ValueError:
            raise ValidationError('Payment date must be in the format YYYY-MM-DD', 'payment_date')

class InvoiceExtractionSchema(Schema):
    """Schema for OCR invoice extraction request"""
    use_nlp = fields.Boolean(load_default=False)