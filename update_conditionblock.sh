#!/bin/bash

# This script fixes the WorkflowBuilder ConditionBlock component issue
# by ensuring our changes to the component are applied correctly.

echo "Applying ConditionBlock component fixes..."

# Record our changes in the tracking file
if ! grep -q "ConditionBlock.jsx" modified_components.txt; then
  echo -e "\n5. ConditionBlock.jsx
- Fixed handling of special condition types like required-fields, optional-fields, and approver
- Added proper formatting for fields and approvers in getConditionText()
- Updated PropTypes to include fieldsConditionShape and approverConditionShape
- Made operator and value optional in standardConditionShape
- Added a fallback return of type for unknown condition types" >> modified_components.txt
fi

# Create necessary directories for component storage in static
mkdir -p static/components/common/action-buttons/WorkflowBuilder/WorkflowElements

# Copy our modified files
cp frontend/src/components/common/action-buttons/WorkflowBuilder/WorkflowElements/ConditionBlock.jsx static/components/common/action-buttons/WorkflowBuilder/WorkflowElements/

echo "ConditionBlock component changes applied"
echo "Restarting application to apply changes..."

# Restart the workflow to apply changes
restart_workflow "Start application"

echo "Application restarted"
echo "Changes should now be visible in the frontend"