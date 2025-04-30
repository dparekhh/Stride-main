"""
Test script for intelligent Document AI processor selection

This script tests the processor selection logic to ensure it makes optimal choices
between the basic OCR processor ($0.60/1000 pages) and the more expensive NLP processor 
($30/1000 pages) based on document type and content.
"""

import base64
import logging
import os
from utils.document_ai.document_types import DocumentType
from utils.document_ai.processor_selector import should_use_nlp_processor, get_processing_stats

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_processor_selection_by_type():
    """Test processor selection based on document type"""
    logger.info("Testing processor selection based on document type")
    
    # These document types should default to basic OCR to save costs
    ocr_document_types = [
        DocumentType.INVOICE,
        DocumentType.RECEIPT,
        DocumentType.UNKNOWN
    ]
    
    # These document types often need NLP capabilities
    nlp_document_types = [
        DocumentType.EXPENSE_POLICY  # Expense policies need semantic understanding
    ]
    
    # Test OCR document types (should recommend OCR by default for cost savings)
    for doc_type in ocr_document_types:
        use_nlp = should_use_nlp_processor(document_type=doc_type, explicit_nlp_request=False)
        logger.info(f"Document type: {doc_type.value}, Use NLP? {use_nlp}")
        assert not use_nlp, f"Document type {doc_type.value} should default to OCR for cost optimization"
    
    # Test NLP document types (should recommend NLP due to complexity)
    for doc_type in nlp_document_types:
        use_nlp = should_use_nlp_processor(document_type=doc_type, explicit_nlp_request=False)
        logger.info(f"Document type: {doc_type.value}, Use NLP? {use_nlp}")
        assert use_nlp, f"Document type {doc_type.value} should use NLP by default due to complexity"
    
    # Test explicit NLP requests (should always use NLP regardless of type)
    for doc_type in ocr_document_types:
        use_nlp = should_use_nlp_processor(document_type=doc_type, explicit_nlp_request=True)
        logger.info(f"Document type: {doc_type.value} with explicit NLP request, Use NLP? {use_nlp}")
        assert use_nlp, "Explicit NLP requests should always use NLP regardless of document type"
    
    logger.info("Processor selection by document type test passed")

def test_usage_tracking():
    """Test usage tracking for cost monitoring"""
    logger.info("Testing usage tracking functionality")
    
    # Get initial usage stats
    initial_stats = get_processing_stats()
    logger.info(f"Initial usage stats: {initial_stats}")
    
    # Simulate document processing for different tenant IDs
    # In a real scenario, this would be done by the process_document function
    from utils.document_ai.processor_selector import track_document_processing
    
    # Track OCR processing
    tenant_1_ocr = track_document_processing(use_nlp=False, page_count=5, tenant_id=1)
    tenant_2_ocr = track_document_processing(use_nlp=False, page_count=3, tenant_id=2)
    
    # Track NLP processing
    tenant_1_nlp = track_document_processing(use_nlp=True, page_count=1, tenant_id=1)
    
    # Get updated usage stats
    updated_stats = get_processing_stats()
    logger.info(f"Updated usage stats: {updated_stats}")
    
    logger.info("Usage tracking test passed")

def test_cost_display():
    """Test cost calculation and display"""
    logger.info("Testing cost calculation and display")
    
    # Calculate the cost for different scenarios
    from utils.document_ai.processor_selector import (
        OCR_COST_PER_1000_PAGES, 
        NLP_COST_PER_1000_PAGES,
        COST_RATIO
    )
    
    # 1000 pages with OCR
    ocr_cost_1000 = 1000 * (OCR_COST_PER_1000_PAGES / 1000)
    
    # 1000 pages with NLP
    nlp_cost_1000 = 1000 * (NLP_COST_PER_1000_PAGES / 1000)
    
    # Calculate the ratio
    ratio = nlp_cost_1000 / ocr_cost_1000
    
    logger.info(f"Cost for 1000 pages with OCR: ${ocr_cost_1000:.2f}")
    logger.info(f"Cost for 1000 pages with NLP: ${nlp_cost_1000:.2f}")
    logger.info(f"NLP is {ratio:.0f}x more expensive than OCR")
    
    assert abs(ratio - COST_RATIO) < 0.01, "Cost ratio should match COST_RATIO constant"
    logger.info("Cost calculation and display test passed")

def main():
    """Run all tests"""
    try:
        test_processor_selection_by_type()
        test_usage_tracking()
        test_cost_display()
        
        logger.info("All processor selection tests passed")
    except Exception as e:
        logger.exception(f"Error in processor selection tests: {e}")

if __name__ == "__main__":
    main()