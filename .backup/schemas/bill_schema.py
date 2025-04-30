"""Bill schema validation using marshmallow."""
from marshmallow import Schema, fields, validate, validates, ValidationError, validates_schema
from datetime import datetime

class BillLineItemSchema(Schema):
    """Schema for bill line items."""
    id = fields.Integer(required=False, allow_none=True)
    description = fields.String(required=True, validate=validate.Length(min=1, max=250))
    quantity = fields.Float(required=True, validate=validate.Range(min=0.01))
    unit_price = fields.Float(required=True, validate=validate.Range(min=0))
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    tax_rate = fields.Float(required=False, allow_none=True, default=0)
    tax_amount = fields.Float(required=False, allow_none=True, default=0)
    category_id = fields.Integer(required=False, allow_none=True)

    @validates('description')
    def validate_description(self, value):
        """Validate that description is not empty."""
        if not value or not value.strip():
            raise ValidationError('Description cannot be empty')

class BillSchema(Schema):
    """Schema for bill data."""
    id = fields.Integer(required=False, allow_none=True)
    invoice_number = fields.String(required=True, validate=validate.Length(min=1, max=50))
    vendor_id = fields.Integer(required=True)
    issue_date = fields.Date(required=True)
    due_date = fields.Date(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    tax_amount = fields.Float(required=False, allow_none=True, default=0)
    status = fields.String(required=False, validate=validate.OneOf(['draft', 'pending', 'approved', 'rejected', 'paid', 'overdue', 'canceled']), default='draft')
    notes = fields.String(required=False, allow_none=True)
    line_items = fields.List(fields.Nested(BillLineItemSchema), required=False)
    payment_terms = fields.String(required=False, allow_none=True)
    payment_method = fields.String(required=False, allow_none=True)
    reference_number = fields.String(required=False, allow_none=True)
    po_number = fields.String(required=False, allow_none=True)
    image_url = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate that due_date is not before issue_date."""
        if 'issue_date' in data and 'due_date' in data:
            if data['due_date'] < data['issue_date']:
                raise ValidationError('Due date cannot be before issue date')

class BillQuerySchema(Schema):
    """Schema for querying bills."""
    vendor_id = fields.Integer(required=False, allow_none=True)
    status = fields.String(required=False, allow_none=True, validate=validate.OneOf(['draft', 'pending', 'approved', 'rejected', 'paid', 'overdue', 'canceled', 'all']))
    from_date = fields.Date(required=False, allow_none=True)
    to_date = fields.Date(required=False, allow_none=True)
    min_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    max_amount = fields.Float(required=False, allow_none=True, validate=validate.Range(min=0))
    page = fields.Integer(required=False, allow_none=True, default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(required=False, allow_none=True, default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(required=False, allow_none=True)
    sort_by = fields.String(required=False, allow_none=True, validate=validate.OneOf(['issue_date', 'due_date', 'amount', 'status']))
    sort_order = fields.String(required=False, allow_none=True, validate=validate.OneOf(['asc', 'desc']), default='desc')
    
    @validates_schema
    def validate_amount_range(self, data, **kwargs):
        """Validate that min_amount is not greater than max_amount."""
        if 'min_amount' in data and 'max_amount' in data and data['min_amount'] is not None and data['max_amount'] is not None:
            if data['min_amount'] > data['max_amount']:
                raise ValidationError('Minimum amount cannot be greater than maximum amount')
                
    @validates_schema
    def validate_date_range(self, data, **kwargs):
        """Validate that from_date is not after to_date."""
        if 'from_date' in data and 'to_date' in data and data['from_date'] is not None and data['to_date'] is not None:
            if data['from_date'] > data['to_date']:
                raise ValidationError('From date cannot be after to date')

class BillUpdateSchema(Schema):
    """Schema for updating bills."""
    invoice_number = fields.String(required=False, validate=validate.Length(min=1, max=50))
    vendor_id = fields.Integer(required=False)
    issue_date = fields.Date(required=False)
    due_date = fields.Date(required=False)
    amount = fields.Float(required=False, validate=validate.Range(min=0))
    tax_amount = fields.Float(required=False, allow_none=True)
    status = fields.String(required=False, validate=validate.OneOf(['draft', 'pending', 'approved', 'rejected', 'paid', 'overdue', 'canceled']))
    notes = fields.String(required=False, allow_none=True)
    line_items = fields.List(fields.Nested(BillLineItemSchema), required=False)
    payment_terms = fields.String(required=False, allow_none=True)
    payment_method = fields.String(required=False, allow_none=True)
    reference_number = fields.String(required=False, allow_none=True)
    po_number = fields.String(required=False, allow_none=True)
    image_url = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate that due_date is not before issue_date."""
        if 'issue_date' in data and 'due_date' in data:
            if data['due_date'] < data['issue_date']:
                raise ValidationError('Due date cannot be before issue date')

class BillApprovalSchema(Schema):
    """Schema for bill approval/rejection."""
    status = fields.String(required=True, validate=validate.OneOf(['approved', 'rejected']))
    notes = fields.String(required=False, allow_none=True)
    approver_id = fields.Integer(required=False, allow_none=True)

class BillPaymentSchema(Schema):
    """Schema for bill payment."""
    payment_date = fields.Date(required=True)
    payment_method = fields.String(required=True)
    payment_reference = fields.String(required=False, allow_none=True)
    amount_paid = fields.Float(required=True, validate=validate.Range(min=0.01))
    notes = fields.String(required=False, allow_none=True)