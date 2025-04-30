"""
Business logic for accounting settings management.
"""
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

from models import AccountingSettings, db
from utils.settings_utils import safe_get, get_tenant_id, handle_database_error

logger = logging.getLogger(__name__)

class AccountingSettingsSchema(Schema):
    """Schema for validating accounting settings data"""
    fiscal_year_start = fields.Date(required=False, allow_none=True)
    chart_of_accounts = fields.Dict(required=False, allow_none=True)
    tax_settings = fields.Dict(required=False, allow_none=True)
    default_approval_threshold = fields.Float(required=False, allow_none=True)

class AccountingService:
    """
    Service for managing accounting settings and related operations.
    """
    
    @staticmethod
    def get_accounting_settings() -> Dict[str, Any]:
        """
        Get accounting settings for the current tenant
        
        Returns:
            Accounting settings data dictionary
        """
        tenant_id = get_tenant_id()
        settings = AccountingSettings.query.filter_by(tenant_id=tenant_id).first()
        
        if not settings:
            return {
                'fiscal_year_start': None,
                'chart_of_accounts': {},
                'tax_settings': {},
                'default_approval_threshold': 0.0
            }
            
        return AccountingService._format_accounting_settings(settings)
    
    @staticmethod
    def update_accounting_settings(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create or update accounting settings
        
        Args:
            data: Accounting settings data dictionary
            
        Returns:
            Updated accounting settings ID
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = AccountingSettingsSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating accounting settings: {str(e)}")
            raise
        
        try:
            # Find existing settings or create new ones
            settings = AccountingSettings.query.filter_by(tenant_id=tenant_id).first()
            if not settings:
                settings = AccountingSettings(tenant_id=tenant_id)
                db.session.add(settings)
            
            # Update settings fields
            if 'fiscal_year_start' in validated_data:
                settings.fiscal_year_start = validated_data['fiscal_year_start']
            if 'chart_of_accounts' in validated_data:
                settings.chart_of_accounts = validated_data['chart_of_accounts']
            if 'tax_settings' in validated_data:
                settings.tax_settings = validated_data['tax_settings']
            if 'default_approval_threshold' in validated_data:
                settings.default_approval_threshold = validated_data['default_approval_threshold']
                
            # Update timestamp
            settings.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"Accounting settings updated successfully for tenant {tenant_id}")
            return {'id': settings.id}
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "accounting_settings")
            logger.error(f"Error updating accounting settings: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def _format_accounting_settings(settings: AccountingSettings) -> Dict[str, Any]:
        """
        Format accounting settings object into a dictionary
        
        Args:
            settings: AccountingSettings object
            
        Returns:
            Formatted accounting settings dictionary
        """
        return {
            'id': settings.id,
            'fiscal_year_start': settings.fiscal_year_start.isoformat() if settings.fiscal_year_start else None,
            'chart_of_accounts': settings.chart_of_accounts or {},
            'tax_settings': settings.tax_settings or {},
            'default_approval_threshold': settings.default_approval_threshold or 0.0,
            'tenant_id': settings.tenant_id,
            'created_at': settings.created_at.isoformat() if settings.created_at else None,
            'updated_at': settings.updated_at.isoformat() if settings.updated_at else None
        }