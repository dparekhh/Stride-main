import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, X, Search, Filter, Download, Grid, Copy, ChevronDown, ChevronUp, 
  RefreshCw, ChevronRight, Mail, UserPlus, Check, AlertTriangle, Send 
} from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import EmployeeReview from './EmployeeReview';

/**
 * InvitePeopleHRIS component for inviting employees from connected HRIS
 * 
 * This component is a sibling drawer to ConnectHRISDrawer, managed by InvitePeopleDrawer.
 * It opens when a user clicks "Invite people" after connecting an HRIS.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {function} props.onClose - Function to close the drawer
 * @param {function} props.onBack - Function to go back to the parent drawer
 * @param {Object} props.connectedHRIS - The connected HRIS information
 */
const InvitePeopleHRIS = ({ isOpen, onClose, onBack, connectedHRIS }) => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('invite');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [customFieldsExpanded, setCustomFieldsExpanded] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [showSyncMessage, setShowSyncMessage] = useState(true);
  const [terminatedEmployees, setTerminatedEmployees] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    role: '',
    manager: '',
    department: '',
    location: '',
    customMessage: ''
  });

  // Reference for filter dropdown
  const filterMenuRef = useRef(null);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset review page when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setShowReviewPage(false);
    }
  }, [isOpen]);

  // Mock employees data - this would come from the connected HRIS API
  const mockEmployees = {
    invite: [
      { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@company.com', role: 'Software Developer', department: 'Engineering', office: 'Bangalore' },
      { id: 2, name: 'Priya Patel', email: 'priya.patel@company.com', role: 'Product Manager', department: 'Product', office: 'Mumbai' },
      { id: 3, name: 'Ajay Kumar', email: 'ajay.kumar@company.com', role: 'QA Engineer', department: 'Engineering', office: 'Pune' },
      { id: 4, name: 'Sneha Desai', email: 'sneha.desai@company.com', role: 'Designer', department: 'Design', office: 'Delhi' },
      { id: 5, name: 'Vikram Singh', email: 'vikram.singh@company.com', role: 'DevOps Engineer', department: 'Engineering', office: 'Hyderabad' },
      { id: 6, name: 'Neha Gupta', email: 'neha.gupta@company.com', role: 'Software Developer', department: 'Engineering', office: 'Bangalore' },
      { id: 7, name: 'Amit Verma', email: 'amit.verma@company.com', role: 'Product Manager', department: 'Product', office: 'Mumbai' },
      { id: 8, name: 'Deepika Reddy', email: 'deepika.reddy@company.com', role: 'Designer', department: 'Design', office: 'Bangalore' },
      { id: 9, name: 'Rajesh Tiwari', email: 'rajesh.tiwari@company.com', role: 'QA Engineer', department: 'Engineering', office: 'Delhi' },
      { id: 10, name: 'Kavita Joshi', email: 'kavita.joshi@company.com', role: 'Software Developer', department: 'Engineering', office: 'Mumbai' }
    ],
    pending: [
      { id: 11, name: 'Sanjay Mehta', email: 'sanjay.mehta@company.com', role: 'Software Developer', department: 'Engineering', office: 'Bangalore', invited: '2023-10-15' }
    ],
    terminated: [
      { id: 12, name: 'Rohan Das', email: 'rohan.das@company.com', role: 'Product Manager', department: 'Product', office: 'Delhi', terminated: '2023-09-30' },
      { id: 13, name: 'Meera Shah', email: 'meera.shah@company.com', role: 'Designer', department: 'Design', office: 'Mumbai', terminated: '2023-09-25' }
    ]
  };

  // Filter options
  const filterOptions = {
    role: ['Software Developer', 'Product Manager', 'Designer', 'QA Engineer', 'DevOps Engineer'],
    manager: ['Ankit Sharma', 'Preeti Gupta', 'Vijay Malhotra', 'Sneha Patel'],
    department: ['Engineering', 'Product', 'Design', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales'],
    location: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata']
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Get the appropriate data based on the active tab
  const getActiveTabData = () => {
    switch (activeTab) {
      case 'terminated':
        return mockEmployees.terminated;
      case 'pending':
        return mockEmployees.pending;
      case 'invite':
      default:
        return mockEmployees.invite;
    }
  };

  // Filter employees based on search query and applied filters
  const filteredEmployees = getActiveTabData().filter(employee => {
    // Filter by search query
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          employee.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by applied filters
    const matchesFilters = Object.entries(appliedFilters).every(([key, value]) => {
      if (key === 'role') return employee.role === value;
      if (key === 'department') return employee.department === value;
      if (key === 'location') return employee.office === value;
      return true; // Default case for manager (not in the mock data)
    });

    return matchesSearch && matchesFilters;
  });

  // Handle employee selection
  const handleEmployeeSelect = (id) => {
    setSelectedEmployees(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(employeeId => employeeId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEmployees([]);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterMenu(!showFilterMenu);
    setActiveFilter(null);
  };

  // Handle filter option click
  const handleFilterOptionClick = (option) => {
    setActiveFilter(option);
  };

  // Handle filter value selection
  const handleFilterValueSelect = (option, value) => {
    setAppliedFilters({
      ...appliedFilters,
      [option]: value
    });
    setShowFilterMenu(false);
    setActiveFilter(null);
  };

  // Clear a specific filter
  const clearFilter = (filterKey) => {
    const updatedFilters = { ...appliedFilters };
    delete updatedFilters[filterKey];
    setAppliedFilters(updatedFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setAppliedFilters({});
  };

  // Handle review button click
  const handleReviewClick = () => {
    setShowReviewPage(true);
  };

  // Handle send invite button click
  const handleSendInviteClick = () => {
    // Logic to send invite would go here
    console.log(`Sending invites to ${selectedEmployees.length} employees`);
  };

  // Check if all required fields are filled in the review page
  const areAllFieldsValid = () => {
    return (
      employeeDetails.role &&
      employeeDetails.manager &&
      employeeDetails.department &&
      employeeDetails.location
    );
  };

  // Footer content - changes based on active tab
  const footerContent = (
    <div className="flex justify-between items-center">
      {activeTab === 'pending' ? (
        <>
          <span className="text-gray-600 font-medium">
            {selectedEmployees.length} selected
          </span>
          <button
            onClick={handleSendInviteClick}
            disabled={selectedEmployees.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedEmployees.length > 0
                ? "bg-[#FF6B00] text-white hover:bg-[#e56100]"
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
            aria-disabled={selectedEmployees.length === 0}
          >
            Send invite
          </button>
        </>
      ) : (
        <>
          <span className="text-gray-600 font-medium">
            Review {selectedEmployees.length} invites
          </span>
          <button
            onClick={handleReviewClick}
            disabled={selectedEmployees.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedEmployees.length > 0
                ? "bg-[#FF6B00] text-white hover:bg-[#e56100]"
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
            aria-disabled={selectedEmployees.length === 0}
          >
            Review
          </button>
        </>
      )}
    </div>
  );

  // Header actions
  const headerActions = (
    <button 
      onClick={onBack}
      className="text-gray-500 hover:text-gray-700 flex items-center"
      aria-label="Go back to HRIS selection"
    >
      <ArrowLeft size={16} className="mr-1" />
      <span>Back</span>
    </button>
  );

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Function to handle copying email to clipboard
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    // You could add a toast notification here
  };

  // Using a higher z-index to ensure this drawer appears on top of the parent drawer
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={showReviewPage ? "Review employees" : "Team updates"}
      headerActions={showReviewPage ? 
        <button 
          onClick={() => setShowReviewPage(false)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
          aria-label="Go back to employees list"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button> 
        : headerActions
      }
      footer={showReviewPage ? 
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-gray-600 font-medium mr-3">
              {selectedEmployees.length} employees selected
            </span>
            {!areAllFieldsValid() && (
              <div className="flex items-center bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs">
                <AlertTriangle size={12} className="mr-1" />
                Missing fields
              </div>
            )}
          </div>
          <button
            onClick={handleSendInviteClick}
            disabled={!areAllFieldsValid()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              areAllFieldsValid()
                ? "bg-[#FF6B00] text-white hover:bg-[#e56100]"
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
          >
            Send {selectedEmployees.length} invites
          </button>
        </div> 
        : footerContent
      }
      width="md:w-1/2"
      zIndex={60} // Higher than the default 50 to appear on top
      description={showReviewPage ? 
        "Review and configure employee details before sending invites" 
        : (connectedHRIS ? `Sync employees from ${connectedHRIS.name}` : "Manage employee data from your HRIS")
      }
    >
      {showReviewPage ? (
        <EmployeeReview
          selectedEmployees={getActiveTabData().filter(employee => selectedEmployees.includes(employee.id))}
          initialEmployeeDetails={employeeDetails}
          onClose={onClose}
          onBack={() => setShowReviewPage(false)}
          onSendInvites={handleSendInviteClick}
          filterOptions={filterOptions}
        />
      ) : (
        <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => handleTabChange('invite')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'invite'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            To invite (10)
          </button>
          <button
            onClick={() => handleTabChange('terminated')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'terminated'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Terminated
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending (1)
          </button>
        </div>

        {/* Sync Settings Section */}
        {/* Auto-sync notification - only shown in "To invite" tab */}
        {activeTab === 'invite' && showSyncMessage && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 relative">
            <button 
              onClick={() => setShowSyncMessage(false)} 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close message"
            >
              <X size={16} />
            </button>
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <RefreshCw size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">Automatically sync your organizational changes to Stride?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Changes to an employee's role, manager, location and department will be reflected in Stride.
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => setAutoSync(!autoSync)}
                    aria-pressed={autoSync}
                    aria-label={`Auto sync is ${autoSync ? 'enabled' : 'disabled'}`}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                      autoSync ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        autoSync ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Show terminated accounts message in the Terminated tab */}
        {activeTab === 'terminated' && mockEmployees.terminated.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 relative">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <AlertTriangle size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">{mockEmployees.terminated.length} accounts marked as terminated in your HRIS</h3>
                <p className="text-gray-600 text-sm">
                  These accounts will be automatically deactivated in Stride
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              aria-label="Search employees"
            />
          </div>
          <div className="flex items-center space-x-3">
            {/* Filter Button with Dropdown */}
            <div className="relative" ref={filterMenuRef}>
              <button 
                onClick={handleFilterClick}
                className={`px-3 py-2 border ${showFilterMenu ? 'border-primary bg-blue-50' : 'border-gray-200'} rounded-md shadow-sm flex items-center text-gray-700 hover:bg-gray-50`}
              >
                <Filter size={16} className="mr-2" />
                Filter
                {Object.keys(appliedFilters).length > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.keys(appliedFilters).length}
                  </span>
                )}
              </button>

              {/* Filter Options Dropdown */}
              {showFilterMenu && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {/* Primary Filter Options */}
                  {!activeFilter && (
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                        Filter by
                      </div>
                      {['role', 'manager', 'department', 'location'].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleFilterOptionClick(option)}
                          className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <span className="capitalize">{option}</span>
                          <div className="flex items-center">
                            {appliedFilters[option] && (
                              <span className="mr-2 text-sm text-gray-500 truncate max-w-[100px]">
                                {appliedFilters[option]}
                              </span>
                            )}
                            <ChevronRight size={14} className="text-gray-400" />
                          </div>
                        </button>
                      ))}

                      {/* Applied Filters Summary */}
                      {Object.keys(appliedFilters).length > 0 && (
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={clearAllFilters}
                            className="w-full px-4 py-2 text-sm text-primary text-left hover:bg-gray-50"
                          >
                            Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Secondary Filter Options (when a primary filter is selected) */}
                  {activeFilter && (
                    <div className="py-1">
                      <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                        <button 
                          onClick={() => setActiveFilter(null)}
                          className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <span className="capitalize">{activeFilter}</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filterOptions[activeFilter].map((value) => (
                          <button
                            key={value}
                            onClick={() => handleFilterValueSelect(activeFilter, value)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <span className="flex-1 text-left">{value}</span>
                            {appliedFilters[activeFilter] === value && (
                              <Check size={14} className="text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="p-2 border border-gray-200 rounded-md shadow-sm text-gray-700 hover:bg-gray-50" aria-label="Download">
              <Download size={16} />
            </button>
            <button className="p-2 border border-gray-200 rounded-md shadow-sm text-gray-700 hover:bg-gray-50" aria-label="Grid view">
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Applied Filters Tags */}
        {Object.keys(appliedFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(appliedFilters).map(([key, value]) => (
              <div key={key} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                <span className="text-gray-600 capitalize mr-1">{key}:</span>
                <span className="text-gray-800 font-medium">{value}</span>
                <button 
                  onClick={() => clearFilter(key)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Custom Fields Section */}
        <div className="mb-6">
          <button
            onClick={() => setCustomFieldsExpanded(!customFieldsExpanded)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-md"
            aria-expanded={customFieldsExpanded}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-800">Custom fields</span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Optional
              </span>
            </div>
            {customFieldsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {customFieldsExpanded && (
            <div className="mt-3 px-4 py-3 border border-gray-200 rounded-md">
              <div className="text-sm text-gray-600 mb-4">
                Add custom fields for all selected employees. These will be synced with their profiles.
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor="customField1" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    id="customField1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <label htmlFor="customField2" className="block text-sm font-medium text-gray-700 mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    id="customField2"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="customField3" className="block text-sm font-medium text-gray-700 mb-1">
                    Employment type
                  </label>
                  <select
                    id="customField3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select type</option>
                    <option value="fullTime">Full time</option>
                    <option value="partTime">Part time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employee List Section */}
        <div className="flex-1 overflow-auto border-t border-gray-200 pt-4">
          {activeTab === 'terminated' ? (
            // Terminated Employees UI
            <>
              {/* Empty notice for no terminated employees */}
              {mockEmployees.terminated.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>No terminated employees found</p>
                </div>
              )}

              {mockEmployees.terminated.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {mockEmployees.terminated.map(employee => (
                    <div key={employee.id} className="py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="font-medium text-sm text-gray-600">
                            {getInitials(employee.name)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{employee.name}</div>
                          <div className="text-gray-600 text-sm">{employee.email}</div>
                        </div>
                      </div>
                      <div className="mt-2 ml-11 text-sm text-gray-500">
                        Terminated on {new Date(employee.terminated).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : activeTab === 'pending' ? (
            // Pending Invites UI
            <>
              <div className="grid grid-cols-12 gap-4 mb-3 px-2 text-sm font-medium text-gray-500">
                <div className="col-span-5">Email</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-3">Invited</div>
                <div className="col-span-1">Actions</div>
              </div>

              {filteredEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-gray-100 hover:bg-gray-50 items-center"
                >
                  <div className="col-span-5">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`select-${employee.id}`}
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{employee.name}</div>
                        <div className="text-gray-600 text-sm">{employee.email}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 text-gray-600">{employee.role}</div>
                  <div className="col-span-3 text-gray-600">{new Date(employee.invited).toLocaleDateString()}</div>
                  <div className="col-span-1 flex justify-end">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="Resend invitation">
                        <Mail size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600" aria-label="Copy invitation link">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // To Invite Employees UI
            <>
              <div className="grid grid-cols-12 gap-4 mb-3 px-2 text-sm font-medium text-gray-500">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Office</div>
                <div className="col-span-1">Email</div>
                <div className="col-span-1"></div>
              </div>

              {filteredEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-gray-100 hover:bg-gray-50 items-center"
                >
                  <div className="col-span-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`select-${employee.id}`}
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="font-medium text-gray-800">{employee.name}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-gray-600">{employee.role}</div>
                  <div className="col-span-2 text-gray-600">{employee.department}</div>
                  <div className="col-span-2 text-gray-600">{employee.office}</div>
                  <div className="col-span-1 text-gray-600 truncate">{employee.email}</div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleCopyEmail(employee.email)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label={`Copy email: ${employee.email}`}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredEmployees.length === 0 && searchQuery && (
                <div className="py-8 text-center text-gray-500">
                  No employees found matching "{searchQuery}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
      )}
    </AppDrawer>
  );
};

export default InvitePeopleHRIS;