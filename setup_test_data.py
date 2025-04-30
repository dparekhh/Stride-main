"""
Script to populate test data for each tenant
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import (
    Tenant, User, UserRole, Vendor, Category, Bill, BillStatus,
    LineItem, Expense, ExpenseStatus
)

def create_vendors_for_tenant(tenant_id, count=3):
    """Create vendors for a specific tenant"""
    vendors = []
    
    vendor_data = [
        {
            "name": "ABC Technologies",
            "gstin": "29AABCT1234A1Z5",
            "pan": "AABCT1234A",
            "email": "billing@abctech.example.com",
            "phone": "+91 9876543210",
            "address": "123 Tech Park, Whitefield",
            "category": "Technology"
        },
        {
            "name": "XYZ Office Supplies",
            "gstin": "29AABCX5678B1Z6",
            "pan": "AABCX5678B",
            "email": "billing@xyzsupplies.example.com",
            "phone": "+91 9876543211",
            "address": "456 Industrial Area, Phase 2",
            "category": "Office Supplies"
        },
        {
            "name": "Global Services Ltd",
            "gstin": "29AABCG9012C1Z7",
            "pan": "AABCG9012C",
            "email": "billing@globalservices.example.com",
            "phone": "+91 9876543212",
            "address": "789 Business Park, Electronics City",
            "category": "Services"
        },
        {
            "name": "Indian Software Solutions",
            "gstin": "29AABCI3456D1Z8",
            "pan": "AABCI3456D",
            "email": "billing@indiansoftware.example.com",
            "phone": "+91 9876543213",
            "address": "321 IT Park, Marathahalli",
            "category": "Software"
        },
        {
            "name": "Stationary Hub",
            "gstin": "29AABCS7890E1Z9",
            "pan": "AABCS7890E",
            "email": "billing@stationaryhub.example.com",
            "phone": "+91 9876543214",
            "address": "543 Market Street, Jayanagar",
            "category": "Stationary"
        },
        {
            "name": "Cloud Computing Co.",
            "gstin": "29AABCC2345F1Z0",
            "pan": "AABCC2345F",
            "email": "billing@cloudcomputing.example.com",
            "phone": "+91 9876543215",
            "address": "876 Tech Tower, MG Road",
            "category": "Cloud Services"
        }
    ]
    
    # Use only a subset based on the count parameter
    sample_vendors = random.sample(vendor_data, min(count, len(vendor_data)))
    
    for data in sample_vendors:
        # Add some variation based on tenant_id to make them distinct
        if tenant_id == 2:
            data["name"] = data["name"].replace("Ltd", "Inc").replace("Co.", "Corporation")
            data["gstin"] = "27" + data["gstin"][2:]  # Change state code to Maharashtra (27)
        
        vendor = Vendor(
            name=data["name"],
            gstin=data["gstin"],
            pan=data["pan"],
            email=data["email"],
            phone=data["phone"],
            address=data["address"],
            category=data["category"],
            tenant_id=tenant_id
        )
        
        db.session.add(vendor)
        vendors.append(vendor)
    
    db.session.commit()
    return vendors

def create_categories_for_tenant(tenant_id):
    """Create expense/bill categories for a specific tenant"""
    categories = []
    
    category_data = [
        {"name": "Office Supplies", "description": "Paper, stationery, and other office consumables"},
        {"name": "Software", "description": "Software licenses and subscriptions"},
        {"name": "Hardware", "description": "Computers, servers, and IT equipment"},
        {"name": "Travel", "description": "Business travel expenses"},
        {"name": "Utilities", "description": "Electricity, water, internet, etc."},
        {"name": "Rent", "description": "Office rent and lease payments"},
        {"name": "Professional Services", "description": "Legal, accounting, and consulting services"},
        {"name": "Marketing", "description": "Advertising and marketing expenses"},
        {"name": "Training", "description": "Employee training and development"},
        {"name": "Miscellaneous", "description": "Other business expenses"}
    ]
    
    for data in category_data:
        category = Category(
            name=data["name"],
            description=data["description"],
            tenant_id=tenant_id
        )
        
        db.session.add(category)
        categories.append(category)
    
    db.session.commit()
    return categories

def create_bills_for_tenant(tenant_id, vendors, categories, count=5):
    """Create bills for a specific tenant"""
    bills = []
    
    for i in range(1, count + 1):
        vendor = random.choice(vendors)
        category = random.choice(categories)
        
        # Generate dates with some randomness
        issue_date = datetime.now() - timedelta(days=random.randint(1, 60))
        due_date = issue_date + timedelta(days=random.randint(15, 45))
        
        # Generate bill status with higher probability of some statuses
        status_choices = [
            BillStatus.DRAFT,
            BillStatus.SUBMITTED,
            BillStatus.APPROVED,
            BillStatus.PAID
        ]
        status_weights = [0.2, 0.3, 0.3, 0.2]  # Probabilities for each status
        status = random.choices(status_choices, weights=status_weights, k=1)[0]
        
        # Generate bill amount
        amount = round(random.uniform(1000, 50000), 2)
        
        bill = Bill(
            bill_number=f"BILL-{tenant_id}-{100 + i}",
            vendor_id=vendor.id,
            amount=amount,
            currency="INR",
            issue_date=issue_date.date(),
            due_date=due_date.date(),
            status=status,
            notes=f"Test bill {i} for tenant {tenant_id}",
            tenant_id=tenant_id,
            po_number=f"PO-{tenant_id}-{200 + i}" if random.random() > 0.3 else None,
            is_recurring=random.random() > 0.7  # 30% chance of being recurring
        )
        
        db.session.add(bill)
        db.session.flush()  # Get the bill ID without committing
        
        # Create line items for this bill
        line_item_count = random.randint(1, 3)
        for j in range(1, line_item_count + 1):
            # Calculate random amounts for this line item
            quantity = random.randint(1, 10)
            unit_price = round(random.uniform(100, 2000), 2)
            line_amount = round(quantity * unit_price, 2)
            tax_rate = random.choice([0, 5, 12, 18, 28])  # GST rates in India
            tax_amount = round(line_amount * tax_rate / 100, 2)
            
            line_item = LineItem(
                bill_id=bill.id,
                description=f"Item {j} for Bill {bill.bill_number}",
                quantity=quantity,
                unit_price=unit_price,
                amount=line_amount,
                tax_rate=tax_rate,
                tax_amount=tax_amount,
                category_id=category.id
            )
            
            db.session.add(line_item)
        
        bills.append(bill)
    
    db.session.commit()
    return bills

def create_expenses_for_tenant(tenant_id, users, categories, count=5):
    """Create expenses for a specific tenant"""
    expenses = []
    
    for i in range(1, count + 1):
        user = random.choice(users)
        category = random.choice(categories)
        
        # Generate dates with some randomness
        date = datetime.now() - timedelta(days=random.randint(1, 30))
        
        # Generate expense status with higher probability of some statuses
        status_choices = [
            ExpenseStatus.DRAFT,
            ExpenseStatus.SUBMITTED,
            ExpenseStatus.APPROVED,
            ExpenseStatus.REIMBURSED
        ]
        status_weights = [0.2, 0.3, 0.3, 0.2]  # Probabilities for each status
        status = random.choices(status_choices, weights=status_weights, k=1)[0]
        
        # Generate expense amount
        amount = round(random.uniform(100, 5000), 2)
        
        expense = Expense(
            user_id=user.id,
            amount=amount,
            currency="INR",
            date=date.date(),
            description=f"Expense {i} for {category.name} by {user.username}",
            category_id=category.id,
            status=status,
            notes=f"Test expense {i} for tenant {tenant_id}",
            tenant_id=tenant_id
        )
        
        db.session.add(expense)
        expenses.append(expense)
    
    db.session.commit()
    return expenses

def setup_test_data():
    """
    Set up test data for each tenant
    """
    with app.app_context():
        print("Setting up test data for tenants...")
        
        # Get all tenants
        tenants = Tenant.query.all()
        
        if not tenants:
            print("No tenants found in the database. Please run setup_test_tenants.py first.")
            return
        
        for tenant in tenants:
            print(f"\nSetting up data for tenant: {tenant.name} (ID: {tenant.id})")
            
            # Get users for this tenant
            users = User.query.filter_by(tenant_id=tenant.id).all()
            
            if not users:
                print(f"No users found for tenant {tenant.name}. Skipping...")
                continue
            
            # Create vendors
            print(f"Creating vendors for tenant {tenant.name}...")
            vendors = create_vendors_for_tenant(tenant.id, count=4)
            
            # Create categories
            print(f"Creating categories for tenant {tenant.name}...")
            categories = create_categories_for_tenant(tenant.id)
            
            # Create bills
            print(f"Creating bills for tenant {tenant.name}...")
            bills = create_bills_for_tenant(tenant.id, vendors, categories, count=8)
            
            # Create expenses
            print(f"Creating expenses for tenant {tenant.name}...")
            expenses = create_expenses_for_tenant(tenant.id, users, categories, count=10)
            
            print(f"Created {len(vendors)} vendors, {len(categories)} categories, {len(bills)} bills, and {len(expenses)} expenses for tenant {tenant.name}")
        
        print("\nTest data setup complete!")

if __name__ == "__main__":
    setup_test_data()