# FilterActionButton

A reusable button component that displays a filter icon and manages a dropdown for filter selection.

## Features

- Filter icon button with dropdown menu
- Search input for filtering options
- Suggested filters section for quick access
- All filters section organized by column
- Support for applying and resetting filters
- Outside click handling

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Array` | `[]` | Array of column objects with Header, accessor/id, and optional filterName properties |
| `onFilterChange` | `Function` | Required | Callback function called when a filter is selected |
| `customSuggestedFilters` | `Array` | `[]` | Array of suggested filter objects with id and label properties |
| `position` | `String` | `"bottom"` | Position of the dropdown - "top" or "bottom" |
| `tooltipText` | `String` | `"Filter"` | Tooltip text for the filter button |
| `className` | `String` | `""` | Additional classes to apply to the component |
| `disabled` | `Boolean` | `false` | Whether the filter button is disabled |

## Usage

```jsx
import FilterActionButton from '../components/common/action-buttons/FilterButton/FilterActionButton';

// Define columns with filter information
const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'Date', accessor: 'date', filterName: 'Date Range' }
];

// Define custom suggested filters
const suggestedFilters = [
  { id: 'recent', label: 'Recent Items' },
  { id: 'flagged', label: 'Flagged Items' }
];

// Handle filter selection
const handleFilterChange = (filterId) => {
  console.log('Filter selected:', filterId);
  // Apply filter logic based on filterId
};

// Render component
<FilterActionButton
  columns={columns}
  onFilterChange={handleFilterChange}
  customSuggestedFilters={suggestedFilters}
  position="bottom"
  tooltipText="Filter items"
/>
```

## Example

See the example usage in `FilterActionButton.example.jsx`