"""
Bill management routes for the Stride platform - Compatibility Layer.

This module is maintained for backward compatibility.
All route implementations have been consolidated in bills_consolidated.py.
"""

import logging

# Import the shared blueprint and all routes from the consolidated module
# This ensures all routes are registered on the same blueprint
from routes.bills_consolidated import bills_bp

logger = logging.getLogger(__name__)
logger.info("Using consolidated bill routes from bills_consolidated.py")
