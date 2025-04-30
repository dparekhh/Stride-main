"""Schemas for vendor data validation."""
from marshmallow import Schema, fields

class VendorSchema(Schema):
    """Schema for validating vendor data."""
    name = fields.Str(required=True)
    gstin = fields.Str(allow_none=True)
    pan = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    phone = fields.Str(allow_none=True)
    address = fields.Str(allow_none=True)
    category = fields.Str(allow_none=True)

class InvoiceVendorSchema(VendorSchema):
    """Schema for validating vendor data from invoices."""
    vendor_name = fields.Str(required=True)
    vendor_gstin = fields.Str(allow_none=True)
    vendor_address = fields.Str(allow_none=True)
    vendor_email = fields.Str(allow_none=True)
    vendor_phone = fields.Str(allow_none=True)