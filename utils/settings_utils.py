"""
Utility functions for settings management.
"""
import logging
import traceback
from typing import Dict, Any, Optional, List, Union
from datetime import datetime
import sqlalchemy.exc
from flask import g, current_app, request

logger = logging.getLogger(__name__)

def get_tenant_id() -> int:
    """
    Get the current tenant ID from the Flask g object or request parameters.
    
    Returns:
        int: The tenant ID (defaults to 1 if not found)
    """
    # First try to get from the g object (set by middleware)
    tenant_id = getattr(g, 'tenant_id', None)
    
    # If not found, try to get from request parameters
    if tenant_id is None:
        tenant_id = request.args.get('tenant_id')
        if tenant_id is not None:
            try:
                tenant_id = int(tenant_id)
            except (ValueError, TypeError):
                tenant_id = None
    
    # Default to 1 if not found
    if tenant_id is None:
        tenant_id = 1
        
    return tenant_id

def safe_get(data: Dict[str, Any], key: str, default: Any = None) -> Any:
    """
    Safely get a value from a dictionary.
    
    Args:
        data: The dictionary to get the value from
        key: The key to get
        default: The default value to return if the key is not found
        
    Returns:
        The value if found, otherwise the default
    """
    if not data or key not in data:
        return default
    return data[key]

def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """
    Format a datetime object as an ISO string.
    
    Args:
        dt: The datetime object to format
        
    Returns:
        The formatted datetime string, or None if dt is None
    """
    if dt is None:
        return None
    return dt.isoformat()

def handle_database_error(exception: Exception, resource_name: str) -> Dict[str, Any]:
    """
    Handle database errors in a consistent way.
    
    Args:
        exception: The exception that was raised
        resource_name: The name of the resource being accessed
        
    Returns:
        A dictionary with error information
    """
    logger.error(f"Database error while accessing {resource_name}: {str(exception)}")
    logger.error(traceback.format_exc())
    
    if isinstance(exception, sqlalchemy.exc.IntegrityError):
        # Handle integrity errors (unique constraint violations, etc.)
        error_msg = str(exception)
        if "unique constraint" in error_msg.lower() or "duplicate key" in error_msg.lower():
            return {
                "code": "duplicate_error",
                "message": f"A {resource_name} with these details already exists"
            }
        elif "foreign key constraint" in error_msg.lower():
            return {
                "code": "reference_error",
                "message": f"The {resource_name} references a non-existent resource"
            }
        else:
            return {
                "code": "integrity_error",
                "message": f"Could not save {resource_name} due to data integrity constraints"
            }
    elif isinstance(exception, sqlalchemy.exc.OperationalError):
        # Handle operational errors (connection issues, etc.)
        return {
            "code": "database_error",
            "message": f"Database error occurred while processing {resource_name}"
        }
    else:
        # Handle other database errors
        return {
            "code": "error",
            "message": f"An error occurred while accessing {resource_name}"
        }