#!/bin/bash

# This script starts both backend and frontend services
echo "Starting full application (backend + frontend)..."

# First, build the frontend
cd frontend
echo "Building frontend..."
npm run build
echo "Frontend build complete."

# Serve the built frontend using a simple HTTP server
echo "Starting frontend server..."
cd dist
python -m http.server 3001 &
FRONTEND_PID=$!
echo "Frontend server started on port 3001 with PID: $FRONTEND_PID"

cd ../..

# The backend is already running through the existing workflow
echo "Backend is already running on port 3000."

echo "Full application started successfully."
echo "- Backend: http://localhost:3000"
echo "- Frontend: http://localhost:3001"

# Keep script running to maintain the frontend server
wait $FRONTEND_PID