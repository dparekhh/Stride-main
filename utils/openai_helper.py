"""
OpenAI Helper - Stub Module

This module previously provided OpenAI-based text processing capabilities,
but all functionality has been removed. This stub maintains API compatibility
while returning empty/default values.
"""

import logging
from typing import Dict, Any, List, Optional, Union

logger = logging.getLogger(__name__)

def extract_invoice_data(text: str) -> Dict[str, Any]:
    """
    Stub for invoice data extraction that previously used OpenAI
    
    Args:
        text (str): The OCR-extracted text from an invoice
        
    Returns:
        dict: Empty structured invoice data
    """
    logger.info("OpenAI invoice data extraction requested but functionality removed")
    
    return {
        "vendor_name": "",
        "invoice_number": "",
        "amount": 0,
        "currency": "INR",
        "issue_date": None,
        "due_date": None,
        "gstin": "",
        "line_items": [],
        "category": "Miscellaneous"
    }


def categorize_expense(description: str, amount: Optional[float] = None) -> Dict[str, Any]:
    """
    Stub for expense categorization that previously used OpenAI
    
    Args:
        description (str): The description of the expense
        amount (float, optional): The amount of the expense
        
    Returns:
        dict: Default category information
    """
    logger.info("OpenAI expense categorization requested but functionality removed")
    
    return {
        "category": "Miscellaneous",
        "confidence": 0.0
    }


def analyze_spending_pattern(expenses_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Stub for spending pattern analysis that previously used OpenAI
    
    Args:
        expenses_data (list): List of expense data dictionaries
        
    Returns:
        dict: Empty analysis results
    """
    logger.info("OpenAI spending pattern analysis requested but functionality removed")
    
    return {
        "top_categories": [],
        "unusual_transactions": [],
        "saving_opportunities": [],
        "trends": []
    }


def extract_gst_information(text: str) -> Dict[str, Any]:
    """
    Stub for GST information extraction that previously used OpenAI
    
    Args:
        text (str): The OCR-extracted text from an invoice
        
    Returns:
        dict: Empty GST-related information
    """
    logger.info("OpenAI GST information extraction requested but functionality removed")
    
    return {
        "gstin": "",
        "place_of_supply": "",
        "invoice_type": "Regular",
        "hsn_codes": [],
        "cgst_amount": 0,
        "sgst_amount": 0,
        "igst_amount": 0,
        "tax_breakup": []
    }