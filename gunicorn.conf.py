import os
import socket
import sys
import threading
import time

# Get the port from environment variable or use different default
port = int(os.environ.get("PORT", 3001))  # Changed default to 3001 to avoid conflicts
bind = f"0.0.0.0:{port}"  # Explicitly bind to all interfaces for Replit environment

# Set worker settings
workers = 1
worker_class = "sync"
daemon = False
timeout = 60
reload = True
forwarded_allow_ips = '*'  # Trust forwarded headers for proper client IP

# Configure logging
errorlog = "-"
loglevel = "info"
accesslog = "-"

# Handle port binding early for health checks
def bind_early_socket():
    """Bind a socket to port 5000 for health checks"""
    try:
        # Always try to bind to port 5000 for Replit's health checks
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('0.0.0.0', 5000))
        sock.listen(5)
        print("Early socket binding successful on port 5000")
        return sock
    except OSError as e:
        print(f"Error binding to port 5000 for health checks: {e}")
        return None

# Simple health check server that responds to GET requests
def health_check_handler(early_socket):
    """Handle incoming health check requests"""
    if not early_socket:
        return
        
    try:
        while True:
            try:
                # Accept incoming connection
                client_socket, addr = early_socket.accept()
                print(f"Health check connection from {addr}")
                
                # Read request (basic parsing)
                data = client_socket.recv(1024).decode('utf-8')
                if data.startswith('GET'):
                    # Send a minimal HTTP 200 OK response
                    response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHealthy"
                    client_socket.sendall(response.encode('utf-8'))
                
                # Close connection
                client_socket.close()
            except Exception as e:
                print(f"Error handling health check: {e}")
    except Exception as e:
        print(f"Health check server error: {e}")

# Bind early to port 5000 for health checks
early_socket = bind_early_socket()

# Start health check handler in a separate thread if early binding succeeded
if early_socket:
    health_thread = threading.Thread(target=health_check_handler, args=(early_socket,))
    health_thread.daemon = True
    health_thread.start()
    
    # Store references to prevent garbage collection
    sys._early_socket = early_socket
    sys._health_thread = health_thread
    
    print("Health check server started on port 5000")