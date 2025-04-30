/**
 * Expenses_CardTransactionPageData.js - Data store for Card Transaction Expenses
 * 
 * This utility file centralizes all transaction data and helper functions for the Card Transaction Expenses page.
 * It follows the pattern established in AccountingStrideCardPage_StrideCardData.js to provide a consistent
 * data management approach that can easily switch between mock data and API data in the future.
 */

import people, { departments, locations } from './PeoplePage_PlaceholderPeople';

/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} - Date in DD-MM-YYYY format
 */
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Sample mock data for card transactions expenses with Indian context
 * This will be replaced with API data in production
 * 
 * Uses cardholder names, departments, and locations from PeoplePage_PlaceholderPeople.js
 */
export const MOCK_CARD_TRANSACTION_EXPENSES = [
  {
    id: 1,
    merchant: "Ola Cabs",
    merchantDescription: "Taxi and Rideshare",
    logo: "O",
    date: "2025-03-22",
    transactionDate: "22-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[0].name, // Arjun Sharma
    card: "Business Travel Card",
    flagged: false,
    department: people[0].department,
    category: "Taxi and Rideshare",
    location: people[0].location,
    amount: 1500.00,
    spentFrom: "Office Budget",
    transactionId: "TXN-2025-0001",
    limit: 5000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "Client meeting with IndiaTech",
    flaggedReason: "",
    approverName: people[8].name, // Amit Kumar
    approvedDate: "2025-03-24",
    submissionDate: "2025-03-23"
  },
  {
    id: 2,
    merchant: "Zomato",
    merchantDescription: "Food and Dining",
    logo: "Z",
    date: "2025-03-21",
    transactionDate: "21-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[1].name, // Priya Patel
    card: "Marketing Expenses Card",
    flagged: true,
    department: departments[3], // Marketing
    category: "Food and Dining",
    location: people[1].location,
    amount: 850.00,
    spentFrom: "Marketing Budget",
    transactionId: "TXN-2025-0002",
    limit: 2000.00,
    reviewStatus: "Needs review",
    approvalStatus: "Awaiting reviewer",
    receiptAttached: false,
    memo: "Team lunch order",
    flaggedReason: "Missing receipt",
    approverName: people[3].name, // Neha Sharma
    approvedDate: "",
    submissionDate: "2025-03-22"
  },
  {
    id: 3,
    merchant: "Amazon.in",
    merchantDescription: "Retail",
    logo: "A",
    date: "2025-03-20",
    transactionDate: "20-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[2].name, // Vikram Mehta
    card: "IT Equipment Card",
    flagged: false,
    department: people[2].department,
    category: "Office Supplies",
    location: people[2].location,
    amount: 12500.00,
    spentFrom: "IT Budget",
    transactionId: "TXN-2025-0003",
    limit: 15000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "New monitor and keyboard",
    flaggedReason: "",
    approverName: people[8].name, // Amit Kumar
    approvedDate: "2025-03-21",
    submissionDate: "2025-03-20"
  },
  {
    id: 4,
    merchant: "IndiGo Airlines",
    merchantDescription: "Travel",
    logo: "I",
    date: "2025-03-19",
    transactionDate: "19-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[3].name, // Neha Sharma
    card: "Business Travel Card",
    flagged: false,
    department: people[3].department,
    category: "Travel",
    location: locations[2], // Delhi
    amount: 15800.00,
    spentFrom: "Travel Budget",
    transactionId: "TXN-2025-0004",
    limit: 20000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "Mumbai to Delhi round trip",
    flaggedReason: "",
    approverName: people[4].name, // Rohan Mehta
    approvedDate: "2025-03-20",
    submissionDate: "2025-03-19"
  },
  {
    id: 5,
    merchant: "Taj Hotels",
    merchantDescription: "Lodging",
    logo: "T",
    date: "2025-03-18",
    transactionDate: "18-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[4].name, // Rohan Mehta
    card: "Executive Card",
    flagged: true,
    department: people[4].department,
    category: "Accommodation",
    location: locations[3], // Hyderabad
    amount: 25000.00,
    spentFrom: "Executive Budget",
    transactionId: "TXN-2025-0005",
    limit: 20000.00,
    reviewStatus: "Needs review",
    approvalStatus: "Awaiting cardholder",
    receiptAttached: true,
    memo: "2 nights stay for client meeting",
    flaggedReason: "Amount exceeds accommodation limit",
    approverName: people[8].name, // Amit Kumar
    approvedDate: "",
    submissionDate: "2025-03-19"
  },
  {
    id: 6,
    merchant: "Delhi Metro",
    merchantDescription: "Transportation",
    logo: "D",
    date: "2025-03-17",
    transactionDate: "17-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[5].name, // Ananya Gupta
    card: "Standard Employee Card",
    flagged: false,
    department: departments[7], // Operations
    category: "Transportation",
    location: locations[2], // Delhi
    amount: 120.00,
    spentFrom: "Travel Budget",
    transactionId: "TXN-2025-0006",
    limit: 1000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: false,
    memo: "Office commute",
    flaggedReason: "",
    approverName: people[3].name, // Neha Sharma
    approvedDate: "2025-03-18",
    submissionDate: "2025-03-17"
  },
  {
    id: 7,
    merchant: "Vodafone Idea",
    merchantDescription: "Telecommunication",
    logo: "V",
    date: "2025-03-16",
    transactionDate: "16-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[6].name, // Aditya Singh
    card: "Operations Card",
    flagged: true,
    department: departments[7], // Operations
    category: "Telecommunication",
    location: locations[1], // Mumbai
    amount: 1200.00,
    spentFrom: "Operations Budget",
    transactionId: "TXN-2025-0007",
    limit: 2000.00,
    reviewStatus: "Needs review",
    approvalStatus: "Declined",
    receiptAttached: false,
    memo: "Mobile bill payment",
    flaggedReason: "Missing receipt",
    approverName: people[2].name, // Vikram Mehta
    approvedDate: "",
    submissionDate: "2025-03-17"
  },
  {
    id: 8,
    merchant: "Microsoft Azure",
    merchantDescription: "Software and Cloud",
    logo: "M",
    date: "2025-03-15",
    transactionDate: "15-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[7].name, // Meera Iyer
    card: "Tech Department Card",
    flagged: false,
    department: departments[0], // Engineering
    category: "Software and Cloud",
    location: locations[0], // Bengaluru
    amount: 35000.00,
    spentFrom: "Tech Budget",
    transactionId: "TXN-2025-0008",
    limit: 50000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "Monthly Azure cloud services",
    flaggedReason: "",
    approverName: people[6].name, // Aditya Singh
    approvedDate: "2025-03-16",
    submissionDate: "2025-03-15"
  },
  {
    id: 9,
    merchant: "Flipkart",
    merchantDescription: "Retail",
    logo: "F",
    date: "2025-03-14",
    transactionDate: "14-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[5].name, // Ananya Gupta
    card: "Office Admin Card",
    flagged: false,
    department: departments[9], // Administration
    category: "Office Supplies",
    location: locations[1], // Mumbai
    amount: 7500.00,
    spentFrom: "Admin Budget",
    transactionId: "TXN-2025-0009",
    limit: 10000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "Office stationery and supplies",
    flaggedReason: "",
    approverName: people[3].name, // Neha Sharma
    approvedDate: "2025-03-15",
    submissionDate: "2025-03-14"
  },
  {
    id: 10,
    merchant: "Indian Oil",
    merchantDescription: "Fuel",
    logo: "IO",
    date: "2025-03-13",
    transactionDate: "13-03-2025", // New field in DD-MM-YYYY format
    cardholder: people[0].name, // Arjun Sharma
    card: "Fleet Management Card",
    flagged: false,
    department: departments[7], // Operations
    category: "Fuel",
    location: locations[2], // Delhi
    amount: 5000.00,
    spentFrom: "Fleet Budget",
    transactionId: "TXN-2025-0010",
    limit: 8000.00,
    reviewStatus: "Reviewed",
    approvalStatus: "Approved",
    receiptAttached: true,
    memo: "Company vehicle refuel",
    flaggedReason: "",
    approverName: people[2].name, // Vikram Mehta
    approvedDate: "2025-03-14",
    submissionDate: "2025-03-13"
  }
];

