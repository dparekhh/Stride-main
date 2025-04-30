/**
 * ExpenseReimbursementsData.js
 * 
 * Mock data for the Expense Reimbursements page.
 * Includes placeholder reimbursement data with consistent structure
 * All data follows Indian context for departments, locations, and naming
 */

import { people, departments, locations } from './PeoplePage_PlaceholderPeople';

/**
 * Generate placeholder reimbursement transactions
 * @returns {Array} Array of reimbursement transactions
 */
export const generateReimbursementTransactions = () => {
  return [
    {
      id: 1,
      merchant: 'Hotel Taj',
      date: '2025-04-15',
      employeeName: people[0].name, // Arjun Sharma
      amount: 12500.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[0].department,
      category: 'Accommodation',
      location: people[0].location,
      receiptAttached: true,
      paymentMethod: 'Cash',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Client meeting accommodation',
      approverName: people[1].name, // Priya Patel
      approvedDate: '2025-04-16',
      receiptSubmissionDate: '2025-04-15'
    },
    {
      id: 2,
      merchant: 'Uber',
      date: '2025-04-14',
      employeeName: people[2].name, // Vikram Mehta
      amount: 840.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[2].department,
      category: 'Transportation',
      location: people[2].location,
      receiptAttached: true,
      paymentMethod: 'Digital Wallet',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Airport transfer',
      approverName: people[3].name, // Neha Sharma
      approvedDate: '2025-04-15',
      receiptSubmissionDate: '2025-04-14'
    },
    {
      id: 3,
      merchant: 'Air India',
      date: '2025-04-12',
      employeeName: people[3].name, // Neha Sharma
      amount: 22450.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[3].department,
      category: 'Travel',
      location: people[3].location,
      receiptAttached: true,
      paymentMethod: 'Personal Credit Card',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Sales conference flight',
      approverName: people[8].name, // Amit Kumar
      approvedDate: '2025-04-13',
      receiptSubmissionDate: '2025-04-12'
    },
    {
      id: 4,
      merchant: 'Office Depot',
      date: '2025-04-10',
      employeeName: people[5].name, // Ananya Gupta
      amount: 2750.00,
      flagged: true,
      policyReview: 'Flagged',
      flaggedReason: 'Missing itemized receipt',
      department: people[5].department,
      category: 'Office Supplies',
      location: people[5].location,
      receiptAttached: true,
      paymentMethod: 'Cash',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Needs Review',
      approvalStatus: 'Pending',
      note: 'Marketing materials',
      approverName: people[3].name, // Neha Sharma
      approvedDate: '',
      receiptSubmissionDate: '2025-04-11'
    },
    {
      id: 5,
      merchant: 'Domino\'s Pizza',
      date: '2025-04-09',
      employeeName: people[6].name, // Aditya Singh
      amount: 1540.00,
      flagged: true,
      policyReview: 'Flagged',
      flaggedReason: 'Exceeds meal allowance',
      department: people[6].department,
      category: 'Meals',
      location: people[6].location,
      receiptAttached: true,
      paymentMethod: 'Digital Wallet',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Needs Review',
      approvalStatus: 'Pending',
      note: 'Team lunch',
      approverName: people[2].name, // Vikram Mehta
      approvedDate: '',
      receiptSubmissionDate: '2025-04-10'
    },
    {
      id: 6,
      merchant: 'Reliance Digital',
      date: '2025-04-08',
      employeeName: people[7].name, // Meera Iyer
      amount: 58900.00,
      flagged: true,
      policyReview: 'Flagged',
      flaggedReason: 'Capital expense needs approval',
      department: people[7].department,
      category: 'Electronics',
      location: people[7].location,
      receiptAttached: true,
      paymentMethod: 'Personal Credit Card',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Needs Review',
      approvalStatus: 'Pending',
      note: 'New laptop for finance team',
      approverName: people[6].name, // Aditya Singh
      approvedDate: '',
      receiptSubmissionDate: '2025-04-09'
    },
    {
      id: 7,
      merchant: 'Indian Railways',
      date: '2025-04-06',
      employeeName: people[1].name, // Priya Patel
      amount: 2200.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[1].department,
      category: 'Transportation',
      location: people[1].location,
      receiptAttached: true,
      paymentMethod: 'Cash',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Site visit travel',
      approverName: people[2].name, // Vikram Mehta
      approvedDate: '2025-04-07',
      receiptSubmissionDate: '2025-04-06'
    },
    {
      id: 8,
      merchant: 'Taj Bengal',
      date: '2025-04-04',
      employeeName: people[4].name, // Rohan Mehta
      amount: 32500.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[4].department,
      category: 'Accommodation',
      location: 'Kolkata',
      receiptAttached: true,
      paymentMethod: 'Corporate Card',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Board meeting accommodation',
      approverName: people[8].name, // Amit Kumar
      approvedDate: '2025-04-05',
      receiptSubmissionDate: '2025-04-04'
    },
    {
      id: 9,
      merchant: 'Amazon',
      date: '2025-04-02',
      employeeName: people[0].name, // Arjun Sharma
      amount: 4850.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[0].department,
      category: 'Office Supplies',
      location: people[0].location,
      receiptAttached: false,
      paymentMethod: 'Personal Credit Card',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Needs Review',
      approvalStatus: 'Pending',
      note: 'Project supplies',
      approverName: people[1].name, // Priya Patel
      approvedDate: '',
      receiptSubmissionDate: '2025-04-03'
    },
    {
      id: 10,
      merchant: 'Nando\'s',
      date: '2025-04-01',
      employeeName: people[5].name, // Ananya Gupta
      amount: 3600.00,
      flagged: false,
      policyReview: 'Compliant',
      flaggedReason: '',
      department: people[5].department,
      category: 'Meals',
      location: people[5].location,
      receiptAttached: true,
      paymentMethod: 'Digital Wallet',
      spentFrom: 'Personal Funds',
      reviewStatus: 'Reviewed',
      approvalStatus: 'Approved',
      note: 'Client dinner meeting',
      approverName: people[3].name, // Neha Sharma
      approvedDate: '2025-04-02',
      receiptSubmissionDate: '2025-04-01'
    }
  ];
};

// Export the reimbursement transactions for use in the Reimbursements page
export const REIMBURSEMENT_TRANSACTIONS = generateReimbursementTransactions();

/**
 * Filter transactions by type/status
 * @param {Array} transactions - Array of transactions to filter
 * @param {string} filterType - Type of filter to apply
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsByType = (transactions, filterType) => {
  switch (filterType) {
    case 'overview':
      return transactions; // Return all transactions
    case 'needs-review':
      return transactions.filter(t => t.reviewStatus === 'Needs Review');
    case 'pending':
      return transactions.filter(t => t.approvalStatus === 'Pending');
    case 'history':
      return transactions.filter(t => t.approvalStatus === 'Approved');
    default:
      return transactions;
  }
};

/**
 * Search transactions based on a search term
 * @param {Array} transactions - Array of transactions to search
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered transactions that match the search term
 */
export const searchTransactions = (transactions, searchTerm = '') => {
  if (!searchTerm) return transactions;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return transactions.filter(transaction => {
    return (
      (transaction.merchant && transaction.merchant.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (transaction.employeeName && transaction.employeeName.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (transaction.department && transaction.department.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (transaction.category && transaction.category.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (transaction.amount && transaction.amount.toString().includes(lowerCaseSearchTerm))
    );
  });
};

/**
 * Helper function to format currency values
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with currency symbol
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default {
  REIMBURSEMENT_TRANSACTIONS,
  filterTransactionsByType,
  searchTransactions,
  formatCurrency
};