"""
Script to set up test tenants and users for multi-tenant testing
"""

import os
import sys
from datetime import datetime, timedelta

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Tenant, User, UserRole, TenantStatus
from utils.tenant import create_tenant, create_tenant_admin

def setup_test_tenants():
    """
    Create test tenants and users for testing multi-tenancy
    """
    with app.app_context():
        print("Setting up test tenants...")
        
        # Check if tenants already exist
        existing_tenants = Tenant.query.all()
        if existing_tenants:
            print(f"Found {len(existing_tenants)} existing tenants:")
            for tenant in existing_tenants:
                print(f"  - ID: {tenant.id}, Name: {tenant.name}, Subdomain: {tenant.subdomain}")
            
            proceed = input("Do you want to create additional test tenants? (y/n): ")
            if proceed.lower() != 'y':
                print("Exiting without creating new tenants.")
                return
        
        # Create Tenant 1: TechCorp
        tenant1 = create_tenant(
            name="TechCorp",
            subdomain="techcorp",
            display_name="Tech Corporation Ltd.",
            status=TenantStatus.ACTIVE,
            subscription_plan="enterprise",
            subscription_end_date=(datetime.now() + timedelta(days=365)).date(),
            primary_contact_email="admin@techcorp.example.com",
            primary_contact_phone="+91 9876543210",
            city="Bangalore",
            state="Karnataka",
            country="India",
            gstin="29ABCDE1234F1Z5"
        )
        
        # Create admin user for TechCorp
        admin1 = create_tenant_admin(
            tenant_id=tenant1.id,
            username="tech_admin",
            email="admin@techcorp.example.com",
            password="securepass123",
            phone="+91 9876543210"
        )
        
        # Create additional user for TechCorp
        user1 = User(
            username="tech_user",
            email="user@techcorp.example.com",
            role=UserRole.EMPLOYEE,
            tenant_id=tenant1.id,
            phone="+91 9876543211"
        )
        user1.set_password("userpass123")
        db.session.add(user1)
        
        # Create Tenant 2: FinServe
        tenant2 = create_tenant(
            name="FinServe",
            subdomain="finserve",
            display_name="Financial Services Pvt. Ltd.",
            status=TenantStatus.ACTIVE,
            subscription_plan="professional",
            subscription_end_date=(datetime.now() + timedelta(days=180)).date(),
            primary_contact_email="admin@finserve.example.com",
            primary_contact_phone="+91 8765432109",
            city="Mumbai",
            state="Maharashtra",
            country="India",
            gstin="27FGHIJ5678K1Z3"
        )
        
        # Create admin user for FinServe
        admin2 = create_tenant_admin(
            tenant_id=tenant2.id,
            username="fin_admin",
            email="admin@finserve.example.com",
            password="securepass456",
            phone="+91 8765432109"
        )
        
        # Create additional user for FinServe
        user2 = User(
            username="fin_user",
            email="user@finserve.example.com",
            role=UserRole.EMPLOYEE,
            tenant_id=tenant2.id,
            phone="+91 8765432110"
        )
        user2.set_password("userpass456")
        db.session.add(user2)
        
        # Commit all changes
        db.session.commit()
        
        print(f"Created tenant: {tenant1.name} (ID: {tenant1.id})")
        print(f"Created admin: {admin1.username} (ID: {admin1.id}, Tenant: {admin1.tenant_id})")
        print(f"Created user: {user1.username} (ID: {user1.id}, Tenant: {user1.tenant_id})")
        
        print(f"Created tenant: {tenant2.name} (ID: {tenant2.id})")
        print(f"Created admin: {admin2.username} (ID: {admin2.id}, Tenant: {admin2.tenant_id})")
        print(f"Created user: {user2.username} (ID: {user2.id}, Tenant: {user2.tenant_id})")
        
        print("\nTenants and users created successfully!")

if __name__ == "__main__":
    setup_test_tenants()