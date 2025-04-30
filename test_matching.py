"""
Test script for document matching API endpoints
This script tests both 2-way and 3-way matching with NLP capabilities
"""
import requests
import os
import json
import sys
import base64
import argparse

def test_matching_api():
    """Test the document matching API endpoints"""
    # Use localhost for testing
    base_url = "http://localhost:3000/api"
    
    print("Testing document matching API (2-way and 3-way matching)...")
    
    # Test files (make sure these files exist)
    po_file = "sample_po.jpg"  # Sample purchase order
    invoice_file = "sample_invoice.jpg"  # Sample invoice
    grn_file = "sample_grn.jpg"  # Sample goods receipt note
    
    if not os.path.exists(po_file):
        print(f"Error: Test file {po_file} not found. Please provide a sample purchase order document.")
        return
        
    if not os.path.exists(invoice_file):
        print(f"Error: Test file {invoice_file} not found. Please provide a sample invoice document.")
        return
        
    # Test 2-way matching (PO and Invoice)
    print("\n=== Testing 2-way matching (PO and Invoice) ===")
    
    try:
        # Prepare the files for the request
        files = {
            'po': ('po.jpg', open(po_file, 'rb'), 'image/jpeg'),
            'invoice': ('invoice.jpg', open(invoice_file, 'rb'), 'image/jpeg')
        }
        
        # Make the request
        print("Sending request to /api/matching/check?type=two_way&useNLP=true...")
        response = requests.post(
            f"{base_url}/matching/check?type=two_way&useNLP=true",
            files=files
        )
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            print("2-way matching successful!")
            print(f"Match status: {result.get('matching_results', {}).get('match_status', 'Unknown')}")
            print(f"Summary: {result.get('summary', 'No summary provided')}")
            
            # Print discrepancies if any
            discrepancies = result.get('matching_results', {}).get('discrepancies', [])
            if discrepancies:
                print(f"\nFound {len(discrepancies)} discrepancies:")
                for i, discrepancy in enumerate(discrepancies):
                    print(f"  {i+1}. Field: {discrepancy.get('field')}")
                    print(f"     Item: {discrepancy.get('item')}")
                    print(f"     PO value: {discrepancy.get('po_value')}")
                    print(f"     Invoice value: {discrepancy.get('invoice_value')}")
                    print(f"     Difference: {discrepancy.get('difference')}")
            else:
                print("\nNo discrepancies found.")
                
            # Print unmatched items if any
            unmatched = result.get('matching_results', {}).get('unmatched_items', [])
            if unmatched:
                print(f"\nFound {len(unmatched)} unmatched items:")
                for i, item in enumerate(unmatched):
                    print(f"  {i+1}. Type: {item.get('type')}")
                    if 'po_item' in item:
                        print(f"     PO item: {item.get('po_item', {}).get('description')}")
                    if 'invoice_item' in item:
                        print(f"     Invoice item: {item.get('invoice_item', {}).get('description')}")
            else:
                print("\nAll items matched.")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    
    except Exception as e:
        print(f"Error testing 2-way matching: {str(e)}")
    
    # Test 3-way matching if GRN file exists (PO, Invoice, and GRN)
    if os.path.exists(grn_file):
        print("\n=== Testing 3-way matching (PO, Invoice, and GRN) ===")
        
        try:
            # Prepare the files for the request
            files = {
                'po': ('po.jpg', open(po_file, 'rb'), 'image/jpeg'),
                'invoice': ('invoice.jpg', open(invoice_file, 'rb'), 'image/jpeg'),
                'grn': ('grn.jpg', open(grn_file, 'rb'), 'image/jpeg')
            }
            
            # Make the request
            print("Sending request to /api/matching/check?type=three_way&useNLP=true...")
            response = requests.post(
                f"{base_url}/matching/check?type=three_way&useNLP=true",
                files=files
            )
            
            # Check response
            if response.status_code == 200:
                result = response.json()
                print("3-way matching successful!")
                print(f"Match status: {result.get('matching_results', {}).get('match_status', 'Unknown')}")
                print(f"Summary: {result.get('summary', 'No summary provided')}")
                
                # Print discrepancies if any
                discrepancies = result.get('matching_results', {}).get('discrepancies', [])
                if discrepancies:
                    print(f"\nFound {len(discrepancies)} discrepancies:")
                    for i, discrepancy in enumerate(discrepancies):
                        print(f"  {i+1}. Field: {discrepancy.get('field')}")
                        print(f"     Item: {discrepancy.get('item')}")
                        print(f"     PO value: {discrepancy.get('po_value')}")
                        print(f"     Invoice value: {discrepancy.get('invoice_value')}")
                        if 'grn_value' in discrepancy:
                            print(f"     GRN value: {discrepancy.get('grn_value')}")
                else:
                    print("\nNo discrepancies found.")
                    
                # Print unmatched items if any
                unmatched = result.get('matching_results', {}).get('unmatched_items', [])
                if unmatched:
                    print(f"\nFound {len(unmatched)} unmatched items:")
                    for i, item in enumerate(unmatched):
                        print(f"  {i+1}. PO item: {item.get('po_item', {}).get('description')}")
                        print(f"     In invoice: {item.get('in_invoice', False)}")
                        print(f"     In GRN: {item.get('in_grn', False)}")
                else:
                    print("\nAll items matched.")
            else:
                print(f"Error: {response.status_code} - {response.text}")
        
        except Exception as e:
            print(f"Error testing 3-way matching: {str(e)}")
    else:
        print("\nSkipping 3-way matching test as GRN file not found.")
        
    print("\nDocument matching API testing completed.")

if __name__ == "__main__":
    test_matching_api()