import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../../contexts/AccountingContext';

/**
 * Custom hook for managing transaction data
 * 
 * This hook centralizes state and logic related to transaction data,
 * loading state, and provider information.
 */
const useTransactionData = () => {
  // State for transactions and related data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState("");
  const [isCustomProvider, setIsCustomProvider] = useState(false);
  
  // Department data - in a production app this would come from an API
  const [departments, setDepartments] = useState([
    { id: "1", name: "Finance", code: "FIN-01" },
    { id: "2", name: "Marketing", code: "MKT-01" },
    { id: "3", name: "Operations", code: "OPS-01" },
    { id: "4", name: "Sales", code: "SLS-01" },
    { id: "5", name: "Human Resources", code: "HR-01" },
    { id: "6", name: "Research & Development", code: "RND-01" },
    { id: "7", name: "Information Technology", code: "IT-01" },
    { id: "8", name: "Customer Service", code: "CS-01" },
    { id: "9", name: "Legal", code: "LGL-01" },
    { id: "10", name: "Administration", code: "ADM-01" }
  ]);

  // Get accounting context data
  const { 
    transactions: contextTransactions,
    isLoadingTransactions,
    transactionsError,
    loadTransactions,
    updateTransactionCategory,
    connectedProvider: accountingProvider,
  } = useAccounting();
  
  // Get connected provider from AccountingContext
  useEffect(() => {
    if (accountingProvider && accountingProvider.name) {
      setConnectedProvider(accountingProvider.name);
      setIsCustomProvider(accountingProvider.isCustom || false);
    } else {
      console.warn("No provider name found in AccountingContext");
      setConnectedProvider("");
      setIsCustomProvider(false);
    }
  }, [accountingProvider]);
  
  // Update local transactions state when context data changes
  useEffect(() => {
    if (contextTransactions && contextTransactions.length > 0) {
      // Map actionStatus based on transaction fields and ensure empty category for all
      const transactionsWithStatus = contextTransactions.map(tx => {
        // Determine action status based on transaction fields
        let actionStatus = "Synced"; // Default status
        
        if (tx.approvalStatus === "Awaiting reviewer") {
          actionStatus = "Ready to sync";
        } else if (tx.approvalStatus === "Awaiting cardholder") {
          actionStatus = "Waiting for cardholder";
        } else if (tx.policyCompliance === "Flagged") {
          actionStatus = "Follow-up required";
        } else {
          actionStatus = "Needs review";
        }
        
        return {
          ...tx,
          accountingCategory: "", // Always set to empty to show placeholder
          actionStatus,
          department: tx.department || "Not assigned", // Ensure department field exists
          location: tx.location || "Not assigned", // Ensure location field exists
          mccCategory: tx.mccCategory || tx.merchantDescription || "Uncategorized", // Ensure mccCategory field exists with fallback
          cardName: tx.cardName || tx.card || "Default Card" // Ensure cardName field exists with fallback
        };
      });
      
      setTransactions(transactionsWithStatus);
    }
  }, [contextTransactions]);
  
  // Load transactions when component mounts
  useEffect(() => {
    if (loadTransactions) {
      loadTransactions();
      setLoading(false);
    }
  }, [loadTransactions]);
  
  // Function to refresh transactions
  const refreshTransactions = () => {
    setLoading(true);
    loadTransactions({}, true); // Force refresh from API
    setLoading(false);
  };

  return {
    transactions,
    loading,
    refreshTransactions,
    connectedProvider,
    isCustomProvider,
    departments
  };
};

export default useTransactionData;