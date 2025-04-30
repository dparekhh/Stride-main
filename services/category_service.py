"""
Business logic for category management.
"""
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

from models import Category, db
from utils.settings_utils import safe_get, get_tenant_id, handle_database_error

logger = logging.getLogger(__name__)

class CategorySchema(Schema):
    """Schema for validating category data"""
    name = fields.Str(required=True)
    description = fields.Str(required=False, allow_none=True)

class CategoryService:
    """
    Service for managing expense categories and category-related operations.
    """
    
    @staticmethod
    def get_categories() -> List[Dict[str, Any]]:
        """
        Get all categories for the current tenant
        
        Returns:
            List of category data dictionaries
        """
        tenant_id = get_tenant_id()
        categories = Category.query.filter_by(tenant_id=tenant_id).all()
        
        return [CategoryService._format_category(category) for category in categories]
    
    @staticmethod
    def get_category(category_id: int) -> Optional[Dict[str, Any]]:
        """
        Get a specific category by ID
        
        Args:
            category_id: The ID of the category to retrieve
            
        Returns:
            Category data dictionary or None if not found
        """
        tenant_id = get_tenant_id()
        category = Category.query.filter_by(id=category_id, tenant_id=tenant_id).first()
        
        if not category:
            return None
            
        return CategoryService._format_category(category)
    
    @staticmethod
    def create_category(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new category
        
        Args:
            data: Category data dictionary
            
        Returns:
            Created category data
            
        Raises:
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Validate input data
        schema = CategorySchema()
        try:
            validated_data = schema.load(data)
        except ValidationError as e:
            logger.error(f"Validation error while creating category: {str(e)}")
            raise
        
        try:
            # Create new category object
            new_category = Category(
                name=validated_data['name'],
                description=validated_data.get('description'),
                tenant_id=tenant_id
            )
            
            # Save to database
            db.session.add(new_category)
            db.session.commit()
            
            logger.info(f"Category created successfully: ID {new_category.id}")
            return CategoryService._format_category(new_category)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "category")
            logger.error(f"Error creating category: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def update_category(category_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing category
        
        Args:
            category_id: The ID of the category to update
            data: Updated category data
            
        Returns:
            Updated category data
            
        Raises:
            ValueError: If the category does not exist
            ValidationError: If the data is invalid
        """
        tenant_id = get_tenant_id()
        
        # Find category
        category = Category.query.filter_by(id=category_id, tenant_id=tenant_id).first()
        if not category:
            raise ValueError(f"Category with ID {category_id} not found")
        
        # Validate input data
        schema = CategorySchema()
        try:
            validated_data = schema.load(data, partial=True)
        except ValidationError as e:
            logger.error(f"Validation error while updating category: {str(e)}")
            raise
        
        try:
            # Update category fields
            if 'name' in validated_data:
                category.name = validated_data['name']
            if 'description' in validated_data:
                category.description = validated_data['description']
                
            # Save changes
            db.session.commit()
            
            logger.info(f"Category updated successfully: ID {category.id}")
            return CategoryService._format_category(category)
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "category")
            logger.error(f"Error updating category: {error_info['message']}")
            raise ValidationError(error_info)
    
    @staticmethod
    def delete_category(category_id: int) -> None:
        """
        Delete a category
        
        Args:
            category_id: The ID of the category to delete
            
        Raises:
            ValueError: If the category does not exist
        """
        tenant_id = get_tenant_id()
        
        # Find category
        category = Category.query.filter_by(id=category_id, tenant_id=tenant_id).first()
        if not category:
            raise ValueError(f"Category with ID {category_id} not found")
        
        try:
            # Check if category is being used
            if category.line_items or category.expenses:
                raise ValueError("Cannot delete category that is in use")
                
            # Delete category
            db.session.delete(category)
            db.session.commit()
            logger.info(f"Category deleted successfully: ID {category_id}")
            
        except ValueError as e:
            # Re-raise validation errors for proper handling
            raise
            
        except Exception as e:
            db.session.rollback()
            error_info = handle_database_error(e, "category")
            logger.error(f"Error deleting category: {error_info['message']}")
            raise ValueError(error_info['message'])
    
    @staticmethod
    def _format_category(category: Category) -> Dict[str, Any]:
        """
        Format a category object into a dictionary
        
        Args:
            category: Category object
            
        Returns:
            Formatted category dictionary
        """
        return {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'tenant_id': category.tenant_id
        }