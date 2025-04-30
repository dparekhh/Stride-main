/**
 * accountingData.js
 * 
 * Centralized Chart of Accounts data and related utilities
 * This module provides Chart of Accounts data structures and helper functions
 * for the Stride application. It includes data transformation, validation,
 * and mock API functions that can be replaced with real API calls later.
 */

// Local Storage keys for caching
export const VISIBILITY_CACHE_KEY = 'STRIDE_CHART_OF_ACCOUNTS_VISIBILITY';

// Chart of Accounts list 
export const CHART_OF_ACCOUNTS = [
  {
    id: 100,
    name: "Raw Material Consumed",
    code: "EXP-100",
    type: "Expense",
    visible: true,
    lastModified: new Date().getTime()
  },
  {
    id: 101,
    name: "Direct Labor",
    code: "EXP-101",
    type: "Expense",
    visible: true,
    lastModified: new Date().getTime()
  },
  {
    id: 102,
    name: "Manufacturing Overheads",
    code: "EXP-102",
    type: "Expense"
  },
  {
    id: 103,
    name: "Purchase of Trading Goods",
    code: "EXP-103",
    type: "Expense"
  },
  {
    id: 104,
    name: "Salaries and Wages",
    code: "EXP-104",
    type: "Expense"
  },
  {
    id: 105,
    name: "Bonus and Incentives",
    code: "EXP-105",
    type: "Expense"
  },
  {
    id: 106,
    name: "Staff Welfare Expenses",
    code: "EXP-106",
    type: "Expense"
  },
  {
    id: 107,
    name: "Provident Fund Contribution",
    code: "EXP-107",
    type: "Expense"
  },
  {
    id: 108,
    name: "ESI Contribution",
    code: "EXP-108",
    type: "Expense"
  },
  {
    id: 109,
    name: "Gratuity Expenses",
    code: "EXP-109",
    type: "Expense"
  },
  {
    id: 110,
    name: "Employee Training and Development",
    code: "EXP-110",
    type: "Expense"
  },
  {
    id: 111,
    name: "Staff Uniform Expenses",
    code: "EXP-111",
    type: "Expense"
  },
  {
    id: 112,
    name: "Employee Medical Insurance",
    code: "EXP-112",
    type: "Expense"
  },
  {
    id: 113,
    name: "Leave Encashment Expenses",
    code: "EXP-113",
    type: "Expense"
  },
  {
    id: 114,
    name: "Rent",
    code: "EXP-114",
    type: "Expense"
  },
  {
    id: 115,
    name: "Electricity and Water",
    code: "EXP-115",
    type: "Expense"
  },
  {
    id: 116,
    name: "Printing and Stationery",
    code: "EXP-116",
    type: "Expense"
  },
  {
    id: 117,
    name: "Telephone and Internet",
    code: "EXP-117",
    type: "Expense"
  },
  {
    id: 118,
    name: "Traveling and Conveyance",
    code: "EXP-118",
    type: "Expense"
  },
  {
    id: 119,
    name: "Legal and Professional Fees",
    code: "EXP-119",
    type: "Expense"
  },
  {
    id: 120,
    name: "Audit Fees",
    code: "EXP-120",
    type: "Expense"
  },
  {
    id: 121,
    name: "Insurance",
    code: "EXP-121",
    type: "Expense"
  },
  {
    id: 122,
    name: "Repairs and Maintenance",
    code: "EXP-122",
    type: "Expense"
  },
  {
    id: 123,
    name: "Security Services",
    code: "EXP-123",
    type: "Expense"
  },
  {
    id: 124,
    name: "Cleaning and Housekeeping",
    code: "EXP-124",
    type: "Expense"
  },
  {
    id: 125,
    name: "Office Supplies",
    code: "EXP-125",
    type: "Expense"
  },
  {
    id: 126,
    name: "Postage and Courier",
    code: "EXP-126",
    type: "Expense"
  },
  {
    id: 127,
    name: "Directors' Sitting Fees",
    code: "EXP-127",
    type: "Expense"
  },
  {
    id: 128,
    name: "Business Promotion",
    code: "EXP-128",
    type: "Expense"
  },
  {
    id: 129,
    name: "Corporate Social Responsibility",
    code: "EXP-129",
    type: "Expense"
  },
  {
    id: 130,
    name: "Donations",
    code: "EXP-130",
    type: "Expense"
  },
  {
    id: 131,
    name: "Subscriptions and Memberships",
    code: "EXP-131",
    type: "Expense"
  },
  {
    id: 132,
    name: "Books and Periodicals",
    code: "EXP-132",
    type: "Expense"
  },
  {
    id: 133,
    name: "Property Tax",
    code: "EXP-133",
    type: "Expense"
  },
  {
    id: 134,
    name: "Advertisement and Promotion",
    code: "EXP-134",
    type: "Expense"
  },
  {
    id: 135,
    name: "Sales Commission",
    code: "EXP-135",
    type: "Expense"
  },
  {
    id: 136,
    name: "Freight Outward",
    code: "EXP-136",
    type: "Expense"
  },
  {
    id: 137,
    name: "Packing Expenses",
    code: "EXP-137",
    type: "Expense"
  },
  {
    id: 138,
    name: "Marketing Expenses",
    code: "EXP-138",
    type: "Expense"
  },
  {
    id: 139,
    name: "Trade Fair Expenses",
    code: "EXP-139",
    type: "Expense"
  },
  {
    id: 140,
    name: "Sales Incentives",
    code: "EXP-140",
    type: "Expense"
  },
  {
    id: 141,
    name: "Product Sampling",
    code: "EXP-141",
    type: "Expense"
  },
  {
    id: 142,
    name: "Market Research",
    code: "EXP-142",
    type: "Expense"
  },
  {
    id: 143,
    name: "E-commerce Fees",
    code: "EXP-143",
    type: "Expense"
  },
  {
    id: 144,
    name: "Digital Marketing",
    code: "EXP-144",
    type: "Expense"
  },
  {
    id: 145,
    name: "Sales Team Travel",
    code: "EXP-145",
    type: "Expense"
  },
  {
    id: 146,
    name: "Customer Entertainment",
    code: "EXP-146",
    type: "Expense"
  },
  {
    id: 147,
    name: "Interest on Loans",
    code: "FIN-147",
    type: "Finance Cost"
  },
  {
    id: 148,
    name: "Bank Charges",
    code: "FIN-148",
    type: "Finance Cost"
  },
  {
    id: 149,
    name: "Foreign Exchange Loss",
    code: "FIN-149",
    type: "Finance Cost"
  },
  {
    id: 150,
    name: "Credit Card Processing Fees",
    code: "FIN-150",
    type: "Finance Cost"
  },
  {
    id: 151,
    name: "Depreciation",
    code: "DEP-151",
    type: "Depreciation & Amortization"
  },
  {
    id: 152,
    name: "Amortization",
    code: "DEP-152",
    type: "Depreciation & Amortization"
  },
  {
    id: 153,
    name: "Income Tax",
    code: "TAX-153",
    type: "Tax"
  },
  {
    id: 154,
    name: "Late Filing Fees and Penalties",
    code: "TAX-154",
    type: "Tax"
  }
];

/**
 * Function to fetch Chart of Accounts
 * This function returns chart of accounts data immediately without any API calls
 * 
 * @param {object} options - Query parameters and other options
 * @returns {Promise} - Promise that resolves to an array of account names
 */
export const fetchChartOfAccounts = async (options = {}) => {
  // Return the data immediately without any network delay
  return {
    success: true,
    data: [...CHART_OF_ACCOUNTS],
    timestamp: new Date().toISOString()
  };
};

/**
 * Function to assign a category to a transaction
 * This returns immediately without making any API calls
 * 
 * @param {string} transactionId - ID of the transaction
 * @param {string} categoryName - Category name to assign
 * @returns {Promise} - Promise that resolves to the updated transaction
 */
export const assignCategoryToTransaction = async (transactionId, categoryName) => {
  // Return success immediately
  return {
    success: true,
    data: {
      transactionId,
      categoryName,
      updatedAt: new Date().toISOString()
    }
  };
};

/**
 * Function to filter accounts by search term
 * Searches in both name and code fields
 * 
 * @param {Array} accounts - Array of account objects
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered array of account objects
 */
export const filterAccountsBySearchTerm = (accounts, searchTerm) => {
  if (!searchTerm) return accounts;
  
  const normalizedSearchTerm = searchTerm.toLowerCase();
  return accounts.filter(account => 
    account.name.toLowerCase().includes(normalizedSearchTerm) || 
    (account.code && account.code.toLowerCase().includes(normalizedSearchTerm)) ||
    (account.id && account.id.toString().includes(normalizedSearchTerm))
  );
};

/**
 * Function to validate if a category exists in the Chart of Accounts
 * Can check by category ID, name, or the full category object
 * 
 * @param {string|number|object} category - Category ID, name, or object to validate
 * @returns {boolean} - True if category exists, false otherwise
 */
export const validateCategory = (category) => {
  if (!category) return false;
  
  // If category is a number or string that looks like a number, check by ID
  if (typeof category === 'number' || (typeof category === 'string' && !isNaN(category))) {
    const categoryId = Number(category);
    return CHART_OF_ACCOUNTS.some(item => item.id === categoryId);
  }
  
  // If category is a string, check by name
  if (typeof category === 'string') {
    return CHART_OF_ACCOUNTS.some(item => item.name === category);
  }
  
  // If category is an object with an id, check by ID
  if (typeof category === 'object' && category.id) {
    return CHART_OF_ACCOUNTS.some(item => item.id === category.id);
  }
  
  // If category is an object with a name but no id, check by name
  if (typeof category === 'object' && category.name) {
    return CHART_OF_ACCOUNTS.some(item => item.name === category.name);
  }
  
  return false;
};

/**
 * Function to format category name for display
 * Can handle both string category names and category objects
 * 
 * @param {string|object} category - Category name or category object to format
 * @returns {string} - Formatted category name
 */
export const formatCategoryName = (category) => {
  if (!category) return '';
  
  // If category is an object with a name property, use that
  if (typeof category === 'object' && category.name) {
    const name = category.name;
    // Capitalize first letter of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // If category is a string, format it directly
  if (typeof category === 'string') {
    // Capitalize first letter of each word
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Fallback for unexpected input types
  return String(category);
};

/**
 * Create an object that maps transaction IDs to category objects or names
 * This is useful for efficiently looking up assigned categories
 * 
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} - Mapping of transaction IDs to category objects or names
 */
export const createCategoryMap = (transactions) => {
  if (!Array.isArray(transactions)) return {};
  
  return transactions.reduce((map, transaction) => {
    if (transaction.id) {
      if (transaction.category) {
        // If category is already an object with an id property, store it directly
        if (typeof transaction.category === 'object' && transaction.category.id) {
          map[transaction.id] = transaction.category;
        } 
        // If category is a string, look up the corresponding category object
        else if (typeof transaction.category === 'string') {
          const categoryObj = CHART_OF_ACCOUNTS.find(cat => cat.name === transaction.category);
          map[transaction.id] = categoryObj || transaction.category;
        }
      }
    }
    return map;
  }, {});
};

/**
 * Initialize account visibility states
 * If no cached visibility state exists, all accounts will be set to visible
 * 
 * @returns {Array} - Array of account objects with visibility property
 */
export const initializeAccountVisibility = () => {
  try {
    // Try to get visibility state from localStorage
    const cachedVisibility = localStorage.getItem(VISIBILITY_CACHE_KEY);
    
    if (cachedVisibility) {
      const { visibilityMap, timestamp } = JSON.parse(cachedVisibility);
      
      // Apply cached visibility to accounts
      return CHART_OF_ACCOUNTS.map(account => {
        // If account has visibility in cache, use it, otherwise default to true
        const visible = visibilityMap[account.id] !== undefined 
          ? visibilityMap[account.id] 
          : true;
          
        return {
          ...account,
          visible,
          lastModified: timestamp || new Date().getTime()
        };
      });
    }
  } catch (error) {
    console.error('Error initializing account visibility:', error);
  }
  
  // Default all to visible if no cache or error
  return CHART_OF_ACCOUNTS.map(account => ({
    ...account,
    visible: true,
    lastModified: new Date().getTime()
  }));
};

/**
 * Save account visibility states to localStorage
 * 
 * @param {Array} accounts - Array of account objects with visibility property
 */
export const saveAccountVisibility = (accounts) => {
  try {
    const timestamp = new Date().getTime();
    
    // Create a map of account ID to visibility state
    const visibilityMap = accounts.reduce((map, account) => {
      map[account.id] = account.visible;
      return map;
    }, {});
    
    // Save to localStorage
    localStorage.setItem(VISIBILITY_CACHE_KEY, JSON.stringify({
      visibilityMap,
      timestamp
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving account visibility:', error);
    return false;
  }
};

/**
 * Filter accounts by visibility
 * 
 * @param {Array} accounts - Array of account objects with visibility property
 * @param {boolean} showVisible - If true, return visible accounts, otherwise hidden accounts
 * @returns {Array} - Filtered array of account objects
 */
export const filterAccountsByVisibility = (accounts, showVisible = true) => {
  if (!Array.isArray(accounts)) return [];
  
  return accounts.filter(account => showVisible ? account.visible : !account.visible);
};

// Default export for convenience
export default {
  CHART_OF_ACCOUNTS,
  fetchChartOfAccounts,
  assignCategoryToTransaction,
  filterAccountsBySearchTerm,
  validateCategory,
  formatCategoryName,
  createCategoryMap,
  initializeAccountVisibility,
  saveAccountVisibility,
  filterAccountsByVisibility,
  VISIBILITY_CACHE_KEY
};