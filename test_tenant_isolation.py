"""
Test script to verify tenant isolation in the Stride platform.
This script simulates API requests from different tenants and verifies proper data isolation.
"""

import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Base URL of the application
BASE_URL = "http://localhost:3000/api"

def test_bills_isolation():
    """
    Test that bills API properly isolates data by tenant
    """
    logger.info("Testing bill data isolation between tenants")
    
    # Simulate a request from Tenant 1
    headers_tenant1 = {"X-Tenant-ID": "1"}
    logger.info("Testing API access with Tenant 1 headers")
    
    try:
        response_tenant1 = requests.get(f"{BASE_URL}/bills/", headers=headers_tenant1)
        if response_tenant1.status_code == 200:
            tenant1_bills = response_tenant1.json().get("bills", [])
            logger.info(f"Tenant 1 bills count: {len(tenant1_bills)}")
            
            # Verify all bills belong to tenant 1
            for bill in tenant1_bills:
                assert bill.get("tenant_id") == 1, f"Bill {bill['id']} does not belong to tenant 1"
            
            logger.info("All bills for Tenant 1 have correct tenant_id")
        else:
            logger.error(f"Failed to get bills for Tenant 1: Status {response_tenant1.status_code}")
            logger.error(response_tenant1.text)
    except Exception as e:
        logger.error(f"Error testing Tenant 1: {str(e)}")
    
    # Simulate a request from Tenant 2
    headers_tenant2 = {"X-Tenant-ID": "2"}
    logger.info("Testing API access with Tenant 2 headers")
    
    try:
        response_tenant2 = requests.get(f"{BASE_URL}/bills/", headers=headers_tenant2)
        if response_tenant2.status_code == 200:
            tenant2_bills = response_tenant2.json().get("bills", [])
            logger.info(f"Tenant 2 bills count: {len(tenant2_bills)}")
            
            # Verify all bills belong to tenant 2
            for bill in tenant2_bills:
                assert bill.get("tenant_id") == 2, f"Bill {bill['id']} does not belong to tenant 2"
            
            logger.info("All bills for Tenant 2 have correct tenant_id")
        else:
            logger.error(f"Failed to get bills for Tenant 2: Status {response_tenant2.status_code}")
            logger.error(response_tenant2.text)
    except Exception as e:
        logger.error(f"Error testing Tenant 2: {str(e)}")
    
    # Verify data isolation - bills shouldn't overlap
    try:
        if response_tenant1.status_code == 200 and response_tenant2.status_code == 200:
            tenant1_bill_ids = [bill["id"] for bill in tenant1_bills]
            tenant2_bill_ids = [bill["id"] for bill in tenant2_bills]
            
            # Check for overlaps
            overlap = set(tenant1_bill_ids).intersection(set(tenant2_bill_ids))
            if overlap:
                logger.error(f"Data isolation issue: Bill IDs {overlap} appear in both tenant responses")
            else:
                logger.info("Data isolation verified: No overlapping bill IDs between tenants")
    except Exception as e:
        logger.error(f"Error verifying data isolation: {str(e)}")

def test_employees_isolation():
    """
    Test that employees API properly isolates data by tenant
    """
    logger.info("Testing employee data isolation between tenants")
    
    # This is a demonstration - in a real implementation, you would
    # create an actual /api/employees endpoint. For now, this is 
    # just to show the concept.
    
    logger.info("Note: This is a demonstration of how employee data would be isolated")
    
    # In the actual implementation, this would be a real API request
    # Test with tenant_id = 1
    headers_tenant1 = {"X-Tenant-ID": "1"}
    logger.info("Employee data for tenant 1 would include only employees with tenant_id=1")
    
    # Test with tenant_id = 2
    headers_tenant2 = {"X-Tenant-ID": "2"}
    logger.info("Employee data for tenant 2 would include only employees with tenant_id=2")

def test_health_endpoints():
    """
    Test that health endpoints are working properly
    """
    logger.info("Testing health endpoints")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            logger.info("Health check endpoint is functioning correctly")
        else:
            logger.error(f"Health check failed: Status {response.status_code}")
            logger.error(response.text)
    except Exception as e:
        logger.error(f"Error testing health endpoint: {str(e)}")

def main():
    """
    Main test function
    """
    logger.info("Starting multi-tenant isolation tests")
    
    # Test health endpoints first
    test_health_endpoints()
    
    # Test bill data isolation
    test_bills_isolation()
    
    # Test employee data isolation
    test_employees_isolation()
    
    logger.info("Testing complete")

if __name__ == "__main__":
    main()