"""
Script to test OCR and OCR+NLP across all use cases with PDF documents
This script tests:
1. OCR with the OCR Processor for all document types
2. OCR+NLP for policy compliance checking
3. OCR+NLP for 2-way and 3-way document matching
4. Multi-tenant isolation
"""

import os
import requests
import json
import logging
import subprocess
from test_document_ai import (
    create_invoice_pdf,
    create_receipt_pdf, 
    create_po_pdf,
    create_grn_pdf,
    create_policy_pdf
)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Base URL for API
BASE_URL = "http://localhost:3000/api"

def create_test_documents():
    """Create test PDF documents with the required content"""
    logger.info("Creating test PDF documents...")
    
    # Ensure test directory exists
    os.makedirs('test_pdfs', exist_ok=True)
    
    # Create invoice PDF
    create_invoice_pdf('test_pdfs/invoice.pdf')
    
    # Create receipt PDF
    create_receipt_pdf('test_pdfs/receipt.pdf')
    
    # Create purchase order PDF
    create_po_pdf('test_pdfs/po.pdf')
    
    # Create goods receipt note PDF
    create_grn_pdf('test_pdfs/grn.pdf')
    
    # Create expense policy PDF
    create_policy_pdf('test_pdfs/policy.pdf')
    
    logger.info("Test PDF documents created successfully")
    return True

