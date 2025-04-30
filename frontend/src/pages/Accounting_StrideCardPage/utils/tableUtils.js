/**
 * Utility functions for table operations in the Stride Card page
 */

// Format currency values with appropriate currency symbol
const formatCurrency = (amount, currency = "INR") => {
  // If amount is already a formatted string with a currency symbol, return it as is
  if (typeof amount === 'string' && 
      (amount.includes('₹') || amount.includes('$') || amount.includes('€') || amount.includes('£'))) {
    return amount;
  }
  
  // Default to INR (₹) if no currency provided
  const currencySymbol = currency === "INR" ? "₹" : 
                        currency === "USD" ? "$" : 
                        currency === "EUR" ? "€" : 
                        currency === "GBP" ? "£" : "₹";
  
  // Check if amount is a valid number
  if (amount === undefined || amount === null || isNaN(parseFloat(amount))) {
    return `${currencySymbol}0.00`;
  }
  
  // Format with 2 decimal places
  return `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
};

// Format date values to a consistent format
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  // Support for different date formats
  let date;
  if (dateString.includes('/')) {
    // DD/MM/YYYY format
    const parts = dateString.split('/');
    date = new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    // ISO format (YYYY-MM-DD)
    date = new Date(dateString);
  }
  
  // Return in DD/MM/YYYY format
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

// Get appropriate class name for approval status
const getApprovalStatusClass = (status) => {
  switch(status) {
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Awaiting cardholder":
      return "bg-yellow-100 text-yellow-800";
    case "Awaiting reviewer":
      return "bg-blue-100 text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get appropriate class name for policy compliance
const getPolicyComplianceClass = (compliance) => {
  switch(compliance) {
    case "Compliant":
      return "bg-green-100 text-green-800";
    case "Flagged":
      return "bg-red-100 text-red-800";
    case "Warning":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get appropriate class name for receipt status
const getReceiptStatusClass = (status) => {
  switch(status) {
    case "Attached":
      return "bg-green-100 text-green-800";
    case "Missing":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get appropriate class for transaction status badge
const getActionStatusClass = (status) => {
  switch(status) {
    case "Synced":
      return "bg-green-100 text-green-800";
    case "Needs review":
      return "bg-yellow-100 text-yellow-800";
    case "Ready to sync":
      return "bg-blue-100 text-blue-800";
    case "Waiting for cardholder":
      return "bg-purple-100 text-purple-800";
    case "Follow-up required":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const tableUtils = {
  formatCurrency,
  formatDate,
  getApprovalStatusClass,
  getPolicyComplianceClass,
  getReceiptStatusClass,
  getActionStatusClass
};