#!/bin/bash

# Create the components directory in static if it doesn't exist
mkdir -p static/components/common/action-buttons/WorkflowBuilder/WorkflowElements
mkdir -p static/components/common/action-buttons/WorkflowBuilder/Dialogs
mkdir -p static/components/common/action-buttons/WorkflowBuilder/utils

# Copy the modified files
cp frontend/src/components/common/action-buttons/WorkflowBuilder/WorkflowBuilder.jsx static/components/common/action-buttons/WorkflowBuilder/
cp frontend/src/components/common/action-buttons/WorkflowBuilder/WorkflowElements/AddButton.jsx static/components/common/action-buttons/WorkflowBuilder/WorkflowElements/
cp frontend/src/components/common/action-buttons/WorkflowBuilder/WorkflowElements/ConditionBlock.jsx static/components/common/action-buttons/WorkflowBuilder/WorkflowElements/
cp frontend/src/components/common/action-buttons/WorkflowBuilder/Dialogs/ConditionRow.jsx static/components/common/action-buttons/WorkflowBuilder/Dialogs/
cp frontend/src/components/common/action-buttons/WorkflowBuilder/utils/conditionHelpers.js static/components/common/action-buttons/WorkflowBuilder/utils/

echo "Component specific files copied to static directory"

# Restart the application to apply changes
echo "Restarting workflow..."
./restart_workflow.sh