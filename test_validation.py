#!/usr/bin/env python3
"""
Test script for validation utility functions.
"""

from utils.validation_utils import (
    validate_gstin,
    validate_pan,
    validate_indian_phone,
    validate_ifsc,
    validate_account_number,
    validate_upi_id,
    validate_gst_business_type
)

# Test data
test_cases = {
    "gstin": [
        # Valid GST numbers
        {"input": "27AAPFU0939F1ZV", "expected": True},
        {"input": "29AADCB2230M1ZP", "expected": True},
        {"input": "06BZAHM6385P6Z2", "expected": True},
        # Invalid GST numbers
        {"input": "ABCDE12345F1Z0", "expected": False},  # Invalid state code
        {"input": "27AAPFU0939F1Z", "expected": False},   # Too short
        {"input": "", "expected": False},                 # Empty
    ],
    "pan": [
        # Valid PAN
        {"input": "ABCDE1234F", "expected": True},
        {"input": "AAPFU0939F", "expected": True},
        # Invalid PAN
        {"input": "ABC123456F", "expected": False},  # Invalid format
        {"input": "ABCDE1234", "expected": False},   # Too short
        {"input": "", "expected": False},            # Empty
    ],
    "indian_phone": [
        # Valid phone numbers
        {"input": "9876543210", "expected": True},
        {"input": "+91 9876543210", "expected": True},
        {"input": "987-654-3210", "expected": True},
        {"input": "987 654 3210", "expected": True},
        # Invalid phone numbers
        {"input": "987654321", "expected": False},    # Too short
        {"input": "5876543210", "expected": False},   # Invalid first digit
        {"input": "98765432A0", "expected": False},   # Contains non-digit
        {"input": "", "expected": False},             # Empty
    ],
    "ifsc": [
        # Valid IFSC codes
        {"input": "SBIN0123456", "expected": True},
        {"input": "HDFC0001234", "expected": True},
        {"input": "ICIC0001234", "expected": True},
        # Invalid IFSC codes
        {"input": "SBIN123456", "expected": False},   # Missing 0
        {"input": "SBIN01234", "expected": False},    # Too short
        {"input": "1BIN0123456", "expected": False},  # First char not letter
        {"input": "", "expected": False},             # Empty
    ],
    "account_number": [
        # Valid account numbers
        {"input": "123456789", "expected": True},
        {"input": "12345678901234567", "expected": True},
        {"input": "1234-5678-9012", "expected": True},
        # Invalid account numbers
        {"input": "12345678", "expected": False},     # Too short
        {"input": "1234567890123456789", "expected": False},  # Too long
        {"input": "12345A7890", "expected": False},   # Contains non-digit
        {"input": "", "expected": False},             # Empty
    ],
    "upi_id": [
        # Valid UPI IDs
        {"input": "johndoe@oksbi", "expected": True},
        {"input": "user.name@paytm", "expected": True},
        {"input": "9876543210@upi", "expected": True},
        {"input": "my-name@okicici", "expected": True},
        # Invalid UPI IDs
        {"input": "johndoe.oksbi", "expected": False},  # Missing @
        {"input": "@oksbi", "expected": False},         # Empty username
        {"input": "johndoe@", "expected": False},       # Empty provider
        {"input": "john doe@oksbi", "expected": False}, # Space in username
        {"input": "", "expected": False},               # Empty
    ]
}

# Test business type identification
business_type_cases = [
    {"input": "27AAACC1206D1ZM", "expected": "Company"},
    {"input": "29AADFH2967H1ZL", "expected": "Hindu Undivided Family"},
    {"input": "06AAACG9308G1ZX", "expected": "Government"},
    {"input": "27INVALID", "expected": "Unknown"},
]

def run_validation_tests():
    """Run validation tests and report results."""
    print("Running validation utility tests...\n")
    
    all_passed = True
    
    # Test validation functions
    for func_name, cases in test_cases.items():
        print(f"\nTesting {func_name} validation:")
        func = globals()[f"validate_{func_name}"]
        
        passed = 0
        for i, case in enumerate(cases):
            result = func(case["input"])
            passed_test = result == case["expected"]
            
            if passed_test:
                passed += 1
            else:
                all_passed = False
            
            status = "✓" if passed_test else "✗"
            print(f"  {status} Test {i+1}: '{case['input']}' -> Got: {result}, Expected: {case['expected']}")
        
        print(f"  {passed}/{len(cases)} tests passed")
    
    # Test business type identification
    print("\nTesting GST business type identification:")
    passed = 0
    for i, case in enumerate(business_type_cases):
        result = validate_gst_business_type(case["input"])
        passed_test = result == case["expected"]
        
        if passed_test:
            passed += 1
        else:
            all_passed = False
        
        status = "✓" if passed_test else "✗"
        print(f"  {status} Test {i+1}: '{case['input']}' -> Got: '{result}', Expected: '{case['expected']}'")
    
    print(f"  {passed}/{len(business_type_cases)} tests passed")
    
    print("\nOverall result:", "All tests passed!" if all_passed else "Some tests failed.")

if __name__ == "__main__":
    run_validation_tests()