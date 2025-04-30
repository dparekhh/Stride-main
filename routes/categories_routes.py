"""
Category management routes for the Stride platform.
"""
from flask import Blueprint, request, g
import logging
from marshmallow import ValidationError

from utils.response_utils import standardize_response
from utils.auth import login_required, admin_required
from services.category_service import CategoryService
from models import db

logger = logging.getLogger(__name__)
categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('/', methods=['GET'])
@login_required
def get_categories():
    """
    Get all expense categories for the tenant.
    
    Returns:
        A standardized response with a list of categories
    """
    try:
        categories = CategoryService.get_all_categories()
        return standardize_response(success=True, data={'categories': categories})
    except Exception as e:
        logger.error(f"Error retrieving categories: {str(e)}")
        return standardize_response(success=False, message=f"Error retrieving categories: {str(e)}", status_code=500)

@categories_bp.route('/', methods=['POST'])
@admin_required
def create_category():
    """
    Create a new expense category.
    
    Returns:
        A standardized response with the created category data
    """
    try:
        result = CategoryService.create_category(request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Category created successfully',
            status_code=201
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error creating category: {str(e)}",
            status_code=500
        )

@categories_bp.route('/<int:category_id>', methods=['GET'])
@login_required
def get_category(category_id):
    """
    Get a specific category by ID.
    
    Args:
        category_id: The ID of the category to retrieve
        
    Returns:
        A standardized response with the category data
    """
    try:
        category = CategoryService.get_category_by_id(category_id)
        if category:
            return standardize_response(success=True, data=category)
        else:
            return standardize_response(
                success=False,
                message=f"Category with ID {category_id} not found",
                status_code=404
            )
    except Exception as e:
        logger.error(f"Error retrieving category {category_id}: {str(e)}")
        return standardize_response(
            success=False,
            message=f"Error retrieving category: {str(e)}",
            status_code=500
        )

@categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    """
    Update an existing category.
    
    Args:
        category_id: The ID of the category to update
        
    Returns:
        A standardized response with the updated category data
    """
    try:
        result = CategoryService.update_category(category_id, request.json)
        return standardize_response(
            success=True,
            data=result,
            message='Category updated successfully'
        )
    except ValidationError as e:
        return standardize_response(
            success=False,
            message=f"Validation error: {str(e.messages)}",
            status_code=400
        )
    except Exception as e:
        logger.error(f"Error updating category {category_id}: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error updating category: {str(e)}",
            status_code=500
        )

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    """
    Delete a category.
    
    Args:
        category_id: The ID of the category to delete
        
    Returns:
        A standardized response with a success message
    """
    try:
        CategoryService.delete_category(category_id)
        return standardize_response(
            success=True,
            message='Category deleted successfully'
        )
    except Exception as e:
        logger.error(f"Error deleting category {category_id}: {str(e)}")
        db.session.rollback()
        return standardize_response(
            success=False,
            message=f"Error deleting category: {str(e)}",
            status_code=500
        )