"""
Starter script that ensures both the port proxy and Flask app are running.
This serves as the entry point for Gunicorn.
"""

import threading
import time
import subprocess
import os
import signal
import sys
from app import app

# Global flag to track if the proxy is running
proxy_running = False
proxy_process = None

def start_port_proxy():
    """Start the port proxy process and monitor it"""
    global proxy_running, proxy_process
    
    try:
        # Start the port proxy as a subprocess
        print("Starting port proxy (5000 -> 3000)...")
        proxy_process = subprocess.Popen(['python', 'port_proxy.py'])
        proxy_running = True
        
        # Give the proxy time to initialize
        time.sleep(2)
        print("Port proxy started successfully")
        
        # Monitor the proxy process to ensure it keeps running
        proxy_process.wait()
        
    except Exception as e:
        print(f"Error starting proxy: {e}")
    finally:
        proxy_running = False

def cleanup():
    """Clean up resources when the app is shutting down"""
    global proxy_process
    
    if proxy_process:
        print("Stopping port proxy...")
        try:
            proxy_process.terminate()
            proxy_process.wait(timeout=5)
        except:
            # Force kill if it doesn't terminate
            try:
                proxy_process.kill()
            except:
                pass

# Start the port proxy in a separate thread
proxy_thread = threading.Thread(target=start_port_proxy)
proxy_thread.daemon = True
proxy_thread.start()

# Register cleanup to run when the process exits
import atexit
atexit.register(cleanup)

# Handle signals for proper cleanup
def signal_handler(sig, frame):
    cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# The app object is used by Gunicorn
# The proxy is now running on port 5000, and Gunicorn will use app on port 3000