import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, User, Calendar } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import RestrictionsDrawer from './RestrictionsDrawer';
import SearchableDropdown from './common/SearchableDropdown';
import { 
  employees, 
  getFullName, 
  CardStatus, 
  filterByCardStatus 
} from '../utils/employeeData';

// Helper function to update class names in component
const updateFocusClasses = () => {
  // Find all inputs and selects within the component
  const elements = document.querySelectorAll('#virtual-card-form input, #virtual-card-form select');
  
  // Update each element's focus classes
  elements.forEach(el => {
    el.classList.remove('focus:ring-primary', 'focus:border-primary');
    el.classList.add('focus:ring-black', 'focus:border-black');
  });
};

/**
 * Virtual Card Drawer Component
 * Displays a form for creating a new virtual card
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when going back
 */
const VirtualCardDrawer = ({ isOpen, onClose, onBack }) => {
  // Form state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cardPurpose, setCardPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [frequency, setFrequency] = useState('Monthly'); // Default to Monthly
  const [submissionPolicy, setSubmissionPolicy] = useState('');
  
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
  
  // Advanced sections state
  const [expandedSections, setExpandedSections] = useState({
    sharing: false,
    controls: false,
    reviews: false,
    additionalReviews: false,
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
    // Unlike physical cards, employees can have multiple virtual cards
    setSelectedEmployee(employee);
    setIsDropdownOpen(false);
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
    console.log('Virtual card form submitted');
    onClose();
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
        form="virtual-card-form"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Issue Virtual Card
      </button>
    </div>
  );

  return (
    <>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="New virtual card"
        description="Create a virtual card with fine-tuned controls"
        headerActions={headerActions}
        footer={footerContent}
        width="md:w-1/2"
      >
        <div className="space-y-6">
          <form id="virtual-card-form" onSubmit={handleSubmit}>
            {/* Who will be the owner? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Who will be the owner? <span className="text-red-500">*</span>
              </label>
              <SearchableDropdown
                value={selectedEmployee?.id}
                onChange={(employeeId) => {
                  if (employeeId === null) {
                    setSelectedEmployee(null);
                  } else {
                    const employee = employees.find(e => e.id === employeeId);
                    if (employee) {
                      handleSelectEmployee(employee);
                    }
                  }
                }}
                options={employees}
                placeholder="Select an employee"
                searchPlaceholder="Search employees..."
                formatOption={(employee) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
                        {employee.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                        <div className="text-xs text-gray-500">{employee.role || employee.department} • {employee.location}</div>
                      </div>
                    </div>
                    {employee.hasVirtualCard && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                        Has virtual card
                      </span>
                    )}
                  </div>
                )}
                displayKey={(employee) => `${employee.firstName} ${employee.lastName}`}
                valueKey="id"
                id="employee-select"
              />
            </div>
            
            {/* What is it for? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What is it for?
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                placeholder="Card purpose (optional)"
                value={cardPurpose}
                onChange={(e) => setCardPurpose(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Describe what this virtual card will be used for</p>
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
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
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
                <option value="receipts_above_threshold">Receipts required above $5,000</option>
                <option value="no_receipts">No receipts required</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Defines what will be collected from employees, like receipts, memos, or other fields</p>
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

              {/* Payment reviews */}
              <div className="border border-gray-200 rounded-lg mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleSection('reviews')}
                >
                  <span className="font-medium">Payment reviews</span>
                  {expandedSections.reviews ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.reviews && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-3">Configure payment review settings and approval workflows</p>
                    
                    <div className="space-y-4">
                      {/* Review threshold */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review threshold
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          >
                            <option value="all">All transactions</option>
                            <option value="above">Above threshold</option>
                            <option value="none">No reviews</option>
                          </select>
                          <input
                            type="number"
                            className="w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            placeholder="1000"
                          />
                        </div>
                      </div>
                      
                      {/* Reviewers */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reviewers
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                          multiple
                          size="3"
                        >
                          <option value="finance">Finance team</option>
                          <option value="manager">Direct manager</option>
                          <option value="department">Department head</option>
                          <option value="custom">Custom approver</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple reviewers</p>
                      </div>
                      
                      {/* Review deadline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Review deadline
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        >
                          <option value="24h">24 hours</option>
                          <option value="48h">48 hours</option>
                          <option value="72h">72 hours</option>
                          <option value="1w">1 week</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Time reviewers have to approve transactions</p>
                      </div>
                      
                      {/* Auto-approval */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="auto-approve"
                          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor="auto-approve" className="ml-2 block text-sm text-gray-700">
                          Auto-approve if no response within deadline
                        </label>
                      </div>
                    </div>
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
                    <p className="text-gray-600 text-sm">Set spending limits and merchant category restrictions</p>
                    
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
                  onClick={() => toggleSection('additionalReviews')}
                >
                  <span className="font-medium">Additional reviews</span>
                  {expandedSections.additionalReviews ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>
                
                {expandedSections.additionalReviews && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-2">Set up additional review requirements for this card</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment details
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      >
                        <option value="">None</option>
                        <option value="manager_approval">Manager approval required</option>
                        <option value="finance_approval">Finance approval required</option>
                        <option value="both_approval">Both manager and finance approval required</option>
                      </select>
                    </div>
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

export default VirtualCardDrawer;