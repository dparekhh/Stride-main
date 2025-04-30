/**
 * WorkflowBuilderConfig.js - Configuration for WorkflowBuilder components
 * 
 * This utility file centralizes configuration for the WorkflowBuilder component,
 * including condition options, operators, and value selection mappings.
 */

import people, { departments, locations } from './PeoplePage_PlaceholderPeople';
import { MOCK_CARD_TRANSACTION_EXPENSES } from './Expenses_CardTransactionPageData';
import roles from './PeoplePage_Role';

/**
 * Primary condition options for the WorkflowBuilder
 */
export const primaryConditions = [
  'Spend type',
  'Amount',
  'User type',
  'Direct Stride manager',
  'Employee',
  'Merchant',
  'Merchant category',
  'Stride department', 
  'Stride location'
];

/**
 * Operator options for the WorkflowBuilder
 */
export const operatorOptions = [
  'is',
  'greater than',
  'equal to',
  'less than',
  'greater than or equal to',
  'less than or equal to', 
  'is not'
];

/**
 * Configuration for value selection based on primary condition
 */
export const valueSelectionConfig = {
  'Spend type': {
    type: 'dropdown',
    options: ['Card transaction', 'Reimbursement']
  },
  'Amount': {
    type: 'currency',
    inputType: 'number',
    placeholder: 'Enter amount'
    // Using a special 'currency' type to avoid duplicate input rendering
  },
  'User type': {
    type: 'dropdown',
    source: () => roles.map(role => role.name)
  },
  'Direct Stride manager': {
    type: 'dropdown',
    source: () => people.filter(p => p.role === "Manager").map(p => p.name)
  },
  'Employee': {
    type: 'dropdown',
    source: () => people.map(p => p.name)
  },
  'Merchant': {
    type: 'dropdown',
    source: () => [...new Set(MOCK_CARD_TRANSACTION_EXPENSES.map(tx => tx.merchant))]
  },
  'Merchant category': {
    type: 'dropdown',
    source: () => [...new Set(MOCK_CARD_TRANSACTION_EXPENSES.map(tx => tx.category))]
  },
  'Stride department': {
    type: 'dropdown',
    source: () => departments
  },
  'Stride location': {
    type: 'dropdown',
    source: () => locations
  }
};

/**
 * Get options for a specific condition type
 * 
 * @param {string} conditionType - The primary condition type
 * @returns {Array|null} - Array of options or null if not found
 */
export const getOptionsForCondition = (conditionType) => {
  if (!conditionType || !valueSelectionConfig[conditionType]) {
    return null;
  }

  const config = valueSelectionConfig[conditionType];
  
  if (config.options) {
    return config.options;
  }
  
  if (config.source && typeof config.source === 'function') {
    return config.source();
  }
  
  return null;
};

export default {
  primaryConditions,
  operatorOptions,
  valueSelectionConfig,
  getOptionsForCondition
};