import React, { useState } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';

/**
 * Custom hook for managing modals and drawers state
 * 
 * This hook centralizes state and logic related to modal and drawer visibility,
 * as well as providing actions for each.
 */
const useModalsAndDrawers = ({ checkedRows }) => {
  // Get notification context
  const { showSuccess } = useNotification();
  
  // Settings drawer state
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  
  // Edit Modals state
  const [isEditCategoriesModalOpen, setIsEditCategoriesModalOpen] = useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [isEditDateModalOpen, setIsEditDateModalOpen] = useState(false);
  const [isEditVendorModalOpen, setIsEditVendorModalOpen] = useState(false);
  
  // Create Rule Modal state
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleModalData, setRuleModalData] = useState({
    merchantName: '',
    merchantUnsyncedCount: 0,
    mccCategory: '',
    mccUnsyncedCount: 0,
    cardName: '',
    cardNameUnsyncedCount: 0,
    selectedCategory: '',
    transaction: null // Will hold the current transaction object
  });
  
  // Handle opening and closing the settings drawer
  const openSettingsDrawer = () => setIsSettingsDrawerOpen(true);
  const closeSettingsDrawer = () => setIsSettingsDrawerOpen(false);
  
  // Handle opening and closing the modals
  const handleEditAccountingCategory = () => {
    setIsEditCategoriesModalOpen(true);
  };
  
  const handleEditAccountingDepartment = () => {
    setIsEditDepartmentModalOpen(true);
  };
  
  const handleEditAccountingDate = () => {
    setIsEditDateModalOpen(true);
  };
  
  const handleEditAccountingVendor = () => {
    setIsEditVendorModalOpen(true);
  };
  
  // Handle category selection for the edit category modal
  const handleSelectCategory = (categoryId) => {
    // Implementation would update categories for selected transactions
    // This is a placeholder that would be connected to actual API calls
    
    // Show success message
    showSuccess('Category updated successfully');
    
    // Close the modal
    setIsEditCategoriesModalOpen(false);
  };
  
  // Handle department selection for the edit department modal
  const handleSelectDepartment = (departmentId) => {
    // Implementation would update departments for selected transactions
    // This is a placeholder that would be connected to actual API calls
    
    // Show success message
    showSuccess('Department updated successfully');
    
    // Close the modal
    setIsEditDepartmentModalOpen(false);
  };
  
  // Handle rule creation for the create rule modal
  const openCreateRuleModal = (transaction) => {
    console.log("Opening rule modal with transaction:", transaction);
    
    // Set the rule modal data from the transaction
    setRuleModalData({
      merchantName: transaction.merchant,
      merchantUnsyncedCount: 5, // Example value, would come from API
      mccCategory: transaction.mccCategory || 'N/A',
      mccUnsyncedCount: 3, // Example value, would come from API
      cardName: transaction.cardName || 'N/A',
      cardNameUnsyncedCount: 2, // Example value, would come from API
      selectedCategory: '',
      transaction
    });
    
    // Open the modal
    setIsRuleModalOpen(true);
  };
  
  const closeCreateRuleModal = () => {
    setIsRuleModalOpen(false);
  };

  return {
    // Modal and drawer state
    isSettingsDrawerOpen,
    isEditCategoriesModalOpen,
    isEditDepartmentModalOpen,
    isEditDateModalOpen,
    isEditVendorModalOpen,
    isRuleModalOpen,
    ruleModalData,
    
    // Modal and drawer actions
    openSettingsDrawer,
    closeSettingsDrawer,
    handleEditAccountingCategory,
    handleEditAccountingDepartment,
    handleEditAccountingDate,
    handleEditAccountingVendor,
    handleSelectCategory,
    handleSelectDepartment,
    openCreateRuleModal,
    closeCreateRuleModal,
    
    // Setters (in case direct access is needed)
    setIsSettingsDrawerOpen,
    setIsEditCategoriesModalOpen,
    setIsEditDepartmentModalOpen,
    setIsEditDateModalOpen,
    setIsEditVendorModalOpen,
    setIsRuleModalOpen,
    setRuleModalData
  };
};

export default useModalsAndDrawers;