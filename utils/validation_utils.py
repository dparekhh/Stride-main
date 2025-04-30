"""
Utility functions for data validation.
"""
import logging
import os
from typing import List, Dict, Any, Optional, Union, Set

logger = logging.getLogger(__name__)

def validate_file_type(filename: str, allowed_extensions: Union[List[str], Set[str]]) -> bool:
    """
    Validate that a file has an allowed extension.
    
    Args:
        filename: The name of the file to validate
        allowed_extensions: A list or set of allowed extensions (without the dot)
        
    Returns:
        True if the file has an allowed extension, False otherwise
    """
    if not filename:
        return False
    
    extension = os.path.splitext(filename)[1][1:].lower()
    return extension in allowed_extensions