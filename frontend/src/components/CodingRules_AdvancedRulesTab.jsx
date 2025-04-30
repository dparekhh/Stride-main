import React, { useState } from 'react';
import { Plus, Info, ChevronDown, ChevronUp, AlertCircle, X, Zap, Check, Edit2 } from 'lucide-react';

/**
 * CodingRules_AdvancedRulesTab Component
 * 
 * This component handles the Advanced Rules tab in the Coding Rules drawer,
 * allowing users to create complex rule-based accounting workflows with 
 * multi-condition logic.
 */
const CodingRules_AdvancedRulesTab = () => {
  // State for active rules
  const [advancedRules, setAdvancedRules] = useState([]);
  
  // State for rule creation/editing
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    id: null,
    name: '',
    conditions: [],
    outputs: [],
    isActive: true
  });
  
  // State for department/location specific logic
  const [isDepartmentSpecific, setIsDepartmentSpecific] = useState(false);
  const [departmentSelections, setDepartmentSelections] = useState([]);
  const [showDepartmentConfirmation, setShowDepartmentConfirmation] = useState(false);
  
  // Sample data for dropdowns
  const strideInputs = [
    { id: 'merchant', name: 'Card Merchant', type: 'text' },
    { id: 'category', name: 'Card Category', type: 'select' },
    { id: 'amount', name: 'Transaction Amount', type: 'number' },
    { id: 'department', name: 'Department', type: 'select' },
    { id: 'location', name: 'Location', type: 'select' }
  ];
  
  const departments = [
    { id: 1, name: 'Marketing' },
    { id: 2, name: 'Sales' },
    { id: 3, name: 'Engineering' },
    { id: 4, name: 'Finance' },
    { id: 5, name: 'Operations' }
  ];
  
  const sampleCategories = [
    { id: 1, name: 'Food & Dining' },
    { id: 2, name: 'Travel' },
    { id: 3, name: 'Software & Tools' },
    { id: 4, name: 'Office Supplies' }
  ];
  
  const sampleMerchants = [
    { id: 1, name: 'Zomato' },
    { id: 2, name: 'Swiggy' },
    { id: 3, name: 'BlinkIt' },
    { id: 4, name: 'Amazon' }
  ];
  
  const expenseCodes = [
    { id: 'exp_1', name: 'Marketing - Digital Ads' },
    { id: 'exp_2', name: 'Travel - Accommodation' },
    { id: 'exp_3', name: 'Food - Team Meals' },
    { id: 'exp_4', name: 'Software - Subscriptions' }
  ];
  
  // Handle creating a new rule
  const handleCreateRule = () => {
    setCurrentRule({
      id: Date.now(), // Use timestamp as temporary ID
      name: '',
      conditions: [{ id: Date.now(), inputType: '', inputValue: '', operator: 'equals', values: [] }],
      outputs: [{ id: Date.now(), type: 'expenseCode', value: '' }],
      isActive: true
    });
    setIsCreatingRule(true);
  };
  
  // Add a new condition to the rule
  const addCondition = () => {
    setCurrentRule({
      ...currentRule,
      conditions: [
        ...currentRule.conditions, 
        { id: Date.now(), inputType: '', inputValue: '', operator: 'equals', values: [] }
      ]
    });
  };
  
  // Update a condition
  const updateCondition = (id, field, value) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    });
  };
  
  // Add value to a condition (for OR logic within a condition)
  const addValueToCondition = (conditionId, value) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.map(condition => 
        condition.id === conditionId 
          ? { ...condition, values: [...condition.values, value] } 
          : condition
      )
    });
  };
  
  // Remove value from a condition
  const removeValueFromCondition = (conditionId, valueIndex) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.map(condition => 
        condition.id === conditionId 
          ? { 
              ...condition, 
              values: condition.values.filter((_, index) => index !== valueIndex) 
            } 
          : condition
      )
    });
  };
  
  // Remove a condition
  const removeCondition = (id) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.filter(condition => condition.id !== id)
    });
  };
  
  // Handle department selection change
  const handleDepartmentSelectionChange = (departmentId, selected) => {
    if (selected) {
      setDepartmentSelections([...departmentSelections, departmentId]);
    } else {
      setDepartmentSelections(departmentSelections.filter(id => id !== departmentId));
    }
  };
  
  // Handle department specific toggle
  const handleDepartmentSpecificToggle = () => {
    if (!isDepartmentSpecific) {
      setShowDepartmentConfirmation(true);
    } else {
      setIsDepartmentSpecific(false);
      setDepartmentSelections([]);
    }
  };
  
  // Confirm department specific setup
  const confirmDepartmentSpecific = () => {
    setIsDepartmentSpecific(true);
    setShowDepartmentConfirmation(false);
  };
  
  // State for form validation errors
  const [nameError, setNameError] = useState(false);
  
  // Save the rule
  const saveRule = () => {
    // Reset error state
    setNameError(false);
    
    if (!currentRule.name.trim()) {
      // Show error - rule name is required
      setNameError(true);
      return;
    }
    
    if (currentRule.id === null) {
      // Add new rule
      setAdvancedRules([...advancedRules, { ...currentRule, id: Date.now() }]);
    } else {
      // Update existing rule
      setAdvancedRules(advancedRules.map(rule => 
        rule.id === currentRule.id ? currentRule : rule
      ));
    }
    
    setIsCreatingRule(false);
    setCurrentRule({
      id: null,
      name: '',
      conditions: [],
      outputs: [],
      isActive: true
    });
    setIsDepartmentSpecific(false);
    setDepartmentSelections([]);
  };
  
  // Cancel rule creation/editing
  const cancelRuleCreation = () => {
    setIsCreatingRule(false);
    setCurrentRule({
      id: null,
      name: '',
      conditions: [],
      outputs: [],
      isActive: true
    });
    setIsDepartmentSpecific(false);
    setDepartmentSelections([]);
    setShowDepartmentConfirmation(false);
  };
  
  // Get input options based on selected input type
  const getInputOptions = (inputType) => {
    switch (inputType) {
      case 'merchant':
        return sampleMerchants;
      case 'category':
        return sampleCategories;
      case 'department':
        return departments;
      default:
        return [];
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {!isCreatingRule ? (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Rules</h3>
            <button 
              onClick={handleCreateRule}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF6B00] hover:bg-[#e06000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
            >
              <Plus size={16} className="mr-2" />
              Create an Advanced Rule
            </button>
          </div>
          
          {advancedRules.length === 0 ? (
            <p className="text-sm text-gray-500 italic mt-2 mb-6">
              No advanced rules created yet. Click the button above to create your first rule.
            </p>
          ) : (
            <div className="space-y-4">
              {advancedRules.map(rule => {
                // Generate a smart summary of the rule
                const selectedInputs = rule.conditions
                  .filter(c => c.inputType && c.values.length > 0)
                  .map(c => {
                    const inputName = strideInputs.find(i => i.id === c.inputType)?.name || c.inputType;
                    return `${inputName} ${c.operator} ${c.values.join(' OR ')}`;
                  })
                  .join(' AND ');
                
                // Get the expense code name
                const expenseCodeValue = rule.outputs[0]?.value || '';
                const expenseCodeName = expenseCodes.find(e => e.id === expenseCodeValue)?.name || expenseCodeValue;
                
                return (
                  <div 
                    key={rule.id}
                    className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-base mb-1">{rule.name}</h4>
                        <p className="text-sm text-gray-500">
                          {selectedInputs} → {expenseCodeName}
                        </p>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={() => {
                          setCurrentRule(rule);
                          setIsCreatingRule(true);
                        }}
                        aria-label="Edit rule"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {currentRule.id ? 'Edit Advanced Rule' : 'Create Advanced Rule'}
            </h3>
            <button 
              onClick={cancelRuleCreation}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Conditions Section */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-2">Define conditions</h4>
            <p className="text-sm text-gray-500 mb-4">
              Select Stride inputs to create your rule. Multiple values within an input use OR logic, while different inputs use AND logic.
            </p>
            
            <div className="space-y-4">
              {currentRule.conditions.map((condition, index) => (
                <div key={condition.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      {index === 0 ? 'If' : 'AND'}
                    </h5>
                    {currentRule.conditions.length > 1 && (
                      <button 
                        onClick={() => removeCondition(condition.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <select
                      value={condition.inputType}
                      onChange={(e) => updateCondition(condition.id, 'inputType', e.target.value)}
                      className="mt-1 block w-1/3 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm rounded-md"
                    >
                      <option value="">Select input type</option>
                      {strideInputs.map(input => (
                        <option key={input.id} value={input.id}>{input.name}</option>
                      ))}
                    </select>
                    
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                      className="mt-1 block w-1/4 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm rounded-md"
                    >
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="startsWith">Starts with</option>
                      <option value="greaterThan">Greater than</option>
                      <option value="lessThan">Less than</option>
                    </select>
                  </div>
                  
                  {condition.inputType && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {condition.values.map((value, valueIndex) => (
                          <div 
                            key={valueIndex} 
                            className="bg-gray-100 rounded-md px-3 py-1 flex items-center text-sm"
                          >
                            <span>{value}</span>
                            <button 
                              onClick={() => removeValueFromCondition(condition.id, valueIndex)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addValueToCondition(condition.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm rounded-md"
                        >
                          <option value="">Add {condition.inputType}</option>
                          {getInputOptions(condition.inputType).map(option => (
                            <option 
                              key={option.id} 
                              value={option.name}
                              disabled={condition.values.includes(option.name)}
                            >
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {condition.values.length > 0 && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          Using OR logic: {condition.values.join(' OR ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <button
                onClick={addCondition}
                className="w-full border border-gray-300 border-dashed rounded-md p-3 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50"
              >
                <Plus size={14} className="mr-2" />
                Add another condition
              </button>
            </div>
          </div>
          
          {/* Department/Location Specific Logic */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-md font-medium text-gray-800">Department/Location specific</h4>
                <p className="text-sm text-gray-500">Apply different accounting codes based on department or location</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={isDepartmentSpecific} 
                  onChange={handleDepartmentSpecificToggle}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  style={{
                    right: isDepartmentSpecific ? '0' : 'auto',
                    backgroundColor: isDepartmentSpecific ? '#FF6B00' : 'white',
                    transform: isDepartmentSpecific ? 'translateX(100%)' : 'translateX(0)',
                    borderColor: isDepartmentSpecific ? '#FF6B00' : '#d1d5db'
                  }}
                />
                <label 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  style={{
                    backgroundColor: isDepartmentSpecific ? '#fcb08c' : '#d1d5db'
                  }}
                ></label>
              </div>
            </div>
            
            {/* Department confirmation modal */}
            {showDepartmentConfirmation && (
              <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertCircle className="h-6 w-6 text-orange-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Apply to all departments?
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            This will set up separate coding for each department. You'll need to create expense code mappings for each department individually.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FF6B00] text-base font-medium text-white hover:bg-[#e06000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={confirmDepartmentSpecific}
                      >
                        Yes, Set Up
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setShowDepartmentConfirmation(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Department selection */}
            {isDepartmentSpecific && (
              <div className="mt-4 border border-gray-200 rounded-md p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Select departments</h5>
                <div className="space-y-2">
                  {departments.map(dept => (
                    <div key={dept.id} className="flex items-center">
                      <input
                        id={`dept-${dept.id}`}
                        name={`dept-${dept.id}`}
                        type="checkbox"
                        checked={departmentSelections.includes(dept.id)}
                        onChange={(e) => handleDepartmentSelectionChange(dept.id, e.target.checked)}
                        className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                      />
                      <label htmlFor={`dept-${dept.id}`} className="ml-3 block text-sm text-gray-700">
                        {dept.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Output Mapping */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-2">Set outputs</h4>
            <p className="text-sm text-gray-500 mb-4">
              Define the accounting codes to use when the conditions match
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Expense Code</h5>
                <select
                  value={currentRule.outputs[0]?.value || ''}
                  onChange={(e) => {
                    setCurrentRule({
                      ...currentRule,
                      outputs: [{ id: currentRule.outputs[0]?.id || Date.now(), type: 'expenseCode', value: e.target.value }]
                    });
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm rounded-md"
                >
                  <option value="">Select expense code</option>
                  {expenseCodes.map(code => (
                    <option key={code.id} value={code.name}>{code.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Rule Name */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-800">Rule name</h4>
              {nameError && (
                <span className="text-red-500 text-sm">Required field</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Give your rule a descriptive name for easy reference
            </p>
            
            <input
              type="text"
              value={currentRule.name}
              onChange={(e) => {
                setCurrentRule({ ...currentRule, name: e.target.value });
                if (e.target.value.trim()) setNameError(false);
              }}
              placeholder="e.g., Food delivery expenses for Marketing"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                nameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FF6B00] focus:border-[#FF6B00]'
              } sm:text-sm rounded-md`}
              required
            />
          </div>
          
          {/* Save/Cancel Buttons */}
          <div className="pt-4 flex justify-end space-x-4">
            <button
              onClick={cancelRuleCreation}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
            >
              Cancel
            </button>
            
            <button
              onClick={saveRule}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF6B00] hover:bg-[#e06000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
              disabled={!currentRule.name.trim() || currentRule.conditions.length === 0 || !currentRule.outputs[0]?.value}
            >
              Save Rule
            </button>
          </div>
        </div>
      )}
      
      {/* Custom styles for toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          background-color: #FF6B00;
          border-color: #FF6B00;
          transform: translateX(100%);
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #fcb08c;
        }
      `}</style>
    </div>
  );
};

export default CodingRules_AdvancedRulesTab;