def test_ocr_basic():
    """Test basic OCR processing for all document types"""
    logger.info("Testing basic OCR processing...")
    
    # Document types and endpoints
    document_tests = [
        {
            'type': 'invoice',
            'file': 'test_pdfs/invoice.pdf',
            'endpoint': f"{BASE_URL}/invoices/extract",
            'expected_data': {
                'vendor_name': 'Samvik Marketing',
                'invoice_number': '501',
                'total_amount': 'Rs. 3420.00'
            }
        },
        {
            'type': 'receipt',
            'file': 'test_pdfs/receipt.pdf',
            'endpoint': f"{BASE_URL}/receipts/extract",
            'expected_data': {
                'merchant_name': 'ABC Store',
                'receipt_date': '2025-03-14',
                'total_amount': 'Rs. 750'
            }
        },
        {
            'type': 'po',
            'file': 'test_pdfs/po.pdf',
            'endpoint': f"{BASE_URL}/pos/extract",
            'expected_data': {
                'po_number': 'PO-2025-001',
                'line_items': [{'description': 'Laptop - 2 units'}]
            }
        },
        {
            'type': 'grn',
            'file': 'test_pdfs/grn.pdf',
            'endpoint': f"{BASE_URL}/grns/extract",
            'expected_data': {
                'grn_number': 'GRN-2025-001',
                'line_items': [{'quantity': '2 units'}]
            }
        },
        {
            'type': 'policy',
            'file': 'test_pdfs/policy.pdf',
            'endpoint': f"{BASE_URL}/policies/extract",
            'expected_data': {
                'policy_rules': [{'category': 'travel', 'amount': 'Rs. 500'}]
            }
        }
    ]
    
    # Tenants to test for isolation
    tenant_headers = [
        {'X-Tenant-ID': '1'},
        {'X-Tenant-ID': '2'}
    ]
    
    results = {}
    
    # Test each document type with each tenant
    for doc_test in document_tests:
        doc_type = doc_test['type']
        file_path = doc_test['file']
        endpoint = doc_test['endpoint']
        expected_data = doc_test['expected_data']
        
        logger.info(f"Testing OCR for {doc_type}...")
        
        for tenant_header in tenant_headers:
            tenant_id = tenant_header['X-Tenant-ID']
            logger.info(f"  With tenant {tenant_id}...")
            
            try:
                with open(file_path, 'rb') as f:
                    # Test with basic OCR (useNLP=false)
                    files = {'document': (os.path.basename(file_path), f, 'application/pdf')}
                    
                    response = requests.post(
                        f"{endpoint}?useNLP=false",
                        files=files,
                        headers=tenant_header
                    )
                    
                    # Log response
                    if response.status_code == 200:
                        result = response.json()
                        extracted_data = result.get('extracted_data', {})
                        
                        # Check if all expected fields are present and match
                        all_matched = True
                        missing_fields = []
                        mismatched_fields = []
                        
                        for field, expected_value in expected_data.items():
                            if field not in extracted_data:
                                all_matched = False
                                missing_fields.append(field)
                            elif field == 'line_items':
                                # For line items, check if the expected descriptions are present
                                line_items = extracted_data.get('line_items', [])
                                expected_items = expected_value
                                
                                for expected_item in expected_items:
                                    expected_desc = expected_item['description']
                                    found = False
                                    
                                    for item in line_items:
                                        if expected_desc.lower() in item.get('description', '').lower():
                                            found = True
                                            break
                                    
                                    if not found:
                                        all_matched = False
                                        mismatched_fields.append(f"line_item: {expected_desc}")
                            elif isinstance(expected_value, str) and expected_value.lower() not in str(extracted_data.get(field, '')).lower():
                                all_matched = False
                                mismatched_fields.append(field)
                        
                        # Log results
                        if all_matched:
                            logger.info(f"  ✅ OCR for {doc_type} with tenant {tenant_id} succeeded")
                            logger.info(f"     All expected fields matched")
                        else:
                            logger.warning(f"  ⚠️ OCR for {doc_type} with tenant {tenant_id} partially succeeded")
                            if missing_fields:
                                logger.warning(f"     Missing fields: {', '.join(missing_fields)}")
                            if mismatched_fields:
                                logger.warning(f"     Mismatched fields: {', '.join(mismatched_fields)}")
                        
                        # Store results
                        key = f"{doc_type}_tenant{tenant_id}"
                        results[key] = {
                            'success': response.status_code == 200,
                            'all_fields_matched': all_matched,
                            'missing_fields': missing_fields,
                            'mismatched_fields': mismatched_fields,
                            'extracted_data': extracted_data
                        }
                    else:
                        logger.error(f"  ❌ OCR for {doc_type} with tenant {tenant_id} failed")
                        logger.error(f"     Status code: {response.status_code}")
                        logger.error(f"     Response: {response.text}")
                        
                        # Store failure
                        key = f"{doc_type}_tenant{tenant_id}"
                        results[key] = {
                            'success': False,
                            'status_code': response.status_code,
                            'error': response.text
                        }
            except Exception as e:
                logger.error(f"  ❌ Exception during OCR for {doc_type} with tenant {tenant_id}: {str(e)}")
                
                # Store exception
                key = f"{doc_type}_tenant{tenant_id}"
                results[key] = {
                    'success': False,
                    'exception': str(e)
                }
    
    return results

