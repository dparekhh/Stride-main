"""Error handling utilities for the Stride platform.

This module provides centralized error handling functions and middleware
to ensure consistent error handling and responses across the application.
"""
import logging
from typing import Dict, Any, Optional, Callable
from flask import jsonify, request, Response
from marshmallow import ValidationError as MarshmallowValidationError
from werkzeug.exceptions import HTTPException
from utils.exception_utils import DataValidationError
from utils.response_utils import standardize_response

logger = logging.getLogger(__name__)


class ApplicationError(Exception):
    """Base class for application-specific errors."""
    
    def __init__(self, message: str, status_code: int = 500, extra_data: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.extra_data = extra_data or {}
        
    def log(self, logger=None):
        """Log this error with optional context data.
        
        Args:
            logger: Optional logger to use. If None, the root logger will be used.
        """
        log = logger or logging.getLogger()
        level = logging.ERROR if self.status_code >= 500 else logging.WARNING
        
        log.log(
            level,
            f"{self.__class__.__name__}: {self.message} (status_code={self.status_code})",
            extra={"extra_data": self.extra_data}
        )


class ValidationError(ApplicationError):
    """Error raised when data validation fails."""
    
    def __init__(self, message: str, errors: Dict[str, str]):
        super().__init__(message, status_code=400, extra_data={"errors": errors})
        self.errors = errors


class NotFoundError(ApplicationError):
    """Error raised when a requested resource is not found."""
    
    def __init__(self, resource_type: str, resource_id: Any):
        message = f"{resource_type} with ID {resource_id} not found"
        super().__init__(message, status_code=404)
        self.resource_type = resource_type
        self.resource_id = resource_id


class AuthorizationError(ApplicationError):
    """Error raised when a user lacks permission for an operation."""
    
    def __init__(self, message: str, extra_data: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=403, extra_data=extra_data)


def handle_validation_error(error: MarshmallowValidationError) -> Response:
    """
    Handle Marshmallow validation errors.
    
    Args:
        error: The MarshmallowValidationError that was raised
        
    Returns:
        A standardized error response
    """
    logger.warning(f"Validation error: {error.messages}")
    return standardize_response(
        message="Validation error",
        data={"errors": error.messages},
        success=False,
        status_code=400
    )


def handle_data_validation_error(error: DataValidationError) -> Response:
    """
    Handle custom DataValidationError.
    
    Args:
        error: The DataValidationError that was raised
        
    Returns:
        A standardized error response
    """
    logger.warning(f"Data validation error: {str(error)}")
    return standardize_response(
        message=str(error),
        data=error.extra_data,
        success=False,
        status_code=400
    )


def handle_value_error(error: ValueError) -> Response:
    """
    Handle ValueError exceptions.
    
    Args:
        error: The ValueError that was raised
        
    Returns:
        A standardized error response
    """
    logger.warning(f"Value error: {str(error)}")
    return standardize_response(
        message=str(error),
        success=False,
        status_code=400
    )


def handle_http_exception(error: HTTPException) -> Response:
    """
    Handle Werkzeug HTTP exceptions.
    
    Args:
        error: The HTTPException that was raised
        
    Returns:
        A standardized error response
    """
    logger.warning(f"HTTP exception: {error}")
    return standardize_response(
        message=error.description,
        success=False,
        status_code=error.code
    )


def handle_general_exception(error: Exception) -> Response:
    """
    Handle general exceptions.
    
    Args:
        error: The Exception that was raised
        
    Returns:
        A standardized error response
    """
    logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
    return standardize_response(
        message="An unexpected error occurred",
        success=False,
        status_code=500
    )


def register_error_handlers(app) -> None:
    """
    Register error handlers with the Flask app.
    
    Args:
        app: The Flask application instance
    """
    app.register_error_handler(MarshmallowValidationError, handle_validation_error)
    app.register_error_handler(ValidationError, lambda e: standardize_response(
        message=e.message,
        data={"errors": e.errors},
        success=False,
        status_code=400
    ))
    app.register_error_handler(NotFoundError, lambda e: standardize_response(
        message=e.message,
        success=False,
        status_code=404
    ))
    app.register_error_handler(AuthorizationError, lambda e: standardize_response(
        message=e.message,
        data=e.extra_data,
        success=False,
        status_code=403
    ))
    app.register_error_handler(ApplicationError, lambda e: standardize_response(
        message=e.message,
        data=e.extra_data,
        success=False,
        status_code=e.status_code
    ))
    app.register_error_handler(DataValidationError, handle_data_validation_error)
    app.register_error_handler(ValueError, handle_value_error)
    app.register_error_handler(HTTPException, handle_http_exception)
    app.register_error_handler(Exception, handle_general_exception)