import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { ChevronDown, Plus, Check, X } from 'lucide-react';

/**
 * PortalDropdown - A dropdown component that renders outside its parent container using React Portal
 * 
 * This component is specifically designed for UI scenarios where the dropdown menu needs to
 * break out of any parent containers with overflow:hidden or similar constraints.
 * 
 * Features:
 * - Single or multi-select options
 * - Custom option rendering
 * - Search filtering
 * - Portal-based rendering to avoid container constraints
 * - Customizable width and z-index
 */
const PortalDropdown = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  showFooter = false,
  dropdownWidth = null,
  dropdownZIndex = 50,
  isMulti = false,
  renderOption = null,
  showSearch = false,
  searchPlaceholder = "Search...",
  customHeader = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Get display text for the dropdown trigger
  const getDisplayText = () => {
    if (isMulti) {
      // Handle array of selected values for multi-select
      if (Array.isArray(value) && value.length > 0) {
        if (value.length === 1) {
          const selectedOption = options.find(opt => 
            typeof opt === 'object' ? opt.value === value[0] : opt === value[0]
          );
          return selectedOption 
            ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
            : `${value.length} selected`;
        }
        return `${value.length} selected`;
      }
      return placeholder;
    } else {
      // Single select display logic
      const selectedOption = options.find(option => 
        typeof option === 'object' ? option.value === value : option === value
      );
      
      return selectedOption 
        ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
        : placeholder;
    }
  };

  const displayText = getDisplayText();

  // Filter options based on search text
  const filteredOptions = searchText
    ? options.filter(option => {
        const optionText = typeof option === 'object' ? option.label : option;
        return optionText.toLowerCase().includes(searchText.toLowerCase());
      })
    : options;

  // Position the dropdown based on the trigger element's position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Handle option selection
  const handleSelect = (option) => {
    if (isMulti) {
      // For multi-select, toggle the selected option
      const optionValue = typeof option === 'object' ? option.value : option;
      const newValue = Array.isArray(value) ? [...value] : [];
      
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1); // Remove if already selected
      } else {
        newValue.push(optionValue); // Add if not already selected
      }
      
      onChange(newValue);
      // Don't close dropdown for multi-select
    } else {
      const optionValue = typeof option === 'object' ? option.value : option;
      
      // Special cases for values we want to keep the dropdown open
      const specialOptions = ['specific-employee', 'back-to-main'];
      const shouldKeepOpen = specialOptions.includes(optionValue);
      
      // Pass the value to the onChange handler
      const result = onChange(optionValue);
      
      // Only close the dropdown if it's not a special option and result isn't explicitly false
      if (!shouldKeepOpen && result !== false) {
        setIsOpen(false);
      }
    }
  };

  // Determine if an option is selected
  const isOptionSelected = (option) => {
    const optionValue = typeof option === 'object' ? option.value : option;
    
    if (isMulti) {
      return Array.isArray(value) && value.includes(optionValue);
    } else {
      return optionValue === value;
    }
  };

  // Calculate the dropdown width (based on trigger element or custom width)
  const getDropdownWidth = () => {
    if (dropdownWidth) {
      return `${dropdownWidth}px`;
    }
    
    if (triggerRef.current) {
      return `${triggerRef.current.offsetWidth}px`;
    }
    
    return '100%';
  };

  // Render the dropdown element using a portal
  const renderDropdown = () => {
    if (!isOpen) return null;
    
    return createPortal(
      <div 
        ref={dropdownRef}
        className="dropdown-portal fixed"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: getDropdownWidth(),
          zIndex: dropdownZIndex,
        }}
      >
        <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Custom Header - if provided */}
          {customHeader && (
            <div className="custom-header">
              {customHeader}
            </div>
          )}
          
          {/* Search input - only show if showSearch is true */}
          {showSearch && (
            <div className="px-3 py-2 border-b border-gray-100">
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border-0 rounded focus:outline-none focus:ring-0"
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          {/* Options list */}
          <div className="py-1">
            {filteredOptions.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              const isSelected = isOptionSelected(option);
              const hasPlus = typeof option === 'object' && option.badge === 'plus';
              
              // Use custom render function if provided
              if (renderOption) {
                return renderOption(option, isSelected, () => handleSelect(option));
              }
              
              // Default option rendering
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                    isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center">
                    {isMulti && (
                      <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${isSelected ? 'bg-green-500' : 'border border-gray-300'}`}>
                        {isSelected && (
                          <Check size={16} className="text-white" />
                        )}
                      </div>
                    )}
                    <span>{optionLabel}</span>
                  </div>
                  
                  {hasPlus && (
                    <span className="flex items-center justify-center bg-yellow-300 text-black text-xs font-medium rounded-md px-2 py-0.5">
                      <Plus size={12} className="mr-1" />
                      Plus
                    </span>
                  )}
                </div>
              );
            })}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
            )}
          </div>
          
          {/* Optional footer with Done button for multi-select */}
          {(showFooter || isMulti) && (
            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
              <button
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setIsOpen(false)}
              >
                {isMulti ? 'Done' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {/* Trigger button */}
      <div
        ref={triggerRef}
        className={`flex items-center justify-between px-3 h-[38px] bg-white cursor-pointer ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isMulti && Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1 flex-grow mr-2 max-w-[calc(100%-20px)] max-h-[28px] overflow-y-auto">
            {value.map((val, index) => {
              const selectedOption = options.find(opt => 
                typeof opt === 'object' ? opt.value === val : opt === val
              );
              const label = selectedOption
                ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
                : val;
                
              return (
                <div key={index} className="flex items-center bg-gray-200 rounded px-2 h-[22px] text-sm mr-1 mb-1">
                  <span className="truncate">{label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newValue = [...value];
                      newValue.splice(index, 1);
                      onChange(newValue);
                    }}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <span className={`${(value && (!isMulti || (Array.isArray(value) && value.length > 0))) ? 'text-black' : 'text-gray-500'} truncate flex-grow flex items-center`}>
            {displayText}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>
      
      {/* Render dropdown using portal */}
      {renderDropdown()}
    </>
  );
};

PortalDropdown.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number,
    PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        badge: PropTypes.string
      })
    ])
  ).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  showFooter: PropTypes.bool,
  dropdownWidth: PropTypes.number,
  dropdownZIndex: PropTypes.number,
  isMulti: PropTypes.bool,
  renderOption: PropTypes.func,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  customHeader: PropTypes.node
};

export default PortalDropdown;