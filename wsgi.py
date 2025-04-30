
import os
from app import app

# This module simply exports the app for Gunicorn to use
# No port proxy needed - we'll let Replit handle the port forwarding

if __name__ == "__main__":
    # When run directly, use the port from environment or default to 3000
    port = int(os.environ.get("PORT", 3000))
    # Explicitly bind to all interfaces to ensure it's accessible externally
    app.run(host="0.0.0.0", port=port, debug=True)
