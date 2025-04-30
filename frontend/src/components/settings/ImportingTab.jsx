import React, { useState } from "react";
import { ArrowLeftRight, Box, Flag, Upload, Link2, Info, AlertCircle } from "lucide-react";
import tallyLogo from '../../assets/tally-logo.svg';

const ImportingTab = ({
  importTallyEnabled,
  setImportTallyEnabled,
  importPOEnabled,
  setImportPOEnabled
}) => {
  // State for match selection
  const [matchType, setMatchType] = useState('2-way'); // '2-way' or '3-way'
  
  // State for overbilling protection
  const [flagHighInvoices, setFlagHighInvoices] = useState(true);
  const [blockHighInvoices, setBlockHighInvoices] = useState(false);
  const [percentThreshold, setPercentThreshold] = useState('10');
  const [amountThreshold, setAmountThreshold] = useState('5000');

  // Function to handle percent threshold input
  const handlePercentChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^\d]/g, '');
    setPercentThreshold(value);
  };

  // Function to handle amount threshold input
  const handleAmountChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    setAmountThreshold(value);
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, label, description = null }) => (
    <div className="flex items-center justify-between p-4 border rounded-md mb-4">
      <div>
        <h4 className="font-medium">{label}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={enabled}
          onChange={onChange}
          aria-label={`Toggle ${label}`}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
      </label>
    </div>
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Importing settings</h3>
      <p className="text-sm text-gray-500 mb-6">Configure how bills and purchase orders are imported</p>
      
      {/* Section 1: Pay bills from Tally on Stride */}
      <div className="mb-6">
        <ToggleSwitch 
          enabled={importTallyEnabled} 
          onChange={() => setImportTallyEnabled(!importTallyEnabled)}
          label="Pay bills from Tally on Stride"
        />
      </div>
      
      {/* Section 2: Automatically import Purchase Orders */}
      <div className="mb-6">
        <ToggleSwitch 
          enabled={importPOEnabled} 
          onChange={() => setImportPOEnabled(!importPOEnabled)}
          label="Automatically import Purchase Orders"
        />
      </div>
      
      {/* Section 3: Reconcile Procurement */}
      <div className="mb-6">
        <h4 className="font-medium mb-4">Reconcile Procurement</h4>
        
        <div className="flex space-x-4 mb-4">
          {/* 2-way match card */}
          <div 
            className={`flex-1 border rounded-md p-4 cursor-pointer transition-colors ${
              matchType === '2-way' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setMatchType('2-way')}
            role="radio"
            aria-checked={matchType === '2-way'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMatchType('2-way');
              }
            }}
          >
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                matchType === '2-way' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <ArrowLeftRight size={18} />
              </div>
              <h5 className="font-medium">2-way match</h5>
            </div>
            <p className="text-sm text-gray-600 pl-11">Bills will be matched to imported Purchase Orders</p>
          </div>
          
          {/* 3-way match card */}
          <div 
            className={`flex-1 border rounded-md p-4 cursor-pointer transition-colors ${
              matchType === '3-way' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setMatchType('3-way')}
            role="radio"
            aria-checked={matchType === '3-way'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMatchType('3-way');
              }
            }}
          >
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                matchType === '3-way' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <Box size={18} />
              </div>
              <h5 className="font-medium">3-way match</h5>
            </div>
            <p className="text-sm text-gray-600 pl-11">Bills will be matched to imported POs and Goods Received Notes</p>
          </div>
        </div>
      </div>
      
      {/* Section 4: Overbilling Protection */}
      <div>
        <h4 className="font-medium mb-2">Overbilling Protection</h4>
        <p className="text-sm text-gray-500 mb-4">Alert or block payments when the invoice doesn't match your purchase order</p>
        
        {/* Flag high invoices toggle - always visible */}
        <div className="border rounded-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3 bg-orange-100 rounded-full text-orange-600">
                <Flag size={16} />
              </div>
              <div>
                <p className="font-medium">Flag unexpectedly high invoices</p>
                <p className="text-sm text-gray-500 mt-1">Stride AI will automatically flag unexpectedly high line items to your team</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={flagHighInvoices}
                onChange={() => setFlagHighInvoices(!flagHighInvoices)}
                aria-label="Toggle flag high invoices"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
        
        {/* Block payments toggle and settings */}
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center mr-3 bg-red-100 rounded-full text-red-600">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="font-medium">Block payments for unexpectedly high invoices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={blockHighInvoices}
                onChange={() => setBlockHighInvoices(!blockHighInvoices)}
                aria-label="Toggle block high invoices"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          {/* Threshold inputs - only visible when blockHighInvoices is true */}
          {blockHighInvoices && (
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                {/* Percent threshold input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Percent threshold</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={percentThreshold}
                      onChange={handlePercentChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="10"
                      aria-label="Percent threshold"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">A percentage line items can't exceed in overbilling</p>
                </div>
                
                {/* Amount threshold input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount threshold</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amountThreshold}
                      onChange={handleAmountChange}
                      className="w-full p-2 border border-gray-300 rounded-md pl-7"
                      placeholder="5000"
                      aria-label="Amount threshold"
                    />
                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">An upper limit line items can't exceed in overbilling</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Help section at the bottom */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
        <div className="flex">
          <div className="mr-3 text-yellow-500">
            <Info size={20} />
          </div>
          <div>
            <h5 className="font-medium">Need help with import settings?</h5>
            <p className="text-sm text-gray-600 mt-1">
              These settings control how your bills and POs are imported and matched. Contact our support team if you need assistance with configuring these settings.
            </p>
            <a href="#" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
              Learn more about procurement workflows
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportingTab;