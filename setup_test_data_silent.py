"""
Script to set up test tenants and data silently (without user input)
"""
import os
import sys
import random
from datetime import datetime, timedelta
from app import app, db
from models import (
    Tenant, TenantStatus, User, UserRole, Vendor, Bill, BillStatus,
    Category, LineItem, Expense, ExpenseStatus, Approval, ApprovalStatus, ApprovalType
)
from werkzeug.security import generate_password_hash

def setup_test_tenant_silently():
    """Create a test tenant silently"""
    with app.app_context():
        # Check if tenants already exist
        existing_tenants = Tenant.query.all()
        if existing_tenants:
            print(f"Found {len(existing_tenants)} existing tenants")
            for tenant in existing_tenants:
                print(f"  - ID: {tenant.id}, Name: {tenant.name}, Subdomain: {tenant.subdomain}")
            
            # Set up cookies for the first tenant
            print(f"Setting up cookies for tenant: {existing_tenants[0].name}")
            # Create or check for admin user
            admin_user = User.query.filter_by(tenant_id=existing_tenants[0].id, role=UserRole.ADMIN).first()
            
            if not admin_user:
                admin_user = User(
                    username="admin", 
                    email="admin@demo.com",
                    password_hash=generate_password_hash("admin123"),
                    role=UserRole.ADMIN,
                    tenant_id=existing_tenants[0].id
                )
                db.session.add(admin_user)
                db.session.commit()
                print(f"Created admin user for tenant: {existing_tenants[0].name}")
            else:
                print(f"Admin user exists for tenant: {existing_tenants[0].name}")
                
            # Create test vendors
            create_vendors_for_tenant(existing_tenants[0].id, count=5)
            
            # Create test categories
            create_categories_for_tenant(existing_tenants[0].id)
            
            # Create test data
            categories = Category.query.filter_by(tenant_id=existing_tenants[0].id).all()
            vendors = Vendor.query.filter_by(tenant_id=existing_tenants[0].id).all()
            users = User.query.filter_by(tenant_id=existing_tenants[0].id).all()
            
            create_bills_for_tenant(existing_tenants[0].id, vendors, categories, count=10)
            create_expenses_for_tenant(existing_tenants[0].id, users, categories, count=10)
            
            return
            
        # Create test tenants if none exist
        tenants_data = [
            {
                "name": "Demo Corp",
                "subdomain": "demo",
                "display_name": "Demo Corp",
                "status": TenantStatus.ACTIVE,
                "subscription_plan": "enterprise",
                "subscription_end_date": datetime.now() + timedelta(days=365),
                "logo_url": "https://example.com/logo.png",
                "primary_contact_email": "contact@democorp.com",
                "primary_contact_phone": "+91 9876543210",
                "address": "123 Demo Street",
                "city": "Mumbai",
                "state": "Maharashtra",
                "country": "India",
                "postal_code": "400001",
                "gstin": "27AABCD1234A1Z5",
                "pan": "ABCDE1234F"
            },
            {
                "name": "Tech Innovators",
                "subdomain": "tech",
                "display_name": "Tech Innovators Ltd.",
                "status": TenantStatus.TRIAL,
                "subscription_plan": "starter",
                "subscription_end_date": datetime.now() + timedelta(days=30),
                "logo_url": "https://example.com/tech_logo.png",
                "primary_contact_email": "contact@techinnovators.com",
                "primary_contact_phone": "+91 9876543211",
                "address": "456 Tech Park",
                "city": "Bangalore",
                "state": "Karnataka",
                "country": "India",
                "postal_code": "560001",
                "gstin": "29PQRST5678B1Z3",
                "pan": "PQRST5678G"
            }
        ]
        
        for tenant_data in tenants_data:
            tenant = Tenant(**tenant_data)
            db.session.add(tenant)
        
        db.session.commit()
        print("Created test tenants")
        
        # Create test users for each tenant
        for tenant in Tenant.query.all():
            # Admin user
            admin_user = User(
                username="admin", 
                email=f"admin@{tenant.subdomain}.com",
                password_hash=generate_password_hash("admin123"),
                role=UserRole.ADMIN,
                phone="+91 9876543210",
                tenant_id=tenant.id
            )
            db.session.add(admin_user)
            
            # AP clerk
            ap_clerk = User(
                username="apclerk", 
                email=f"ap@{tenant.subdomain}.com",
                password_hash=generate_password_hash("clerk123"),
                role=UserRole.AP_CLERK,
                phone="+91 9876543211",
                tenant_id=tenant.id
            )
            db.session.add(ap_clerk)
            
            # Approver
            approver = User(
                username="approver", 
                email=f"approver@{tenant.subdomain}.com",
                password_hash=generate_password_hash("approve123"),
                role=UserRole.APPROVER,
                phone="+91 9876543212",
                tenant_id=tenant.id
            )
            db.session.add(approver)
            
            # Employee
            employee = User(
                username="employee", 
                email=f"employee@{tenant.subdomain}.com",
                password_hash=generate_password_hash("emp123"),
                role=UserRole.EMPLOYEE,
                phone="+91 9876543213",
                tenant_id=tenant.id
            )
            db.session.add(employee)
        
        db.session.commit()
        print("Created test users for each tenant")
        
        # Create test data for each tenant
        for tenant in Tenant.query.all():
            create_vendors_for_tenant(tenant.id, count=5)
            create_categories_for_tenant(tenant.id)
            
            # Create test data
            categories = Category.query.filter_by(tenant_id=tenant.id).all()
            vendors = Vendor.query.filter_by(tenant_id=tenant.id).all()
            users = User.query.filter_by(tenant_id=tenant.id).all()
            
            create_bills_for_tenant(tenant.id, vendors, categories, count=10)
            create_expenses_for_tenant(tenant.id, users, categories, count=10)

def create_vendors_for_tenant(tenant_id, count=3):
    """Create vendors for a specific tenant"""
    vendor_names = [
        "Reliance Industries", "TCS Ltd", "Infosys Technologies", 
        "Wipro Limited", "HCL Technologies", "Bharti Airtel", 
        "ICICI Bank", "HDFC Bank", "State Bank of India", 
        "Mahindra & Mahindra", "Tata Motors", "Larsen & Toubro"
    ]
    
    existing_vendors_count = Vendor.query.filter_by(tenant_id=tenant_id).count()
    
    if existing_vendors_count >= count:
        print(f"Tenant {tenant_id} already has {existing_vendors_count} vendors")
        return

    for i in range(min(count, len(vendor_names))):
        vendor_name = vendor_names[i]
        gstin = f"27AAAAA{1000+i}A1Z5"
        pan = f"AAAAA{1000+i}A"
        
        vendor = Vendor.query.filter_by(name=vendor_name, tenant_id=tenant_id).first()
        if not vendor:
            vendor = Vendor(
                name=vendor_name,
                gstin=gstin,
                pan=pan,
                email=f"contact@{vendor_name.lower().replace(' ', '')}.com",
                phone=f"+91 987654{3200+i}",
                address=f"{i+1}00 Business Park",
                category="Regular",
                tenant_id=tenant_id
            )
            db.session.add(vendor)
    
    db.session.commit()
    print(f"Created vendors for tenant {tenant_id}")

def create_categories_for_tenant(tenant_id):
    """Create expense/bill categories for a specific tenant"""
    categories = [
        "Office Supplies", "Travel", "Utilities", "Rent", 
        "Software", "Hardware", "Consulting", "Marketing", 
        "Salaries", "Taxes", "Insurance", "Miscellaneous"
    ]
    
    existing_categories_count = Category.query.filter_by(tenant_id=tenant_id).count()
    
    if existing_categories_count >= len(categories):
        print(f"Tenant {tenant_id} already has {existing_categories_count} categories")
        return
    
    for category_name in categories:
        category = Category.query.filter_by(name=category_name, tenant_id=tenant_id).first()
        if not category:
            category = Category(
                name=category_name,
                description=f"Expenses related to {category_name.lower()}",
                tenant_id=tenant_id
            )
            db.session.add(category)
    
    db.session.commit()
    print(f"Created categories for tenant {tenant_id}")

def create_bills_for_tenant(tenant_id, vendors, categories, count=5):
    """Create bills for a specific tenant"""
    existing_bills_count = Bill.query.filter_by(tenant_id=tenant_id).count()
    
    if existing_bills_count >= count:
        print(f"Tenant {tenant_id} already has {existing_bills_count} bills")
        return
    
    for i in range(count):
        vendor = random.choice(vendors)
        category = random.choice(categories)
        
        # Random dates
        issue_date = datetime.now() - timedelta(days=random.randint(1, 30))
        due_date = issue_date + timedelta(days=random.randint(15, 45))
        
        bill = Bill(
            bill_number=f"BILL-{2023000+i}",
            vendor_id=vendor.id,
            amount=random.randint(1000, 100000) + random.randint(0, 99) / 100,
            currency="INR",
            issue_date=issue_date,
            due_date=due_date,
            status=random.choice(list(BillStatus)),
            notes=f"Test bill {i+1}",
            tenant_id=tenant_id
        )
        db.session.add(bill)
        db.session.flush()  # Get the bill ID
        
        # Create line items
        for j in range(random.randint(1, 3)):
            quantity = random.randint(1, 10)
            unit_price = random.randint(100, 10000) + random.randint(0, 99) / 100
            amount = quantity * unit_price
            tax_rate = random.choice([0, 5, 12, 18, 28])
            tax_amount = amount * (tax_rate / 100)
            
            line_item = LineItem(
                bill_id=bill.id,
                description=f"Item {j+1} for bill {bill.bill_number}",
                quantity=quantity,
                unit_price=unit_price,
                amount=amount,
                tax_rate=tax_rate,
                tax_amount=tax_amount,
                category_id=category.id
            )
            db.session.add(line_item)
    
    db.session.commit()
    print(f"Created {count} bills for tenant {tenant_id}")

def create_expenses_for_tenant(tenant_id, users, categories, count=5):
    """Create expenses for a specific tenant"""
    if not users:
        print(f"No users found for tenant {tenant_id}")
        return
    
    existing_expenses_count = Expense.query.filter_by(tenant_id=tenant_id).count()
    
    if existing_expenses_count >= count:
        print(f"Tenant {tenant_id} already has {existing_expenses_count} expenses")
        return
    
    for i in range(count):
        user = random.choice(users)
        category = random.choice(categories)
        
        # Random date in the past month
        date = datetime.now() - timedelta(days=random.randint(1, 30))
        
        expense = Expense(
            user_id=user.id,
            amount=random.randint(100, 10000) + random.randint(0, 99) / 100,
            currency="INR",
            date=date,
            description=f"Test expense {i+1}",
            category_id=category.id,
            status=random.choice(list(ExpenseStatus)),
            notes=f"Test expense notes {i+1}",
            tenant_id=tenant_id
        )
        db.session.add(expense)
    
    db.session.commit()
    print(f"Created {count} expenses for tenant {tenant_id}")

if __name__ == "__main__":
    setup_test_tenant_silently()