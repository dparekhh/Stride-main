#!/bin/bash
# Start the health check on port 5000 in the background
python pre_start.py &
HEALTH_PID=$!

# Log the process ID
echo "Health check started with PID: $HEALTH_PID"

# Setup trap to kill the health check when this script exits
trap "kill $HEALTH_PID 2>/dev/null" EXIT

# Start the main application
echo "Starting main application on port 3000..."
gunicorn --bind 0.0.0.0:3000 --reload wsgi:app