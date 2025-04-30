/**
 * Approver Helpers - Utility functions for approver formatting and management
 * 
 * This module provides helper functions for working with workflow approvers
 * including formatting and validation.
 */

/**
 * Format approver data for display
 * 
 * @param {Object} approverData - The approver data object
 * @returns {string} Formatted approver text for display
 */
export const formatApproverDisplay = (approverData) => {
  if (!approverData) {
    return '';
  }
  
  const { approvers, approvalType } = approverData;
  
  // Approver list as comma-separated labels
  const approverText = Array.isArray(approvers)
    ? approvers.map(a => a.label).join(', ')
    : '';
  
  // Add approval type prefix
  const approvalTypeText = approvalType === 'any'
    ? 'Any of: '
    : 'All of: ';
  
  return `${approvalTypeText}${approverText}`;
};

/**
 * Validate approver data for completeness
 * 
 * @param {Object} approverData - The approver data to validate
 * @returns {boolean} Whether the approver data is valid
 */
export const validateApproverData = (approverData) => {
  if (!approverData) {
    return false;
  }
  
  // Check required fields
  const { approvers, approvalType } = approverData;
  
  // Approval type should be either 'any' or 'all'
  if (approvalType !== 'any' && approvalType !== 'all') {
    return false;
  }
  
  // Approvers should be a non-empty array
  if (!Array.isArray(approvers) || approvers.length === 0) {
    return false;
  }
  
  // Each approver should have a label and value
  return approvers.every(approver => 
    approver && approver.label && approver.value
  );
};

/**
 * Extract approver IDs from approver data
 * 
 * @param {Object} approverData - The approver data object
 * @returns {Array} Array of approver IDs/values
 */
export const getApproverIds = (approverData) => {
  if (!approverData || !Array.isArray(approverData.approvers)) {
    return [];
  }
  
  return approverData.approvers.map(approver => approver.value);
};

/**
 * Format approver data for API submission
 * 
 * @param {Object} approverData - The approver data from UI
 * @returns {Object} Formatted data for API
 */
export const formatApproverForSubmission = (approverData) => {
  if (!approverData) {
    return null;
  }
  
  const { approvers, approvalType } = approverData;
  
  // Format the data as needed by the API
  return {
    type: 'approver',
    approvalType,
    approverIds: getApproverIds(approverData)
  };
};

export default {
  formatApproverDisplay,
  validateApproverData,
  getApproverIds,
  formatApproverForSubmission
};