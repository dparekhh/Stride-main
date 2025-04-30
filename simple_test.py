"""
Simplified test script for Document AI OCR and NLP capabilities
"""

import os
import logging
from utils.ocr_vision import process_full_document_image, DocumentType

logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_document_processing():
    """Test basic document processing with both OCR and NLP modes"""
    
    # Check if sample file exists
    sample_file = "sample_invoice.jpg"
    if not os.path.exists(sample_file):
        logger.error(f"Sample file not found: {sample_file}")
        return False
    
    # Read sample file
    with open(sample_file, "rb") as f:
        image_content = f.read()
    
    # Process with basic OCR
    logger.info("Testing basic OCR processing (useNLP=False)")
    try:
        result = process_full_document_image(
            image_content=image_content,
            document_type=DocumentType.INVOICE,
            use_nlp=False
        )
        if result.get("success"):
            logger.info("✅ Basic OCR processing successful")
            logger.info(f"NLP enabled flag: {result.get('nlp_enabled', False)}")
        else:
            logger.error(f"❌ Basic OCR processing failed: {result.get('error')}")
    except Exception as e:
        logger.error(f"Error during basic OCR processing: {str(e)}")
    
    # Process with NLP
    logger.info("\nTesting NLP-enhanced processing (useNLP=True)")
    try:
        result = process_full_document_image(
            image_content=image_content,
            document_type=DocumentType.INVOICE,
            use_nlp=True
        )
        if result.get("success"):
            logger.info("✅ NLP-enhanced processing successful")
            logger.info(f"NLP enabled flag: {result.get('nlp_enabled', False)}")
            
            # Check for entities and other NLP-specific data
            if "entities" in result and result["entities"]:
                logger.info(f"Found {len(result['entities'])} entity types")
            else:
                logger.warning("No entities found in NLP result")
        else:
            logger.error(f"❌ NLP-enhanced processing failed: {result.get('error')}")
    except Exception as e:
        logger.error(f"Error during NLP-enhanced processing: {str(e)}")
    
    return True

if __name__ == "__main__":
    logger.info("Starting simplified Document AI integration test")
    test_document_processing()
    logger.info("Test completed")