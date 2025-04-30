import React, { useState } from 'react';
import { Info, Trash2, ChevronDown, ChevronUp, Building } from 'lucide-react';

/**
 * SyncSettings_BillPay Component
 * 
 * Bill Pay tab content for the Sync Settings drawer
 * 
 * @param {Object} props - Component props
 * @param {string} props.accountName - A/P account name
 * @param {Function} props.setAccountName - Function to update A/P account name
 * @param {string} props.accountId - A/P account ID
 * @param {Function} props.setAccountId - Function to update A/P account ID
 * @param {string} props.exportAvailability - Export availability setting
 * @param {Function} props.setExportAvailability - Function to update export availability
 * @param {Array} props.paymentAccounts - Array of payment accounts
 * @param {Function} props.setPaymentAccounts - Function to update payment accounts
 * @param {string} props.paymentAccountName - Payment account name
 * @param {Function} props.setPaymentAccountName - Function to update payment account name
 * @param {string} props.paymentAccountId - Payment account ID
 * @param {Function} props.setPaymentAccountId - Function to update payment account ID
 * @param {Function} props.setFormModified - Function to update form modified state
 */
const SyncSettings_BillPay = ({
  accountName,
  setAccountName,
  accountId,
  setAccountId,
  exportAvailability,
  setExportAvailability,
  paymentAccounts,
  setPaymentAccounts,
  paymentAccountName,
  setPaymentAccountName,
  paymentAccountId,
  setPaymentAccountId,
  setFormModified
}) => {
  // State for export dropdown
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  // State for payment accounts dropdown
  const [isAccountsDropdownOpen, setIsAccountsDropdownOpen] = useState(false);

  // Available export options
  const exportOptions = [
    'After bill is created',
    'After bill is partially approved',
    'After bill is fully approved',
    'Never'
  ];

  // Sample bank accounts for dropdown
  const bankAccounts = [
    { id: 1, name: 'HDFC Bank', accountNumber: '****9752', default: true },
    { id: 2, name: 'ICICI Bank', accountNumber: '****4532', default: false },
    { id: 3, name: 'SBI', accountNumber: '****7823', default: false }
  ];

  // Toggle export dropdown
  const toggleExportDropdown = () => {
    setIsExportDropdownOpen(!isExportDropdownOpen);
  };

  // Toggle accounts dropdown
  const toggleAccountsDropdown = () => {
    setIsAccountsDropdownOpen(!isAccountsDropdownOpen);
  };

  // Select export option
  const selectExportOption = (option) => {
    setExportAvailability(option);
    setIsExportDropdownOpen(false);
    setFormModified(true);
  };

  // Select bank account
  const selectBankAccount = (account) => {
    // In a real implementation, this would add the account to paymentAccounts
    setPaymentAccounts([account]);
    setIsAccountsDropdownOpen(false);
    setFormModified(true);
  };

  return (
    <div className="space-y-6">
      {/* A/P account section */}
      <div className="space-y-2">
        <h3 className="font-medium">A/P account for bills</h3>
        <p className="text-gray-500 text-sm">
          The balance of this account keeps track of your bills liability, i.e. "How much you owe vendors"
        </p>
        
        {/* Account input fields */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account name"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                setFormModified(true);
              }}
            />
            <Info 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account ID"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                setFormModified(true);
              }}
            />
            <Info 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
      
      {/* Export availability section */}
      <div className="space-y-2">
        <h3 className="font-medium">Export availability</h3>
        
        <div className="relative mt-2">
          <div 
            className="relative w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer flex justify-between items-center custom-focus-ring"
            onClick={toggleExportDropdown}
          >
            <div className="text-sm">
              {exportAvailability || "Allow new bills to be exported"}
            </div>
            {isExportDropdownOpen ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
          
          {/* Export dropdown */}
          {isExportDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {exportOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectExportOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bill payment accounts section */}
      <div className="space-y-2">
        <h3 className="font-medium">Bill payment accounts</h3>
        
        {paymentAccounts && paymentAccounts.length > 0 ? (
          // Display selected bank account in the Payment Methods style
          <div className="mt-2">
            <div 
              className="border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:border-gray-300"
              onClick={toggleAccountsDropdown}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <Building size={16} />
                  </div>
                  <div>
                    <p className="font-medium">{paymentAccounts[0].name}</p>
                    <p className="text-sm text-gray-500">{paymentAccounts[0].accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {paymentAccounts[0].default && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">Default</span>
                  )}
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            {/* Bank account dropdown */}
            {isAccountsDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectBankAccount(account)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                      {account.default && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Account name and ID fields for the selected bank account */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
                  placeholder="Account name"
                  value={paymentAccountName}
                  onChange={(e) => {
                    setPaymentAccountName(e.target.value);
                    setFormModified(true);
                  }}
                />
                <Info 
                  size={16} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
                  placeholder="Account ID"
                  value={paymentAccountId}
                  onChange={(e) => {
                    setPaymentAccountId(e.target.value);
                    setFormModified(true);
                  }}
                />
                <Info 
                  size={16} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        ) : (
          // Display dropdown to select a bank account
          <div className="relative mt-2">
            <div 
              className="relative w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer flex justify-between items-center custom-focus-ring"
              onClick={toggleAccountsDropdown}
            >
              <div className="flex items-center text-sm">
                <div className="flex items-center text-gray-500">
                  <Trash2 size={16} className="mr-2" />
                  No account selected
                </div>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
            
            {/* Account dropdown */}
            {isAccountsDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectBankAccount(account)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                      {account.default && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncSettings_BillPay;