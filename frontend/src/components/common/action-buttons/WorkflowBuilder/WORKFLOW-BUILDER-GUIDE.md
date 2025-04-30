# WorkflowBuilder Component Guide

## Overview

The `WorkflowBuilder` component is a reusable UI element for creating workflow diagrams with conditions and actions. 
It was extracted from the `SubmissionPolicyBuilder` component to enable reuse across the application.

## Design Philosophy

The component follows these key design principles:

1. **Separation of Concerns**: Clear distinction between UI rendering and state management
2. **Flexibility**: Supports both internal and external state management
3. **Customization**: Allows custom content via children props
4. **Consistency**: Maintains the same visual design as the original implementation

## Usage Modes

### 1. External State Management

In this mode, the parent component manages the state of conditions and provides handler functions:

```jsx
const [conditions, setConditions] = useState([]);

// State management handlers
const handleConditionAdd = (condition) => {
  setConditions([...conditions, condition]);
};

const handleConditionDelete = (index) => {
  const updatedConditions = [...conditions];
  updatedConditions.splice(index, 1);
  setConditions(updatedConditions);
};

// Use the component with external state management
<WorkflowBuilder
  conditions={conditions}
  onConditionAdd={handleConditionAdd}
  onConditionDelete={handleConditionDelete}
  onConditionUpdate={handleConditionUpdate}
  onLogicOperatorToggle={handleLogicOperatorToggle}
/>
```

### 2. Internal State Management

In this mode, the WorkflowBuilder component handles its own state:

```jsx
// No external state or handlers needed
<WorkflowBuilder
  useInternalState={true}
  customOptions={options}
  triggerText="When"
  triggerHighlight="Process Starts"
  showEndPoint={true}
/>
```

## Component Structure

The WorkflowBuilder is composed of three main sections:

1. **Starting Point**: The trigger event that starts the workflow
2. **Condition Block**: The main content area (can be customized via children)
3. **End Point** (optional): The conclusion of the workflow

Each section is connected visually with connector lines to represent flow.

## State Management

The component can either:
- Use external state via props (conditions, onConditionAdd, etc.)
- Manage its own internal state when useInternalState is true

Internal handlers bridge between the two models:

```javascript
const handleConditionAddInternal = (condition) => {
  if (useInternalState) {
    setInternalConditions([...internalConditions, condition]);
  } else if (typeof onConditionAdd === 'function') {
    onConditionAdd(condition);
  }
};
```

## Examples

See `frontend/src/examples/WorkflowBuilderExample.jsx` for complete examples of:
- External state management
- Internal state management
- Customized appearance
- Custom condition block content

## Styling

The component uses Tailwind CSS classes for styling, maintaining a consistent look with the rest of the application.

## Accessibility

- Interactive elements have proper focus states
- Icons include aria-labels for screen readers
- Color contrast meets WCAG 2.1 AA standards

## Future Enhancements

Potential improvements for future versions:
- Add drag-and-drop reordering of conditions
- Support for branching workflows
- Visual animations for state changes
- Additional customization options for colors and styling