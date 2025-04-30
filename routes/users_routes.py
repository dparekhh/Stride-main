"""User management routes for the Stride platform."""
from flask import Blueprint, request, jsonify
import logging
from marshmallow import ValidationError

from services.user_service import UserService
from utils.response_utils import standardize_response
from utils.auth import admin_required, login_required
from models import db

logger = logging.getLogger(__name__)
users_bp = Blueprint('users', __name__, url_prefix='/api/settings/users')

@users_bp.route('/', methods=['GET'])
@login_required
def get_users():
    """Get all users for the current tenant."""
    try:
        # Get users using the service
        users = UserService.get_users()
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'users': users}
        ))
    
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@users_bp.route('/', methods=['POST'])
@admin_required
def create_user():
    """Create a new user."""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify(standardize_response(
                success=False,
                message="No data provided"
            )), 400
        
        # Create user using the service
        user = UserService.create_user(data)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'user': user},
            message="User created successfully"
        )), 201
    
    except ValidationError as e:
        return jsonify(standardize_response(
            success=False,
            message="Validation error",
            data={'errors': e.messages}
        )), 400
    
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        db.session.rollback()
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    """Get a specific user by ID."""
    try:
        # Get user using the service
        user = UserService.get_user(user_id)
        
        if not user:
            return jsonify(standardize_response(
                success=False,
                message=f"User with ID {user_id} not found"
            )), 404
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'user': user}
        ))
    
    except Exception as e:
        logger.error(f"Error retrieving user {user_id}: {str(e)}")
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update an existing user.
    
    Note: When an employee's role is updated through the ChangePosition drawer component,
    the change should immediately reflect in the role column of the All subtab table
    without requiring a page refresh."""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify(standardize_response(
                success=False,
                message="No data provided"
            )), 400
        
        # Update user using the service
        user = UserService.update_user(user_id, data)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'user': user},
            message="User updated successfully"
        ))
    
    except ValidationError as e:
        return jsonify(standardize_response(
            success=False,
            message="Validation error",
            data={'errors': e.messages}
        )), 400
        
    except ValueError as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 404
    
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {str(e)}")
        db.session.rollback()
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Delete a user."""
    try:
        # Delete user using the service
        UserService.delete_user(user_id)
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            message=f"User with ID {user_id} deleted successfully"
        ))
    
    except ValueError as e:
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 404
    
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        db.session.rollback()
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500

@users_bp.route('/roles', methods=['GET'])
def get_user_roles():
    """Get all available user roles"""
    try:
        # Get user roles using the service
        roles = UserService.get_user_roles()
        
        # Return standardized response
        return jsonify(standardize_response(
            success=True,
            data={'roles': roles}
        ))
    
    except Exception as e:
        logger.error(f"Error retrieving user roles: {str(e)}")
        return jsonify(standardize_response(
            success=False,
            message=str(e)
        )), 500