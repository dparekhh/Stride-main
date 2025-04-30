# WorkflowBuilder Component

## Overview

The WorkflowBuilder is a modular, reusable React component for building workflow diagrams with multiple conditions and actions. It allows users to visually create and manage decision logic flows with a user-friendly interface.

![WorkflowBuilder Diagram](https://example.com/workflow-builder-diagram.png)

## Component Architecture

The WorkflowBuilder follows a modular architecture with the following key parts:

```
WorkflowBuilder/
├── WorkflowBuilder.jsx         # Main component
├── WorkflowBuilderProvider.jsx # Context provider for state management
├── index.js                    # Exports for consumer components
├── ConditionRow.jsx            # Individual condition row display
├── Dialogs/                    # Dialog components
│   ├── ApproverSelector.jsx     # Approver selection dialog
│   ├── ConditionEditor.jsx      # Condition editing dialog
│   ├── DeleteConfirmation.jsx   # Delete confirmation dialog
│   └── FieldSelector.jsx        # Field selection dialog
├── WorkflowElements/           # Core visual elements
│   ├── AddButton.jsx            # Button for adding workflow items
│   ├── ConditionBlock.jsx       # Block of related conditions
│   ├── EndPoint.jsx             # Workflow end point
│   └── StartPoint.jsx           # Workflow start point
├── hooks/                      # Custom hooks for state management
│   ├── useApproverState.js      # Approver state hook
│   ├── useConditionState.js     # Condition state hook
│   └── useFieldSelection.js     # Field selection hook
├── utils/                      # Utility functions
│   ├── approverHelpers.js       # Approver-related utilities
│   ├── conditionHelpers.js      # Condition-related utilities
│   └── formattingUtils.js       # Formatting and display utilities
└── README.md                   # This documentation file
```

## State Management

The WorkflowBuilder uses a **context-based state management pattern** through the `WorkflowBuilderProvider`. This is the recommended approach for all new implementations.

### State Management Pattern

```
┌─────────────────────────┐
│ WorkflowBuilderProvider │
│                         │
│  ┌─────────────────┐    │
│  │ Condition State │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Approver State  │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Field Selection │    │
│  └─────────────────┘    │
└─────────────────────────┘
           ▲
           │
           ▼
┌─────────────────────────┐
│    WorkflowBuilder      │
└─────────────────────────┘
           ▲
           │
           ▼
┌─────────────────────────┐
│  Consumer Components    │
└─────────────────────────┘
```

## Usage Examples

### Basic Usage with Internal State

```jsx
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder';

const MyComponent = () => {
  return (
    <div className="p-4">
      <h2>My Workflow</h2>
      <WorkflowBuilder
        useInternalState={true}
        triggerText="When"
        triggerHighlight="submitting request"
        showEndPoint={true}
        endPointText="Notify"
        endPointHighlight="Approvers"
      />
    </div>
  );
};
```

### Advanced Usage with External State

```jsx
import React, { useState } from 'react';
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder';

const MyAdvancedComponent = () => {
  const [conditions, setConditions] = useState([]);
  
  const handleAddCondition = (condition) => {
    setConditions(prev => [...prev, condition]);
  };
  
  const handleUpdateCondition = (updatedConditions) => {
    setConditions(updatedConditions);
  };
  
  const handleDeleteCondition = (index) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="p-4">
      <h2>Advanced Workflow</h2>
      <WorkflowBuilder
        conditions={conditions}
        onConditionAdd={handleAddCondition}
        onConditionUpdate={handleUpdateCondition}
        onConditionDelete={handleDeleteCondition}
        useInternalState={false}
        customOptions={{
          'set-conditions': ['Department', 'Amount', 'Project']
        }}
      />
      
      <div className="mt-4">
        <pre>{JSON.stringify(conditions, null, 2)}</pre>
      </div>
    </div>
  );
};
```

### Using Individual Components

For more fine-grained control, you can import and use the individual components:

```jsx
import React, { useState } from 'react';
import { 
  StartPoint, 
  EndPoint, 
  ConditionBlock,
  ConditionEditor,
  useConditionState
} from '../components/common/action-buttons/WorkflowBuilder';

const CustomImplementation = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { 
    conditions, 
    addCondition, 
    updateCondition 
  } = useConditionState([]);
  
  return (
    <div className="workflow-diagram">
      <StartPoint triggerText="When" triggerHighlight="triggered" />
      
      <div className="workflow-connector h-12 w-0.5 bg-gray-200 ml-3.5"></div>
      
      {conditions.map((condition, idx) => (
        <ConditionBlock
          key={idx}
          condition={condition}
          index={idx}
          onEdit={() => setIsEditorOpen(true)}
        />
      ))}
      
      <EndPoint 
        endPointText="Complete" 
        endPointHighlight="Process" 
        showEndPoint={true}
      />
      
      <ConditionEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(condition) => {
          addCondition(condition);
          setIsEditorOpen(false);
        }}
      />
    </div>
  );
};
```

## Best Practices

1. **Use the Context Provider** - For new implementations, use the `WorkflowBuilderProvider` with `useInternalState={true}` to simplify state management.

2. **Custom Styling** - Use the `className` prop to customize the appearance of the WorkflowBuilder.

3. **Custom Options** - Provide custom options for conditions through the `customOptions` prop.

4. **Validation** - The component has built-in validation, but you can add additional validation in your onSave handlers.

## Props Reference

### WorkflowBuilder Component

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| conditions | Array | [] | Array of workflow conditions (for external state) |
| onConditionAdd | Function | - | Callback for adding a new condition |
| onConditionDelete | Function | - | Callback for deleting a condition |
| onConditionUpdate | Function | - | Callback for updating conditions |
| onLogicOperatorToggle | Function | - | Callback for toggling AND/OR |
| customOptions | Object | {} | Custom options for condition types |
| className | String | "" | Additional CSS classes |
| children | Node | - | Custom content for the condition block |
| triggerText | String | "When" | Text for the trigger element |
| triggerHighlight | String | "Submitting policy" | Highlighted text for the trigger |
| useInternalState | Boolean | false | Whether to manage state internally |
| showEndPoint | Boolean | false | Whether to show the end point |
| endPointText | String | "Approve" | Text for the end point |
| endPointHighlight | String | "Expense" | Highlighted text for the end point |

## Migrating from Legacy Implementation

If you're using the older implementation with a custom hook (`useWorkflowState`), migrate to the new context-based approach:

### From:
```jsx
import useWorkflowState from '../hooks/useWorkflowState';

const MyComponent = () => {
  const workflowState = useWorkflowState();
  
  return (
    <WorkflowBuilder
      conditions={workflowState.conditions}
      onConditionAdd={workflowState.addCondition}
      // ...other props
    />
  );
};
```

### To:
```jsx
const MyComponent = () => {
  return (
    <WorkflowBuilder
      useInternalState={true}
      // ...other props
    />
  );
};
```