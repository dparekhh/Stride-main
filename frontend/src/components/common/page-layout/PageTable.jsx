// src/components/common/PageTable.jsx
import React from "react";

/**
 * PageTable - Standardized table component for consistent styling across the application
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column configuration objects
 * @param {Array} props.data - Array of data objects to display
 * @param {boolean} props.loading - Whether the table is in a loading state
 * @param {string} props.emptyMessage - Message to display when there's no data
 * @param {function} props.onRowClick - Optional callback when a row is clicked
 * @param {object} props.containerStyles - Additional styles for the container
 * @returns {ReactElement} Standardized table component
 */
const PageTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  containerStyles = {}
}) => {
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden" style={containerStyles}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.id || index}
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sticky ? 'sticky left-0 z-10 bg-gray-50' : ''
                  } ${column.className || ''}`}
                  style={column.style || {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex} 
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={`${rowIndex}-${column.id || colIndex}`}
                      className={`px-3 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.sticky ? 'sticky left-0 z-10 bg-white' : ''
                      } ${column.cellClassName || ''}`}
                      style={column.cellStyle || {}}
                    >
                      {column.render ? column.render(item) : item[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageTable;