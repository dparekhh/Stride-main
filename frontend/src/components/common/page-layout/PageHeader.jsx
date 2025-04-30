
// src/components/common/page-layout/PageHeader.jsx
import React from "react";

/**
 * PageHeader - Component for standardized page headers
 *
 * @param {Object} props - Component props
 * @param {string} props.pageTitle - Top level indicator (e.g., "Bill Pay", "Cards")
 * @param {string} props.heading - Main heading (e.g., "Bills", "Vendors")
 * @param {Array} props.actions - Array of action buttons/elements to display
 * @param {Array} props.subtabs - Optional array of subtab configurations
 * @param {string} props.activeSubtab - Currently active subtab
 * @param {function} props.onSubtabChange - Function to handle subtab changes
 * @returns {ReactElement} Standardized page header
 */
const PageHeader = ({
  pageTitle,
  heading,
  actions = [],
  subtabs = [],
  activeSubtab,
  onSubtabChange
}) => {
  return (
    <div>
      {/* Page title (e.g., "Bill Pay") */}
      {pageTitle && <p className="text-sm text-gray-500 mb-2">{pageTitle}</p>}

      {/* Main heading with action buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{heading}</h1>
        </div>
        
        {/* Action buttons section */}
        {actions.length > 0 && (
          <div className="flex space-x-4">
            {actions.map((action, index) => (
              <div key={`action-${index}`} className="relative">
                {action}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
