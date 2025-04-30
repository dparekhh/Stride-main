import os
import logging
import requests
import json
import base64
from datetime import datetime
import time

logger = logging.getLogger(__name__)

class ERPConnectorBase:
    """Base class for ERP connectors"""
    
    def __init__(self, integration):
        self.integration = integration
        self.name = integration.name
        self.api_url = integration.api_url
        self.username = integration.username
        self.api_key = integration.api_key
        self.settings = integration.settings or {}
    
    def test_connection(self):
        """Test connection to the ERP system"""
        raise NotImplementedError("Subclasses must implement test_connection()")
    
    def sync_bills(self, bills):
        """Sync bills to the ERP system"""
        raise NotImplementedError("Subclasses must implement sync_bills()")
    
    def sync_expenses(self, expenses):
        """Sync expenses to the ERP system"""
        raise NotImplementedError("Subclasses must implement sync_expenses()")
    
    def sync_vendors(self):
        """Sync vendors from the ERP system"""
        raise NotImplementedError("Subclasses must implement sync_vendors()")

class TallyConnector(ERPConnectorBase):
    """Connector for Tally ERP"""
    
    def test_connection(self):
        """Test connection to Tally ERP"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }
            
            # Simple ping request to test connection
            response = requests.get(
                f"{self.api_url}/company/info",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'message': 'Successfully connected to Tally ERP',
                    'company_info': response.json()
                }
            else:
                return {
                    'success': False,
                    'message': f'Failed to connect to Tally ERP: {response.status_code}',
                    'error': response.text
                }
        
        except Exception as e:
            logger.error(f"Error connecting to Tally ERP: {str(e)}")
            return {
                'success': False,
                'message': f'Error connecting to Tally ERP: {str(e)}',
                'error': str(e)
            }
    
    def sync_bills(self, bills):
        """Sync bills to Tally ERP"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }
            
            results = {
                'success': 0,
                'failed': 0,
                'errors': []
            }
            
            for bill in bills:
                # Convert bill to Tally format
                tally_bill = self._format_bill_for_tally(bill)
                
                # Send to Tally
                response = requests.post(
                    f"{self.api_url}/vouchers",
                    headers=headers,
                    json=tally_bill,
                    timeout=10
                )
                
                if response.status_code in (200, 201):
                    results['success'] += 1
                else:
                    results['failed'] += 1
                    results['errors'].append({
                        'bill_id': bill.id,
                        'status_code': response.status_code,
                        'error': response.text
                    })
            
            return results
        
        except Exception as e:
            logger.error(f"Error syncing bills to Tally ERP: {str(e)}")
            return {
                'success': 0,
                'failed': len(bills),
                'errors': [{'error': str(e)}]
            }
    
    def _format_bill_for_tally(self, bill):
        """Format bill data for Tally ERP"""
        # Implement Tally-specific data structure
        tally_data = {
            'requestData': {
                'voucher': {
                    'vchType': 'Purchase',
                    'date': bill.issue_date.strftime('%Y%m%d'),
                    'referenceNumber': bill.bill_number,
                    'partyLedgerName': bill.vendor.name if bill.vendor else 'Unknown Vendor',
                    'amount': float(bill.amount),
                    'narration': bill.notes or '',
                    'lineItems': []
                }
            }
        }
        
        # Add line items
        for item in bill.line_items:
            tally_data['requestData']['voucher']['lineItems'].append({
                'ledgerName': item.category.name if item.category else 'Purchases',
                'amount': float(item.amount),
                'narration': item.description
            })
        
        return tally_data
    
    def sync_expenses(self, expenses):
        """Sync expenses to Tally ERP"""
        # Similar to sync_bills but with expense-specific formatting
        pass
    
    def sync_vendors(self):
        """Sync vendors from Tally ERP"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }
            
            response = requests.get(
                f"{self.api_url}/ledgers?group=sundry_creditors",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                vendors = response.json().get('ledgers', [])
                return {
                    'success': True,
                    'vendors': vendors,
                    'count': len(vendors)
                }
            else:
                return {
                    'success': False,
                    'message': f'Failed to fetch vendors: {response.status_code}',
                    'error': response.text
                }
        
        except Exception as e:
            logger.error(f"Error syncing vendors from Tally ERP: {str(e)}")
            return {
                'success': False,
                'message': f'Error syncing vendors: {str(e)}',
                'error': str(e)
            }

class NetsuiteConnector(ERPConnectorBase):
    """Connector for Netsuite ERP"""
    
    def test_connection(self):
        """Test connection to Netsuite"""
        try:
            headers = self._get_netsuite_headers()
            
            # Simple ping request to test connection
            response = requests.get(
                f"{self.api_url}/services/rest/account/{self.settings.get('account_id', '')}/ping",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'message': 'Successfully connected to Netsuite',
                    'details': response.json()
                }
            else:
                return {
                    'success': False,
                    'message': f'Failed to connect to Netsuite: {response.status_code}',
                    'error': response.text
                }
        
        except Exception as e:
            logger.error(f"Error connecting to Netsuite: {str(e)}")
            return {
                'success': False,
                'message': f'Error connecting to Netsuite: {str(e)}',
                'error': str(e)
            }
    
    def _get_netsuite_headers(self):
        """Generate Netsuite authentication headers"""
        # Implementation would include OAuth 1.0 authentication
        # This is a simplified version
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'NLAuth nlauth_account={self.settings.get("account_id", "")}, '
                            f'nlauth_email={self.username}, '
                            f'nlauth_signature={self.api_key}, '
                            f'nlauth_role={self.settings.get("role_id", "")}'
        }
    
    def sync_bills(self, bills):
        """Sync bills to Netsuite"""
        # Implementation for Netsuite bill sync
        pass
    
    def sync_expenses(self, expenses):
        """Sync expenses to Netsuite"""
        # Implementation for Netsuite expense sync
        pass
    
    def sync_vendors(self):
        """Sync vendors from Netsuite"""
        # Implementation for Netsuite vendor sync
        pass

class SAPConnector(ERPConnectorBase):
    """Connector for SAP"""
    
    def test_connection(self):
        """Test connection to SAP"""
        try:
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Basic {self._get_basic_auth()}'
            }
            
            # Simple ping request to test connection
            response = requests.get(
                f"{self.api_url}/ping",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    'success': True,
                    'message': 'Successfully connected to SAP',
                    'details': response.json()
                }
            else:
                return {
                    'success': False,
                    'message': f'Failed to connect to SAP: {response.status_code}',
                    'error': response.text
                }
        
        except Exception as e:
            logger.error(f"Error connecting to SAP: {str(e)}")
            return {
                'success': False,
                'message': f'Error connecting to SAP: {str(e)}',
                'error': str(e)
            }
    
    def _get_basic_auth(self):
        """Generate Basic Auth header for SAP"""
        auth_string = f"{self.username}:{self.api_key}"
        return base64.b64encode(auth_string.encode()).decode()
    
    def sync_bills(self, bills):
        """Sync bills to SAP"""
        # Implementation for SAP bill sync
        pass
    
    def sync_expenses(self, expenses):
        """Sync expenses to SAP"""
        # Implementation for SAP expense sync
        pass
    
    def sync_vendors(self):
        """Sync vendors from SAP"""
        # Implementation for SAP vendor sync
        pass

# Factory function to get the appropriate connector
def get_erp_connector(integration):
    """Factory function to create the appropriate ERP connector"""
    if integration.name.lower() == 'tally':
        return TallyConnector(integration)
    elif integration.name.lower() == 'netsuite':
        return NetsuiteConnector(integration)
    elif integration.name.lower() == 'sap':
        return SAPConnector(integration)
    else:
        raise ValueError(f"Unsupported ERP system: {integration.name}")

def sync_with_erp(integration, test_only=False):
    """Sync data with an ERP system"""
    try:
        # Get the appropriate connector
        connector = get_erp_connector(integration)
        
        # Test connection first
        connection_test = connector.test_connection()
        if not connection_test['success']:
            return connection_test
        
        if test_only:
            return connection_test
        
        # Import needed here to avoid circular imports
        from models import Bill, Expense
        from app import db
        
        # Get bills that need to be synced
        bills = Bill.query.filter_by(status='APPROVED').all()
        bill_result = connector.sync_bills(bills)
        
        # Get expenses that need to be synced
        expenses = Expense.query.filter_by(status='APPROVED').all()
        expense_result = connector.sync_expenses(expenses)
        
        # Get vendors from ERP
        vendor_result = connector.sync_vendors()
        
        return {
            'success': True,
            'connection': connection_test,
            'bills_synced': bill_result,
            'expenses_synced': expense_result,
            'vendors_synced': vendor_result
        }
        
    except Exception as e:
        logger.error(f"Error syncing with ERP {integration.name}: {str(e)}")
        return {
            'success': False,
            'message': f'Error syncing with ERP: {str(e)}',
            'error': str(e)
        }
