import React from 'react';
import { Info, Building } from 'lucide-react';

/**
 * SyncSettings_Reimbursements Component
 * 
 * Reimbursements tab content for the Sync Settings drawer
 * 
 * @param {Object} props - Component props
 * @param {string} props.accountName - A/P account name
 * @param {Function} props.setAccountName - Function to update A/P account name
 * @param {string} props.accountId - A/P account ID
 * @param {Function} props.setAccountId - Function to update A/P account ID
 * @param {string} props.reimbursementAccountName - Reimbursement account name
 * @param {Function} props.setReimbursementAccountName - Function to update reimbursement account name
 * @param {string} props.reimbursementAccountId - Reimbursement account ID
 * @param {Function} props.setReimbursementAccountId - Function to update reimbursement account ID
 * @param {Function} props.setFormModified - Function to update form modified state
 */
const SyncSettings_Reimbursements = ({
  accountName,
  setAccountName,
  accountId,
  setAccountId,
  reimbursementAccountName,
  setReimbursementAccountName,
  reimbursementAccountId,
  setReimbursementAccountId,
  setFormModified
}) => {
  return (
    <div className="space-y-6">
      {/* A/P account section */}
      <div className="space-y-2">
        <h3 className="font-medium">A/P account for reimbursements</h3>
        <p className="text-gray-500 text-sm">
          The balance of this account keeps track of your reimbursements liability, i.e. "How much you owe employees"
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
      
      {/* Reimbursement payments section */}
      <div className="space-y-2">
        <h3 className="font-medium">Reimbursement payments</h3>
        
        {/* Bank account display - matching format from PaymentsDrawer */}
        <div id="bank-account-container" className="border border-gray-200 rounded-lg p-4 mt-2">
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
        
        {/* Reimbursement account input fields */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md custom-focus-ring"
              placeholder="Account name"
              value={reimbursementAccountName}
              onChange={(e) => {
                setReimbursementAccountName(e.target.value);
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
              value={reimbursementAccountId}
              onChange={(e) => {
                setReimbursementAccountId(e.target.value);
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
    </div>
  );
};

export default SyncSettings_Reimbursements;