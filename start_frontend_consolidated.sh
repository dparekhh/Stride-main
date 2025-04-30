#!/bin/bash

# Consolidated script for starting the frontend in either development or production mode
# Usage: ./start_frontend_consolidated.sh [dev|prod]
# Default mode is production if not specified

# Get the mode from command line argument
MODE=${1:-prod}

echo "Starting frontend in $MODE mode..."

# Change to the frontend directory
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the frontend based on mode
if [ "$MODE" = "dev" ]; then
  # Development mode - use Vite dev server
  echo "Starting Vite development server on port 3001..."
  npm run dev -- --port 3001 --host 0.0.0.0
else
  # Production mode - build using our enhanced build script and serve with Python HTTP server
  echo "Building the frontend for production using enhanced build script..."
  cd ..
  ./build_frontend.sh
  cd frontend
  
  # Check if the build was successful and dist directory exists
  if [ -d "dist" ]; then
    echo "Starting frontend server on port 3001..."
    cd dist
    python3 -m http.server 3001 --bind 0.0.0.0
  else
    echo "Error: dist directory not found. Build may have failed."
    exit 1
  fi
fi