# WorkflowBuilder Component

A flexible and robust workflow builder component for creating hierarchical condition-based approval flows. This component allows users to create nested conditions, add approvers, and specify required or optional fields with intuitive editing and deletion capabilities.

## Features

- **Hierarchical Condition Structure**: Build workflows with main conditions and nested child conditions
- **Smart Edit Behavior**: Different UI for editing main vs. child conditions
- **Hierarchical Deletion**: Delete main conditions with all their children, or delete individual child conditions
- **Confirmation Modals**: Prevent accidental deletions with clear visual feedback
- **Robust Validation**: Ensure all conditions have required values before allowing users to proceed
- **Complete Keyboard Accessibility**: Navigate and edit workflows with keyboard-only interaction

## Editing Behavior

The component implements different editing behaviors based on condition type:

### Main Condition Editing
When editing a main condition (the "If" condition):
- Opens the **Set Conditions** box
- Pre-populates with existing values
- Maintains hierarchical relationships with child elements

### Child Condition Editing
Based on the child condition type:
- **Approver** conditions open the **Add Approvers** box
- **Required Fields** conditions open the **Add Required Fields** box
- **Optional Fields** conditions open the **Add Optional Fields** box
- All are pre-populated with existing values

## Deletion Behavior

The component implements hierarchical deletion with confirmation:

### Main Condition Deletion
When deleting a main condition:
- Shows a confirmation modal listing the main condition and all its child elements
- Confirms the user wants to delete the entire hierarchy
- Deletes all related child conditions, approvers, and field requirements

### Child Condition Deletion
When deleting a child condition:
- Shows a confirmation modal displaying the parent relationship
- Confirms the user wants to delete only this specific condition
- Preserves all other elements in the hierarchy

## Usage

```jsx
import WorkflowBuilder from './components/common/action-buttons/Workflow builder/WorkflowBuilder';

// Example implementation
const MyWorkflowPage = () => {
  const [conditions, setConditions] = useState([]);

  // Handle condition operations
  const handleAddCondition = (condition) => {
    setConditions(prev => [...prev, condition]);
  };

  const handleUpdateConditions = (updatedConditions) => {
    setConditions(updatedConditions);
  };

  const handleDeleteCondition = (index) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <WorkflowBuilder
      useInternalState={true}  // Use the internal state hook for advanced hierarchical management
      conditions={conditions}
      onConditionAdd={handleAddCondition}
      onConditionUpdate={handleUpdateConditions}
      onConditionDelete={handleDeleteCondition}
      triggerText="When someone submits a"
      triggerHighlight="Expense"
      primaryConditions={[
        'Department',
        'Amount',
        'Expense Category' 
      ]}
      approverOptions={[
        { label: 'Finance Team', value: 'finance' },
        { label: 'Managers', value: 'managers' } 
      ]}
    />
  );
};
```