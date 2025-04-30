import { useState, useCallback } from 'react';

/**
 * Custom hook for managing field selection in WorkflowBuilder
 * 
 * @param {Object} [initialState={}] - Initial field selection state
 * @returns {Object} Field selection state and methods
 */
const useFieldSelection = (initialState = {}) => {
  // Default initial state
  const defaultState = {
    fields: [],
    isRequired: true
  };
  
  // Merge with provided initial state
  const mergedInitialState = { ...defaultState, ...initialState };
  
  // Main state for field selection
  const [fieldState, setFieldState] = useState(mergedInitialState);
  
  /**
   * Set whether the fields are required or optional
   * 
   * @param {boolean} isRequired - Whether fields are required
   */
  const setIsRequired = useCallback((isRequired) => {
    setFieldState(prev => ({ ...prev, isRequired }));
  }, []);
  
  /**
   * Toggle a field's selection
   * 
   * @param {string} field - The field to toggle
   */
  const toggleField = useCallback((field) => {
    setFieldState(prev => {
      const isSelected = prev.fields.includes(field);
      
      if (isSelected) {
        return {
          ...prev,
          fields: prev.fields.filter(f => f !== field)
        };
      } else {
        return {
          ...prev,
          fields: [...prev.fields, field]
        };
      }
    });
  }, []);
  
  /**
   * Add a field to the selection
   * 
   * @param {string} field - The field to add
   */
  const addField = useCallback((field) => {
    setFieldState(prev => {
      if (prev.fields.includes(field)) {
        return prev;
      }
      
      return {
        ...prev,
        fields: [...prev.fields, field]
      };
    });
  }, []);
  
  /**
   * Remove a field from the selection
   * 
   * @param {string} field - The field to remove
   */
  const removeField = useCallback((field) => {
    setFieldState(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f !== field)
    }));
  }, []);
  
  /**
   * Set multiple fields at once
   * 
   * @param {Array} fields - Array of field strings
   */
  const setFields = useCallback((fields) => {
    if (!Array.isArray(fields)) {
      console.error('Invalid fields array:', fields);
      return;
    }
    
    setFieldState(prev => ({
      ...prev,
      fields
    }));
  }, []);
  
  /**
   * Reset field state to initial values
   */
  const resetFieldState = useCallback(() => {
    setFieldState(mergedInitialState);
  }, [mergedInitialState]);
  
  /**
   * Check if field selection is valid
   * 
   * @returns {boolean} Whether the field selection is valid
   */
  const isValid = useCallback(() => {
    return fieldState.fields.length > 0;
  }, [fieldState.fields]);
  
  /**
   * Get a descriptive label for the field selection
   * 
   * @returns {string} Description of the field selection
   */
  const getFieldsDescription = useCallback(() => {
    const { fields, isRequired } = fieldState;
    
    if (fields.length === 0) {
      return '';
    }
    
    const typeText = isRequired ? 'Required' : 'Optional';
    
    if (fields.length === 1) {
      return `${typeText}: ${fields[0]}`;
    }
    
    return `${typeText}: ${fields.length} fields`;
  }, [fieldState]);
  
  return {
    fieldState,
    setIsRequired,
    toggleField,
    addField,
    removeField,
    setFields,
    resetFieldState,
    isValid,
    getFieldsDescription
  };
};

export default useFieldSelection;