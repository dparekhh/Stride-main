#!/bin/bash

# Define the target port where our application runs 
# Incrementing to 3002 to avoid conflicts
TARGET_PORT=3002

# Export the ports for the application
export PORT=$TARGET_PORT

# Start the health check server and application in one go using gunicorn
echo "Starting the application with integrated health check server..."
echo "Access your application at: https://$REPL_SLUG.$REPL_OWNER.repl.co"

# Start the main application using gunicorn with direct port binding instead of config
gunicorn --bind 0.0.0.0:$TARGET_PORT --reuse-port --reload wsgi:app
