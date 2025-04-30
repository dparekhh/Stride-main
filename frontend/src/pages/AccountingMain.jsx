// src/pages/AccountingMain.jsx
import React from "react";
import { useAccounting } from "../contexts/AccountingContext";
import AccountingDashboard from "./AccountingDashboard";

/**
 * AccountingMain component
 * Always renders the AccountingDashboard component with the new design
 */
const AccountingMain = () => {
  const { isLoading } = useAccounting();
  
  // Show loading spinner while checking integration status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Always render the AccountingDashboard component with the new design
  return <AccountingDashboard />;
};

export default AccountingMain;