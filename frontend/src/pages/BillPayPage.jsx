// src/pages/BillPayPage.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

/**
 * BillPayPage component
 * Container component for Bill Pay section with nested routing
 * Renders child routes through Outlet
 */
const BillPayPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current bill pay tab from the URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/vendors')) return 'vendors';
    if (path.includes('/purchase-order')) return 'purchase-order';
    return 'bills'; // Default tab
  };
  
  return (
    <div className="w-full">
      {/* Outlet renders the child route components */}
      <Outlet />
    </div>
  );
};

export default BillPayPage;