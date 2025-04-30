import React from "react";
import { X, ChevronDown } from "lucide-react";

/**
 * FilterSection component - Provides filtering capabilities for the people list
 * This is a presentational component that receives data and callbacks from the parent
 */
const FilterSection = ({ 
  isVisible, 
  onClose, 
  departments = [], 
  locations = [], 
  customGroups = [] 
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Department Filter */}
        <div className="relative">
          <button className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <span className="text-gray-700">Department</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {/* Dropdown content would go here */}
        </div>
        
        {/* Location Filter */}
        <div className="relative">
          <button className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <span className="text-gray-700">Location</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {/* Dropdown content would go here */}
        </div>
        
        {/* Custom Group Filter */}
        <div className="relative">
          <button className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <span className="text-gray-700">Group</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {/* Dropdown content would go here */}
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
          Clear all
        </button>
        <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark">
          Apply filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;