/**
 * Fetch card transaction expenses from the backend API or use mock data
 * @param {Object} options - Query parameters and filtering options
 * @returns {Promise} - Promise that resolves to an array of transactions
 */
export const fetchCardTransactionExpenses = (options = {}) => {
  // Return mock data immediately - no async/Promise needed
  // This ensures data is available right away for the UI
  
  try {
    // Start with a copy of the mock transactions
    let filteredData = [...MOCK_CARD_TRANSACTION_EXPENSES];
        
    // Apply search filter if provided
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filteredData = filteredData.filter(tx => 
        tx.merchant.toLowerCase().includes(searchLower) ||
        tx.cardholder.toLowerCase().includes(searchLower) ||
        (tx.card && tx.card.toLowerCase().includes(searchLower)) ||
        (tx.memo && tx.memo.toLowerCase().includes(searchLower)) ||
        (tx.department && tx.department.toLowerCase().includes(searchLower)) ||
        (tx.location && tx.location.toLowerCase().includes(searchLower)) ||
        (tx.category && tx.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply date range filter if provided
    if (options.startDate && options.endDate) {
      // Parse dates for comparison
      const parseDate = (dateStr) => {
        // Handle both formats - YYYY-MM-DD and DD/MM/YYYY
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
        if (!tx.date) return false;
        const txDate = parseDate(tx.date);
        return txDate >= startDate && txDate < endDate;
      });
    }
    
    // Apply approval status filter if provided
    if (options.approvalStatus) {
      filteredData = filteredData.filter(tx => tx.approvalStatus === options.approvalStatus);
    }
    
    // Apply review status filter if provided
    if (options.reviewStatus) {
      filteredData = filteredData.filter(tx => tx.reviewStatus === options.reviewStatus);
    }
    
    // Apply flagged filter if provided
    if (options.flagged !== undefined) {
      filteredData = filteredData.filter(tx => tx.flagged === options.flagged);
    }
    
    // Calculate total count for pagination
    const totalCount = filteredData.length;
    
    // Apply pagination if requested
    if (options.page && options.pageSize) {
      const startIndex = (options.page - 1) * options.pageSize;
      filteredData = filteredData.slice(startIndex, startIndex + options.pageSize);
    }
    
    // Return data with pagination info directly
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
    console.error('Error fetching card transaction expenses:', error);
    return { data: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 } };
  }
};

