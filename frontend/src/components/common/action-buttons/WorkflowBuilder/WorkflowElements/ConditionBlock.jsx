import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronDown, Trash2, GitMerge, FileText, FileEdit, PlusCircle } from 'lucide-react';
import AddButton from './AddButton';
import { useWorkflowBuilderContext } from '../WorkflowBuilderProvider';

/**
 * ConditionBlock component - Main condition rendering block
 * 
 * @param {Object} props - Component props
 * @param {Object} props.condition - Condition object with type, operator, value, etc.
 * @param {number} props.index - Index of this condition in the conditions array
 * @param {boolean} props.isHovered - Whether the block is being hovered
 * @param {Function} props.onHover - Callback for hover events
 * @param {Function} props.onEdit - Callback for edit action
 * @param {Function} props.onDelete - Callback for delete action
 * @param {Function} props.onAddSubCondition - Callback for adding a sub-condition
 * @param {React.ReactNode} [props.children] - Child components (sub-conditions)
 * @returns {JSX.Element} The ConditionBlock component
 */
const ConditionBlock = ({
  condition,
  index,
  isHovered,
  onHover,
  onEdit,
  onDelete,
  onAddSubCondition,
  children
}) => {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  
  // Define options for add button dropdowns
  const addOptions = [
    { label: 'Add Approver', value: 'add-approver', disabled: false },
    { label: 'Add Required Fields', value: 'add-required-fields', disabled: false },
    { label: 'Add Optional Fields', value: 'add-optional-fields', disabled: false },
  ];
  
  // Get condition text based on type, operator, and value
  const getConditionText = () => {
    const { type, operator, value, conditions, fields, approvers, approvalType } = condition;
    
    // Handle special condition types
    if (type === 'required-fields' && Array.isArray(fields)) {
      return `Required fields: ${fields.join(', ')}`;
    }
    
    if (type === 'optional-fields' && Array.isArray(fields)) {
      return `Optional fields: ${fields.join(', ')}`;
    }
    
    if (type === 'approver' && Array.isArray(approvers)) {
      const approverLabels = approvers.map(approver => approver.label || approver.value).join(', ');
      const typeLabel = approvalType === 'any' ? 'Any of' : 'All of';
      return `Approver: ${typeLabel} ${approverLabels}`;
    }
    
    // Handle group conditions (multiple conditions with AND/OR)
    if (type === 'group' && Array.isArray(conditions) && conditions.length > 0) {
      return conditions.map((cond, idx) => {
        let displayValue = cond.value;
        if (Array.isArray(cond.value)) {
          displayValue = cond.value.join(', ');
        } else if (typeof cond.value === 'number') {
          // Format number with commas for thousands
          displayValue = cond.value.toLocaleString('en-IN');
          // Add ₹ symbol for amount
          if (cond.type === 'Amount') {
            displayValue = `₹${displayValue}`;
          }
        }
        
        const condText = `${cond.type} ${cond.operator} ${displayValue}`;
        if (idx > 0) {
          return `${cond.logicOperator === 'AND' ? 'AND' : 'OR'} ${condText}`;
        }
        return condText;
      }).join(' ');
    }
    
    // Handle standard conditions
    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'number') {
      // Format number with commas for thousands
      displayValue = value.toLocaleString('en-IN');
      // Add ₹ symbol for amount
      if (type === 'Amount') {
        displayValue = `₹${displayValue}`;
      }
    }
    
    // Only include operator and value if they exist (for standard conditions)
    if (operator && (value !== undefined && value !== null)) {
      return `${type} ${operator} ${displayValue}`;
    }
    
    // Fallback for any other condition types
    return type;
  };
  
  // Use the addOptions for dropdown menus
  
  return (
    <div
      className="condition-block mb-4 relative"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Vertical connection line */}
      <div className="absolute h-full w-0.5 bg-gray-200 left-4 top-6 -ml-1"></div>
      
      {/* Block content */}
      <div className="flex items-start">
        {/* Horizontal connection line and dot */}
        <div className="flex items-center mr-2">
          <div className="w-6 h-0.5 bg-gray-200"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
        
        {/* Main content */}
        <div
          className={`condition-content flex-grow rounded-lg border ${
            isHovered ? 'border-black shadow-sm' : 'border-black'
          } p-3`}
        >
          {/* Condition text */}
          <div className="flex justify-between items-start">
            <div className="condition-text-container">
              <span className="condition-text leading-relaxed pr-4">
                {getConditionText()}
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2 ml-2">
              {/* Edit/Delete buttons only on hover */}
              {isHovered && (
                <>
                  <button
                    onClick={onEdit}
                    className="text-gray-500 hover:text-blue-600"
                    aria-label="Edit condition"
                  >
                    <FileEdit size={16} />
                  </button>
                  <button
                    onClick={onDelete}
                    className="text-gray-500 hover:text-red-600"
                    aria-label="Delete condition"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Sub-conditions with enhanced indentation */}
          {children && (
            <div className="sub-conditions ml-6 mt-3 border-l-2 border-gray-300 pl-4 py-2">
              <div className="space-y-3 relative">
                {/* Visual indicator for child relationship */}
                <div className="absolute w-4 h-0.5 bg-gray-300 -left-4 top-3"></div>
                {children}
                
                {/* Indented Add button below children */}
                <div className="mt-2">
                  <AddButton
                    options={addOptions}
                    onOptionSelect={(option) => onAddSubCondition(option)}
                    buttonClassName="text-blue-600 font-medium text-sm hover:text-blue-700 bg-white py-1 px-2 rounded border border-gray-300 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define the condition shape
const conditionShape = {
  type: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logicOperator: PropTypes.string
};

// For standard conditions, require operator and value
const standardConditionShape = {
  ...conditionShape,
  operator: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ])
};

// For group conditions, require conditions array
const groupConditionShape = {
  ...conditionShape,
  conditions: PropTypes.array.isRequired
};

// For required/optional fields conditions
const fieldsConditionShape = {
  ...conditionShape,
  fields: PropTypes.array
};

// For approver conditions
const approverConditionShape = {
  ...conditionShape,
  approvers: PropTypes.array,
  approvalType: PropTypes.string
};

// Allow recursive definition for nested conditions
let recursiveConditionShape = {};
recursiveConditionShape = {
  ...standardConditionShape,
  conditions: PropTypes.arrayOf(PropTypes.shape(recursiveConditionShape))
};

ConditionBlock.propTypes = {
  condition: PropTypes.oneOfType([
    PropTypes.shape(standardConditionShape),
    PropTypes.shape(groupConditionShape),
    PropTypes.shape(fieldsConditionShape),
    PropTypes.shape(approverConditionShape)
  ]).isRequired,
  index: PropTypes.number.isRequired,
  isHovered: PropTypes.bool.isRequired,
  onHover: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddSubCondition: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ConditionBlock;