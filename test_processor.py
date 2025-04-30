"""
Test script for the Document AI processor module

This script tests the central processor module that orchestrates
document processing using both OCR and NLP capabilities.
"""

import os
import logging
import unittest
from unittest.mock import patch, MagicMock

from utils.document_ai.document_types import DocumentType
from utils.document_ai.processor import (
    process_document_image,
    process_document_image_with_nlp
)

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def read_test_file(file_path):
    """Read a test file for processing"""
    try:
        with open(file_path, 'rb') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return None


def test_ocr_processing():
    """Test basic OCR processing"""
    print("\n===== Testing OCR Document Processing =====")
    
    # Get sample invoice
    file_path = 'sample_invoice.jpg'
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    image_content = read_test_file(file_path)
    if not image_content:
        return False
    
    # Process with OCR
    result = process_document_image(
        image_content=image_content,
        document_type=DocumentType.INVOICE,
        tenant_id=1
    )
    
    # Print results
    print("OCR Processor Result:")
    print(f"Status: {result.get('status')}")
    
    if result.get('status') == 'success':
        print(f"Document Type: {result.get('document_type')}")
        print(f"Processing Mode: {result.get('processing_mode')}")
        extracted_data = result.get('extracted_data', {})
        print(f"Extracted Fields: {', '.join(extracted_data.keys())}")
        
        # Print a few key fields if available
        for field in ['invoice_number', 'total_amount', 'vendor_name']:
            if field in extracted_data:
                print(f"  {field}: {extracted_data[field]}")
        
        return True
    else:
        print(f"Error: {result.get('error')}")
        return False


def test_nlp_processing():
    """Test NLP-enhanced processing"""
    print("\n===== Testing NLP Document Processing =====")
    
    # Get sample invoice
    file_path = 'sample_invoice.jpg'
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    image_content = read_test_file(file_path)
    if not image_content:
        return False
    
    # Process with NLP enhancement
    result = process_document_image_with_nlp(
        image_content=image_content,
        document_type=DocumentType.INVOICE,
        tenant_id=1
    )
    
    # Print results
    print("NLP Processor Result:")
    print(f"Status: {result.get('status')}")
    
    if result.get('status') == 'success':
        print(f"Document Type: {result.get('document_type')}")
        print(f"Processing Mode: {result.get('processing_mode')}")
        extracted_data = result.get('extracted_data', {})
        print(f"Extracted Fields: {', '.join(extracted_data.keys())}")
        
        # Print a few key fields if available
        for field in ['invoice_number', 'total_amount', 'vendor_name']:
            if field in extracted_data:
                print(f"  {field}: {extracted_data[field]}")
        
        return True
    else:
        print(f"Error: {result.get('error')}")
        return False


def test_auto_detection():
    """Test automatic document type detection"""
    print("\n===== Testing Automatic Document Type Detection =====")
    
    # Get sample invoice
    file_path = 'sample_invoice.jpg'
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False
    
    image_content = read_test_file(file_path)
    if not image_content:
        return False
    
    # Process without specifying document type
    result = process_document_image(
        image_content=image_content,
        tenant_id=1
    )
    
    # Print results
    print("Auto-Detection Result:")
    print(f"Status: {result.get('status')}")
    
    if result.get('status') == 'success':
        print(f"Detected Document Type: {result.get('document_type')}")
        return True
    else:
        print(f"Error: {result.get('error')}")
        return False


def run_all_tests():
    """Run all tests"""
    success = []
    
    # Test OCR processing
    if test_ocr_processing():
        success.append("OCR Processing")
    
    # Test NLP processing
    if test_nlp_processing():
        success.append("NLP Processing")
    
    # Test auto detection
    if test_auto_detection():
        success.append("Document Type Auto-Detection")
    
    # Print summary
    print("\n===== Test Summary =====")
    print(f"Passed: {len(success)}/3")
    print(f"Passing tests: {', '.join(success)}")


if __name__ == '__main__':
    run_all_tests()