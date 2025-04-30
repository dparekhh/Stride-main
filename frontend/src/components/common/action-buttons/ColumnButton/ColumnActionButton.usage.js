/**
 * ColumnActionButton - Migration Guide
 * 
 * This guide shows how to migrate from an inline column management
 * implementation to the reusable ColumnActionButton component.
 */

const EXAMPLE_CODE = `
/**
 * Step 1: Import the ColumnActionButton component
 */
import ColumnActionButton from '../components/common/action-buttons/ColumnButton/ColumnActionButton';

/**
 * Step 2: Set up your column definitions and state
 * 
 * Define your columns array with id and label for each column
 * Initialize visible columns state
 */
// Define columns
const columns = [
  { id: 'merchant', label: 'Merchant' },
  { id: 'date', label: 'Date' },
  { id: 'cardholder', label: 'Cardholder' },
  { id: 'card', label: 'Card' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'department', label: 'Department' },
  { id: 'category', label: 'Category' },
  { id: 'location', label: 'Location' },
  { id: 'amount', label: 'Amount' },
  { id: 'spentFrom', label: 'Spent From' }
];

// Default visible columns
const defaultVisibleColumns = ['merchant', 'date', 'cardholder', 'card', 'amount'];

// Initialize visible columns state
const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);

/**
 * Step 3: Create handlers for column visibility and reset
 */
// Handle column visibility change
const handleColumnVisibilityChange = (columnId, isVisible) => {
  if (isVisible) {
    setVisibleColumns(prev => [...prev, columnId]);
  } else {
    setVisibleColumns(prev => prev.filter(id => id !== columnId));
  }
};

// Handle reset to default columns
const handleReset = () => {
  setVisibleColumns([...defaultVisibleColumns]);
};

/**
 * Step 4: Remove old column dropdown code
 * 
 * Delete the previous column dropdown implementation, including:
 * - showColumnsDropdown state
 * - columnsDropdownRef
 * - useEffect for click outside handling
 */
// BEFORE - Delete this code
const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
const columnsDropdownRef = useRef(null);

useEffect(() => {
  function handleClickOutside(event) {
    if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(event.target)) {
      setShowColumnsDropdown(false);
    }
  }
  
  document.addEventListener("mousedown", handleClickOutside);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

/**
 * Step 5: Replace the old columns button implementation with the ColumnActionButton
 */
// BEFORE:
<div className="relative" ref={columnsDropdownRef}>
  <button 
    className="p-2 rounded-md hover:bg-gray-100" 
    title="Columns"
    onClick={() => {
      setShowColumnsDropdown(!showColumnsDropdown);
      setShowCalendarDropdown(false);
      setShowFilterMenu(false);
    }}
  >
    <AlignJustify size={20} />
  </button>

  {showColumnsDropdown && (
    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{maxHeight: "50vh", maxWidth: "300px", overflowY: "auto"}}>
      <div className="p-3 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center p-1">
            <input type="checkbox" id="col-amount" className="mr-2" defaultChecked />
            <label htmlFor="col-amount" className="text-sm flex-grow">Amount</label>
            <div className="cursor-move px-1">≡</div>
          </div>
          {/* more column checkboxes */}
        </div>
        <button className="mt-4 w-full text-center text-sm font-medium text-gray-500 p-2 border-t border-gray-200">
          Reset
        </button>
      </div>
    </div>
  )}
</div>

// AFTER:
<ColumnActionButton
  columns={columns}
  defaultVisibleColumns={defaultVisibleColumns}
  onColumnVisibilityChange={handleColumnVisibilityChange}
  onReset={handleReset}
/>

/**
 * Step 6: Update your table to use the visibleColumns state
 * 
 * Modify your table header and rows to conditionally render
 * columns based on the visibleColumns state
 */
// BEFORE:
<thead className="bg-gray-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cardholder</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
    ...
  </tr>
</thead>

// AFTER:
<thead className="bg-gray-50">
  <tr>
    {columns.map(column => (
      visibleColumns.includes(column.id) && (
        <th key={column.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {column.label}
        </th>
      )
    ))}
  </tr>
</thead>

// Apply the same pattern to table rows:
<tr>
  {columns.map(column => (
    visibleColumns.includes(column.id) && (
      <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm">
        {row[column.id]}
      </td>
    )
  ))}
</tr>

/**
 * Complete Migration Example
 * 
 * Here's a condensed version of a fully migrated implementation:
 */
// Import the component
import React, { useState } from 'react';
import ColumnActionButton from '../components/common/action-buttons/ColumnButton/ColumnActionButton';

const TransactionsTable = () => {
  // Define columns
  const columns = [
    { id: 'merchant', label: 'Merchant' },
    { id: 'date', label: 'Date' },
    { id: 'cardholder', label: 'Cardholder' },
    { id: 'card', label: 'Card' },
    { id: 'amount', label: 'Amount' },
    { id: 'department', label: 'Department' },
    { id: 'category', label: 'Category' },
  ];
  
  // Default visible columns
  const defaultVisibleColumns = ['merchant', 'date', 'cardholder', 'amount'];
  
  // Manage visible columns
  const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);
  
  // Column visibility handler
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    if (isVisible) {
      setVisibleColumns(prev => [...prev, columnId]);
    } else {
      setVisibleColumns(prev => prev.filter(id => id !== columnId));
    }
  };
  
  // Reset handler
  const handleReset = () => {
    setVisibleColumns([...defaultVisibleColumns]);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Transactions</h2>
        
        <div className="flex space-x-2">
          <ColumnActionButton
            columns={columns}
            defaultVisibleColumns={defaultVisibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onReset={handleReset}
          />
        </div>
      </div>
      
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map(column => (
              visibleColumns.includes(column.id) && (
                <th key={column.id}>{column.label}</th>
              )
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              {columns.map(column => (
                visibleColumns.includes(column.id) && (
                  <td key={column.id}>{transaction[column.id]}</td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
`;

// This is a documentation file, not meant to be executed
export default { EXAMPLE_CODE };