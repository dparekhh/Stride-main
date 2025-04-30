#!/bin/bash

# This script standardizes on using only Stride-Logo.svg for all Stride logo references
echo "Standardizing Stride logo to Stride-Logo.svg..."

# Make sure the directories exist
mkdir -p frontend/dist/assets

# Copy the main Stride-Logo.svg to the root of dist
cp frontend/public/Stride-Logo.svg frontend/dist/

# Also copy the logo to the assets directory for consistency with imports
cp frontend/public/Stride-Logo.svg frontend/dist/assets/

# Create the accounting directory if needed
mkdir -p frontend/dist/assets/accounting

# Copy all other accounting software logos EXCEPT stride-logo.svg
for logo in frontend/public/assets/accounting/*-logo.svg; do
  if [[ "$logo" != *"stride-logo.svg"* ]]; then
    cp "$logo" frontend/dist/assets/accounting/
  fi
done

# Remove any other Stride logo files from the dist directory for consistency
rm -f frontend/dist/stride-logo.png
rm -f frontend/dist/assets/stride-logo.png
rm -f frontend/dist/optimized-stride-logo.svg
rm -f frontend/dist/assets/optimized-stride-logo.svg
rm -f frontend/dist/assets/accounting/stride-logo.svg
rm -f frontend/dist/Stride-Logo.jpg
rm -f frontend/dist/assets/Stride-Logo.jpg

echo "Logo standardization completed!"