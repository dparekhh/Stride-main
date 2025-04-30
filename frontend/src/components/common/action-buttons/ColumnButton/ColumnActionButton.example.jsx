import React, { useState } from 'react';
import ColumnActionButton from './ColumnActionButton';

/**
 * Example component to demonstrate the ColumnActionButton in a practical scenario
 */
const ColumnActionButtonExample = () => {
  // Sample columns
  const [columns] = useState([
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'status', label: 'Status' },
    { id: 'role', label: 'Role' },
    { id: 'department', label: 'Department' },
    { id: 'location', label: 'Location' },
    { id: 'joiningDate', label: 'Joining Date' },
    { id: 'manager', label: 'Manager' },
    { id: 'salary', label: 'Salary' }
  ]);

  // Default visible columns
  const defaultVisibleColumns = ['name', 'email', 'status', 'department'];

  // State to track visible columns for the example
  const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);
  
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
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Column Action Button Example</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Employee List</h2>
          
          <div className="flex space-x-2">
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={handleColumnVisibilityChange}
              onReset={handleReset}
            />
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample data rows */}
              <tr>
                {columns.map(column => (
                  visibleColumns.includes(column.id) && (
                    <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.id === 'name' && 'John Doe'}
                      {column.id === 'email' && 'john.doe@example.com'}
                      {column.id === 'phone' && '+1 (555) 123-4567'}
                      {column.id === 'status' && 'Active'}
                      {column.id === 'role' && 'Developer'}
                      {column.id === 'department' && 'Engineering'}
                      {column.id === 'location' && 'New York'}
                      {column.id === 'joiningDate' && '2023-01-15'}
                      {column.id === 'manager' && 'Jane Smith'}
                      {column.id === 'salary' && '$85,000'}
                    </td>
                  )
                ))}
              </tr>
              <tr>
                {columns.map(column => (
                  visibleColumns.includes(column.id) && (
                    <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.id === 'name' && 'Jane Smith'}
                      {column.id === 'email' && 'jane.smith@example.com'}
                      {column.id === 'phone' && '+1 (555) 987-6543'}
                      {column.id === 'status' && 'Active'}
                      {column.id === 'role' && 'Manager'}
                      {column.id === 'department' && 'Engineering'}
                      {column.id === 'location' && 'New York'}
                      {column.id === 'joiningDate' && '2022-03-10'}
                      {column.id === 'manager' && 'Robert Johnson'}
                      {column.id === 'salary' && '$110,000'}
                    </td>
                  )
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Currently Visible Columns:</h3>
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
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Variants</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Default</h3>
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={() => {}}
              onReset={() => {}}
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Top Position</h3>
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={() => {}}
              onReset={() => {}}
              position="top"
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Custom Style</h3>
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={() => {}}
              onReset={() => {}}
              className="bg-orange-50 rounded-full"
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Disabled</h3>
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={() => {}}
              onReset={() => {}}
              disabled={true}
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Custom Tooltip</h3>
            <ColumnActionButton
              columns={columns}
              defaultVisibleColumns={defaultVisibleColumns}
              onColumnVisibilityChange={() => {}}
              onReset={() => {}}
              tooltipText="Manage visible columns"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnActionButtonExample;