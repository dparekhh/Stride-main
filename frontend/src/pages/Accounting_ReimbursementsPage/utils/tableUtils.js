/**
 * Table utilities for the Reimbursements page
 * 
 * Contains helper functions for table formatting and display.
 */

// Helper function to format currency values
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to format dates
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  // If the date is already in the DD/MM/YYYY format, return it
  if (dateString.includes('/')) {
    return dateString;
  }
  
  // Otherwise, parse and format the date
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

// Helper function to get status color classes based on approval status
export const getApprovalStatusColor = (status) => {
  switch(status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get status color classes based on policy compliance
export const getPolicyComplianceColor = (compliance) => {
  switch(compliance) {
    case 'Compliant':
      return 'bg-green-100 text-green-800';
    case 'Flagged':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get receipt status label
export const getReceiptStatusLabel = (receiptAttached) => {
  return receiptAttached ? 'Attached' : 'Missing';
};

// Helper function to get receipt status color
export const getReceiptStatusColor = (receiptAttached) => {
  return receiptAttached 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

// Export the table utilities
export const tableUtils = {
  formatCurrency,
  formatDate,
  getApprovalStatusColor,
  getPolicyComplianceColor,
  getReceiptStatusLabel,
  getReceiptStatusColor
};

export default tableUtils;