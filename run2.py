import SimpleHTTPServer
import SocketServer

PORT = 8000

class Handler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    pass
Handler.extensions_map['.js'] = 'text/javascript'

httpd = SocketServer.TCPServer(("", PORT), Handler)
httpd.serve_forever()