def test_policy_compliance():
    """Test policy compliance checking with NLP"""
    logger.info("Testing policy compliance checking with NLP...")
    
    # Files to test
    receipt_file = 'test_pdfs/receipt.pdf'
    policy_file = 'test_pdfs/policy.pdf'
    
    # Endpoint
    endpoint = f"{BASE_URL}/policies/check"
    
    # Tenant to test
    tenant_header = {'X-Tenant-ID': '1'}
    
    results = {}
    
    try:
        with open(receipt_file, 'rb') as receipt_f, open(policy_file, 'rb') as policy_f:
            files = {
                'receipt': (os.path.basename(receipt_file), receipt_f, 'application/pdf'),
                'policy': (os.path.basename(policy_file), policy_f, 'application/pdf')
            }
            
            response = requests.post(
                endpoint,
                files=files,
                headers=tenant_header
            )
            
            if response.status_code == 200:
                result = response.json()
                compliance_results = result.get('compliance_results', {})
                is_compliant = compliance_results.get('compliant', True)
                exceeds_limits = compliance_results.get('exceeds_limits', [])
                
                # Log results
                if not is_compliant:
                    logger.info("  ✅ Policy compliance check correctly identified non-compliant receipt")
                    for item in exceeds_limits:
                        logger.info(f"     Non-compliant item: {item.get('item')}")
                        logger.info(f"     Reason: {item.get('reason')}")
                else:
                    logger.warning("  ⚠️ Policy compliance check did not identify non-compliant receipt")
                
                # Check for hotel expense specifically
                hotel_violation_found = False
                for item in exceeds_limits:
                    if 'hotel' in item.get('item', '').lower() and 'Rs. 600' in str(item.get('amount', '')):
                        hotel_violation_found = True
                        logger.info("  ✅ Successfully detected Rs. 600 hotel expense exceeding Rs. 400 limit")
                
                if not hotel_violation_found and not is_compliant:
                    logger.warning("  ⚠️ Detected non-compliance but not specifically for hotel expense")
                
                # Store results
                results['policy_compliance'] = {
                    'success': response.status_code == 200,
                    'is_compliant': is_compliant,
                    'exceeds_limits': exceeds_limits,
                    'hotel_violation_detected': hotel_violation_found,
                    'summary': result.get('summary')
                }
            else:
                logger.error(f"  ❌ Policy compliance check failed")
                logger.error(f"     Status code: {response.status_code}")
                logger.error(f"     Response: {response.text}")
                
                # Store failure
                results['policy_compliance'] = {
                    'success': False,
                    'status_code': response.status_code,
                    'error': response.text
                }
    except Exception as e:
        logger.error(f"  ❌ Exception during policy compliance check: {str(e)}")
        
        # Store exception
        results['policy_compliance'] = {
            'success': False,
            'exception': str(e)
        }
    
    return results

def test_document_matching():
    """Test document matching with NLP"""
    logger.info("Testing document matching with NLP...")
    
    # Files to test
    po_file = 'test_pdfs/po.pdf'
    invoice_file = 'test_pdfs/invoice.pdf'
    grn_file = 'test_pdfs/grn.pdf'
    
    # Endpoint
    endpoint = f"{BASE_URL}/matching/check"
    
    # Tenant to test
    tenant_header = {'X-Tenant-ID': '1'}
    
    results = {}
    
    # Test 2-way matching
    logger.info("Testing 2-way matching (PO and Invoice)...")
    
    try:
        with open(po_file, 'rb') as po_f, open(invoice_file, 'rb') as invoice_f:
            files = {
                'po': (os.path.basename(po_file), po_f, 'application/pdf'),
                'invoice': (os.path.basename(invoice_file), invoice_f, 'application/pdf')
            }
            
            response = requests.post(
                f"{endpoint}?type=two_way&useNLP=true",
                files=files,
                headers=tenant_header
            )
            
            if response.status_code == 200:
                result = response.json()
                matching_results = result.get('matching_results', {})
                match_status = matching_results.get('match_status', 'unknown')
                discrepancies = matching_results.get('discrepancies', [])
                
                # Log results
                logger.info(f"  2-way matching status: {match_status}")
                if discrepancies:
                    logger.info(f"  Found {len(discrepancies)} discrepancies")
                    for disc in discrepancies:
                        logger.info(f"     {disc.get('field')}: PO={disc.get('po_value')}, Invoice={disc.get('invoice_value')}")
                
                # Check for quantity mismatch specifically
                quantity_mismatch_found = False
                for disc in discrepancies:
                    if disc.get('field') == 'quantity' and 'laptop' in str(disc.get('item', '')).lower():
                        if ('2' in str(disc.get('po_value', '')) and '3' in str(disc.get('invoice_value', ''))):
                            quantity_mismatch_found = True
                            logger.info("  ✅ Successfully detected laptop quantity mismatch (2 vs 3)")
                
                if not quantity_mismatch_found and discrepancies:
                    logger.warning("  ⚠️ Detected discrepancies but not specifically for laptop quantity")
                
                # Store results
                results['two_way_matching'] = {
                    'success': response.status_code == 200,
                    'match_status': match_status,
                    'discrepancies': discrepancies,
                    'quantity_mismatch_detected': quantity_mismatch_found,
                    'summary': result.get('summary')
                }
            else:
                logger.error(f"  ❌ 2-way matching failed")
                logger.error(f"     Status code: {response.status_code}")
                logger.error(f"     Response: {response.text}")
                
                # Store failure
                results['two_way_matching'] = {
                    'success': False,
                    'status_code': response.status_code,
                    'error': response.text
                }
    except Exception as e:
        logger.error(f"  ❌ Exception during 2-way matching: {str(e)}")
        
        # Store exception
        results['two_way_matching'] = {
            'success': False,
            'exception': str(e)
        }
    
    # Test 3-way matching
    logger.info("Testing 3-way matching (PO, Invoice, and GRN)...")
    
    try:
        with open(po_file, 'rb') as po_f, open(invoice_file, 'rb') as invoice_f, open(grn_file, 'rb') as grn_f:
            files = {
                'po': (os.path.basename(po_file), po_f, 'application/pdf'),
                'invoice': (os.path.basename(invoice_file), invoice_f, 'application/pdf'),
                'grn': (os.path.basename(grn_file), grn_f, 'application/pdf')
            }
            
            response = requests.post(
                f"{endpoint}?type=three_way&useNLP=true",
                files=files,
                headers=tenant_header
            )
            
            if response.status_code == 200:
                result = response.json()
                matching_results = result.get('matching_results', {})
                match_status = matching_results.get('match_status', 'unknown')
                discrepancies = matching_results.get('discrepancies', [])
                
                # Log results
                logger.info(f"  3-way matching status: {match_status}")
                if discrepancies:
                    logger.info(f"  Found {len(discrepancies)} discrepancies")
                    for disc in discrepancies:
                        if 'grn_value' in disc:
                            logger.info(f"     {disc.get('field')}: PO={disc.get('po_value')}, "
                                       f"Invoice={disc.get('invoice_value')}, GRN={disc.get('grn_value')}")
                        else:
                            logger.info(f"     {disc.get('field')}: PO={disc.get('po_value')}, "
                                       f"Invoice={disc.get('invoice_value')}")
                
                # Check for 3-way quantity mismatch specifically
                quantity_mismatch_found = False
                for disc in discrepancies:
                    if disc.get('field') == 'quantity' and 'laptop' in str(disc.get('item', '')).lower():
                        if ('2' in str(disc.get('po_value', '')) and 
                            '3' in str(disc.get('invoice_value', '')) and 
                            'grn_value' in disc):
                            quantity_mismatch_found = True
                            logger.info("  ✅ Successfully detected 3-way laptop quantity mismatch")
                
                if not quantity_mismatch_found and discrepancies:
                    logger.warning("  ⚠️ Detected discrepancies but not specifically for 3-way laptop quantity")
                
                # Store results
                results['three_way_matching'] = {
                    'success': response.status_code == 200,
                    'match_status': match_status,
                    'discrepancies': discrepancies,
                    'quantity_mismatch_detected': quantity_mismatch_found,
                    'summary': result.get('summary')
                }
            else:
                logger.error(f"  ❌ 3-way matching failed")
                logger.error(f"     Status code: {response.status_code}")
                logger.error(f"     Response: {response.text}")
                
                # Store failure
                results['three_way_matching'] = {
                    'success': False,
                    'status_code': response.status_code,
                    'error': response.text
                }
    except Exception as e:
        logger.error(f"  ❌ Exception during 3-way matching: {str(e)}")
        
        # Store exception
        results['three_way_matching'] = {
            'success': False,
            'exception': str(e)
        }
    
    return results

def test_tenant_isolation():
    """Test tenant isolation"""
    logger.info("Testing tenant isolation...")
    
    # File to test
    invoice_file = 'test_pdfs/invoice.pdf'
    
    # Endpoint
    endpoint = f"{BASE_URL}/invoices/extract"
    
    # Tenants to test
    tenant_headers = [
        {'X-Tenant-ID': '1'},
        {'X-Tenant-ID': '2'}
    ]
    
    results = {}
    
    # Test with different tenant IDs
    for i, tenant_header in enumerate(tenant_headers):
        tenant_id = tenant_header['X-Tenant-ID']
        logger.info(f"Testing tenant isolation with tenant {tenant_id}...")
        
        try:
            with open(invoice_file, 'rb') as f:
                files = {'document': (os.path.basename(invoice_file), f, 'application/pdf')}
                
                response = requests.post(
                    endpoint,
                    files=files,
                    headers=tenant_header
                )
                
                if response.status_code == 200:
                    result = response.json()
                    extracted_data = result.get('extracted_data', {})
                    
                    # Check for vendor match data
                    vendor_match = result.get('vendor_match', {})
                    vendor_exists = vendor_match.get('vendor_exists', False)
                    vendor_details = vendor_match.get('vendor_details')
                    potential_vendors = vendor_match.get('potential_vendors', [])
                    
                    # Store results
                    results[f"tenant_{tenant_id}"] = {
                        'success': True,
                        'vendor_exists': vendor_exists,
                        'vendor_details': vendor_details,
                        'potential_vendors_count': len(potential_vendors),
                        'extracted_data': extracted_data
                    }
                    
                    logger.info(f"  ✅ Successfully processed invoice for tenant {tenant_id}")
                    logger.info(f"     Vendor exists: {vendor_exists}")
                    logger.info(f"     Potential vendors: {len(potential_vendors)}")
                else:
                    logger.error(f"  ❌ Processing failed for tenant {tenant_id}")
                    logger.error(f"     Status code: {response.status_code}")
                    logger.error(f"     Response: {response.text}")
                    
                    # Store failure
                    results[f"tenant_{tenant_id}"] = {
                        'success': False,
                        'status_code': response.status_code,
                        'error': response.text
                    }
        except Exception as e:
            logger.error(f"  ❌ Exception for tenant {tenant_id}: {str(e)}")
            
            # Store exception
            results[f"tenant_{tenant_id}"] = {
                'success': False,
                'exception': str(e)
            }
    
    # Compare the results from different tenants
    # Ideally, the vendor match should be different for different tenants
    tenant1_result = results.get('tenant_1', {})
    tenant2_result = results.get('tenant_2', {})
    
    if tenant1_result.get('success', False) and tenant2_result.get('success', False):
        tenant1_vendor_exists = tenant1_result.get('vendor_exists', False)
        tenant2_vendor_exists = tenant2_result.get('vendor_exists', False)
        tenant1_vendor_id = tenant1_result.get('vendor_details', {}).get('id') if tenant1_result.get('vendor_details') else None
        tenant2_vendor_id = tenant2_result.get('vendor_details', {}).get('id') if tenant2_result.get('vendor_details') else None
        
        isolation_confirmed = (
            tenant1_vendor_exists != tenant2_vendor_exists or
            tenant1_vendor_id != tenant2_vendor_id or
            tenant1_result.get('potential_vendors_count') != tenant2_result.get('potential_vendors_count')
        )
        
        if isolation_confirmed:
            logger.info("  ✅ Tenant isolation confirmed - different vendors matched for different tenants")
        else:
            logger.warning("  ⚠️ Tenant isolation is inconclusive - same vendor matching for different tenants")
        
        results['isolation_confirmed'] = isolation_confirmed
    else:
        logger.warning("  ⚠️ Cannot confirm tenant isolation due to processing failures")
        results['isolation_confirmed'] = False
    
    return results

