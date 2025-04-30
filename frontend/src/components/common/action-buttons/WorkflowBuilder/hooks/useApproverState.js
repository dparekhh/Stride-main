import { useState, useCallback } from 'react';
import { validateApproverData } from '../utils/approverHelpers';

/**
 * Custom hook for managing approver state in WorkflowBuilder
 * 
 * @param {Object} [initialState={}] - Initial approver state
 * @returns {Object} Approver state and methods
 */
const useApproverState = (initialState = {}) => {
  // Default initial state
  const defaultState = {
    approvers: [],
    approvalType: 'any'
  };
  
  // Merge with provided initial state
  const mergedInitialState = { ...defaultState, ...initialState };
  
  // Main state for approvers
  const [approverState, setApproverState] = useState(mergedInitialState);
  
  /**
   * Set the approval type ('any' or 'all')
   * 
   * @param {string} type - The approval type
   */
  const setApprovalType = useCallback((type) => {
    if (type !== 'any' && type !== 'all') {
      console.error('Invalid approval type:', type);
      return;
    }
    
    setApproverState(prev => ({ ...prev, approvalType: type }));
  }, []);
  
  /**
   * Add an approver to the selection
   * 
   * @param {Object} approver - The approver object with label and value
   */
  const addApprover = useCallback((approver) => {
    if (!approver || !approver.label || !approver.value) {
      console.error('Invalid approver:', approver);
      return;
    }
    
    setApproverState(prev => {
      // Check if already added
      const isExisting = prev.approvers.some(a => a.value === approver.value);
      
      if (isExisting) {
        return prev;
      }
      
      return {
        ...prev,
        approvers: [...prev.approvers, approver]
      };
    });
  }, []);
  
  /**
   * Remove an approver from the selection
   * 
   * @param {string|Object} approverOrId - The approver object or ID to remove
   */
  const removeApprover = useCallback((approverOrId) => {
    const approverId = typeof approverOrId === 'string' 
      ? approverOrId 
      : approverOrId.value;
    
    setApproverState(prev => ({
      ...prev,
      approvers: prev.approvers.filter(a => a.value !== approverId)
    }));
  }, []);
  
  /**
   * Toggle an approver's selection
   * 
   * @param {Object} approver - The approver to toggle
   */
  const toggleApprover = useCallback((approver) => {
    if (!approver || !approver.value) {
      return;
    }
    
    setApproverState(prev => {
      const isSelected = prev.approvers.some(a => a.value === approver.value);
      
      if (isSelected) {
        return {
          ...prev,
          approvers: prev.approvers.filter(a => a.value !== approver.value)
        };
      } else {
        return {
          ...prev,
          approvers: [...prev.approvers, approver]
        };
      }
    });
  }, []);
  
  /**
   * Set multiple approvers at once
   * 
   * @param {Array} approvers - Array of approver objects
   */
  const setApprovers = useCallback((approvers) => {
    if (!Array.isArray(approvers)) {
      console.error('Invalid approvers array:', approvers);
      return;
    }
    
    setApproverState(prev => ({
      ...prev,
      approvers
    }));
  }, []);
  
  /**
   * Reset approver state to initial values
   */
  const resetApproverState = useCallback(() => {
    setApproverState(mergedInitialState);
  }, [mergedInitialState]);
  
  /**
   * Check if approver data is valid
   * 
   * @returns {boolean} Whether the approver state is valid
   */
  const isValid = useCallback(() => {
    return validateApproverData(approverState);
  }, [approverState]);
  
  return {
    approverState,
    setApprovalType,
    addApprover,
    removeApprover,
    toggleApprover,
    setApprovers,
    resetApproverState,
    isValid
  };
};

export default useApproverState;