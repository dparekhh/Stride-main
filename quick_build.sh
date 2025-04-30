#!/bin/bash
cd frontend
npm run build
cd ..
cp -r frontend/dist/assets/* static/
cp frontend/dist/index.html templates/
echo "Quick build completed!"