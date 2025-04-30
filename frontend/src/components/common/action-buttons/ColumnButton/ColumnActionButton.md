# ColumnActionButton Component

The `ColumnActionButton` is a reusable component that provides a standardized way to implement column visibility control in the Stride application. It encapsulates the columns icon, dropdown menu, checkbox list, and reset functionality.

## Features

- Columns icon button with dropdown menu
- Checkbox list for toggling column visibility
- Reset functionality to restore default columns
- Optional drag handles for column reordering (preparation for future enhancement)
- Outside click handling to close the dropdown
- Configurable dropdown position
- Consistent styling with our design system
- Accessibility support

## Props Interface

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| columns | Array | required | Array of column objects with id and label properties |
| defaultVisibleColumns | Array | [] | Array of column IDs that should be visible by default |
| onColumnVisibilityChange | function | required | Callback for when column visibility changes |
| onReset | function | required | Callback for when columns are reset to default |
| position | string | "bottom" | Dropdown menu position (top/bottom) |
| tooltipText | string | "Columns" | Tooltip text for the button |
| className | string | "" | Custom CSS classes to apply to the button |
| disabled | boolean | false | Whether the button is disabled |

## Basic Usage

```jsx
import React, { useState } from 'react';
import ColumnActionButton from './components/common/action-buttons/ColumnButton/ColumnActionButton';

const MyComponent = () => {
  // Define columns
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'status', label: 'Status' },
    { id: 'role', label: 'Role' }
  ];
  
  // Set default visible columns
  const defaultVisibleColumns = ['name', 'email', 'status'];
  
  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);
  
  // Handle column visibility change
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    if (isVisible) {
      setVisibleColumns(prev => [...prev, columnId]);
    } else {
      setVisibleColumns(prev => prev.filter(id => id !== columnId));
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setVisibleColumns([...defaultVisibleColumns]);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Users</h1>
        
        <ColumnActionButton
          columns={columns}
          defaultVisibleColumns={defaultVisibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onReset={handleReset}
        />
      </div>
      
      {/* Render table with visibleColumns */}
      <table>
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
          {/* Table rows */}
        </tbody>
      </table>
    </div>
  );
};
```

## Variants

### Top Position

```jsx
<ColumnActionButton
  columns={columns}
  defaultVisibleColumns={defaultVisibleColumns}
  onColumnVisibilityChange={handleColumnVisibilityChange}
  onReset={handleReset}
  position="top"
/>
```

### Custom Styling

```jsx
<ColumnActionButton
  columns={columns}
  defaultVisibleColumns={defaultVisibleColumns}
  onColumnVisibilityChange={handleColumnVisibilityChange}
  onReset={handleReset}
  className="bg-orange-50 rounded-full"
/>
```

### Disabled State

```jsx
<ColumnActionButton
  columns={columns}
  defaultVisibleColumns={defaultVisibleColumns}
  onColumnVisibilityChange={handleColumnVisibilityChange}
  onReset={handleReset}
  disabled={true}
/>
```

## Implementation Notes

1. The component maintains its own internal state for the dropdown visibility
2. The component should be used with parent-managed column visibility state
3. The onReset callback should reset the parent's column visibility state to default
4. For accessibility, the component includes proper aria attributes and keyboard navigation