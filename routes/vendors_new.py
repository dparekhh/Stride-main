"""
Vendor management routes for the Stride platform.

This module handles vendor creation, editing, and retrieval
using the refactored service and schema layers.
"""

import logging
from flask import Blueprint, request, jsonify, g
from marshmallow import ValidationError

from services.vendor_service import (
    get_vendors, get_vendor, create_vendor, update_vendor, delete_vendor
)
from schemas.vendor_schemas import (
    VendorSchema, VendorUpdateSchema, VendorSearchSchema
)
from utils.response_utils import (
    create_success_response, create_error_response, format_pagination_response
)

logger = logging.getLogger(__name__)

vendors_bp = Blueprint('vendors', __name__, url_prefix='/api/vendors')

@vendors_bp.route('/', methods=['GET'])
def get_all_vendors():
    """Get vendors with optional filtering and pagination"""
    # Validate query parameters using schema
    try:
        search_params = VendorSearchSchema().load(request.args)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Extract params for service call
    name_query = search_params.get('name')
    category = search_params.get('category')
    page = search_params.get('page', 1)
    per_page = search_params.get('per_page', 25)
    
    # Call service to get vendors
    vendors_data, total_count = get_vendors(
        tenant_id=g.tenant_id,
        name_query=name_query,
        category=category,
        page=page,
        per_page=per_page
    )
    
    # Format paginated response
    response = format_pagination_response(
        items=vendors_data,
        total=total_count,
        page=page,
        per_page=per_page
    )
    
    return jsonify(response)

@vendors_bp.route('/<int:vendor_id>', methods=['GET'])
def get_vendor_by_id(vendor_id):
    """Get a specific vendor by ID"""
    vendor_data = get_vendor(vendor_id, tenant_id=g.tenant_id)
    
    if not vendor_data:
        return create_error_response("Vendor not found", status_code=404)
    
    return create_success_response(data=vendor_data)

@vendors_bp.route('/', methods=['POST'])
def create_new_vendor():
    """Create a new vendor"""
    # Validate request data
    try:
        vendor_data = VendorSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to create vendor
    success, result, error = create_vendor(vendor_data, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(
        data=result,
        message="Vendor created successfully",
        status_code=201
    )

@vendors_bp.route('/<int:vendor_id>', methods=['PUT'])
def update_existing_vendor(vendor_id):
    """Update an existing vendor"""
    # Check if vendor exists
    vendor_data = get_vendor(vendor_id, tenant_id=g.tenant_id)
    if not vendor_data:
        return create_error_response("Vendor not found", status_code=404)
    
    # Validate request data
    try:
        # For updates, use the update schema with optional fields
        vendor_update_data = VendorUpdateSchema().load(request.json)
    except ValidationError as err:
        return create_error_response(
            message="Validation error",
            errors=err.messages,
            status_code=400
        )
    
    # Call service to update vendor
    success, result, error = update_vendor(vendor_id, vendor_update_data, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(
        data=result,
        message="Vendor updated successfully"
    )

@vendors_bp.route('/<int:vendor_id>', methods=['DELETE'])
def delete_existing_vendor(vendor_id):
    """Delete a vendor"""
    # Call service to delete vendor
    success, error = delete_vendor(vendor_id, tenant_id=g.tenant_id)
    
    if not success:
        return create_error_response(message=error, status_code=400)
    
    return create_success_response(message="Vendor deleted successfully")