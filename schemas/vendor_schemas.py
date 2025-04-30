"""
Vendor Schemas Module

This module contains Marshmallow schemas for vendor-related requests and responses.
"""

from marshmallow import Schema, fields, validate, ValidationError, validates_schema
from utils.validation_utils import validate_gstin, validate_pan

class VendorSchema(Schema):
    """Schema for vendor creation and updates"""
    name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    gstin = fields.String(required=False, allow_none=True)
    pan = fields.String(required=False, allow_none=True)
    email = fields.Email(required=False, allow_none=True)
    phone = fields.String(required=False, allow_none=True)
    address = fields.String(required=False, allow_none=True)
    city = fields.String(required=False, allow_none=True)
    state = fields.String(required=False, allow_none=True)
    pincode = fields.String(required=False, allow_none=True)
    country = fields.String(required=False, allow_none=True, default="India")
    category = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_tax_identifiers(self, data, **kwargs):
        """Validate GSTIN and PAN if provided"""
        gstin = data.get('gstin')
        pan = data.get('pan')
        
        if gstin and not validate_gstin(gstin):
            raise ValidationError('Invalid GSTIN format', 'gstin')
            
        if pan and not validate_pan(pan):
            raise ValidationError('Invalid PAN format', 'pan')


class VendorCheckSchema(Schema):
    """Schema for checking if a vendor exists"""
    vendor_name = fields.String(required=False, allow_none=True)
    vendor_gstin = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_at_least_one_field(self, data, **kwargs):
        """Ensure at least one of vendor_name or vendor_gstin is provided"""
        if not data.get('vendor_name') and not data.get('vendor_gstin'):
            raise ValidationError('Either vendor_name or vendor_gstin must be provided', '_schema')


class InvoiceVendorSchema(Schema):
    """Schema for creating a vendor from invoice data"""
    vendor_name = fields.String(required=True, validate=validate.Length(min=1, max=255))
    vendor_gstin = fields.String(required=False, allow_none=True)
    vendor_pan = fields.String(required=False, allow_none=True)
    vendor_email = fields.Email(required=False, allow_none=True)
    vendor_phone = fields.String(required=False, allow_none=True)
    vendor_address = fields.String(required=False, allow_none=True)
    vendor_city = fields.String(required=False, allow_none=True)
    vendor_state = fields.String(required=False, allow_none=True)
    vendor_pincode = fields.String(required=False, allow_none=True)
    vendor_country = fields.String(required=False, allow_none=True, default="India")
    vendor_category = fields.String(required=False, allow_none=True)
    
    @validates_schema
    def validate_tax_identifiers(self, data, **kwargs):
        """Validate GSTIN and PAN if provided"""
        gstin = data.get('vendor_gstin')
        pan = data.get('vendor_pan')
        
        if gstin and not validate_gstin(gstin):
            raise ValidationError('Invalid GSTIN format', 'vendor_gstin')
            
        if pan and not validate_pan(pan):
            raise ValidationError('Invalid PAN format', 'vendor_pan')