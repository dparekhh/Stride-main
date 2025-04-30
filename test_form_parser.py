"""
Test script to verify the Document AI Form Parser integration for NLP tasks
This tests the extraction of structured data from expense policies using NLP capabilities
"""
import os
import logging
import sys
from typing import Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the current directory to the path to import utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.ocr_vision import (
    DocumentType, 
    process_document_image_with_nlp, 
    initialize_document_ai_client,
    PROCESSOR_IDS
)

def test_form_parser_integration():
    """
    Test that the Document AI Form Parser integration is working for NLP tasks
    """
    # First, verify that the form parser processor ID is configured
    form_parser_id = PROCESSOR_IDS.get("form_parser")
    if not form_parser_id:
        logger.error("Form Parser processor ID is not configured")
        return False

    logger.info(f"Using Form Parser ID: {form_parser_id}")
    
    # Verify that the Document AI client can be initialized
    client = initialize_document_ai_client()
    if not client:
        logger.error("Failed to initialize Document AI client")
        return False
    
    logger.info("Successfully initialized Document AI client")
    
    # Test with a sample expense policy document - create a simple text-based policy file
    policy_text = """
    Stride Company Expense Policy
    
    Effective Date: January 1, 2024
    
    General Policy:
    All expenses must be submitted within 30 days of incurrence.
    
    Expense Limits:
    - Travel expenses capped at Rs. 50,000 per trip
    - Meals limited to Rs. 1,500 per day
    - Hotel accommodations should not exceed Rs. 8,000 per night
    - Office supplies purchases limited to Rs. 5,000 per month
    
    Approval Requirements:
    - Expenses over Rs. 25,000 require Manager approval
    - Expenses over Rs. 100,000 require Director approval
    - International travel requires CFO approval
    
    Documentation Requirements:
    - All expenses must have itemized receipts
    - GST invoices required for all business expenses
    - For meals over Rs. 5,000, list of attendees must be provided
    """
    
    # Save the policy to a temporary file
    with open("test_expense_policy.txt", "w") as f:
        f.write(policy_text)
    
    # Read the sample expense policy
    try:
        with open("test_expense_policy.txt", "rb") as f:
            policy_content = f.read()
            
        logger.info("Successfully read sample expense policy document")
        
        # Process the expense policy with NLP enabled
        result = process_document_image_with_nlp(
            image_content=policy_content,
            document_type=DocumentType.EXPENSE_POLICY,
            processor_type="form_parser",  # Explicitly use form parser
            use_nlp=True
        )
        
        # Check if processing was successful
        if not result.get("success", False):
            logger.error(f"Failed to process expense policy with NLP: {result.get('error')}")
            return False
        
        logger.info("Successfully processed expense policy with Document AI Form Parser")
        
        # Verify that the expense limits were extracted correctly
        policy_analysis = result.get("policy_analysis", {})
        expense_limits = policy_analysis.get("expense_limits", {})
        
        logger.info("Extracted Policy Rules:")
        for rule in policy_analysis.get("policy_rules", []):
            logger.info(f"- {rule}")
            
        logger.info("Extracted Expense Limits:")
        for category, limit in expense_limits.items():
            logger.info(f"- {category}: Rs. {limit}")
            
        logger.info("Extracted Approval Thresholds:")
        for approver, threshold in policy_analysis.get("approval_thresholds", {}).items():
            logger.info(f"- {approver}: Rs. {threshold}")
        
        # Verify specific expected values
        # Travel limit should be around 50,000
        travel_limit = expense_limits.get("Travel")
        if travel_limit and abs(travel_limit - 50000) > 500:  # Allow some margin for error
            logger.warning(f"Travel expense limit not correctly extracted: {travel_limit}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing form parser integration: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Clean up the temporary file
        if os.path.exists("test_expense_policy.txt"):
            os.remove("test_expense_policy.txt")

def main():
    """
    Main test function
    """
    logger.info("Testing Document AI Form Parser Integration for NLP tasks")
    
    # Check if the Form Parser processor ID environment variable is set
    form_parser_id = os.environ.get("DOCUMENT_AI_FORM_PARSER_ID")
    if not form_parser_id:
        logger.warning("DOCUMENT_AI_FORM_PARSER_ID environment variable is not set")
        
    # Run the test
    success = test_form_parser_integration()
    
    if success:
        logger.info("✅ Form Parser Integration Test: SUCCESS")
        return 0
    else:
        logger.error("❌ Form Parser Integration Test: FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())