"""
Bill schema validation - Compatibility Module.

This module is maintained for backward compatibility.
All schema definitions have been consolidated in bill_schemas.py.
"""

import logging
from schemas.bill_schemas import (
    BillLineItemSchema,
    BillQuerySchema,
    LegacyBillSchema as BillSchema,
    LegacyBillUpdateSchema as BillUpdateSchema,
    BillApprovalSchema,
    BillPaymentSchema
)

logging.getLogger(__name__).info("Using consolidated bill schemas from bill_schemas.py")