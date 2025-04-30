import React, { useRef, useState } from 'react';
import { MoreVertical, Settings, Download, Receipt, AlertCircle, Check } from 'lucide-react';
import { useAccounting } from '../../contexts/AccountingContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PageLayout } from '../../components/common/page-layout';

// Import components
import ReimbursementsTable from './components/ReimbursementsTable';

// Import hooks
import useTransactionData from './hooks/useTransactionData';
import useTransactionFilters from './hooks/useTransactionFilters';
import useTransactionSelection from './hooks/useTransactionSelection';
import useModalsAndDrawers from './hooks/useModalsAndDrawers';

// Import modals and drawers
import AccountingSettings from '../../components/AccountingSettings';
import TransactionSelectionBanner from '../../components/TransactionSelectionBanner';
import TransactionSelectionBanner_EditCategory from '../../components/TransactionSelectionBanner_EditCategory';
import TransactionSelectionBanner_EditDepartment from '../../components/TransactionSelectionBanner_EditDepartment';

/**
 * Accounting_ReimbursementsPage Component
 * 
 * This component displays employee reimbursements synced with accounting software.
 * It includes:
 * - Reimbursements table with selectable rows for syncing
 * - Action buttons for syncing reimbursements
 * - Settings management for the accounting integration
 * 
 * It leverages the PageLayout component for standardized UI elements
 * including search bar, column management, and filters.
 */
