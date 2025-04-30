import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWorkflowBuilderContext, WorkflowBuilderProvider } from './WorkflowBuilderProvider';
import { primaryConditions, operatorOptions } from '../../../../utils/WorkflowBuilderConfig';

// Core Components
import StartPoint from './WorkflowElements/StartPoint';
import EndPoint from './WorkflowElements/EndPoint';
import ConditionBlock from './WorkflowElements/ConditionBlock';
import AddButton from './WorkflowElements/AddButton';
import ConditionRow from './Dialogs/ConditionRow';

// Dialog Components
import ConditionEditor from './Dialogs/ConditionEditor';
import ApproverSelector from './Dialogs/ApproverSelector';
import FieldSelector from './Dialogs/FieldSelector';
import DeleteConfirmation from './Dialogs/DeleteConfirmation';

// Utility Hooks
import useConditionState from './hooks/useConditionState';
import useApproverState from './hooks/useApproverState';
import useFieldSelection from './hooks/useFieldSelection';

// Helper Utilities
import { getConditionText } from './utils/conditionHelpers';
import { formatApproverDisplay } from './utils/approverHelpers';

// Version number to help identify if the component is properly updated
const COMPONENT_VERSION = '2.1.0'; // Modularized version with standardized state management

/**
 * WORKFLOW BUILDER - STANDARDIZED STATE MANAGEMENT
 * 
 * This component supports two state management approaches:
 * 
 * 1. RECOMMENDED: Context-based internal state (set useInternalState={true})
 *    - Simplifies implementation for consumers
 *    - Handles all state logic internally via WorkflowBuilderProvider
 *    - No need to implement handlers in parent components
 *
 * 2. Legacy: External state management (useInternalState={false})
 *    - Requires passing conditions array and handler functions
 *    - More verbose but offers greater control
 *    - Compatible with existing implementations
 *
 * MIGRATION NOTE: For new implementations, use approach #1 (useInternalState=true).
 * See README.md for detailed migration guide and examples.
 */

/**
 * WorkflowBuilder Component - MODULARIZED VERSION
 * 
 * A reusable component for building workflow diagrams with multiple conditions and actions.
 * This version supports adding, removing, and managing multiple condition rows with consistent styling.
 * 
 * @param {Object} props Component props
 * @param {Array} props.conditions Array of workflow conditions
 * @param {Function} props.onConditionAdd Function to handle new condition (optional if using internal state)
 * @param {Function} props.onConditionDelete Function to remove condition (optional if using internal state)
 * @param {Function} props.onConditionUpdate Function to update existing condition (optional if using internal state)
 * @param {Function} props.onLogicOperatorToggle Function to toggle AND/OR (optional if using internal state)
 * @param {Object} [props.customOptions] Optional object of custom options for condition types
 * @param {string} [props.className] Optional additional styling classes
 * @param {React.ReactNode} [props.children] Optional custom content for the condition block
 * @param {string} [props.triggerText] Custom text for the trigger element
 * @param {string} [props.triggerHighlight] Custom highlighted text for the trigger element
 * @param {boolean} [props.useInternalState] Whether to manage conditions internally (defaults to false)
 * @param {boolean} [props.showEndPoint] Whether to show the end point (defaults to false)
 * @param {string} [props.endPointText] Text for the end point (defaults to "Approve")
 * @param {string} [props.endPointHighlight] Highlighted text for the end point (defaults to "Expense")
 * @returns {JSX.Element} The WorkflowBuilder component
 */
const WorkflowBuilder = ({
  conditions: externalConditions,
  onConditionAdd,
  onConditionDelete,
  onConditionUpdate,
  onLogicOperatorToggle,
  customOptions = {},
  className = "",
  children,
  triggerText = "When",
  triggerHighlight = "Submitting Expenses",
  useInternalState = false,
  showEndPoint = false,
  endPointText = "Approve",
  endPointHighlight = "Expense"
}) => {
  // If using internal state, wrap in context provider
  if (useInternalState) {
    return (
      <WorkflowBuilderProvider initialConditions={externalConditions}>
        <WorkflowBuilderContent
          customOptions={customOptions}
          className={className}
          children={children}
          triggerText={triggerText}
          triggerHighlight={triggerHighlight}
          showEndPoint={showEndPoint}
          endPointText={endPointText}
          endPointHighlight={endPointHighlight}
        />
      </WorkflowBuilderProvider>
    );
  }
  
  // Otherwise, use as a controlled component with external state
  return (
    <WorkflowBuilderContent
      conditions={externalConditions}
      onConditionAdd={onConditionAdd}
      onConditionDelete={onConditionDelete}
      onConditionUpdate={onConditionUpdate}
      onLogicOperatorToggle={onLogicOperatorToggle}
      useInternalState={false}
      customOptions={customOptions}
      className={className}
      children={children}
      triggerText={triggerText}
      triggerHighlight={triggerHighlight}
      showEndPoint={showEndPoint}
      endPointText={endPointText}
      endPointHighlight={endPointHighlight}
    />
  );
};

/**
 * WorkflowBuilderContent - Internal implementation of the WorkflowBuilder
 * This component handles both internal and external state management
 */
const WorkflowBuilderContent = ({
  conditions: externalConditions,
  onConditionAdd,
  onConditionDelete,
  onConditionUpdate,
  onLogicOperatorToggle,
  useInternalState = true,
  customOptions = {},
  className = "",
  children,
  triggerText,
  triggerHighlight,
  showEndPoint,
  endPointText,
  endPointHighlight
}) => {
  // Use context if available
  const contextValue = useInternalState ? useWorkflowBuilderContext() : null;
  
  // UI state
  const [hoveredConditionIndex, setHoveredConditionIndex] = useState(null);
  const [activeConditionId, setActiveConditionId] = useState(null);
  
  // Modal states
  const [conditionEditorState, setConditionEditorState] = useState({
    isOpen: false,
    initialCondition: null,
    editingIndex: null
  });
  
  const [approverSelectorState, setApproverSelectorState] = useState({
    isOpen: false,
    initialApprovers: [],
    initialApprovalType: 'any',
    parentConditionId: null
  });
  
  const [fieldSelectorState, setFieldSelectorState] = useState({
    isOpen: false,
    isRequired: true,
    initialFields: [],
    fieldOptions: [],
    parentConditionId: null
  });
  
  const [deleteConfirmationState, setDeleteConfirmationState] = useState({
    isOpen: false,
    conditionIndex: null,
    isMainCondition: false,
    mainConditionText: '',
    childConditionsText: [],
    conditionId: null
  });
  
  // Get conditions from context or props
  const conditions = useInternalState
    ? contextValue.conditions
    : externalConditions || [];
  
  // Debug effect to log the component version
  useEffect(() => {
    console.log('WorkflowBuilder version:', COMPONENT_VERSION);
  }, []);
  
  // Combined handlers that work with either internal or external state
  const handleConditionAdd = (condition) => {
    if (useInternalState && contextValue) {
      contextValue.addCondition(condition);
    } else if (typeof onConditionAdd === 'function') {
      onConditionAdd(condition);
    }
  };
  
  const handleConditionDelete = (index) => {
    if (useInternalState && contextValue) {
      contextValue.deleteCondition(index);
    } else if (typeof onConditionDelete === 'function') {
      onConditionDelete(index);
    }
  };
  
  const handleConditionUpdate = (updatedConditions) => {
    if (useInternalState && contextValue) {
      contextValue.updateConditions(updatedConditions);
    } else if (typeof onConditionUpdate === 'function') {
      onConditionUpdate(updatedConditions);
    }
  };
  
  const handleLogicOperatorToggle = (index) => {
    if (useInternalState && contextValue) {
      contextValue.toggleLogicOperator(index);
    } else if (typeof onLogicOperatorToggle === 'function') {
      onLogicOperatorToggle(index);
    }
  };
  
  // Handle opening the condition editor
  const handleOpenConditionEditor = (initialCondition = null, editingIndex = null) => {
    setConditionEditorState({
      isOpen: true,
      initialCondition,
      editingIndex
    });
  };
  
  // Handle saving from condition editor with proper parent-child relationship handling
  const handleConditionEditorSave = (conditionData) => {
    const { editingIndex, parentConditionId } = conditionEditorState;
    
    // Generate a unique ID for the condition if it doesn't have one
    if (!conditionData.id) {
      conditionData.id = `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    if (editingIndex !== null) {
      // Update existing condition
      const updatedConditions = [...conditions];
      updatedConditions[editingIndex] = conditionData;
      handleConditionUpdate(updatedConditions);
    } else {
      // Check if this is a child condition with a parent
      if (parentConditionId) {
        // For a child condition, we need to attach the parentConditionId
        const enrichedConditionData = {
          ...conditionData,
          parentConditionId,
          id: `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Always ensure unique ID
          isChildCondition: true  // Explicitly mark as child condition
        };
        
        // Add new child condition
        handleConditionAdd(enrichedConditionData);
      } else {
        // Add new main condition
        handleConditionAdd(conditionData);
      }
    }
    
    // Reset the condition editor state
    setConditionEditorState({
      isOpen: false,
      initialCondition: null,
      editingIndex: null,
      parentConditionId: null
    });
  };
  
  // Handle opening the approver selector
  const handleOpenApproverSelector = (parentConditionId, initialApprovers = [], initialApprovalType = 'any') => {
    setApproverSelectorState({
      isOpen: true,
      initialApprovers,
      initialApprovalType,
      parentConditionId
    });
  };
  
  // Handle saving from approver selector
  const handleApproverSelectorSave = (approverData) => {
    const { parentConditionId } = approverSelectorState;
    
    // Format the approver data for saving
    const formattedData = {
      type: 'approver',
      parentConditionId,
      approvers: approverData.approvers,
      approvalType: approverData.approvalType,
      id: `approver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isChildCondition: true
    };
    
    // Add as a new condition without creating circular references
    handleConditionAdd(formattedData);
    
    setApproverSelectorState({
      isOpen: false,
      initialApprovers: [],
      initialApprovalType: 'any',
      parentConditionId: null
    });
  };
  
  // Handle opening the field selector
  const handleOpenFieldSelector = (isRequired, parentConditionId, initialFields = [], fieldOptions = []) => {
    setFieldSelectorState({
      isOpen: true,
      isRequired,
      initialFields,
      fieldOptions,
      parentConditionId
    });
  };
  
  // Handle saving from field selector
  const handleFieldSelectorSave = (fieldData) => {
    const { parentConditionId, isRequired } = fieldSelectorState;
    
    // Format the field data for saving
    const formattedData = {
      type: isRequired ? 'required-fields' : 'optional-fields',
      parentConditionId,
      fields: fieldData.fields,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isChildCondition: true
    };
    
    // Add as a new condition without creating circular references
    handleConditionAdd(formattedData);
    
    setFieldSelectorState({
      isOpen: false,
      isRequired: true,
      initialFields: [],
      fieldOptions: [],
      parentConditionId: null
    });
  };
  
  // Handle opening delete confirmation
  const handleOpenDeleteConfirmation = (conditionIndex, isMainCondition = false, conditionId = null) => {
    const condition = conditions[conditionIndex];
    
    setDeleteConfirmationState({
      isOpen: true,
      conditionIndex,
      isMainCondition,
      mainConditionText: getConditionText(condition),
      childConditionsText: [],
      conditionId
    });
  };
  
  // Handle confirming deletion
  const handleDeleteConfirm = () => {
    const { conditionIndex } = deleteConfirmationState;
    
    if (conditionIndex !== null) {
      handleConditionDelete(conditionIndex);
    }
    
    setDeleteConfirmationState({
      isOpen: false,
      conditionIndex: null,
      isMainCondition: false,
      mainConditionText: '',
      childConditionsText: [],
      conditionId: null
    });
  };
  
  // Determine if there's at least one main condition
  const hasMainCondition = conditions.length > 0;
  
  // Handle click on "Add" button
  const handleAddButtonClick = (action) => {
    // Default options based on action type
    let options = [];
    let title = '';
    
    if (action === 'add-required-fields') {
      // Only allow this action if there's at least one condition
      if (!hasMainCondition) return;
      
      title = 'Add required field(s)';
      options = ['Memo', 'Receipt', 'Mileage reimbursement location', 'Limit'];
      handleOpenFieldSelector(true, activeConditionId, [], options);
    } 
    else if (action === 'add-optional-fields') {
      // Only allow this action if there's at least one condition
      if (!hasMainCondition) return;
      
      title = 'Add optional field(s)';
      options = ['Memo', 'Receipt', 'Mileage reimbursement location', 'Limit'];
      handleOpenFieldSelector(false, activeConditionId, [], options);
    } 
    else if (action === 'set-conditions') {
      title = 'Set conditions';
      options = customOptions['set-conditions'] || primaryConditions;
      
      // Only set activeConditionId to null when we're not adding a child condition
      // This allows us to maintain the parent-child relationship when needed
      if (!activeConditionId) {
        setActiveConditionId(null);
      }
      
      // Find the existing condition if activeConditionId is set (editing a child condition)
      let parentCondition = null;
      if (activeConditionId) {
        // Find the parent condition in the conditions array
        const parentIndex = conditions.findIndex(cond => cond.id === activeConditionId);
        if (parentIndex !== -1) {
          parentCondition = conditions[parentIndex];
        }
      }
      
      // Open the condition editor dialog
      setConditionEditorState({
        isOpen: true,
        initialCondition: null, // null means we're creating a new condition
        editingIndex: null,
        parentConditionId: activeConditionId // Track the parent condition ID
      });
    }
    else if (action === 'add-approver') {
      // Only allow this action if there's at least one condition
      if (!hasMainCondition) return;
      
      handleOpenApproverSelector(activeConditionId);
    }
  };
  
  // Add options for the main workflow with conditional disabling
  const addOptions = [
    { label: 'Set Conditions', value: 'set-conditions', disabled: false },
    { 
      label: 'Add Approver', 
      value: 'add-approver', 
      disabled: !hasMainCondition
    },
    { 
      label: 'Add Required Fields', 
      value: 'add-required-fields', 
      disabled: !hasMainCondition
    },
    { 
      label: 'Add Optional Fields', 
      value: 'add-optional-fields', 
      disabled: !hasMainCondition
    }
  ];
  
  return (
    <div className={`workflow-builder ${className}`}>
      {/* Main workflow diagram */}
      <div className="workflow-diagram">
        {/* Start point */}
        <StartPoint triggerText={triggerText} triggerHighlight={triggerHighlight} />
        
        {/* Vertical connector line after start point */}
        <div className="workflow-connector h-12 w-0.5 bg-gray-200 ml-3.5"></div>
        
        {/* Condition Blocks */}
        <div className="workflow-conditions relative pl-6 mb-6">
          {/* Condition blocks */}
          <div className="condition-blocks flex flex-col space-y-4">
            {/* Render conditions if available */}
            {conditions.length > 0 ? (
              <>
                {/* Filter only main/parent conditions for the outer loop */}
                {conditions
                  .filter(condition => !condition.parentConditionId)
                  .map((mainCondition, idx) => {
                    // Find all child conditions for this parent
                    const childConditions = conditions.filter(
                      c => c.parentConditionId === mainCondition.id
                    );
                    
                    // Get the index in the overall array for proper tracking
                    const mainIndex = conditions.findIndex(c => c.id === mainCondition.id);
                    
                    return (
                      <div key={`condition-group-${mainIndex}`} className="condition-group">
                        {/* Main Condition */}
                        <ConditionBlock
                          key={`main-condition-${mainIndex}`}
                          condition={mainCondition}
                          index={mainIndex}
                          isHovered={hoveredConditionIndex === mainIndex}
                          onHover={setHoveredConditionIndex}
                          onEdit={() => handleOpenConditionEditor(mainCondition, mainIndex)}
                          onDelete={() => handleOpenDeleteConfirmation(mainIndex)}
                          onAddSubCondition={(action) => {
                            setActiveConditionId(mainCondition.id);
                            handleAddButtonClick(action);
                          }}
                        >
                          {/* Only render children if there are any */}
                          {childConditions.length > 0 && (
                            <div className="child-conditions">
                              {childConditions.map((childCondition, childIdx) => {
                                // Get index in the overall array
                                const childIndex = conditions.findIndex(c => c.id === childCondition.id);
                                
                                return (
                                  <div key={`child-condition-${childIndex}`}>
                                    <ConditionBlock
                                      condition={childCondition}
                                      index={childIndex}
                                      isHovered={hoveredConditionIndex === childIndex}
                                      onHover={setHoveredConditionIndex}
                                      onEdit={() => {
                                        // Handle different edit actions based on condition type
                                        if (childCondition.type === 'approver') {
                                          handleOpenApproverSelector(
                                            childCondition.parentConditionId, 
                                            childCondition.approvers || [], 
                                            childCondition.approvalType || 'any'
                                          );
                                        } else if (childCondition.type === 'required-fields') {
                                          handleOpenFieldSelector(
                                            true, 
                                            childCondition.parentConditionId, 
                                            childCondition.fields || []
                                          );
                                        } else if (childCondition.type === 'optional-fields') {
                                          handleOpenFieldSelector(
                                            false, 
                                            childCondition.parentConditionId, 
                                            childCondition.fields || []
                                          );
                                        }
                                      }}
                                      onDelete={() => handleOpenDeleteConfirmation(childIndex)}
                                      onAddSubCondition={(action) => {
                                        setActiveConditionId(childCondition.id);
                                        handleAddButtonClick(action);
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </ConditionBlock>
                      </div>
                    );
                  })}
                
                {/* Always show Add button after all conditions, properly indented */}
                <div className="pl-6 py-4">
                  <AddButton 
                    options={addOptions}
                    onOptionSelect={handleAddButtonClick}
                    buttonClassName="bg-white text-black border border-gray-300 hover:bg-gray-50"
                  />
                </div>
              </>
            ) : (
              // Add button when no conditions exist
              <div className="py-4">
                <AddButton 
                  options={addOptions}
                  onOptionSelect={handleAddButtonClick}
                  buttonClassName="bg-white text-black border border-gray-300 hover:bg-gray-50"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* End point (if enabled) */}
        {showEndPoint && (
          <>
            {/* Vertical connector line before end point */}
            <div className="workflow-connector h-12 w-0.5 bg-gray-200 ml-3.5"></div>
            
            {/* End point */}
            <EndPoint 
              endPointText={endPointText}
              endPointHighlight={endPointHighlight}
              showEndPoint={showEndPoint}
            />
          </>
        )}
      </div>
      
      {/* Dialog components */}
      <ConditionEditor
        isOpen={conditionEditorState.isOpen}
        title="Set Conditions"
        conditionOptions={customOptions['set-conditions'] || primaryConditions}
        onClose={() => setConditionEditorState({ ...conditionEditorState, isOpen: false })}
        onSave={handleConditionEditorSave}
        initialCondition={conditionEditorState.initialCondition}
      />
      
      <ApproverSelector
        isOpen={approverSelectorState.isOpen}
        onClose={() => setApproverSelectorState({ ...approverSelectorState, isOpen: false })}
        onSave={handleApproverSelectorSave}
        initialApprovers={approverSelectorState.initialApprovers}
        initialApprovalType={approverSelectorState.initialApprovalType}
      />
      
      <FieldSelector
        isOpen={fieldSelectorState.isOpen}
        fieldOptions={fieldSelectorState.fieldOptions}
        title={`Add ${fieldSelectorState.isRequired ? 'Required' : 'Optional'} Fields`}
        onClose={() => setFieldSelectorState({ ...fieldSelectorState, isOpen: false })}
        onSave={handleFieldSelectorSave}
        initialFields={fieldSelectorState.initialFields}
        isRequired={fieldSelectorState.isRequired}
      />
      
      <DeleteConfirmation
        isOpen={deleteConfirmationState.isOpen}
        mainConditionText={deleteConfirmationState.mainConditionText}
        childConditionsText={deleteConfirmationState.childConditionsText}
        isMainCondition={deleteConfirmationState.isMainCondition}
        onClose={() => setDeleteConfirmationState({ ...deleteConfirmationState, isOpen: false })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

WorkflowBuilder.propTypes = {
  conditions: PropTypes.array,
  onConditionAdd: PropTypes.func,
  onConditionDelete: PropTypes.func,
  onConditionUpdate: PropTypes.func,
  onLogicOperatorToggle: PropTypes.func,
  customOptions: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  triggerText: PropTypes.string,
  triggerHighlight: PropTypes.string,
  useInternalState: PropTypes.bool,
  showEndPoint: PropTypes.bool,
  endPointText: PropTypes.string,
  endPointHighlight: PropTypes.string
};

WorkflowBuilderContent.propTypes = {
  ...WorkflowBuilder.propTypes
};

export default WorkflowBuilder;