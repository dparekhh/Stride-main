#!/bin/bash

# This script is maintained for backward compatibility
# It now uses the consolidated frontend script in production mode

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the consolidated script in production mode
"$DIR/start_frontend_consolidated.sh" prod