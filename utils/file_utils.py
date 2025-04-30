"""
File Utility Functions

This module provides utility functions for file operations, such as
file saving, validation, and handling.
"""

import os
import logging
from typing import List, Optional
from werkzeug.datastructures import FileStorage

# Configure logging
logger = logging.getLogger(__name__)

def allowed_file(filename: str, allowed_extensions: List[str]) -> bool:
    """
    Check if a file has an allowed extension
    
    Args:
        filename: Name of the file to check
        allowed_extensions: List of allowed file extensions (without dot)
        
    Returns:
        True if file has an allowed extension, False otherwise
    """
    if not filename:
        return False
        
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def create_directory_if_not_exists(directory_path: str) -> None:
    """
    Create a directory if it doesn't exist
    
    Args:
        directory_path: Path to the directory to create
    """
    if not os.path.exists(directory_path):
        try:
            os.makedirs(directory_path, exist_ok=True)
            logger.info(f"Created directory: {directory_path}")
        except Exception as e:
            logger.error(f"Error creating directory {directory_path}: {str(e)}")
            raise

def get_file_extension(filename: str) -> str:
    """
    Get the extension of a file
    
    Args:
        filename: Name of the file
        
    Returns:
        File extension (lowercase, without dot)
    """
    if not filename or '.' not in filename:
        return ""
        
    return filename.rsplit('.', 1)[1].lower()

def save_upload_file(file: FileStorage, destination_path: str) -> str:
    """
    Save an uploaded file to the specified destination
    
    Args:
        file: FileStorage object to save
        destination_path: Path where to save the file
        
    Returns:
        Path to the saved file
    """
    try:
        # Ensure the directory exists
        directory = os.path.dirname(destination_path)
        create_directory_if_not_exists(directory)
        
        # Save the file
        file.save(destination_path)
        logger.info(f"File saved to {destination_path}")
        
        return destination_path
    except Exception as e:
        logger.error(f"Error saving file to {destination_path}: {str(e)}")
        raise

def delete_file(file_path: str) -> bool:
    """
    Delete a file from the filesystem
    
    Args:
        file_path: Path to the file to delete
        
    Returns:
        True if file was deleted successfully, False otherwise
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"File deleted: {file_path}")
            return True
        else:
            logger.warning(f"File not found for deletion: {file_path}")
            return False
    except Exception as e:
        logger.error(f"Error deleting file {file_path}: {str(e)}")
        return False

def get_file_size(file_path: str) -> Optional[int]:
    """
    Get the size of a file in bytes
    
    Args:
        file_path: Path to the file
        
    Returns:
        Size of the file in bytes, or None if file doesn't exist
    """
    try:
        if os.path.exists(file_path):
            return os.path.getsize(file_path)
        else:
            logger.warning(f"File not found for size check: {file_path}")
            return None
    except Exception as e:
        logger.error(f"Error getting file size for {file_path}: {str(e)}")
        return None