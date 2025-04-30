import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, ChevronDown } from 'lucide-react';

/**
 * AddButton component - The "+ Add" button with dropdown for adding workflow elements
 * 
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of options to show in the dropdown
 * @param {Function} props.onOptionSelect - Callback when an option is selected
 * @param {string} props.buttonClassName - Custom class name for the button styling
 * @returns {JSX.Element} The AddButton component
 */
const AddButton = ({ options, onOptionSelect, buttonClassName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleOptionClick = (option) => {
    onOptionSelect(option);
    setShowDropdown(false);
  };
  
  // Default button class and custom class if provided
  const buttonClass = buttonClassName || "text-blue-600 font-medium hover:text-blue-700";
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center focus:outline-none px-3 py-1.5 rounded ${buttonClass}`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Plus size={18} className="mr-1" />
        <span>Add</span>
        <ChevronDown size={16} className="ml-1" />
      </button>
      
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={`w-full px-4 py-2 text-sm text-left ${
                  option.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
                disabled={option.disabled}
                title={option.disabled ? 'Add a condition first' : ''}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AddButton.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  onOptionSelect: PropTypes.func.isRequired,
  buttonClassName: PropTypes.string,
};

export default AddButton;