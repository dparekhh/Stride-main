import { useState } from 'react';

/**
 * Custom hook for managing reimbursement transaction selection
 * 
 * This hook centralizes state and logic related to checkbox selection
 * for bulk operations on transactions.
 */
const useTransactionSelection = ({ transactions }) => {
  // Checkbox selection state
  const [checkedRows, setCheckedRows] = useState({});
  const [actionCheckedRows, setActionCheckedRows] = useState({});

  // Function to handle transaction checkbox changes
  const handleTransactionCheckboxChange = (transactionId, newCheckedState = null) => {
    setCheckedRows(prevState => {
      // If newCheckedState is an object, it's a bulk update (select all or deselect all)
      if (newCheckedState !== null && typeof newCheckedState === 'object') {
        return { ...newCheckedState };
      }
      
      // Otherwise, it's a toggle for a single row
      const newState = { ...prevState };
      if (newState[transactionId]) {
        delete newState[transactionId];
      } else {
        newState[transactionId] = true;
      }
      return newState;
    });
  };

  // Function to handle action checkbox changes (for the rightmost column)
  const handleActionCheckboxChange = (transactionId) => {
    setActionCheckedRows(prevState => {
      const newState = { ...prevState };
      if (newState[transactionId]) {
        delete newState[transactionId];
      } else {
        newState[transactionId] = true;
      }
      return newState;
    });
  };

  // Check if any transactions are checked
  const hasCheckedTransactions = Object.keys(checkedRows).length > 0;

  return {
    checkedRows,
    actionCheckedRows,
    hasCheckedTransactions,
    handleTransactionCheckboxChange,
    handleActionCheckboxChange
  };
};

export default useTransactionSelection;