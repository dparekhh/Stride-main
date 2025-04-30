/**
 * Utility functions and mock data for card transactions
 */

/**
 * Generate mock transaction data with proper MCC category and card name fields
 * @returns {Array} Array of transaction objects
 */
export const generateMockTransactions = () => {
  return [
    {
      id: '1',
      date: '2025-04-15',
      merchant: 'Taj Hotels',
      amount: 12500.00,
      description: 'Business dinner with clients',
      category: '',
      department: 'Executive',
      location: 'Hyderabad',
      approvalStatus: 'Approved',
      policyCompliance: 'Compliant',
      receiptStatus: 'Attached',
      mccCategory: 'Hotels and Lodging',
      cardName: 'Corporate Platinum',
      cardholderName: 'Rahul Sharma'
    },
    {
      id: '2',
      date: '2025-04-14',
      merchant: 'Air India',
      amount: 45000.00,
      description: 'Flight tickets for conference',
      category: '',
      department: 'Sales',
      location: 'Mumbai',
      approvalStatus: 'Awaiting reviewer',
      policyCompliance: 'Compliant',
      receiptStatus: 'Missing',
      mccCategory: 'Airlines and Air Carriers',
      cardName: 'Corporate Platinum',
      cardholderName: 'Priya Singh'
    },
    {
      id: '3',
      date: '2025-04-12',
      merchant: 'Amazon',
      amount: 5499.00,
      description: 'Office supplies',
      category: '',
      department: 'Operations',
      location: 'Bangalore',
      approvalStatus: 'Awaiting cardholder',
      policyCompliance: 'Flagged',
      receiptStatus: 'Attached',
      mccCategory: 'Office Supply Stores',
      cardName: 'Corporate Gold',
      cardholderName: 'Amit Patel'
    }
  ];
};

/**
 * Get transaction categories from MCC codes
 * @returns {Array} Array of MCC categories
 */
export const getMccCategories = () => {
  return [
    'Airlines and Air Carriers',
    'Automotive Services',
    'Business Services',
    'Dining and Restaurants',
    'Education',
    'Entertainment',
    'Financial Services',
    'Government Services',
    'Healthcare',
    'Hotels and Lodging',
    'Office Supply Stores',
    'Retail Stores',
    'Transportation',
    'Travel Agencies',
    'Utilities'
  ];
};

/**
 * Get card names used in the organization
 * @returns {Array} Array of card names
 */
export const getCardNames = () => {
  return [
    'Corporate Platinum',
    'Corporate Gold',
    'Corporate Silver',
    'Department Card',
    'Project Card'
  ];
};

export default {
  generateMockTransactions,
  getMccCategories,
  getCardNames
};