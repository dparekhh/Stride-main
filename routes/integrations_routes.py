"""
Integration settings routes for the Stride platform
"""
from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from services.integration_service import IntegrationService
from utils.response_utils import standardize_response
from utils.auth import admin_required

integrations_bp = Blueprint('integrations', __name__, url_prefix='/api/settings/integrations')

@integrations_bp.route('/whatsapp', methods=['GET'])
def get_whatsapp_settings():
    """Get WhatsApp integration settings"""
    try:
        # Get WhatsApp settings using the service
        settings = IntegrationService.get_whatsapp_settings()
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'settings': settings}
        ))
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/whatsapp', methods=['PUT'])
@admin_required
def update_whatsapp_settings():
    """Update WhatsApp integration settings"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify(standardize_response(
                success=False,
                message="No data provided"
            )), 400
        
        # Update WhatsApp settings using the service
        settings = IntegrationService.update_whatsapp_settings(data)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'settings': settings},
            message="WhatsApp settings updated successfully"
        ))
    
    except ValidationError as e:
        return jsonify(standardize_response(
            success=False,
            message="Validation error",
            data={'errors': e.messages}
        )), 400
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp', methods=['GET'])
def get_erp_integrations():
    """Get all ERP integrations"""
    try:
        # Get ERP integrations using the service
        integrations = IntegrationService.get_erp_integrations()
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'integrations': integrations}
        ))
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp/<int:integration_id>', methods=['GET'])
def get_erp_integration(integration_id):
    """Get a specific ERP integration by ID"""
    try:
        # Get integration using the service
        integration = IntegrationService.get_erp_integration(integration_id)
        
        if not integration:
            return jsonify(standardize_response(
                success=False,
                message=f"Integration with ID {integration_id} not found"
            )), 404
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'integration': integration}
        ))
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp', methods=['POST'])
@admin_required
def create_erp_integration():
    """Create a new ERP integration"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify(standardize_response(
                success=False,
                message="No data provided"
            )), 400
        
        # Create integration using the service
        integration = IntegrationService.create_erp_integration(data)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'integration': integration},
            message="ERP integration created successfully"
        )), 201
    
    except ValidationError as e:
        return jsonify(standardize_response(
            success=False,
            message="Validation error",
            data={'errors': e.messages}
        )), 400
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp/<int:integration_id>', methods=['PUT'])
@admin_required
def update_erp_integration(integration_id):
    """Update an existing ERP integration"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify(standardize_response(
                success=False,
                message="No data provided"
            )), 400
        
        # Update integration using the service
        integration = IntegrationService.update_erp_integration(integration_id, data)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'integration': integration},
            message="ERP integration updated successfully"
        ))
    
    except ValidationError as e:
        return jsonify(standardize_response(
            success=False,
            message="Validation error",
            data={'errors': e.messages}
        )), 400
        
    except ValueError as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 404
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp/<int:integration_id>', methods=['DELETE'])
@admin_required
def delete_erp_integration(integration_id):
    """Delete an ERP integration"""
    try:
        # Delete integration using the service
        IntegrationService.delete_erp_integration(integration_id)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            message=f"ERP integration with ID {integration_id} deleted successfully"
        ))
    
    except ValueError as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 404
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@integrations_bp.route('/erp/defaults', methods=['GET'])
def get_erp_defaults():
    """Get default ERP integration settings"""
    try:
        # Get ERP defaults using the service
        defaults = IntegrationService.get_erp_defaults()
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'defaults': defaults}
        ))
    
    except Exception as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500