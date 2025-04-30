"""
Authentication utilities for the Stride platform.
This module provides decorators and functions for handling authentication and authorization.
"""
from functools import wraps
import logging
from typing import Callable

from flask import request, jsonify, g
from flask_login import current_user

from utils.response_utils import standardize_response

logger = logging.getLogger(__name__)

def admin_required(f: Callable) -> Callable:
    """
    Decorator to require admin permissions for a route
    
    Args:
        f: The route function to decorate
        
    Returns:
        Decorated function that checks for admin permissions
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip auth check during development if needed
        if hasattr(g, 'skip_auth') and g.skip_auth:
            return f(*args, **kwargs)
            
        # Check if user is logged in
        if not current_user.is_authenticated:
            return jsonify(standardize_response(
                success=False,
                message="Authentication required",
                error_code="AUTH_REQUIRED"
            )), 401
            
        # Check if user is an admin
        if current_user.role.name != "ADMIN":
            return jsonify(standardize_response(
                success=False,
                message="Admin permissions required",
                error_code="PERMISSION_DENIED"
            )), 403
            
        return f(*args, **kwargs)
        
    return decorated_function

def approver_required(f: Callable) -> Callable:
    """
    Decorator to require approver permissions for a route
    
    Args:
        f: The route function to decorate
        
    Returns:
        Decorated function that checks for approver permissions
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip auth check during development if needed
        if hasattr(g, 'skip_auth') and g.skip_auth:
            return f(*args, **kwargs)
            
        # Check if user is logged in
        if not current_user.is_authenticated:
            return jsonify(standardize_response(
                success=False,
                message="Authentication required",
                error_code="AUTH_REQUIRED"
            )), 401
            
        # Check if user is an admin or approver
        if current_user.role.name not in ["ADMIN", "APPROVER"]:
            return jsonify(standardize_response(
                success=False,
                message="Approver permissions required",
                error_code="PERMISSION_DENIED"
            )), 403
            
        return f(*args, **kwargs)
        
    return decorated_function

def login_required(f: Callable) -> Callable:
    """
    Decorator to require login for a route
    
    Args:
        f: The route function to decorate
        
    Returns:
        Decorated function that checks for authentication
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip auth check during development if needed
        if hasattr(g, 'skip_auth') and g.skip_auth:
            return f(*args, **kwargs)
            
        # Check if user is logged in
        if not current_user.is_authenticated:
            return jsonify(standardize_response(
                success=False,
                message="Authentication required",
                error_code="AUTH_REQUIRED"
            )), 401
            
        return f(*args, **kwargs)
        
    return decorated_function