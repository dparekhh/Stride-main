"""
Test script for the enhanced invoice extraction functionality
This script tests both OCR text extraction and structured field extraction
"""
import os
import json
from utils.ocr_vision import extract_text_from_image, extract_invoice_fields, DocumentAIUsageTracker

def test_invoice_extraction():
    """Test invoice extraction with both OCR and structured field parsing"""
    print("\n=== Testing Invoice Extraction ===")
    
    # Use the sample invoice image
    with open('sample_invoice.jpg', 'rb') as f:
        image_content = f.read()
    
    # Step 1: Process with basic OCR
    print("\nStep 1: Basic OCR Processing")
    ocr_text = extract_text_from_image(image_content, use_nlp=False)
    
    if not ocr_text:
        print("OCR Text Extraction Failed!")
        return

    print(f"OCR Text Extraction Successful!")
    print(f"Text length: {len(ocr_text)} characters")
    print(f"Sample text: {ocr_text[:150]}...")
    
    # Step 2: Extract structured fields from OCR text
    print("\nStep 2: Structured Field Extraction")
    invoice_data = extract_invoice_fields(ocr_text)
    
    # Print the extracted invoice data in a readable format
    print("\nExtracted Invoice Data:")
    for key, value in invoice_data.items():
        if key != 'raw_text' and key != 'line_items':
            print(f"{key}: {value}")
    
    # Print line items separately for better readability
    if 'line_items' in invoice_data and invoice_data['line_items']:
        print("\nLine Items:")
        for i, item in enumerate(invoice_data['line_items'], 1):
            print(f"  Item {i}:")
            for k, v in item.items():
                print(f"    {k}: {v}")

    # Step 3: Try NLP-enhanced processing
    print("\nStep 3: NLP-Enhanced Processing")
    nlp_text = extract_text_from_image(image_content, use_nlp=True)
    
    if not nlp_text:
        print("NLP Text Extraction Failed!")
    else:
        print(f"NLP Text Extraction Successful!")
        print(f"Text length: {len(nlp_text)} characters")
        print(f"Sample text: {nlp_text[:150]}...")
        
        # Extract structured fields from NLP text
        nlp_invoice_data = extract_invoice_fields(nlp_text)
        
        # Compare the results
        print("\nComparison of OCR vs NLP extraction:")
        fields_to_compare = ['vendor_name', 'invoice_number', 'invoice_date', 'total_amount']
        for field in fields_to_compare:
            ocr_value = invoice_data.get(field, "Not extracted")
            nlp_value = nlp_invoice_data.get(field, "Not extracted")
            print(f"{field}:")
            print(f"  OCR: {ocr_value}")
            print(f"  NLP: {nlp_value}")
    
    # Get usage stats
    stats = DocumentAIUsageTracker.get_usage_stats()
    print("\nDocument AI Usage Stats:")
    print(json.dumps(stats, indent=2))

if __name__ == "__main__":
    test_invoice_extraction()