import os
import logging
from datetime import datetime

from flask import Flask, send_from_directory, jsonify, render_template, request, g, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_cors import CORS

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

"""
Stride - Multi-tenant Spend Management Platform
----------------------------------------------

This application provides comprehensive spend management capabilities
with multi-tenant support, focusing on bill management, vendor tracking,
and financial reporting for Indian businesses.

Key features:
- Multi-tenant architecture with complete data isolation
- Bill and invoice management
- Vendor relationship tracking
- Expense categorization
- Reporting and analytics
- Indian GST compliance

The system includes a responsive web interface built with React
and a robust Flask backend with PostgreSQL database.
"""

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__,
            static_folder='frontend/dist',
            template_folder='templates')

# Configure CORS to allow requests from any origin with additional options
CORS(app, resources={r"/api/*": {"origins": "*", 
                                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                                "allow_headers": ["Content-Type", "Authorization"]}})

# Configure app
app.secret_key = os.environ.get("SESSION_SECRET", "stride_secret_key_placeholder")

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

# Import routes after app is initialized to avoid circular imports
from routes import register_routes

# Initialize tenant middleware
from middleware import register_middleware
register_middleware(app)

# Register all route blueprints
register_routes(app)

# Register centralized error handlers
from utils.error_utils import register_error_handlers
register_error_handlers(app)

# Define tenant-aware query filter
from functools import wraps

def tenant_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get tenant ID from the current request context
        from utils.tenant import get_current_tenant_id
        tenant_id = get_current_tenant_id()
        
        if not tenant_id:
            return jsonify({'message': 'Tenant not identified'}), 401
        
        # Set tenant ID in Flask global context
        g.tenant_id = tenant_id
        return f(*args, **kwargs)
    
    return decorated_function

# Add health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.route('/api/health', methods=['GET'])
def api_health_check():
    return jsonify({"status": "ok"}), 200

@app.route('/api/test-endpoint', methods=['GET'])
def test_endpoint():
    return jsonify({
        "message": "API test endpoint is working",
        "timestamp": datetime.now().isoformat(),
        "status": "success"
    }), 200

@app.route('/api/test', methods=['GET'])
def api_test():
    app.logger.info("API test endpoint accessed")
    from utils.response_utils import standardize_response
    
    # Check if list format is requested
    list_format = request.args.get('format') == 'list'
    
    if list_format:
        # Return data as a list to test list response handling
        return standardize_response(
            data=[
                {
                    "id": 1,
                    "name": "Bill Pay",
                    "status": "active"
                },
                {
                    "id": 2,
                    "name": "Vendor Management",
                    "status": "active"
                },
                {
                    "id": 3,
                    "name": "OCR Processing",
                    "status": "active"
                }
            ],
            message="API is working correctly with list response format",
            success=True
        )
    else:
        # Return data as a dictionary
        return standardize_response(
            data={
                "status": "ok",
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "environment": "development",
                "architecture": "three-layer"
            },
            message="API is working correctly and using standardized response format",
            success=True
        )
    
@app.route('/api/documentai/usage', methods=['GET'])
@tenant_required
def documentai_usage():
    """API endpoint stub for backward compatibility with frontend.
    
    This endpoint previously provided Document AI usage statistics, but
    the functionality has been removed. We're keeping the endpoint to 
    maintain frontend compatibility.
    """
    app.logger.debug("Setting tenant query filter with tenant_id: %s", g.get('tenant_id'))
    app.logger.info("Document AI usage statistics endpoint accessed (functionality removed)")
    
    # Return empty statistics to maintain API compatibility
    empty_stats = {
        "overall": {
            "total_calls": 0,
            "total_pages": 0,
            "total_cost": 0.0,
            "ocr_calls": 0,
            "ocr_pages": 0,
            "ocr_cost": 0.0,
            "nlp_calls": 0,
            "nlp_pages": 0,
            "nlp_cost": 0.0
        },
        "by_tenant": {}
    }
    
    return jsonify({
        "status": "ok",
        "usage": empty_stats,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "message": "Document AI functionality has been removed from this application."
    }), 200
    
