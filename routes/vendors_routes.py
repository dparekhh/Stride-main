"""Vendor management routes for the Stride platform."""
from flask import Blueprint, request, jsonify, g
import logging
from marshmallow import ValidationError as MarshmallowValidationError, Schema, fields
from models import Vendor, db
from utils.response_utils import standardize_response
from services.vendor_service import VendorService
from utils.error_utils import ApplicationError, ValidationError, NotFoundError
from utils.exception_utils import DataValidationError
from schemas.vendor_schema import VendorSchema

logger = logging.getLogger(__name__)
vendors_bp = Blueprint('vendors', __name__, url_prefix='/api/vendors')

@vendors_bp.route('/', methods=['GET'])
def get_vendors():
    """Get all vendors."""
    try:
        vendor_service = VendorService(g.tenant_id)
        result = vendor_service.get_all_vendors()
        return standardize_response(data={'vendors': result})
    except Exception as e:
        logger.error(f"Error retrieving vendors: {str(e)}")
        raise

@vendors_bp.route('/<int:vendor_id>', methods=['GET'])
def get_vendor(vendor_id):
    """Retrieve a specific vendor by ID."""
    vendor_service = VendorService(g.tenant_id)
    vendor = vendor_service.get_vendor(vendor_id)
    return standardize_response(data=vendor, message="Vendor retrieved successfully", success=True)

@vendors_bp.route('/', methods=['POST'])
def create_vendor():
    """Create a new vendor."""
    try:
        vendor_service = VendorService(g.tenant_id)
        vendor_details = vendor_service.create_vendor(request.json)
        return standardize_response(data=vendor_details, message='Vendor created successfully', status_code=201)
    except DataValidationError as e:
        return standardize_response(data=e.extra_data, message=str(e), success=False, status_code=409)
    except ValueError as e:
        return standardize_response(message=str(e), success=False, status_code=400)
    except Exception as e:
        logger.error(f"Error creating vendor: {str(e)}")
        db.session.rollback()
        raise

@vendors_bp.route('/<int:vendor_id>', methods=['PUT'])
def update_vendor(vendor_id):
    """Update an existing vendor with the provided data."""
    data = request.json
    if not data:
        raise ValidationError('No data provided', errors={'data': 'No data provided for vendor update'})
    
    vendor_service = VendorService(g.tenant_id)
    vendor_service.update_vendor(vendor_id, data)
    return standardize_response(message='Vendor updated successfully', success=True)

@vendors_bp.route('/<int:vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    """Delete a vendor by ID."""
    vendor_service = VendorService(g.tenant_id)
    vendor_service.delete_vendor(vendor_id)
    return standardize_response(message='Vendor deleted successfully', success=True)

@vendors_bp.route('/check-vendor', methods=['POST'])
def check_if_vendor_exists():
    """Check if a vendor exists in the database."""
    class CheckVendorSchema(Schema):
        vendor_name = fields.Str(allow_none=True)
        vendor_gstin = fields.Str(allow_none=True)

    try:
        data = CheckVendorSchema().load(request.json)
    except MarshmallowValidationError as err:
        return standardize_response(message=str(err.messages), success=False, status_code=400)

    try:
        vendor_service = VendorService(g.tenant_id)
        vendor_exists, vendor_details, potential_vendors = vendor_service.check_if_vendor_exists(
            vendor_name=data.get('vendor_name'),
            vendor_gstin=data.get('vendor_gstin')
        )
        message = (
            "Vendor found." if vendor_exists else
            "Multiple potential vendors found." if potential_vendors else
            "No matching vendor found."
        )
        return standardize_response(data={
            'vendor_exists': vendor_exists,
            'vendor_details': vendor_details,
            'potential_vendors': potential_vendors
        }, message=message)
    except ValueError as e:
        raise
    except Exception as e:
        logger.error(f"Error checking vendor existence: {str(e)}")
        raise

@vendors_bp.route('/verify/gstin/<string:gstin>', methods=['GET'])
def verify_gstin(gstin):
    """Verify a GSTIN (Goods and Services Tax Identification Number) and retrieve business details."""
    try:
        vendor_service = VendorService(g.tenant_id)
        result = vendor_service.verify_gstin(gstin)
        if result:
            return standardize_response(data=result, success=True)
        return standardize_response(message='Invalid GSTIN or verification failed', success=False, status_code=400)
    except ValueError as ve:
        return standardize_response(message=str(ve), success=False, status_code=400)
    except Exception as e:
        logger.error(f"Error verifying GSTIN: {str(e)}")
        return standardize_response(message=str(e), success=False, status_code=500)

@vendors_bp.route('/create-vendor-from-invoice', methods=['POST'])
def create_vendor_from_invoice():
    """Create a vendor from extracted invoice data."""
    try:
        vendor_service = VendorService(g.tenant_id)
        vendor_details = vendor_service.create_vendor_from_invoice(request.json)
        message = 'Vendor already exists in the system' if vendor_details.get('id') else 'New vendor created successfully'
        status_code = 200 if vendor_details.get('id') else 201
        return standardize_response(data={'vendor': vendor_details}, message=message, status_code=status_code)
    except DataValidationError as e:
        return standardize_response(data=e.extra_data, message=str(e), success=False, status_code=409)
    except ValueError as e:
        return standardize_response(message=str(e), success=False, status_code=400)
    except Exception as e:
        logger.error(f"Error creating vendor from invoice: {str(e)}")
        db.session.rollback()
        raise

@vendors_bp.route('/search', methods=['GET'])
def search_vendors():
    """Search for vendors by name, email, or phone."""
    query = request.args.get('q', '')
    if not query or len(query) < 2:
        return standardize_response(message='Search query must be at least 2 characters', success=False, status_code=400)
    
    try:
        vendor_service = VendorService(g.tenant_id)
        vendors = vendor_service.search_vendors(query)
        return standardize_response(data=vendors, success=True)
    except Exception as e:
        logger.error(f"Error searching vendors: {str(e)}")
        return standardize_response(message=str(e), success=False, status_code=500)