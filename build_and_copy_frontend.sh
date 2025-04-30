#!/bin/bash

# This script builds the frontend only
# No need to copy files to static directory as we're serving directly from frontend/dist

echo "Building the frontend..."

# Change to the frontend directory
cd frontend

# Clean node_modules if there are issues
if [ "$1" == "--clean" ]; then
  echo "Performing clean build..."
  rm -rf node_modules
  npm install
fi

# Build the frontend with timestamp to force new asset hash
echo "Building the frontend with timestamp $(date +%s)..."
VITE_BUILD_TIMESTAMP=$(date +%s) npm run build

# Run a simplified cleanup script to remove redundant assets
echo "Running post-build cleanup to remove redundant assets..."
cd ..
./post_build_cleanup.sh

# Run the logo copy script
echo "Ensuring Stride logo is properly copied..."
./copy_stride_logo.sh

# Verify the build was successful
if [ -d "./frontend/dist/assets" ]; then
  echo "✅ Frontend build verification successful!"
  
  # List assets for verification
  echo "Assets in frontend/dist/assets:"
  ls -la frontend/dist/assets/
else
  echo "❌ ERROR: Frontend build may not have completed correctly!"
  exit 1
fi

echo "Frontend build completed successfully!"