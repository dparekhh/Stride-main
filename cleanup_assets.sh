#!/bin/bash

# This script cleans up redundant JavaScript and CSS files in both static/assets and frontend/dist/assets directories
# It keeps only the latest (currently used) files and removes older versions

echo "Cleaning up redundant JavaScript and CSS files..."

# Get the current JavaScript and CSS files referenced in index.html
CURRENT_JS=$(grep -o 'index-[A-Za-z0-9_]*-[0-9]*\.js' static/index.html | head -1)
CURRENT_CSS=$(grep -o 'index-[A-Za-z0-9_]*-[0-9]*\.css' static/index.html | head -1)

if [ -z "$CURRENT_JS" ]; then
  echo "Error: Could not find current JavaScript file in index.html"
  exit 1
fi

if [ -z "$CURRENT_CSS" ]; then
  echo "Error: Could not find current CSS file in index.html"
  exit 1
fi

echo "Current JavaScript file: $CURRENT_JS"
echo "Current CSS file: $CURRENT_CSS"
echo "These files will be kept. All other similar files will be removed."

# Cleanup static/assets directory
echo "Cleaning up static/assets directory..."
# Count files before cleanup
JS_FILES_BEFORE=$(find static/assets -name "index-*.js" | wc -l)
CSS_FILES_BEFORE=$(find static/assets -name "index-*.css" | wc -l)

echo "Found $JS_FILES_BEFORE JavaScript files before cleanup in static/assets"
echo "Found $CSS_FILES_BEFORE CSS files before cleanup in static/assets"

# Remove all index-*.js files except the current one
find static/assets -name "index-*.js" -not -name "$CURRENT_JS" -exec rm {} \;

# Remove all index-*.css files except the current one
find static/assets -name "index-*.css" -not -name "$CURRENT_CSS" -exec rm {} \;

# Count files after cleanup
JS_FILES_AFTER=$(find static/assets -name "index-*.js" | wc -l)
CSS_FILES_AFTER=$(find static/assets -name "index-*.css" | wc -l)

echo "Kept $JS_FILES_AFTER JavaScript files after cleanup in static/assets"
echo "Kept $CSS_FILES_AFTER CSS files after cleanup in static/assets"

# Check if frontend/dist/assets directory exists
if [ -d "frontend/dist/assets" ]; then
  echo "Cleaning up frontend/dist/assets directory..."
  # Count files before cleanup
  FRONTEND_JS_BEFORE=$(find frontend/dist/assets -name "index-*.js" | wc -l)
  FRONTEND_CSS_BEFORE=$(find frontend/dist/assets -name "index-*.css" | wc -l)

  echo "Found $FRONTEND_JS_BEFORE JavaScript files before cleanup in frontend/dist/assets"
  echo "Found $FRONTEND_CSS_BEFORE CSS files before cleanup in frontend/dist/assets"

  # Keep only the current JS/CSS files in frontend/dist/assets
  if [ $FRONTEND_JS_BEFORE -gt 1 ]; then
    find frontend/dist/assets -name "index-*.js" -not -name "$CURRENT_JS" -exec rm {} \;
  fi

  if [ $FRONTEND_CSS_BEFORE -gt 1 ]; then
    find frontend/dist/assets -name "index-*.css" -not -name "$CURRENT_CSS" -exec rm {} \;
  fi

  # Count files after cleanup
  FRONTEND_JS_AFTER=$(find frontend/dist/assets -name "index-*.js" | wc -l)
  FRONTEND_CSS_AFTER=$(find frontend/dist/assets -name "index-*.css" | wc -l)

  echo "Kept $FRONTEND_JS_AFTER JavaScript files after cleanup in frontend/dist/assets"
  echo "Kept $FRONTEND_CSS_AFTER CSS files after cleanup in frontend/dist/assets"
fi

echo "Cleanup complete!"