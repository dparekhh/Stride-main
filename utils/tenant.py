"""Tenant utility module for multi-tenant support."""
import logging
from flask import g, session

logger = logging.getLogger(__name__)

def get_current_tenant_id():
    """Get the current tenant ID from the Flask global context."""
    # Return the tenant ID from Flask's global context if available
    tenant_id = g.get('tenant_id')
    
    # If not in g context, try to get from session
    if tenant_id is None:
        tenant_id = session.get('tenant_id')
    
    # If still not found, default to tenant ID 1
    if tenant_id is None:
        tenant_id = 1
        
    return tenant_id

def set_current_tenant(tenant_id):
    """
    Set the current tenant ID in the Flask session and global context.
    
    Args:
        tenant_id (int): The ID of the tenant to set as current.
    """
    if tenant_id is None:
        logger.warning("Attempted to set None as current tenant ID")
        return
    
    # Store in session for persistence across requests
    session['tenant_id'] = tenant_id
    
    # Store in g for access within the current request
    g.tenant_id = tenant_id
    
    logger.debug(f"Set current tenant ID to: {tenant_id}")
    
    return tenant_id