"""
Accounting configuration routes for the Stride platform.
"""
from flask import Blueprint, request
import logging
from marshmallow import ValidationError

from utils.response_utils import standardize_response
from utils.auth import login_required, admin_required
from services.accounting_service import AccountingService
from models import db

logger = logging.getLogger(__name__)
accounting_bp = Blueprint('accounting', __name__, url_prefix='/api/accounting')

@accounting_bp.route('/settings', methods=['GET'])
@login_required
def get_accounting_settings():
    """
    Get accounting settings for the tenant.
    
    Returns:
        A standardized response with accounting settings data
    """
    try:
        settings = AccountingService.get_accounting_settings()
        return standardize_response(success=True, data=settings)
    except Exception as e:
        logger.error(f"Error retrieving accounting settings: {str(e)}")
        return standardize_response(
            success=False,
            message=f"Error retrieving accounting settings: {str(e)}",
            status_code=500
        )

@accounting_bp.route('/settings', methods=['PUT'])
@admin_required
def update_accounting_settings():
    """
    Update accounting settings for the tenant.
    
    Returns:
        A standardized response with the updated accounting settings ID
    """
    try:
        result = AccountingService.update_accounting_settings(request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Accounting settings updated successfully'
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error updating accounting settings: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error updating accounting settings: {str(e)}",
            status_code=500
        )