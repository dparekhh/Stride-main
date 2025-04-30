import { useState } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';

/**
 * Custom hook for managing modals and drawers in the Reimbursements page
 * 
 * This hook centralizes state and logic related to modal and drawer management
 * for editing transactions and managing settings.
 */
const useModalsAndDrawers = ({ checkedRows }) => {
  // State for managing drawers and modals
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isEditCategoriesModalOpen, setIsEditCategoriesModalOpen] = useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  
  // Get notification context
  const { showSuccess } = useNotification();
  
  // Settings drawer management
  const openSettingsDrawer = () => setIsSettingsDrawerOpen(true);
  const closeSettingsDrawer = () => setIsSettingsDrawerOpen(false);
  
  // Edit Accounting Category modal
  const handleEditAccountingCategory = () => {
    if (Object.keys(checkedRows).length === 0) {
      console.warn("No transactions selected for category edit");
      return;
    }
    setIsEditCategoriesModalOpen(true);
  };
  
  // Edit Department modal
  const handleEditAccountingDepartment = () => {
    if (Object.keys(checkedRows).length === 0) {
      console.warn("No transactions selected for department edit");
      return;
    }
    setIsEditDepartmentModalOpen(true);
  };
  
  // Edit Accounting Date action
  const handleEditAccountingDate = () => {
    if (Object.keys(checkedRows).length === 0) {
      console.warn("No transactions selected for date edit");
      return;
    }
    showSuccess("Date updated", "Selected transactions have been updated with the new accounting date.");
  };
  
  // Edit Accounting Vendor action
  const handleEditAccountingVendor = () => {
    if (Object.keys(checkedRows).length === 0) {
      console.warn("No transactions selected for vendor edit");
      return;
    }
    showSuccess("Vendor updated", "Selected transactions have been updated with the new accounting vendor.");
  };
  
  // Handle selection of a category
  const handleSelectCategory = (categoryId) => {
    console.log(`Selected category: ${categoryId} for ${Object.keys(checkedRows).length} transactions`);
    setIsEditCategoriesModalOpen(false);
    showSuccess("Category updated", "Selected transactions have been updated with the new accounting category.");
  };
  
  // Handle selection of a department
  const handleSelectDepartment = (departmentId) => {
    console.log(`Selected department: ${departmentId} for ${Object.keys(checkedRows).length} transactions`);
    setIsEditDepartmentModalOpen(false);
    showSuccess("Department updated", "Selected transactions have been updated with the new department.");
  };

  return {
    isSettingsDrawerOpen,
    isEditCategoriesModalOpen,
    isEditDepartmentModalOpen,
    openSettingsDrawer,
    closeSettingsDrawer,
    handleEditAccountingCategory,
    handleEditAccountingDepartment,
    handleEditAccountingDate,
    handleEditAccountingVendor,
    handleSelectCategory,
    handleSelectDepartment,
    setIsEditCategoriesModalOpen,
    setIsEditDepartmentModalOpen
  };
};

export default useModalsAndDrawers;