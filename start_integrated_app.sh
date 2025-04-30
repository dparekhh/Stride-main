#!/bin/bash

# This script starts both the backend and frontend servers
# It's designed to be run from the project root directory

echo "Starting Stride Spend Management Platform..."

# Start the backend server in the background
echo "Starting backend server on port 3000..."
gunicorn --bind 0.0.0.0:3000 --reuse-port --reload wsgi:app &
BACKEND_PID=$!

# Give the backend server a moment to start
sleep 2

# Start the frontend server
echo "Starting frontend server on port 3001..."
./start_frontend_workflow.sh &
FRONTEND_PID=$!

# Set up a trap to kill both servers on exit
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT TERM EXIT

# Keep the script running
echo "Both servers are running! Press Ctrl+C to stop."
wait