import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Search, User, Calendar } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import RestrictionsDrawer from './RestrictionsDrawer';
import { 
  employees, 
  getFullName, 
  CardStatus, 
  filterByCardStatus 
} from '../utils/employeeData';

// Helper function to update class names in component
const updateFocusClasses = () => {
  // Find all inputs and selects within the component
  const elements = document.querySelectorAll('#physical-card-form input, #physical-card-form select');
  
  // Update each element's focus classes
  elements.forEach(el => {
    el.classList.remove('focus:ring-primary', 'focus:border-primary');
    el.classList.add('focus:ring-black', 'focus:border-black');
  });
};

// Demo office address
const OFFICE_ADDRESS = {
  street: '123 Tech Park, Whitefield',
  unit: 'Floor 12, Suite B',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '560066'
};

/**
 * Physical Card Drawer Component
 * Displays a form for creating a new physical card
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when going back
 * @param {Function} props.onConfirmAddress - Function to call when confirming address
 */
const PhysicalCardDrawer = ({ isOpen, onClose, onBack, onConfirmAddress }) => {
  // Form state
  const [cardholderName, setCardholderName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cardNickname, setCardNickname] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [frequency, setFrequency] = useState('Monthly');
  const [submissionPolicy, setSubmissionPolicy] = useState('');
  const [mailingOption, setMailingOption] = useState('ask_cardholder');
  const [expenseApproval, setExpenseApproval] = useState('');
  
  // Restrictions state
  const [showRestrictionsDrawer, setShowRestrictionsDrawer] = useState(false);
  const [restrictions, setRestrictions] = useState({
    categoryControlType: 'None',
    merchantControlType: 'None',
    selectedMerchants: [],
    selectedCategories: []
  });
  
  // Search and dropdown state
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Address form state
  const [street, setStreet] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Advanced sections state
  const [expandedSections, setExpandedSections] = useState({
    sharing: false,
    controls: false,
    reviews: false,
    payments: false
  });
  
  // Toggle an advanced section
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => {
    if (!searchTerm) return true;
    const fullName = getFullName(employee);
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.role && employee.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Handle employee selection
  const handleSelectEmployee = (employee) => {
    // Only allow selection if the employee doesn't already have a physical card
    if (!employee.hasPhysicalCard) {
      setSelectedEmployee(employee);
      setCardholderName(`${employee.firstName} ${employee.lastName}`);
      setIsDropdownOpen(false);
    }
  };
  
  // State to track if office address is in use
  const [usingOfficeAddress, setUsingOfficeAddress] = useState(false);
  
  // Handle using office address
  const handleUseOfficeAddress = () => {
    setStreet(OFFICE_ADDRESS.street);
    setUnit(OFFICE_ADDRESS.unit);
    setCity(OFFICE_ADDRESS.city);
    setState(OFFICE_ADDRESS.state);
    setZipCode(OFFICE_ADDRESS.zipCode);
    setUsingOfficeAddress(true);
  };
  
  // Handle clearing address fields
  const handleClearAddress = () => {
    setStreet('');
    setUnit('');
    setCity('');
    setState('');
    setZipCode('');
    setUsingOfficeAddress(false);
  };
  
  // Update focus styles when the component is mounted
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        updateFocusClasses();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Only proceed if it's the send_to_address option
    if (mailingOption === 'send_to_address') {
      const addressData = {
        street,
        unit,
        city,
        state,
        zipCode
      };
      
      // Pass data to parent component
      if (onConfirmAddress) {
        onConfirmAddress(cardholderName, addressData);
      } else {
        console.log('Form submitted with address:', addressData);
        onClose();
      }
    } else {
      console.log('Form submitted with ask_cardholder option');
      onClose();
    }
  };

  // Custom back button for header actions
  const headerActions = (
    <button 
      onClick={onBack}
      className="text-gray-500 hover:text-gray-700 flex items-center"
      aria-label="Back"
    >
      <ArrowLeft size={16} className="mr-1" />
      <span>Back</span>
    </button>
  );
  
  // Submit button for footer
  const footerContent = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="physical-card-form"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Continue to Address Confirmation
      </button>
    </div>
  );

  return (
    <>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="New physical card"
        description="Each employee can have one physical card to use across all their virtual cards."
        headerActions={headerActions}
        footer={footerContent}
        width="md:w-1/2"
      >
        <div className="space-y-6">
          <form id="physical-card-form" onSubmit={handleSubmit}>
            {/* Who is it for? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Who is it for? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div 
                  className="w-full border border-gray-300 rounded-md py-2 px-3 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedEmployee ? (
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
                        {selectedEmployee.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</div>
                        <div className="text-xs text-gray-500">{selectedEmployee.role || selectedEmployee.department} • {selectedEmployee.location}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select an employee</span>
                  )}
                  <div className="text-gray-400">
                    {isDropdownOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>
                
                {/* Dropdown options */}
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="py-1">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className={`px-3 py-2 ${employee.hasPhysicalCard ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                          onClick={() => !employee.hasPhysicalCard && handleSelectEmployee(employee)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3 ${employee.hasPhysicalCard ? 'opacity-60' : ''}`}>
                                {employee.avatar}
                              </div>
                              <div className={employee.hasPhysicalCard ? 'opacity-60' : ''}>
                                <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                                <div className="text-xs text-gray-500">{employee.role || employee.department} • {employee.location}</div>
                              </div>
                            </div>
                            {employee.hasPhysicalCard && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                Has physical card
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* What is it for? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What is it for? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                placeholder="Card nickname"
                value={cardNickname}
                onChange={(e) => setCardNickname(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">This will be the card's nickname. Make it descriptive so it's easy to remember.</p>
            </div>
            
            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                {/* Currency */}
                <div className="w-1/4">
                  <select
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                
                {/* Frequency */}
                <div className="w-1/3">
                  <select
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Submission policy */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission policy <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                value={submissionPolicy}
                onChange={(e) => setSubmissionPolicy(e.target.value)}
                required
              >
                <option value="">Select submission policy</option>
                <option value="receipts_required">Receipts required for all transactions</option>
                <option value="receipts_above_threshold">Receipts required above ₹5,000</option>
                <option value="no_receipts">No receipts required</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Defines what will be collected from employees, like receipts, memos, or other fields</p>
            </div>
            
            {/* Mailing address section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3">Mailing address</h3>
              
              {/* Radio options */}
              <div className="space-y-4 mb-4">
                <div className="p-3 border border-gray-200 rounded-lg hover:border-gray-300">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mailing_option"
                      className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                      checked={mailingOption === 'ask_cardholder'}
                      onChange={() => setMailingOption('ask_cardholder')}
                    />
                    <div className="ml-2">
                      <span className="text-sm font-medium text-gray-700 block">
                        {cardholderName ? `Ask ${cardholderName}` : 'Ask cardholder'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        We will send the cardholder a notification asking them where they would like to receive the card.
                      </p>
                    </div>
                  </label>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg hover:border-gray-300">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mailing_option"
                      className={`h-4 w-4 ${mailingOption === 'send_to_address' ? 'text-green-500 focus:ring-green-500' : 'text-black focus:ring-black'} border-gray-300`}
                      checked={mailingOption === 'send_to_address'}
                      onChange={() => setMailingOption('send_to_address')}
                    />
                    <div className="ml-2">
                      <span className="text-sm font-medium text-gray-700 block">Send to address</span>
                      <p className="text-xs text-gray-500 mt-1">
                        We will send the card to a specific address. The cardholder will be notified and can track the card's delivery to that address.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Address form - only show if send_to_address is selected */}
              {mailingOption === 'send_to_address' && (
                <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {/* Street address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="123 Main St"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required={mailingOption === 'send_to_address'}
                    />
                  </div>
                  
                  {/* Flat/Office No. */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flat/Office No.
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="Flat 4B, Tower B"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                  
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="Bangalore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required={mailingOption === 'send_to_address'}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    {/* State */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required={mailingOption === 'send_to_address'}
                      >
                        <option value="">Select state</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    
                    {/* Zip code */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        placeholder="560001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required={mailingOption === 'send_to_address'}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    {usingOfficeAddress ? (
                      <div className="flex w-full items-center justify-between px-3 py-2 bg-green-50 border border-green-500 rounded-md">
                        <span className="text-green-700 text-sm font-medium">Office address applied</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={handleClearAddress}
                          aria-label="Clear office address"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm flex items-center justify-center"
                        onClick={handleUseOfficeAddress}
                      >
                        <User size={16} className="mr-2" />
                        Use office address
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Advanced section */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-800 mb-3">Advanced</h3>
              
              {/* Sharing */}
              <div className="border border-gray-200 rounded-lg mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleSection('sharing')}
                >
                  <span className="font-medium">Sharing</span>
                  {expandedSections.sharing ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.sharing && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">Configure sharing options for this card</p>
                    {/* Sharing options would go here */}
                  </div>
                )}
              </div>
              
              {/* Spending controls and restrictions */}
              <div className="border border-gray-200 rounded-lg mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleSection('controls')}
                >
                  <span className="font-medium">Spending controls and restrictions</span>
                  {expandedSections.controls ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.controls && (
                  <div className="p-4 pt-0 border-t border-gray-200 space-y-5">
                    <p className="text-gray-600 text-sm">Set up controls for spending limits, merchant categories, etc.</p>
                    
                    {/* Restrict categories & merchants */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          Restrict categories & merchants
                          {(restrictions.selectedMerchants.length > 0 || restrictions.categoryControlType !== 'None') 
                            ? ` (${(restrictions.selectedMerchants.length + (restrictions.categoryControlType !== 'None' ? 1 : 0))})`
                            : ' (None)'}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowRestrictionsDrawer(true)}
                        >
                          Add restrictions
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Restrict spending to specific merchant categories or merchants. (optional)</p>
                      
                      {/* Display merchant and category restrictions as tags */}
                      {(restrictions.selectedMerchants.length > 0 || 
                        (restrictions.categoryControlType !== 'None' && restrictions.selectedCategories && restrictions.selectedCategories.length > 0)) && (
                        <div className="mt-2 bg-gray-50 rounded-md p-3">
                          <div className="flex flex-wrap gap-2">
                            {/* Merchant tags */}
                            {restrictions.selectedMerchants.map((merchant, index) => (
                              <div key={`merchant-${index}`} 
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm
                                  ${restrictions.merchantControlType === 'Allowed merchants' 
                                    ? 'bg-green-50 text-green-800' 
                                    : 'bg-red-50 text-red-800'}`}>
                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                                  ${restrictions.merchantControlType === 'Allowed merchants' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'}`}>
                                  {restrictions.merchantControlType === 'Allowed merchants' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                                <span>{merchant}</span>
                              </div>
                            ))}
                            
                            {/* Category tags */}
                            {restrictions.categoryControlType !== 'None' && restrictions.selectedCategories && 
                             restrictions.selectedCategories.map((category, index) => (
                              <div key={`category-${index}`} 
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm
                                  ${restrictions.categoryControlType === 'Allowed categories' 
                                    ? 'bg-green-50 text-green-800' 
                                    : 'bg-red-50 text-red-800'}`}>
                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                                  ${restrictions.categoryControlType === 'Allowed categories' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'}`}>
                                  {restrictions.categoryControlType === 'Allowed categories' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                                <span>{category}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Start date */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Start date (None)</span>
                        <button
                          type="button"
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Only allow spend that happens on or after a certain date (optional)</p>
                    </div>
                    
                    {/* Lock on a certain date */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Lock on a certain date (None)</span>
                        <button
                          type="button"
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Do not allow spend on or after a certain date (optional)</p>
                    </div>
                    
                    {/* Max expense amount */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Max expense amount (None)</span>
                        <input
                          type="number"
                          className="w-24 border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          placeholder="Amount"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Maximum amount allowed per transaction (optional)</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional reviews */}
              <div className="border border-gray-200 rounded-lg mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleSection('reviews')}
                >
                  <span className="font-medium">Additional reviews</span>
                  {expandedSections.reviews ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.reviews && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-2">Set up additional review requirements for this card</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expense approval
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        value={expenseApproval}
                        onChange={(e) => setExpenseApproval(e.target.value)}
                      >
                        <option value="">Select an approval policy</option>
                        <option value="manager_review">Require Manager Review / Default Approval Policy</option>
                        <option value="finance_team">Finance Team Review</option>
                        <option value="department_head">Department Head Approval</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Additional layer of reviews after a transaction takes place.</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment options */}
              <div className="border border-gray-200 rounded-lg mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleSection('payments')}
                >
                  <span className="font-medium">Payment options</span>
                  {expandedSections.payments ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.payments && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">Configure payment methods and schedule</p>
                    {/* Payment options would go here */}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </AppDrawer>
      
      {/* Render the RestrictionsDrawer */}
      {showRestrictionsDrawer && (
        <RestrictionsDrawer
          isOpen={showRestrictionsDrawer}
          onClose={() => setShowRestrictionsDrawer(false)}
          onBack={() => setShowRestrictionsDrawer(false)}
          initialData={restrictions}
          onSave={(updatedRestrictions) => {
            setRestrictions(updatedRestrictions);
            setShowRestrictionsDrawer(false);
          }}
        />
      )}
    </>
  );
};

export default PhysicalCardDrawer;