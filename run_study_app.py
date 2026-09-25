import http.server
import socketserver
import webbrowser
import os
import sys
import socket

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORTS_TO_TRY = [8080, 8085, 8088, 8090, 8888]
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    # Suppress verbose terminal log spam
    def log_message(self, format, *args):
        pass

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def start_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    local_ip = get_local_ip()

    for port in PORTS_TO_TRY:
        try:
            with socketserver.TCPServer(("0.0.0.0", port), Handler) as httpd:
                local_url = f"http://localhost:{port}"
                network_url = f"http://{local_ip}:{port}"

                print("============================================================")
                print("       EDUPULSE - ULTIMATE AI STUDY SUPER-APP")
                print("============================================================")
                print(f"[*] Computer / Laptop Link:  {local_url}")
                print(f"[*] Mobile / Phone Link:     {network_url}  (Same Wi-Fi)")
                print("------------------------------------------------------------")
                print("[*] Opening your default browser automatically...")
                print("[*] Press Ctrl + C in this window to stop the server.")
                print("============================================================")
                
                try:
                    webbrowser.open(local_url)
                except Exception:
                    pass
                
                httpd.serve_forever()
                break
        except OSError:
            # Port is occupied, try next available port
            continue

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\nEduPulse study server stopped. Good luck with your studies!")
