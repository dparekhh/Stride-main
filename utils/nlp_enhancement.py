"""
NLP Enhancement Utils - Compatibility Module

This module is maintained for backward compatibility.
All functionality has been consolidated in utils/nlp.py.
"""

import logging
from typing import Dict, Any, Optional, List
from utils.nlp import (
    enhance_extraction_with_nlp,
    correct_field_values,
    extract_line_item_descriptions,
    categorize_expense_simple as categorize_expense
)

# Additional import for backward compatibility
from utils.nlp import classify_document

logger = logging.getLogger(__name__)
logger.info("Using consolidated NLP utilities from utils/nlp.py")