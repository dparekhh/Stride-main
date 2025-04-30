"""
Authentication and Tenant Management Routes
"""

import logging
from datetime import datetime
from flask import Blueprint, request, jsonify, session, redirect, url_for, render_template, g
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from email_validator import validate_email, EmailNotValidError

from app import app, db
from models import User, Tenant, UserRole, TenantStatus
from utils.tenant import set_current_tenant, get_current_tenant_id
from middleware.tenant_middleware import tenant_context_required

logger = logging.getLogger(__name__)

# Create a blueprint for authentication routes
auth_bp = Blueprint('stride_auth', __name__, url_prefix='/auth')

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'stride_auth.login'

@login_manager.user_loader
def load_user(user_id):
    """Load a user by ID for Flask-Login"""
    return User.query.get(int(user_id))

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login"""
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        try:
            # Validate email format
            validate_email(email)
        except EmailNotValidError:
            return jsonify({"error": "Invalid email format"}), 400
            
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Login user
        login_user(user)
        
        # Set tenant context
        set_current_tenant(user.tenant_id)
        
        # Return user info
        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value,
                "tenant_id": user.tenant_id
            }
        }), 200
    
    # Return login form for GET requests
    return jsonify({"message": "Please login with POST request"}), 200

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """Handle user logout"""
    logout_user()
    session.pop('tenant_id', None)
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration"""
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        tenant_id = data.get('tenant_id')
        
        # Validate required fields
        if not username or not email or not password or not tenant_id:
            return jsonify({"error": "All fields are required"}), 400
            
        try:
            # Validate email format
            validate_email(email)
        except EmailNotValidError:
            return jsonify({"error": "Invalid email format"}), 400
            
        # Check if tenant exists
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return jsonify({"error": "Invalid tenant ID"}), 400
            
        # Check if username or email already exists for this tenant
        if User.query.filter_by(username=username, tenant_id=tenant_id).first():
            return jsonify({"error": "Username already exists for this organization"}), 400
            
        if User.query.filter_by(email=email, tenant_id=tenant_id).first():
            return jsonify({"error": "Email already exists for this organization"}), 400
            
        # Create new user
        user = User(
            username=username,
            email=email,
            tenant_id=tenant_id,
            role=UserRole.EMPLOYEE  # Default role
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Login new user
        login_user(user)
        
        # Set tenant context
        set_current_tenant(user.tenant_id)
        
        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value,
                "tenant_id": user.tenant_id
            }
        }), 201
    
    # Return registration form for GET requests
    return jsonify({"message": "Please register with POST request"}), 200

@auth_bp.route('/select-tenant', methods=['GET', 'POST'])
def select_tenant():
    """Handle tenant selection"""
    if request.method == 'POST':
        data = request.get_json()
        tenant_id = data.get('tenant_id')
        
        if not tenant_id:
            return jsonify({"error": "Tenant ID is required"}), 400
            
        # Check if tenant exists
        tenant = Tenant.query.get(tenant_id)
        if not tenant:
            return jsonify({"error": "Invalid tenant ID"}), 400
            
        # Set tenant context
        set_current_tenant(tenant_id)
        
        # If user is logged in, verify they belong to this tenant
        if current_user.is_authenticated and current_user.tenant_id != tenant_id:
            # If user doesn't belong to this tenant, log them out
            logout_user()
            return jsonify({
                "success": True,
                "message": "Tenant selected, but you were logged out as you don't belong to this organization.",
                "tenant": {
                    "id": tenant.id,
                    "name": tenant.name,
                    "display_name": tenant.display_name
                }
            }), 200
        
        return jsonify({
            "success": True,
            "tenant": {
                "id": tenant.id,
                "name": tenant.name,
                "display_name": tenant.display_name
            }
        }), 200
    
    # Return list of available tenants for GET requests
    tenants = Tenant.query.all()
    return jsonify({
        "tenants": [
            {
                "id": tenant.id,
                "name": tenant.name,
                "display_name": tenant.display_name,
                "subdomain": tenant.subdomain
            } for tenant in tenants
        ]
    }), 200

@auth_bp.route('/create-tenant', methods=['POST'])
def create_tenant():
    """Handle tenant creation"""
    data = request.get_json()
    name = data.get('name')
    subdomain = data.get('subdomain')
    admin_username = data.get('admin_username')
    admin_email = data.get('admin_email')
    admin_password = data.get('admin_password')
    
    # Validate required fields
    if not name or not subdomain or not admin_username or not admin_email or not admin_password:
        return jsonify({"error": "All fields are required"}), 400
        
    try:
        # Validate email format
        validate_email(admin_email)
    except EmailNotValidError:
        return jsonify({"error": "Invalid email format"}), 400
        
    # Check if subdomain is available
    if Tenant.query.filter_by(subdomain=subdomain).first():
        return jsonify({"error": "Subdomain already in use"}), 400
    
    # Create new tenant
    tenant = Tenant(
        name=name,
        subdomain=subdomain,
        display_name=name,
        status=TenantStatus.ACTIVE,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.session.add(tenant)
    db.session.commit()
    
    # Create admin user for tenant
    admin = User(
        username=admin_username,
        email=admin_email,
        tenant_id=tenant.id,
        role=UserRole.ADMIN
    )
    admin.set_password(admin_password)
    
    db.session.add(admin)
    db.session.commit()
    
    # Login admin user
    login_user(admin)
    
    # Set tenant context
    set_current_tenant(tenant.id)
    
    return jsonify({
        "success": True,
        "tenant": {
            "id": tenant.id,
            "name": tenant.name,
            "display_name": tenant.display_name,
            "subdomain": tenant.subdomain
        },
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email,
            "role": admin.role.value
        }
    }), 201

@auth_bp.route('/current-user', methods=['GET'])
@login_required
def current_user_info():
    """Get current user information"""
    return jsonify({
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role.value,
            "tenant_id": current_user.tenant_id
        }
    }), 200

@auth_bp.route('/current-tenant', methods=['GET'])
def current_tenant_info():
    """Get current tenant information"""
    tenant_id = get_current_tenant_id()
    
    if not tenant_id:
        return jsonify({"error": "No tenant selected"}), 404
    
    tenant = Tenant.query.get(tenant_id)
    
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    
    return jsonify({
        "tenant": {
            "id": tenant.id,
            "name": tenant.name,
            "display_name": tenant.display_name,
            "subdomain": tenant.subdomain
        }
    }), 200

# Note: Blueprint is registered in app.py