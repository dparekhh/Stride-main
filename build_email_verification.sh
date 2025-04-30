#!/bin/bash
set -e

# Create a focused build script that only builds the email verification page

# Step 1: Create a simplified build directory
mkdir -p email_page_build

# Step 2: Copy required files
cp -r frontend/src/pages/EmailVerificationPage.jsx email_page_build/
cp -r frontend/dist/* static/

# Step 3: Apply changes to static/index.html to force refresh the cache
if [ -f "static/index.html" ]; then
  TIMESTAMP=$(date +%s)
  sed -i "s/index\.[^\.]*\.js/index.js?v=$TIMESTAMP/g" static/index.html
  sed -i "s/index\.[^\.]*\.css/index.css?v=$TIMESTAMP/g" static/index.html
fi

echo "Email verification page updated successfully!"