import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import { Z_INDEX_LEVELS } from '../../contexts/DrawerContext';
import { CHART_OF_ACCOUNTS, filterAccountsByVisibility } from '../../utils/accountingData';

/**
 * CreateNewRuleModal Component
 * 
 * A reusable modal for setting up categorization rules in the accounting system.
 * This modal allows users to create rules for automatically categorizing transactions
 * based on merchant, MCC category, or card name.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {string} props.merchantName - The merchant name for the rule
 * @param {number} props.merchantUnsyncedCount - Number of unsynced transactions for this merchant
 * @param {string} props.mccCategory - The MCC category for the rule
 * @param {number} props.mccUnsyncedCount - Number of unsynced transactions for this MCC category
 * @param {string} props.cardName - The card name for the rule
 * @param {number} props.cardNameUnsyncedCount - Number of unsynced transactions for this card
 * @param {string} props.selectedCategory - The pre-selected accounting category
 * @param {Object} props.existingRule - Existing rule data (for edit mode)
 * @param {Function} props.onSave - Function to call when saving the rule
 * @param {Object} props.transaction - The current transaction object containing department and location data
 */
const CreateNewRuleModal = ({
  isOpen,
  onClose,
  merchantName,
  merchantUnsyncedCount = 0,
  mccCategory,
  mccUnsyncedCount = 0,
  cardName,
  cardNameUnsyncedCount = 0,
  selectedCategory,
  existingRule = null,
  onSave,
  connectedProvider = "QuickBooks", // Default to QuickBooks if not provided
  transaction = null // Transaction object for dynamic data in department/location
}) => {
  // State for selected accounting category
  const [category, setCategory] = useState(selectedCategory || '');
  
  // State for radio button selection (condition)
  const [selectedCondition, setSelectedCondition] = useState('merchant');
  
  // State for show more options
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  // State for showing hidden accounts in the dropdown
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(false);
  
  // Determine if we're in create or edit mode
  const isEditMode = !!existingRule;
  
  // Modal content ref for proper scrolling
  const modalContentRef = useRef(null);
  
  // Get a category name from id for display purposes
  const getCategoryNameById = (categoryId) => {
    const foundCategory = CHART_OF_ACCOUNTS.find(cat => cat.id === categoryId);
    return foundCategory ? foundCategory.name : '';
  };
  
  // Reset states when modal opens/closes or selectedCategory changes
  useEffect(() => {
    if (isOpen) {
      // Reset to the current selectedCategory when the modal opens
      setCategory(selectedCategory || '');
      setSelectedCondition('merchant'); // Default to merchant when opening
      setErrors({});
    } else {
      // Reset all states when modal closes
      setShowMoreOptions(false);
    }
  }, [isOpen, selectedCategory]);

  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // Handle saving the rule
  const handleSave = () => {
    // Validate form data
    const newErrors = {};
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    // Check if we have a valid condition
    if (selectedCondition === 'merchant' && !merchantName) {
      newErrors.condition = 'Merchant is required';
    } else if (selectedCondition === 'mcc' && !mccCategory) {
      newErrors.condition = 'MCC Category is required';
    } else if (selectedCondition === 'card' && !cardName) {
      newErrors.condition = 'Card name is required';
    } else if (selectedCondition === 'department' && !(transaction?.department)) {
      newErrors.condition = 'Department is required';
    } else if (selectedCondition === 'location' && !(transaction?.location)) {
      newErrors.condition = 'Location is required';
    }
    
    // If there are errors, update state and stop form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any existing errors
    setErrors({});
    
    // Build rule data based on selected condition
    let ruleData = {
      category,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the specific condition data based on selection
    if (selectedCondition === 'merchant') {
      ruleData.merchantName = merchantName;
      ruleData.merchantUnsyncedCount = merchantUnsyncedCount;
    } else if (selectedCondition === 'mcc') {
      ruleData.mccCategory = mccCategory;
      ruleData.mccUnsyncedCount = mccUnsyncedCount;
    } else if (selectedCondition === 'card') {
      ruleData.cardName = cardName;
      ruleData.cardNameUnsyncedCount = cardNameUnsyncedCount;
    } else if (selectedCondition === 'department') {
      ruleData.department = transaction?.department || 'Engineering';
      ruleData.departmentUnsyncedCount = 12; // Placeholder count, should be dynamic in production
    } else if (selectedCondition === 'location') {
      ruleData.location = transaction?.location || 'Mumbai';
      ruleData.locationUnsyncedCount = 8; // Placeholder count, should be dynamic in production
    }
    
    onSave(ruleData);
    onClose();
  };

  // Only render if modal is open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50" 
      style={{ zIndex: Z_INDEX_LEVELS?.MODAL || 1000 }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full min-w-[24rem] max-w-[32rem] mx-auto overflow-hidden flex flex-col transition-all duration-300 ease-in-out max-h-[90vh]">
        {/* Modal header - fixed at top */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-700">
            Create a new rule
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal content - scrollable */}
        <div className="px-4 py-4 space-y-6 overflow-y-auto flex-grow" ref={modalContentRef}>
          {/* Condition section */}
          <div className="mb-5">
            <p className="text-base text-gray-600 mb-3">If a transaction includes:</p>
            
            {/* Merchant condition */}
            <div className="mb-2">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value="merchant"
                  checked={selectedCondition === 'merchant'}
                  onChange={() => setSelectedCondition('merchant')}
                  className="h-5 w-5 text-green-500 border border-gray-300 mr-2 focus:outline-none focus:ring-0 hover:bg-gray-50"
                />
                <div className="flex-1">
                  <div className="font-medium">{merchantName}</div>
                  <div className="text-sm text-gray-500">Merchant · {merchantUnsyncedCount} unsynced transactions</div>
                </div>
              </label>
            </div>
            
            {/* MCC condition */}
            <div className="mb-2">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value="mcc"
                  checked={selectedCondition === 'mcc'}
                  onChange={() => setSelectedCondition('mcc')}
                  className="h-5 w-5 text-green-500 border border-gray-300 mr-2 focus:outline-none focus:ring-0 hover:bg-gray-50"
                />
                <div className="flex-1">
                  <div className="font-medium">{mccCategory}</div>
                  <div className="text-sm text-gray-500">Category · {mccUnsyncedCount} unsynced transactions</div>
                </div>
              </label>
            </div>
            
            {/* Card Name condition */}
            <div className="mb-2">
              <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value="card"
                  checked={selectedCondition === 'card'}
                  onChange={() => setSelectedCondition('card')}
                  className="h-5 w-5 text-green-500 border border-gray-300 mr-2 focus:outline-none focus:ring-0 hover:bg-gray-50"
                />
                <div className="flex-1">
                  <div className="font-medium">{cardName}</div>
                  <div className="text-sm text-gray-500">Card · {cardNameUnsyncedCount} unsynced transactions</div>
                </div>
              </label>
            </div>
            
            {/* Show more options button (if not expanded) */}
            {!showMoreOptions && (
              <button
                type="button"
                onClick={() => setShowMoreOptions(true)}
                className="text-sm text-gray-500 hover:text-gray-700 mt-1 underline"
              >
                Show more options
              </button>
            )}
            
            {/* Additional options when expanded */}
            {showMoreOptions && (
              <div className="mt-3 space-y-2 transition-all duration-300 ease-in-out">
                {/* Department section */}
                <div className="mb-2">
                  <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value="department"
                      checked={selectedCondition === 'department'}
                      onChange={() => setSelectedCondition('department')}
                      className="h-5 w-5 text-green-500 border border-gray-300 mr-2 focus:outline-none focus:ring-0 hover:bg-gray-50"
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {transaction?.department || "Engineering"}
                      </div>
                      <div className="text-sm text-gray-500">Department · 12 unsynced transactions</div>
                    </div>
                  </label>
                </div>
                
                {/* Location section */}
                <div className="mb-2">
                  <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value="location"
                      checked={selectedCondition === 'location'}
                      onChange={() => setSelectedCondition('location')}
                      className="h-5 w-5 text-green-500 border border-gray-300 mr-2 focus:outline-none focus:ring-0 hover:bg-gray-50"
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {transaction?.location || "Mumbai"}
                      </div>
                      <div className="text-sm text-gray-500">Location · 8 unsynced transactions</div>
                    </div>
                  </label>
                </div>
                
                {/* Show fewer options button (only when expanded) */}
                <button
                  type="button"
                  onClick={() => setShowMoreOptions(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 mt-1 underline"
                >
                  Show fewer options
                </button>
              </div>
            )}
          </div>
          
          {/* Category selection section */}
          <div className="mb-5">
            <p className="text-base text-gray-600 mb-3">Then set {connectedProvider} Category to:</p>
            
            {/* Use SearchableDropdown with the default selected category */}
            <div className="border rounded-md">
              <SearchableDropdown
                value={category}
                onChange={(value) => setCategory(value)}
                options={CHART_OF_ACCOUNTS}
                placeholder={`Select ${connectedProvider} Category`}
                searchPlaceholder={`Search ${connectedProvider} categories...`}
                displayKey="name"
                valueKey="id"
                className="w-full"
                supportsVisibility={true}
                showHiddenOptions={showHiddenAccounts}
                onToggleShowHidden={() => setShowHiddenAccounts(prev => !prev)}
                showHiddenToggle={true}
              />
            </div>
            
            {/* Display category validation error */}
            {errors.category && (
              <div className="mt-1 text-sm text-red-500">
                {errors.category}
              </div>
            )}
            
            {/* Advanced rule link */}
            <div className="mt-3 text-sm text-gray-600">
              Need more control? <a href="#" className="text-blue-600 hover:underline">Create an advanced rule</a>
            </div>
          </div>
        </div>
        
        {/* Button section - fixed at bottom */}
        <div className="flex justify-between p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-700 hover:underline"
          >
            Never mind
          </button>
          <button
            onClick={handleSave}
            disabled={!category}
            className={`px-5 py-2 rounded-md text-white ${
              category 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            {isEditMode ? 'Update rule' : 'Create rule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewRuleModal;