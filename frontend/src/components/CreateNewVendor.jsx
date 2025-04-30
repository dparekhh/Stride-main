// src/components/CreateNewVendor.jsx
import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight, Building, CircleCheck, Calculator } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";

const CreateNewVendor = ({ 
  showCreateVendor, 
  setShowCreateVendor, 
  uploadedInvoice, 
  onVendorCreated = () => {} 
}) => {
  // Basic vendor information state
  const [vendorName, setVendorName] = useState("[insert: Vendor Name]");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [vendorOwner, setVendorOwner] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [activeTab, setActiveTab] = useState("general"); // general or accounting
  const [accountingSoftware, setAccountingSoftware] = useState("[insert: User Accounting Software Name]");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get notification context
  const { showSuccess, showError } = useNotification();

  // Handle saving the vendor
  const handleSaveVendor = () => {
    setIsSubmitting(true);
    
    // Validate required fields
    if (!vendorName || vendorName === "[insert: Vendor Name]") {
      showError("Please enter a valid vendor name");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Reset submitting state
      setIsSubmitting(false);
      
      // Show success notification
      showSuccess("Vendor created successfully!");
      
      // Call the onVendorCreated callback
      onVendorCreated({
        name: vendorName,
        addressLine1,
        addressLine2,
        city,
        pinCode,
        country,
        state,
        companyType,
        vendorOwner
      });
      
      // Close the modal
      setShowCreateVendor(false);
    }, 1500);
  };
  
  // If not showing, return null
  if (!showCreateVendor) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Left side - Invoice Preview */}
      <div className="w-1/2 p-6 bg-gray-50 border-r overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Invoice Preview</h3>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-[calc(100%-60px)] overflow-y-auto">
          {/* Sample invoice preview content */}
          <div className="mx-auto">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold uppercase mb-1">MAKE CHECKS PAYABLE TO:</p>
                  <p className="font-medium text-pink-700">Jefferson Healthcare</p>
                  <p>834 SHERIDAN</p>
                  <p>PORT TOWNSEND, WA 98368-2443</p>
                </div>
                <div>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    <div className="border border-gray-300 p-1 flex items-center justify-center bg-red-100">
                      <span className="text-xs">C</span>
                    </div>
                    <div className="border border-gray-300 p-1 flex items-center justify-center bg-yellow-100">
                      <span className="text-xs">V</span>
                    </div>
                    <div className="border border-gray-300 p-1 flex items-center justify-center bg-blue-100">
                      <span className="text-xs">U</span>
                    </div>
                    <div className="border border-gray-300 p-1 flex items-center justify-center bg-green-100">
                      <span className="text-xs">A</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">PAYMENT BY MASTERCARD, VISA, DISCOVER, OR AM EXPRESS, PAY ON-LINE</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs">PHONE:</span>
                  <span className="text-xs">(360) 385-2200</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">PAGE:</span>
                  <span className="text-xs">1 of 1</span>
                </div>
              </div>
            </div>
            
            <table className="w-full border text-sm mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">DATE</th>
                  <th className="border p-2 text-left">EXPLANATION OF ACTIVITY</th>
                  <th className="border p-2 text-center">CHARGES</th>
                  <th className="border p-2 text-center">PAYMENTS</th>
                  <th className="border p-2 text-center">PATIENT DUE</th>
                </tr>
              </thead>
              <tbody className="bg-pink-50">
                <tr>
                  <td className="border p-2">02/09/12</td>
                  <td className="border p-2">Previous Balance</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right">-35.00</td>
                  <td className="border p-2 text-right">78.65</td>
                </tr>
                <tr>
                  <td className="border p-2">03/09/12</td>
                  <td className="border p-2">Balance Forward</td>
                  <td className="border p-2 text-right">7349.85</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right"></td>
                </tr>
                <tr>
                  <td className="border p-2">03/09/12</td>
                  <td className="border p-2">PAYMENT CHECK 1313</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right"></td>
                </tr>
                <tr>
                  <td className="border p-2"></td>
                  <td className="border p-2">Payments to date:</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right">0.00</td>
                  <td className="border p-2 text-right"></td>
                </tr>
                <tr>
                  <td className="border p-2"></td>
                  <td className="border p-2">Balance to date:</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right">2512.04</td>
                </tr>
                <tr>
                  <td className="border p-2"></td>
                  <td className="border p-2">Insurance Pending:</td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right"></td>
                  <td className="border p-2 text-right">4698.16</td>
                </tr>
              </tbody>
            </table>
            
            <div className="text-center mt-8">
              <div className="inline-block border-t border-b border-gray-800 py-1 px-4">
                <p className="font-mono text-xs">IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Vendor Form */}
      <div className="w-1/2 flex flex-col">
        {/* Header with back button and title */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button 
            className="mr-4 text-gray-600 hover:text-gray-900"
            onClick={() => setShowCreateVendor(false)}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">New vendor</h2>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button 
              className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('general')}
            >
              <Building size={18} className="mr-2" />
              General
            </button>
            <button 
              className={`flex items-center py-4 px-2 ml-8 border-b-2 font-medium text-sm ${activeTab === 'accounting' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('accounting')}
            >
              <Calculator size={18} className="mr-2" />
              Accounting
            </button>
          </div>
        </div>
        
        {/* Form content */}
        <div className="flex-grow overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div>
              {/* Basic info section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Basic info</h3>
                
                {/* Notification box */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6 shadow-sm">
                  <div className="flex">
                    <CircleCheck size={20} className="text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <p>Creating a vendor from this invoice</p>
                      <p className="text-gray-600 text-sm mt-1">
                        We identified {vendorName} from the invoice you provided, but
                        couldn't find them in {accountingSoftware}. We will create
                        a new vendor for you, or you can manage the {accountingSoftware} vendor below.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Vendor name field */}
                <div className="mb-4">
                  <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="vendorName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                  />
                </div>

                {/* Address line 1 field */}
                <div className="mb-4">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address line 1
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>

                {/* Address line 2 field */}
                <div className="mb-4">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                    Address line 2 (optional)
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>
                
                {/* Country and State fields (side by side) */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      <option value="">Select a state</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                </div>

                {/* City and PIN Code fields (side by side) */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      id="pinCode"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Company Type field with radio buttons */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company type
                  </label>
                  <div className="space-y-2">
                    {[
                      "One Person Company",
                      "Sole proprietorship",
                      "Private Limited Company",
                      "Public Limited Company",
                      "Limited Liability Company"
                    ].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`company-type-${type}`}
                          name="companyType"
                          type="radio"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          value={type}
                          checked={companyType === type}
                          onChange={() => setCompanyType(type)}
                        />
                        <label htmlFor={`company-type-${type}`} className="ml-2 block text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Vendor owner field */}
                <div className="mb-4">
                  <label htmlFor="vendorOwner" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor owner
                  </label>
                  <select
                    id="vendorOwner"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={vendorOwner}
                    onChange={(e) => setVendorOwner(e.target.value)}
                  >
                    <option value="">No owner selected</option>
                    <option value="user1">John Doe</option>
                    <option value="user2">Jane Smith</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'accounting' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Accounting information</h3>
              {/* Add accounting tab content here */}
            </div>
          )}
        </div>
        
        {/* Fixed bottom buttons */}
        <div className="border-t border-gray-200 p-4 bg-white flex justify-between items-center">
          <button 
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
            onClick={() => setShowCreateVendor(false)}
            disabled={isSubmitting}
          >
            Discard changes
          </button>
          <button 
            className={`px-4 py-2 ${isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={handleSaveVendor}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewVendor;