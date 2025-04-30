// src/pages/AccountingDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { BookOpenCheck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccounting } from "../contexts/AccountingContext";
import { PageLayout } from "../components/common/page-layout";
import { 
  employees, 
  getFullName 
} from "../utils/employeeData";

/**
 * AccountingDashboard component
 * Displays the main accounting interface after setup is complete
 */
const AccountingDashboard = () => {
  const navigate = useNavigate();
  const { resetAccountingSetup, connectedProvider } = useAccounting();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dropdownKeyboardIndex, setDropdownKeyboardIndex] = useState(-1);
  
  const dropdownRef = useRef(null);
  const dropdownTriggerRef = useRef(null);
  
  // Filter employees based on search term
  const filteredEmployees = searchTerm.trim() === "" 
    ? employees 
    : employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        dropdownTriggerRef.current && 
        !dropdownTriggerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setDropdownKeyboardIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown when clicking on the trigger button
  const handleToggleDropdown = () => {
    setShowDropdown(prev => !prev);
    setSearchTerm("");
    setDropdownKeyboardIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownKeyboardIndex(-1);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setShowDropdown(false);
  };

  // For testing purposes, allows resetting the accounting setup state
  const handleResetSetup = () => {
    resetAccountingSetup();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    // Down arrow
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDropdownKeyboardIndex(prev => 
        prev < filteredEmployees.length - 1 ? prev + 1 : prev
      );
    }
    // Up arrow
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDropdownKeyboardIndex(prev => prev > 0 ? prev - 1 : 0);
    }
    // Enter to select
    else if (e.key === 'Enter' && dropdownKeyboardIndex >= 0) {
      e.preventDefault();
      handleEmployeeSelect(filteredEmployees[dropdownKeyboardIndex]);
    }
    // Escape to close
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowDropdown(false);
      setDropdownKeyboardIndex(-1);
    }
  };

  return (
    <PageLayout
      pageTitle="Accounting"
      heading="Dashboard"
      showSearchBar={false}
      showActionButtons={false}
    >
      {/* Center content with icon */}
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mt-10 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <BookOpenCheck size={40} className="text-gray-400" />
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Sync your transactions to your accounting provider</h2>
        <p className="text-gray-500 mb-8">Set up in minutes and say goodbye to manual coding</p>
        
        <div className="flex items-center space-x-4">
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            onClick={(e) => {
              e.preventDefault();
              try {
                // Single, clean navigation approach using React Router
                console.log("Navigating to AccountingConnect page...");
                navigate('/accounting/connect');
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}
          >
            Get started now
          </button>
          <span className="text-gray-500">or</span>
          
          {/* Dropdown container with relative positioning */}
          <div className="relative">
            {/* Button with underline styling */}
            <button 
              ref={dropdownTriggerRef}
              onClick={handleToggleDropdown}
              className="text-black hover:text-gray-700 relative"
            >
              <span className="border-b border-black">Select someone to set it up</span>
            </button>
            
            {/* Dropdown positioned ABOVE the button */}
            {showDropdown && (
              <div 
                ref={dropdownRef} 
                className="absolute bottom-full left-0 right-0 mb-2 w-64 max-h-80 bg-white rounded-md shadow-md overflow-hidden z-10"
                style={{ minWidth: '300px' }}
                onKeyDown={handleKeyDown}
              >
                {/* Search input at the top */}
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Employee list */}
                <div className="overflow-y-auto max-h-64">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No matching employees found
                    </div>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <div 
                        key={`${employee.id}-${employee.firstName}-${employee.lastName}`}
                        className={`flex items-start p-3 hover:bg-gray-50 cursor-pointer ${
                          dropdownKeyboardIndex === index ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          <span className="text-xs font-medium">{employee.avatar}</span>
                        </div>
                        
                        {/* Employee info */}
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{employee.firstName} {employee.lastName}</span>
                          <span className="text-gray-500 text-xs">{employee.role.replace('_', ' ')} • {employee.location}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-6">
          No stress, Stride never syncs data without your approval
        </p>
      </div>
      
      {/* Testing controls - visible during development */}
      <div className="mt-auto pt-4 text-center space-y-2">
        <button 
          onClick={handleResetSetup}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Reset Accounting Setup (For Testing)
        </button>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => {
              console.log("Using React Router navigate for Direct Link");
              navigate('/accounting/connect');
            }}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Direct Link to Connect Page
          </button>
          
          <button 
            onClick={() => {
              console.log("Using React Router navigate for Force Navigation");
              navigate('/accounting/connect', { replace: true });
            }}
            className="text-xs text-green-500 hover:text-green-700 underline"
          >
            Force Navigation
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountingDashboard;