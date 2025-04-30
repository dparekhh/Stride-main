# CalendarActionButton Component

The `CalendarActionButton` is a reusable component that provides a standardized way to implement date range filtering in the Stride application. It encapsulates the calendar icon, dropdown menu, date range options, and custom date range picker functionality.

## Features

- Calendar icon button with dropdown menu
- Predefined date range options (Today, Yesterday, This month, Last month)
- Custom date range with start/end date inputs
- Support for applying and resetting date filters
- Tooltips for better UX
- Handles outside clicks to close dropdown
- Keyboard navigation support
- Consistent styling with our design system
- Accessibility support

## Props Interface

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| onDateRangeChange | function | required | Callback for when date range changes |
| initialDateRange | string | "Current month" | Default selected date range |
| position | string | "bottom" | Dropdown menu position (top/bottom) |
| customDateFormat | string | null | Optional date format override |
| tooltipText | string | "Calendar" | Optional custom tooltip text |
| className | string | "" | Optional custom CSS classes |
| disabled | boolean | false | Optional disabled state |

## Usage Example

```jsx
import React, { useState } from 'react';
import CalendarActionButton from '../components/common/action-buttons/CalendarActionButton';

const TransactionsPage = () => {
  // Handler for date range changes
  const handleDateRangeChange = (dateRange) => {
    console.log('Date range changed:', dateRange);
    
    // Example: Update transaction filtering through context
    if (setTransactionFilter) {
      setTransactionFilter('dateRange', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1>Transactions</h1>
        
        <div className="flex space-x-2">
          {/* Basic usage */}
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            initialDateRange="Current month"
            tooltipText="Filter by date"
          />
          
          {/* With custom position */}
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            position="top"
            tooltipText="Date range"
          />
          
          {/* With custom styling */}
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            className="bg-orange-50 rounded-full"
            tooltipText="Select dates"
          />
          
          {/* Disabled state */}
          <CalendarActionButton
            onDateRangeChange={handleDateRangeChange}
            disabled={true}
            tooltipText="Calendar (disabled)"
          />
        </div>
      </div>
    </div>
  );
};
```

## Date Range Format

The component returns a date range object with the following structure:

```javascript
{
  startDate: "2025-04-01", // In YYYY-MM-DD format
  endDate: "2025-04-30",   // In YYYY-MM-DD format
  label: "This month"      // User-friendly label for the selected range
}
```

## Integration Guide

To migrate from the old calendar implementation to this reusable component:

1. Import the component:
   ```jsx
   import CalendarActionButton from '../components/common/action-buttons/CalendarActionButton';
   ```

2. Remove the old state variables:
   ```jsx
   // Remove these lines
   const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
   const [dateRange, setDateRange] = useState("Current month");
   const [showCustomDateRange, setShowCustomDateRange] = useState(false);
   const [customStartDate, setCustomStartDate] = useState("");
   const [customEndDate, setCustomEndDate] = useState("");
   const calendarRef = useRef(null);
   const calendarButtonRef = useRef(null);
   ```

3. Create a date range change handler:
   ```jsx
   const handleDateRangeChange = (dateRange) => {
     // Update transaction filtering through context
     if (setTransactionFilter) {
       setTransactionFilter('dateRange', {
         startDate: dateRange.startDate,
         endDate: dateRange.endDate
       });
     }
   };
   ```

4. Replace the old calendar JSX with the new component:
   ```jsx
   <CalendarActionButton
     onDateRangeChange={handleDateRangeChange}
     initialDateRange="Current month"
     tooltipText="Filter by date"
   />
   ```

5. Remove the old calendar helper functions if they're not used elsewhere:
   ```jsx
   // Remove these functions if not needed elsewhere
   const applyDateFilter = (range) => {...};
   const resetDateFilters = () => {...};
   const applyCustomDateRange = () => {...};
   ```

## Accessibility Considerations

The component includes:
- Keyboard navigation support
- Aria labels
- Focus management
- Color contrast compliance

## Best Practices

- Provide meaningful tooltip text
- Use consistent date format throughout the application
- Handle loading states appropriately by using the `disabled` prop
- For custom styling, use the `className` prop rather than direct CSS targeting