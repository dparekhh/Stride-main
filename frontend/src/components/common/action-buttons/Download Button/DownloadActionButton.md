# DownloadActionButton

A reusable button component for handling download actions in the application.

## Features

- Simple, consistent button for download actions
- Support for disabled state
- Tooltips for better UX
- Customizable styling

## Basic Usage

```jsx
import React from 'react';
import DownloadActionButton from './components/common/action-buttons/Download Button/DownloadActionButton';

const ExampleComponent = () => {
  const handleDownload = () => {
    // Handle download logic here
    console.log('Downloading data...');
  };

  return (
    <div className="flex items-center justify-between">
      <h1>Transactions</h1>
      
      <DownloadActionButton
        onDownload={handleDownload}
        tooltipText="Export transactions"
      />
    </div>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDownload` | function | (required) | Function to call when the download button is clicked |
| `tooltipText` | string | "Download" | Text to display in the tooltip |
| `disabled` | boolean | false | Whether the button is disabled |
| `className` | string | "" | Additional CSS classes to apply to the component |

## Examples

### Default Button

```jsx
<DownloadActionButton
  onDownload={() => handleDownload()}
  tooltipText="Download data"
/>
```

### Disabled State

```jsx
<DownloadActionButton
  onDownload={() => handleDownload()}
  tooltipText="No data to download"
  disabled={true}
/>
```

### Custom Styling

```jsx
<DownloadActionButton
  onDownload={() => handleDownload()}
  tooltipText="Download report"
  className="bg-orange-50 rounded-full"
/>
```

## Integration Guide

To migrate from the old download button implementation to this reusable component:

1. Import the component:
   ```jsx
   import DownloadActionButton from '../components/common/action-buttons/Download Button/DownloadActionButton';
   ```

2. Create a download handler function if you don't already have one:
   ```jsx
   const handleDownload = () => {
     // Export logic goes here
     console.log('Downloading data:', data);
     // You can use a utility function to handle the actual download
     // exportToExcel(data, 'filename.xlsx');
   };
   ```

3. Replace the old download button JSX with the new component:
   ```jsx
   // Old implementation
   <button className="p-2 rounded-md hover:bg-gray-100" title="Download">
     <Download size={20} />
   </button>
   
   // New implementation
   <DownloadActionButton
     onDownload={handleDownload}
     tooltipText="Download data"
   />
   ```

4. Add conditional logic if needed:
   ```jsx
   <DownloadActionButton
     onDownload={handleDownload}
     tooltipText={hasData ? "Download data" : "No data to download"}
     disabled={!hasData}
   />
   ```

## Best Practices

- Use clear, descriptive tooltip text that explains what will be downloaded
- Disable the button when there's no data to download
- Place the button consistently in the UI (usually in action bars or toolbars)
- Consider adding a visual indication when download is in progress