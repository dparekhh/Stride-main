"""
Test script for the Document AI usage tracking module

This script tests both the functional interface and the class interface
to ensure that usage tracking works correctly with multi-tenant isolation.
"""

import os
import json
import unittest
from unittest.mock import patch, mock_open, MagicMock

from utils.document_ai.usage_tracker import (
    DocumentAIUsageTracker,
    track_api_call,
    get_usage_stats,
    reset_usage_stats,
    _get_empty_stats,
    STATS_FILE
)


class TestDocumentAIUsageTracker(unittest.TestCase):
    """Test case for Document AI usage tracking"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Create a mock for file operations that returns empty stats
        self.empty_stats = _get_empty_stats()
        self.stats_dict = self.empty_stats.copy()
        
        # Create patchers for file operations
        self.file_patcher = patch('utils.document_ai.usage_tracker._load_stats')
        self.save_patcher = patch('utils.document_ai.usage_tracker._save_stats')
        
        # Start the patchers
        self.mock_load = self.file_patcher.start()
        self.mock_save = self.save_patcher.start()
        
        # Configure the mock to return our stats dictionary
        self.mock_load.return_value = self.stats_dict
        
        # Configure save to update our dictionary
        def update_stats(stats):
            self.stats_dict = stats
        
        self.mock_save.side_effect = update_stats
    
    def tearDown(self):
        """Clean up after tests"""
        self.file_patcher.stop()
        self.save_patcher.stop()
    
    def test_track_api_call(self):
        """Test tracking API calls"""
        # Test OCR tracking
        result = track_api_call(use_nlp=False, page_count=2)
        self.assertEqual(result["call_type"], "ocr")
        self.assertEqual(result["page_count"], 2)
        
        # Verify the mock was called with updated stats
        self.mock_save.assert_called()
    
    def test_class_interface(self):
        """Test the class interface"""
        # Test the class interface for OCR tracking
        with patch('utils.document_ai.usage_tracker.track_api_call') as mock_track:
            mock_track.return_value = {"call_type": "ocr"}
            result = DocumentAIUsageTracker.track_ocr_call(tenant_id=1, page_count=5)
            mock_track.assert_called_with(use_nlp=False, page_count=5, tenant_id=1)
            self.assertEqual(result["call_type"], "ocr")
        
        # Test the class interface for getting usage stats
        with patch('utils.document_ai.usage_tracker.get_usage_stats') as mock_get:
            mock_get.return_value = {"total_calls": 0}
            DocumentAIUsageTracker.get_usage_stats(tenant_id=1)
            mock_get.assert_called_with(1)
    
    def test_get_usage_stats(self):
        """Test getting usage statistics"""
        # Set up mock stats with tenant data
        test_stats = {
            "total_calls": 10,
            "total_pages": 20,
            "total_cost": 0.5,
            "ocr_calls": 8,
            "ocr_pages": 15,
            "ocr_cost": 0.1,
            "nlp_calls": 2,
            "nlp_pages": 5,
            "nlp_cost": 0.4,
            "tenants": {
                "1": {
                    "total_calls": 5,
                    "total_pages": 10,
                    "total_cost": 0.25,
                    "ocr_calls": 4,
                    "ocr_pages": 8,
                    "ocr_cost": 0.05,
                    "nlp_calls": 1,
                    "nlp_pages": 2,
                    "nlp_cost": 0.2
                }
            }
        }
        self.mock_load.return_value = test_stats
        
        # Test global stats
        global_stats = get_usage_stats()
        self.assertEqual(global_stats["total_calls"], 10)
        self.assertEqual(global_stats["ocr_calls"], 8)
        self.assertEqual(global_stats["nlp_calls"], 2)
        self.assertNotIn("tenants", global_stats)
        
        # Test tenant stats
        tenant_stats = get_usage_stats(tenant_id=1)
        self.assertEqual(tenant_stats["total_calls"], 5)
        self.assertEqual(tenant_stats["ocr_calls"], 4)
        self.assertEqual(tenant_stats["nlp_calls"], 1)
        
        # Test nonexistent tenant
        new_tenant_stats = get_usage_stats(tenant_id=999)
        self.assertEqual(new_tenant_stats["total_calls"], 0)
        self.assertEqual(new_tenant_stats["total_cost"], 0.0)


if __name__ == '__main__':
    unittest.main()