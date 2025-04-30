import { useState, useCallback } from 'react';
import { 
  validateCondition, 
  generateConditionId, 
  findConditionById, 
  updateConditionById, 
  deleteConditionById 
} from '../utils/conditionHelpers';

/**
 * Custom hook for managing condition state in WorkflowBuilder
 * 
 * @param {Array} [initialConditions=[]] - Initial conditions array
 * @returns {Object} Condition state and methods
 */
const useConditionState = (initialConditions = []) => {
  // Main state for conditions
  const [conditions, setConditions] = useState(initialConditions);
  // Editing states
  const [editingConditionId, setEditingConditionId] = useState(null);
  
  /**
   * Add a new condition to the conditions array
   * 
   * @param {Object} condition - The condition to add
   */
  const addCondition = useCallback((condition) => {
    // Validate the condition
    if (!validateCondition(condition)) {
      console.error('Invalid condition:', condition);
      return;
    }
    
    // Generate a unique ID if not provided
    const conditionWithId = {
      ...condition,
      id: condition.id || generateConditionId(conditions)
    };
    
    setConditions(prevConditions => [...prevConditions, conditionWithId]);
  }, [conditions]);
  
  /**
   * Update an existing condition by ID
   * 
   * @param {string|number} id - ID of the condition to update
   * @param {Object} updates - Updates to apply
   */
  const updateCondition = useCallback((id, updates) => {
    setConditions(prevConditions => 
      updateConditionById(prevConditions, id, updates)
    );
  }, []);
  
  /**
   * Delete a condition by ID
   * 
   * @param {string|number} id - ID of the condition to delete
   */
  const deleteCondition = useCallback((id) => {
    setConditions(prevConditions => 
      deleteConditionById(prevConditions, id)
    );
    
    // Clear editing state if deleting the condition being edited
    if (editingConditionId === id) {
      setEditingConditionId(null);
    }
  }, [editingConditionId]);
  
  /**
   * Replace all conditions with a new array
   * 
   * @param {Array} newConditions - New conditions array
   */
  const setAllConditions = useCallback((newConditions) => {
    setConditions(newConditions);
  }, []);
  
  /**
   * Start editing a condition
   * 
   * @param {string|number} id - ID of the condition to edit
   * @returns {Object|null} The condition being edited
   */
  const startEditing = useCallback((id) => {
    setEditingConditionId(id);
    return findConditionById(conditions, id);
  }, [conditions]);
  
  /**
   * Stop editing and clear editing state
   */
  const stopEditing = useCallback(() => {
    setEditingConditionId(null);
  }, []);
  
  /**
   * Get a condition by ID
   * 
   * @param {string|number} id - ID of the condition to get
   * @returns {Object|null} The found condition or null
   */
  const getConditionById = useCallback((id) => {
    return findConditionById(conditions, id);
  }, [conditions]);
  
  /**
   * Toggle the logic operator (AND/OR) for a condition
   * 
   * @param {string|number} id - ID of the condition
   */
  const toggleLogicOperator = useCallback((id) => {
    const condition = findConditionById(conditions, id);
    if (!condition) return;
    
    const currentOperator = condition.logicOperator || 'AND';
    const newOperator = currentOperator === 'AND' ? 'OR' : 'AND';
    
    updateCondition(id, { logicOperator: newOperator });
  }, [conditions, updateCondition]);
  
  return {
    conditions,
    editingConditionId,
    addCondition,
    updateCondition,
    deleteCondition,
    setAllConditions,
    startEditing,
    stopEditing,
    getConditionById,
    toggleLogicOperator
  };
};

export default useConditionState;