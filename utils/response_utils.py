"""
Utility functions for standardizing API responses.
"""
import logging
from typing import Dict, Any, List, Optional, Union, Tuple
from flask import jsonify, make_response

logger = logging.getLogger(__name__)

def standardize_response(
    success: bool = True,
    message: Optional[str] = None,
    data: Optional[Union[Dict[str, Any], List[Any]]] = None,
    status_code: int = 200,
    error_code: Optional[str] = None
) -> Any:
    """
    Create a standardized API response.
    
    Args:
        success: Whether the request was successful
        message: A message to include in the response
        data: The data to include in the response
        status_code: The HTTP status code for the response
        error_code: An optional error code for error responses
        
    Returns:
        A Flask response object with the standardized response
    """
    response = {
        'success': success
    }
    
    if data is not None:
        response['data'] = data
        
    if message is not None:
        response['message'] = message
    
    if not success and not message:
        response['message'] = 'An error occurred'
    
    if error_code is not None:
        response['error_code'] = error_code
        
    return make_response(jsonify(response), status_code)

# Compatibility functions for new style of response handling used in bills_new.py

def create_success_response(
    data: Optional[Dict[str, Any]] = None,
    message: Optional[str] = None,
    status_code: int = 200
) -> Any:
    """
    Create a standardized successful API response.
    This is a compatibility function for the new response style.
    
    Args:
        data: The data to include in the response
        message: A message to include in the response
        status_code: The HTTP status code for the response
        
    Returns:
        A standardized response using the existing format
    """
    return standardize_response(
        success=True,
        message=message,
        data=data,
        status_code=status_code
    )

def create_error_response(
    message: str,
    errors: Optional[Dict[str, Any]] = None,
    status_code: int = 400
) -> Any:
    """
    Create a standardized error API response.
    This is a compatibility function for the new response style.
    
    Args:
        message: The error message
        errors: Detailed errors dictionary
        status_code: The HTTP status code for the response
        
    Returns:
        A standardized error response using the existing format
    """
    error_data = {}
    if errors:
        error_data['errors'] = errors
        
    return standardize_response(
        success=False,
        message=message,
        data=error_data,
        status_code=status_code
    )

def format_pagination_response(
    items: List[Dict[str, Any]],
    total: int,
    page: int = 1,
    per_page: int = 25
) -> Dict[str, Any]:
    """
    Format a paginated response.
    This is a compatibility function for the new response style.
    
    Args:
        items: The list of items for the current page
        total: The total number of items across all pages
        page: The current page number
        per_page: The number of items per page
        
    Returns:
        A dictionary structured for pagination
    """
    total_pages = (total + per_page - 1) // per_page if per_page > 0 else 0
    
    return {
        'data': items,
        'pagination': {
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }