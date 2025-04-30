import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronDown, ChevronLeft, Check } from 'lucide-react';
import SearchableDropdown from '../../../SearchableDropdown';
import formattedApproverOptions, { 
  formattedMainLevelOptions, 
  formattedEmployeeLevelOptions 
} from '../../../../../utils/ApproverOptions';

/**
 * ApproverSelector component - Dialog for selecting approvers
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Callback for close action
 * @param {Function} props.onSave - Callback for save action
 * @param {Array} [props.initialApprovers] - Initial selected approvers for editing
 * @param {string} [props.initialApprovalType] - Initial approval type ('any' or 'all')
 * @returns {JSX.Element|null} The ApproverSelector component or null if closed
 */
const ApproverSelector = ({
  isOpen,
  onClose,
  onSave,
  initialApprovers = [],
  initialApprovalType = 'any'
}) => {
  // State for approver selection
  const [approvalType, setApprovalType] = useState(initialApprovalType);
  const [selectedApprovers, setSelectedApprovers] = useState(initialApprovers);
  const [isApprovalTypeDropdownOpen, setIsApprovalTypeDropdownOpen] = useState(false);
  
  // Dropdown navigation state
  const [approverDropdownLevel, setApproverDropdownLevel] = useState('main');
  const [currentApproverOptions, setCurrentApproverOptions] = useState(formattedMainLevelOptions);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  
  // Reset state when dialog is opened/closed
  useEffect(() => {
    if (isOpen) {
      setSelectedApprovers(initialApprovers);
      setApprovalType(initialApprovalType);
      setApproverDropdownLevel('main');
      setCurrentApproverOptions(formattedMainLevelOptions);
      setShowEmployeeList(false);
    }
  }, [isOpen, initialApprovers, initialApprovalType]);
  
  // Navigate to employee list
  const navigateToEmployeeList = () => {
    setApproverDropdownLevel('employee');
    setCurrentApproverOptions(formattedEmployeeLevelOptions);
    setShowEmployeeList(true);
  };
  
  // Navigate back to main options
  const navigateToMainOptions = () => {
    setApproverDropdownLevel('main');
    setCurrentApproverOptions(formattedMainLevelOptions);
    setShowEmployeeList(false);
  };
  
  // Handle approver selection
  const handleApproverSelect = (approver) => {
    console.log('Approver selected:', approver.label);
    
    // Check if approver is already selected
    const isAlreadySelected = selectedApprovers.some(
      selected => selected.value === approver.value
    );
    
    // Use setTimeout to ensure UI updates properly before changing state
    setTimeout(() => {
      if (isAlreadySelected) {
        // Remove from selection
        setSelectedApprovers(
          selectedApprovers.filter(selected => selected.value !== approver.value)
        );
      } else {
        // Add to selection
        setSelectedApprovers([...selectedApprovers, approver]);
      }
    }, 0);
  };
  
  // Handle save action
  const handleSave = () => {
    onSave({
      approvers: selectedApprovers,
      approvalType
    });
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Select Approvers</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {/* Approval type selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval type
          </label>
          <div className="relative">
            <button 
              className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left flex items-center justify-between"
              onClick={() => setIsApprovalTypeDropdownOpen(!isApprovalTypeDropdownOpen)}
            >
              <span>
                {approvalType === 'any' ? 'Any one approver' : 'All approvers'}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {isApprovalTypeDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                    onClick={() => {
                      setIsApprovalTypeDropdownOpen(false);
                      // Use setTimeout to ensure dropdown is closed before updating state
                      setTimeout(() => {
                        setApprovalType('any');
                      }, 0);
                    }}
                  >
                    Any one approver
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                    onClick={() => {
                      setIsApprovalTypeDropdownOpen(false);
                      // Use setTimeout to ensure dropdown is closed before updating state
                      setTimeout(() => {
                        setApprovalType('all');
                      }, 0);
                    }}
                  >
                    All approvers
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Approvers selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select approvers
          </label>
          
          {/* Navigation header for employee list */}
          {showEmployeeList && (
            <div className="mb-2">
              <button 
                className="text-blue-600 flex items-center hover:text-blue-700"
                onClick={navigateToMainOptions}
              >
                <ChevronLeft size={16} className="mr-1" />
                <span>Back to categories</span>
              </button>
            </div>
          )}
          
          {/* Approver options list */}
          <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
            {currentApproverOptions.map((option) => (
              <div key={option.value} className="border-b border-gray-200 last:border-b-0">
                {option.value === 'employee_list' ? (
                  // Special option to navigate to employee list
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
                    onClick={navigateToEmployeeList}
                  >
                    <span>{option.label}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                ) : (
                  // Regular approver option
                  <div
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                    onClick={() => handleApproverSelect(option)}
                  >
                    <span>{option.label}</span>
                    {selectedApprovers.some(approver => approver.value === option.value) && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Selected approvers display */}
        {selectedApprovers.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected approvers ({selectedApprovers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedApprovers.map((approver, index) => (
                <div
                  key={`${approver.value}-${index}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span>{approver.label}</span>
                  <button
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleApproverSelect(approver)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedApprovers.length === 0}
          >
            Save & close
          </button>
        </div>
      </div>
    </div>
  );
};

ApproverSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialApprovers: PropTypes.array,
  initialApprovalType: PropTypes.oneOf(['any', 'all'])
};

export default ApproverSelector;