import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { 
  employees, 
  EmployeeRole, 
  PermissionType, 
  hasPermission, 
  filterByRole, 
  getFullName 
} from '../../utils/employeeData';

const PermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownKeyboardIndex, setDropdownKeyboardIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter employees based on search term
  const filteredEmployees = searchTerm.trim() === "" 
    ? employees 
    : employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
    setDropdownKeyboardIndex(-1);
  };

  const handleEmployeeSelect = (employee) => {
    if (!selectedEmployees.some(emp => emp.firstName === employee.firstName && emp.lastName === employee.lastName)) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveEmployee = (employee) => {
    setSelectedEmployees(selectedEmployees.filter(emp => 
      !(emp.firstName === employee.firstName && emp.lastName === employee.lastName)
    ));
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Permission Settings</h2>

      <div className="border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-md font-semibold">AP Clerks</h3>
            <p className="text-sm text-gray-500">Choose People to add to AP clerks</p>
          </div>
          <button
            className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
            aria-label="Add AP clerk"
            onClick={() => searchInputRef.current.focus()}
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>

        {/* Selected employees as tags */}
        <div className="mb-4 min-h-[60px] border border-gray-200 rounded-md p-3">
          {selectedEmployees.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedEmployees.map((employee) => (
                <div 
                  key={`selected-${employee.firstName}-${employee.lastName}`}
                  className="flex items-center bg-green-50 text-green-800 px-2 py-1 rounded"
                >
                  <span className="text-sm">{employee.firstName} {employee.lastName}</span>
                  <button
                    onClick={() => handleRemoveEmployee(employee)}
                    className="ml-1 text-green-700 hover:text-red-500"
                    aria-label={`Remove ${employee.firstName} ${employee.lastName}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic text-sm h-full flex items-center">
              No AP clerks selected
            </div>
          )}
        </div>

        {/* Search input below AP clerks box */}
        <div className="relative">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search employees..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {showDropdown && filteredEmployees.length > 0 && (
            <div 
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg"
            >
              {filteredEmployees.map((employee, index) => (
                <div 
                  key={`${employee.firstName}-${employee.lastName}`}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    dropdownKeyboardIndex === index ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleEmployeeSelect(employee)}
                >
                  <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                  <div className="text-sm text-gray-500">{employee.department} • {employee.location}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Bill Pay Permissions</h3>
        <p className="text-sm text-gray-500 mb-4">Configure who can access and manage bill pay features</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Manage Bills</h4>
              <p className="text-sm text-gray-500">Create, edit, and delete bills</p>
            </div>
            <select className="border border-gray-300 rounded p-2">
              <option value="admin_only">Admins Only</option>
              <option value="admins_clerks">Admins & AP Clerks</option>
              <option value="all_employees">All Employees</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Approve Bills</h4>
              <p className="text-sm text-gray-500">Approve or reject bill payments</p>
            </div>
            <select className="border border-gray-300 rounded p-2">
              <option value="admin_only">Admins Only</option>
              <option value="admins_managers">Admins & Managers</option>
              <option value="custom">Custom Approvers</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
            <div>
              <h4 className="font-medium">Process Payments</h4>
              <p className="text-sm text-gray-500">Execute bill payments</p>
            </div>
            <select className="border border-gray-300 rounded p-2">
              <option value="admin_only">Admins Only</option>
              <option value="admins_finance">Admins & Finance Team</option>
              <option value="custom">Custom Users</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTab;