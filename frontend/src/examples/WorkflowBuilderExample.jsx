import React, { useState } from 'react';
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder';

/**
 * Example component demonstrating the WorkflowBuilder with our new edit and delete functions
 */
const WorkflowBuilderExample = () => {
  const [workflowConditions, setWorkflowConditions] = useState([]);

  // Handle adding a condition
  const handleAddCondition = (condition) => {
    console.log('Adding condition:', condition);
    setWorkflowConditions(prev => [...prev, condition]);
  };

  // Handle updating conditions
  const handleUpdateConditions = (conditions) => {
    console.log('Updating conditions:', conditions);
    setWorkflowConditions(conditions);
  };

  // Handle deleting a condition
  const handleDeleteCondition = (index) => {
    console.log('Deleting condition at index:', index);
    setWorkflowConditions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Workflow Builder Example</h1>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This example demonstrates the WorkflowBuilder component with edit and delete functionality.
          Main conditions open the Set Conditions box, while child conditions open either the Approver or Add Fields box.
        </p>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <WorkflowBuilder
          conditions={workflowConditions}
          onConditionAdd={handleAddCondition}
          onConditionDelete={handleDeleteCondition}
          onConditionUpdate={handleUpdateConditions}
          triggerText="When someone submits a"
          triggerHighlight="Expense"
          useInternalState={true}
          approverOptions={[
            { label: 'Finance Team', value: 'finance' },
            { label: 'Managers', value: 'managers' },
            { label: 'Department Heads', value: 'department_heads' }
          ]}
          primaryConditions={[
            'Department',
            'Amount',
            'Expense Category',
            'Project',
            'Payment Type'
          ]}
        />
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 className="font-semibold mb-2">Current Workflow Conditions:</h3>
        <pre className="text-xs overflow-auto p-2 bg-white border border-gray-200 rounded">
          {JSON.stringify(workflowConditions, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WorkflowBuilderExample;