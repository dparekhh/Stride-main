/**
 * Formatting Utilities - Helper functions for text and value formatting
 * 
 * This module provides utility functions for formatting text and values
 * in a consistent way throughout the WorkflowBuilder.
 */

/**
 * Format a currency value according to Indian currency format
 * 
 * @param {number} amount - The amount to format
 * @param {string} [currency='₹'] - The currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) {
    return '';
  }
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN
  if (isNaN(numAmount)) {
    return '';
  }
  
  // Format with Indian locale
  return `${currency}${numAmount.toLocaleString('en-IN')}`;
};

/**
 * Truncate a string to a maximum length with ellipsis
 * 
 * @param {string} text - The text to truncate
 * @param {number} [maxLength=50] - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
};

/**
 * Format a date for display
 * 
 * @param {Date|string} date - The date to format
 * @param {string} [format='medium'] - Format style ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = {
      short: { day: '2-digit', month: '2-digit', year: '2-digit' },
      medium: { day: '2-digit', month: 'short', year: 'numeric' },
      long: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
    };
    
    return dateObj.toLocaleDateString('en-IN', options[format] || options.medium);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format a list of items for display
 * 
 * @param {Array} items - The items to format
 * @param {string} [conjunction='and'] - Conjunction to use for the last item
 * @returns {string} Formatted list
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || !Array.isArray(items)) {
    return '';
  }
  
  if (items.length === 0) {
    return '';
  }
  
  if (items.length === 1) {
    return String(items[0]);
  }
  
  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

/**
 * Format a number with thousand separators
 * 
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) {
    return '';
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  // Handle NaN
  if (isNaN(numValue)) {
    return '';
  }
  
  return numValue.toLocaleString('en-IN');
};

export default {
  formatCurrency,
  truncateText,
  formatDate,
  formatList,
  formatNumber
};