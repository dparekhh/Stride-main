import React, { useState, useEffect, useId } from 'react';
import { ArrowLeft, Edit2, Info } from 'lucide-react';
import CreateNewFieldDrawer from './CreateNewFieldDrawer';
import ExpenseRequirementsDrawer from './ExpenseRequirementsDrawer';
import AccountingCategoryFieldNew from './AccountingCategoryFieldNew';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';

/**
 * AccountingFieldsDrawer Component
 * 
 * This component is a drawer that displays accounting fields settings
 * according to the design in image_1743996515197.png.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 */
const AccountingFieldsDrawer = ({ isOpen, onClose, onBack }) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `accounting-fields-drawer-${generatedId}`;
  
  // State for managing child drawers
  const [isCreateFieldDrawerOpen, setIsCreateFieldDrawerOpen] = useState(false);
  const [isExpenseRequirementsDrawerOpen, setIsExpenseRequirementsDrawerOpen] = useState(false);
  const [isAccountingCategoryFieldOpen, setIsAccountingCategoryFieldOpen] = useState(false);
  
  // State for field names - default to "Category" if no saved value exists
  const [categoryFieldName, setCategoryFieldName] = useState(() => {
    // Try to get from localStorage first
    const savedName = localStorage.getItem('categoryFieldName');
    return savedName || "Category";
  });
  
  // Handler for updating the category field name
  const handleCategoryFieldNameUpdate = (newName) => {
    // Update state
    setCategoryFieldName(newName);
    
    // Persist to localStorage for persistence across sessions
    if (newName) {
      localStorage.setItem('categoryFieldName', newName);
    }
  };
  
  // Log when the component renders or the field name changes
  useEffect(() => {
    console.log('AccountingFieldsDrawer rendered with categoryFieldName:', categoryFieldName);
  }, [categoryFieldName]);
  
  return (
    <>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        onBack={onBack}
        showBackButton={true}
        headerPrefix="Back"
        title="Accounting fields"
        description="Choose which Accounting fields you'd like to show up in Stride and how they are synced"
        contentPadding="p-0" // Remove default padding to customize sections
        zIndex={Z_INDEX_LEVELS.LEVEL_1}
        width="md:w-1/2"
        id={drawerId}
      >
        {/* Accounting fields section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-4">Accounting fields that Stride is syncing to</h3>
          
          {/* Category field */}
          <div className="border border-gray-200 rounded-md mb-3">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-4 text-gray-400">≡</div>
                <div>
                  <h4 className="font-medium">{categoryFieldName}</h4>
                  <p className="text-gray-500 text-sm">Chart of accounts</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Opening category field drawer');
                  console.log('AccountingFieldsDrawer: Current state before opening:', { 
                    isAccountingCategoryFieldOpen,
                    categoryFieldName 
                  });
                  setIsAccountingCategoryFieldOpen(true);
                  // Log after state update to verify the change has been initiated
                  console.log('AccountingFieldsDrawer: Request sent to open drawer');
                }}
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Department field */}
          <div className="border border-gray-200 rounded-md mb-6">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-4 text-gray-400">≡</div>
                <div>
                  <h4 className="font-medium">Department</h4>
                  <p className="text-gray-500 text-sm"></p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Customize expense policy info */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 flex items-start">
            <Info size={18} className="text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              Want to require your employees to code these fields? Customize your expense policy{" "}
              <button 
                onClick={() => setIsExpenseRequirementsDrawerOpen(true)} 
                className="text-black font-medium underline cursor-pointer"
              >
                here
              </button>.
            </p>
          </div>
          
          {/* Add new field button */}
          <button 
            className="border border-gray-300 hover:bg-gray-50 rounded-md py-2 px-4 text-gray-600 font-medium flex items-center"
            onClick={() => setIsCreateFieldDrawerOpen(true)}
          >
            <span className="mr-1">+</span> Add new field
          </button>
        </div>
      </AppDrawer>

      {/* All drawers are standalone with same styling and layout */}
      <CreateNewFieldDrawer 
        isOpen={isCreateFieldDrawerOpen}
        onClose={() => setIsCreateFieldDrawerOpen(false)}
        onBack={() => {
          setIsCreateFieldDrawerOpen(false);
        }}
        zIndex={Z_INDEX_LEVELS.LEVEL_2} // Higher z-index for proper stacking
      />

      <ExpenseRequirementsDrawer 
        isOpen={isExpenseRequirementsDrawerOpen}
        onClose={() => setIsExpenseRequirementsDrawerOpen(false)}
        onBack={() => {
          setIsExpenseRequirementsDrawerOpen(false);
        }}
        zIndex={Z_INDEX_LEVELS.LEVEL_2} // Higher z-index for proper stacking
      />

      {/* Always render AccountingCategoryFieldNew but control visibility via isOpen prop */}
      <AccountingCategoryFieldNew
        isOpen={isAccountingCategoryFieldOpen}
        onClose={() => setIsAccountingCategoryFieldOpen(false)}
        onBack={() => {
          setIsAccountingCategoryFieldOpen(false);
        }}
        onFieldNameUpdate={handleCategoryFieldNameUpdate}
        currentFieldName={categoryFieldName}
        zIndex={Z_INDEX_LEVELS.LEVEL_2} // Higher z-index for proper stacking
        key={`category-field-${categoryFieldName}`} // Add key prop for proper re-rendering
      />
    </>
  );
};

export default AccountingFieldsDrawer;