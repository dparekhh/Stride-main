import { useState, useCallback } from 'react';

/**
 * Custom hook for managing workflow state with enhanced hierarchical structure
 * This hook centralizes all workflow-related state management and provides
 * a more structured organization of condition blocks and their associated elements
 * 
 * @param {Array} initialConditionBlocks Initial condition blocks for the workflow
 * @returns {Object} Workflow state and handlers
 */
const useWorkflowState = (initialConditionBlocks = []) => {
  // Enhanced state to manage condition blocks as cohesive units
  const [conditionBlocks, setConditionBlocks] = useState(initialConditionBlocks);
  
  // Tracking the condition that's currently being edited
  const [editingCondition, setEditingCondition] = useState(null);
  
  // Track which block ID is currently being edited
  const [editingBlockId, setEditingBlockId] = useState(null);
  
  // Flag to track a pending state update
  const [stateUpdatePending, setStateUpdatePending] = useState(false);
  
  // Delete confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    blockId: null,
    conditionIndex: null,
    isMainCondition: false,
    childIndex: null
  });
  
  // Generate a unique ID for new condition blocks
  const generateBlockId = () => {
    return `block_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  // Add a new condition block to the workflow
  const addConditionBlock = (condition) => {
    const newBlock = {
      id: generateBlockId(),
      mainCondition: condition,      // The primary condition
      childConditions: [],           // Additional AND/OR conditions
      approvers: [],                 // Associated approvers
      requiredFields: [],            // Required fields
      optionalFields: [],            // Optional fields
      createdAt: new Date().toISOString()
    };
    
    setConditionBlocks(prevBlocks => [...prevBlocks, newBlock]);
    return newBlock.id; // Return the ID for reference
  };

  // Delete a condition block
  const deleteConditionBlock = (blockId) => {
    setConditionBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  };

  // Add an element to an existing condition block
  const addToConditionBlock = (blockId, elementType, element) => {
    setConditionBlocks(prevBlocks => {
      return prevBlocks.map(block => {
        if (block.id === blockId) {
          // Convert required and optional fields to child conditions to ensure proper editing/deletion
          if (elementType === 'requiredField' || elementType === 'optionalField') {
            // Create a child condition for the field
            const childCondition = {
              text: elementType === 'requiredField' ? `Require ${element}` : `Optional ${element}`,
              type: elementType === 'requiredField' ? 'add-required-fields' : 'add-optional-fields',
              logicOperator: 'AND',
              metadata: {
                fieldName: element,
                fieldType: elementType
              }
            };
            
            // Add as a child condition
            return { ...block, childConditions: [...block.childConditions, childCondition] };
          } else {
            // Handle other types normally
            switch (elementType) {
              case 'childCondition':
                return { ...block, childConditions: [...block.childConditions, element] };
              case 'approver':
                // Validate approver data format before adding
                if (element && element.metadata) {
                  // Ensure approvers is always a valid array
                  if (!Array.isArray(element.metadata.approvers)) {
                    console.warn('Fixing non-array approvers in addToConditionBlock:', 
                      element.metadata.approvers);
                    
                    // Convert to array based on data type
                    if (typeof element.metadata.approvers === 'string') {
                      element.metadata.approvers = [element.metadata.approvers];
                    } else if (element.metadata.approvers && 
                              typeof element.metadata.approvers === 'object') {
                      element.metadata.approvers = Object.values(element.metadata.approvers);
                    } else {
                      element.metadata.approvers = [];
                    }
                    
                    // Update text field to match fixed approvers
                    if (element.metadata.approvers.length > 0) {
                      const approvalTypeDisplay = element.metadata.approvalType === 'any' ? 'any' : 'all';
                      const approversList = element.metadata.approvers.join(', ');
                      element.text = `${approvalTypeDisplay}: ${approversList}`;
                    }
                    
                    console.log('Fixed approvers array in addToConditionBlock:', 
                      element.metadata.approvers);
                  }
                }
                return { ...block, approvers: [...block.approvers, element] };
              default:
                return block;
            }
          }
        }
        return block;
      });
    });
  };
  
  // Remove an element from a condition block
  const removeFromConditionBlock = (blockId, elementType, elementIndex) => {
    setConditionBlocks(prevBlocks => {
      return prevBlocks.map(block => {
        if (block.id === blockId) {
          // Create a copy of the appropriate array and remove the element
          switch (elementType) {
            case 'childCondition': {
              const updatedChildren = [...block.childConditions];
              updatedChildren.splice(elementIndex, 1);
              return { ...block, childConditions: updatedChildren };
            }
            case 'approver': {
              const updatedApprovers = [...block.approvers];
              updatedApprovers.splice(elementIndex, 1);
              return { ...block, approvers: updatedApprovers };
            }
            default:
              return block;
          }
        }
        return block;
      });
    });
  };
  
  // Replace an element in a condition block (used when editing approvers)
  const replaceInConditionBlock = (blockId, elementType, elementIndex, newElement) => {
    console.log('Replacing in condition block:', { blockId, elementType, newElement });
    
    // ENHANCED: First validate approver data if it's an approver replacement
    if (elementType === 'approver' && newElement && newElement.metadata) {
      // Ensure approvers is always a valid array for consistent data structure
      if (!Array.isArray(newElement.metadata.approvers)) {
        console.warn('Fixing non-array approvers in replaceInConditionBlock:', newElement.metadata.approvers);
        
        // Convert to proper array format based on data type
        if (typeof newElement.metadata.approvers === 'string') {
          // Single string - convert to array with one element
          newElement.metadata.approvers = [newElement.metadata.approvers];
        } else if (newElement.metadata.approvers && typeof newElement.metadata.approvers === 'object') {
          // Object - extract values into array
          newElement.metadata.approvers = Object.values(newElement.metadata.approvers);
        } else {
          // Default to empty array for any other problematic type
          newElement.metadata.approvers = [];
        }
        
        // Update text field to match the fixed approvers
        if (newElement.metadata.approvers.length > 0) {
          const approvalTypeDisplay = newElement.metadata.approvalType === 'any' ? 'any' : 'all';
          const approversList = newElement.metadata.approvers.join(', ');
          newElement.text = `${approvalTypeDisplay}: ${approversList}`;
        }
        
        console.log('Fixed approvers array:', newElement.metadata.approvers);
      }
    }
    
    // Now update the blocks with validated data
    setConditionBlocks(prevBlocks => {
      return prevBlocks.map(block => {
        if (block.id === blockId) {
          switch (elementType) {
            case 'childCondition': {
              // Replace a child condition
              const updatedChildren = [...block.childConditions];
              if (elementIndex < updatedChildren.length) {
                updatedChildren[elementIndex] = newElement;
              } else {
                // If not found at index, just add it to the end
                updatedChildren.push(newElement);
              }
              return { ...block, childConditions: updatedChildren };
            }
            case 'approver': {
              // Replace or set the approver
              // For approvers, we want to completely replace all approvers with just this one
              // Using the validated approver data from above
              return { ...block, approvers: [newElement] };
            }
            default:
              return block;
          }
        }
        return block;
      });
    });
  };

  // Edit main condition functionality
  const editMainCondition = (blockId) => {
    const blockToEdit = conditionBlocks.find(block => block.id === blockId);
    if (!blockToEdit) return null;
    
    // Store the block ID being edited
    setEditingBlockId(blockId);
    
    setEditingCondition({
      blockId,
      type: 'mainCondition',
      condition: blockToEdit.mainCondition
    });
    
    return blockToEdit.mainCondition;
  };
  
  // Edit child condition functionality
  const editChildCondition = (blockId, childIndex) => {
    const blockToEdit = conditionBlocks.find(block => block.id === blockId);
    if (!blockToEdit || !blockToEdit.childConditions[childIndex]) return null;
    
    setEditingCondition({
      blockId,
      type: 'childCondition',
      childIndex,
      condition: blockToEdit.childConditions[childIndex]
    });
    
    return blockToEdit.childConditions[childIndex];
  };
  
  // Update a main condition
  const updateMainCondition = (blockId, updatedCondition) => {
    setConditionBlocks(prevBlocks => {
      return prevBlocks.map(block => {
        if (block.id === blockId) {
          return { ...block, mainCondition: updatedCondition };
        }
        return block;
      });
    });
  };
  
  // Update a child condition
  const updateChildCondition = (blockId, childIndex, updatedCondition) => {
    setConditionBlocks(prevBlocks => {
      return prevBlocks.map(block => {
        if (block.id === blockId) {
          const updatedChildren = [...block.childConditions];
          updatedChildren[childIndex] = updatedCondition;
          return { ...block, childConditions: updatedChildren };
        }
        return block;
      });
    });
  };

  // Clear all condition blocks
  const clearConditionBlocks = () => {
    setConditionBlocks([]);
    setEditingBlockId(null); // Reset editing block ID
  };

  // Get flattened conditions array (legacy format)
  const getConditions = useCallback(() => {
    let flattenedConditions = [];
    
    conditionBlocks.forEach(block => {
      // Add main condition
      if (block.mainCondition) {
        flattenedConditions.push(block.mainCondition);
      }
      
      // Add child conditions (now includes required and optional fields)
      block.childConditions.forEach(childCondition => {
        flattenedConditions.push(childCondition);
      });
      
      // Add approvers
      block.approvers.forEach(approver => {
        flattenedConditions.push(approver);
      });
      
      // No need to add required or optional fields separately since
      // they're now part of childConditions
    });
    
    return flattenedConditions;
  }, [conditionBlocks]);

  // Add a condition to the workflow
  const addCondition = (condition) => {
    if (!condition) return;
    
    // For simple conditions, create a new block
    const newBlockId = addConditionBlock(condition);
    return newBlockId;
  };
  
  // Delete a condition with confirmation
  const deleteCondition = (index) => {
    const conditions = getConditions();
    if (index >= conditions.length) return;
    
    // Find the corresponding block and element
    let found = false;
    let targetBlockId = null;
    let isMainCondition = false;
    let childIndex = null;
    let blockIndex = 0;
    
    for (const block of conditionBlocks) {
      // Check if it's the main condition
      if (blockIndex === index) {
        targetBlockId = block.id;
        isMainCondition = true;
        found = true;
        break;
      }
      
      blockIndex++;
      
      // Check child conditions
      for (let i = 0; i < block.childConditions.length; i++) {
        if (blockIndex === index) {
          targetBlockId = block.id;
          childIndex = i;
          found = true;
          break;
        }
        blockIndex++;
      }
      
      if (found) break;
      
      // Skip approvers only (required and optional fields are now in childConditions)
      blockIndex += block.approvers.length;
    }
    
    if (!found) return;
    
    // Open delete confirmation modal
    setDeleteConfirmation({
      isOpen: true,
      blockId: targetBlockId,
      conditionIndex: index,
      isMainCondition,
      childIndex
    });
  };
  
  // Confirm deletion of a condition
  const confirmDeleteCondition = () => {
    const { blockId, isMainCondition, childIndex } = deleteConfirmation;
    
    if (isMainCondition) {
      // Delete the entire block for main conditions
      deleteConditionBlock(blockId);
    } else if (childIndex !== null) {
      // Remove just the child condition
      removeFromConditionBlock(blockId, 'childCondition', childIndex);
    }
    
    // Close the confirmation modal
    setDeleteConfirmation({
      isOpen: false,
      blockId: null,
      conditionIndex: null,
      isMainCondition: false,
      childIndex: null
    });
  };
  
  // Cancel deletion
  const cancelDeleteCondition = () => {
    setDeleteConfirmation({
      isOpen: false,
      blockId: null,
      conditionIndex: null,
      isMainCondition: false,
      childIndex: null
    });
  };
  
  // Update all conditions
  const updateConditions = (newConditions) => {
    // For simple replacements, clear and add all conditions
    clearConditionBlocks();
    
    // Add each condition as a new block
    if (newConditions && newConditions.length) {
      newConditions.forEach(condition => {
        addCondition(condition);
      });
    }
  };
  
  // Toggle the logic operator (AND/OR) for a condition
  const toggleLogicOperator = (index) => {
    const conditions = getConditions();
    if (index >= conditions.length) return;
    
    // Find the corresponding block and element 
    // Similar to deleteCondition
    let found = false;
    let targetBlockId = null;
    let isMainCondition = false;
    let childIndex = null;
    let blockIndex = 0;
    
    for (const block of conditionBlocks) {
      // Check if it's the main condition
      if (blockIndex === index) {
        targetBlockId = block.id;
        isMainCondition = true;
        found = true;
        break;
      }
      
      blockIndex++;
      
      // Check child conditions
      for (let i = 0; i < block.childConditions.length; i++) {
        if (blockIndex === index) {
          targetBlockId = block.id;
          childIndex = i;
          found = true;
          break;
        }
        blockIndex++;
      }
      
      if (found) break;
      
      // Skip approvers only (required and optional fields are now in childConditions)
      blockIndex += block.approvers.length;
    }
    
    if (!found) return;
    
    // Toggle the logic operator
    if (isMainCondition) {
      const block = conditionBlocks.find(b => b.id === targetBlockId);
      if (!block) return;
      
      const updatedCondition = {
        ...block.mainCondition,
        logicOperator: block.mainCondition.logicOperator === 'AND' ? 'OR' : 'AND'
      };
      
      updateMainCondition(targetBlockId, updatedCondition);
    } else if (childIndex !== null) {
      const block = conditionBlocks.find(b => b.id === targetBlockId);
      if (!block || !block.childConditions[childIndex]) return;
      
      const updatedCondition = {
        ...block.childConditions[childIndex],
        logicOperator: block.childConditions[childIndex].logicOperator === 'AND' ? 'OR' : 'AND'
      };
      
      updateChildCondition(targetBlockId, childIndex, updatedCondition);
    }
  };
  
  // Signal that a state change is pending (used for re-rendering)
  const notifyStateChange = (newState) => {
    setStateUpdatePending(true);
    
    // If new state is provided, update the condition blocks
    if (newState) {
      setConditionBlocks(newState);
    }
    
    // Reset the pending flag after a short delay
    setTimeout(() => {
      setStateUpdatePending(false);
    }, 10);
  };
  
  // Process pending conditions and approvers in a single operation
  // This centralized function handles complex operations like editing and creating conditions
  const processPendingConditions = (approverCondition) => {
    try {
      // Check if we're in edit mode
      let isEditing = false;
      try {
        const isEditingStr = sessionStorage.getItem('isEditingCondition');
        if (isEditingStr) {
          isEditing = JSON.parse(isEditingStr);
        }
      } catch (err) {
        console.error('Error parsing isEditingCondition:', err);
      }
      
      // Retrieve pending conditions from sessionStorage
      let pendingFirstCondition = null;
      let pendingAdditionalConditions = [];
      
      try {
        const pendingFirstStr = sessionStorage.getItem('pendingFirstCondition');
        if (pendingFirstStr) {
          pendingFirstCondition = JSON.parse(pendingFirstStr);
        }
      } catch (e) {
        console.error('Error parsing pendingFirstCondition:', e);
      }
      
      try {
        const pendingAdditionalStr = sessionStorage.getItem('pendingAdditionalConditions');
        if (pendingAdditionalStr) {
          pendingAdditionalConditions = JSON.parse(pendingAdditionalStr);
        }
      } catch (e) {
        console.error('Error parsing pendingAdditionalConditions:', e);
        pendingAdditionalConditions = [];
      }
      
      // Clean up sessionStorage
      try {
        sessionStorage.removeItem('pendingFirstCondition');
        sessionStorage.removeItem('pendingAdditionalConditions');
        sessionStorage.removeItem('isEditingCondition');
      } catch (e) {
        console.error('Error removing items from sessionStorage:', e);
      }
      
      // Handle editing vs creating new conditions
      let blockId = null;
      
      // Important: Only enter edit mode if BOTH isEditing flag is true AND we have a valid editingBlockId
      // This fixes the issue where new conditions were being added to existing blocks
      if (isEditing === true && editingBlockId && editingBlockId !== null) {
        console.log('Editing existing condition block:', editingBlockId);
        // We're editing an existing block
        blockId = editingBlockId;
        const blockToEdit = conditionBlocks.find(block => block.id === blockId);
        
        if (blockToEdit) {
          // Update the block with the new conditions
          setConditionBlocks(prevBlocks => {
            return prevBlocks.map(block => {
              if (block.id === blockId) {
                // Replace the main condition
                let updatedBlock = { ...block };
                
                if (pendingFirstCondition) {
                  updatedBlock.mainCondition = pendingFirstCondition;
                }
                
                // For a simple edit without changes to child conditions, just keep them
                if (pendingAdditionalConditions.length === 0 && block.childConditions) {
                  // Do nothing, keep existing child conditions
                } else {
                  // Replace child conditions with new ones
                  updatedBlock.childConditions = pendingAdditionalConditions;
                }
                
                // Handle approver replacement to prevent duplicates
                if (approverCondition) {
                  // ENHANCED: Validate approver data structure
                  if (approverCondition.metadata) {
                    // Ensure approvers is always a valid array
                    if (!Array.isArray(approverCondition.metadata.approvers)) {
                      console.warn('Fixing non-array approvers in processPendingConditions:', 
                        approverCondition.metadata.approvers);
                      
                      // Convert to array based on data type
                      if (typeof approverCondition.metadata.approvers === 'string') {
                        approverCondition.metadata.approvers = [approverCondition.metadata.approvers];
                      } else if (approverCondition.metadata.approvers && 
                                typeof approverCondition.metadata.approvers === 'object') {
                        approverCondition.metadata.approvers = Object.values(approverCondition.metadata.approvers);
                      } else {
                        approverCondition.metadata.approvers = [];
                      }
                      
                      // Update text field to match fixed approvers
                      if (approverCondition.metadata.approvers.length > 0) {
                        const approvalTypeDisplay = approverCondition.metadata.approvalType === 'any' ? 'any' : 'all';
                        const approversList = approverCondition.metadata.approvers.join(', ');
                        approverCondition.text = `${approvalTypeDisplay}: ${approversList}`;
                      }
                      
                      console.log('Fixed approvers array in processPendingConditions:', 
                        approverCondition.metadata.approvers);
                    }
                  }
                  
                  if (approverCondition.metadata?.replaceExisting) {
                    // Replace all approvers with the new one to avoid duplications
                    updatedBlock.approvers = [approverCondition];
                  } else {
                    // Add the approver to the existing ones
                    updatedBlock.approvers = [...block.approvers, approverCondition];
                  }
                }
                
                return updatedBlock;
              }
              return block;
            });
          });
        } else {
          console.error('Block not found for editing:', editingBlockId);
        }
        
        // Reset the editing block ID
        setEditingBlockId(null);
      } else {
        // We're creating a new condition block
        if (pendingFirstCondition) {
          // Create a new block with the main condition
          blockId = addConditionBlock(pendingFirstCondition);
          
          // Add child conditions
          if (pendingAdditionalConditions && pendingAdditionalConditions.length > 0) {
            pendingAdditionalConditions.forEach(condition => {
              addToConditionBlock(blockId, 'childCondition', condition);
            });
          }
          
          // Add the approver with validation
          if (approverCondition) {
            // Validate approver data structure before adding
            if (approverCondition.metadata) {
              // Ensure approvers is always a valid array
              if (!Array.isArray(approverCondition.metadata.approvers)) {
                console.warn('Fixing non-array approvers before adding to block:', 
                  approverCondition.metadata.approvers);
                
                // Convert to array based on data type
                if (typeof approverCondition.metadata.approvers === 'string') {
                  approverCondition.metadata.approvers = [approverCondition.metadata.approvers];
                } else if (approverCondition.metadata.approvers && 
                          typeof approverCondition.metadata.approvers === 'object') {
                  approverCondition.metadata.approvers = Object.values(approverCondition.metadata.approvers);
                } else {
                  approverCondition.metadata.approvers = [];
                }
                
                // Update text field to match fixed approvers
                if (approverCondition.metadata.approvers.length > 0) {
                  const approvalTypeDisplay = approverCondition.metadata.approvalType === 'any' ? 'any' : 'all';
                  const approversList = approverCondition.metadata.approvers.join(', ');
                  approverCondition.text = `${approvalTypeDisplay}: ${approversList}`;
                }
                
                console.log('Fixed approvers array before adding to block:', 
                  approverCondition.metadata.approvers);
              }
            }
            
            // Now add the validated approver condition
            addToConditionBlock(blockId, 'approver', approverCondition);
          }
        }
      }
      
      return blockId;
    } catch (error) {
      console.error('Error in processPendingConditions:', error);
      return null;
    }
  };
  
  // Helper to show condition blocks (used after operations)
  const showConditionBlock = () => {
    // Trigger a re-render to update the UI
    notifyStateChange();
  };

  return {
    // Enhanced hierarchical state
    conditionBlocks,
    
    // Delete confirmation state
    deleteConfirmation,
    confirmDeleteCondition,
    cancelDeleteCondition,
    
    // Editing state
    editingCondition,
    setEditingCondition,
    editingBlockId,
    setEditingBlockId,
    stateUpdatePending,
    
    // Direct block operations
    addConditionBlock,
    deleteConditionBlock,
    addToConditionBlock,
    removeFromConditionBlock,
    replaceInConditionBlock,
    updateMainCondition,
    updateChildCondition,
    clearConditionBlocks,
    
    // Condition editing
    editMainCondition,
    editChildCondition,
    
    // Enhanced condition operations
    processPendingConditions,
    notifyStateChange,
    showConditionBlock,
    
    // Legacy condition operations (flat list)
    conditions: getConditions(),
    addCondition,
    deleteCondition,
    updateConditions,
    toggleLogicOperator
  };
};

export default useWorkflowState;