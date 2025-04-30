import React, { useState } from "react";
import { X, Plus, ChevronRight } from "lucide-react";

const EmployeeDrawer = ({ isOpen, onClose, employee, onEditProfile }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  // Return to the people tab
  const handleClose = () => {
    onClose();
  };
  
  // Show edit employee drawer
  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    }
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
              onClick={handleClose}
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

          {/* Profile information */}
          <div className="mt-4">
            <div className="flex items-center mb-1">
              <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-lg mr-3">
                {employee?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{employee?.name || "Arjun Sharma"}</h2>
                <p className="text-gray-500">{employee?.email || "arjun.sharma@stride.com"}</p>
              </div>
            </div>
            
            {/* Missing items banner */}
            <div className="bg-amber-50 border border-amber-200 text-amber-700 flex items-center px-4 py-2 rounded-md mt-4">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 mr-2 text-amber-600">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="text-sm font-medium">Missing items</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            <button
              className="py-2 px-1 -mb-px text-sm font-medium border-b-2 border-primary text-primary"
            >
              Overview
            </button>
            <button
              className="py-2 px-1 -mb-px text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Activity
            </button>
          </div>
        </div>
        
        {/* Content scrollable area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Employee info section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Role</h3>
              <p className="text-gray-900 font-medium">{employee?.role || "Employee"}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Department</h3>
              <p className="text-gray-900 font-medium flex items-center">
                {employee?.department || "Engineering"} <ChevronRight size={16} className="ml-1 text-gray-400" />
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900 font-medium flex items-center">
                {employee?.location || "Bengaluru"} <ChevronRight size={16} className="ml-1 text-gray-400" />
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Manager</h3>
              <p className="text-gray-900 font-medium flex items-center">
                {employee?.manager || "Priya Patel"} <ChevronRight size={16} className="ml-1 text-gray-400" />
              </p>
            </div>
          </div>
          
          {/* Edit profile button */}
          <div className="mb-8">
            <button 
              onClick={handleEditProfile}
              className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700 font-medium hover:bg-gray-50 flex items-center"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 mr-2">
                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              Edit profile
            </button>
          </div>
          
          {/* Virtual cards section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Arjun's virtual cards <span className="ml-1 text-sm text-gray-500">1</span></h3>
              <button className="p-1 rounded-md hover:bg-gray-100">
                <Plus size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-3">
              <h4 className="font-medium">Office Supplies</h4>
              <p className="text-sm text-gray-500 mb-1">$3,064.11 remaining · $3,000.00 USD / Monthly</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
          </div>
          
          {/* Physical card section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Arjun's physical card</h3>
            <div className="text-gray-500 mb-4">No card added</div>
            <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Add card
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDrawer;