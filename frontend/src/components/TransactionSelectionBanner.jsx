import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AccountingStrideCard_3dotsButton from './AccountingStrideCard_3dotsButton';

/**
 * TransactionSelectionBanner Component
 * 
 * Displays a fixed banner at the bottom of the main content area when multiple transactions are selected.
 * Shows the count of selected transactions and action buttons.
 * 
 * Key enhancements:
 * - Now appears only in Overview and Needs Review subtabs
 * - Light orange background instead of black
 * - Restricted to main content area, not full viewport width
 * - Smooth transitions for showing/hiding
 * - Added three dots menu with additional edit options
 * 
 * @param {Object} props
 * @param {number} props.selectedCount - Number of selected transactions
 * @param {Array} props.selectedTransactions - Array of selected transaction objects
 * @param {Function} props.onViewDetails - Handler for view details click
 * @param {Function} props.onEditCategories - Handler for edit categories click
 * @param {Function} props.onMarkReady - Handler for mark ready click
 * @param {Function} props.onEditAccountingDate - Handler for edit accounting date click
 * @param {Function} props.onEditAccountingDepartment - Handler for edit accounting department click
 * @param {Function} props.onEditAccountingVendor - Handler for edit accounting vendor click
 * @param {string} props.providerName - Connected accounting provider name
 * @param {string} props.activeSubtab - Current active subtab
 */
const TransactionSelectionBanner = ({
  selectedCount,
  selectedTransactions,
  onViewDetails,
  onEditCategories,
  onMarkReady,
  onEditAccountingDate,
  onEditAccountingDepartment,
  onEditAccountingVendor,
  providerName,
  activeSubtab
}) => {
  // Only show banner when:
  // 1. More than one transaction is selected
  // 2. Active subtab is either 'overview' or 'needs-review'
  const shouldShow = selectedCount > 0 && (activeSubtab === 'overview' || activeSubtab === 'needs-review');
  
  if (!shouldShow) return null;
  
  // Check if all selected transactions have categories assigned
  const allHaveCategories = selectedTransactions.every(
    transaction => transaction && transaction.accountingCategory && transaction.accountingCategory.trim() !== ''
  );



  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-orange-50 border border-orange-200 px-6 py-3 flex justify-between items-center z-40 rounded-md shadow-md"
      style={{
        width: 'calc(100% - 300px)', 
        maxWidth: '800px',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
      }}
    >
      {/* Left section - Transaction count */}
      <div className="text-gray-800">
        <span className="font-medium">{selectedCount} {selectedCount === 1 ? 'transaction' : 'transactions'} selected</span>
      </div>

      {/* Right section - Action buttons */}
      <div className="flex space-x-3 items-center">
        {/* Three dots menu button */}
        <AccountingStrideCard_3dotsButton
          menuItems={[
            {
              label: "Edit Accounting Date",
              onClick: onEditAccountingDate
            },
            {
              label: "Edit Accounting Department",
              onClick: onEditAccountingDepartment
            },
            {
              label: "Edit Accounting Vendor",
              onClick: onEditAccountingVendor
            }
          ]}
          position="top"
        />
        
        {/* View details button */}
        <button
          onClick={onViewDetails}
          className="px-3 py-1.5 bg-white text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
        >
          View details
        </button>
        
        {/* Edit category button */}
        <button
          onClick={onEditCategories}
          className="px-3 py-1.5 bg-white text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
        >
          Edit Category
        </button>
        
        {/* Mark ready button - disabled if any transaction is missing a category */}
        <button
          onClick={onMarkReady}
          disabled={!allHaveCategories}
          className={`px-3 py-1.5 rounded-md transition-colors duration-150 text-sm font-medium ${
            allHaveCategories
              ? 'bg-primary text-white hover:bg-primary-dark' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label={
            allHaveCategories 
              ? "Mark selected transactions as ready" 
              : "Cannot mark as ready: some transactions are missing categories"
          }
        >
          Mark ready
        </button>
      </div>
    </div>
  );
};

TransactionSelectionBanner.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  selectedTransactions: PropTypes.array.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onEditCategories: PropTypes.func.isRequired,
  onMarkReady: PropTypes.func.isRequired,
  onEditAccountingDate: PropTypes.func,
  onEditAccountingDepartment: PropTypes.func,
  onEditAccountingVendor: PropTypes.func,
  providerName: PropTypes.string.isRequired,
  activeSubtab: PropTypes.string.isRequired
};

export default TransactionSelectionBanner;