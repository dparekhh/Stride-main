import React, { useState } from 'react';
import { ChevronRight, Info, ArrowLeftRight, Box, Sparkles, ChevronDown } from 'lucide-react';
import tallyLogo from '../../../assets/tally-logo.svg';
import EmployeeDropdown from './EmployeeDropdown';

const BillPayAccountingTab = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Handle section expansion
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Handle employee selection
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };
  
  // Navigate to SyncSettingsDrawer
  const navigateToSyncSettings = () => {
    window.dispatchEvent(new CustomEvent('openSyncSettings', { detail: { tab: 'billpay' } }));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Accounting settings</h3>
      <p className="text-sm text-gray-500 mb-6">Configure accounting preferences for Bill Pay</p>
      
      {/* Employee Selection Dropdown */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Accounting Setup</h4>
          <div className="w-96">
            <EmployeeDropdown 
              selectedEmployee={selectedEmployee} 
              onSelectEmployee={handleSelectEmployee} 
            />
          </div>
        </div>
        {selectedEmployee && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedEmployee.name} will be responsible for setting up accounting preferences
          </p>
        )}
      </div>
      
      {/* Section 1: Tally Connection */}
      <div className="border rounded-md mb-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center">
          {/* Tally Logo */}
          <div className="tally-logo-container mr-3">
            <img 
              src={tallyLogo} 
              alt="Tally Logo" 
              className="tally-logo w-8 h-8 object-contain"
            />
          </div>
          {/* Connection Info */}
          <div>
            <h4 className="font-medium text-base">Tally</h4>
            <p className="text-sm text-gray-500">Connected</p>
          </div>
        </div>
      </div>
      
      {/* Section 2: Sync Settings */}
      <div className="border rounded-md mb-4 cursor-pointer hover:bg-gray-50" onClick={navigateToSyncSettings}>
        <div className="p-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium">Sync Settings</h4>
            <p className="text-sm text-gray-500">Manage how bill activity is synced to Tally</p>
          </div>
          <div className="border-l border-gray-200 h-12 px-4 flex items-center">
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Section 3: Accounting Fields */}
      <div className="border rounded-md cursor-pointer" onClick={() => toggleSection('accounting')}>
        <div className="p-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium">Accounting Fields</h4>
            <p className="text-sm text-gray-500">Configure what accounts you and your organization can select from</p>
          </div>
          <div className="border-l border-gray-200 h-12 px-4 flex items-center">
            <ChevronDown 
              size={18} 
              className={`text-gray-400 transition-transform ${activeSection === 'accounting' ? 'transform rotate-180' : ''}`}
            />
          </div>
        </div>
        
        {/* Expanded content for Accounting Fields */}
        {activeSection === 'accounting' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="mb-4">
              <h5 className="font-medium text-sm mb-2">Default AP Account</h5>
              <div className="relative">
                <select 
                  className="w-full p-3 border rounded appearance-none pr-10"
                  defaultValue="Accounts Payable"
                  aria-label="Select default AP account"
                >
                  <option value="Accounts Payable">Accounts Payable (Liability)</option>
                  <option value="Office Expenses">Office Expenses (Expense)</option>
                  <option value="IT Equipment">IT Equipment (Asset)</option>
                  <option value="Staff Salary">Staff Salary (Expense)</option>
                  <option value="Marketing Expenses">Marketing Expenses (Expense)</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronRight size={16} className="transform rotate-90 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">This account will be used as the default for all bill transactions</p>
            </div>
            
            <div className="pt-2">
              <button 
                className="text-blue-600 font-medium text-sm flex items-center hover:underline"
                aria-label="Manage accounts in Tally"
              >
                <Box size={16} className="mr-1" />
                Manage accounts in Tally
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Help section at the bottom */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
        <div className="flex">
          <div className="mr-3 text-yellow-500 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h5 className="font-medium">Need help with accounting settings?</h5>
            <p className="text-sm text-gray-600 mt-1">
              Contact your accountant or our support team for guidance on configuring these settings correctly for your business.
            </p>
            <a href="#" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
              Learn more about accounting integration
            </a>
          </div>
        </div>
      </div>
      
      {/* CSS for Tally logo */}
      <style jsx>{`
        .tally-logo-container {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
        }
        
        .tally-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
          border-radius: 50%;
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default BillPayAccountingTab;