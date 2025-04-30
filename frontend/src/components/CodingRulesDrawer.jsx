import React, { useState, useId } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import StrideCategoryExpenseCodes from './StrideCategoryExpenseCodes';
import StrideMerchantExpenseCodes from './StrideMerchantExpenseCodes';
import CodingRules_RulesTab from './CodingRules_RulesTab';
import CodingRules_AdvancedRulesTab from './CodingRules_AdvancedRulesTab';

/**
 * CodingRulesDrawer Component
 * 
 * This component is a drawer that displays coding rules settings
 * according to the design in image_1744020457902.png.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 */
const CodingRulesDrawer = ({ isOpen, onClose, onBack }) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `coding-rules-drawer-${generatedId}`;
  
  // State for active subtab (Rules or Advanced rules)
  const [activeSubtab, setActiveSubtab] = useState('Rules');
  
  // State for managing drawers
  const [isStrideCategoryExpenseCodesOpen, setIsStrideCategoryExpenseCodesOpen] = useState(false);
  const [isStrideMerchantExpenseCodesOpen, setIsStrideMerchantExpenseCodesOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  
  // Mock data for rules (Replace with actual data in production)
  const [rules, setRules] = useState([
    { 
      id: 1, 
      type: 'category', 
      name: 'Stride category → Expense Codes', 
      noActiveMapping: true,
      mappingsCount: 0 
    },
    { 
      id: 2, 
      type: 'merchant', 
      name: 'Stride merchant → Expense Codes', 
      noActiveMapping: true,
      mappingsCount: 0 
    }
  ]);
  
  // State is kept minimal since most logic is in the tab components
  
  // Handle edit rule button click
  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    if (rule.type === 'category') {
      setIsStrideCategoryExpenseCodesOpen(true);
    } else if (rule.type === 'merchant') {
      setIsStrideMerchantExpenseCodesOpen(true);
    }
  };
  
  // Handle closing the StrideCategoryExpenseCodes drawer
  const handleCloseStrideCategoryExpenseCodes = () => {
    setIsStrideCategoryExpenseCodesOpen(false);
    setSelectedRule(null);
  };
  
  // Handle closing the StrideMerchantExpenseCodes drawer
  const handleCloseStrideMerchantExpenseCodes = () => {
    setIsStrideMerchantExpenseCodesOpen(false);
    setSelectedRule(null);
  };
  
  // Handle saving rule mappings
  const handleSaveRule = (data) => {
    // Update the rules state with the new mapping count
    const updatedRules = rules.map(rule => {
      if (rule.id === selectedRule.id) {
        return {
          ...rule,
          noActiveMapping: data.mappingsCount === 0,
          mappingsCount: data.mappingsCount
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
  };
  
  return (
    <>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        onBack={onBack}
        title="Coding rules"
        showBackButton={true}
        headerPrefix="Back"
        contentPadding="p-0" // Remove default padding to customize sections
        zIndex={Z_INDEX_LEVELS.LEVEL_1}
        width="md:w-1/2"
        id={drawerId}
      >
        {/* Subtabs */}
        <div>
          <div className="flex px-6">
            {['Rules', 'Advanced rules'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-4 font-medium text-sm relative ${
                  activeSubtab === tab 
                    ? 'text-[#FF6B00]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSubtab(tab)}
              >
                {tab}
                {activeSubtab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B00]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content for Rules subtab */}
        {activeSubtab === 'Rules' && (
          <CodingRules_RulesTab 
            rules={rules} 
            onEditRule={handleEditRule} 
          />
        )}
        
        {/* Content for Advanced rules subtab */}
        {activeSubtab === 'Advanced rules' && (
          <CodingRules_AdvancedRulesTab />
        )}
      </AppDrawer>
      
      {/* StrideCategoryExpenseCodes Drawer */}
      {isStrideCategoryExpenseCodesOpen && selectedRule && (
        <StrideCategoryExpenseCodes
          isOpen={isStrideCategoryExpenseCodesOpen}
          onClose={onClose}
          onBack={handleCloseStrideCategoryExpenseCodes}
          onSave={handleSaveRule}
        />
      )}
      
      {/* StrideMerchantExpenseCodes Drawer */}
      {isStrideMerchantExpenseCodesOpen && selectedRule && (
        <StrideMerchantExpenseCodes
          isOpen={isStrideMerchantExpenseCodesOpen}
          onClose={onClose}
          onBack={handleCloseStrideMerchantExpenseCodes}
          onSave={handleSaveRule}
        />
      )}
    </>
  );
};

export default CodingRulesDrawer;