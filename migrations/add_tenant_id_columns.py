"""
Database migration script to add tenant_id column to tables that require it.

This script adds the tenant_id column to the following tables:
- whats_app_setting
- erp_integration
- accounting_settings

It also sets a default tenant_id of 1 for existing rows and adds a foreign key constraint.
"""

import logging
import sys
from sqlalchemy import text
from app import db, app

logger = logging.getLogger(__name__)

# Tables that need the tenant_id column
TABLES_TO_MODIFY = [
    "whats_app_setting",
    "erp_integration",
    "accounting_settings"
]

def run_migration():
    """Run the database migration to add tenant_id column to needed tables."""
    try:
        with app.app_context():
            # Create a database connection
            connection = db.engine.connect()
            
            for table_name in TABLES_TO_MODIFY:
                try:
                    # Check if table exists
                    result = connection.execute(text(f"SELECT to_regclass('{table_name}')"))
                    table_exists = result.scalar()
                    
                    if not table_exists:
                        logger.warning(f"Table {table_name} does not exist, skipping")
                        continue
                    
                    # Check if tenant_id column already exists
                    result = connection.execute(text(
                        f"SELECT column_name FROM information_schema.columns "
                        f"WHERE table_name = '{table_name}' AND column_name = 'tenant_id'"
                    ))
                    column_exists = result.scalar()
                    
                    if column_exists:
                        logger.info(f"Column tenant_id already exists in table {table_name}, skipping")
                        continue
                    
                    # Begin transaction
                    transaction = connection.begin()
                    
                    # 1. Add tenant_id column
                    logger.info(f"Adding tenant_id column to {table_name}")
                    connection.execute(text(
                        f"ALTER TABLE {table_name} ADD COLUMN tenant_id INTEGER"
                    ))
                    
                    # 2. Set default tenant_id for existing rows
                    logger.info(f"Setting default tenant_id=1 for existing rows in {table_name}")
                    connection.execute(text(
                        f"UPDATE {table_name} SET tenant_id = 1"
                    ))
                    
                    # 3. Make tenant_id NOT NULL
                    logger.info(f"Making tenant_id NOT NULL in {table_name}")
                    connection.execute(text(
                        f"ALTER TABLE {table_name} ALTER COLUMN tenant_id SET NOT NULL"
                    ))
                    
                    # 4. Add foreign key constraint
                    logger.info(f"Adding foreign key constraint on tenant_id in {table_name}")
                    connection.execute(text(
                        f"ALTER TABLE {table_name} ADD CONSTRAINT fk_{table_name}_tenant_id "
                        f"FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE"
                    ))
                    
                    # Commit transaction
                    transaction.commit()
                    logger.info(f"Successfully added tenant_id column to {table_name}")
                    
                except Exception as e:
                    logger.error(f"Error modifying table {table_name}: {str(e)}")
                    # Rollback transaction
                    if 'transaction' in locals():
                        transaction.rollback()
                    raise
                    
            logger.info("Migration completed successfully")
            
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Run the migration
    success = run_migration()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)