import React, { useState, useEffect, useRef } from 'react';
import { filterUtils } from '../utils/filterUtils';

/**
 * Custom hook for managing transaction filters
 * 
 * This hook centralizes state and logic related to searching, filtering,
 * date ranges, and column management.
 */
const useTransactionFilters = ({ transactions, setTransactionFilter }) => {
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  
  // Calendar state
  const [dateRange, setDateRange] = useState("Current month");
  
  // Active subtab state
  const [activeSubtab, setActiveSubtab] = useState('overview');
  
  // Column management state
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [columns, setColumns] = useState([
    { id: 'merchant', name: 'Merchant', label: 'Merchant', Header: 'Merchant', accessor: 'merchant', visible: true, order: 1 },
    { id: 'amount', name: 'Amount', label: 'Amount', Header: 'Amount', accessor: 'amount', visible: true, order: 2 },
    { id: 'cardholder', name: 'Cardholder', label: 'Cardholder', Header: 'Cardholder', accessor: 'cardholder', visible: true, order: 3 },
    { id: 'cardName', name: 'Card Name', label: 'Card Name', Header: 'Card Name', accessor: 'cardName', visible: true, order: 4 },
    { id: 'transactionDate', name: 'Transaction Date', label: 'Transaction Date', Header: 'Transaction Date', accessor: 'transactionDate', visible: true, order: 5 },
    { id: 'accountingCategory', name: 'Accounting Category', label: 'Accounting Category', Header: 'Accounting Category', accessor: 'accountingCategory', visible: true, order: 6 },
    { id: 'spentFrom', name: 'Spent From', label: 'Spent From', Header: 'Spent From', accessor: 'spentFrom', visible: true, order: 7 },
    { id: 'department', name: 'Department', label: 'Department', Header: 'Department', accessor: 'department', visible: true, order: 8 },
    { id: 'location', name: 'Location', label: 'Location', Header: 'Location', accessor: 'location', visible: true, order: 9 },
    { id: 'approvalStatus', name: 'Approval Status', label: 'Approval Status', Header: 'Approval Status', accessor: 'approvalStatus', visible: true, order: 10 },
    { id: 'policyCompliance', name: 'Policy Compliance', label: 'Policy Compliance', Header: 'Policy Compliance', accessor: 'policyCompliance', visible: true, order: 11 },
    { id: 'notes', name: 'Notes', label: 'Notes', Header: 'Notes', accessor: 'notes', visible: true, order: 12 },
    { id: 'receiptStatus', name: 'Receipt', label: 'Receipt', Header: 'Receipt', accessor: 'receiptStatus', visible: true, order: 13 },
    { id: 'clearedDate', name: 'Cleared Date', label: 'Cleared Date', Header: 'Cleared Date', accessor: 'clearedDate', visible: true, order: 14 },
    { id: 'transactionId', name: 'Transaction ID', label: 'Transaction ID', Header: 'Transaction ID', accessor: 'transactionId', visible: true, order: 15 },
    { id: 'cardLimit', name: 'Limit', label: 'Limit', Header: 'Limit', accessor: 'cardLimit', visible: true, order: 16 }
  ]);
  
  // Column management refs
  const columnsRef = useRef(null);
  const columnsButtonRef = useRef(null);
  
  // Dragging state for column reordering
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  // Function to handle search input
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    
    // Update transaction filtering through context
    if (setTransactionFilter) {
      setTransactionFilter('searchTerm', newSearchTerm);
    }
  };
  
  // Function to handle date range changes
  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange.label);
    
    // Update transaction filtering through context
    if (setTransactionFilter) {
      setTransactionFilter('dateRange', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    }
  };
  
  // Function to toggle column visibility
  const toggleColumnVisibility = (columnId) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };
  
  // Function for PageLayout column visibility change
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    toggleColumnVisibility(columnId);
  };
  
  // Function to filter transactions based on the active subtab and other filters
  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    // Apply search filter if search term exists
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tx => 
          tx.merchant.toLowerCase().includes(term) ||
          tx.cardholder.toLowerCase().includes(term) ||
          (tx.cardName && tx.cardName.toLowerCase().includes(term)) ||
          tx.transactionId.toLowerCase().includes(term) ||
          tx.accountingCategory.toLowerCase().includes(term) ||
          (tx.department && tx.department.toLowerCase().includes(term)) ||
          (tx.location && tx.location.toLowerCase().includes(term))
      );
    }
    
    // Apply date filtering for transaction dates
    if (dateRange !== "Current month") {
      filtered = filterUtils.filterTransactionsByDate(filtered, dateRange);
    }
    
    // Apply tab filtering
    switch (activeSubtab) {
      case 'needs-review':
        return filtered.filter(tx => tx.actionStatus === "Needs review");
      case 'ready-to-sync':
        return filtered.filter(tx => tx.actionStatus === "Ready to sync");
      case 'waiting-for-cardholder':
        return filtered.filter(tx => tx.actionStatus === "Waiting for cardholder");
      case 'overview':
      default:
        return filtered;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    activeSubtab,
    setActiveSubtab,
    columns,
    setColumns,
    showColumnsDropdown,
    setShowColumnsDropdown,
    handleSearchChange,
    handleDateRangeChange,
    toggleColumnVisibility,
    handleColumnVisibilityChange,
    getFilteredTransactions
  };
};

export default useTransactionFilters;