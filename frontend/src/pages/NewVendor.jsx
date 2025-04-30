import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, ArrowRight, ChevronDown, Building, Calculator, Check } from "lucide-react";
import PaymentDetails from "../components/PaymentDetails";
import TaxDetails from "../components/TaxDetails";
import SharedInvoicePreview from "../components/SharedInvoicePreview";
import VendorReview from "../components/VendorReview";
import { useNotification } from "../contexts/NotificationContext";

const NewVendor = ({ 
  showNewVendor = true, 
  onClose, 
  onVendorCreated, 
  notification: propNotification,
  uploadedInvoice
}) => {
  // Get navigate function from react-router
  const navigate = useNavigate();
  
  // Get notification context if not provided as prop
  const contextNotification = useNotification();
  const notification = propNotification || contextNotification;
  
  // If not showing, return null
  if (!showNewVendor) return null;
  
  // State to track the current page (form or review)
  const [showReview, setShowReview] = useState(false);
  
  // Extract vendor name from the uploaded invoice if available
  const extractedVendorName = uploadedInvoice?.vendorName || "";
  
  // State for vendor information
  const [vendorName, setVendorName] = useState(extractedVendorName);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("IN (+91)");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [vendorOwner, setVendorOwner] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyTypeExpanded, setCompanyTypeExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("general"); // general or bill-accounting
  const [accountingSoftware, setAccountingSoftware] = useState("Tally"); // Default to Tally
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for payment details
  const [paymentDetails, setPaymentDetails] = useState(null);

  // State for tax details
  const [taxOption, setTaxOption] = useState("");
  const [taxDetails, setTaxDetails] = useState(null);
  
  // Additional state for bill accounting tab
  const [defaultCategory, setDefaultCategory] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("net30");
  const [autoApprove, setAutoApprove] = useState(false);
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");

  // References for handling click outside
  const hasShownNotification = useRef(false);
  const companyTypeRef = useRef(null);
  
  // No longer showing notification when component mounts
  // We'll display this info inside the form instead
  useEffect(() => {
    // Mark as shown
    if (showNewVendor && !hasShownNotification.current) {
      hasShownNotification.current = true;
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNewVendor]);
  
  // Handle click outside for company type dropdown
  useEffect(() => {
    if (companyTypeExpanded && companyTypeRef.current) {
      const handleClickOutside = (event) => {
        if (companyTypeRef.current && !companyTypeRef.current.contains(event.target)) {
          setCompanyTypeExpanded(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [companyTypeExpanded]);

  // Handle payment details from the PaymentDetails component
  const handlePaymentDetailsChange = (method, details) => {
    setPaymentMethod(method);
    if (details) {
      setPaymentDetails(details);
    }
  };

  // Handle tax details from the TaxDetails component
  const handleTaxDetailsChange = (option, details) => {
    setTaxOption(option);
    if (details) {
      setTaxDetails(details);
    }
  };

  // Handle form submission from the review page
  const handleCreateVendor = () => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Log created vendor information
      console.log("Creating vendor:", {
        name: vendorName,
        address: {
          addressLine1,
          addressLine2,
          city,
          pinCode,
          country,
          state
        },
        companyType,
        owner: vendorOwner,
        contact: {
          firstName,
          lastName,
          email,
          phone: `${phoneCountry} ${phoneNumber}`
        },
        payment: {
          method: paymentMethod,
          details: paymentDetails
        },
        accounting: {
          software: accountingSoftware,
          defaultCategory: defaultCategory,
          paymentTerms: paymentTerms,
          autoApprove: autoApprove
        },
        tax: {
          option: taxOption,
          details: taxDetails,
          gstin: gstin,
          pan: pan
        }
      });
      
      // Show success notification
      notification.showSuccess('Vendor created successfully!', {
        autoClose: true,
        duration: 3000
      });
      
      // Navigate to vendor-review page first as part of the corrected flow
      console.log("Navigating to vendor-review page as part of the vendor creation flow");
      // Ensure formData is defined before using it in navigation
      const vendorDataToPass = formData || {
        vendorName,
        addressLine1,
        addressLine2,
        city,
        pinCode,
        country, 
        state,
        vendorOwner,
        firstName,
        lastName,
        email,
        phoneCountry,
        phoneNumber,
        accountingSoftware,
        paymentMethod,
        paymentDetails,
        taxOption,
        taxDetails,
        gstin,
        pan
      };
      
      // Fixed: Navigate to vendor-review FIRST instead of directly to create-bill
      console.log("FIXED NAVIGATION: Going to vendor-review first");
      navigate("/vendor-review", { 
        state: { 
          formData: vendorDataToPass,
          uploadedInvoice: uploadedInvoice || null,
          timestamp: new Date().toISOString(),
          sourceRoute: "newVendor"
        } 
      });
      
      // Reset submitting state
      setIsSubmitting(false);
      
      // Since we're navigating to vendor-review, we don't need to
      // call onVendorCreated or onClose callbacks from the parent component
    }, 1500);
  };

  // Go back from review page to form
  const handleBackToForm = () => {
    setShowReview(false);
  };

  // Handle discarding changes and return to New Bill page
  const handleDiscard = () => {
    console.log("Discarding changes and returning to NewBill");
    if (onClose) {
      // Call onClose which will handle returning to the New Bill page
      // This is wired up in App.jsx to show the NewBill component after closing
      onClose();
    }
  };

  // Prepare form data object for the review page
  const formData = {
    vendorName,
    addressLine1,
    addressLine2,
    city,
    pinCode,
    country,
    state,
    vendorOwner,
    firstName,
    lastName,
    email,
    phoneCountry,
    phoneNumber,
    accountingSoftware,
    paymentMethod,
    paymentDetails,
    taxOption,
    taxDetails
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {showReview ? (
        <VendorReview 
          formData={formData}
          uploadedInvoice={uploadedInvoice}
          onBack={handleBackToForm}
          onContinue={handleCreateVendor}
          isSubmitting={isSubmitting}
          sourceRoute="newVendor" // Explicitly set the source route to ensure correct button text ("Create vendor")
        />
      ) : (
        <>
          {/* Use the shared invoice preview component */}
          <SharedInvoicePreview uploadedInvoice={uploadedInvoice} />
          
          {/* Right side - Vendor Form */}
          <div className="w-1/2 flex flex-col">
            {/* Header with back button and title */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="mr-2 text-gray-600 hover:text-gray-900"
                  onClick={handleDiscard}
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">New vendor</h2>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleDiscard}
              >
                <X size={20} />
              </button>
            </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button 
              className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('general')}
            >
              <Building size={18} className="mr-2" />
              General
            </button>
            <button 
              className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'bill-accounting' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('bill-accounting')}
            >
              <Calculator size={18} className="mr-2" />
              Bill accounting
            </button>
          </div>
        </div>
        
        {/* Form content */}
        <div className="flex-grow overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div>
              {/* Basic info section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Basic info</h3>
                
                {/* Using the context-based notifications instead of hardcoded box */}
                
                {/* Vendor name field */}
                <div className="mb-4 relative">
                  <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
                    {accountingSoftware} Vendor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="vendorName"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="select"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400" />
                  </div>
                  
                  {/* Information box below the Tally Vendor field */}
                  <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-800">
                    We verified the vendor from the invoice you provided, but couldn't find them on {accountingSoftware}. We will create a new vendor for you.
                  </div>
                </div>

                {/* Address line 1 field */}
                <div className="mb-4">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                    placeholder="Street address, building number"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </div>

                {/* Address line 2 field */}
                <div className="mb-4">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                    Address line 2 <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                    placeholder="Apartment, suite, unit, etc."
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>
                
                {/* City and PIN Code fields (side by side) */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="Enter city name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pinCode"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="6-digit PIN code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Country and State fields (side by side) */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
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
                        <option value="China">China</option>
                        <option value="Japan">Japan</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Singapore">Singapore</option>
                        <option value="UAE">UAE</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">select</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                {/* Company Type field - styled like Payment Details */}
                <div className="mb-4">
                  <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1">
                    Company type
                  </label>
                  <div className="relative" ref={companyTypeRef}>
                    <div 
                      className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 ${companyTypeExpanded ? 'rounded-t-md' : 'rounded-md'} bg-white cursor-pointer hover:border-gray-400`}
                      onClick={() => setCompanyTypeExpanded(!companyTypeExpanded)}
                    >
                      <span className={`${companyType ? 'text-gray-800' : 'text-gray-400'}`}>
                        {companyType || "Select company type"}
                      </span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${companyTypeExpanded ? 'transform rotate-180' : ''}`} />
                    </div>
                    
                    {/* Dropdown menu */}
                    {companyTypeExpanded && (
                      <div className="absolute z-[1000] bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg overflow-visible w-full">
                        {[
                          "One Person Company",
                          "Sole proprietorship", 
                          "Private Limited Company", 
                          "Public Limited Company", 
                          "Limited Liability Company"
                        ].map((type) => (
                          <div 
                            key={type} 
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                            onClick={() => {
                              setCompanyType(type);
                              setCompanyTypeExpanded(false);
                            }}
                          >
                            <span className="text-gray-800">{type}</span>
                            {companyType === type && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Vendor owner field */}
                <div className="mb-4">
                  <label htmlFor="vendorOwner" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor owner
                  </label>
                  <div className="relative">
                    <select
                      id="vendorOwner"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                      value={vendorOwner}
                      onChange={(e) => setVendorOwner(e.target.value)}
                    >
                      <option value="">Select vendor owner</option>
                      <option value="David Wallace">David Wallace</option>
                      <option value="Michael Scott">Michael Scott</option>
                      <option value="Jim Halpert">Jim Halpert</option>
                      <option value="Pam Beesly">Pam Beesly</option>
                      <option value="Dwight Schrute">Dwight Schrute</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Stride requires a single employee to own each vendor to provide accountability for all spend</p>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Vendor contact section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Vendor contact</h3>
                
                {/* First and Last name fields (side by side) */}
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Email field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {/* Phone with country code */}
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <div className="flex gap-2">
                    <div className="w-1/3 relative">
                      <select
                        id="phoneCountry"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                      >
                        <option value="IN (+91)">IN (+91)</option>
                        <option value="US (+1)">US (+1)</option>
                        <option value="UK (+44)">UK (+44)</option>
                        <option value="AU (+61)">AU (+61)</option>
                        <option value="CA (+1)">CA (+1)</option>
                        <option value="CN (+86)">CN (+86)</option>
                        <option value="DE (+49)">DE (+49)</option>
                        <option value="FR (+33)">FR (+33)</option>
                        <option value="JP (+81)">JP (+81)</option>
                        <option value="SG (+65)">SG (+65)</option>
                        <option value="AE (+971)">AE (+971)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      className="w-2/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-black"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment details section */}
              <PaymentDetails onPaymentMethodChange={handlePaymentDetailsChange} />
              
              {/* Tax Details section */}
              <TaxDetails 
                onTaxDetailsChange={handleTaxDetailsChange} 
                country={country} 
              />
            </div>
          )}
          
          {activeTab === 'bill-accounting' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Bill accounting information</h3>
              <p className="text-gray-600 mb-6">Configure how bills from this vendor will be processed and categorized in your accounting system.</p>
              
              {/* Accounting software integration */}
              <div className="mb-6">
                <label htmlFor="accountingSoftware" className="block text-sm font-medium text-gray-700 mb-1">
                  Accounting software
                </label>
                <div className="relative">
                  <select
                    id="accountingSoftware"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={accountingSoftware}
                    onChange={(e) => setAccountingSoftware(e.target.value)}
                  >
                    <option value="">Select accounting software</option>
                    <option value="Tally">Tally</option>
                    <option value="Zoho Books">Zoho Books</option>
                    <option value="QuickBooks">QuickBooks</option>
                    <option value="SAP">SAP</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Vendor information will be synchronized with your accounting software</p>
              </div>
              
              {/* Default expense category */}
              <div className="mb-6">
                <label htmlFor="defaultCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Default expense category
                </label>
                <div className="relative">
                  <select
                    id="defaultCategory"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                  >
                    <option value="">Select a default category</option>
                    <option value="office_supplies">Office Supplies</option>
                    <option value="software">Software Subscription</option>
                    <option value="travel">Travel</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Bills from this vendor will default to this category unless changed</p>
              </div>

              {/* Payment terms */}
              <div className="mb-6">
                <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment terms
                </label>
                <div className="relative">
                  <select
                    id="paymentTerms"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-0 focus:border-black"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                  >
                    <option value="net15">Net 15</option>
                    <option value="net30">Net 30</option>
                    <option value="net45">Net 45</option>
                    <option value="net60">Net 60</option>
                    <option value="due_on_receipt">Due on Receipt</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Default payment terms for bills from this vendor</p>
              </div>

              {/* Auto-approve toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-approve bills
                </label>
                <div className="mt-1 flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="autoApprove"
                      id="autoApprove"
                      className="sr-only"
                      checked={autoApprove}
                      onChange={() => setAutoApprove(!autoApprove)}
                    />
                    <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                    <div
                      className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition ${
                        autoApprove ? "transform translate-x-4 bg-primary" : "bg-white"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-900">{autoApprove ? "On" : "Off"}</span>
                    <p className="text-gray-500 text-xs mt-1">Automatically approve bills from this vendor without manual review</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={handleDiscard}
          >
            Discard changes
          </button>
          <button 
            className={`px-4 py-2 ${isSubmitting ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 flex items-center`}
            onClick={() => {
              // Basic validation
              if (!vendorName) {
                alert("Vendor name is required");
                return;
              }
              
              if (!email) {
                alert("Email is required");
                return;
              }
              
              if (!addressLine1) {
                alert("Address line 1 is required");
                return;
              }
              
              if (!city) {
                alert("City is required");
                return;
              }
              
              if (!pinCode) {
                alert("PIN code is required");
                return;
              }
              
              if (!state) {
                alert("State is required");
                return;
              }
              
              // Navigate to vendor review page instead of directly creating vendor
              // and proceeding to create bill page
              setShowReview(true);
            }}
            disabled={isSubmitting}
          >
            <div className="flex items-center">
              Continue
              <ArrowRight size={16} className="ml-2" />
            </div>
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default NewVendor;
