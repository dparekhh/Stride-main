import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import roles from "../utils/PeoplePage_Role";

const ChangeRoleDrawer = ({ isOpen, onClose, onBack, employee, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [originalRole, setOriginalRole] = useState("Employee");
  const [changesMade, setChangesMade] = useState(false);
  
  // Set initial role when drawer opens
  useEffect(() => {
    if (isOpen && employee) {
      setSelectedRole(employee.role || "Employee");
      setOriginalRole(employee.role || "Employee");
      setChangesMade(false);
    }
  }, [isOpen, employee]);
  
  // Check if role has changed from original
  useEffect(() => {
    setChangesMade(selectedRole !== originalRole);
  }, [selectedRole, originalRole]);
  
  // Back button returns to Edit Employee drawer
  const handleBack = () => {
    if (onBack) onBack();
  };

  // Close button returns to main interface
  const handleClose = () => {
    if (onClose) onClose();
  };
  
  // Handle role selection
  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };
  
  // Save changes and trigger notification
  const handleSaveChanges = () => {
    if (onRoleChange) {
      onRoleChange(selectedRole);
    }
    // Return to the Edit Employee drawer
    handleBack();
  };

  return (
    <>
      {/* Overlay with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="mr-1">←</span> Back
            </button>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mt-4">Change role</h2>
          <p className="text-gray-500 text-sm mt-1">{employee?.email || "arjun.sharma@stride.com"}</p>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Select role</h3>
            
            {/* Role selection options */}
            <div className="space-y-4">
              {roles.map((role) => (
                <div 
                  key={role.id}
                  className="flex items-start border-b border-gray-100 pb-4"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  </div>
                  <div className="ml-4 flex items-center h-6">
                    {selectedRole === role.name ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-500">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    ) : (
                      <div 
                        className="w-6 h-6 border border-gray-300 rounded-full cursor-pointer"
                        onClick={() => handleRoleSelection(role.name)}
                      ></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between">
          <button 
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            className={`px-4 py-2 rounded-md text-white ${changesMade ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!changesMade}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangeRoleDrawer;