
// src/components/common/page-layout/PageLayout.jsx
import React, { useState } from "react";
import PageHeader from "./PageHeader";
import SearchActionButton from "../action-buttons/Search Button/SearchActionButton";
import FilterActionButton from "../action-buttons/FilterButton/FilterActionButton";
import CalendarActionButton from "../action-buttons/Calendar Button/CalendarActionButton";
import ColumnActionButton from "../action-buttons/ColumnButton/ColumnActionButton";
import DownloadActionButton from "../action-buttons/Download Button/DownloadActionButton";

/**
 * PageLayout - Higher-Order Component (HOC) for standardized page layout
 * 
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Top level indicator (e.g., "Bill Pay", "Cards")
 * @param {string} props.heading - Main heading (e.g., "Bills", "Vendors")
 * @param {Array} props.actions - Array of action buttons/elements to display
 * @param {Array} props.subtabs - Optional array of subtab configurations
 * @param {string} props.activeSubtab - Currently active subtab
 * @param {function} props.onSubtabChange - Function to handle subtab changes
 * @param {ReactNode} props.children - Content to render inside the page layout
 * @param {boolean} props.showSearchBar - Whether to show the search bar (default: true)
 * @param {boolean} props.showActionButtons - Whether to show the action buttons (default: true)
 * @param {string} props.searchTerm - The current search term
 * @param {function} props.onSearchChange - Function to handle search term changes
 * @param {Array} props.columns - Columns for the column button dropdown
 * @param {function} props.onColumnVisibilityChange - Function to handle column visibility changes
 * @param {function} props.onFilterChange - Function to handle filter changes
 * @param {function} props.onDateRangeChange - Function to handle date range changes
 * @param {function} props.onDownload - Function to handle download action
 * @param {ReactNode} props.headerBottomComponent - Component to render between header and subtabs
 * @returns {ReactElement} Standardized page layout
 */
const PageLayout = ({
  pageTitle,
  heading,
  actions = [],
  subtabs = [],
  activeSubtab,
  onSubtabChange,
  children,
  showSearchBar = true,
  showActionButtons = true,
  searchTerm = "",
  onSearchChange = () => {},
  columns = [],
  onColumnVisibilityChange = () => {},
  onFilterChange = () => {},
  onDateRangeChange = () => {},
  onDownload = () => {},
  defaultVisibleColumns = [],
  headerBottomComponent
}) => {
  const handleSearchChange = (newSearchTerm) => {
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Fixed header with standardized padding */}
      <div className="sticky top-0 z-30 bg-white py-5">
        <div className="px-8">
          <PageHeader
            pageTitle={pageTitle}
            heading={heading}
            actions={actions}
          />
        </div>
      </div>
      {/* Border that matches content padding */}
      <div className="px-8">
        <div className="border-b border-gray-200"></div>
      </div>

      {/* Component to render between header and subtabs if provided */}
      {headerBottomComponent && (
        <div className="px-8 py-4 bg-white">
          {headerBottomComponent}
        </div>
      )}
      
      {/* Content area with standardized padding */}
      <div className="px-8 py-6">
        {/* Subtabs navigation if provided - using standardized format */}
        {subtabs.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-8 mb-1">
              {subtabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onSubtabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                    activeSubtab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon && <tab.icon size={16} className="mr-2" />}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                      activeSubtab === tab.id 
                        ? 'bg-primary bg-opacity-10 text-primary' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Standardized Search Bar and Action Buttons */}
        {(showSearchBar || showActionButtons) && (
          <div className="flex justify-between items-center space-x-4 mb-6">
            {showSearchBar && (
              <SearchActionButton
                onSearchChange={handleSearchChange}
                initialSearchTerm={searchTerm}
                placeholder="Search..."
                width="3/4"
              />
            )}
            
            {showActionButtons && (
              <div className="flex space-x-2">
                <FilterActionButton
                  columns={columns}
                  onFilterChange={onFilterChange}
                  tooltipText="Filter"
                />
                
                <CalendarActionButton
                  onDateRangeChange={onDateRangeChange}
                  tooltipText="Filter by date"
                />
                
                <ColumnActionButton
                  columns={columns}
                  defaultVisibleColumns={defaultVisibleColumns}
                  onColumnVisibilityChange={onColumnVisibilityChange}
                  tooltipText="Manage columns"
                />
                
                <DownloadActionButton
                  onDownload={onDownload}
                  tooltipText="Download"
                />
              </div>
            )}
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
