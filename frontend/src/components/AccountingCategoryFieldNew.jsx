import React, { useState, useEffect, useRef, useId } from 'react';
import { Eye, EyeOff, HelpCircle, CheckCircle, Loader, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { useDrawer, Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import { useAccounting } from '../contexts/AccountingContext';
import AppDrawer from './common/AppDrawer';
import DrawerPortal from './common/DrawerPortal';
import AccountingCategoryOptionsDrawer from './AccountingCategoryOptionsDrawer';

/**
 * AccountingCategoryFieldNew Component
 * 
 * This component is a drawer that displays accounting category field settings.
 * It overlays 50% of the screen, pops from the right, and the rest of the screen
 * is blurred when the drawer is open.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Function} props.onFieldNameUpdate - Function to update parent component with new field name
 * @param {string} [props.currentFieldName] - The current field name to display and edit
 * @param {number} [props.zIndex] - The z-index level for the drawer
 */
const AccountingCategoryFieldNew = ({ isOpen, onClose, onBack, onFieldNameUpdate, currentFieldName, zIndex = Z_INDEX_LEVELS.LEVEL_2 }) => {
  // Use a ref to keep track if this is the first render
  const isFirstRender = useRef(true);
  
  // State for the field name, with proper initialization from props
  const [inputFieldName, setInputFieldName] = useState(currentFieldName || "Accounting Category");
  const [displayFieldName, setDisplayFieldName] = useState(currentFieldName || "Accounting Category");
  const [originalFieldName, setOriginalFieldName] = useState(currentFieldName || "Accounting Category");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [helperText, setHelperText] = useState("");
  const [defaultOption, setDefaultOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = useState(false);
  const [optionsDrawerTab, setOptionsDrawerTab] = useState('all');
  const dropdownRef = useRef(null);
  const fieldNameInputRef = useRef(null);
  
  // Get drawer context
  const { openDrawer, closeDrawer, shouldShowBackdrop, getZIndex } = useDrawer();
  
  // Get accounting context data for Chart of Accounts
  const { 
    chartOfAccounts, 
    isLoadingAccounts, 
    accountsError,
    getFilteredAccounts,
    toggleAccountVisibility,
    showHiddenAccounts,
    toggleShowHiddenAccounts
  } = useAccounting();
  
  // Unique drawer ID
  const DRAWER_ID = 'accounting-category-field-drawer';
  
  // Update state when currentFieldName prop changes
  useEffect(() => {
    // Only run this effect after the initial render
    if (!isFirstRender.current) {
      if (currentFieldName) {
        setOriginalFieldName(currentFieldName);
        setInputFieldName(currentFieldName);
        setDisplayFieldName(currentFieldName);
      }
    } else {
      isFirstRender.current = false;
    }
  }, [currentFieldName]);
  
  // Register/unregister drawer when opened/closed
  useEffect(() => {
    if (isOpen) {
      // Register the drawer with the context
      console.log('AccountingCategoryFieldNew: About to register drawer with props:', {
        isOpen, 
        currentFieldName,
        zIndex,
        DRAWER_ID,
        drawerProps: {onClose, onBack, onFieldNameUpdate}
      });
      openDrawer(DRAWER_ID, zIndex);
      console.log('AccountingCategoryFieldNew: Drawer registered with zIndex:', zIndex);
    }
    
    // Clean up function that runs when component unmounts or dependencies change
    return () => {
      // Only close the drawer if it was opened
      // This prevents potential issues with multiple closeDrawer calls and ensures proper drawer state management
      if (isOpen) {
        closeDrawer(DRAWER_ID);
        console.log('AccountingCategoryFieldNew: Drawer closed');
      }
    };
  }, [isOpen, openDrawer, closeDrawer, DRAWER_ID, zIndex, currentFieldName]);

  // Reset state when the drawer opens or when currentFieldName changes
  useEffect(() => {
    if (isOpen) {
      console.log('AccountingCategoryFieldNew: Resetting state with currentFieldName:', currentFieldName);
      // Make sure we're using the most current field name from props
      const nameToUse = currentFieldName || originalFieldName;
      setInputFieldName(nameToUse);
      setDisplayFieldName(nameToUse);
      setIsEditing(false);
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(false);
      setError("");
    }
  }, [isOpen, originalFieldName, currentFieldName]);
  
  // Function to handle field name change
  const handleFieldNameChange = (e) => {
    setInputFieldName(e.target.value);
    setIsEditing(true);
    setHasChanges(true);
    setError(""); // Clear any error when user starts typing
  };
  
  // Function to handle helper text change
  const handleHelperTextChange = (e) => {
    setHelperText(e.target.value);
    setHasChanges(true);
  };
  
  // Function to handle default option change (used for legacy select element)
  const handleDefaultOptionChange = (e) => {
    setDefaultOption(e.target.value);
    setHasChanges(true);
  };
  
  // Function to handle dropdown option selection
  const handleOptionSelect = (optionName, optionCode) => {
    setDefaultOption(`${optionName} (${optionCode})`);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setHasChanges(true);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Function to validate field name
  const validateFieldName = () => {
    if (!inputFieldName.trim()) {
      setError("Field name cannot be empty");
      return false;
    }
    return true;
  };
  
  // Function to handle save
  const handleSave = () => {
    if (!validateFieldName()) {
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call - in a real implementation this would be a fetch or axios call
    setTimeout(() => {
      // Update the display field name and original field name after successful save
      const newFieldName = inputFieldName.trim();
      setDisplayFieldName(newFieldName);
      setOriginalFieldName(newFieldName);
      
      // Notify parent component of the name change
      if (onFieldNameUpdate) {
        // Pass the trimmed field name to the parent
        onFieldNameUpdate(newFieldName);
      }
      
      // Reset UI state
      setIsSaving(false);
      setIsEditing(false);
      setHasChanges(false);
      setShowSuccess(true);
      
      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 1000);
  };
  
  // Handle blur event on the field name input
  const handleBlur = () => {
    if (!inputFieldName.trim()) {
      // Revert to original name if empty
      setInputFieldName(originalFieldName);
      setIsEditing(false);
      setError("");
    }
  };
  
  // Generate unique ID for this drawer instance
  const drawerId = useId();
  
  if (!isOpen) return null;
  
  return (
    <>
      <DrawerPortal>
        <AppDrawer
          isOpen={isOpen}
          onClose={onClose}
          onBack={onBack}
          id={DRAWER_ID}
          position="right"
          width="md:w-1/2"
          zIndex={zIndex}
          title={`${displayFieldName} field`}
          description="Configure how Stride should treat this Accounting field"
          usePortal={true}
          showBackButton={true}
          headerPrefix="Back"
        >
          {/* Drawer Content */}
          <div className="flex flex-col h-full bg-white">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Form content */}
              <div className="p-4 space-y-4 border-b border-gray-200">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name in Stride</label>
                  <div className="relative flex items-center">
                    <input 
                      ref={fieldNameInputRef}
                      type="text" 
                      id="name" 
                      value={inputFieldName} 
                      onChange={handleFieldNameChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-0`}
                    />
                    {isEditing && !showSuccess && (
                      <div className="absolute right-0 mr-2">
                        <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-primary text-white px-3 py-1 rounded-md font-medium flex items-center"
                        >
                          {isSaving ? (
                            <>
                              <Loader size={16} className="animate-spin mr-1" />
                              Saving
                            </>
                          ) : (
                            'Save'
                          )}
                        </button>
                      </div>
                    )}
                    {showSuccess && (
                      <div className="absolute right-0 mr-3">
                        <CheckCircle size={20} className="text-green-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                
                {/* Helper text */}
                <div>
                  <label htmlFor="helper_text" className="block text-sm text-gray-600 mb-1">Helper text</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="helper_text" 
                      value={helperText}
                      onChange={handleHelperTextChange}
                      placeholder="Helper text" 
                      className="w-full px-3 py-2 pl-3 pr-10 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <HelpCircle size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                {/* Default option */}
                <div>
                  <label htmlFor="default_option" className="block text-sm text-gray-600 mb-1">Default option</label>
                  <div className="relative">
                    <button
                      id="default_option"
                      className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:border-black focus:ring-0 flex items-center justify-between"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className={defaultOption ? 'text-gray-800' : 'text-gray-500'}>
                        {defaultOption || "Type to search"}
                      </span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div 
                        ref={dropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 flex flex-col"
                      >
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search..."
                              className="w-full px-3 py-2 border-0 bg-gray-50 rounded-md text-gray-800 focus:outline-none focus:ring-0"
                              onChange={(e) => setSearchTerm(e.target.value)}
                              value={searchTerm}
                              autoFocus
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" 
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto">
                          {isLoadingAccounts ? (
                            <div className="p-3 flex justify-center items-center">
                              <Loader size={20} className="animate-spin mr-2" />
                              <span>Loading accounts...</span>
                            </div>
                          ) : accountsError ? (
                            <div className="p-3 text-red-500 flex items-center">
                              <AlertCircle size={16} className="mr-2" />
                              <span>Error loading accounts</span>
                            </div>
                          ) : (
                            <>
                              {getFilteredAccounts(searchTerm).length > 0 ? (
                                getFilteredAccounts(searchTerm)
                                  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) // Sort alphabetically by name, case-insensitive
                                  .map((account) => (
                                    <div 
                                      key={account.id}
                                      className="py-2 px-3 bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col"
                                    >
                                      <div 
                                        className="flex justify-between items-center"
                                        onClick={() => handleOptionSelect(account.name, account.code)}
                                      >
                                        <div className="font-medium flex items-center">
                                          {account.name}
                                          {account.visible === false && (
                                            <EyeOff size={14} className="text-gray-400 ml-2" />
                                          )}
                                        </div>
                                        <button 
                                          className="ml-2 text-xs text-gray-500 hover:text-gray-700 focus:outline-none"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAccountVisibility(account.id);
                                          }}
                                        >
                                          {account.visible !== false ? <EyeOff size={14} className="text-gray-400" /> : <Eye size={14} className="text-gray-400" />}
                                        </button>
                                      </div>
                                      <div className="text-xs text-gray-500 flex justify-between">
                                        <span>ID: {account.id}</span>
                                        <span>Code: {account.code}</span>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <div className="p-3 text-gray-500">
                                  No matching accounts found
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="p-2 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-white">
                          <button 
                            className="flex items-center text-gray-600 hover:text-gray-800"
                            onClick={() => {
                              setDefaultOption("");
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear selection
                          </button>
                          
                          <div className="relative group">
                            <button
                              type="button"
                              className="flex items-center text-gray-600 hover:text-gray-800"
                              onClick={() => {
                                toggleShowHiddenAccounts();
                              }}
                              aria-label={showHiddenAccounts ? 'Hide hidden options' : 'Show hidden options'}
                            >
                              {showHiddenAccounts ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <div 
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginBottom: '8px',
                                padding: '6px 8px',
                                background: 'white',
                                border: '1px solid rgb(229 231 235)',
                                borderRadius: '6px',
                                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                zIndex: 20
                              }}
                            >
                              {showHiddenAccounts ? 'Hide hidden options' : 'Show hidden options'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Configure Accounting Category section */}
              <div className="p-4">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Configure {displayFieldName}</h3>
                
                {/* Update options section */}
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Update {displayFieldName} options</h4>
                  <p className="text-gray-500 text-sm mb-4">
                    Edit, add, remove, or hide options. We recommend hiding any options you're not planning on using in Stride and renaming options to make coding easier for cardholders.
                  </p>
                  
                  {/* Options display sections */}
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
                    {/* Accounting Category options shown */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Eye size={16} className="text-gray-500 mr-3" />
                        <div>
                          <h5 className="font-medium text-gray-800">{displayFieldName} options shown in Stride</h5>
                        </div>
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer hover:underline flex items-center"
                        onClick={() => {
                          setIsOptionsDrawerOpen(true);
                          setOptionsDrawerTab('visible');
                        }}
                      >
                        {chartOfAccounts.filter(acc => acc.visible !== false).length} options
                      </button>
                    </div>
                    
                    {/* Hidden options */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <EyeOff size={16} className="text-gray-500 mr-3" />
                        <div>
                          <h5 className="font-medium text-gray-800">Hidden options</h5>
                        </div>
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer hover:underline flex items-center"
                        onClick={() => {
                          setIsOptionsDrawerOpen(true);
                          setOptionsDrawerTab('hidden');
                        }}
                      >
                        {chartOfAccounts.filter(acc => acc.visible === false).length} options
                      </button>
                    </div>
                  </div>
                  
                  {/* Update options button */}
                  <div className="mt-4">
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                      onClick={() => setIsOptionsDrawerOpen(true)}
                    >
                      Update options
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fixed Footer with Save Button */}
            <div className="border-t border-gray-200 p-4 bg-white flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`px-4 py-2 rounded-md font-medium ${hasChanges ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {isSaving ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2 inline" />
                    Saving
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </AppDrawer>
      </DrawerPortal>
      
      {/* Options Drawer */}
      <AccountingCategoryOptionsDrawer 
        isOpen={isOptionsDrawerOpen}
        onClose={() => setIsOptionsDrawerOpen(false)}
        onBack={() => setIsOptionsDrawerOpen(false)}
        nameInStride={displayFieldName}
        zIndex={Z_INDEX_LEVELS.LEVEL_3}
        initialTab={optionsDrawerTab}
      />
    </>
  );
};

export default AccountingCategoryFieldNew;
