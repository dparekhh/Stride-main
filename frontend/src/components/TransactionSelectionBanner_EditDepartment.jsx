import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

// TransactionSelectionBanner_EditDepartment component
// This component allows the user to select a department for multiple transactions
const TransactionSelectionBanner_EditDepartment = ({ 
  selectedCount, 
  departments = [], 
  onSelectDepartment, 
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState(departments);

  // Filter departments when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.code && dept.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  // Handle selection of a department with improved UX
  const handleDepartmentSelect = (department) => {
    if (onSelectDepartment) {
      // Add visual feedback before calling parent handler
      const listItem = document.getElementById(`department-item-${department.id}`);
      if (listItem) {
        // Add a brief highlight effect
        listItem.classList.add('bg-green-50');
        
        // Set a small timeout to show the selection before closing
        setTimeout(() => {
          onSelectDepartment(department);
        }, 150);
      } else {
        // If we can't find the element for some reason, just call the handler immediately
        onSelectDepartment(department);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-600">
            Edit Department for {selectedCount} {selectedCount === 1 ? 'transaction' : 'transactions'}
          </h2>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Departments list */}
        <div className="flex-1 overflow-y-auto">
          {filteredDepartments.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm.trim() !== '' 
                ? `No departments found matching "${searchTerm}"`
                : "No departments available."
              }
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredDepartments.map((department) => (
                <li 
                  key={department.id}
                  id={`department-item-${department.id}`}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleDepartmentSelect(department)}
                >
                  <div className="p-4">
                    <div className="font-medium text-gray-800">{department.name}</div>
                    {department.code && (
                      <div className="text-sm text-gray-500">{department.code}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

TransactionSelectionBanner_EditDepartment.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      code: PropTypes.string
    })
  ),
  onSelectDepartment: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TransactionSelectionBanner_EditDepartment;