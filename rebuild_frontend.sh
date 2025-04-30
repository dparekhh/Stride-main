#!/bin/bash
echo "Cleaning up previous build..."
rm -rf frontend/dist

echo "Building frontend..."
cd frontend && npm run build

echo "Copying assets..."
cd .. && bash copy_stride_logo.sh

echo "Restarting server..."
restart_workflow "Start application"

echo "Done!"