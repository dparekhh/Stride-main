/**
 * Filter utilities for the Reimbursements page
 * 
 * Contains helper functions for filtering and formatting reimbursement
 * transaction data.
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

// Date range filtering function
const filterTransactionsByDate = (transactions, dateRange) => {
  if (!dateRange || dateRange === "Current month") {
    return transactions;
  }
  
  const today = new Date();
  let startDate, endDate;
  
  switch(dateRange) {
    case "Last 7 days":
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      endDate = today;
      break;
    case "Last 30 days":
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      endDate = today;
      break;
    case "Last 90 days":
      startDate = new Date();
      startDate.setDate(today.getDate() - 90);
      endDate = today;
      break;
    case "Current month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "Previous month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "Current year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = today;
      break;
    default:
      return transactions;
  }
  
  return transactions.filter(transaction => {
    const txDate = new Date(transaction.transactionDate.replace(/\//g, '-'));
    return txDate >= startDate && txDate <= endDate;
  });
};

// Export the filter utilities
export const filterUtils = {
  formatCurrency,
  formatDate,
  filterTransactionsByDate
};

export default filterUtils;