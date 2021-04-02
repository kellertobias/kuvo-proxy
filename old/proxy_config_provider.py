from http.server import HTTPServer, BaseHTTPRequestHandler
from os.path import exists
import time
PORT_NUMBER = 80
HOST_NAME = "127.0.0.1"

class ProxyConfigProvider(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        print(s.path)
        if s.path != "/proxy.pac":
            s.send_response(404)
            s.send_header("Content-type", "text/html")
            s.end_headers()
            s.wfile.write("404")
            return
        with open('./proxy.pac', 'rb') as fh:
            s.send_response(200)
            s.end_headers()
            
            data = fh.read()
            #data = bytes(data, 'utf8')
            s.wfile.write(data)
            return


def start_proxy_configuration_provider():
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), ProxyConfigProvider)
    print(time.asctime(), "Proxy Configuration Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Proxy Configuration Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))