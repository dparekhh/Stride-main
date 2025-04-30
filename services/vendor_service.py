"""Business logic for vendor management."""
import logging
from typing import Dict, Any, List, Tuple, Optional
from marshmallow import ValidationError
from models import Vendor, db
from utils.bill_utils import create_vendor_details, check_vendor_exists
from schemas.vendor_schema import VendorSchema, InvoiceVendorSchema

logger = logging.getLogger(__name__)

class VendorService:
    """Service class for vendor management operations."""
    def __init__(self, tenant_id: int):
        self.tenant_id = tenant_id

    def get_all_vendors(self) -> List[Dict[str, Any]]:
        """Retrieve all vendors for the tenant."""
        vendors = Vendor.query.filter_by(tenant_id=self.tenant_id).all()
        return [
            {
                'id': vendor.id,
                'name': vendor.name,
                'gstin': vendor.gstin,
                'pan': vendor.pan,
                'email': vendor.email,
                'phone': vendor.phone,
                'address': vendor.address,
                'category': vendor.category
            } for vendor in vendors
        ]
        
    def get_vendor(self, vendor_id: int) -> Dict[str, Any]:
        """Retrieve a specific vendor by ID."""
        vendor = Vendor.query.filter_by(id=vendor_id, tenant_id=self.tenant_id).first()
        if not vendor:
            raise ValueError(f"Vendor with ID {vendor_id} not found")
        return create_vendor_details(vendor)

    def create_vendor(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new vendor with the provided data."""
        try:
            validated_data = VendorSchema().load(data)
        except ValidationError as err:
            raise ValueError(str(err.messages))

        vendor_exists, vendor_details, potential_vendors = check_vendor_exists(
            vendor_name=validated_data['name'],
            vendor_gstin=validated_data.get('gstin'),
            tenant_id=self.tenant_id
        )
        if vendor_exists:
            raise ValueError("Vendor already exists")
        
        from utils.exception_utils import DataValidationError
        if potential_vendors:
            raise DataValidationError("Similar vendors exist", extra_data={'potential_vendors': potential_vendors})

        vendor = Vendor(
            name=validated_data['name'],
            gstin=validated_data.get('gstin', ''),
            pan=validated_data.get('pan', ''),
            email=validated_data.get('email', ''),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            category=validated_data.get('category', ''),
            tenant_id=self.tenant_id
        )
        db.session.add(vendor)
        db.session.commit()
        logger.info(f"Vendor created: ID {vendor.id} for tenant {self.tenant_id}")
        return create_vendor_details(vendor)
        
    def update_vendor(self, vendor_id: int, data: Dict[str, Any]) -> None:
        """Update an existing vendor with the provided data."""
        vendor = Vendor.query.filter_by(id=vendor_id, tenant_id=self.tenant_id).first()
        if not vendor:
            raise ValueError(f"Vendor with ID {vendor_id} not found")
            
        try:
            validated_data = VendorSchema().load(data, partial=True)
        except ValidationError as err:
            raise ValueError(str(err.messages))
            
        # Update vendor fields
        if 'name' in validated_data:
            vendor.name = validated_data['name']
        if 'gstin' in validated_data:
            vendor.gstin = validated_data['gstin']
        if 'pan' in validated_data:
            vendor.pan = validated_data['pan']
        if 'email' in validated_data:
            vendor.email = validated_data['email']
        if 'phone' in validated_data:
            vendor.phone = validated_data['phone']
        if 'address' in validated_data:
            vendor.address = validated_data['address']
        if 'category' in validated_data:
            vendor.category = validated_data['category']
            
        db.session.commit()
        logger.info(f"Vendor updated: ID {vendor.id} for tenant {self.tenant_id}")
        
    def delete_vendor(self, vendor_id: int) -> None:
        """Delete a vendor by ID."""
        vendor = Vendor.query.filter_by(id=vendor_id, tenant_id=self.tenant_id).first()
        if not vendor:
            raise ValueError(f"Vendor with ID {vendor_id} not found")
            
        # Check if vendor has associated bills
        if hasattr(vendor, 'bills') and vendor.bills:
            raise ValueError("Cannot delete vendor with associated bills")
            
        db.session.delete(vendor)
        db.session.commit()
        logger.info(f"Vendor deleted: ID {vendor_id} for tenant {self.tenant_id}")

    def check_if_vendor_exists(self, vendor_name: Optional[str] = None, vendor_gstin: Optional[str] = None) -> Tuple[bool, Optional[Dict[str, Any]], List[Dict[str, Any]]]:
        """Check if a vendor exists in the database."""
        if not vendor_name and not vendor_gstin:
            raise ValueError("Either vendor_name or vendor_gstin must be provided")
        return check_vendor_exists(vendor_name=vendor_name, vendor_gstin=vendor_gstin, tenant_id=self.tenant_id)

    def create_vendor_from_invoice(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a vendor from extracted invoice data."""
        try:
            validated_data = InvoiceVendorSchema().load(data)
        except ValidationError as err:
            raise ValueError(str(err.messages))

        vendor_exists, vendor_details, potential_vendors = check_vendor_exists(
            vendor_name=validated_data['vendor_name'],
            vendor_gstin=validated_data.get('vendor_gstin'),
            tenant_id=self.tenant_id
        )
        if vendor_exists and vendor_details:
            return vendor_details
            
        from utils.exception_utils import DataValidationError
        if potential_vendors:
            raise DataValidationError("Similar vendors found", extra_data={'potential_vendors': potential_vendors})

        new_vendor = Vendor(
            name=validated_data['vendor_name'],
            gstin=validated_data.get('vendor_gstin', ''),
            pan=validated_data.get('vendor_pan', ''),
            email=validated_data.get('vendor_email', ''),
            phone=validated_data.get('vendor_phone', ''),
            address=validated_data.get('vendor_address', ''),
            category=validated_data.get('vendor_category', ''),
            tenant_id=self.tenant_id
        )
        db.session.add(new_vendor)
        db.session.commit()
        logger.info(f"Vendor created from invoice: ID {new_vendor.id} for tenant {self.tenant_id}")
        return create_vendor_details(new_vendor)
        
    def search_vendors(self, query: str) -> List[Dict[str, Any]]:
        """Search for vendors by name, email, or phone."""
        search_term = f"%{query}%"
        vendors = Vendor.query.filter(
            Vendor.tenant_id == self.tenant_id,
            (Vendor.name.ilike(search_term) | 
             Vendor.email.ilike(search_term) | 
             Vendor.phone.ilike(search_term) |
             Vendor.gstin.ilike(search_term))
        ).all()
        
        return [create_vendor_details(vendor) for vendor in vendors]
    
    def verify_gstin(self, gstin: str) -> Dict[str, Any]:
        """Verify a GSTIN and retrieve business details."""
        if not gstin or len(gstin.strip()) != 15:
            raise ValueError("Invalid GSTIN format")
            
        # In a real implementation, this would call an external API to verify the GSTIN
        # For now, we'll just return a placeholder response
        logger.info(f"GSTIN verification requested for {gstin}")
        return {
            "verified": True,
            "business_name": "Auto-verified Business",
            "gstin": gstin,
            "address": "Auto-verified Address",
            "status": "Active"
        }