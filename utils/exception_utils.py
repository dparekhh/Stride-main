"""
Exception utilities for the Stride platform.

This module provides custom exception classes and handling utilities
to standardize error management across the application.
"""
from typing import Dict, Any, Optional

class DataValidationError(ValueError):
    """
    Custom error class for data validation with extra data.
    
    Extends the built-in ValueError to include additional context
    about validation errors, such as field-specific error messages.
    """
    def __init__(self, message: str, extra_data: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.extra_data = extra_data