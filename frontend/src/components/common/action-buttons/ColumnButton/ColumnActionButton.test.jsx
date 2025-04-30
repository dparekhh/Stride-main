import React, { useState } from 'react';
import ColumnActionButton from './ColumnActionButton';

/**
 * This is a simple test component to demonstrate the ColumnActionButton
 * in isolation. This is not meant to be used in production.
 */
const ColumnActionButtonTest = () => {
  // Sample columns
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email Address' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'updatedAt', label: 'Updated At' },
    { id: 'role', label: 'Role' },
    { id: 'department', label: 'Department' },
    { id: 'manager', label: 'Manager' },
    { id: 'location', label: 'Location' },
    { id: 'salary', label: 'Salary' }
  ];

  // Default visible columns
  const defaultVisibleColumns = ['id', 'name', 'email', 'status', 'department'];

  // State to track visible columns for the example
  const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);
  
  // Track last action for demonstration purposes
  const [lastAction, setLastAction] = useState('');
  
  // Handle column visibility change
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    if (isVisible) {
      setVisibleColumns(prev => [...prev, columnId]);
      setLastAction(`Column "${columnId}" was made visible`);
    } else {
      setVisibleColumns(prev => prev.filter(id => id !== columnId));
      setLastAction(`Column "${columnId}" was hidden`);
    }
  };
  
  // Handle reset to default columns
  const handleReset = () => {
    setVisibleColumns([...defaultVisibleColumns]);
    setLastAction('Columns reset to default');
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Column Action Button Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Default Usage</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <ColumnActionButton
            columns={columns}
            defaultVisibleColumns={defaultVisibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onReset={handleReset}
          />
          <span className="text-gray-500">← Click to toggle column visibility</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Top Position</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <ColumnActionButton
            columns={columns}
            defaultVisibleColumns={defaultVisibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onReset={handleReset}
            position="top"
          />
          <span className="text-gray-500">← Dropdown opens above the button</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Styling</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <ColumnActionButton
            columns={columns}
            defaultVisibleColumns={defaultVisibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onReset={handleReset}
            className="bg-orange-50 rounded-full"
            tooltipText="Custom styled column selector"
          />
          <span className="text-gray-500">← Custom styling applied</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disabled State</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <ColumnActionButton
            columns={columns}
            defaultVisibleColumns={defaultVisibleColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onReset={handleReset}
            disabled={true}
            tooltipText="Disabled column selector"
          />
          <span className="text-gray-500">← Disabled state</span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Currently Visible Columns</h2>
        <div className="flex flex-wrap gap-2">
          {visibleColumns.map(columnId => {
            const column = columns.find(col => col.id === columnId);
            return column ? (
              <span key={columnId} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs">
                {column.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
      
      {lastAction && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h2 className="text-sm font-semibold text-blue-800 mb-1">Last Action</h2>
          <p className="text-blue-700">{lastAction}</p>
        </div>
      )}
    </div>
  );
};

export default ColumnActionButtonTest;