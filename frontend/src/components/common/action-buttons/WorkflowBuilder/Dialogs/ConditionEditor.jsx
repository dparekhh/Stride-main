import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ConditionRow from './ConditionRow';
import { operatorOptions as operatorOptionsList, getOptionsForCondition, valueSelectionConfig } from '../../../../../utils/WorkflowBuilderConfig';

// Format operator options for dropdown
const operatorOptions = operatorOptionsList.map(op => ({
  label: op,
  value: op
}));

/**
 * ConditionEditor component - Dialog for creating and editing conditions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.title - Dialog title
 * @param {Array} props.conditionOptions - Available condition options
 * @param {Function} props.onClose - Callback for close action
 * @param {Function} props.onSave - Callback for save action
 * @param {Object} [props.initialCondition] - Initial condition for editing
 * @returns {JSX.Element|null} The ConditionEditor component or null if closed
 */
const ConditionEditor = ({
  isOpen,
  title = 'Set Conditions',
  conditionOptions,
  onClose,
  onSave,
  initialCondition = null
}) => {
  // Initialize state for condition rows
  const [conditionRows, setConditionRows] = useState([
    {
      id: 0,
      condition: '',
      operator: 'equals',
      value: '',
      logicOperator: 'AND',
      showLogicDropdown: false
    }
  ]);
  
  // Load initial condition if provided (for editing) or reset to default empty state
  useEffect(() => {
    if (initialCondition) {
      if (initialCondition.conditions && initialCondition.conditions.length > 0) {
        // Handle hierarchical condition with sub-conditions
        const formattedRows = initialCondition.conditions.map((cond, idx) => ({
          id: idx,
          condition: cond.type,
          operator: cond.operator,
          value: cond.value,
          logicOperator: cond.logicOperator || 'AND',
          showLogicDropdown: idx > 0
        }));
        setConditionRows(formattedRows);
      } else {
        // Handle simple condition
        setConditionRows([
          {
            id: 0,
            condition: initialCondition.type,
            operator: initialCondition.operator,
            value: initialCondition.value,
            logicOperator: 'AND',
            showLogicDropdown: false
          }
        ]);
      }
    } else {
      // Reset to default state for new conditions
      setConditionRows([
        {
          id: 0,
          condition: '',
          operator: 'equals',
          value: '',
          logicOperator: 'AND',
          showLogicDropdown: false
        }
      ]);
    }
  }, [initialCondition, isOpen]);
  
  // Add a new condition row
  const addConditionRow = () => {
    const newId = conditionRows.length;
    setConditionRows([
      ...conditionRows,
      {
        id: newId,
        condition: '',
        operator: 'equals',
        value: '',
        logicOperator: 'AND',
        showLogicDropdown: true
      }
    ]);
  };
  
  // Update a specific condition row
  const updateConditionRow = (id, field, value) => {
    console.log(`Updating row ${id}, field ${field} with value:`, value);
    setConditionRows(
      conditionRows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };
  
  // Delete a condition row
  const deleteConditionRow = (id) => {
    setConditionRows(conditionRows.filter(row => row.id !== id));
  };
  
  // Toggle the logic operator (AND/OR)
  const toggleLogicOperator = (id) => {
    setConditionRows(
      conditionRows.map(row =>
        row.id === id
          ? { ...row, logicOperator: row.logicOperator === 'AND' ? 'OR' : 'AND' }
          : row
      )
    );
  };
  
  // Validate all condition rows to enable/disable save button
  const isValid = () => {
    return conditionRows.every(row => 
      row.condition && 
      row.operator && 
      (row.value !== undefined && row.value !== null && row.value !== '')
    );
  };
  
  // Handle save action
  const handleSave = () => {
    // Format the condition data
    const formattedCondition = {
      type: 'group', // Use group type for multiple conditions
      conditions: conditionRows.map(row => ({
        type: row.condition,
        operator: row.operator,
        value: row.value,
        logicOperator: row.logicOperator
      }))
    };
    
    // If there's only one condition, simplify the structure
    if (conditionRows.length === 1) {
      const { condition, operator, value } = conditionRows[0];
      onSave({
        type: condition,
        operator,
        value
      });
    } else {
      onSave(formattedCondition);
    }
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          {/* Condition rows */}
          {conditionRows.map((row, index) => {
            // Get dynamic value options based on selected condition
            const valueOptions = row.condition ? getOptionsForCondition(row.condition) : [];
            
            return (
              <ConditionRow
                key={row.id}
                condition={row.condition}
                operator={row.operator}
                value={row.value}
                logicOperator={row.logicOperator}
                conditionOptions={conditionOptions}
                operatorOptions={operatorOptions}
                valueOptions={valueOptions || []}
                onConditionChange={(value) => {
                  console.log('Condition selected in editor:', value);
                  
                  // Batch state updates by creating a new row object with both condition and value updated
                  setConditionRows(prevRows => 
                    prevRows.map(prevRow => 
                      prevRow.id === row.id 
                        ? { ...prevRow, condition: value, value: '' } 
                        : prevRow
                    )
                  );
                }}
                onOperatorChange={(value) => updateConditionRow(row.id, 'operator', value)}
                onValueChange={(value) => updateConditionRow(row.id, 'value', value)}
                onLogicOperatorToggle={() => toggleLogicOperator(row.id)}
                onDelete={() => deleteConditionRow(row.id)}
                showLogicOperator={index > 0}
                isFirst={index === 0}
              />
            );
          })}
        </div>
        
        {/* Add Condition button */}
        <div className="mb-6">
          <button
            onClick={addConditionRow}
            className="flex items-center bg-white text-black border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
          >
            <Plus size={18} className="mr-1" />
            <span>Add another condition</span>
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid()}
          >
            Save & close
          </button>
        </div>
      </div>
    </div>
  );
};

ConditionEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  conditionOptions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialCondition: PropTypes.object
};

export default ConditionEditor;