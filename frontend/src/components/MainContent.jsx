// src/components/MainContent.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  MoreVertical, Plus, XCircle
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import Dashboard from "../pages/Dashboard";
import AnalyticsView from "../pages/AnalyticsView";
// Import page components
import BillsPage from "../pages/BillsPage";
import VendorsPage from "../pages/VendorsPage";
import PurchaseOrderPage from "../pages/PurchaseOrderPage";

/**
 * MainContent component
 * A clean router/container component that delegates to specialized page components
 * following the same pattern used for Expenses, Cards, and People sections.
 */
const MainContent = ({
  showFilter,
  setShowFilter,
  showMoreOptionsMenu,
  setShowMoreOptionsMenu,
  showSettings,
  moreOptionsMenuRef,
  handleMoreOption,
  fileInputRef,
  handleFileUpload,
  children
}) => {
  // Get current route location
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine activeView from current path
  let activeView = "default";
  if (currentPath.includes("/inbox")) {
    activeView = "inbox";
  } else if (currentPath.includes("/insights")) {
    activeView = "insights";
  } else if (currentPath.includes("/expense/card-transactions")) {
    activeView = "expense";
  } else if (currentPath.includes("/policy")) {
    activeView = "policy";
  }
  // Get notification context
  const { showSuccess, showInfo } = useNotification();
  
  return (
    <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
      {/* Conditional header based on active view */}
      {activeView === "inbox" ? (
        /* Inbox header */
        <div className="px-8 py-5 border-b border-gray-200">
          <p className="text-sm text-gray-500">Inbox</p>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-3">
              {/* More Options Button with Dropdown */}
              <div className="relative" ref={moreOptionsMenuRef}>
                <button
                  onClick={() => setShowMoreOptionsMenu(!showMoreOptionsMenu)}
                  className="p-2 border rounded-lg"
                >
                  <MoreVertical size={20} />
                </button>
                {showMoreOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleMoreOption("download_report");
                          showSuccess("Report download started");
                        }}
                      >
                        <span>Download AP aging report</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeView === "expense" ? (
        /* No header needed - handled by CardTransactionExpenses */
        <div></div>
      ) : activeView === "policy" ? (
        /* Policy header */
        <div className="px-8 py-5 border-b border-gray-200">
          <p className="text-sm text-gray-500">Policy</p>
        </div>
      ) : activeView === "default" && !currentPath.includes("/bill-pay") ? (
        /* Default header for other views - removed to eliminate redundant header */
        <div></div>
      ) : (
        /* Empty div for views that handle their own headers */
        <div></div>
      )}

      {/* Filter panel - shown for all views */}
      {showFilter && (
        <div className="flex items-center mx-8 my-4 p-2 bg-gray-50 rounded-lg">
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded mr-2 flex items-center"
            onClick={() => {
              showInfo("Filter added");
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Filter
          </button>
          <button 
            className="ml-auto" 
            onClick={() => {
              setShowFilter(false);
              showInfo("Filters panel closed");
            }}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Content rendering - delegate to specialized components */}
      {children ? (
        /* Render passed children (these use PageLayout with its own padding) */
        children
      ) : activeView === "inbox" ? (
        /* Dashboard View */
        <div className="px-8 py-6">
          <Dashboard />
        </div>
      ) : activeView === "insights" ? (
        /* Analytics View */
        <div className="px-8 py-6">
          <AnalyticsView />
        </div>
      ) : (
        /* Default empty container for other specialized pages */
        <div className="px-8 py-6 w-full h-full"></div>
      )}
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default MainContent;