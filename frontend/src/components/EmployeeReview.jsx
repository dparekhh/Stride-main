import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  X, 
  ChevronDown, 
  AlertCircle, 
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

/**
 * EmployeeReview Component
 * 
 * A full-screen overlay component for reviewing and configuring employee details
 * before sending invites. Provides bulk editing capabilities and field validation.
 * 
 * @param {Object} props
 * @param {Array} props.selectedEmployees - Array of employee objects selected for invitation
 * @param {Object} props.initialEmployeeDetails - Initial configuration for employee fields
 * @param {Function} props.onClose - Callback when the close button is clicked
 * @param {Function} props.onBack - Callback when the back button is clicked
 * @param {Function} props.onSendInvites - Callback when the "Send Invites" button is clicked
 * @param {Object} props.filterOptions - Available options for role, manager, department, location
 */
const EmployeeReview = ({ 
  selectedEmployees, 
  initialEmployeeDetails, 
  onClose, 
  onBack, 
  onSendInvites, 
  filterOptions 
}) => {
  // State for tracking employee configurations
  const [employeeConfigs, setEmployeeConfigs] = useState([]);
  const [bulkEditField, setBulkEditField] = useState(null);
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [showBulkEditMenu, setShowBulkEditMenu] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasValidated, setHasValidated] = useState(false);
  const [customMessage, setCustomMessage] = useState(initialEmployeeDetails.customMessage || '');
  
  // Initialize employee configurations with initial details
  useEffect(() => {
    const initialConfigs = selectedEmployees.map(employee => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: initialEmployeeDetails.role || '',
      manager: initialEmployeeDetails.manager || '',
      department: initialEmployeeDetails.department || '',
      location: initialEmployeeDetails.location || '',
    }));
    
    setEmployeeConfigs(initialConfigs);
  }, [selectedEmployees, initialEmployeeDetails]);
  
  // Validate required fields
  const validateConfigurations = () => {
    const errors = {};
    let hasErrors = false;

    employeeConfigs.forEach(config => {
      const employeeErrors = {};
      
      if (!config.role) {
        employeeErrors.role = true;
        hasErrors = true;
      }
      
      if (!config.manager) {
        employeeErrors.manager = true;
        hasErrors = true;
      }
      
      if (!config.department) {
        employeeErrors.department = true;
        hasErrors = true;
      }
      
      if (!config.location) {
        employeeErrors.location = true;
        hasErrors = true;
      }
      
      if (Object.keys(employeeErrors).length > 0) {
        errors[config.id] = employeeErrors;
      }
    });
    
    setValidationErrors(errors);
    setHasValidated(true);
    
    return !hasErrors;
  };
  
  // Handle field change for a specific employee
  const handleFieldChange = (employeeId, field, value) => {
    setEmployeeConfigs(prev => 
      prev.map(config => 
        config.id === employeeId 
          ? { ...config, [field]: value } 
          : config
      )
    );
    
    // Clear validation error for this field if it exists
    if (validationErrors[employeeId]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [employeeId]: {
          ...prev[employeeId],
          [field]: false
        }
      }));
    }
  };
  
  // Apply bulk edit to all employee configurations
  const applyBulkEdit = () => {
    if (!bulkEditField || !bulkEditValue) return;
    
    setEmployeeConfigs(prev => 
      prev.map(config => ({
        ...config,
        [bulkEditField]: bulkEditValue
      }))
    );
    
    // Clear validation errors for the bulk-edited field
    if (Object.keys(validationErrors).length > 0) {
      const updatedErrors = { ...validationErrors };
      
      Object.keys(updatedErrors).forEach(employeeId => {
        if (updatedErrors[employeeId][bulkEditField]) {
          updatedErrors[employeeId] = {
            ...updatedErrors[employeeId],
            [bulkEditField]: false
          };
        }
      });
      
      setValidationErrors(updatedErrors);
    }
    
    // Reset bulk edit UI state
    setBulkEditField(null);
    setBulkEditValue('');
    setShowBulkEditMenu(false);
  };
  
  // Handle send invites button click
  const handleSendInvites = () => {
    const isValid = validateConfigurations();
    
    if (isValid) {
      // Prepare the final employee configurations including the custom message
      const finalConfigs = employeeConfigs.map(config => ({
        ...config,
        customMessage
      }));
      
      onSendInvites(finalConfigs);
    }
  };
  
  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Calculate validation status and summary
  const getValidationSummary = () => {
    if (!hasValidated) return null;
    
    const errorCount = Object.keys(validationErrors).length;
    
    if (errorCount === 0) {
      return {
        type: 'success',
        icon: <Check size={16} className="text-green-500" />,
        message: 'All required fields are filled'
      };
    } else {
      return {
        type: 'error',
        icon: <AlertTriangle size={16} className="text-red-500" />,
        message: `${errorCount} ${errorCount === 1 ? 'employee has' : 'employees have'} missing fields`
      };
    }
  };
  
  const validationSummary = getValidationSummary();
  
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-md">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Review Invites</h2>
              <p className="text-gray-500 text-sm mt-1">
                Configure details for {selectedEmployees.length} {selectedEmployees.length === 1 ? 'employee' : 'employees'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {validationSummary && (
              <div className={`flex items-center px-4 py-2 rounded-md text-sm ${
                validationSummary.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {validationSummary.icon}
                <span className="ml-2 font-medium">{validationSummary.message}</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Bulk edit options */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-medium text-gray-700 text-lg">Employee details</h3>
          
          <div className="relative">
            <button
              onClick={() => setShowBulkEditMenu(!showBulkEditMenu)}
              className="px-4 py-2.5 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium shadow-md"
            >
              Bulk edit
              <ChevronDown size={16} className="ml-2 text-gray-500" />
            </button>
            
            {showBulkEditMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Edit field for all employees</h4>
                  <select
                    value={bulkEditField || ''}
                    onChange={(e) => setBulkEditField(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md mb-3 text-sm text-gray-700 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                  >
                    <option value="">Select field</option>
                    <option value="role">Role</option>
                    <option value="manager">Manager</option>
                    <option value="department">Department</option>
                    <option value="location">Location</option>
                  </select>
                  
                  {bulkEditField && (
                    <select
                      value={bulkEditValue}
                      onChange={(e) => setBulkEditValue(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-md mb-3 text-sm text-gray-700 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                    >
                      <option value="">Select {bulkEditField}</option>
                      {filterOptions[bulkEditField]?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  <button
                    onClick={applyBulkEdit}
                    disabled={!bulkEditField || !bulkEditValue}
                    className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                      bulkEditField && bulkEditValue
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Apply to all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Employee table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md my-6">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600 sticky top-0 z-10">
            <div className="col-span-3">Employee</div>
            <div className="col-span-2">Role <span className="text-red-500">*</span></div>
            <div className="col-span-2">Manager <span className="text-red-500">*</span></div>
            <div className="col-span-2">Department <span className="text-red-500">*</span></div>
            <div className="col-span-3">Location <span className="text-red-500">*</span></div>
          </div>
          
          {/* Table body */}
          <div className="divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto">
            {employeeConfigs.map(employee => (
              <div 
                key={employee.id} 
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="col-span-3 flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="font-medium text-sm text-gray-600">
                      {getInitials(employee.name)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{employee.name}</div>
                    <div className="text-gray-500 text-sm">{employee.email}</div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <select
                    value={employee.role}
                    onChange={(e) => handleFieldChange(employee.id, 'role', e.target.value)}
                    className={`w-full py-2.5 px-4 border rounded-md text-sm text-gray-700 transition-colors duration-200 ${
                      validationErrors[employee.id]?.role
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                  >
                    <option value="">Select role</option>
                    {filterOptions.role.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {validationErrors[employee.id]?.role && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <select
                    value={employee.manager}
                    onChange={(e) => handleFieldChange(employee.id, 'manager', e.target.value)}
                    className={`w-full py-2.5 px-4 border rounded-md text-sm text-gray-700 transition-colors duration-200 ${
                      validationErrors[employee.id]?.manager
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                  >
                    <option value="">Select manager</option>
                    {filterOptions.manager.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                  {validationErrors[employee.id]?.manager && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <select
                    value={employee.department}
                    onChange={(e) => handleFieldChange(employee.id, 'department', e.target.value)}
                    className={`w-full py-2.5 px-4 border rounded-md text-sm text-gray-700 transition-colors duration-200 ${
                      validationErrors[employee.id]?.department
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                  >
                    <option value="">Select department</option>
                    {filterOptions.department.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                  {validationErrors[employee.id]?.department && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
                
                <div className="col-span-3">
                  <select
                    value={employee.location}
                    onChange={(e) => handleFieldChange(employee.id, 'location', e.target.value)}
                    className={`w-full py-2.5 px-4 border rounded-md text-sm text-gray-700 transition-colors duration-200 ${
                      validationErrors[employee.id]?.location
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary'
                    }`}
                  >
                    <option value="">Select location</option>
                    {filterOptions.location.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {validationErrors[employee.id]?.location && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Custom message */}
        <div className="mt-8">
          <h3 className="font-medium text-gray-800 mb-3">Custom message (optional)</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-5 shadow-md">
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to the invitation email"
              className="w-full py-3 px-4 border border-gray-300 rounded-md h-28 text-sm text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            ></textarea>
            <div className="mt-3 flex items-start text-sm text-gray-500">
              <Info size={14} className="mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>This message will be included in the email invitation sent to all employees</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 py-4 px-6 bg-white shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            {hasValidated && Object.keys(validationErrors).length > 0 && (
              <div className="flex items-center text-red-500 bg-red-50 py-2 px-3 rounded-md">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>Please fill in all required fields before proceeding</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
            <button
              onClick={handleSendInvites}
              className="px-5 py-2.5 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary-dark transition-colors duration-200 shadow-md"
            >
              Send Invites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReview;