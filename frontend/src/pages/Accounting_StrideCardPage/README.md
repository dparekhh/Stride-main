# Accounting_StrideCardPage Module

This document explains the modular architecture of the Accounting_StrideCardPage component, which was refactored from a monolithic 1000+ line component into a structured, maintainable set of components and hooks.

## Directory Structure

```
frontend/src/pages/Accounting_StrideCardPage/
├── index.jsx                    // Main entry point that exports the page component
├── components/                  // Subcomponents
│   ├── StrideCardTable.jsx      // Main transaction table
│   ├── StrideCardHeader.jsx     // Page header with tabs and counts
│   ├── StrideCardFilters.jsx    // Search, date, and other filters
│   └── ActionButtons.jsx        // Export, Settings, etc.
├── hooks/                       // Custom hooks
│   ├── useTransactionData.jsx   // For managing transaction data
│   ├── useTransactionFilters.jsx // For managing filters
│   ├── useTransactionSelection.jsx // For checkbox selection
│   └── useModalsAndDrawers.jsx  // For modal and drawer state
└── utils/                       // Helper functions
    ├── filterUtils.js           // Date filtering functions 
    └── tableUtils.js            // Table-specific helpers
```

## Component Overview

The main `index.jsx` file acts as a coordinator that imports and composes smaller components and hooks, each with a single responsibility:

1. **StrideCardTable**: Displays transaction data in a table format with checkboxes and category dropdowns.
2. **StrideCardHeader**: Handles the header with tabs and transaction counts.
3. **StrideCardFilters**: Manages filtering options like date and column visibility.
4. **ActionButtons**: Provides buttons for export, refresh, settings, and other actions.

## Custom Hooks

The component logic is separated into custom hooks that manage specific aspects of the component's state and behavior:

1. **useTransactionData**: Fetches and manages transaction data and provider information.
2. **useTransactionFilters**: Handles search, date filtering, and column management.
3. **useTransactionSelection**: Manages checkbox selection state for transaction operations.
4. **useModalsAndDrawers**: Controls the state of modals and drawers for editing transactions.

## Utility Functions

Common utility functions are extracted into dedicated files to promote reusability:

1. **filterUtils.js**: Contains date-related filter functions.
2. **tableUtils.js**: Provides formatting and styling utilities for table data.

## How to Extend

### Adding a New Feature

1. Determine which component or hook should handle the new feature.
2. Add the necessary state and functions to the appropriate hook.
3. Update the component(s) to use the new functionality.
4. If needed, add new utility functions to support the feature.

### Modifying Existing Behavior

1. Locate the component or hook responsible for the behavior.
2. Make the necessary changes, keeping in mind the single responsibility principle.
3. Update any dependent components as needed.

## Best Practices

1. Keep components focused on rendering UI and delegating logic to hooks.
2. Maintain stateful logic in custom hooks rather than components.
3. Keep utility functions pure and focused on a single task.
4. Use proper prop types and default props for components.
5. When adding new features, consider whether they belong in an existing module or require a new one.