import React, { useState, useRef, useEffect } from 'react';
import { AlignJustify } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ColumnActionButton Component
 * 
 * A reusable button component that shows a columns icon and manages 
 * a dropdown for column visibility selection.
 * 
 * Features:
 * - Columns icon button with dropdown menu
 * - Checkbox list for toggling column visibility
 * - Reset functionality to restore default columns
 * - Drag handles for column reordering
 * - Outside click handling
 * - Configurable dropdown position
 */
const ColumnActionButton = ({
  columns = [],
  defaultVisibleColumns = [],
  onColumnVisibilityChange,
  onReset,
  position = "bottom",
  tooltipText = "Columns",
  className = "",
  disabled = false
}) => {
  // Dropdown toggle state
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  
  // Track visible columns
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // State to manage column order
  const [orderedColumns, setOrderedColumns] = useState([...columns]);
  
  // Ref for click-outside handling
  const columnsDropdownRef = useRef(null);
  const columnsButtonRef = useRef(null);

  // State to track dragging
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  // Update orderedColumns when columns prop changes
  useEffect(() => {
    setOrderedColumns([...columns]);
  }, [columns]);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnsDropdownRef.current && 
          !columnsDropdownRef.current.contains(event.target) &&
          columnsButtonRef.current &&
          !columnsButtonRef.current.contains(event.target)) {
        setShowColumnsDropdown(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId) => {
    let updatedVisibleColumns;
    
    if (visibleColumns.includes(columnId)) {
      // Remove column from visible list
      updatedVisibleColumns = visibleColumns.filter(id => id !== columnId);
    } else {
      // Add column to visible list
      updatedVisibleColumns = [...visibleColumns, columnId];
    }
    
    setVisibleColumns(updatedVisibleColumns);
    
    // Call the callback with the updated column ID and visibility state
    if (onColumnVisibilityChange) {
      onColumnVisibilityChange(columnId, !visibleColumns.includes(columnId));
    }
  };

  // Handle reset to default columns
  const handleReset = () => {
    setVisibleColumns(defaultVisibleColumns);
    setOrderedColumns([...columns]);
    
    // Call the reset callback
    if (onReset) {
      onReset();
    }
  };

  // Handle drag start
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverItem(index);
  };

  // Handle drop to reorder columns
  const handleDrop = () => {
    if (draggedItem === null || draggedOverItem === null) return;
    
    // Create a copy of the ordered columns
    const newOrderedColumns = [...orderedColumns];
    
    // Remove the dragged item from its original position
    const draggedColumn = newOrderedColumns.splice(draggedItem, 1)[0];
    
    // Insert the dragged item at the new position
    newOrderedColumns.splice(draggedOverItem, 0, draggedColumn);
    
    // Update the ordered columns state
    setOrderedColumns(newOrderedColumns);
    
    // Reset drag states
    setDraggedItem(null);
    setDraggedOverItem(null);
    
    // Update visible columns order if needed
    // Note: This assumes column IDs are unique
    if (onColumnVisibilityChange) {
      // Notifies parent component about the reordering
      // You may need to implement a separate callback for reordering if needed
      // For now, we use the existing callback
      const reorderedColumnIds = newOrderedColumns.map(col => col.id);
      // This is a bit of a hack to trigger a re-render with the new order
      // In a real app, you might want a separate callback like onColumnReorder
      reorderedColumnIds.forEach((id, index) => {
        if (visibleColumns.includes(id)) {
          onColumnVisibilityChange(id, true, index);
        }
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // Position class based on the position prop
  const positionClass = position === "top" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";

  return (
    <div className={`relative ${className}`}>
      <button 
        ref={columnsButtonRef}
        className={`p-2 rounded-md hover:bg-gray-100 border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={tooltipText}
        onClick={() => {
          if (!disabled) {
            setShowColumnsDropdown(!showColumnsDropdown);
          }
        }}
        disabled={disabled}
        aria-label="Toggle columns dropdown"
      >
        <AlignJustify size={20} />
      </button>

      {showColumnsDropdown && (
        <div 
          ref={columnsDropdownRef}
          className={`absolute right-0 ${positionClass} w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50`} 
          style={{maxHeight: "50vh", maxWidth: "300px", overflowY: "auto"}}
          aria-label="Column visibility selection dropdown"
        >
          <div className="p-3 flex flex-col">
            <div className="space-y-2">
              {orderedColumns.map((column, index) => (
                <div 
                  key={column.id} 
                  className={`flex items-center p-1 ${draggedItem === index ? 'opacity-50 bg-blue-50' : ''} 
                             ${draggedOverItem === index ? 'border-t-2 border-blue-500' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                >
                  <input 
                    type="checkbox" 
                    id={`col-${column.id}`} 
                    className="mr-2"
                    checked={visibleColumns.includes(column.id)}
                    onChange={() => toggleColumnVisibility(column.id)}
                  />
                  <label htmlFor={`col-${column.id}`} className="text-sm flex-grow">
                    {column.label}
                  </label>
                  <div 
                    className="cursor-move px-1 select-none"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ≡
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="mt-4 w-full text-center text-sm font-medium text-gray-500 p-2 border-t border-gray-200 hover:bg-gray-50"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ColumnActionButton.propTypes = {
  /** Array of column objects with id and label properties */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  /** Array of column IDs that should be visible by default */
  defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string),
  /** Callback function when column visibility changes */
  onColumnVisibilityChange: PropTypes.func.isRequired,
  /** Callback function when columns are reset to default */
  onReset: PropTypes.func.isRequired,
  /** Dropdown menu position (top or bottom) */
  position: PropTypes.oneOf(['top', 'bottom']),
  /** Tooltip text for the button */
  tooltipText: PropTypes.string,
  /** Optional CSS classes */
  className: PropTypes.string,
  /** Whether the button is disabled */
  disabled: PropTypes.bool
};

export default ColumnActionButton;