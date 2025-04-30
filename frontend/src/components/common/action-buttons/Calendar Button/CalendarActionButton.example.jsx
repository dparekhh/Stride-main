import React, { useState } from 'react';
import CalendarActionButton from './CalendarActionButton';

/**
 * Example component to demonstrate the CalendarActionButton in a practical scenario
 */
const CalendarActionButtonExample = () => {
  const [currentDateRange, setCurrentDateRange] = useState({
    label: 'Current month',
    startDate: null,
    endDate: null
  });

  // Initialize dates for current month on first render
  useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setCurrentDateRange({
      label: 'Current month',
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
  }, []);

  const handleDateRangeChange = (dateRange) => {
    console.log('Date range changed:', dateRange);
    setCurrentDateRange(dateRange);
    
    // In a real application, you might fetch data based on the new date range
    // fetchData(dateRange.startDate, dateRange.endDate);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    // Convert from YYYY-MM-DD to more readable format
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Date Range Filter Example</h1>
      
      <div className="mb-6 flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md">
        <div>
          <span className="font-medium">Current Filter: </span>
          <span className="text-orange-600">{currentDateRange.label}</span>
        </div>
        
        <CalendarActionButton
          onDateRangeChange={handleDateRangeChange}
          initialDateRange={currentDateRange.label}
          tooltipText="Change date range"
        />
      </div>
      
      <div className="border border-gray-200 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-3">Selected Date Range Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{formatDate(currentDateRange.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{formatDate(currentDateRange.endDate)}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          In a real application, this component would trigger data fetching or filtering
          based on the selected date range. The component handles all the UI interactions,
          date calculations, and validation internally.
        </p>
      </div>
    </div>
  );
};

export default CalendarActionButtonExample;