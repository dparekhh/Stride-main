"""
NLP Utilities - Consolidated Stub Module

This module consolidates all NLP processing capabilities from the original codebase.
All functionality has been removed, but this stub maintains API compatibility.
"""

import logging
from typing import Dict, Any, List, Tuple, Optional

logger = logging.getLogger(__name__)

def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Stub for entity extraction (functionality removed)
    
    Args:
        text: Text to extract entities from
        
    Returns:
        Empty entity dictionary
    """
    logger.info("NLP entity extraction requested but functionality removed")
    return {
        "organizations": [],
        "persons": [],
        "locations": [],
        "dates": [],
        "amounts": []
    }

def classify_document(text: str) -> Tuple[str, float]:
    """
    Stub for document classification (functionality removed)
    
    Args:
        text: Text to classify
        
    Returns:
        Default classification with zero confidence
    """
    logger.info("Document classification requested but functionality removed")
    return ("unknown", 0.0)

def extract_line_items(text: str) -> List[Dict[str, Any]]:
    """
    Stub for line item extraction (functionality removed)
    
    Args:
        text: Text to extract line items from
        
    Returns:
        Empty list
    """
    logger.info("Line item extraction requested but functionality removed")
    return []

def categorize_expense(description: str) -> Tuple[str, float]:
    """
    Stub for expense categorization (functionality removed)
    
    Args:
        description: Description to categorize
        
    Returns:
        Default "uncategorized" with zero confidence
    """
    logger.info("Expense categorization requested but functionality removed")
    return ("uncategorized", 0.0)

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Stub for sentiment analysis (functionality removed)
    
    Args:
        text: Text to analyze
        
    Returns:
        Neutral sentiment with zero confidence
    """
    logger.info("Sentiment analysis requested but functionality removed")
    return {
        "sentiment": "neutral",
        "score": 0.0
    }

def summarize_text(text: str, max_length: int = 100) -> str:
    """
    Stub for text summarization (functionality removed)
    
    Args:
        text: Text to summarize
        max_length: Maximum summary length
        
    Returns:
        Empty string
    """
    logger.info("Text summarization requested but functionality removed")
    return ""

# Functions from nlp_enhancement.py
def enhance_extraction_with_nlp(
    extracted_data: Dict[str, Any], 
    document_type: str
) -> Dict[str, Any]:
    """
    Stub for NLP extraction enhancement (functionality removed)
    
    Args:
        extracted_data: Base data to enhance
        document_type: Type of document
        
    Returns:
        Unmodified input data
    """
    logger.info(f"NLP enhancement requested but functionality removed (document type: {document_type})")
    return extracted_data

def correct_field_values(field_values: Dict[str, Any]) -> Dict[str, Any]:
    """
    Stub for field value correction (functionality removed)
    
    Args:
        field_values: Field values to correct
        
    Returns:
        Unmodified input data
    """
    return field_values

def extract_line_item_descriptions(text: str) -> List[str]:
    """
    Stub for line item description extraction (functionality removed)
    
    Args:
        text: Text to extract from
        
    Returns:
        Empty list
    """
    return []

# This function intentionally has a different signature than the one above
# to maintain compatibility with both previous implementations
def categorize_expense_simple(description: str) -> Optional[str]:
    """
    Simplified stub for expense categorization (functionality removed)
    
    Args:
        description: Description to categorize
        
    Returns:
        None
    """
    return None