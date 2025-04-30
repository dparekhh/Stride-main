import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

/**
 * SyncSettings_CardSpend Component
 * 
 * Card spend tab content for the Sync Settings drawer
 * 
 * @param {Object} props - Component props
 * @param {string} props.prepaidAccountName - Prepaid account name
 * @param {Function} props.setPrepaidAccountName - Function to update prepaid account name
 * @param {string} props.prepaidAccountId - Prepaid account ID
 * @param {Function} props.setPrepaidAccountId - Function to update prepaid account ID
 * @param {string} props.statementAccountName - Statement account name
 * @param {Function} props.setStatementAccountName - Function to update statement account name
 * @param {string} props.statementAccountId - Statement account ID
 * @param {Function} props.setStatementAccountId - Function to update statement account ID
 * @param {string} props.cashbackAccountName - Cashback account name
 * @param {Function} props.setCashbackAccountName - Function to update cashback account name
 * @param {string} props.cashbackAccountId - Cashback account ID
 * @param {Function} props.setCashbackAccountId - Function to update cashback account ID
 * @param {string} props.accountingDate - Default accounting date
 * @param {Function} props.setAccountingDate - Function to update default accounting date
 * @param {Function} props.setFormModified - Function to update form modified state
 */
const SyncSettings_CardSpend = ({
  prepaidAccountName,
  setPrepaidAccountName,
  prepaidAccountId,
  setPrepaidAccountId,
  statementAccountName,
  setStatementAccountName,
  statementAccountId,
  setStatementAccountId,
  cashbackAccountName,
  setCashbackAccountName,
  cashbackAccountId,
  setCashbackAccountId,
  accountingDate,
  setAccountingDate,
  setFormModified
}) => {
  // State for date dropdown
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  
  // Toggle date dropdown
  const toggleDateDropdown = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };
  
  // Select date option
  const selectDateOption = (option) => {
    setAccountingDate(option);
    setIsDateDropdownOpen(false);
    setFormModified(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Prepaid Asset Account section */}
      <div className="space-y-2">
        <h3 className="font-medium">Prepaid Asset Account</h3>
        <p className="text-gray-500 text-sm">
          The balance of this account keeps track of your Stride Card Asset, i.e. "How much you owe Stride"
        </p>
        
        {/* Account input fields */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account name"
              value={prepaidAccountName}
              onChange={(e) => {
                setPrepaidAccountName(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account ID"
              value={prepaidAccountId}
              onChange={(e) => {
                setPrepaidAccountId(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Statement payments section */}
      <div className="space-y-2">
        <h3 className="font-medium">Statement payments</h3>
        
        {/* Bank account selection - using the same bank account component from PaymentsDrawer */}
        <div id="bank-account-container" className="border border-gray-200 rounded-lg p-4 mt-2">
          {/* This would typically be a shared component from a BankAccountSelector component */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Primary current account</p>
              <p className="text-sm text-gray-500">HDFC Bank ****9752</p>
            </div>
            <div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
            </div>
          </div>
        </div>
        
        {/* Choose another bank account link */}
        <div className="mt-2 mb-2">
          <button className="text-black font-medium text-sm flex items-center">
            <span className="mr-1">+</span> Choose another bank account
          </button>
        </div>
        
        {/* Account input fields */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account name"
              value={statementAccountName}
              onChange={(e) => {
                setStatementAccountName(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account ID"
              value={statementAccountId}
              onChange={(e) => {
                setStatementAccountId(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Cashback account section */}
      <div className="space-y-2">
        <h3 className="font-medium">Cashback account</h3>
        
        {/* Account input fields */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account name"
              value={cashbackAccountName}
              onChange={(e) => {
                setCashbackAccountName(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account ID"
              value={cashbackAccountId}
              onChange={(e) => {
                setCashbackAccountId(e.target.value);
                setFormModified(true);
              }}
            />
            <Info size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Default accounting date section */}
      <div className="space-y-2">
        <h3 className="font-medium">Default accounting date</h3>
        
        {/* Dropdown for accounting date - with dropdown opening downwards */}
        <div className="relative">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
            onClick={toggleDateDropdown}
          >
            <span>{accountingDate}</span>
            {isDateDropdownOpen ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          
          {/* Date options dropdown - positioned below the input */}
          {isDateDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
              <div>
                {/* Clearing date option with description */}
                <div className="border-b border-gray-100">
                  <div className="py-2 px-3">
                    <div className="text-sm text-gray-500">Clearing date</div>
                    <div className="text-xs text-gray-400">The date that a transaction clears</div>
                  </div>
                  
                  <div 
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectDateOption('Clearing date')}
                  >
                    <span className="flex-grow">Clearing date</span>
                    {accountingDate === 'Clearing date' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Transaction date option with description */}
                <div>
                  <div className="py-2 px-3">
                    <div className="text-sm text-gray-500">Transaction date</div>
                    <div className="text-xs text-gray-400">The date that the card is swiped</div>
                  </div>
                  
                  <div 
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectDateOption('Transaction date')}
                  >
                    <span className="flex-grow">Transaction date</span>
                    {accountingDate === 'Transaction date' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncSettings_CardSpend;