/**
 * Condition Helpers - Utility functions for condition formatting and validation
 * 
 * This module provides helper functions for working with workflow conditions
 * including formatting, validation, and transformation.
 */
import { formatIndianCurrency } from '../../../../../utils/helpers';

/**
 * Format a condition value for display based on its type
 * 
 * @param {string|number|Array} value - The condition value
 * @param {string} conditionType - The type of condition (e.g., 'Amount', 'Department')
 * @returns {string} Formatted value for display
 */
export const formatConditionValue = (value, conditionType) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle arrays (multi-select values)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '';
    }
    return value.join(', ');
  }
  
  // Handle numbers and special formatting needs
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = typeof value === 'number' ? value : Number(value);
    
    // Format currency for Amount
    if (conditionType === 'Amount') {
      return formatIndianCurrency(numValue);
    }
    
    // Regular number formatting for other numeric types
    return numValue.toLocaleString('en-IN');
  }
  
  // Default string handling
  return String(value);
};

/**
 * Generate a human-readable text representation of a condition
 * 
 * @param {Object} condition - The condition object
 * @returns {string} Human-readable condition text
 */
export const getConditionText = (condition) => {
  // Handle group conditions
  if (condition.type === 'group' && Array.isArray(condition.conditions)) {
    return condition.conditions.map((cond, index) => {
      // Format the condition text
      const condText = `${cond.type} ${cond.operator} ${formatConditionValue(cond.value, cond.type)}`;
      
      // For subsequent conditions, add the logic operator
      if (index > 0) {
        return `${cond.logicOperator === 'AND' ? 'AND' : 'OR'} ${condText}`;
      }
      
      return condText;
    }).join(' ');
  }
  
  // Handle regular conditions
  const { type, operator, value } = condition;
  
  // Format the value based on condition type
  const formattedValue = formatConditionValue(value, type);
  
  // Construct readable text
  return `${type} ${operator} ${formattedValue}`;
};

/**
 * Validate a condition object to ensure it has required fields
 * 
 * @param {Object} condition - The condition to validate
 * @returns {boolean} Whether the condition is valid
 */
export const validateCondition = (condition) => {
  if (!condition) {
    return false;
  }
  
  // Special handling for group conditions
  if (condition.type === 'group' && Array.isArray(condition.conditions)) {
    // A group must have at least one condition
    if (condition.conditions.length === 0) {
      return false;
    }
    
    // Each condition in the group must be valid
    return condition.conditions.every(subCondition => validateCondition(subCondition));
  }
  
  // Check required fields for regular conditions
  if (!condition.type || !condition.operator) {
    return false;
  }
  
  // Validate value based on its type
  if (Array.isArray(condition.value)) {
    return condition.value.length > 0;
  }
  
  return condition.value !== undefined && 
         condition.value !== null && 
         condition.value !== '';
};

/**
 * Find a condition by ID in a nested condition structure
 * 
 * @param {Array} conditions - Array of conditions to search
 * @param {string|number} id - ID of the condition to find
 * @returns {Object|null} The found condition or null
 */
export const findConditionById = (conditions, id) => {
  if (!conditions || !Array.isArray(conditions)) {
    return null;
  }
  
  for (const condition of conditions) {
    // Check if this is the condition we're looking for
    if (condition.id === id) {
      return condition;
    }
    
    // Check sub-conditions if this is a group
    if (condition.type === 'group' && condition.conditions) {
      const found = findConditionById(condition.conditions, id);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

/**
 * Update a condition by ID in a nested condition structure
 * 
 * @param {Array} conditions - Array of conditions to update
 * @param {string|number} id - ID of the condition to update
 * @param {Object} updates - Updates to apply to the condition
 * @returns {Array} New array with the updated condition
 */
export const updateConditionById = (conditions, id, updates) => {
  if (!conditions || !Array.isArray(conditions)) {
    return conditions;
  }
  
  return conditions.map(condition => {
    // If this is the condition to update
    if (condition.id === id) {
      return { ...condition, ...updates };
    }
    
    // If this is a group, check its sub-conditions
    if (condition.type === 'group' && condition.conditions) {
      return {
        ...condition,
        conditions: updateConditionById(condition.conditions, id, updates)
      };
    }
    
    // Otherwise, return the condition unchanged
    return condition;
  });
};

/**
 * Delete a condition by ID from a nested condition structure
 * 
 * @param {Array} conditions - Array of conditions
 * @param {string|number} id - ID of the condition to delete
 * @returns {Array} New array with the condition removed
 */
export const deleteConditionById = (conditions, id) => {
  if (!conditions || !Array.isArray(conditions)) {
    return conditions;
  }
  
  return conditions
    .filter(condition => condition.id !== id)
    .map(condition => {
      // If this is a group, filter its sub-conditions
      if (condition.type === 'group' && condition.conditions) {
        return {
          ...condition,
          conditions: deleteConditionById(condition.conditions, id)
        };
      }
      
      // Otherwise, return the condition unchanged
      return condition;
    });
};

/**
 * Generate a unique ID for a new condition
 * 
 * @param {Array} existingConditions - Existing conditions to avoid ID collision
 * @returns {string} A unique ID string
 */
export const generateConditionId = (existingConditions = []) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `condition_${timestamp}_${random}`;
};

export default {
  formatConditionValue,
  getConditionText,
  validateCondition,
  findConditionById,
  updateConditionById,
  deleteConditionById,
  generateConditionId
};