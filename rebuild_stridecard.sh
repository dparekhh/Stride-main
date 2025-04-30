#!/bin/bash

echo "Rebuilding Stride Card components..."

# Copy the modified files to a backup location
cp -r frontend/src/pages/Accounting_StrideCardPage /tmp/Accounting_StrideCardPage_backup
cp frontend/src/pages/StrideCardPage.jsx /tmp/StrideCardPage_backup.jsx
cp frontend/src/components/TransactionSelectionBanner.jsx /tmp/TransactionSelectionBanner_backup.jsx

# Restart the frontend server to pick up changes
echo "Restarting application to apply changes..."
bash restart_workflow.sh "Start application"

echo "Rebuild complete. Changes should now be visible."