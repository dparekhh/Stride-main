// src/components/SettingsModal.jsx
import React, { useEffect, useState, useId } from "react";
import { X, Info, Bell } from "lucide-react";
import PermissionsTab from "./settings/PermissionsTab";
import ApprovalsTab from "./settings/ApprovalsTab";
import AccountingTab from "./settings/AccountingTab";
import ImportingTab from "./settings/ImportingTab";
import { isAllowedFileType, formatCurrency, isValidGSTIN } from "../utils/helpers";
import { useNotification } from "../contexts/NotificationContext";
import { useDrawer, Z_INDEX_LEVELS } from "../contexts/DrawerContext";
import AppDrawer from "./common/AppDrawer";

/**
 * SettingsModal - A drawer component for displaying and editing application settings
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showSettings - Whether the settings drawer is open
 * @param {Function} props.setShowSettings - Function to call when drawer is closed
 * @param {string} props.activeSettingsTab - Currently active tab in settings
 * @param {Function} props.setActiveSettingsTab - Function to call when tab is changed
 * @param {Array} props.sampleAPClerks - Sample data for permissions tab
 * @param {boolean} props.importTallyEnabled - Flag for tally import functionality
 * @param {Function} props.setImportTallyEnabled - Function to update tally import setting
 * @param {boolean} props.importPOEnabled - Flag for PO import functionality
 * @param {Function} props.setImportPOEnabled - Function to update PO import setting
 * @param {Object} props.settingsModalRef - React ref for the settings modal
 * @param {number} props.zIndex - Z-index for the drawer (default: Z_INDEX_LEVELS.BASE)
 * @returns {React.ReactElement} Settings modal component
 */
const SettingsModal = ({
  showSettings,
  setShowSettings,
  activeSettingsTab,
  setActiveSettingsTab,
  sampleAPClerks,
  importTallyEnabled,
  setImportTallyEnabled,
  importPOEnabled,
  setImportPOEnabled,
  settingsModalRef,
  zIndex = Z_INDEX_LEVELS.BASE
}) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `settings-modal-${generatedId}`;
  
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const renderSettingsTabContent = () => {
    switch (activeSettingsTab) {
      case "permissions":
        return <PermissionsTab sampleAPClerks={sampleAPClerks} />;
      case "approvals":
        return <ApprovalsTab />;
      case "accounting":
        return <AccountingTab />;
      case "importing":
        return (
          <ImportingTab
            importTallyEnabled={importTallyEnabled}
            setImportTallyEnabled={setImportTallyEnabled}
            importPOEnabled={importPOEnabled}
            setImportPOEnabled={setImportPOEnabled}
          />
        );
      default:
        return null;
    }
  };

  // Custom header content with tabs
  const headerContent = (
    <div className="w-full">
      <div className="flex border-b overflow-x-auto">
        {[
          { id: "permissions", label: "Permissions" },
          { id: "approvals", label: "Approvals" },
          { id: "accounting", label: "Accounting" },
          { id: "importing", label: "Importing" }
        ].map(tab => (
          <div
            key={tab.id}
            className={`px-4 py-2 cursor-pointer whitespace-nowrap ${
              activeSettingsTab === tab.id ? "border-b-2 border-primary text-primary font-medium" : "text-gray-500"
            }`}
            onClick={() => setActiveSettingsTab(tab.id)}
            role="tab"
            aria-selected={activeSettingsTab === tab.id}
            tabIndex={0}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
  
  // Empty footer - removing test buttons
  const footerContent = null;

  return (
    <AppDrawer
      isOpen={showSettings}
      onClose={() => setShowSettings(false)}
      title="Bill Pay settings"
      width="md:w-1/2"
      zIndex={zIndex}
      id={drawerId}
      contentPadding="p-6"
      ref={settingsModalRef}
      headerActions={headerContent}
      footer={footerContent}
    >
      {renderSettingsTabContent()}
    </AppDrawer>
  );
};

export default SettingsModal;
