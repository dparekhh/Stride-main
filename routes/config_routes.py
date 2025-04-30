"""
General configuration routes for the Stride platform.
"""
from flask import Blueprint, request, g
import logging
from marshmallow import ValidationError

from utils.response_utils import standardize_response
from utils.auth import login_required, admin_required
from services.config_service import ConfigService
from services.user_service import UserService
from models import db

logger = logging.getLogger(__name__)
config_bp = Blueprint('config', __name__, url_prefix='/api/settings')

@config_bp.route('/', methods=['GET'])
@login_required
def get_settings():
    """
    Get general settings for the tenant.
    
    Returns:
        A standardized response with general settings data
    """
    try:
        settings = ConfigService.get_settings()
        return standardize_response(success=True, data=settings)
    except Exception as e:
        logger.error(f"Error retrieving settings: {str(e)}")
        return standardize_response(
            success=False,
            message=f"Error retrieving settings: {str(e)}",
            status_code=500
        )

@config_bp.route('/import', methods=['PUT'])
@admin_required
def update_import_settings():
    """
    Update import settings.
    
    Returns:
        A standardized response with the updated import settings
    """
    try:
        result = ConfigService.update_import_settings(request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Import settings updated successfully'
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error updating import settings: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error updating import settings: {str(e)}",
            status_code=500
        )

@config_bp.route('/accounting-config', methods=['PUT'])
@admin_required
def update_accounting_config():
    """
    Update accounting configuration.
    
    Returns:
        A standardized response with the updated accounting configuration
    """
    try:
        result = ConfigService.update_accounting_config(request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Accounting config updated successfully'
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error updating accounting config: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error updating accounting config: {str(e)}",
            status_code=500
        )

@config_bp.route('/approvals', methods=['PUT'])
@admin_required
def update_approval_settings():
    """
    Update approval settings.
    
    Returns:
        A standardized response with the updated approval settings
    """
    try:
        result = ConfigService.update_approval_settings(request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Approval settings updated successfully'
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error updating approval settings: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error updating approval settings: {str(e)}",
            status_code=500
        )