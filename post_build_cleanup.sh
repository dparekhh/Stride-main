#!/bin/bash

# This script ensures frontend/dist is self-consistent by verifying that all assets
# referenced in frontend/dist/index.html exist in frontend/dist/assets

echo "Running post-build cleanup..."

# Get the current JavaScript and CSS files referenced in frontend/dist/index.html
CURRENT_JS=$(grep -o 'index-[A-Za-z0-9]*-[0-9]*\.js' frontend/dist/index.html | head -1)
CURRENT_CSS=$(grep -o 'index-[A-Za-z0-9]*-[0-9]*\.css' frontend/dist/index.html | head -1)

# Initialize error flag
HAS_ERRORS=0

# Check JavaScript file reference
if [ -z "$CURRENT_JS" ]; then
  echo "Warning: Could not find JavaScript file reference in frontend/dist/index.html"
else
  echo "JavaScript file referenced in index.html: $CURRENT_JS"
  
  # Check if the referenced JavaScript file exists
  if [ -f "frontend/dist/assets/$CURRENT_JS" ]; then
    echo "✅ JavaScript file exists in frontend/dist/assets/"
  else
    echo "❌ Error: JavaScript file $CURRENT_JS referenced in frontend/dist/index.html but not found in frontend/dist/assets/"
    HAS_ERRORS=1
  fi
fi

# Check CSS file reference
if [ -z "$CURRENT_CSS" ]; then
  echo "Warning: Could not find CSS file reference in frontend/dist/index.html"
else
  echo "CSS file referenced in index.html: $CURRENT_CSS"
  
  # Check if the referenced CSS file exists
  if [ -f "frontend/dist/assets/$CURRENT_CSS" ]; then
    echo "✅ CSS file exists in frontend/dist/assets/"
  else
    echo "❌ Error: CSS file $CURRENT_CSS referenced in frontend/dist/index.html but not found in frontend/dist/assets/"
    HAS_ERRORS=1
  fi
fi

# Clean up redundant assets
if [ ! -z "$CURRENT_JS" ] && [ ! -z "$CURRENT_CSS" ] && [ -d "frontend/dist/assets" ]; then
  echo "Cleaning up redundant assets in frontend/dist/assets..."
  
  # Remove old JS and CSS files that aren't referenced in index.html
  find "frontend/dist/assets" -name "index-*.js" -not -name "$CURRENT_JS" -exec rm -f {} \;
  find "frontend/dist/assets" -name "index-*.css" -not -name "$CURRENT_CSS" -exec rm -f {} \;
  
  # Report remaining assets
  JS_COUNT=$(find "frontend/dist/assets" -name "index-*.js" | wc -l)
  CSS_COUNT=$(find "frontend/dist/assets" -name "index-*.css" | wc -l)
  
  echo "Assets after cleanup: $JS_COUNT JavaScript files, $CSS_COUNT CSS files"
  
  # List the actual files for verification
  echo "JS files in frontend/dist/assets:"
  find "frontend/dist/assets" -name "index-*.js" -exec basename {} \;
  
  echo "CSS files in frontend/dist/assets:"
  find "frontend/dist/assets" -name "index-*.css" -exec basename {} \;
fi

# Create uploads directory in frontend/dist if needed
echo "Ensuring uploads directory exists in frontend/dist..."
mkdir -p "frontend/dist/uploads"

# Final status report
if [ $HAS_ERRORS -eq 1 ]; then
  echo "⚠️ Cleanup completed with errors. The application may not function correctly."
else
  echo "✅ Post-build cleanup completed successfully! All referenced assets were found."
fi