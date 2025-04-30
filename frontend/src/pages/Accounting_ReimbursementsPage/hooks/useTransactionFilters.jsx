import React, { useState, useEffect, useRef } from 'react';
import { filterTransactionsByType, searchTransactions } from '../../../utils/ExpenseReimbursementsData';

/**
 * Custom hook for managing reimbursement transaction filters
 * 
 * This hook centralizes state and logic related to searching, filtering,
 * date ranges, and column management for reimbursements.
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
    { id: 'employeeName', name: 'Employee Name', label: 'Employee Name', Header: 'Employee Name', accessor: 'employeeName', visible: true, order: 3 },
    { id: 'expenseCode', name: 'Expense Code', label: 'Expense Code', Header: 'Expense Code', accessor: 'expenseCode', visible: true, order: 4 },
    { id: 'accountingCategory', name: 'Accounting Category', label: 'Accounting Category', Header: 'Accounting Category', accessor: 'accountingCategory', visible: true, order: 5 },
    { id: 'spentFrom', name: 'Spent From', label: 'Spent From', Header: 'Spent From', accessor: 'spentFrom', visible: true, order: 6 },
    { id: 'department', name: 'Department', label: 'Department', Header: 'Department', accessor: 'department', visible: true, order: 7 },
    { id: 'location', name: 'Location', label: 'Location', Header: 'Location', accessor: 'location', visible: true, order: 8 },
    { id: 'approvalStatus', name: 'Approval Status', label: 'Approval Status', Header: 'Approval Status', accessor: 'approvalStatus', visible: true, order: 9 },
    { id: 'policyCompliance', name: 'Policy Compliance', label: 'Policy Compliance', Header: 'Policy Compliance', accessor: 'policyCompliance', visible: true, order: 10 },
    { id: 'notes', name: 'Notes', label: 'Notes', Header: 'Notes', accessor: 'notes', visible: true, order: 11 },
    { id: 'receiptStatus', name: 'Receipt', label: 'Receipt', Header: 'Receipt', accessor: 'receiptStatus', visible: true, order: 12 },
    { id: 'transactionId', name: 'Reimbursement ID', label: 'Reimbursement ID', Header: 'Reimbursement ID', accessor: 'transactionId', visible: true, order: 13 }
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
    
    // Update transaction filtering through context if available
    if (setTransactionFilter) {
      setTransactionFilter('searchTerm', newSearchTerm);
    }
  };
  
  // Function to handle date range changes
  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange.label);
    
    // Update transaction filtering through context if available
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
      filtered = searchTransactions(filtered, searchTerm);
    }
    
    // Apply tab filtering
    switch (activeSubtab) {
      case 'needs-review':
        return filtered.filter(tx => tx.actionStatus === "Needs review");
      case 'ready-to-sync':
        return filtered.filter(tx => tx.actionStatus === "Ready to sync");
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