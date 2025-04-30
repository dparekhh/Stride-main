import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ChevronRight, AlertCircle, Loader, RefreshCcw } from 'lucide-react';
import { useAccounting } from '../contexts/AccountingContext';
import AccountingFieldsDrawer from './AccountingFieldsDrawer';
import CodingRulesDrawer from './CodingRulesDrawer';
import SyncSettingsDrawer from './SyncSettingsDrawer';
import CSVExportDrawer from './CSVExportDrawer';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';

/**
 * AccountingSettings Component
 * 
 * This component is a drawer that displays accounting settings according to the design in image_1743996027074.png.
 * It allows users to manage their accounting integration settings.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {string} props.accountingSoftwareName - Name of the connected accounting software
 */
const AccountingSettings = ({ isOpen, onClose, accountingSoftwareName }) => {
  // State for managing sub-drawers
  const [isAccountingFieldsOpen, setIsAccountingFieldsOpen] = useState(false);
  const [isCodingRulesOpen, setIsCodingRulesOpen] = useState(false);
  const [isSyncSettingsOpen, setIsSyncSettingsOpen] = useState(false);
  const [isCSVExportOpen, setIsCSVExportOpen] = useState(false);
  
  // Get accounting context data
  const { 
    chartOfAccounts, 
    isLoadingAccounts, 
    accountsError,
    lastFetchTime,
    loadChartOfAccounts
  } = useAccounting();
  
  // Load accounts when the drawer opens
  useEffect(() => {
    if (isOpen && (!lastFetchTime || Date.now() - lastFetchTime > 15 * 60 * 1000)) {
      loadChartOfAccounts();
    }
  }, [isOpen, lastFetchTime, loadChartOfAccounts]);

  // Handle opening accounting fields drawer
  const handleOpenAccountingFields = () => {
    setIsAccountingFieldsOpen(true);
  };

  // Handle closing accounting fields drawer
  const handleCloseAccountingFields = () => {
    setIsAccountingFieldsOpen(false);
  };
  
  // Handle opening coding rules drawer
  const handleOpenCodingRules = () => {
    setIsCodingRulesOpen(true);
  };

  // Handle closing coding rules drawer
  const handleCloseCodingRules = () => {
    setIsCodingRulesOpen(false);
  };
  
  // Handle opening sync settings drawer
  const handleOpenSyncSettings = () => {
    setIsSyncSettingsOpen(true);
  };
  
  // Handle closing sync settings drawer
  const handleCloseSyncSettings = () => {
    setIsSyncSettingsOpen(false);
  };
  
  // Handle opening CSV export drawer
  const handleOpenCSVExport = () => {
    setIsCSVExportOpen(true);
  };
  
  // Handle closing CSV export drawer
  const handleCloseCSVExport = () => {
    setIsCSVExportOpen(false);
  };

  return (
    <>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="Accounting Settings"
        description="Manage your Accounting integration by setting default accounts, editing the chart of accounts, and configuring transaction fields."
        contentPadding="p-0"
        zIndex={Z_INDEX_LEVELS.BASE}
        width="md:w-1/2"
        id="accounting-settings-drawer"
      >
        <div className="flex-grow overflow-y-auto px-6">
          {/* Organization name section */}
          <div className="mt-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">Organization name</p>
            <p className="text-gray-800 font-medium">Stride</p>
          </div>
          
          {/* Chart of Accounts Status */}
          <div className="mb-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Chart of Accounts</h3>
            <div>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">{chartOfAccounts.length}</span> accounts available
              </p>
              {lastFetchTime && (
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(lastFetchTime).toLocaleString()}
                </p>
              )}
              <button 
                onClick={() => loadChartOfAccounts(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <RefreshCcw size={14} className="mr-1" />
                Refresh
              </button>
            </div>
          
          </div>
          
          {/* Settings sections */}
          {/* Accounting fields section */}
          <div 
            className="py-4 border-t border-gray-200 flex items-center justify-between hover:bg-gray-50 px-1 cursor-pointer group"
            onClick={handleOpenAccountingFields}
          >
            <div>
              <h3 className="font-medium text-gray-800">Accounting fields</h3>
              <p className="text-gray-500 text-sm mt-1">Configure what accounts you and your organization can select from</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </div>
          
          {/* Coding rules section */}
          <div 
            className="py-4 border-t border-gray-200 flex items-center justify-between hover:bg-gray-50 px-1 cursor-pointer group"
            onClick={handleOpenCodingRules}
          >
            <div>
              <h3 className="font-medium text-gray-800">Coding rules</h3>
              <p className="text-gray-500 text-sm mt-1">Automate your coding with accounting rules</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </div>
          
          {/* Sync settings section */}
          <div 
            className="py-4 border-t border-gray-200 flex items-center justify-between hover:bg-gray-50 px-1 cursor-pointer group"
            onClick={handleOpenSyncSettings}
          >
            <div>
              <h3 className="font-medium text-gray-800">Sync settings</h3>
              <p className="text-gray-500 text-sm mt-1">
                Manage how card spend, statement payments, reimbursements, and bills are exported to {accountingSoftwareName || "your accounting software"}
              </p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </div>
          
          {/* CSV export section */}
          <div 
            className="py-4 border-t border-gray-200 flex items-center justify-between hover:bg-gray-50 px-1 cursor-pointer group"
            onClick={handleOpenCSVExport}
          >
            <div>
              <h3 className="font-medium text-gray-800">Customize your CSV export</h3>
              <p className="text-gray-500 text-sm mt-1">Customize the format and contents of exports to match your ERP</p>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-gray-600" size={20} />
          </div>
        </div>
      </AppDrawer>

      {/* Accounting Fields Drawer */}
      {isAccountingFieldsOpen && (
        <AccountingFieldsDrawer
          isOpen={isAccountingFieldsOpen}
          onClose={onClose}
          onBack={handleCloseAccountingFields}
        />
      )}
      
      {/* Coding Rules Drawer */}
      {isCodingRulesOpen && (
        <CodingRulesDrawer
          isOpen={isCodingRulesOpen}
          onClose={onClose}
          onBack={handleCloseCodingRules}
        />
      )}
      
      {/* Sync Settings Drawer */}
      {isSyncSettingsOpen && (
        <SyncSettingsDrawer
          isOpen={isSyncSettingsOpen}
          onClose={onClose}
          onBack={handleCloseSyncSettings}
        />
      )}
      
      {/* CSV Export Drawer */}
      {isCSVExportOpen && (
        <CSVExportDrawer
          isOpen={isCSVExportOpen}
          onClose={onClose}
          onBack={handleCloseCSVExport}
        />
      )}
    </>
  );
};

export default AccountingSettings;
