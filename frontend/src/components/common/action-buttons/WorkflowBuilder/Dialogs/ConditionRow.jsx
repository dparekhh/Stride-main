import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { valueSelectionConfig, primaryConditions, operatorOptions } from '../../../../../utils/WorkflowBuilderConfig';
import roles from '../../../../../utils/PeoplePage_Role';
import { people, departments, locations } from '../../../../../utils/PeoplePage_PlaceholderPeople';
import { MOCK_CARD_TRANSACTION_EXPENSES } from '../../../../../utils/Expenses_CardTransactionPageData';
import SearchableDropdown from '../../../../common/SearchableDropdown';

/**
 * ConditionRow component for the ConditionEditor dialog
 * This renders a single editable condition row with dropdowns for type, operator, and value
 * that dynamically changes based on the selected condition
 */
const ConditionRow = ({
  condition,
  operator,
  value,
  logicOperator,
  conditionOptions,
  operatorOptions,
  valueOptions,
  onConditionChange,
  onOperatorChange,
  onValueChange,
  onLogicOperatorToggle,
  onDelete,
  showLogicOperator,
  isFirst
}) => {
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [showValueDropdown, setShowValueDropdown] = useState(false);
  const [valueInput, setValueInput] = useState(value ? value.toString() : '');
  const [dynamicValueOptions, setDynamicValueOptions] = useState([]);
  
  // Get dynamic value options based on the selected condition
  useEffect(() => {
    if (!condition) {
      setDynamicValueOptions([]);
      return;
    }
    
    if (valueSelectionConfig[condition]) {
      // If options are directly provided in the config
      if (valueSelectionConfig[condition].options) {
        setDynamicValueOptions(valueSelectionConfig[condition].options);
      } 
      // If options come from a function
      else if (valueSelectionConfig[condition].source) {
        try {
          const options = valueSelectionConfig[condition].source();
          setDynamicValueOptions(options || []);
        } catch (error) {
          console.error(`Error loading options for ${condition}:`, error);
          setDynamicValueOptions([]);
        }
      } else {
        setDynamicValueOptions([]);
      }
    } else {
      setDynamicValueOptions([]);
    }
  }, [condition]);
  
  // Update value input when value prop changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setValueInput(value.toString());
    }
  }, [value]);
  
  // Handle logic operator toggle (AND/OR)
  const handleLogicOperatorToggle = () => {
    if (onLogicOperatorToggle) {
      onLogicOperatorToggle();
    }
  };
  
  // Handle selecting a condition from dropdown
  const handleConditionSelect = (option) => {
    console.log('Condition selected:', option);
    // Directly call the parent's handler with the selected option
    // We'll handle dropdown state as a separate concern
    onConditionChange(option);
    // Close the dropdown after state is updated
    setShowConditionDropdown(false);
  };
  
  // Handle selecting an operator from dropdown
  const handleOperatorSelect = (option) => {
    // Directly call the parent's handler
    // If the option is already a string (backward compatibility), use it directly
    // Otherwise, use the value property from the object
    const operatorValue = typeof option === 'string' ? option : option.value;
    onOperatorChange(operatorValue);
    // Close the dropdown after state is updated
    setShowOperatorDropdown(false);
  };
  
  // Handle value input change
  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValueInput(newValue);
    
    // Only update parent when the field loses focus
    // This prevents constant re-renders while typing
    if (e.type === 'blur') {
      onValueChange(newValue);
    }
  };
  
  // Handle Enter key in value input
  const handleValueKeyDown = (e) => {
    if (e.key === 'Enter') {
      onValueChange(valueInput);
    }
  };
  
  // Handle selecting a value from dropdown (if applicable)
  const handleValueSelect = (option) => {
    // Directly call the parent's handler
    onValueChange(option);
    // Close the dropdown after state is updated
    setShowValueDropdown(false);
  };
  
  return (
    <div className="mb-4 flex flex-col">
      {/* Logic operator (AND/OR) for non-first rows */}
      {showLogicOperator && (
        <div className="mb-2 flex items-center">
          <button
            type="button"
            onClick={handleLogicOperatorToggle}
            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-md hover:bg-gray-200"
          >
            {logicOperator === 'AND' ? 'AND' : 'OR'}
          </button>
          <span className="ml-2 text-sm text-gray-500">
            {logicOperator === 'AND' 
              ? 'All conditions must be true' 
              : 'Any condition must be true'}
          </span>
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        {/* Condition type dropdown - Using SearchableDropdown */}
        <div className="min-w-[120px]">
          <SearchableDropdown
            value={condition}
            onChange={handleConditionSelect}
            options={conditionOptions}
            placeholder="Select condition"
            searchPlaceholder="Search conditions..."
            className="condition-dropdown"
            showFooter={false}
          />
        </div>
        
        {/* Operator dropdown - Using SearchableDropdown */}
        <div className="min-w-[100px]">
          <SearchableDropdown
            value={typeof operator === 'object' ? operator.value : operator}
            onChange={handleOperatorSelect}
            options={operatorOptions.map(option => 
              typeof option === 'string' 
                ? option 
                : { ...option, name: option.label, id: option.value }
            )}
            placeholder="Operator"
            searchPlaceholder="Search operators..."
            displayKey="label"
            valueKey="value"
            className="operator-dropdown"
            showFooter={false}
          />
        </div>
        
        {/* Value input or dropdown - dynamically changes based on condition */}
        <div className="relative flex-grow">
          {condition && valueSelectionConfig[condition] ? (
            <>
              {/* Show dropdown for dropdown type fields */}
              {valueSelectionConfig[condition].type === 'dropdown' && (
                <div className="relative">
                  <SearchableDropdown
                    value={value}
                    onChange={handleValueSelect}
                    options={dynamicValueOptions}
                    placeholder="Select value"
                    searchPlaceholder="Search values..."
                    className="value-dropdown"
                    showFooter={false}
                    isMulti={true}
                  />
                  
                  {/* Custom tags for selected values - enhanced styling */}
                  {Array.isArray(value) && value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {value.map((val, idx) => (
                        <div 
                          key={`selected-${idx}`}
                          className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm border border-gray-200 shadow-sm"
                        >
                          <span className="mr-2">{val}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newValues = [...value];
                              newValues.splice(idx, 1);
                              onValueChange(newValues.length > 0 ? newValues : null);
                            }}
                            className="text-gray-500 hover:text-red-600 transition-colors duration-150"
                            aria-label={`Remove ${val}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Show currency input for Amount */}
              {valueSelectionConfig[condition].type === 'currency' && (
                <div className="flex items-center">
                  <span className="px-2 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">₹</span>
                  <input
                    type="number"
                    value={valueInput}
                    onChange={handleValueChange}
                    onBlur={handleValueChange}
                    onKeyDown={handleValueKeyDown}
                    placeholder={valueSelectionConfig[condition].placeholder || "Enter amount"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </>
          ) : (
            // Default text input for any condition without specific config
            <input
              type="text"
              value={valueInput}
              onChange={handleValueChange}
              onBlur={handleValueChange}
              onKeyDown={handleValueKeyDown}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )}
        </div>
        
        {/* Delete button */}
        {!isFirst && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600"
            aria-label="Remove condition"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

ConditionRow.propTypes = {
  condition: PropTypes.string,
  operator: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ]),
  value: PropTypes.any,
  logicOperator: PropTypes.oneOf(['AND', 'OR']),
  conditionOptions: PropTypes.array.isRequired,
  operatorOptions: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ])).isRequired,
  valueOptions: PropTypes.array,
  onConditionChange: PropTypes.func.isRequired,
  onOperatorChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onLogicOperatorToggle: PropTypes.func,
  onDelete: PropTypes.func,
  showLogicOperator: PropTypes.bool,
  isFirst: PropTypes.bool
};

export default ConditionRow;