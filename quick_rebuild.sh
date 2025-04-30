#!/bin/bash
echo "Cleaning distribution folder..."
rm -rf frontend/dist

echo "Building frontend with increased timeout..."
cd frontend
timeout 120 npm run build
cd ..

echo "Restarting application..."
restart_workflow "Start application"

echo "Done!"