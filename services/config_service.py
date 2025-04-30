"""
Business logic for general configuration settings management.
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

from models import TenantSettings, db
from utils.settings_utils import safe_get, get_tenant_id, handle_database_error

logger = logging.getLogger(__name__)

class ImportSettingsSchema(Schema):
    """Schema for validating import settings"""
    tally_enabled = fields.Boolean(required=False, default=False)
    po_enabled = fields.Boolean(required=False, default=False)

class AccountingConfigSchema(Schema):
    """Schema for validating accounting configuration"""
    default_expense_account = fields.Str(required=False, allow_none=True)
    default_ap_account = fields.Str(required=False, allow_none=True)
    default_tax_rate = fields.Str(required=False, allow_none=True)
    auto_tax = fields.Boolean(required=False, default=False)
    integrations = fields.Dict(required=False, allow_none=True)

class ApprovalSettingsSchema(Schema):
    """Schema for validating approval settings"""
    single_approver = fields.Boolean(required=False, default=True)
    amount_based = fields.Boolean(required=False, default=False)
    department_based = fields.Boolean(required=False, default=False)
    tiers = fields.List(fields.Dict(), required=False, allow_none=True)

class ConfigService:
    """
    Service for managing general configuration settings.
    """
    
    @staticmethod
    def get_settings() -> Dict[str, Any]:
        """
        Get general configuration settings for the current tenant
        
        Returns:
            Settings data dictionary
        """
        tenant_id = get_tenant_id()
        settings = TenantSettings.query.filter_by(tenant_id=tenant_id).first()
        
        if not settings or not settings.config:
            # Default configuration
            return {
                "import_settings": {
                    "tally_enabled": False,
                    "po_enabled": False
                },
                "accounting": {
                    "default_expense_account": None,
                    "default_ap_account": None,
                    "default_tax_rate": None,
                    "auto_tax": False,
                    "integrations": {}
                },
                "approvals": {
                    "single_approver": True,
                    "amount_based": False,
                    "department_based": False,
                    "tiers": []
                }
            }
            
        return settings.config
    
    @staticmethod
    def update_import_settings(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update import settings
        
        Args:
            data: Import settings data dictionary
            
        Returns:
            Updated import settings
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = ImportSettingsSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating import settings: {str(e)}")
            raise
        
        try:
            # Find existing settings or create new ones
            settings = TenantSettings.query.filter_by(tenant_id=tenant_id).first()
            if not settings:
                settings = TenantSettings(tenant_id=tenant_id, config={})
                db.session.add(settings)
            
            if not settings.config:
                settings.config = {}
                
            # Ensure import_settings exists
            if 'import_settings' not in settings.config:
                settings.config['import_settings'] = {}
                
            # Update import settings
            for key, value in validated_data.items():
                settings.config['import_settings'][key] = value
                
            # Update timestamp
            settings.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"Import settings updated successfully for tenant {tenant_id}")
            return settings.config['import_settings']
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "tenant_settings")
            logger.error(f"Error updating import settings: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def update_accounting_config(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update accounting configuration
        
        Args:
            data: Accounting configuration data dictionary
            
        Returns:
            Updated accounting configuration
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = AccountingConfigSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating accounting config: {str(e)}")
            raise
        
        try:
            # Find existing settings or create new ones
            settings = TenantSettings.query.filter_by(tenant_id=tenant_id).first()
            if not settings:
                settings = TenantSettings(tenant_id=tenant_id, config={})
                db.session.add(settings)
            
            if not settings.config:
                settings.config = {}
                
            # Ensure accounting exists
            if 'accounting' not in settings.config:
                settings.config['accounting'] = {}
                
            # Update accounting config
            for key, value in validated_data.items():
                settings.config['accounting'][key] = value
                
            # Update timestamp
            settings.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"Accounting config updated successfully for tenant {tenant_id}")
            return settings.config['accounting']
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "tenant_settings")
            logger.error(f"Error updating accounting config: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def update_approval_settings(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update approval settings
        
        Args:
            data: Approval settings data dictionary
            
        Returns:
            Updated approval settings
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = ApprovalSettingsSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating approval settings: {str(e)}")
            raise
        
        try:
            # Find existing settings or create new ones
            settings = TenantSettings.query.filter_by(tenant_id=tenant_id).first()
            if not settings:
                settings = TenantSettings(tenant_id=tenant_id, config={})
                db.session.add(settings)
            
            if not settings.config:
                settings.config = {}
                
            # Ensure approvals exists
            if 'approvals' not in settings.config:
                settings.config['approvals'] = {}
                
            # Update approval settings
            for key, value in validated_data.items():
                settings.config['approvals'][key] = value
                
            # Update timestamp
            settings.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"Approval settings updated successfully for tenant {tenant_id}")
            return settings.config['approvals']
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "tenant_settings")
            logger.error(f"Error updating approval settings: {error_info['message']}")
            raise ValidationError(error_info)