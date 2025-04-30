import React, { useState, useEffect } from 'react';
import { useAccounting } from '../../../contexts/AccountingContext';
import { REIMBURSEMENT_TRANSACTIONS } from '../../../utils/ExpenseReimbursementsData';

/**
 * Custom hook for managing reimbursements transaction data
 * 
 * This hook centralizes state and logic related to reimbursement transaction data,
 * loading state, and provider information.
 */
const useTransactionData = () => {
  // State for transactions and related data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState("");
  const [isCustomProvider, setIsCustomProvider] = useState(false);
  
  // Department data from expense reimbursements
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
  
  // Load and format reimbursement transactions
  useEffect(() => {
    setLoading(true);
    
    try {
      if (REIMBURSEMENT_TRANSACTIONS && REIMBURSEMENT_TRANSACTIONS.length > 0) {
        // Map and format transactions with additional fields needed for accounting
        const formattedTransactions = REIMBURSEMENT_TRANSACTIONS.map(tx => {
          // Determine action status based on review and approval status
          let actionStatus = "Synced"; // Default status
          
          if (tx.approvalStatus === "Pending") {
            actionStatus = "Needs review";
          } else if (tx.reviewStatus === "Needs Review") {
            actionStatus = "Needs review";
          } else if (tx.approvalStatus === "Approved" && tx.reviewStatus === "Reviewed") {
            actionStatus = "Ready to sync";
          }
          
          return {
            ...tx,
            id: tx.id,
            transactionId: `RMB-${tx.id.toString().padStart(4, "0")}`,
            actionStatus,
            merchant: tx.merchant,
            amount: tx.amount,
            employeeName: tx.employeeName,
            expenseCode: tx.category, // Rename category to expenseCode
            accountingCategory: "", // Field for accounting category
            spentFrom: tx.spentFrom || "Personal Funds",
            department: tx.department || "Not assigned",
            location: tx.location || "Not assigned",
            approvalStatus: tx.approvalStatus,
            policyCompliance: tx.policyReview,
            notes: tx.note || "",
            receiptStatus: tx.receiptAttached,
            clearedDate: tx.approvedDate ? tx.approvedDate.replace(/-/g, "/") : "",
            transactionDate: tx.date.replace(/-/g, "/"),
          };
        });
        
        setTransactions(formattedTransactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading reimbursement transactions:", error);
      setTransactions([]);
    }
    
    setLoading(false);
  }, []);
  
  // Function to refresh transactions
  const refreshTransactions = () => {
    setLoading(true);
    
    // Simulating API refresh - in a real app this would call an API
    setTimeout(() => {
      setLoading(false);
    }, 500);
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