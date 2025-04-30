import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * RECOMMENDED STATE MANAGEMENT APPROACH FOR WORKFLOW BUILDER
 * 
 * This context provider is the recommended way to manage WorkflowBuilder state.
 * It centralizes condition state and provides a consistent API for manipulating workflows.
 * 
 * Benefits:
 * - Centralizes state logic in one place
 * - Reduces boilerplate in consumer components
 * - Ensures consistent condition management
 * - Simplifies component testing and maintenance
 * 
 * Usage:
 * 1. Wrap your application or specific page with WorkflowBuilderProvider
 * 2. Set useInternalState={true} on your WorkflowBuilder component
 * 3. See README.md for complete examples
 */

/**
 * Context for WorkflowBuilder state management
 * This centralizes state management for WorkflowBuilder components
 */
const WorkflowBuilderContext = createContext(null);

/**
 * Provider component for WorkflowBuilder state management
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} [props.initialConditions] - Initial conditions array
 * @returns {JSX.Element} Provider component
 */
export const WorkflowBuilderProvider = ({ children, initialConditions = [] }) => {
  // Core workflow state
  const [conditions, setConditions] = useState(initialConditions);
  
  // UI state for editing conditions
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [editingCondition, setEditingCondition] = useState(null);
  
  // Debug effect to log state changes
  useEffect(() => {
    console.log('WorkflowBuilder context updated:', {
      conditions,
      editingBlockId,
      editingCondition 
    });
  }, [conditions, editingBlockId, editingCondition]);
  
  // Condition management methods
  const addCondition = (condition) => {
    setConditions(prev => [...prev, condition]);
  };
  
  const deleteCondition = (index) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateConditions = (updatedConditions) => {
    setConditions(updatedConditions);
  };
  
  const toggleLogicOperator = (index) => {
    setConditions(prev => 
      prev.map((condition, i) => 
        i === index
          ? { 
              ...condition, 
              logicOperator: condition.logicOperator === 'AND' ? 'OR' : 'AND' 
            }
          : condition
      )
    );
  };
  
  // Context value with state and methods
  const contextValue = {
    // State
    conditions,
    editingBlockId,
    editingCondition,
    
    // State setters
    setConditions,
    setEditingBlockId,
    setEditingCondition,
    
    // Action methods
    addCondition,
    deleteCondition,
    updateConditions,
    toggleLogicOperator
  };
  
  return (
    <WorkflowBuilderContext.Provider value={contextValue}>
      {children}
    </WorkflowBuilderContext.Provider>
  );
};

WorkflowBuilderProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialConditions: PropTypes.array
};

/**
 * Custom hook to access the WorkflowBuilder context
 * @returns {Object} WorkflowBuilder context value
 */
export const useWorkflowBuilderContext = () => {
  const context = useContext(WorkflowBuilderContext);
  
  if (!context) {
    throw new Error('useWorkflowBuilderContext must be used within a WorkflowBuilderProvider');
  }
  
  return context;
};

export default WorkflowBuilderProvider;