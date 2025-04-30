// src/components/PaymentDetails.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Mail, User, Ban } from "lucide-react";

const PaymentDetails = ({ onPaymentMethodChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [displayName, setDisplayName] = useState("Add payment details");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  
  // Bank details form state
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    branchName: "",
    accountNumber: "",
    accountType: "",
    ifscCode: "",
    micrCode: "",
    accountHolderName: ""
  });
  
  // Update dropdown position when expanded
  useEffect(() => {
    if (expanded && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
      
      // Add click outside handler
      const handleClickOutside = (event) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target)) {
          // Check if the click target is not part of the dropdown content
          if (!event.target.closest('.dropdown-menu')) {
            setExpanded(false);
          }
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [expanded]);

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDisplayName(option);
    setExpanded(false);
    
    // Pass the selection to parent component if callback exists
    if (onPaymentMethodChange) {
      onPaymentMethodChange(option);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    
    // Pass the selected payment method to parent component if callback exists
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };
  
  // Handle changes to bank details form fields
  const handleBankDetailsChange = (field, value) => {
    const updatedBankDetails = {
      ...bankDetails,
      [field]: value
    };
    
    setBankDetails(updatedBankDetails);
    
    // Pass bank details to parent component if callback exists
    if (onPaymentMethodChange) {
      onPaymentMethodChange("Bank Transfer", updatedBankDetails);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-2">Payment details</h3>
      
      {/* Main dropdown button styled to match the design in screenshots */}
      <div className="relative">
        <div 
          ref={triggerRef}
          className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 ${expanded ? 'rounded-t-md' : 'rounded-md'} bg-white cursor-pointer hover:border-gray-400`}
          onClick={toggleDropdown}
        >
          <span className={`${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
            {displayName}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
        </div>
        
        {/* Dropdown menu - styled to match the design from the screenshots */}
        {expanded && (
          <div 
            className="dropdown-menu fixed z-[1000] bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg overflow-visible"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}>
            {/* Request from the vendor option */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Request from the vendor")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="request-vendor" 
                    name="payment-option" 
                    checked={selectedOption === "Request from the vendor"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <Mail 
                    size={18} 
                    className="text-black" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="request-vendor" className="cursor-pointer flex-1">
                  <div className="font-medium text-gray-800">Request from the vendor</div>
                  <div className="text-sm text-gray-500">Stride will email the vendor for their payment method and account details</div>
                </label>
                {selectedOption === "Request from the vendor" && (
                  <Check size={16} className="text-black mt-1" />
                )}
              </div>
            </div>
            
            {/* Enter manually option */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Enter manually")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="enter-manually" 
                    name="payment-option" 
                    checked={selectedOption === "Enter manually"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <User 
                    size={18} 
                    className="text-black" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="enter-manually" className="cursor-pointer flex-1">
                  <div className="font-medium text-gray-800">Enter manually</div>
                  <div className="text-sm text-gray-500">Choose a payment method and enter account details yourself</div>
                </label>
                {selectedOption === "Enter manually" && (
                  <Check size={16} className="text-black mt-1" />
                )}
              </div>
            </div>
            
            {/* Separator line before Skip for now */}
            <div className="border-t border-gray-300"></div>
            
            {/* Skip for now option */}
            <div className="px-4 py-3 bg-gray-100">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Skip for now")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="skip-for-now" 
                    name="payment-option" 
                    checked={selectedOption === "Skip for now"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <Ban 
                    size={18} 
                    className="text-maroon-600" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="skip-for-now" className="cursor-pointer flex-1">
                  <div className="font-medium text-maroon-600">Skip for now</div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* When "Enter manually" is selected and dropdown is closed, show bank details entry fields */}
      {selectedOption === "Enter manually" && !expanded && (
        <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="text-gray-800 font-medium">Add payment details</div>
          <div className="mt-3 space-y-3">
            {/* Bank name and Branch name (on same line) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700 mb-1">Bank name</label>
                <input 
                  id="bank-name"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="branch-name" className="block text-sm font-medium text-gray-700 mb-1">Branch name</label>
                <input 
                  id="branch-name"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  placeholder="Enter branch name"
                  value={bankDetails.branchName}
                  onChange={(e) => handleBankDetailsChange('branchName', e.target.value)}
                />
              </div>
            </div>
            
            {/* Bank account number and Account type (on same line) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="account-number" className="block text-sm font-medium text-gray-700 mb-1">Bank account number</label>
                <input 
                  id="account-number"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-1">Account type</label>
                <select 
                  id="account-type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  value={bankDetails.accountType}
                  onChange={(e) => handleBankDetailsChange('accountType', e.target.value)}
                >
                  <option value="">Select account type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
            </div>
            
            {/* IFSC code and MICR code (on same line) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ifsc-code" className="block text-sm font-medium text-gray-700 mb-1">IFSC code</label>
                <input 
                  id="ifsc-code"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="micr-code" className="block text-sm font-medium text-gray-700 mb-1">MICR code</label>
                <input 
                  id="micr-code"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                  placeholder="Enter MICR code"
                  value={bankDetails.micrCode}
                  onChange={(e) => handleBankDetailsChange('micrCode', e.target.value)}
                />
              </div>
            </div>
            
            {/* Bank account holder name */}
            <div>
              <label htmlFor="account-holder" className="block text-sm font-medium text-gray-700 mb-1">Bank account holder name</label>
              <input 
                id="account-holder"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                placeholder="Enter account holder's name"
                value={bankDetails.accountHolderName}
                onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* When "Request from the vendor" is selected and dropdown is closed, show info message */}
      {selectedOption === "Request from the vendor" && !expanded && (
        <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="flex items-start">
            <Mail size={18} className="mr-3 text-black mt-1" strokeWidth={1.5} />
            <div>
              <div className="text-gray-800 font-medium">Request from the vendor</div>
              <div className="text-sm text-gray-500">
                Stride will email the vendor for their payment method and account details
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;