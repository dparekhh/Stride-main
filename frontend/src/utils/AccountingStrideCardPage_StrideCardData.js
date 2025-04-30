/**
 * AccountingStrideCardPage_StrideCardData.js - Data store for Stride Card transactions
 * 
 * This utility file centralizes all transaction data and helper functions for the Stride Card page.
 * It follows the pattern established in accountingData.js and data.js to provide a consistent
 * data management approach that can easily switch between mock data and API data in the future.
 */

import people, { departments, locations } from './PeoplePage_PlaceholderPeople';

/**
 * Format currency helper function 
 * This is a local implementation to avoid circular dependencies
 */
const formatCurrency = (amount) => {
  if (!amount) return '₹0.00';
  
  // If already formatted, return as is
  if (typeof amount === 'string' && amount.includes('₹')) {
    return amount;
  }
  
  // Otherwise, format the number
  try {
    const numericAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
      : amount;
      
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(numericAmount);
  } catch (e) {
    console.error('Error formatting currency amount:', e);
    return `₹${amount}`;
  }
};

/**
 * Import the data only after defining the helper functions
 */
import MOCK_CARD_TRANSACTION_EXPENSES, { 
  getPolicyComplianceText, 
  formatDateToDDMMYYYY
} from './Expenses_CardTransactionPageData';

/**
 * Sample mock data for card transactions with Indian context
 * This is now derived from MOCK_CARD_TRANSACTION_EXPENSES in Expenses_CardTransactionPageData.js
 * to ensure consistency across the application
 * 
 * Uses cardholder names, departments, and locations from PeoplePage_PlaceholderPeople.js
 */
// Initialize with an empty array first to prevent circular reference issues
export const MOCK_STRIDE_CARD_TRANSACTIONS = [];

// Then we'll populate it later after all functions are defined

/**
 * Fetch transactions from the backend API or use mock data
 * @param {Object} options - Query parameters and filtering options
 * @returns {Promise} - Promise that resolves to an array of transactions
 */
export const fetchTransactions = (options = {}) => {
  // Return mock data immediately - no async/Promise
  // This ensures data is available right away for the UI
  
  try {
    // Get transactions from Expenses_CardTransactionPageData and convert format
    // This allows us to maintain backward compatibility while using the new data source
    const convertedTransactions = convertExpensesToStrideCardFormat(MOCK_CARD_TRANSACTION_EXPENSES);
    
    // Start with a copy of the transactions, using the converted data
    let filteredData = [...convertedTransactions];
        
        // Apply search filter if provided
        if (options.searchTerm) {
          const searchLower = options.searchTerm.toLowerCase();
          filteredData = filteredData.filter(tx => 
            tx.merchant.toLowerCase().includes(searchLower) ||
            tx.transactionId.toLowerCase().includes(searchLower) ||
            tx.cardholder.toLowerCase().includes(searchLower) ||
            (tx.cardName && tx.cardName.toLowerCase().includes(searchLower)) ||
            (tx.notes && tx.notes.toLowerCase().includes(searchLower)) ||
            (tx.department && tx.department.toLowerCase().includes(searchLower)) ||
            (tx.location && tx.location.toLowerCase().includes(searchLower))
          );
        }
        
        // Apply date range filter if provided
        if (options.startDate && options.endDate) {
          // Convert ISO dates (YYYY-MM-DD) to DD/MM/YYYY for filtering
          const convertDate = (isoDate) => {
            const date = new Date(isoDate);
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          };
          
          // Parse dates for comparison
          const parseDate = (dateStr) => {
            if (dateStr.includes('-')) {
              // ISO format (YYYY-MM-DD)
              return new Date(dateStr);
            } else {
              // DD/MM/YYYY format
              const [day, month, year] = dateStr.split('/').map(Number);
              return new Date(year, month - 1, day);
            }
          };
          
          const startDate = parseDate(options.startDate);
          const endDate = parseDate(options.endDate);
          
          // Add one day to endDate to make it inclusive
          endDate.setDate(endDate.getDate() + 1);
          
          filteredData = filteredData.filter(tx => {
            if (!tx.transactionDate) return false;
            const txDate = parseDate(tx.transactionDate);
            return txDate >= startDate && txDate < endDate;
          });
        }
        
        // Apply single status filter if provided
        if (options.status) {
          filteredData = filteredData.filter(tx => tx.approvalStatus === options.status);
        }
        // Apply multiple status filters if needed
        else if (options.statuses && options.statuses.length > 0) {
          filteredData = filteredData.filter(tx => 
            options.statuses.includes(tx.approvalStatus)
          );
        }
        
        // Calculate total count for pagination
        const totalCount = filteredData.length;
        
        // Apply pagination if requested
        if (options.page && options.pageSize) {
          const startIndex = (options.page - 1) * options.pageSize;
          filteredData = filteredData.slice(startIndex, startIndex + options.pageSize);
        }
        
    // Return data with pagination info directly - no async/Promise
    return {
      data: filteredData,
      pagination: {
        total: totalCount,
        page: options.page || 1,
        pageSize: options.pageSize || totalCount,
        totalPages: Math.ceil(totalCount / (options.pageSize || totalCount))
      }
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { data: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 } };
  }
};

/**
 * Update a transaction's accounting category
 * @param {string} transactionId - ID of the transaction to update
 * @param {string} categoryName - Category name to assign
 * @returns {Promise} - Promise that resolves to the updated transaction
 */
export const updateTransactionCategory = (transactionId, categoryName) => {
  try {
    // Get converted transactions
    const convertedTransactions = convertExpensesToStrideCardFormat(MOCK_CARD_TRANSACTION_EXPENSES);
    
    // Find the transaction by ID 
    const transaction = convertedTransactions.find(t => t.id.toString() === transactionId.toString());
    
    if (!transaction) {
      return { 
        success: false, 
        error: 'Transaction not found' 
      };
    }
    
    // Return a successful response immediately
    return { 
      success: true, 
      data: {
        ...transaction,
        accountingCategory: categoryName
      }
    };
  } catch (error) {
    console.error('Error updating transaction category:', error);
    return { success: false, error: 'Failed to update transaction category' };
  }
};

/**
 * Filter transactions by search term
 * @param {Array} transactions - Array of transactions to filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsBySearchTerm = (transactions, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return transactions;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return transactions.filter(transaction => 
    (transaction.merchant && transaction.merchant.toLowerCase().includes(term)) ||
    (transaction.transactionId && transaction.transactionId.toLowerCase().includes(term)) ||
    (transaction.cardholder && transaction.cardholder.toLowerCase().includes(term)) ||
    (transaction.cardName && transaction.cardName.toLowerCase().includes(term)) ||
    (transaction.notes && transaction.notes.toLowerCase().includes(term)) ||
    (transaction.accountingCategory && transaction.accountingCategory.toLowerCase().includes(term)) ||
    (transaction.department && transaction.department.toLowerCase().includes(term)) ||
    (transaction.location && transaction.location.toLowerCase().includes(term))
  );
};

/**
 * Filter transactions by date range
 * @param {Array} transactions - Array of transactions to filter
 * @param {string} startDate - Start date in DD/MM/YYYY format
 * @param {string} endDate - End date in DD/MM/YYYY format
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  if (!startDate || !endDate) {
    return transactions;
  }
  
  // Convert DD/MM/YYYY to Date objects
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  return transactions.filter(transaction => {
    if (!transaction.transactionDate) return false;
    const txDate = parseDate(transaction.transactionDate);
    return txDate >= start && txDate <= end;
  });
};

/**
 * Determine if transaction requires attention
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction needs attention
 */
export const transactionRequiresAttention = (transaction) => {
  if (!transaction) return false;
  
  return (
    transaction.approvalStatus === 'Awaiting cardholder' ||
    transaction.policyCompliance === 'Flagged' ||
    transaction.reconciledStatus === 'Pending' ||
    !transaction.accountingCategory || 
    transaction.accountingCategory.trim() === ''
  );
};

/**
 * Get transactions that require action
 * @param {Array} transactions - Array of all transactions
 * @returns {Array} - Transactions requiring attention
 */
export const getTransactionsRequiringAction = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return [];
  return transactions.filter(transactionRequiresAttention);
};

/**
 * Format currency amount for display
 * @param {string} amount - Amount in string format (e.g., "₹1,500.00")
 * @returns {string} - Formatted amount
 */
export const formatCurrencyAmount = (amount) => {
  if (!amount) return '₹0.00';
  
  // If already formatted, return as is
  if (typeof amount === 'string' && amount.includes('₹')) {
    return amount;
  }
  
  // Otherwise, format the number
  try {
    const numericAmount = typeof amount === 'string' 
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ''))
      : amount;
      
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(numericAmount);
  } catch (e) {
    console.error('Error formatting currency amount:', e);
    return `₹${amount}`;
  }
};

/**
 * Create exportable data for CSV/Excel export
 * @param {Array} transactions - Transactions to export
 * @param {Array} columns - Visible columns configuration
 * @returns {Array} - Data ready for export
 */
