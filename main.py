
import os
from app import app

if __name__ == "__main__":
    # Using port 5000 to match what the workflow is waiting for
    port = 5000
    app.run(host="0.0.0.0", port=port, debug=True)
