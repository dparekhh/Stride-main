#!/bin/bash

# This script starts the frontend workflow
echo "Starting frontend workflow server..."

# Start the frontend server using the built frontend
cd frontend/dist
python3 -m http.server 3001 --bind 0.0.0.0