@app.route('/test', methods=['GET'])
def test_page():
    app.logger.info("Test page accessed")
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Stride Test Page</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #F97316; }
            .card { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>Stride Test Page</h1>
        <div class="card">
            <p>If you can see this, the web server is working correctly.</p>
            <p>Server time: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """</p>
        </div>
        <div class="card">
            <h2>Navigation</h2>
            <ul>
                <li><a href="/api/health">API Health Check</a></li>
                <li><a href="/health">Health Check</a></li>
                <li><a href="/">Home Page</a></li>
            </ul>
        </div>
    </body>
    </html>
    """


# Centralized error handling with standardized responses
from werkzeug.exceptions import HTTPException
from utils.response_utils import standardize_response

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    """Handle HTTP exceptions (e.g., 404, 400)."""
    app.logger.error(f"HTTP Exception: {str(e)}")
    return standardize_response(
        message=str(e.description),
        success=False,
        status_code=e.code
    )

@app.errorhandler(404)
def not_found(error):
    """Handle 404 Not Found errors with standardized response."""
    return standardize_response(
        message=f"Resource not found: {str(error)}",
        success=False,
        status_code=404
    )

@app.errorhandler(500)
def server_error(error):
    """Handle 500 Server Error with standardized response."""
    app.logger.error(f"Server error: {str(error)}")
    return standardize_response(
        message="An internal server error occurred",
        success=False,
        status_code=500
    )

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle uncaught exceptions with standardized response."""
    app.logger.error(f"Unhandled exception: {str(e)}")
    return standardize_response(
        message="An unexpected error occurred",
        success=False,
        status_code=500
    )

@app.errorhandler(ValueError)
def handle_value_error(e):
    """Handle ValueError exceptions (e.g., validation errors)."""
    extra_data = getattr(e, 'extra_data', None)
    return standardize_response(
        data=extra_data if extra_data else {},
        message=str(e),
        success=False,
        status_code=400
    )

# Handle custom application errors with their defined status codes
from utils.error_utils import ApplicationError
@app.errorhandler(ApplicationError)
def handle_application_error(e):
    """Handle application-specific errors with proper status codes."""
    # Log the error
    e.log()
    
    return standardize_response(
        data=e.extra_data,
        message=str(e),
        success=False,
        status_code=e.status_code
    )

# Let Flask automatically serve assets from the static folder (frontend/dist)
@app.route('/assets/<path:path>')
def serve_asset(path):
    """Serve assets from frontend/dist/assets with the correct MIME type"""
    try:
        app.logger.debug(f"Trying to serve asset: {path} from frontend/dist")
        
        # Extract the filename from the path
        if path.startswith('assets/'):
            path = path[7:]  # Remove 'assets/' prefix
        
        # Determine the correct MIME type based on file extension
        mimetype = None
        if path.endswith('.js'):
            mimetype = 'application/javascript'
        elif path.endswith('.css'):
            mimetype = 'text/css'
        elif path.endswith('.svg'):
            mimetype = 'image/svg+xml'
        elif path.endswith('.png'):
            mimetype = 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            mimetype = 'image/jpeg'
        elif path.endswith('.woff'):
            mimetype = 'font/woff'
        elif path.endswith('.woff2'):
            mimetype = 'font/woff2'
        elif path.endswith('.ttf'):
            mimetype = 'font/ttf'
            
        # Try to serve the file from the assets directory
        try:
            app.logger.debug(f"Attempting to serve from assets folder: {path}")
            response = send_from_directory('frontend/dist/assets', path, mimetype=mimetype)
            
            # Add cache control headers for assets (allow caching for faster loads)
            response.headers['Cache-Control'] = 'public, max-age=31536000'
            return response
        except FileNotFoundError:
            # Log the error but don't fail yet
            app.logger.warning(f"Asset not found in frontend/dist/assets: {path}")
            
            # Try to serve from the root static directory as a fallback
            try:
                app.logger.debug(f"Trying to serve from frontend/dist instead: {path}")
                return send_from_directory('frontend/dist', path, mimetype=mimetype)
            except FileNotFoundError:
                app.logger.error(f"Asset not found in any location: {path}")
                return jsonify({"error": "Asset not found"}), 404
    except Exception as e:
        app.logger.error(f"Error serving asset {path}: {str(e)}")
        return jsonify({"error": f"Asset error: {str(e)}"}), 500

# Query middleware to automatically filter by tenant_id
@app.before_request
def set_tenant_query_filter():
    # Only apply to specific routes, not static files or auth routes
    if not request.path.startswith(('/assets/', '/auth/', '/health')):
        # Set up the tenant filter in the global context
        from utils.tenant import get_current_tenant_id
        tenant_id = get_current_tenant_id()
        if tenant_id:
            g.tenant_id = tenant_id
            logger.debug(f"Setting tenant query filter with tenant_id: {tenant_id}")

# Serve static files and frontend routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Log the path being requested for debugging
    app.logger.debug(f"Serving path: {path}")
    frontend_path = 'frontend/dist'
    
    # Special handling for Stride logo - always serve with SVG MIME type
    # This handles both direct access to /Stride-Logo.svg and path-based access
    if path == 'Stride-Logo.svg' or path.endswith('/Stride-Logo.svg'):
        app.logger.debug(f"Serving Stride logo file: {path} from frontend/dist")
        response = send_from_directory(frontend_path, 'Stride-Logo.svg', mimetype='image/svg+xml')
        # Add aggressive cache control headers to prevent browser caching
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        # Add custom header for tracking
        response.headers['X-Logo-Served'] = 'direct-svg'
        return response
    
    # Handle special /assets/ path with our custom handler for better MIME type control
    if path.startswith('assets/'):
        app.logger.debug(f"Serving asset file: {path} from frontend/dist")
        return serve_asset(path)  # Keep the full path with 'assets/' prefix
    
    # Handle API requests through blueprints
    elif path.startswith('api/'):
        # The blueprint routes will have been invoked before we get here
        # Return a 404 if the route was not handled by a blueprint
        app.logger.debug(f"API path not found: {path}")
        return jsonify({"error": "API endpoint not found"}), 404
    
    # Check if this is a direct request for a static file (not assets)
    static_extensions = ['.js', '.css', '.png', '.jpg', '.svg', '.ico', '.woff', '.woff2', '.ttf']
    if path and any(path.endswith(ext) for ext in static_extensions):
        try:
            # Determine the correct MIME type
            mimetype = None
            if path.endswith('.js'):
                mimetype = 'application/javascript'
            elif path.endswith('.css'):
                mimetype = 'text/css'
            elif path.endswith('.svg'):
                mimetype = 'image/svg+xml'
            elif path.endswith('.png'):
                mimetype = 'image/png'
            elif path.endswith('.jpg') or path.endswith('.jpeg'):
                mimetype = 'image/jpeg'
            elif path.endswith('.woff'):
                mimetype = 'font/woff'
            elif path.endswith('.woff2'):
                mimetype = 'font/woff2'
            elif path.endswith('.ttf'):
                mimetype = 'font/ttf'
            
            # Use the static folder (frontend/dist) to serve the file
            app.logger.debug(f"Serving static file: {path} from frontend/dist")
            
            # Check if the file exists
            file_path = os.path.join(frontend_path, path)
            if os.path.isfile(file_path):
                response = send_from_directory(frontend_path, path, mimetype=mimetype)
                
                # Add cache control headers to prevent browser caching
                response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
                response.headers['Pragma'] = 'no-cache'
                response.headers['Expires'] = '0'
                return response
            else:
                app.logger.error(f"Static file not found: {path}")
                # Redirect to root for proper SPA routing
                return redirect('/')
        except FileNotFoundError:
            app.logger.error(f"Static file not found: {path}")
            # Check if index.html exists, otherwise redirect to root for proper handling
            index_path = os.path.join(frontend_path, 'index.html')
            if os.path.isfile(index_path):
                app.logger.debug(f"Falling back to index.html for: {path}")
                return send_from_directory(frontend_path, 'index.html')
            else:
                app.logger.warning(f"index.html not found, redirecting to root for: {path}")
                return redirect('/')
    
    # For all other routes, serve the React SPA's index.html
    try:
        app.logger.debug("Serving index.html from frontend/dist")
        frontend_path = 'frontend/dist'
        
        # Check if the frontend dist directory exists and contains index.html
        if os.path.exists(os.path.join(frontend_path, 'index.html')):
            response = send_from_directory(frontend_path, 'index.html')
            
            # Add cache control headers to prevent browser caching
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
        else:
            # If frontend/dist/index.html doesn't exist, try to rebuild the frontend
            app.logger.warning("frontend/dist/index.html not found. Attempting to create it...")
            
            # Create frontend/dist if it doesn't exist
            os.makedirs(frontend_path, exist_ok=True)
            
            # Create a simple SPA-compatible index.html
            fallback_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Stride - Indian spend management platform for businesses" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💰</text></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>Stride - Spend Management</title>
    <style>
      body { font-family: 'Inter', sans-serif; }
      .primary-color { color: #F97316; }
      .primary-bg { background-color: #F97316; }
    </style>
  </head>
  <body class="bg-gray-50">
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      <div class="flex items-center justify-center h-screen">
        <div class="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 class="text-3xl font-bold text-orange-500 mb-2">Stride</h1>
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Spend Management</h2>
          <div class="animate-pulse flex space-x-4 mb-4">
            <div class="h-2 bg-gray-200 rounded w-full"></div>
          </div>
          <p class="text-gray-600 mb-4">The frontend is currently being prepared...</p>
          <p class="text-gray-500 text-sm mb-4">Please run <code>./build_frontend.sh</code> in the terminal to build the frontend, or refresh this page in a few moments.</p>
          <div class="mt-4">
            <button onclick="window.location.reload()" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
"""
            # Write the fallback HTML to the index.html file
            with open(os.path.join(frontend_path, 'index.html'), 'w') as f:
                f.write(fallback_html)
                
            # Create assets directories
            os.makedirs(os.path.join(frontend_path, 'assets'), exist_ok=True)
            
            # Try serving the newly created index.html
            response = send_from_directory(frontend_path, 'index.html')
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'
            return response
    except Exception as e:
        app.logger.error(f"Error serving frontend: {str(e)}")
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Stride - Error</title>
            <style>
                body { font-family: 'Inter', sans-serif; margin: 40px; }
                h1 { color: #F97316; }
                pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto; }
            </style>
        </head>
        <body>
            <h1>Stride App</h1>
            <p>There was an error loading the frontend. Please check the server logs.</p>
            <pre>""" + str(e) + """</pre>
        </body>
        </html>
        """

# Create all database tables
with app.app_context():
    # Import models here so tables will be created
    import models
    db.create_all()
    logger.info("Database tables created successfully")

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port, debug=True)