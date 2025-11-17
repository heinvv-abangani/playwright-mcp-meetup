#!/usr/bin/env python3
"""
Simple HTTP server for the Playwright MCP demo test site
Run with: python3 server.py
"""

import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "test-site"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching for demo purposes
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🎭 Playwright MCP Demo Server")
        print(f"=" * 50)
        print(f"Server running at: http://localhost:{PORT}")
        print(f"Test site: http://localhost:{PORT}/index.html")
        print(f"\nPress Ctrl+C to stop the server")
        print(f"=" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nShutting down server...")
            httpd.shutdown()
