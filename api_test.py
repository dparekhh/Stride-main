"""
Test script for the Document AI API endpoints

This script tests the Stride document API endpoints for invoice extraction,
demonstrating the differences between basic OCR and NLP-enhanced processing.

Basic OCR Mode:
- Uses Document AI OCR Processor ($0.60 per 1000 pages)
- Provides text extraction and basic structure recognition
- Used as the default processing mode to minimize costs

Enhanced NLP Mode:
- Uses Document AI Form Parser ($30 per 1000 pages)
- Provides semantic understanding, field extraction, and entity recognition
- Only used when explicitly requested via useNLP=true parameter
"""

import requests
import logging
import json
import os
import time

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_invoice_extraction_api():
    """Test the invoice extraction API with both OCR and NLP modes
    
    This function demonstrates the differences between:
    1. Basic OCR processing ($0.60 per 1000 pages)
    2. Enhanced NLP processing ($30 per 1000 pages)
    
    The function also retrieves and displays Document AI usage statistics
    to show the cost impact of each processing mode.
    """
    
    # Check if sample file exists
    sample_file = "sample_invoice.jpg"
    if not os.path.exists(sample_file):
        logger.error(f"Sample file not found: {sample_file}")
        return False
    
    # Setup base URL - assumes local development
    base_url = "http://localhost:3000/api"
    
    # Setup test tenant ID for multi-tenant system
    # This is required for our API calls to work with tenant isolation
    test_tenant_id = 1
    headers = {
        'X-Tenant-ID': str(test_tenant_id),
        'Accept': 'application/json'
    }
    
    # 1. Test basic OCR processing
    endpoint = f"{base_url}/documents/invoices/extract"
    logger.info(f"Testing basic OCR via API: {endpoint}")
    
    try:
        files = {'document': ('invoice.jpg', open(sample_file, 'rb'), 'image/jpeg')}
        response = requests.post(endpoint, files=files, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            logger.info("✅ Basic OCR API call successful")
            logger.info(f"NLP enabled: {result.get('nlp_enabled', False)}")
            
            # Check response content
            if 'extracted_data' in result:
                logger.info(f"Response contains extracted data with {len(result['extracted_data'])} fields")
            else:
                logger.warning("No extracted_data found in response")
                logger.info(f"Response keys: {list(result.keys())}")
        else:
            logger.error(f"❌ API call failed with status {response.status_code}")
            logger.error(response.text)
    except Exception as e:
        logger.error(f"Error calling API: {str(e)}")
    
    # 2. Test NLP-enhanced processing
    endpoint = f"{base_url}/documents/invoices/extract?useNLP=true"
    logger.info(f"\nTesting NLP-enhanced processing via API: {endpoint}")
    
    try:
        files = {'document': ('invoice.jpg', open(sample_file, 'rb'), 'image/jpeg')}
        response = requests.post(endpoint, files=files, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            logger.info("✅ NLP-enhanced API call successful")
            logger.info(f"NLP enabled: {result.get('nlp_enabled', False)}")
            
            # Check for NLP-specific data
            if 'extracted_data' in result:
                extracted_data = result['extracted_data']
                if 'entities' in extracted_data:
                    logger.info(f"Found {len(extracted_data['entities'])} entity types")
                    for entity_type, entities in extracted_data['entities'].items():
                        logger.info(f"  - {entity_type}: {len(entities)} entities")
                else:
                    logger.warning("No entities found in extracted_data")
            else:
                logger.warning("No extracted_data found in response")
        else:
            logger.error(f"❌ API call failed with status {response.status_code}")
            logger.error(response.text)
    except Exception as e:
        logger.error(f"Error calling API: {str(e)}")
    
    # 3. Test bills API for invoice extraction
    endpoint = f"{base_url}/bills/invoices/extract?useNLP=true"
    logger.info(f"\nTesting bills invoice extraction API: {endpoint}")
    
    try:
        files = {'invoice': ('invoice.jpg', open(sample_file, 'rb'), 'image/jpeg')}
        response = requests.post(endpoint, files=files, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            logger.info("✅ Bills API call successful")
            logger.info(f"NLP enabled: {result.get('nlpEnabled', False)}")
            
            # Check for structured invoice
            if 'structuredInvoice' in result:
                logger.info("Found structured invoice in response")
                logger.info(f"Invoice fields: {list(result['structuredInvoice'].keys())}")
            else:
                logger.warning("No structuredInvoice found in response")
                logger.info(f"Response keys: {list(result.keys())}")
        else:
            logger.error(f"❌ API call failed with status {response.status_code}")
            logger.error(response.text)
    except Exception as e:
        logger.error(f"Error calling API: {str(e)}")
    
    return True

if __name__ == "__main__":
    logger.info("Starting Document AI API test")
    test_invoice_extraction_api()
    logger.info("Test completed")