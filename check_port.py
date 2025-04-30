import socket
import sys
import os

def check_port(port):
    """Check if a port is in use"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result == 0

if __name__ == "__main__":
    # Check if port 3000 is in use (our app)
    if check_port(3000):
        print("Port 3000 is in use - application is running")
    else:
        print("Port 3000 is not in use - application is not running")
        
    # Check if port 5000 is in use (for Replit's health checks)
    if check_port(5000):
        print("Port 5000 is in use")
    else:
        print("Port 5000 is not in use")
        
    # Get the PORT environment variable
    port_env = os.environ.get("PORT")
    print(f"PORT environment variable: {port_env}")
    
    # List all ports configured in .replit file
    print("Checking ports from direct port binding...")
    for port in [3000, 5000, 8000, 8080]:
        if check_port(port):
            print(f"Port {port} is in use")
        else:
            print(f"Port {port} is not in use")