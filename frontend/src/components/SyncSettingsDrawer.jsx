import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import SyncSettings_CardSpend from './SyncSettings_CardSpend';
import SyncSettings_Reimbursements from './SyncSettings_Reimbursements';
import SyncSettings_BillPay from './SyncSettings_BillPay';

/**
 * SyncSettingsDrawer Component
 * 
 * Drawer for configuring synchronization settings for accounting integration
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls if the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 */
const SyncSettingsDrawer = ({ isOpen, onClose, onBack }) => {
  // Tabs state
  const [activeTab, setActiveTab] = useState('card-spend');
  
  // Form state for Card Spend
  const [prepaidAccountName, setPrepaidAccountName] = useState('');
  const [prepaidAccountId, setPrepaidAccountId] = useState('');
  const [statementAccountName, setStatementAccountName] = useState('');
  const [statementAccountId, setStatementAccountId] = useState('');
  const [cashbackAccountName, setCashbackAccountName] = useState('');
  const [cashbackAccountId, setCashbackAccountId] = useState('');
  const [accountingDate, setAccountingDate] = useState('Transaction date');
  
  // Form state for Reimbursements
  const [apAccountName, setApAccountName] = useState('');
  const [apAccountId, setApAccountId] = useState('');
  const [reimbursementAccountName, setReimbursementAccountName] = useState('');
  const [reimbursementAccountId, setReimbursementAccountId] = useState('');
  
  // Form state for Bill Pay
  const [billPayAccountName, setBillPayAccountName] = useState('');
  const [billPayAccountId, setBillPayAccountId] = useState('');
  const [exportAvailability, setExportAvailability] = useState('');
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [paymentAccountName, setPaymentAccountName] = useState('');
  const [paymentAccountId, setPaymentAccountId] = useState('');
  
  // Track if form has been modified
  const [formModified, setFormModified] = useState(false);
  
  // Reset modified state when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormModified(false);
    }
  }, [isOpen]);
  
  // Update form modified state when any field changes
  useEffect(() => {
    const hasChanges = 
      // Card Spend changes
      prepaidAccountName !== '' || 
      prepaidAccountId !== '' || 
      statementAccountName !== '' || 
      statementAccountId !== '' ||
      cashbackAccountName !== '' ||
      cashbackAccountId !== '' ||
      accountingDate !== 'Transaction date' ||
      
      // Reimbursements changes
      apAccountName !== '' ||
      apAccountId !== '' ||
      reimbursementAccountName !== '' ||
      reimbursementAccountId !== '' ||
      
      // Bill Pay changes
      billPayAccountName !== '' ||
      billPayAccountId !== '' ||
      exportAvailability !== '' ||
      paymentAccounts.length > 0 ||
      paymentAccountName !== '' ||
      paymentAccountId !== '';
    
    setFormModified(hasChanges);
  }, [
    // Card Spend dependencies
    prepaidAccountName, 
    prepaidAccountId, 
    statementAccountName, 
    statementAccountId,
    cashbackAccountName,
    cashbackAccountId,
    accountingDate,
    
    // Reimbursements dependencies
    apAccountName,
    apAccountId,
    reimbursementAccountName,
    reimbursementAccountId,
    
    // Bill Pay dependencies
    billPayAccountName,
    billPayAccountId,
    exportAvailability,
    paymentAccounts,
    paymentAccountName,
    paymentAccountId
  ]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle back button
  const handleBack = () => {
    onBack();
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // Here you would save the changes to your backend
    console.log('Saving sync settings changes');
    
    // Reset form modified state
    setFormModified(false);
    
    // Close the drawer
    onClose();
  };
  
  // Handle cancel
  const handleCancel = () => {
    // Reset all field values
    // Card Spend fields
    setPrepaidAccountName('');
    setPrepaidAccountId('');
    setStatementAccountName('');
    setStatementAccountId('');
    setCashbackAccountName('');
    setCashbackAccountId('');
    setAccountingDate('Transaction date');
    
    // Reimbursement fields
    setApAccountName('');
    setApAccountId('');
    setReimbursementAccountName('');
    setReimbursementAccountId('');
    
    // Bill Pay fields
    setBillPayAccountName('');
    setBillPayAccountId('');
    setExportAvailability('');
    setPaymentAccounts([]);
    setPaymentAccountName('');
    setPaymentAccountId('');
    
    // Close the drawer
    onClose();
  };
  
  // No need for custom header anymore - we'll use the standardized one from AppDrawer
  
  // Footer with cancel and save buttons
  const footerContent = (
    <div className="flex justify-between">
      <button 
        onClick={handleCancel}
        className="px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button 
        onClick={handleSaveChanges}
        disabled={!formModified}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          formModified 
            ? "bg-[#FF6B00] text-white hover:bg-[#e56100]" 
            : "bg-gray-200 text-gray-600 cursor-not-allowed"
        }`}
      >
        Save changes
      </button>
    </div>
  );
  
  // CSS for focused input elements
  const focusRingStyles = `
    .custom-focus-ring:focus {
      outline: none !important;
      box-shadow: none !important;
      border-color: black !important;
    }
  `;
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={handleBack}
      title="Sync settings"
      footer={footerContent}
      width="md:w-1/2"
      zIndex={Z_INDEX_LEVELS.LEVEL_2}
      id="sync-settings-drawer"
      contentPadding="p-6"
      showCloseButton={true}
    >
      {/* Add custom focus styles */}
      <style>{focusRingStyles}</style>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-6">
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === 'card-spend' 
              ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => handleTabChange('card-spend')}
          >
            Card spend
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === 'reimbursements' 
              ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => handleTabChange('reimbursements')}
          >
            Reimbursements
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === 'bill-pay' 
              ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]' 
              : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => handleTabChange('bill-pay')}
          >
            Bill Pay
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === 'card-spend' && (
        <SyncSettings_CardSpend
          prepaidAccountName={prepaidAccountName}
          setPrepaidAccountName={setPrepaidAccountName}
          prepaidAccountId={prepaidAccountId}
          setPrepaidAccountId={setPrepaidAccountId}
          statementAccountName={statementAccountName}
          setStatementAccountName={setStatementAccountName}
          statementAccountId={statementAccountId}
          setStatementAccountId={setStatementAccountId}
          cashbackAccountName={cashbackAccountName}
          setCashbackAccountName={setCashbackAccountName}
          cashbackAccountId={cashbackAccountId}
          setCashbackAccountId={setCashbackAccountId}
          accountingDate={accountingDate}
          setAccountingDate={setAccountingDate}
          setFormModified={setFormModified}
        />
      )}
      
      {/* Reimbursements tab content */}
      {activeTab === 'reimbursements' && (
        <SyncSettings_Reimbursements
          accountName={apAccountName}
          setAccountName={setApAccountName}
          accountId={apAccountId}
          setAccountId={setApAccountId}
          reimbursementAccountName={reimbursementAccountName}
          setReimbursementAccountName={setReimbursementAccountName}
          reimbursementAccountId={reimbursementAccountId}
          setReimbursementAccountId={setReimbursementAccountId}
          setFormModified={setFormModified}
        />
      )}
      
      {/* Bill Pay tab content */}
      {activeTab === 'bill-pay' && (
        <SyncSettings_BillPay
          accountName={billPayAccountName}
          setAccountName={setBillPayAccountName}
          accountId={billPayAccountId}
          setAccountId={setBillPayAccountId}
          exportAvailability={exportAvailability}
          setExportAvailability={setExportAvailability}
          paymentAccounts={paymentAccounts}
          setPaymentAccounts={setPaymentAccounts}
          paymentAccountName={paymentAccountName}
          setPaymentAccountName={setPaymentAccountName}
          paymentAccountId={paymentAccountId}
          setPaymentAccountId={setPaymentAccountId}
          setFormModified={setFormModified}
        />
      )}
    </AppDrawer>
  );
};

export default SyncSettingsDrawer;