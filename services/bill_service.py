"""Business logic for bill management."""
import logging
from typing import Dict, Any, List, Optional
from marshmallow import ValidationError
from models import Bill, BillStatus, LineItem, Approval, ApprovalType, ApprovalStatus, Category, db
from schemas.bill_schema import BillSchema, BillLineItemSchema
from utils.exception_utils import DataValidationError

logger = logging.getLogger(__name__)

class BillService:
    """Service class for bill management operations."""
    def __init__(self, tenant_id: int):
        self.tenant_id = tenant_id

    def get_all_bills(self) -> List[Dict[str, Any]]:
        """Retrieve all bills for the tenant."""
        bills = Bill.query.filter_by(tenant_id=self.tenant_id).all()
        return [
            {
                'id': bill.id,
                'vendor_id': bill.vendor_id,
                'amount': bill.amount,
                'currency': bill.currency,
                'issue_date': bill.issue_date.isoformat() if bill.issue_date else None,
                'due_date': bill.due_date.isoformat() if bill.due_date else None,
                'status': bill.status.value,
                'invoice_file': bill.invoice_file
            } for bill in bills
        ]

    def get_bill(self, bill_id: int) -> Dict[str, Any]:
        """Retrieve a specific bill by ID with line items."""
        bill = Bill.query.filter_by(id=bill_id, tenant_id=self.tenant_id).first()
        if not bill:
            raise ValueError(f"Bill with ID {bill_id} not found")
        return {
            'id': bill.id,
            'vendor_id': bill.vendor_id,
            'amount': bill.amount,
            'currency': bill.currency,
            'issue_date': bill.issue_date.isoformat() if bill.issue_date else None,
            'due_date': bill.due_date.isoformat() if bill.due_date else None,
            'status': bill.status.value,
            'invoice_file': bill.invoice_file,
            'line_items': [
                {
                    'id': item.id,
                    'description': item.description,
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'amount': item.amount,
                    'tax_rate': item.tax_rate,
                    'tax_amount': item.tax_amount,
                    'category_id': item.category_id
                } for item in bill.line_items
            ]
        }

    def create_bill(self, data: Dict[str, Any]) -> int:
        """Create a new bill with the provided data."""
        try:
            validated_data = BillSchema().load(data)
        except ValidationError as err:
            raise DataValidationError("Invalid bill data", err.messages)

        next_id = int(db.session.execute(db.text("SELECT nextval('bill_id_seq')")).scalar())
        bill = Bill(
            bill_number=f"BILL-{self.tenant_id}-{next_id}",
            vendor_id=validated_data['vendor_id'],
            amount=validated_data['amount'],
            currency=validated_data['currency'],
            issue_date=validated_data['issue_date'],
            due_date=validated_data['due_date'],
            status=BillStatus.DRAFT,
            invoice_file=validated_data.get('invoice_file'),
            notes=validated_data.get('notes'),
            tenant_id=self.tenant_id
        )
        db.session.add(bill)

        for item_data in validated_data.get('line_items', []):
            line_item = LineItem(
                bill=bill,
                description=item_data['description'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                amount=item_data['amount'],
                tax_rate=item_data['tax_rate'],
                tax_amount=item_data['tax_amount'],
                category_id=item_data.get('category_id')
            )
            db.session.add(line_item)

        db.session.commit()
        logger.info(f"Bill created: ID {bill.id} for tenant {self.tenant_id}")
        return bill.id

    def update_bill(self, bill_id: int, data: Dict[str, Any]) -> None:
        """Update an existing bill with the provided data."""
        bill = Bill.query.filter_by(id=bill_id, tenant_id=self.tenant_id).first()
        if not bill:
            raise ValueError(f"Bill with ID {bill_id} not found")
        if bill.status != BillStatus.DRAFT:
            raise ValueError(f"Bill cannot be updated. Current status: {bill.status.value}")

        try:
            validated_data = BillSchema().load(data, partial=True)
        except ValidationError as err:
            raise DataValidationError("Invalid bill update data", err.messages)

        if 'vendor_id' in validated_data:
            bill.vendor_id = validated_data['vendor_id']
        if 'amount' in validated_data:
            bill.amount = validated_data['amount']
        if 'currency' in validated_data:
            bill.currency = validated_data['currency']
        if 'issue_date' in validated_data:
            bill.issue_date = validated_data['issue_date']
        if 'due_date' in validated_data:
            bill.due_date = validated_data['due_date']
        if 'invoice_file' in validated_data:
            bill.invoice_file = validated_data['invoice_file']
        if 'notes' in validated_data:
            bill.notes = validated_data['notes']

        if 'line_items' in validated_data:
            for item in bill.line_items:
                db.session.delete(item)
            for item_data in validated_data['line_items']:
                line_item = LineItem(
                    bill=bill,
                    description=item_data['description'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    amount=item_data['amount'],
                    tax_rate=item_data['tax_rate'],
                    tax_amount=item_data['tax_amount'],
                    category_id=item_data.get('category_id')
                )
                db.session.add(line_item)

        db.session.commit()
        logger.info(f"Bill updated: ID {bill.id} for tenant {self.tenant_id}")

    def delete_bill(self, bill_id: int) -> None:
        """Delete a bill by ID."""
        bill = Bill.query.filter_by(id=bill_id, tenant_id=self.tenant_id).first()
        if not bill:
            raise ValueError(f"Bill with ID {bill_id} not found")
        if bill.status != BillStatus.DRAFT:
            raise ValueError(f"Bill cannot be deleted. Current status: {bill.status.value}")

        # First delete line items if any
        for item in bill.line_items:
            db.session.delete(item)
            
        # Delete any associated approvals using a safer approach
        approvals = Approval.query.filter_by(bill_id=bill_id, tenant_id=self.tenant_id).all()
        for approval in approvals:
            db.session.delete(approval)
            
        # Finally delete the bill itself
        db.session.delete(bill)
        db.session.commit()
        logger.info(f"Bill deleted: ID {bill_id} for tenant {self.tenant_id}")

    def submit_for_approval(self, bill_id: int, approver_id: int) -> int:
        """Submit a bill for approval."""
        bill = Bill.query.filter_by(id=bill_id, tenant_id=self.tenant_id).first()
        if not bill:
            raise ValueError(f"Bill with ID {bill_id} not found")
        if bill.status != BillStatus.DRAFT:
            raise ValueError(f"Bill cannot be submitted. Current status: {bill.status.value}")

        bill.status = BillStatus.SUBMITTED
        approval = Approval(
            approver_id=approver_id,
            type=ApprovalType.BILL,
            bill_id=bill.id,
            status=ApprovalStatus.PENDING,
            tenant_id=self.tenant_id
        )
        db.session.add(approval)
        db.session.commit()
        logger.info(f"Bill submitted for approval: ID {bill.id}, Approval ID {approval.id} for tenant {self.tenant_id}")
        return approval.id

    def get_categories(self) -> List[Dict[str, Any]]:
        """Retrieve all expense categories for the tenant."""
        categories = Category.query.filter_by(tenant_id=self.tenant_id).all()
        return [
            {
                'id': category.id,
                'name': category.name,
                'description': category.description
            } for category in categories
        ]
        
    def get_matching_purchase_orders(self, vendor_id: Optional[int] = None, search_term: str = '') -> List[Dict[str, Any]]:
        """
        Get matching purchase orders for a given vendor.
        
        Args:
            vendor_id: Optional ID of the vendor to filter purchase orders
            search_term: Optional search term to filter purchase orders
            
        Returns:
            List of matching purchase order objects
        """
        # This is a stub implementation that returns static data
        # In a real implementation, this would query the database for matching POs
        logger.info(f"Retrieving matching purchase orders for vendor_id={vendor_id}, search_term='{search_term}'")
        
        # Placeholder data - in production this would come from a database query
        return [
            {
                'id': 'PO-2025-001',
                'vendor_id': vendor_id if vendor_id else 1,
                'purchase_order_number': 'PO-2025-001',
                'date': '2025-03-01',
                'status': 'open',
                'total_amount': 15000.00
            },
            {
                'id': 'PO-2025-002',
                'vendor_id': vendor_id if vendor_id else 1,
                'purchase_order_number': 'PO-2025-002',
                'date': '2025-03-10',
                'status': 'open',
                'total_amount': 28500.00
            }
        ]
    
    def get_matching_grns(self, vendor_id: Optional[int] = None, search_term: str = '') -> List[Dict[str, Any]]:
        """
        Get matching goods received notes for a given vendor.
        
        Args:
            vendor_id: Optional ID of the vendor to filter GRNs
            search_term: Optional search term to filter GRNs
            
        Returns:
            List of matching GRN objects
        """
        # This is a stub implementation that returns static data
        # In a real implementation, this would query the database for matching GRNs
        logger.info(f"Retrieving matching GRNs for vendor_id={vendor_id}, search_term='{search_term}'")
        
        # Placeholder data - in production this would come from a database query
        return [
            {
                'id': 'GRN-2025-001',
                'vendor_id': vendor_id if vendor_id else 1,
                'grn_number': 'GRN-2025-001',
                'date': '2025-03-05',
                'status': 'received',
                'purchase_order_id': 'PO-2025-001',
                'total_amount': 15000.00
            },
            {
                'id': 'GRN-2025-002',
                'vendor_id': vendor_id if vendor_id else 1,
                'grn_number': 'GRN-2025-002',
                'date': '2025-03-15',
                'status': 'received',
                'purchase_order_id': 'PO-2025-002',
                'total_amount': 28500.00
            }
        ]