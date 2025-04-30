import React, { useState } from 'react';
import FilterActionButton from './FilterActionButton';

/**
 * Example usage of the FilterActionButton component
 */
const FilterActionButtonExample = () => {
  // Sample data for demonstration
  const [activeFilter, setActiveFilter] = useState(null);
  
  // Define column structure (similar to table columns)
  const columns = [
    { 
      Header: 'Transaction Date', 
      accessor: 'transactionDate',
      filterName: 'Date'
    },
    { 
      Header: 'Merchant', 
      accessor: 'merchant' 
    },
    { 
      Header: 'Amount', 
      accessor: 'amount' 
    },
    { 
      Header: 'Category', 
      accessor: 'category' 
    },
    { 
      Header: 'Status', 
      accessor: 'status' 
    },
    { 
      Header: 'Receipt Status', 
      accessor: 'receiptStatus',
      filterName: 'Receipt' 
    },
    { 
      Header: 'Approval Status', 
      accessor: 'approvalStatus' 
    }
  ];
  
  // Define suggested filters
  const suggestedFilters = [
    { id: 'amount', label: 'Amount' },
    { id: 'flagged', label: 'Flagged' },
    { id: 'receipt', label: 'Receipt status' },
    { id: 'department', label: 'Department' }
  ];
  
  // Handle filter selection
  const handleFilterChange = (filterId) => {
    console.log('Filter selected:', filterId);
    
    if (filterId === 'reset') {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterId);
    }
  };
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">FilterActionButton Example</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <div className="flex items-center space-x-4 p-2 border border-gray-200 rounded">
          <FilterActionButton
            columns={columns}
            onFilterChange={handleFilterChange}
            customSuggestedFilters={suggestedFilters}
          />
          <span className="text-sm text-gray-500">
            {activeFilter ? `Active filter: ${activeFilter}` : 'No filter active'}
          </span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Top Position</h3>
        <div className="flex items-center space-x-4 p-2 border border-gray-200 rounded">
          <FilterActionButton
            columns={columns}
            onFilterChange={handleFilterChange}
            customSuggestedFilters={suggestedFilters}
            position="top"
          />
          <span className="text-sm">Opens dropdown above the button</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Custom Tooltip</h3>
        <div className="flex items-center space-x-4 p-2 border border-gray-200 rounded">
          <FilterActionButton
            columns={columns}
            onFilterChange={handleFilterChange}
            customSuggestedFilters={suggestedFilters}
            tooltipText="Filter transactions"
          />
          <span className="text-sm">Hover to see custom tooltip</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Disabled State</h3>
        <div className="flex items-center space-x-4 p-2 border border-gray-200 rounded">
          <FilterActionButton
            columns={columns}
            onFilterChange={handleFilterChange}
            customSuggestedFilters={suggestedFilters}
            disabled={true}
          />
          <span className="text-sm">Button is disabled</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Custom Class</h3>
        <div className="flex items-center space-x-4 p-2 border border-gray-200 rounded">
          <FilterActionButton
            columns={columns}
            onFilterChange={handleFilterChange}
            customSuggestedFilters={suggestedFilters}
            className="shadow-md"
          />
          <span className="text-sm">With custom shadow class applied</span>
        </div>
      </div>
    </div>
  );
};

export default FilterActionButtonExample;