export const createExportableData = (transactions, columns) => {
  if (!transactions || !Array.isArray(transactions) || !columns || !Array.isArray(columns)) {
    return [];
  }
  
  // Get visible columns
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);
  
  // Create header row
  const headers = visibleColumns.map(col => col.name);
  
  // Create data rows
  const dataRows = transactions.map(transaction => {
    return visibleColumns.map(column => {
      switch (column.id) {
        case 'merchant':
          return transaction.merchant || '';
        case 'amount':
          return transaction.amount || '';
        case 'cardholder':
          return transaction.cardholder || '';
        case 'cardName':
          return transaction.cardName || '';
        case 'transactionDate':
          return transaction.transactionDate || '';
        case 'accountingCategory':
          return transaction.accountingCategory || '';
        case 'spentFrom':
          return transaction.spentFrom || '';
        case 'approvalStatus':
          return transaction.approvalStatus || '';
        case 'policyCompliance':
          return transaction.policyCompliance || '';
        case 'notes':
          return transaction.notes || '';
        case 'receiptStatus':
          return transaction.receiptStatus ? 'Yes' : 'No';
        case 'clearedDate':
          return transaction.clearedDate || '';
        case 'transactionId':
          return transaction.transactionId || '';
        case 'cardLimit':
          return transaction.cardLimit || '';
        case 'reconciledStatus':
          return transaction.reconciledStatus || '';
        case 'department':
          return transaction.department || '';
        case 'location':
          return transaction.location || '';
        default:
          return '';
      }
    });
  });
  
  return [headers, ...dataRows];
};

/**
 * Convert transaction data from Expenses_CardTransactionPageData format to Stride Card format
 * This allows us to maintain backward compatibility while using the new data source
 * 
 * @param {Array} expensesTransactions - Transactions from Expenses_CardTransactionPageData
 * @returns {Array} - Transactions in AccountingStrideCardPage_StrideCardData format
 */
export const convertExpensesToStrideCardFormat = (expensesTransactions = []) => {
  if (!expensesTransactions || !expensesTransactions.length) {
    return [];
  }
  
  return expensesTransactions.map(tx => ({
    id: tx.id,
    transactionId: tx.transactionId || `TXN-${new Date().getFullYear()}-${tx.id.toString().padStart(4, '0')}`,
    merchant: tx.merchant,
    logo: tx.logo || tx.merchant.charAt(0),
    mccCategory: tx.merchantDescription || tx.category,
    amount: formatCurrency(tx.amount),
    transactionDate: tx.transactionDate.replace(/-/g, '/'), // Convert DD-MM-YYYY to DD/MM/YYYY
    cardholder: tx.cardholder,
    cardName: tx.card,
    email: people.find(p => p.name === tx.cardholder)?.email || '',
    accountingCategory: tx.category,
    accountingDate: tx.approvedDate ? formatDateToDDMMYYYY(tx.approvedDate).replace(/-/g, '/') : '',
    clearedDate: tx.submissionDate ? formatDateToDDMMYYYY(tx.submissionDate).replace(/-/g, '/') : '',
    accountingNotes: tx.memo,
    approvalStatus: tx.approvalStatus,
    policyCompliance: getPolicyComplianceText(tx),
    notes: tx.memo,
    receiptStatus: tx.receiptAttached,
    spentFrom: tx.spentFrom,
    cardLimit: formatCurrency(tx.limit),
    reconciledStatus: tx.approvalStatus === 'Approved' ? 'Reconciled' : 'Pending',
    department: tx.department,
    location: tx.location
  }));
};

/**
 * Helper functions for using PeoplePage data in Stride Card transactions
 */

/**
 * Get a list of all employee names from PeoplePage_PlaceholderPeople
 * These can be used as cardholders in transactions
 * 
 * @returns {Array} - Array of employee names
 */
export const getCardholderNames = () => {
  return people.map(person => person.name);
};

/**
 * Get departments list from PeoplePage_PlaceholderPeople
 * 
 * @returns {Array} - Array of department names
 */
export const getAvailableDepartments = () => {
  return departments;
};

/**
 * Get locations list from PeoplePage_PlaceholderPeople
 * 
 * @returns {Array} - Array of location names
 */
export const getAvailableLocations = () => {
  return locations;
};

// Now that all functions are defined, we can populate the MOCK_STRIDE_CARD_TRANSACTIONS 
// array with data from Expenses_CardTransactionPageData.js
(() => {
  try {
    // Clear the array first (keep the same reference)
    MOCK_STRIDE_CARD_TRANSACTIONS.length = 0;
    
    // Get the converted transactions
    const converted = convertExpensesToStrideCardFormat(MOCK_CARD_TRANSACTION_EXPENSES);
    
    // Add them to the existing array (preserving the reference)
    MOCK_STRIDE_CARD_TRANSACTIONS.push(...converted);
  } catch (error) {
    console.error('Error initializing MOCK_STRIDE_CARD_TRANSACTIONS:', error);
  }
})();