const Accounting_ReimbursementsPage = () => {
  // Access accounting and notification contexts
  const { 
    chartOfAccounts,
    toggleAccountVisibility,
    setTransactionFilter
  } = useAccounting();
  
  const { showNotification, showSuccess } = useNotification();
  
  // Use custom hooks for transaction management
  const {
    transactions,
    loading,
    connectedProvider,
    isCustomProvider,
    departments
  } = useTransactionData();
  
  const {
    searchTerm,
    setSearchTerm,
    dateRange,
    activeSubtab,
    setActiveSubtab,
    columns,
    handleSearchChange,
    handleDateRangeChange,
    handleColumnVisibilityChange,
    getFilteredTransactions
  } = useTransactionFilters({ transactions, setTransactionFilter });
  
  const {
    checkedRows,
    actionCheckedRows,
    hasCheckedTransactions,
    handleTransactionCheckboxChange,
    handleActionCheckboxChange
  } = useTransactionSelection({ transactions });
  
  // Use hook for modals and drawers management
  const {
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
  } = useModalsAndDrawers({ checkedRows });

  // State for dropdown menus
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  // Refs for dropdown positioning
  const threeDotsMenuRef = useRef(null);
  const exportDropdownRef = useRef(null);

  // Handle three dots menu options
  const handleThreeDotsMenuOption = (option) => {
    setShowThreeDotsMenu(false);
    
    if (option === 'edit_category') {
      handleEditAccountingCategory();
    } else if (option === 'edit_department') {
      handleEditAccountingDepartment();
    } else if (option === 'edit_date') {
      handleEditAccountingDate();
    } else if (option === 'edit_vendor') {
      handleEditAccountingVendor();
    }
  };

  // Handle export actions
  const handleExport = (format) => {
    setShowExportDropdown(false);
    
    let message;
    
    switch (format) {
      case 'csv':
        message = 'Reimbursements exported as CSV';
        break;
      case 'excel':
        message = 'Reimbursements exported as Excel';
        break;
      case 'pdf':
        message = 'Reimbursements exported as PDF';
        break;
      default:
        message = 'Reimbursements exported';
    }
    
    showSuccess(message);
  };

  // Define the formatted subtabs with icons and counts using the standardized format
  const formattedSubtabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Receipt,
      count: transactions.length 
    },
    { 
      id: 'needs-review', 
      label: 'Needs Review', 
      icon: AlertCircle,
      count: transactions.filter(tx => tx.actionStatus === "Needs review").length 
    },
    { 
      id: 'ready-to-sync', 
      label: 'Ready to Sync', 
      icon: Check,
      count: transactions.filter(tx => tx.actionStatus === "Ready to sync").length 
    }
  ];

  // Create action buttons for the header
  const actionButtons = [
    // Three dots menu button (leftmost)
    <div className="relative" ref={threeDotsMenuRef} key="three-dots-menu">
      <button 
        className="p-2 rounded-md hover:bg-gray-100 three-dots-button"
        onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>
      {showThreeDotsMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
          <div className="p-3">
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("edit_category")}
            >
              <span>Edit Accounting Category</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("edit_department")}
            >
              <span>Edit Accounting Department</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("edit_date")}
            >
              <span>Edit Accounting Date</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("edit_vendor")}
            >
              <span>Edit Accounting Vendor</span>
            </div>
          </div>
        </div>
      )}
    </div>,

    // Settings button (middle)
    <button
      key="settings-button"
      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center"
      onClick={openSettingsDrawer}
    >
      Settings
    </button>,

    // Export dropdown (rightmost)
    <div className="relative" ref={exportDropdownRef} key="export-button">
      <button
        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md ${
          Object.keys(actionCheckedRows).length > 0
            ? 'text-white bg-orange-500 hover:bg-orange-600'
            : 'text-gray-700 bg-white hover:bg-gray-50'
        }`}
        onClick={() => setShowExportDropdown(!showExportDropdown)}
      >
        Export
      </button>
      {showExportDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleExport('csv')}
            >
              Export as CSV
            </button>
            <button
              className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleExport('excel')}
            >
              Export as Excel
            </button>
            <button
              className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              onClick={() => handleExport('pdf')}
            >
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  ];

  // Create defaultVisibleColumns based on currently visible columns
  const defaultVisibleColumns = columns
    .filter(col => col.visible)
    .map(col => col.id);

  return (
    <PageLayout
      pageTitle="Accounting"
      heading="Reimbursements"
      actions={actionButtons}
      subtabs={formattedSubtabs}
      activeSubtab={activeSubtab}
      onSubtabChange={setActiveSubtab}
      showSearchBar={true}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      columns={columns}
      defaultVisibleColumns={defaultVisibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      onDateRangeChange={handleDateRangeChange}
      initialDateRange={dateRange}
    >
      <ReimbursementsTable 
        transactions={getFilteredTransactions()}
        loading={loading}
        columns={columns.filter(col => col.visible).sort((a, b) => a.order - b.order)}
        checkedRows={checkedRows}
        actionCheckedRows={actionCheckedRows}
        onTransactionCheckboxChange={handleTransactionCheckboxChange}
        onActionCheckboxChange={handleActionCheckboxChange}
        connectedProvider={connectedProvider}
        chartOfAccounts={chartOfAccounts}
      />

      {/* Settings drawer */}
      {isSettingsDrawerOpen && (
        <AccountingSettings
          isOpen={isSettingsDrawerOpen}
          onClose={closeSettingsDrawer}
          connectedProvider={connectedProvider}
          isCustomProvider={isCustomProvider}
        />
      )}
      
      {/* Transaction Edit Category Modal */}
      {isEditCategoriesModalOpen && (
        <TransactionSelectionBanner_EditCategory
          selectedCount={Object.keys(checkedRows).length}
          chartOfAccounts={chartOfAccounts}
          onSelectCategory={handleSelectCategory}
          onClose={() => setIsEditCategoriesModalOpen(false)}
        />
      )}
      
      {/* Transaction Edit Department Modal */}
      {isEditDepartmentModalOpen && (
        <TransactionSelectionBanner_EditDepartment
          selectedCount={Object.keys(checkedRows).length}
          departments={departments}
          onSelectDepartment={handleSelectDepartment}
          onClose={() => setIsEditDepartmentModalOpen(false)}
        />
      )}

      {/* Transaction Selection Banner */}
      <TransactionSelectionBanner
        selectedCount={Object.keys(checkedRows).length}
        selectedTransactions={transactions.filter(tx => checkedRows[tx.id])}
        onViewDetails={() => showNotification('View Details', 'Viewing details for selected reimbursements')}
        onEditCategories={handleEditAccountingCategory}
        onMarkReady={() => {
          const message = 'Reimbursements marked as ready';
          const description = 'Selected reimbursements have been marked as ready for sync.';
          showSuccess(message, description);
        }}
        onEditAccountingDate={handleEditAccountingDate}
        onEditAccountingDepartment={handleEditAccountingDepartment}
        onEditAccountingVendor={handleEditAccountingVendor}
        providerName={connectedProvider || 'Not connected'}
        activeSubtab={activeSubtab}
      />
    </PageLayout>
  );
};

export default Accounting_ReimbursementsPage;