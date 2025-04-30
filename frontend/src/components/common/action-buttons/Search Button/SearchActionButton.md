# SearchActionButton Component

The `SearchActionButton` is a reusable component that provides a standardized way to implement search functionality in the Stride application. It encapsulates the search icon, input field, and the search logic in a consistent manner.

## Features

- Search icon with integrated input field
- Customizable placeholder text
- Callback for search term changes
- Consistent styling with our design system
- Support for custom width
- Option to remove the border
- Disabled state support
- Accessibility support

## Props Interface

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| onSearchChange | function | required | Callback for when search term changes |
| initialSearchTerm | string | '' | Default search term in the input |
| placeholder | string | 'Search...' | Placeholder text shown in the input |
| className | string | '' | Optional custom CSS classes |
| width | string | '3/4' | Width of the search input (Tailwind width class fraction) |
| noBorder | boolean | false | Whether to remove the border from the input |
| disabled | boolean | false | Whether the search input is disabled |

## Integration Guide

To migrate from the old search implementation to this reusable component:

1. Import the component:
   ```jsx
   import SearchActionButton from '../components/common/action-buttons/Search Button/SearchActionButton';
   ```

2. Remove the old state variables and search input implementation:
   ```jsx
   // Remove these lines
   const [searchTerm, setSearchTerm] = useState("");
   const searchInputRef = useRef(null);
   
   // Also remove the search input JSX
   <div className="relative flex-grow mr-4" ref={searchInputRef}>
     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
       <Search size={18} className="text-gray-400" />
     </div>
     <input
       type="text"
       className="block w-3/4 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
       placeholder="Search by merchant, cardholder, or transaction ID"
       value={searchTerm}
       onChange={handleSearchChange}
     />
   </div>
   ```

3. Create a search change handler (if you don't already have one):
   ```jsx
   const handleSearchChange = (newSearchTerm) => {
     // Update transaction filtering through context
     if (setTransactionFilter) {
       setTransactionFilter('searchTerm', newSearchTerm);
     }
   };
   ```

4. Replace the old search JSX with the new component:
   ```jsx
   <SearchActionButton
     onSearchChange={handleSearchChange}
     placeholder="Search by merchant, cardholder, or transaction ID"
     className="mr-4"
   />
   ```

## Usage Examples

### Basic Usage

```jsx
<SearchActionButton
  onSearchChange={(term) => console.log('Search term:', term)}
  placeholder="Search..."
/>
```

### Without Border

```jsx
<SearchActionButton
  onSearchChange={(term) => console.log('Search term:', term)}
  placeholder="Search without border..."
  noBorder={true}
/>
```

### Custom Width

```jsx
<SearchActionButton
  onSearchChange={(term) => console.log('Search term:', term)}
  placeholder="Half width search..."
  width="1/2"
/>
```

### Custom Styling

```jsx
<SearchActionButton
  onSearchChange={(term) => console.log('Search term:', term)}
  placeholder="Custom styled search..."
  className="bg-orange-50 rounded-lg"
/>
```

### Disabled State

```jsx
<SearchActionButton
  onSearchChange={(term) => console.log('Search term:', term)}
  placeholder="Disabled search input..."
  disabled={true}
/>
```

## Best Practices

1. Always provide a clear placeholder text that indicates what users can search for.
2. Use the `onSearchChange` callback to update the filtering or search state in your parent component.
3. Consider debouncing the search callback for better performance in scenarios with large datasets.
4. Use consistent width across similar pages for a better user experience.
5. The default width is '3/4' which works well in most layouts, but customize if needed.
6. Add labels for accessibility when the placeholder alone is not sufficient for describing the search function.

## Accessibility Considerations

- The component uses semantic HTML elements for better screen reader support.
- The search input has a visible search icon to indicate its purpose.
- When used in a form, make sure to add appropriate `aria-label` attributes if needed.
- The disabled state is properly conveyed to assistive technologies.

## Browser Compatibility

This component is compatible with all modern browsers including:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers