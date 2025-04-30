"""
Migration script to add tenant_id to existing tables

This script is run manually as a one-time migration to add tenant_id columns
to existing tables after implementing multi-tenancy.
"""

import logging
import sys
from datetime import datetime
from sqlalchemy import text
import sys
import os

# Add the root directory to the path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, db
from models import Tenant, User, Vendor, Bill, Category, Expense, Approval, ERPIntegration, AccountingSettings, WhatsAppSetting, TenantStatus

logger = logging.getLogger(__name__)

def create_default_tenant():
    """
    Create a default tenant for existing data.
    """
    with app.app_context():
        # Check if any tenants exist
        if Tenant.query.count() > 0:
            logger.info("Tenants already exist, skipping default tenant creation")
            return Tenant.query.first()

        # Create default tenant
        default_tenant = Tenant(
            name="Default Company",
            subdomain="default",
            display_name="Default Company",
            status=TenantStatus.ACTIVE,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        try:
            db.session.add(default_tenant)
            db.session.commit()
            logger.info(f"Created default tenant: {default_tenant.name} (ID: {default_tenant.id})")
            return default_tenant
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to create default tenant: {str(e)}")
            raise

def add_tenant_id_column(table_name):
    """
    Add tenant_id column to a specific table.
    """
    with app.app_context():
        try:
            # Check if tenant_id column already exists
            sql = text(f"""
                SELECT column_name
                FROM information_schema.columns 
                WHERE table_name = '{table_name}' AND column_name = 'tenant_id'
            """)
            result = db.session.execute(sql)
            
            if result.rowcount > 0:
                logger.info(f"tenant_id column already exists in {table_name}")
                return
            
            # Add tenant_id column
            sql = text(f"""
                ALTER TABLE {table_name} 
                ADD COLUMN tenant_id INTEGER REFERENCES tenant(id)
            """)
            db.session.execute(sql)
            db.session.commit()
            logger.info(f"Added tenant_id column to {table_name}")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to add tenant_id column to {table_name}: {str(e)}")
            raise

def update_tenant_id_values(table_name, tenant_id):
    """
    Update tenant_id values in a specific table.
    """
    with app.app_context():
        try:
            # Update all rows to use the default tenant
            sql = text(f"""
                UPDATE {table_name}
                SET tenant_id = :tenant_id
                WHERE tenant_id IS NULL
            """)
            result = db.session.execute(sql, {"tenant_id": tenant_id})
            db.session.commit()
            logger.info(f"Updated {result.rowcount} rows in {table_name} with tenant_id: {tenant_id}")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to update tenant_id values in {table_name}: {str(e)}")
            raise

def make_tenant_id_not_nullable(table_name):
    """
    Make tenant_id column not nullable.
    """
    with app.app_context():
        try:
            sql = text(f"""
                ALTER TABLE {table_name} 
                ALTER COLUMN tenant_id SET NOT NULL
            """)
            db.session.execute(sql)
            db.session.commit()
            logger.info(f"Made tenant_id NOT NULL in {table_name}")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to make tenant_id NOT NULL in {table_name}: {str(e)}")
            raise

def add_unique_constraint(table_name, columns, constraint_name):
    """
    Add a unique constraint on specified columns.
    """
    with app.app_context():
        try:
            # Check if constraint already exists
            sql = text(f"""
                SELECT constraint_name
                FROM information_schema.table_constraints
                WHERE table_name = '{table_name}' AND constraint_name = '{constraint_name}'
            """)
            result = db.session.execute(sql)
            
            if result.rowcount > 0:
                logger.info(f"Constraint {constraint_name} already exists on {table_name}")
                return
            
            # Add unique constraint
            columns_str = ", ".join(columns)
            sql = text(f"""
                ALTER TABLE {table_name}
                ADD CONSTRAINT {constraint_name} UNIQUE ({columns_str})
            """)
            db.session.execute(sql)
            db.session.commit()
            logger.info(f"Added unique constraint {constraint_name} to {table_name} ({columns_str})")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to add unique constraint to {table_name}: {str(e)}")
            raise

def migrate_database():
    """
    Main migration function to add tenant_id to all tables.
    """
    logger.info("Starting database migration for multi-tenancy...")
    
    # Step 1: Create a default tenant
    default_tenant = create_default_tenant()
    if not default_tenant:
        logger.error("Failed to create default tenant. Migration aborted.")
        return False
    
    # Tables to migrate
    tables = [
        {"name": "user", "unique_constraints": [("username", "tenant_id", "uix_user_username_tenant"), ("email", "tenant_id", "uix_user_email_tenant")]},
        {"name": "vendor", "unique_constraints": [("name", "tenant_id", "uix_vendor_name_tenant")]},
        {"name": "bill", "unique_constraints": [("bill_number", "tenant_id", "uix_bill_number_tenant")]},
        {"name": "category", "unique_constraints": [("name", "tenant_id", "uix_category_name_tenant")]},
        {"name": "expense", "unique_constraints": []},
        {"name": "approval", "unique_constraints": []},
        {"name": "erp_integration", "unique_constraints": [("name", "tenant_id", "uix_integration_name_tenant")]},
        {"name": "accounting_settings", "unique_constraints": [("tenant_id", "uix_accounting_settings_tenant")]},
        {"name": "whats_app_setting", "unique_constraints": [("tenant_id", "uix_whatsapp_settings_tenant")]}
    ]
    
    try:
        # Step 2: Add tenant_id column to each table
        for table in tables:
            add_tenant_id_column(table["name"])
        
        # Step 3: Update all existing rows with the default tenant ID
        for table in tables:
            update_tenant_id_values(table["name"], default_tenant.id)
        
        # Step 4: Make tenant_id NOT NULL
        for table in tables:
            make_tenant_id_not_nullable(table["name"])
        
        # Step 5: Add unique constraints
        for table in tables:
            for constraint in table["unique_constraints"]:
                if len(constraint) > 2:
                    columns = constraint[:-1]
                    constraint_name = constraint[-1]
                    add_unique_constraint(table["name"], columns, constraint_name)
        
        logger.info("Migration completed successfully!")
        return True
    
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    success = migrate_database()
    sys.exit(0 if success else 1)