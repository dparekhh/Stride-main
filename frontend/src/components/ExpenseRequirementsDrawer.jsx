import React, { useId } from 'react';
import { MoreVertical, PlusCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';

/**
 * Expense Requirements Drawer component for setting required fields for card transactions and reimbursements
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {number} props.zIndex - Z-index for the drawer (default: Z_INDEX_LEVELS.BASE)
 * @returns {React.ReactElement} Expense Requirements drawer component
 */
const ExpenseRequirementsDrawer = ({ 
  isOpen, 
  onClose, 
  onBack,
  zIndex = Z_INDEX_LEVELS.BASE
}) => {
  const navigate = useNavigate();
  
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `expense-requirements-drawer-${generatedId}`;
  
  const expenseCategories = [
    {
      id: 'general',
      name: 'General Expenses',
      isDefault: true,
    }
  ];
  
  // Navigate to the submission policy builder page
  const handleNavigateToBuilder = () => {
    onClose(); // Close the drawer first
    navigate('/submission-policy-builder');
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title="Expense requirements"
      description="Set the fields required for card transactions and reimbursements"
      width="md:w-1/2"
      zIndex={zIndex}
      id={drawerId}
      showBackButton={true}
      headerPrefix="Back"
    >
      <div className="space-y-6">
        {/* Expense Categories */}
        {expenseCategories.map((category) => (
          <div 
            key={category.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.name}</span>
                  {category.isDefault && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                  onClick={handleNavigateToBuilder}
                >
                  Edit
                </button>
                
                <button 
                  className="hover:bg-gray-100 p-1 rounded"
                  onClick={handleNavigateToBuilder}
                >
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                <div className="relative">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="More options"
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Submission Policy Button */}
        <button 
          className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700"
          onClick={handleNavigateToBuilder}
        >
          <PlusCircle size={16} className="mr-1" />
          Add submission policy
        </button>
      </div>
    </AppDrawer>
  );
};

export default ExpenseRequirementsDrawer;