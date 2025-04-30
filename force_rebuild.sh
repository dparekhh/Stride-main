#!/bin/bash

echo "=== FORCE REBUILD FRONTEND WITH CLEAN CACHE ==="

# Stop the current application
echo "Stopping any running workflows..."
pkill -f gunicorn

# Clean up any cached files
echo "Cleaning up cached files..."
rm -rf frontend/dist
rm -rf frontend/node_modules/.vite

# Do a fresh build with timestamp
echo "Building frontend with fresh timestamp..."
cd frontend
VITE_BUILD_TIMESTAMP=$(date +%s) npm run build
cd ..

# Run post-build cleanup
echo "Running post-build cleanup..."
./post_build_cleanup.sh

# Restart the application
echo "Restarting application..."
pkill -f gunicorn
gunicorn --bind 0.0.0.0:3000 --reuse-port --reload wsgi:app &

echo "=== REBUILD COMPLETE ==="
echo "Please refresh your browser with a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"