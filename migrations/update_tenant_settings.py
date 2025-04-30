"""
Migration script to update the TenantSettings model

This script adds new columns to the TenantSettings table:
- company_name
- logo_url
- primary_color
- secondary_color
- time_zone
- custom_settings
"""

import logging
import os
import sys
from datetime import datetime

import sqlalchemy
from sqlalchemy import text
from flask import Flask, current_app

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_migration():
    """Run the migration to update the TenantSettings table."""
    logger.info("Starting migration to update TenantSettings table")
    
    # Get DB URI from environment variable or use default for development
    db_uri = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/stride')
    
    # Create engine
    try:
        engine = sqlalchemy.create_engine(db_uri)
        logger.info("Successfully connected to the database")
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        sys.exit(1)
    
    try:
        # Check if tenant_settings table exists
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tenant_settings')"
            ))
            table_exists = result.scalar()
            
            if not table_exists:
                logger.error("The tenant_settings table does not exist")
                sys.exit(1)
            
            # Check if the columns already exist
            result = conn.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name = 'tenant_settings'"
            ))
            existing_columns = [row[0] for row in result]
            
            # Add company_name column if it doesn't exist
            if 'company_name' not in existing_columns:
                logger.info("Adding company_name column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN company_name VARCHAR(100)"
                ))
            
            # Add logo_url column if it doesn't exist
            if 'logo_url' not in existing_columns:
                logger.info("Adding logo_url column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN logo_url VARCHAR(255)"
                ))
            
            # Add primary_color column if it doesn't exist
            if 'primary_color' not in existing_columns:
                logger.info("Adding primary_color column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN primary_color VARCHAR(20) DEFAULT '#4F46E5'"
                ))
            
            # Add secondary_color column if it doesn't exist
            if 'secondary_color' not in existing_columns:
                logger.info("Adding secondary_color column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN secondary_color VARCHAR(20) DEFAULT '#10B981'"
                ))
            
            # Add time_zone column if it doesn't exist
            if 'time_zone' not in existing_columns:
                logger.info("Adding time_zone column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN time_zone VARCHAR(50) DEFAULT 'Asia/Kolkata'"
                ))
            
            # Add custom_settings column if it doesn't exist
            if 'custom_settings' not in existing_columns:
                logger.info("Adding custom_settings column")
                conn.execute(text(
                    "ALTER TABLE tenant_settings ADD COLUMN custom_settings JSONB"
                ))
            
            # Commit the transaction
            conn.commit()
            
        logger.info("Migration completed successfully!")
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_migration()