/**
 * Format currency in Indian format (e.g., ₹20,00,000)
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get cardholder names from PeoplePage_PlaceholderPeople
 * @returns {Array} - Array of cardholder names
 */
export const getCardholderNames = () => {
  return people.map(person => person.name);
};

/**
 * Get departments list from PeoplePage_PlaceholderPeople
 * @returns {Array} - Array of department names
 */
export const getDepartments = () => {
  return departments;
};

/**
 * Get locations list from PeoplePage_PlaceholderPeople
 * @returns {Array} - Array of location names
 */
export const getLocations = () => {
  return locations;
};

/**
 * Check if a transaction needs review
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction needs review
 */
export const transactionNeedsReview = (transaction) => {
  return transaction.reviewStatus === 'Needs review';
};

/**
 * Check if a transaction is flagged
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction is flagged
 */
export const isTransactionFlagged = (transaction) => {
  return transaction.flagged === true;
};

/**
 * Check if a transaction is fully approved
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction is fully approved
 */
export const isTransactionFullyApproved = (transaction) => {
  return transaction.approvalStatus === 'Approved';
};

/**
 * Check if a transaction has been declined
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction has been declined
 */
export const isTransactionDeclined = (transaction) => {
  return transaction.approvalStatus === 'Declined';
};

/**
 * Check if a transaction is awaiting reviewer action
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction is awaiting reviewer
 */
export const isTransactionAwaitingReviewer = (transaction) => {
  return transaction.approvalStatus === 'Awaiting reviewer';
};

/**
 * Check if a transaction is awaiting cardholder action
 * @param {Object} transaction - Transaction to check
 * @returns {boolean} - True if transaction is awaiting cardholder
 */
export const isTransactionAwaitingCardholder = (transaction) => {
  return transaction.approvalStatus === 'Awaiting cardholder';
};

/**
 * Get receipt status for display
 * @param {Object} transaction - Transaction to check
 * @returns {string} - 'true' or 'false' for receipt status
 */
export const getReceiptStatusDisplay = (transaction) => {
  return transaction.receiptAttached ? 'true' : 'false';
};

/**
 * Get policy compliance text based on flagged status
 * @param {Object} transaction - Transaction to check
 * @returns {string} - 'Flagged' or 'Compliant' based on transaction.flagged
 */
export const getPolicyComplianceText = (transaction) => {
  return transaction.flagged ? 'Flagged' : 'Compliant';
};

/**
 * Filter transactions by a specific filter type
 * @param {Array} transactions - Array of transactions to filter
 * @param {string} filterType - Type of filter to apply ('all', 'needs-review', 'flagged', 'fully-approved', 'declined')
 * @returns {Array} - Filtered array of transactions
 */
export const filterTransactionsByType = (transactions, filterType) => {
  switch (filterType) {
    case 'needs-review':
      return transactions.filter(tx => tx.reviewStatus === 'Needs review');
    case 'flagged':
      return transactions.filter(tx => tx.flagged === true);
    case 'fully-approved':
      return transactions.filter(tx => tx.approvalStatus === 'Approved');
    case 'declined':
      return transactions.filter(tx => tx.approvalStatus === 'Declined');
    case 'awaiting-reviewer':
      return transactions.filter(tx => tx.approvalStatus === 'Awaiting reviewer');
    case 'awaiting-cardholder':
      return transactions.filter(tx => tx.approvalStatus === 'Awaiting cardholder');
    case 'all':
    default:
      return transactions;
  }
};

/**
 * Search transactions by search term
 * @param {Array} transactions - Array of transactions to search
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered array of transactions
 */
export const searchTransactions = (transactions, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return transactions;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return transactions.filter(transaction => 
    (transaction.merchant && transaction.merchant.toLowerCase().includes(term)) ||
    (transaction.cardholder && transaction.cardholder.toLowerCase().includes(term)) ||
    (transaction.card && transaction.card.toLowerCase().includes(term)) ||
    (transaction.memo && transaction.memo.toLowerCase().includes(term)) ||
    (transaction.department && transaction.department.toLowerCase().includes(term)) ||
    (transaction.location && transaction.location.toLowerCase().includes(term)) ||
    (transaction.category && transaction.category.toLowerCase().includes(term))
  );
};

export default MOCK_CARD_TRANSACTION_EXPENSES;