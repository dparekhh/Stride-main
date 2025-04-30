import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ExpenseTypeSelector Component
 * 
 * A reusable component for selecting expense types in workflows
 * 
 * @param {Object} props Component props
 * @param {string} props.selectedType Current selected expense type
 * @param {Function} props.onTypeSelect Function called when a type is selected
 * @param {Array} props.options Available expense type options
 * @param {string} props.labelText Text label for the selector
 * @param {string} props.placeholderText Text to show when no type is selected
 * @returns {JSX.Element} The ExpenseTypeSelector component
 */
const ExpenseTypeSelector = ({
  selectedType = 'Select',
  onTypeSelect,
  options = ['Card transactions', 'Reimbursement'],
  labelText = '',
  placeholderText = 'Select'
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selection of an expense type
  const handleSelect = (type) => {
    if (typeof onTypeSelect === 'function') {
      onTypeSelect(type);
    }
    setShowDropdown(false);
  };
  
  return (
    <div className="flex items-center mb-4">
      {labelText && <p className="text-black font-medium mr-2">{labelText}</p>}
      <div className="relative" ref={dropdownRef}>
        <button 
          className="bg-white border border-gray-300 rounded px-3 py-1 min-w-32 text-left flex items-center justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className={selectedType === placeholderText ? 'text-gray-500' : 'text-black'}>
            {selectedType}
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
        
        {/* Type Dropdown */}
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option, index) => (
                <button 
                  key={index}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTypeSelector;