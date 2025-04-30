"""
Business logic for user management.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

from models import User, UserRole, db
from utils.settings_utils import safe_get, get_tenant_id, handle_database_error

logger = logging.getLogger(__name__)

class UserSchema(Schema):
    """Schema for validating user data"""
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=lambda x: x in [role.value for role in UserRole])
    phone = fields.Str(required=False, allow_none=True)
    password = fields.Str(required=True)

class UpdateUserSchema(Schema):
    """Schema for validating user update data"""
    username = fields.Str(required=False)
    email = fields.Email(required=False)
    role = fields.Str(required=False, validate=lambda x: x in [role.value for role in UserRole] if x else True)
    phone = fields.Str(required=False, allow_none=True)
    password = fields.Str(required=False)

class UserService:
    """
    Service for managing users and user-related operations.
    """
    
    @staticmethod
    def get_users() -> List[Dict[str, Any]]:
        """
        Get all users for the current tenant
        
        Returns:
            List of user data dictionaries
        """
        tenant_id = get_tenant_id()
        users = User.query.filter_by(tenant_id=tenant_id).all()
        
        return [UserService._format_user(user) for user in users]
    
    @staticmethod
    def get_user(user_id: int) -> Optional[Dict[str, Any]]:
        """
        Get a specific user by ID
        
        Args:
            user_id: The ID of the user to retrieve
            
        Returns:
            User data dictionary or None if not found
        """
        tenant_id = get_tenant_id()
        user = User.query.filter_by(id=user_id, tenant_id=tenant_id).first()
        
        if not user:
            return None
            
        return UserService._format_user(user)
    
    @staticmethod
    def create_user(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new user
        
        Args:
            data: User data dictionary
            
        Returns:
            Created user data
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = UserSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while creating user: {str(e)}")
            raise
        
        try:
            # Create new user object
            new_user = User(
                username=validated_data['username'],
                email=validated_data['email'],
                role=UserRole(validated_data['role']),
                phone=validated_data.get('phone'),
                tenant_id=tenant_id
            )
            
            # Set password
            new_user.set_password(validated_data['password'])
            
            # Save to database
            db.session.add(new_user)
            db.session.commit()
            
            logger.info(f"User created successfully: ID {new_user.id}")
            return UserService._format_user(new_user)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "user")
            logger.error(f"Error creating user: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def update_user(user_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing user
        
        Args:
            user_id: The ID of the user to update
            data: Updated user data
            
        Returns:
            Updated user data
            
        Raises:
            ValueError: If the user does not exist
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Find user
        user = User.query.filter_by(id=user_id, tenant_id=tenant_id).first()
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        
        # Validate input data
        schema = UpdateUserSchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while updating user: {str(e)}")
            raise
        
        try:
            # Update user fields
            if 'username' in validated_data:
                user.username = validated_data['username']
            if 'email' in validated_data:
                user.email = validated_data['email']
            if 'role' in validated_data:
                user.role = UserRole(validated_data['role'])
            if 'phone' in validated_data:
                user.phone = validated_data['phone']
            if 'password' in validated_data:
                user.set_password(validated_data['password'])
                
            # Update timestamp
            user.updated_at = datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            logger.info(f"User updated successfully: ID {user.id}")
            return UserService._format_user(user)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "user")
            logger.error(f"Error updating user: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def delete_user(user_id: int) -> None:
        """
        Delete a user
        
        Args:
            user_id: The ID of the user to delete
            
        Raises:
            ValueError: If the user does not exist
        """
        tenant_id = get_tenant_id()
        
        # Find user
        user = User.query.filter_by(id=user_id, tenant_id=tenant_id).first()
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        
        try:
            # Delete user
            db.session.delete(user)
            db.session.commit()
            logger.info(f"User deleted successfully: ID {user_id}")
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "user")
            logger.error(f"Error deleting user: {error_info['message']}")
            raise ValueError(error_info['message'])
    
    @staticmethod
    def get_user_roles() -> List[Dict[str, Any]]:
        """
        Get all available user roles
        
        Returns:
            List of role data dictionaries
        """
        return [{'value': role.value, 'name': role.name} for role in UserRole]
    
    @staticmethod
    def _format_user(user: User) -> Dict[str, Any]:
        """
        Format a user object into a dictionary
        
        Args:
            user: User object
            
        Returns:
            Formatted user dictionary
        """
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value if user.role else None,
            'phone': user.phone,
            'tenant_id': user.tenant_id,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None,
        }