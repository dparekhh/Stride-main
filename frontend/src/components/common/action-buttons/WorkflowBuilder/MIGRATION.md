# WorkflowBuilder State Management Migration Guide

## Overview

This document provides guidance on migrating from the legacy `useWorkflowState` hook approach to the recommended context-based state management using `WorkflowBuilderProvider`.

## Why Migrate?

The WorkflowBuilder component has two state management approaches:

1. **Legacy Approach**: Using the `useWorkflowState` hook from `src/hooks/useWorkflowState.js`
2. **Recommended Approach**: Using the `WorkflowBuilderProvider` context from within the WorkflowBuilder module

The context-based approach (`WorkflowBuilderProvider`) offers several advantages:

- **Simpler Usage**: Less boilerplate code in consumer components
- **Encapsulated Logic**: State management logic is contained within the component module
- **Better Performance**: Fewer re-renders due to optimized context updates
- **Consistent API**: Standardized approach for all WorkflowBuilder instances
- **Maintainability**: Easier to update and maintain

## Migration Steps

### Step 1: Remove useWorkflowState Import

**Before**:
```jsx
import useWorkflowState from '../hooks/useWorkflowState';

const MyComponent = () => {
  const workflowState = useWorkflowState();
  
  return (
    <WorkflowBuilder
      conditions={workflowState.conditions}
      onConditionAdd={workflowState.addCondition}
      onConditionDelete={workflowState.deleteCondition}
      onConditionUpdate={workflowState.updateConditions}
      onLogicOperatorToggle={workflowState.toggleLogicOperator}
      // ...other props
    />
  );
};
```

### Step 2: Update WorkflowBuilder Props

**After**:
```jsx
const MyComponent = () => {
  return (
    <WorkflowBuilder
      useInternalState={true}
      // ...other props (no need to pass state handlers)
    />
  );
};
```

### Step 3: For Advanced Use Cases (Optional)

If you need more control over the workflow state:

```jsx
import { WorkflowBuilderProvider } from '../components/common/action-buttons/WorkflowBuilder';

const MyAdvancedComponent = () => {
  return (
    <WorkflowBuilderProvider initialConditions={[/* any initial conditions */]}>
      <div className="my-page">
        {/* Other components that may need access to workflow state */}
        <WorkflowBuilder useInternalState={true} />
        <WorkflowSummary /> {/* Custom component that can access workflow state */}
      </div>
    </WorkflowBuilderProvider>
  );
};

// In a custom component that needs workflow state:
const WorkflowSummary = () => {
  const { conditions } = useWorkflowBuilderContext();
  return (
    <div className="summary">
      <p>You have {conditions.length} conditions configured.</p>
    </div>
  );
};
```

## Comparison of Approaches

| Feature | Legacy Hook (useWorkflowState) | Context Provider (Recommended) |
|---------|--------------------------------|-------------------------------|
| Code Complexity | Higher (requires explicit state handling) | Lower (managed internally) |
| Control | More granular control | Simplified abstraction |
| Reusability | Requires hook in each consumer | Can wrap multiple components |
| Performance | May cause extra re-renders | Optimized for performance |
| Maintenance | More points of failure | Centralized logic |

## Example Migration

### Example 1: Simple Component

**Before**:
```jsx
import useWorkflowState from '../hooks/useWorkflowState';
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder/WorkflowBuilder';

const PolicyBuilder = () => {
  const { 
    conditions, 
    addCondition, 
    deleteCondition, 
    updateConditions 
  } = useWorkflowState();
  
  return (
    <div className="policy-builder">
      <h2>Build Your Policy</h2>
      <WorkflowBuilder
        conditions={conditions}
        onConditionAdd={addCondition}
        onConditionDelete={deleteCondition}
        onConditionUpdate={updateConditions}
        triggerText="When"
        triggerHighlight="submitting request"
        showEndPoint={true}
      />
    </div>
  );
};
```

**After**:
```jsx
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder';

const PolicyBuilder = () => {
  return (
    <div className="policy-builder">
      <h2>Build Your Policy</h2>
      <WorkflowBuilder
        useInternalState={true}
        triggerText="When"
        triggerHighlight="submitting request"
        showEndPoint={true}
      />
    </div>
  );
};
```

### Example 2: Component with Additional State Needs

**Before**:
```jsx
import { useState } from 'react';
import useWorkflowState from '../hooks/useWorkflowState';
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder/WorkflowBuilder';

const AdvancedPolicyBuilder = () => {
  const [policyName, setPolicyName] = useState('');
  const { conditions, addCondition, deleteCondition, updateConditions } = useWorkflowState();
  
  const handleSavePolicy = () => {
    const policy = {
      name: policyName,
      conditions
    };
    console.log('Saving policy:', policy);
  };
  
  return (
    <div className="advanced-policy-builder">
      <input 
        value={policyName} 
        onChange={e => setPolicyName(e.target.value)} 
        placeholder="Policy Name" 
      />
      <WorkflowBuilder
        conditions={conditions}
        onConditionAdd={addCondition}
        onConditionDelete={deleteCondition}
        onConditionUpdate={updateConditions}
        triggerText="When"
        triggerHighlight="processing workflow"
      />
      <button onClick={handleSavePolicy}>Save Policy</button>
    </div>
  );
};
```

**After**:
```jsx
import { useState } from 'react';
import WorkflowBuilder, { 
  WorkflowBuilderProvider, 
  useWorkflowBuilderContext 
} from '../components/common/action-buttons/WorkflowBuilder';

const PolicyForm = () => {
  const [policyName, setPolicyName] = useState('');
  const { conditions } = useWorkflowBuilderContext();
  
  const handleSavePolicy = () => {
    const policy = {
      name: policyName,
      conditions
    };
    console.log('Saving policy:', policy);
  };
  
  return (
    <div className="policy-form">
      <input 
        value={policyName} 
        onChange={e => setPolicyName(e.target.value)} 
        placeholder="Policy Name" 
      />
      <WorkflowBuilder
        useInternalState={true}
        triggerText="When"
        triggerHighlight="processing workflow"
      />
      <button onClick={handleSavePolicy}>Save Policy</button>
    </div>
  );
};

const AdvancedPolicyBuilder = () => {
  return (
    <WorkflowBuilderProvider>
      <div className="advanced-policy-builder">
        <PolicyForm />
      </div>
    </WorkflowBuilderProvider>
  );
};
```

## Conclusion

By migrating to the context-based `WorkflowBuilderProvider` approach, you'll benefit from:

1. Simpler, more maintainable code
2. Better performance through optimized state updates
3. Consistent usage patterns across your application
4. Easier future upgrades and enhancements

For questions or assistance with migration, refer to the main README.md or contact the WorkflowBuilder component maintainer.