import os
import json
import logging
import re
from utils.document_ai import process_image
from utils.document_ai.document_types import DocumentType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def manual_extract_from_text(text):
    """Manually extract fields from OCR text for comparison with field extraction logic"""
    expected_fields = {
        "vendor_name": "Ace Mobile Manufacturer Pvt Ltd",
        "vendor_gstin": "09AABCS1429B1ZS",
        "invoice_number": "ACMPL/01/2019-20",
        "invoice_date": "18-Apr-2019",  # The date format in the sample invoice
        "payment_terms": "Please make payment within 10 days",
        "buyer_name": "The Mobile Planet",
        "buyer_gstin": "09AAGCA1654H1ZQ"
    }
    
    # Print if these fields appear in the text
    for field, expected_value in expected_fields.items():
        if expected_value in text:
            logger.info(f"Text contains {field}: '{expected_value}'")
        else:
            logger.warning(f"Text DOES NOT contain {field}: '{expected_value}'")
            # Check if a partial match exists
            if field == "vendor_name" and "Ace Mobile" in text:
                logger.info("Text contains partial vendor name: 'Ace Mobile'")
            elif field == "vendor_gstin" and "09AABCS" in text:
                logger.info("Text contains partial GSTIN: '09AABCS'")
    
    # Try to detect fields with regex patterns
    # Vendor GSTIN
    gstin_pattern = r'GSTIN/UIN\s*:\s*([0-9A-Z]{15})'
    match = re.search(gstin_pattern, text)
    if match:
        logger.info(f"Regex found GSTIN: {match.group(1)}")
    
    # Invoice Number
    invoice_pattern = r'Invoice No\..*?([A-Za-z0-9/-]+)'
    match = re.search(invoice_pattern, text)
    if match:
        logger.info(f"Regex found Invoice Number: {match.group(1)}")
    
    # Date
    date_pattern = r'Dated.*?(\d{1,2}-[A-Za-z]+-\d{4})'
    match = re.search(date_pattern, text)
    if match:
        logger.info(f"Regex found Date: {match.group(1)}")
    
    # Check for total amount
    total_pattern = r'Total.*?(\d{1,2},\d{2},\d{3}\.\d{2})'
    match = re.search(total_pattern, text)
    if match:
        logger.info(f"Regex found Total Amount: {match.group(1)}")
    
    return expected_fields

def test_extraction_patterns():
    # Process our test invoice
    test_invoice = "attached_assets/credit-terms-invoice.jpg"
    
    if not os.path.exists(test_invoice):
        logger.error(f"Test invoice file not found: {test_invoice}")
        return
    
    # Read the file
    with open(test_invoice, "rb") as f:
        file_content = f.read()
    
    # Process with OCR
    ocr_result = process_image(
        file_content,
        use_nlp=False,
        document_type=DocumentType.INVOICE
    )
    
    if not ocr_result or 'text' not in ocr_result:
        logger.error("OCR failed or returned no text")
        return
    
    # Get the extracted text
    extracted_text = ocr_result['text']
    
    # Log the raw text for inspection
    logger.info(f"Raw extracted text (first 500 chars):\n{extracted_text[:500]}...")
    
    # Get the expected fields
    expected = manual_extract_from_text(extracted_text)
    
    # Get what our field extraction logic found
    extracted_data = ocr_result.get('extracted_data', {})
    
    # Compare expected vs actual
    logger.info("\nField extraction accuracy:")
    for field, expected_value in expected.items():
        if field in extracted_data:
            actual_value = extracted_data[field]
            if actual_value and expected_value in actual_value:
                logger.info(f"✅ {field}: Extracted '{actual_value}' (Expected '{expected_value}')")
            else:
                logger.warning(f"❌ {field}: Extracted '{actual_value}' (Expected '{expected_value}')")
        else:
            logger.warning(f"❌ {field}: Not extracted (Expected '{expected_value}')")

if __name__ == "__main__":
    test_extraction_patterns()
