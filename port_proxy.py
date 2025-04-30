import threading
import socket
import time
import os
import signal
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('PortProxy')

class PortProxy:
    def __init__(self, listen_port=5000, target_port=3000):
        self.listen_port = listen_port
        self.target_port = target_port
        self.running = False
        self.server_socket = None
        self.active_connections = set()
        self.conn_lock = threading.Lock()
        
    def forward_data(self, source, target, source_name, target_name):
        """Forward data between source and target sockets with better error handling"""
        try:
            buffer_size = 8192  # Larger buffer for better performance
            while True:
                try:
                    data = source.recv(buffer_size)
                    if not data:
                        logger.debug(f"No more data from {source_name}, closing connection")
                        break
                    target.sendall(data)  # Use sendall to ensure all data is sent
                except (ConnectionResetError, BrokenPipeError) as e:
                    logger.debug(f"Connection closed: {e}")
                    break
                except socket.timeout:
                    # Socket timeout, try again
                    continue
                except Exception as e:
                    logger.error(f"Error forwarding from {source_name} to {target_name}: {e}")
                    break
        finally:
            # Clean up resources
            try:
                source.close()
                logger.debug(f"Closed {source_name} socket")
            except:
                pass
                
            try:
                target.close()
                logger.debug(f"Closed {target_name} socket")
            except:
                pass
                
            # Remove from active connections
            with self.conn_lock:
                if source in self.active_connections:
                    self.active_connections.remove(source)
                if target in self.active_connections:
                    self.active_connections.remove(target)
            
    def handle_client(self, client_socket, client_addr):
        """Set up forwarding between client and target server with better error handling"""
        logger.info(f"Handling connection from {client_addr}")
        
        # Add to active connections
        with self.conn_lock:
            self.active_connections.add(client_socket)
            
        # Connect to the target (backend) server
        target_socket = None
        try:
            # Create socket with timeout
            target_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            target_socket.settimeout(5)  # 5 second connection timeout
            target_socket.connect(('127.0.0.1', self.target_port))
            target_socket.settimeout(None)  # Remove timeout for actual data transfer
            
            # Add to active connections
            with self.conn_lock:
                self.active_connections.add(target_socket)
            
            # Set up bidirectional forwarding
            source_name = f"client-{client_addr[0]}:{client_addr[1]}"
            target_name = f"server-127.0.0.1:{self.target_port}"
            
            client_to_server = threading.Thread(
                target=self.forward_data, 
                args=(client_socket, target_socket, source_name, target_name)
            )
            server_to_client = threading.Thread(
                target=self.forward_data,
                args=(target_socket, client_socket, target_name, source_name)
            )
            
            client_to_server.daemon = True
            server_to_client.daemon = True
            
            client_to_server.start()
            server_to_client.start()
            
            # Let the threads handle the forwarding
            return
            
        except ConnectionRefusedError:
            logger.error(f"Connection refused to backend server at 127.0.0.1:{self.target_port}")
            self.send_error_response(client_socket, 502, "Bad Gateway", 
                                    f"Unable to connect to backend server on port {self.target_port}")
        except socket.timeout:
            logger.error(f"Connection to backend server at 127.0.0.1:{self.target_port} timed out")
            self.send_error_response(client_socket, 504, "Gateway Timeout", 
                                    f"Connection to backend server on port {self.target_port} timed out")
        except Exception as e:
            logger.error(f"Error setting up connection to backend: {e}")
            self.send_error_response(client_socket, 500, "Internal Server Error", 
                                    f"Error: {str(e)}")
        finally:
            # Clean up on error
            if target_socket and client_socket not in self.active_connections:
                try:
                    target_socket.close()
                except:
                    pass
    
    def send_error_response(self, client_socket, status_code, status_text, message):
        """Send an HTTP error response to the client"""
        try:
            response = (
                f"HTTP/1.1 {status_code} {status_text}\r\n"
                f"Content-Type: text/html\r\n"
                f"Connection: close\r\n"
                f"\r\n"
                f"<!DOCTYPE html>\n"
                f"<html>\n"
                f"<head><title>{status_code} {status_text}</title></head>\n"
                f"<body>\n"
                f"<h1>{status_code} {status_text}</h1>\n"
                f"<p>{message}</p>\n"
                f"</body>\n"
                f"</html>"
            )
            client_socket.sendall(response.encode('utf-8'))
        except Exception as e:
            logger.error(f"Error sending error response: {e}")
        finally:
            try:
                client_socket.close()
                with self.conn_lock:
                    if client_socket in self.active_connections:
                        self.active_connections.remove(client_socket)
            except:
                pass
            
    def check_port_available(self):
        """Check if the port is available, and find an alternative if it's not"""
        try:
            # Create a test socket and try to bind to the port
            test_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            test_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            test_socket.bind(('0.0.0.0', self.listen_port))
            test_socket.close()
            return True
        except socket.error as e:
            if e.errno == 98:  # Address already in use
                logger.warning(f"Port {self.listen_port} is already in use")
                return False
            else:
                raise
    
    def find_free_port(self):
        """Find a free port to use"""
        temp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        temp_socket.bind(('0.0.0.0', 0))  # Bind to port 0 to get a random free port
        port = temp_socket.getsockname()[1]
        temp_socket.close()
        return port
                
    def start(self):
        """Start the port forwarding proxy with improved error handling"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            # Check if the port is available
            if not self.check_port_available():
                # Try to use a different port
                orig_port = self.listen_port
                self.listen_port = self.find_free_port()
                logger.info(f"Switched from port {orig_port} to available port {self.listen_port}")
            
            # Bind to the listening port
            self.server_socket.bind(('0.0.0.0', self.listen_port))
            self.server_socket.listen(100)
            
            # Set a timeout so we can check if we need to exit
            self.server_socket.settimeout(1.0)
            
            self.running = True
            logger.info(f"Port proxy started: 0.0.0.0:{self.listen_port} -> 127.0.0.1:{self.target_port}")
            
            # For Replit URL construction
            repl_owner = os.environ.get("REPL_OWNER", "")
            repl_slug = os.environ.get("REPL_SLUG", "")
            if repl_owner and repl_slug:
                replit_url = f"https://{repl_slug}.{repl_owner}.repl.co"
                logger.info(f"Your application should be accessible at: {replit_url}")
            
            # Accept connections and handle them
            while self.running:
                try:
                    client_socket, addr = self.server_socket.accept()
                    logger.info(f"New connection from {addr}")
                    
                    # Set socket options for better performance
                    client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
                    
                    # Start a new thread to handle the client connection
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, addr)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                except socket.timeout:
                    # This is expected due to the timeout we set
                    continue
                except Exception as e:
                    if self.running:
                        logger.error(f"Error accepting connection: {e}")
                        time.sleep(0.1)  # Prevent CPU spin
                
        except KeyboardInterrupt:
            logger.info("Stopping proxy due to keyboard interrupt")
        except Exception as e:
            logger.error(f"Error in proxy server: {e}")
        finally:
            self.stop()
            
    def stop(self):
        """Stop the proxy server and clean up all connections"""
        self.running = False
        
        # Close all active connections
        with self.conn_lock:
            for sock in self.active_connections:
                try:
                    sock.close()
                except:
                    pass
            self.active_connections.clear()
        
        # Close server socket
        if self.server_socket:
            try:
                self.server_socket.close()
            except:
                pass
            logger.info("Proxy server stopped")
            
def handle_signal(sig, frame):
    """Signal handler for graceful shutdown"""
    logger.info(f"Received signal {sig}, shutting down...")
    sys.exit(0)
            
if __name__ == "__main__":
    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    
    # Get port values from environment or use defaults
    listen_port = int(os.environ.get("LISTEN_PORT", 5000))
    target_port = int(os.environ.get("PORT", 3000))
    
    # Create and start the proxy
    proxy = PortProxy(listen_port=listen_port, target_port=target_port)
    
    logger.info(f"Starting port proxy: {listen_port} -> {target_port}...")
    
    # Start in the main thread for better error handling
    proxy.start()