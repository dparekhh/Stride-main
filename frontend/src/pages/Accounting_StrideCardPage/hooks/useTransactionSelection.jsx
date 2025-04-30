import React, { useState, useEffect } from 'react';

/**
 * Custom hook for managing transaction selection
 * 
 * This hook centralizes state and logic related to selecting transactions
 * through checkboxes for batch operations.
 */
const useTransactionSelection = ({ transactions }) => {
  // Checkbox column state (left side)
  const [checkedRows, setCheckedRows] = useState({});
  
  // Action column checkbox state (right side)
  const [actionCheckedRows, setActionCheckedRows] = useState({});
  
  // Flag to determine if any transactions are checked in the main checkbox column
  const [hasCheckedTransactions, setHasCheckedTransactions] = useState(false);
  
  // Handle checkbox change for the main checkbox column
  const handleTransactionCheckboxChange = (transactionId) => {
    setCheckedRows(prev => {
      const updated = { ...prev };
      // Toggle the selection
      if (updated[transactionId]) {
        delete updated[transactionId];
      } else {
        updated[transactionId] = true;
      }
      return updated;
    });
  };
  
  // Handle checkbox change for the action column
  const handleActionCheckboxChange = (transactionId) => {
    // Only allow checking if category is selected
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (!transaction || !transaction.accountingCategory) {
      return; // Do nothing if no category selected
    }
    
    setActionCheckedRows(prev => {
      const updated = { ...prev };
      // Toggle the selection
      if (updated[transactionId]) {
        delete updated[transactionId];
      } else {
        updated[transactionId] = true;
      }
      
      // If any checkboxes are selected, enable the Export All button
      setTimeout(() => {
        setHasCheckedTransactions(Object.keys(updated).length > 0);
      }, 0);
      
      return updated;
    });
  };
  
  // Handle select all transactions
  const handleSelectAll = () => {
    const allChecked = {};
    transactions.forEach(tx => {
      allChecked[tx.id] = true;
    });
    setCheckedRows(allChecked);
  };
  
  // Handle deselect all transactions
  const handleDeselectAll = () => {
    setCheckedRows({});
  };
  
  // Check if any transactions are selected and update the state
  useEffect(() => {
    setHasCheckedTransactions(Object.keys(checkedRows).length > 0);
  }, [checkedRows]);

  return {
    checkedRows,
    setCheckedRows,
    actionCheckedRows,
    setActionCheckedRows,
    hasCheckedTransactions,
    handleTransactionCheckboxChange,
    handleActionCheckboxChange,
    handleSelectAll,
    handleDeselectAll
  };
};

export default useTransactionSelection;