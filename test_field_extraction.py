"""
Test script to verify the refactored field extraction functionality

This script tests the field extraction capabilities using sample test cases
for different document types.
"""

import logging
import os
import sys
from utils.document_ai.document_types import DocumentType
from utils.document_ai.field_extraction import (
    detect_document_type,
    extract_fields,
    extract_invoice_fields,
    extract_receipt_fields,
    extract_purchase_order_fields,
    extract_grn_fields,
    extract_expense_policy_fields
)

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_invoice_extraction():
    """Test invoice field extraction"""
    logger.info("Testing invoice field extraction...")
    
    # Sample invoice text
    invoice_text = """
    ABC ENTERPRISES PVT LTD
    123 Business Park, Mumbai 400001
    
    TAX INVOICE
    
    Invoice No: INV-2023-001
    Invoice Date: 15/03/2025
    Due Date: 14/04/2025
    
    GSTIN: 27AAACA1234B1Z5
    
    Bill To:
    XYZ Corporation
    456 Corporate Tower, Delhi 110001
    
    PO Reference: PO-2023-123
    
    Item Description   Qty   Unit Price   Amount
    ------------------------------------------------
    Product Model X    10    ₹5,000       ₹50,000
    Service Package A  1     ₹25,000      ₹25,000
    ------------------------------------------------
    
    Subtotal:                            ₹75,000
    CGST (9%):                           ₹6,750
    SGST (9%):                           ₹6,750
    ------------------------------------------------
    Total:                               ₹88,500
    """
    
    # Test document type detection
    doc_type = detect_document_type(invoice_text)
    assert doc_type == DocumentType.INVOICE, f"Expected INVOICE, got {doc_type}"
    logger.info(f"Document type detected: {doc_type}")
    
    # Test invoice field extraction
    result = extract_invoice_fields(invoice_text)
    logger.info(f"Extracted invoice fields: {result}")
    
    # Verify key fields
    assert result["invoice_number"] == "INV-2023-001", f"Expected INV-2023-001, got {result['invoice_number']}"
    assert "ABC ENTERPRISES" in result["vendor_name"].upper(), f"Vendor name not correctly extracted: {result['vendor_name']}"
    assert result["vendor_gstin"] == "27AAACA1234B1Z5", f"Expected 27AAACA1234B1Z5, got {result['vendor_gstin']}"
    assert result["po_number"] == "PO-2023-123", f"Expected PO-2023-123, got {result['po_number']}"
    assert abs(result["total_amount"] - 75000) < 1, f"Expected total amount near 75000, got {result['total_amount']}"
    
    # Test generic field extraction
    result_generic = extract_fields(invoice_text, DocumentType.INVOICE)
    logger.info(f"Generic extraction result: {result_generic}")
    assert result_generic["invoice_number"] == result["invoice_number"], "Generic extraction mismatch"
    
    logger.info("Invoice extraction test completed successfully")

def test_receipt_extraction():
    """Test receipt field extraction"""
    logger.info("Testing receipt field extraction...")
    
    # Sample receipt text
    receipt_text = """
    SUPER MARKET
    123 Retail Street, Bangalore
    
    RECEIPT
    
    Date: 15/03/2025
    Time: 14:30 PM
    Receipt #: RCPT-5678
    
    Item                 Qty   Price     Amount
    ---------------------------------------
    Fresh Apples         2kg   ₹150/kg   ₹300
    Milk 1L              2     ₹60       ₹120
    Bread                1     ₹40       ₹40
    ---------------------------------------
    
    Subtotal:                        ₹460
    GST (5%):                        ₹23
    ---------------------------------------
    Total:                           ₹483
    
    Paid by: Card
    Thank you for shopping with us!
    """
    
    # Test document type detection
    doc_type = detect_document_type(receipt_text)
    assert doc_type == DocumentType.RECEIPT, f"Expected RECEIPT, got {doc_type}"
    logger.info(f"Document type detected: {doc_type}")
    
    # Test receipt field extraction
    result = extract_receipt_fields(receipt_text)
    logger.info(f"Extracted receipt fields: {result}")
    
    # Verify key fields
    assert "SUPER MARKET" in result["vendor_name"].upper(), f"Vendor name not correctly extracted: {result['vendor_name']}"
    assert abs(result["total_amount"] - 483) < 1, f"Expected total amount near 483, got {result['total_amount']}"
    assert abs(result["tax_amount"] - 23) < 1, f"Expected tax amount near 23, got {result['tax_amount']}"
    
    logger.info("Receipt extraction test completed successfully")

