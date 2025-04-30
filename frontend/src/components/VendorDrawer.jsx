import React, { useState, useId } from "react";
import { ChevronDown, Upload, CreditCard, FileText } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import AppDrawer from "./common/AppDrawer";
import { Z_INDEX_LEVELS } from "../contexts/DrawerContext";

const VendorDrawer = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onBack,
  zIndex = Z_INDEX_LEVELS.BASE 
}) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `vendor-drawer-${generatedId}`;
  // Initialize notification context
  const { showSuccess } = useNotification();
  
  // Form fields state
  const [vendorName, setVendorName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [vendorOwner, setVendorOwner] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("IN (+91)");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [gstCertificate, setGstCertificate] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [msmeCertificate, setMsmeCertificate] = useState(null);
  const [latestItr, setLatestItr] = useState(null);
  
  // Bank details
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [micrCode, setMicrCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAddressLine1, setBankAddressLine1] = useState("");
  const [branchName, setBranchName] = useState("");
  const [bankAddressLine2, setBankAddressLine2] = useState("");
  const [accountType, setAccountType] = useState("Current");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  
  // Validation state
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    
    if (!vendorName.trim()) {
      newErrors.vendorName = "Vendor name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle file upload
  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const vendorData = {
        vendorName,
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        pinCode,
        vendorOwner,
        firstName,
        lastName,
        email,
        countryCode,
        phone,
        gstin,
        pan,
        gstCertificate,
        panCard,
        msmeCertificate,
        latestItr,
        paymentDetails: {
          paymentMethod,
          accountNumber,
          ifscCode,
          micrCode,
          bankName,
          bankAddressLine1,
          branchName,
          bankAddressLine2,
          accountType,
          accountHolderName
        }
      };
      
      if (onSave) {
        onSave(vendorData);
      }
      
      showSuccess("Vendor created successfully");
      onClose();
    }
  };
  
  // Footer with action buttons
  const footerContent = (
    <div className="flex justify-end space-x-3">
      <button
        className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-md"
        onClick={handleSubmit}
      >
        Create Vendor
      </button>
    </div>
  );
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title="New Vendor"
      description="Fill out the information below to add a new vendor"
      footer={footerContent}
      width="w-1/2"
      zIndex={zIndex}
      contentPadding="p-0" 
      id={drawerId}
    >
      <div className="p-4 h-full overflow-y-auto">
          
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            
            {/* Vendor name field */}
            <div className="mb-4">
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
                (Accounting software) Vendor Name
              </label>
              <input
                id="vendorName"
                type="text"
                className={`w-full border ${errors.vendorName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black`}
                placeholder="Enter vendor name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
              {errors.vendorName && (
                <p className="mt-1 text-sm text-red-500">{errors.vendorName}</p>
              )}
            </div>
            
            {/* Address Line 1 field */}
            <div className="mb-4">
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                id="addressLine1"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                placeholder="Enter address line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>
            
            {/* Address Line 2 field */}
            <div className="mb-4">
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                id="addressLine2"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                placeholder="Enter address line 2"
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
                <div className="relative">
                  <select
                    id="country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="India">India</option>
                    <option value="United States of America">United States of America</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Singapore">Singapore</option>
                    <option value="UAE">UAE</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="relative">
                  <select
                    id="state"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter city"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter PIN code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>
            </div>
            
            {/* Vendor owner field */}
            <div className="mb-4">
              <label htmlFor="vendorOwner" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Owner
              </label>
              <input
                id="vendorOwner"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                placeholder="Assign a vendor owner"
                value={vendorOwner}
                onChange={(e) => setVendorOwner(e.target.value)}
              />
            </div>
          </div>
          
          {/* Vendor Contact Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Vendor Contact</h3>
            
            {/* First and Last name fields (side by side) */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (required)
              </label>
              <input
                id="email"
                type="email"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black`}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Country code and Phone fields (side by side with different widths) */}
            <div className="flex gap-4 mb-4">
              <div className="w-1/4">
                <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <div className="relative">
                  <select
                    id="countryCode"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="IN (+91)">IN (+91)</option>
                    <option value="US (+1)">US (+1)</option>
                    <option value="UK (+44)">UK (+44)</option>
                    <option value="AU (+61)">AU (+61)</option>
                    <option value="CA (+1)">CA (+1)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="w-3/4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Tax Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Tax Details</h3>
            
            {/* GSTIN field with upload button */}
            <div className="mb-4">
              <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                GSTIN
              </label>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <input
                    id="gstin"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                    placeholder="Enter GSTIN"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="gstCertificateUpload" className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload size={16} className="mr-2" />
                    Upload GST Certificate
                    <input
                      id="gstCertificateUpload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, setGstCertificate)}
                    />
                  </label>
                </div>
              </div>
              {gstCertificate && (
                <p className="mt-1 text-sm text-gray-600">
                  File selected: {gstCertificate.name}
                </p>
              )}
            </div>
            
            {/* PAN Number field with upload button */}
            <div className="mb-4">
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <input
                    id="pan"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                    placeholder="Enter PAN number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="panCardUpload" className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload size={16} className="mr-2" />
                    Upload PAN Card
                    <input
                      id="panCardUpload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, setPanCard)}
                    />
                  </label>
                </div>
              </div>
              {panCard && (
                <p className="mt-1 text-sm text-gray-600">
                  File selected: {panCard.name}
                </p>
              )}
            </div>
            
            {/* MSME Certificate upload */}
            <div className="mb-4">
              <label htmlFor="msmeCertificateUpload" className="block text-sm font-medium text-gray-700 mb-1">
                MSME Certificate
              </label>
              <label htmlFor="msmeCertificateUpload" className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload size={16} className="mr-2" />
                Upload MSME Certificate
                <input
                  id="msmeCertificateUpload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, setMsmeCertificate)}
                />
              </label>
              {msmeCertificate && (
                <p className="mt-1 text-sm text-gray-600">
                  File selected: {msmeCertificate.name}
                </p>
              )}
            </div>
            
            {/* Latest ITR upload */}
            <div className="mb-4">
              <label htmlFor="latestItrUpload" className="block text-sm font-medium text-gray-700 mb-1">
                Latest ITR
              </label>
              <label htmlFor="latestItrUpload" className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload size={16} className="mr-2" />
                Upload Latest ITR
                <input
                  id="latestItrUpload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, setLatestItr)}
                />
              </label>
              {latestItr && (
                <p className="mt-1 text-sm text-gray-600">
                  File selected: {latestItr.name}
                </p>
              )}
            </div>
          </div>
          
          {/* Bank Account Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
            
            {/* Payment Method Selection - Using only Enter Manually option */}
            <div className="flex mb-6 border border-gray-200 rounded-md overflow-hidden">
              <button
                className="flex-1 py-3 px-4 bg-gray-100 font-medium"
                onClick={() => handlePaymentMethodChange('bank')}
              >
                <div className="flex items-center justify-center">
                  <CreditCard size={18} className="mr-2" />
                  Enter Manually
                </div>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Account Number */}
              <div className="mb-4">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              
              {/* Confirm Account Number */}
              <div className="mb-4">
                <label htmlFor="confirmAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Account Number
                </label>
                <input
                  id="confirmAccountNumber"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Confirm account number"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                />
              </div>
              
              {/* IFSC Code and MICR code on the same line */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      id="ifscCode"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="Enter IFSC code"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="micrCode" className="block text-sm font-medium text-gray-700 mb-1">
                      MICR Code
                    </label>
                    <input
                      id="micrCode"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="Enter MICR code"
                      value={micrCode}
                      onChange={(e) => setMicrCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bank Name and Address Line 1 */}
              <div className="mb-4">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  id="bankName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black mb-2"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                
                <label htmlFor="bankAddressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  id="bankAddressLine1"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter bank address line 1"
                  value={bankAddressLine1}
                  onChange={(e) => setBankAddressLine1(e.target.value)}
                />
              </div>
              
              {/* Branch Name and Address Line 2 */}
              <div className="mb-4">
                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  id="branchName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black mb-2"
                  placeholder="Enter branch name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
                
                <label htmlFor="bankAddressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  id="bankAddressLine2"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter bank address line 2"
                  value={bankAddressLine2}
                  onChange={(e) => setBankAddressLine2(e.target.value)}
                />
              </div>
              
              {/* Account Type */}
              <div className="mb-4">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    id="accountType"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              {/* Account Holder Name */}
              <div className="mb-4">
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  id="accountHolderName"
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                  placeholder="Enter account holder name"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
    </AppDrawer>
  );
};

export default VendorDrawer;