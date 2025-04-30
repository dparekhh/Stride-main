import React, { useState, useRef, useEffect } from 'react';
import { Filter, Search, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * FilterActionButton Component
 * 
 * A reusable button component that shows a filter icon and manages 
 * a dropdown for filter selection.
 * 
 * Features:
 * - Filter icon button with dropdown menu
 * - Search input for filtering options
 * - Suggested filters section for quick access
 * - All filters section organized by column
 * - Support for applying and resetting filters
 * - Outside click handling
 */
const FilterActionButton = ({
  columns = [],
  onFilterChange,
  customSuggestedFilters = [],
  position = "bottom",
  tooltipText = "Filter",
  className = "",
  disabled = false
}) => {
  // State
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Refs for click outside detection
  const filterMenuRef = useRef(null);
  const filterButtonRef = useRef(null);

  // Handle filter selection
  const handleFilterSelect = (filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
    setShowFilterMenu(false);
  };

  // Filter columns based on search term
  const getFilteredColumns = () => {
    if (!searchTerm.trim()) {
      return columns;
    }
    
    return columns.filter(column => {
      const columnName = column.Header || column.label || '';
      const filterName = column.filterName || '';
      return columnName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             filterName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Handle reset filters
  const handleResetFilters = () => {
    if (onFilterChange) {
      onFilterChange("reset");
    }
    setShowFilterMenu(false);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterMenuRef.current && 
          !filterMenuRef.current.contains(e.target) && 
          filterButtonRef.current && 
          !filterButtonRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Position class based on the position prop
  const positionClass = position === "top" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";

  return (
    <div className={`relative ${className}`}>
      <button
        ref={filterButtonRef}
        className={`p-2 rounded-md hover:bg-gray-100 border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={tooltipText}
        onClick={() => {
          if (!disabled) {
            setShowFilterMenu(!showFilterMenu);
          }
        }}
        disabled={disabled}
        aria-label="Toggle filter dropdown"
      >
        <Filter size={20} />
      </button>

      {showFilterMenu && (
        <div 
          ref={filterMenuRef} 
          className={`absolute right-0 ${positionClass} w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 flex flex-col`}
          style={{maxHeight: "70vh", overflow: "hidden"}}
          aria-label="Filter selection dropdown"
        >
          {/* Search input at the top */}
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <input 
                type="text" 
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md border-gray-300" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Scrollable content area */}
          <div className="overflow-y-auto flex-grow">
            {/* Suggested filters section */}
            {customSuggestedFilters.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                  Suggested
                </div>
                <div className="pb-2">
                  {customSuggestedFilters.map(filter => (
                    <button
                      key={filter.id}
                      className="flex items-center justify-between px-3 py-2 w-full text-sm text-left hover:bg-gray-100"
                      onClick={() => handleFilterSelect(filter.id)}
                    >
                      <span>{filter.label}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </>
            )}
            
            {/* All filters section */}
            <div className="px-3 pt-2 text-xs text-gray-500 font-medium border-t border-gray-200">
              All
            </div>
            <div className="py-2">
              {getFilteredColumns().map(column => (
                <button
                  key={column.accessor || column.id}
                  className="flex items-center justify-between px-3 py-2 w-full text-sm text-left hover:bg-gray-100"
                  onClick={() => handleFilterSelect(column.accessor || column.id)}
                >
                  <span>{column.filterName || column.Header || column.label}</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>

            <button 
              className="mt-4 w-full text-center text-sm font-medium text-gray-500 p-2 border-t border-gray-200"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

FilterActionButton.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      // Support both formats: React Table (Header/accessor) and custom (label/id)
      Header: PropTypes.string,
      accessor: PropTypes.string,
      id: PropTypes.string,
      label: PropTypes.string,
      filterName: PropTypes.string
    })
  ),
  onFilterChange: PropTypes.func.isRequired,
  customSuggestedFilters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  position: PropTypes.oneOf(['top', 'bottom']),
  tooltipText: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default FilterActionButton;