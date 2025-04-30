#!/bin/bash

# This script is maintained for backward compatibility
# It now uses the consolidated frontend script in development mode

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the consolidated script in development mode
"$DIR/start_frontend_consolidated.sh" dev