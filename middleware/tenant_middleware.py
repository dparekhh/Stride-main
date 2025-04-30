"""Tenant middleware for multi-tenant support."""
import logging
from flask import request, g

logger = logging.getLogger(__name__)

DEFAULT_TENANT_ID = 1

def get_tenant_id_from_request():
    """Extract tenant ID from request headers or query parameters."""
    # Try to get tenant ID from headers first
    tenant_id = request.headers.get('X-Tenant-ID')
    
    # If not in headers, try query parameters
    if not tenant_id:
        tenant_id = request.args.get('tenant_id')
    
    # Try to convert to integer
    if tenant_id:
        try:
            return int(tenant_id)
        except ValueError:
            logger.warning(f"Invalid tenant ID format: {tenant_id}")
            return None
    
    return None

def set_tenant_context():
    """Set the tenant context for the current request."""
    tenant_id = get_tenant_id_from_request()
    
    # Use default tenant if none provided
    if not tenant_id:
        tenant_id = DEFAULT_TENANT_ID
        logger.debug(f"No tenant ID found, using default: {DEFAULT_TENANT_ID}")
    
    # Set tenant ID in Flask global context
    g.tenant_id = tenant_id
    logger.debug(f"Request for tenant_id: {tenant_id}")

def init_tenant_middleware(app):
    """Initialize tenant middleware for the application."""
    @app.before_request
    def before_request():
        """Set tenant context before each request."""
        # Skip tenant context for health check endpoints
        if not request.path.startswith(('/health', '/static', '/assets')):
            set_tenant_context()