def generate_test_report(all_results):
    """Generate a comprehensive test report"""
    logger.info("Generating test report...")
    
    report = {
        "test_time": "2025-03-15",
        "test_sections": {
            "ocr_basic": all_results.get('ocr_basic', {}),
            "policy_compliance": all_results.get('policy_compliance', {}),
            "document_matching": {
                "two_way": all_results.get('two_way_matching', {}),
                "three_way": all_results.get('three_way_matching', {})
            },
            "tenant_isolation": all_results.get('tenant_isolation', {})
        }
    }
    
    # Calculate success rates
    success_counts = {
        'ocr_basic': sum(1 for v in all_results.get('ocr_basic', {}).values() if v.get('success', False)),
        'ocr_basic_total': len(all_results.get('ocr_basic', {})),
        'policy_compliance': 1 if all_results.get('policy_compliance', {}).get('success', False) else 0,
        'policy_compliance_total': 1,
        'document_matching': (
            (1 if all_results.get('two_way_matching', {}).get('success', False) else 0) +
            (1 if all_results.get('three_way_matching', {}).get('success', False) else 0)
        ),
        'document_matching_total': 2,
        'tenant_isolation': 1 if all_results.get('tenant_isolation', {}).get('isolation_confirmed', False) else 0,
        'tenant_isolation_total': 1
    }
    
    # Add success rates to report
    report['success_rates'] = {
        'ocr_basic': f"{(success_counts['ocr_basic'] / max(1, success_counts['ocr_basic_total'])) * 100:.2f}%",
        'policy_compliance': f"{(success_counts['policy_compliance'] / success_counts['policy_compliance_total']) * 100:.2f}%",
        'document_matching': f"{(success_counts['document_matching'] / success_counts['document_matching_total']) * 100:.2f}%",
        'tenant_isolation': f"{(success_counts['tenant_isolation'] / success_counts['tenant_isolation_total']) * 100:.2f}%",
        'overall': f"{((success_counts['ocr_basic'] + success_counts['policy_compliance'] + success_counts['document_matching'] + success_counts['tenant_isolation']) / (success_counts['ocr_basic_total'] + success_counts['policy_compliance_total'] + success_counts['document_matching_total'] + success_counts['tenant_isolation_total'])) * 100:.2f}%"
    }
    
    # Save report as JSON
    with open('test_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    logger.info(f"Test report saved to test_report.json")
    
    # Print summary
    logger.info(f"TEST SUMMARY:")
    logger.info(f"  Basic OCR: {success_counts['ocr_basic']}/{success_counts['ocr_basic_total']} tests passed ({report['success_rates']['ocr_basic']})")
    logger.info(f"  Policy Compliance: {success_counts['policy_compliance']}/{success_counts['policy_compliance_total']} tests passed ({report['success_rates']['policy_compliance']})")
    logger.info(f"  Document Matching: {success_counts['document_matching']}/{success_counts['document_matching_total']} tests passed ({report['success_rates']['document_matching']})")
    logger.info(f"  Tenant Isolation: {success_counts['tenant_isolation']}/{success_counts['tenant_isolation_total']} tests passed ({report['success_rates']['tenant_isolation']})")
    logger.info(f"  Overall: {report['success_rates']['overall']} tests passed")
    
    return report

def main():
    """Main test function"""
    logger.info("Starting integrated system testing...")
    
    # Create test documents
    if not os.path.exists('test_pdfs/invoice.pdf'):
        create_test_documents()
    
    # Run all tests
    all_results = {}
    
    # Test basic OCR
    logger.info("STAGE 1: Testing basic OCR processing...")
    ocr_results = test_ocr_basic()
    all_results['ocr_basic'] = ocr_results
    
    # Test policy compliance with NLP
    logger.info("\nSTAGE 2: Testing policy compliance checking with NLP...")
    policy_results = test_policy_compliance()
    all_results['policy_compliance'] = policy_results
    
    # Test document matching with NLP
    logger.info("\nSTAGE 3: Testing document matching with NLP...")
    matching_results = test_document_matching()
    all_results['two_way_matching'] = matching_results.get('two_way_matching', {})
    all_results['three_way_matching'] = matching_results.get('three_way_matching', {})
    
    # Test tenant isolation
    logger.info("\nSTAGE 4: Testing tenant isolation...")
    isolation_results = test_tenant_isolation()
    all_results['tenant_isolation'] = isolation_results
    
    # Generate test report
    logger.info("\nGenerating test report...")
    generate_test_report(all_results)
    
    logger.info("\nAll tests completed.")

if __name__ == "__main__":
    main()