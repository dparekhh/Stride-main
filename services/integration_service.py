"""
Business logic for integration settings management.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

from models import WhatsAppSetting, ERPIntegration, db
from utils.settings_utils import safe_get, get_tenant_id, handle_database_error

logger = logging.getLogger(__name__)

class WhatsAppSettingsSchema(Schema):
    """Schema for validating WhatsApp settings data"""
    api_key = fields.Str(required=False, allow_none=True)
    phone_number_id = fields.Str(required=False, allow_none=True)
    webhook_secret = fields.Str(required=False, allow_none=True)
    enabled = fields.Boolean(required=False, missing=False)

class ERPIntegrationSchema(Schema):
    """Schema for validating ERP integration data"""
    name = fields.Str(required=True)
    api_key = fields.Str(required=False, allow_none=True)
    api_url = fields.Str(required=False, allow_none=True)
    username = fields.Str(required=False, allow_none=True)
    password = fields.Str(required=False, allow_none=True)
    enabled = fields.Boolean(required=False, missing=False)
    settings = fields.Dict(required=False, allow_none=True)

class IntegrationService:
    """
    Service for managing external integrations like WhatsApp, ERPs, etc.
    """
    
    @staticmethod
    def get_whatsapp_settings() -> Dict[str, Any]:
        """
        Get WhatsApp integration settings for the current tenant
        
        Returns:
            WhatsApp settings data dictionary
        """
        tenant_id = get_tenant_id()
        settings = WhatsAppSetting.query.filter_by(tenant_id=tenant_id).first()
        
        if not settings:
            return {
                'api_key': None,
                'phone_number_id': None,
                'webhook_secret': None,
                'enabled': False
            }
            
        return {
            'id': settings.id,
            'api_key': '••••••••', # Masked for security
            'phone_number_id': settings.phone_number_id,
            'webhook_secret': '••••••••', # Masked for security
            'enabled': settings.enabled,
            'created_at': settings.created_at.isoformat() if settings.created_at else None,
            'updated_at': settings.updated_at.isoformat() if settings.updated_at else None
        }
    
    @staticmethod
    def update_whatsapp_settings(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create or update WhatsApp integration settings
        
        Args:
            data: WhatsApp settings data dictionary
            
        Returns:
            Updated WhatsApp settings ID
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = WhatsAppSettingsSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating WhatsApp settings: {str(e)}")
            raise
        
        try:
            # Find existing settings or create new ones
            settings = WhatsAppSetting.query.filter_by(tenant_id=tenant_id).first()
            if not settings:
                settings = WhatsAppSetting(tenant_id=tenant_id)
                db.session.add(settings)
            
            # Update settings fields
            if 'api_key' in validated_data and validated_data['api_key']:
                settings.api_key = validated_data['api_key']
            if 'phone_number_id' in validated_data:
                settings.phone_number_id = validated_data['phone_number_id']
            if 'webhook_secret' in validated_data and validated_data['webhook_secret']:
                settings.webhook_secret = validated_data['webhook_secret']
            if 'enabled' in validated_data:
                settings.enabled = validated_data['enabled']
                
            # Update timestamp
            settings.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"WhatsApp settings updated successfully for tenant {tenant_id}")
            return {'id': settings.id}
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "whatsapp_settings")
            logger.error(f"Error updating WhatsApp settings: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def get_erp_integrations() -> List[Dict[str, Any]]:
        """
        Get all ERP integrations for the current tenant
        
        Returns:
            List of ERP integration data dictionaries
        """
        tenant_id = get_tenant_id()
        integrations = ERPIntegration.query.filter_by(tenant_id=tenant_id).all()
        
        return [IntegrationService._format_erp_integration(integration) for integration in integrations]
    
    @staticmethod
    def get_erp_integration(integration_id: int) -> Optional[Dict[str, Any]]:
        """
        Get a specific ERP integration by ID
        
        Args:
            integration_id: The ID of the integration to retrieve
            
        Returns:
            ERP integration data dictionary or None if not found
        """
        tenant_id = get_tenant_id()
        integration = ERPIntegration.query.filter_by(id=integration_id, tenant_id=tenant_id).first()
        
        if not integration:
            return None
            
        return IntegrationService._format_erp_integration(integration)
    
    @staticmethod
    def create_erp_integration(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new ERP integration
        
        Args:
            data: Integration data dictionary
            
        Returns:
            Created integration data
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = ERPIntegrationSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while creating ERP integration: {str(e)}")
            raise
        
        try:
            # Create new integration object
            new_integration = ERPIntegration(
                name=validated_data['name'],
                api_key=validated_data.get('api_key'),
                api_url=validated_data.get('api_url'),
                username=validated_data.get('username'),
                enabled=validated_data.get('enabled', False),
                settings=validated_data.get('settings', {}),
                tenant_id=tenant_id
            )
            
            # Set password if provided
            if 'password' in validated_data and validated_data['password']:
                new_integration.set_password(validated_data['password'])
            
            # Save to database
            db.session.add(new_integration)
            db.session.commit()
            
            logger.info(f"ERP integration created successfully: ID {new_integration.id}")
            return IntegrationService._format_erp_integration(new_integration)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "erp_integration")
            logger.error(f"Error creating ERP integration: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def update_erp_integration(integration_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing ERP integration
        
        Args:
            integration_id: The ID of the integration to update
            data: Updated integration data
            
        Returns:
            Updated integration data
            
        Raises:
            ValueError: If the integration does not exist
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Find integration
        integration = ERPIntegration.query.filter_by(id=integration_id, tenant_id=tenant_id).first()
        if not integration:
            raise ValueError(f"ERP integration with ID {integration_id} not found")
        
        # Validate input data
        schema = ERPIntegrationSchema()
        try:
            validated_data = schema.load(data, partial=True)
        except ValidationError as e:
            logger.error(f"Validation error while updating ERP integration: {str(e)}")
            raise
        
        try:
            # Update integration fields
            if 'name' in validated_data:
                integration.name = validated_data['name']
            if 'api_key' in validated_data:
                integration.api_key = validated_data['api_key']
            if 'api_url' in validated_data:
                integration.api_url = validated_data['api_url']
            if 'username' in validated_data:
                integration.username = validated_data['username']
            if 'enabled' in validated_data:
                integration.enabled = validated_data['enabled']
            if 'settings' in validated_data:
                integration.settings = validated_data['settings']
            if 'password' in validated_data and validated_data['password']:
                integration.set_password(validated_data['password'])
                
            # Update timestamp
            integration.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"ERP integration updated successfully: ID {integration.id}")
            return IntegrationService._format_erp_integration(integration)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "erp_integration")
            logger.error(f"Error updating ERP integration: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def delete_erp_integration(integration_id: int) -> None:
        """
        Delete an ERP integration
        
        Args:
            integration_id: The ID of the integration to delete
            
        Raises:
            ValueError: If the integration does not exist
        """
        tenant_id = get_tenant_id()
        
        # Find integration
        integration = ERPIntegration.query.filter_by(id=integration_id, tenant_id=tenant_id).first()
        if not integration:
            raise ValueError(f"ERP integration with ID {integration_id} not found")
        
        try:
            # Delete integration
            db.session.delete(integration)
            db.session.commit()
            logger.info(f"ERP integration deleted successfully: ID {integration_id}")
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "erp_integration")
            logger.error(f"Error deleting ERP integration: {error_info['message']}")
            raise ValueError(error_info['message'])
    
    @staticmethod
    def _format_erp_integration(integration: ERPIntegration) -> Dict[str, Any]:
        """
        Format an ERP integration object into a dictionary
        
        Args:
            integration: ERPIntegration object
            
        Returns:
            Formatted integration dictionary
        """
        return {
            'id': integration.id,
            'name': integration.name,
            'api_key': '••••••••' if integration.api_key else None, # Masked for security
            'api_url': integration.api_url,
            'username': integration.username,
            'enabled': integration.enabled,
            'settings': integration.settings,
            'last_sync': integration.last_sync.isoformat() if integration.last_sync else None,
            'tenant_id': integration.tenant_id,
            'created_at': integration.created_at.isoformat() if integration.created_at else None,
            'updated_at': integration.updated_at.isoformat() if integration.updated_at else None
        }