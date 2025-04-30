"""Middleware module initialization."""

def register_middleware(app):
    """Register all middleware with the Flask app."""
    from middleware.tenant_middleware import init_tenant_middleware
    
    # Initialize tenant middleware
    init_tenant_middleware(app)