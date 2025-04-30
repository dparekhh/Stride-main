import React, { useState, useId } from 'react';
import { ArrowLeft, X, ChevronDown } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import { toast } from 'react-toastify';

/**
 * StrideCategoryExpenseCodes Component
 * 
 * This component is a drawer that displays mapping between Stride category and Expense Codes
 * according to the design in image_1744022485616.png.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Function} props.onSave - Function to call when rules are saved
 */
const StrideCategoryExpenseCodes = ({ isOpen, onClose, onBack, onSave }) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `stride-category-expense-codes-drawer-${generatedId}`;
  
  // State for tracking expense code selections
  const [selectedExpenseCodes, setSelectedExpenseCodes] = useState({});
  
  // State to track if any selections have been made (for Save button)
  const [hasSelections, setHasSelections] = useState(false);
  
  // MCC Categories for the left side of the table
  const mccCategories = [
    'Furnishings/Appliances/Maintenance/Home',
    'Airlines, Air Carriers',
    'Car Rental Agencies',
    'Lodging - Hotels, Motels, Resorts',
    'Travel/Transportation',
    'Gas and Fuel Services',
    'Business/Professional',
    'Miscellaneous Services',
    'Electronic and Technical Service',
    'Healthcare Childcare Services',
    'Clothing/Shoes/Accessories/Uniforms/Retail Stores/Buying and Selling Services',
    'Grocery Stores/Pharmacies/Food Services/Restaurants',
    'Automotive Services',
    'Educational Services',
    'Financial Service',
    'Personal Services',
    'Entertainment/Theater/Dance Studios',
    'Associations/Organizations',
    'Recent Update',
    'General Merchant Category Codes',
    'Transportation Services',
    'Retail Outlet Services',
    'Misc Stores',
    'Business Services',
    'Professional Services',
    'Govt Services',
    'Travel and Entertainment',
    'Lodging'
  ];
  
  // Dummy expense code options
  const expenseCodeOptions = [
    { id: 1, name: 'Office Supplies' },
    { id: 2, name: 'Travel' },
    { id: 3, name: 'Meals & Entertainment' },
    { id: 4, name: 'Software' },
    { id: 5, name: 'Hardware' },
    { id: 6, name: 'Professional Services' },
    { id: 7, name: 'Marketing' },
    { id: 8, name: 'Utilities' }
  ];
  
  // Get count of active mappings
  const getActiveMappingsCount = () => {
    return Object.keys(selectedExpenseCodes).length;
  };
  
  // Handle expense code selection for a category
  const handleExpenseCodeSelection = (category, expenseCode) => {
    const newSelections = {
      ...selectedExpenseCodes,
      [category]: expenseCode
    };
    
    setSelectedExpenseCodes(newSelections);
    
    // Check if any selections have been made
    setHasSelections(Object.keys(newSelections).length > 0);
  };
  
  // Handle save action
  const handleSave = () => {
    // Count the number of mappings
    const mappingsCount = getActiveMappingsCount();
    
    // Show success notification
    toast.success("Rule updates applied", {
      position: "top-right",
      autoClose: 3000
    });
    
    // Call the onSave callback function if provided
    if (onSave) {
      onSave({
        type: 'category',
        mappingsCount,
        mappings: selectedExpenseCodes
      });
    }
    
    // Close the drawer after saving
    onBack();
  };
  
  // Handle cancel action
  const handleCancel = () => {
    // Just close the drawer without saving
    onBack();
  };
  
  // Component for the dropdown selection
  const ExpenseCodeDropdown = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSelection = !!selectedExpenseCodes[category];
    
    return (
      <div className="relative">
        <button
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={hasSelection ? 'text-gray-800' : 'text-gray-500'}>
            {selectedExpenseCodes[category] ? selectedExpenseCodes[category] : 'Choose one'}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {expenseCodeOptions.map((option) => (
              <div
                key={option.id}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  selectedExpenseCodes[category] === option.name ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  handleExpenseCodeSelection(category, option.name);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title="Stride category → Expense Codes"
      showBackButton={true}
      headerPrefix="Back"
      contentPadding="p-0" // Remove default padding to customize sections
      zIndex={Z_INDEX_LEVELS.LEVEL_2}
      width="md:w-1/2"
      id={drawerId}
    >
      <div className="p-6 pb-24"> {/* Add padding at bottom for the fixed footer */}
        {/* Table header */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="font-medium text-gray-500">Stride category</div>
          <div className="font-medium text-gray-500">Expense Codes</div>
        </div>
        
        {/* Category rows */}
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {mccCategories.map((category, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-2 gap-4 items-center p-2 rounded-md ${
                selectedExpenseCodes[category] ? 'bg-green-50' : ''
              }`}
            >
              <div className={`text-gray-700 ${selectedExpenseCodes[category] ? 'font-medium' : ''}`}>
                {category}
              </div>
              <ExpenseCodeDropdown category={category} />
            </div>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white flex justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasSelections}
            className={`px-4 py-2 rounded-md ${
              hasSelections
                ? 'bg-[#FF6B00] text-white hover:bg-[#e06000]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save rule(s)
          </button>
        </div>
      </div>
    </AppDrawer>
  );
};

export default StrideCategoryExpenseCodes;