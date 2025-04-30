"""Routes module initialization."""
import logging

logger = logging.getLogger(__name__)

def register_routes(app):
    """Register all blueprint routes with the Flask app."""
    # Import consolidated bills routes for routing efficiency
    try:
        from routes.bills_consolidated import bills_bp
        logger.info("Using consolidated bills routes")
    except ImportError:
        # Fallback to original routes if consolidated module not available
        from routes.bills_routes import bills_bp
        logger.info("Using original bills routes")
    
    # Import other routes
    from routes.ocr_routes import ocr_bp
    from routes.vendors_routes import vendors_bp
    from routes.test_error_routes import test_error_bp
    
    # Import settings module blueprints
    from routes.users_routes import users_bp
    from routes.categories_routes import categories_bp
    from routes.integrations_routes import integrations_bp
    from routes.accounting_routes import accounting_bp
    from routes.config_routes import config_bp
    
    # Register core blueprints
    app.register_blueprint(bills_bp)
    app.register_blueprint(ocr_bp)
    app.register_blueprint(vendors_bp)
    app.register_blueprint(test_error_bp)
    
    # Register settings module blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(integrations_bp)
    app.register_blueprint(accounting_bp)
    app.register_blueprint(config_bp)