import React, { useRef, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * SearchActionButton Component
 * 
 * A reusable button component that provides a search input with configurable
 * placeholder text and callback functionality.
 * 
 * Features:
 * - Search icon with integrated input field
 * - Customizable placeholder text
 * - Callback for search term changes
 * - Consistent styling with our design system
 * - No border styling option
 */
const SearchActionButton = ({
  onSearchChange,
  initialSearchTerm = '',
  placeholder = 'Search...',
  className = '',
  width = '3/4',
  noBorder = false,
  disabled = false
}) => {
  // State for the search term
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const searchInputRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Call the callback function if provided
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  // Border style based on the noBorder prop
  const borderStyle = noBorder ? '' : 'border border-gray-200';

  return (
    <div className={`relative flex-grow ${className}`} ref={searchInputRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className={`block w-${width} pl-10 pr-3 py-2 ${borderStyle} rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-gray-300 sm:text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        disabled={disabled}
      />
    </div>
  );
};

SearchActionButton.propTypes = {
  /** Callback function when search term changes */
  onSearchChange: PropTypes.func.isRequired,
  /** Initial search term value */
  initialSearchTerm: PropTypes.string,
  /** Placeholder text for the search input */
  placeholder: PropTypes.string,
  /** Optional CSS classes */
  className: PropTypes.string,
  /** Width of the search input (Tailwind width class fraction) */
  width: PropTypes.string,
  /** Whether to remove the border */
  noBorder: PropTypes.bool,
  /** Whether the search input is disabled */
  disabled: PropTypes.bool
};

export default SearchActionButton;