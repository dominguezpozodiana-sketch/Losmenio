import http.server
import socketserver

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # Forzar el tipo MIME para manifest.json
        if path.endswith('.json'):
            return 'application/json'
        # Para otros archivos, usar el comportamiento por defecto
        return super().guess_type(path)

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Servidor corriendo en http://localhost:{PORT}")
    httpd.serve_forever()