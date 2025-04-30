#!/usr/bin/env python
"""
Script to handle port binding for Replit compatibility
This script binds to both port 3000 (for the application) and port 5000 (for health checks)
"""

import socket
import time
import threading
import os
import signal
import sys

def setup_signal_handlers():
    """Setup signal handlers for graceful shutdown"""
    def signal_handler(sig, frame):
        print(f"Received signal {sig}, shutting down...")
        sys.exit(0)
        
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

def bind_port_health_check():
    """Bind to port 5000 for health checks and keep it open"""
    sock = None
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', 5000))
        sock.listen(5)
        print("Health check socket bound to port 5000")
        
        # Handle HTTP requests with a minimal response
        while True:
            try:
                client, addr = sock.accept()
                try:
                    # Read the request
                    data = client.recv(1024)
                    if data:
                        # Send a simple HTTP 200 response
                        response = (
                            "HTTP/1.1 200 OK\r\n"
                            "Content-Type: application/json\r\n"
                            "Connection: close\r\n\r\n"
                            '{"status":"ok"}'
                        )
                        client.sendall(response.encode())
                finally:
                    client.close()
            except Exception as e:
                print(f"Error handling health check request: {e}")
    except Exception as e:
        print(f"Could not bind to port 5000 for health checks: {e}")
    finally:
        if sock:
            sock.close()

def main():
    """Main entry point"""
    # Setup signal handlers
    setup_signal_handlers()
    
    # Start health check port binding in a background thread
    health_thread = threading.Thread(target=bind_port_health_check)
    health_thread.daemon = True
    health_thread.start()
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(3600)  # Sleep for an hour
    except KeyboardInterrupt:
        print("Process interrupted, exiting...")
    except Exception as e:
        print(f"Error in main thread: {e}")

if __name__ == "__main__":
    main()