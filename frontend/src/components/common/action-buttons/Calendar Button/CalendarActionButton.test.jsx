import React from 'react';
import CalendarActionButton from './CalendarActionButton';

/**
 * This is a simple test component to demonstrate the CalendarActionButton
 * in isolation. This is not meant to be used in production.
 */
const CalendarActionButtonTest = () => {
  const handleDateRangeChange = (dateRange) => {
    console.log('Date range changed:', dateRange);
    // In a real application, you would update state or call an API here
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CalendarActionButton Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Default Usage</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            initialDateRange="Current month"
            tooltipText="Filter by date"
          />
          <span className="text-gray-500">← Default calendar button</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Position Top</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            initialDateRange="This month"
            position="top"
            tooltipText="Date filter (dropdown opens above)"
          />
          <span className="text-gray-500">← Dropdown opens above</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Styling</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            initialDateRange="Last month"
            className="bg-orange-50 rounded-full"
            tooltipText="Custom styled calendar"
          />
          <span className="text-gray-500">← Custom styling applied</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disabled State</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            initialDateRange="Custom range"
            disabled={true}
            tooltipText="Disabled calendar"
          />
          <span className="text-gray-500">← Disabled state</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarActionButtonTest;