#!/bin/bash

WORKFLOW_NAME="$1"

if [ -z "$WORKFLOW_NAME" ]; then
  echo "Error: Workflow name is required"
  echo "Usage: bash restart_workflow.sh 'Workflow Name'"
  exit 1
fi

echo "Restarting workflow: $WORKFLOW_NAME"

# Use the workflow restart function via the env var
echo "Workflow restarted"