def test_purchase_order_extraction():
    """Test purchase order field extraction"""
    logger.info("Testing purchase order field extraction...")
    
    # Sample purchase order text
    po_text = """
    PURCHASE ORDER
    
    PO Number: PO-2023-456
    Date: 10/03/2025
    
    Vendor:
    Best Suppliers Ltd.
    789 Vendor Avenue, Chennai 600001
    
    Ship To:
    Main Warehouse
    321 Storage Road, Mumbai 400018
    
    Item Description         Qty   Unit Price   Amount
    ------------------------------------------------
    Raw Materials - Steel    100   ₹1,200       ₹120,000
    Equipment - Type B       5     ₹20,000      ₹100,000
    ------------------------------------------------
    
    Total:                               ₹220,000
    
    Terms: Net 30
    """
    
    # Test document type detection
    doc_type = detect_document_type(po_text)
    assert doc_type == DocumentType.PURCHASE_ORDER, f"Expected PURCHASE_ORDER, got {doc_type}"
    logger.info(f"Document type detected: {doc_type}")
    
    # Test purchase order field extraction
    result = extract_purchase_order_fields(po_text)
    logger.info(f"Extracted purchase order fields: {result}")
    
    # Verify key fields
    assert result["po_number"] == "PO-2023-456", f"Expected PO-2023-456, got {result['po_number']}"
    assert "BEST SUPPLIERS" in result["vendor_name"].upper(), f"Vendor name not correctly extracted: {result['vendor_name']}"
    assert abs(result["total_amount"] - 220000) < 1, f"Expected total amount near 220000, got {result['total_amount']}"
    assert "MUMBAI" in result["shipping_address"].upper(), f"Shipping address not correctly extracted: {result['shipping_address']}"
    
    logger.info("Purchase order extraction test completed successfully")

def test_grn_extraction():
    """Test goods receipt note field extraction"""
    logger.info("Testing GRN field extraction...")
    
    # Sample GRN text
    grn_text = """
    GOODS RECEIPT NOTE
    
    GRN Number: GRN-2023-789
    Date: 12/03/2025
    
    PO Reference: PO-2023-456
    
    Received From:
    Best Suppliers Ltd.
    
    Received By: John Doe
    
    Item Description         Qty Ordered   Qty Received
    ------------------------------------------------
    Raw Materials - Steel    100           98
    Equipment - Type B       5             5
    ------------------------------------------------
    
    Total Quantity Received: 103
    
    Remarks: Two steel sheets damaged in transit
    """
    
    # Test document type detection
    doc_type = detect_document_type(grn_text)
    assert doc_type == DocumentType.GRN, f"Expected GRN, got {doc_type}"
    logger.info(f"Document type detected: {doc_type}")
    
    # Test GRN field extraction
    result = extract_grn_fields(grn_text)
    logger.info(f"Extracted GRN fields: {result}")
    
    # Verify key fields
    assert result["grn_number"] == "GRN-2023-789", f"Expected GRN-2023-789, got {result['grn_number']}"
    assert result["po_number"] == "PO-2023-456", f"Expected PO-2023-456, got {result['po_number']}"
    assert "BEST SUPPLIERS" in result["vendor_name"].upper(), f"Vendor name not correctly extracted: {result['vendor_name']}"
    assert result["total_quantity"] == 103, f"Expected total quantity 103, got {result['total_quantity']}"
    
    logger.info("GRN extraction test completed successfully")

def test_expense_policy_extraction():
    """Test expense policy field extraction"""
    logger.info("Testing expense policy field extraction...")
    
    # Sample expense policy text
    policy_text = """
    CORPORATE EXPENSE POLICY
    
    Effective Date: 01/01/2025
    
    1. TRAVEL EXPENSES
    
    1.1 Air Travel
    • Economy class for domestic flights
    • Business class allowed for flights over 6 hours
    • Maximum limit: Rs. 50,000 for international flights
    
    1.2 Hotel Accommodation
    • 4-star hotels or equivalent
    • Maximum limit: Rs. 8,000 per night in metro cities
    • Maximum limit: Rs. 5,000 per night in other cities
    
    2. MEAL EXPENSES
    
    • Breakfast: Up to Rs. 500 per day
    • Lunch: Up to Rs. 800 per day
    • Dinner: Up to Rs. 1,200 per day
    
    3. TRANSPORTATION
    
    • Use of company cab services preferred
    • Taxi/Uber/Ola: Up to Rs. 2,000 per day
    
    4. NON-REIMBURSABLE EXPENSES
    
    • Personal entertainment
    • Alcoholic beverages
    • Fines or penalties
    • Spouse or family travel expenses
    
    5. APPROVAL REQUIREMENTS
    
    • Expenses above Rs. 10,000 require manager approval
    • Expenses above Rs. 50,000 require director approval
    • All international travel requires VP approval
    """
    
    # Test document type detection
    doc_type = detect_document_type(policy_text)
    assert doc_type == DocumentType.EXPENSE_POLICY, f"Expected EXPENSE_POLICY, got {doc_type}"
    logger.info(f"Document type detected: {doc_type}")
    
    # Test expense policy field extraction
    result = extract_expense_policy_fields(policy_text)
    logger.info(f"Extracted expense policy fields: {result}")
    
    # Verify key fields
    assert "CORPORATE EXPENSE POLICY" in result["title"].upper(), f"Title not correctly extracted: {result['title']}"
    assert len(result["expense_limits"]) > 0, "No expense limits extracted"
    assert len(result["prohibited_expenses"]) > 0, "No prohibited expenses extracted"
    
    if "travel" in result["expense_limits"]:
        assert result["expense_limits"]["travel"] > 10000, "Travel limit not correctly extracted"
    
    logger.info("Expense policy extraction test completed successfully")

def run_tests():
    """Run all tests"""
    try:
        test_invoice_extraction()
        test_receipt_extraction()
        test_purchase_order_extraction()
        test_grn_extraction()
        test_expense_policy_extraction()
        
        logger.info("All tests completed successfully!")
        return True
    except AssertionError as e:
        logger.error(f"Test failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)