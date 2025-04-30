
#!/bin/bash
# Don't set -e as we want to handle errors gracefully
# set -e

# Define colors for output
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to handle errors
handle_error() {
  echo -e "${RED}ERROR: $1${NC}"
  exit 1
}

# Log with timestamp
log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if a process is running
is_process_running() {
  ps -p $1 > /dev/null 2>&1
}

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:$1 > /dev/null 2>&1
}

# If any gunicorn process is running, kill it
pkill -f "gunicorn" > /dev/null 2>&1 || true
# If any python process related to the port proxy or health check is running, kill it
pkill -f "port_proxy.py" > /dev/null 2>&1 || true
pkill -f "pre_start.py" > /dev/null 2>&1 || true

# Check if we should run in development mode
if [ "$NODE_ENV" = "development" ]; then
  log "Running in development mode, skipping frontend build"
else
  # Build the frontend
  log "Starting frontend build process..."
  
  # Navigate to frontend directory
  cd frontend || handle_error "Failed to navigate to frontend directory"
  
  # Install dependencies if needed
  log "Installing frontend dependencies..."
  npm install --prefer-offline --no-fund --no-audit --loglevel=error || handle_error "Failed to install dependencies"
  
  # Remove existing build to ensure clean state
  if [ -d "dist" ]; then
    log "Removing previous build..."
    rm -rf dist
  fi
  
  # Set environment variables for build optimization
  export NODE_OPTIONS="--max-old-space-size=2048"
  export VITE_DISABLE_ESLINT_PLUGIN=true
  export NODE_ENV=production
  
  # Set API URL with dynamic port to ensure correct API connectivity
  export PORT=${PORT:-3000}
  export VITE_API_URL=http://0.0.0.0:${PORT}/api
  
  # Build the application
  log "Building frontend application..."
  npm run build || handle_error "Frontend build failed"
  
  # Return to root directory
  cd ..
  
  # Create uploads directory if it doesn't exist
  log "Ensuring uploads directory exists..."
  mkdir -p frontend/dist/uploads || handle_error "Failed to create uploads directory"
  
  # Run post-build cleanup to remove redundant assets
  log "Running post-build cleanup to remove redundant assets..."
  ./post_build_cleanup.sh || log "Warning: Cleanup script failed, continuing anyway"
  
  log "Frontend build process completed successfully!"
fi

# Make sure that we have index.html in the frontend/dist directory
log "Verifying frontend files..."
if [ ! -f frontend/dist/index.html ]; then
  log "Creating default index.html in frontend/dist directory..."
  mkdir -p frontend/dist
  cat > frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stride Spend Management</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; }
    .container { text-align: center; max-width: 800px; padding: 20px; }
    h1 { color: #F97316; }
    p { margin-bottom: 20px; }
    .loading { display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(249,115,22,0.3); border-radius: 50%; border-top-color: #F97316; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Stride Spend Management</h1>
    <p>Loading application...</p>
    <div class="loading"></div>
  </div>
</body>
</html>
EOF
fi

# Ensure we have an uploads directory in the frontend/dist directory
log "Ensuring uploads directory exists..."
mkdir -p frontend/dist/uploads

# Set the correct PORT environment variable
PORT=${PORT:-3000}
log "Using port $PORT for the main application"

# Start the main application - skip the background services as they're managed by Replit
log "Starting Gunicorn on port $PORT..."
exec gunicorn --bind 0.0.0.0:$PORT --reuse-port --reload wsgi:app
