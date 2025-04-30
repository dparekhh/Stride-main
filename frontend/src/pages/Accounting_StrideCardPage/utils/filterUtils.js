/**
 * Utility functions for filtering and processing transaction data
 */

// Helper function to convert date formats for comparison
const convertToDate = (dateString) => {
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
  return date;
};

// Function to filter transactions based on date range
const filterTransactionsByDate = (transactions, dateRange) => {
  if (dateRange === "Current month") {
    return transactions;
  }
  
  let startDate, endDate;
  
  // Determine date range based on selected option
  switch (dateRange) {
    case "Last month":
      const lastMonth = getLastMonth();
      startDate = new Date(lastMonth.start);
      endDate = new Date(lastMonth.end);
      break;
    case "Today":
      const today = getToday();
      startDate = new Date(today.start);
      endDate = new Date(today.end);
      break;
    case "Yesterday":
      const yesterday = getYesterday();
      startDate = new Date(yesterday.start);
      endDate = new Date(yesterday.end);
      break;
    default:
      // Custom date range (to be implemented if needed)
      return transactions;
  }
  
  // Filter transactions based on transaction date
  return transactions.filter(tx => {
    const txDate = convertToDate(tx.transactionDate);
    return txDate >= startDate && txDate <= endDate;
  });
};

// Date helper functions
const getCurrentMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0]
  };
};

const getLastMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
  return {
    start: firstDay.toISOString().split('T')[0],
    end: lastDay.toISOString().split('T')[0]
  };
};

const getToday = () => {
  const today = new Date().toISOString().split('T')[0];
  return { start: today, end: today };
};

const getYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return { start: yesterdayStr, end: yesterdayStr };
};

export const filterUtils = {
  filterTransactionsByDate,
  convertToDate,
  getCurrentMonth,
  getLastMonth,
  getToday,
  getYesterday
};