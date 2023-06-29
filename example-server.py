import http.server
import socketserver


def simple_handler(root):
    class SimpleSiteServer(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=root, **kwargs)

    return SimpleSiteServer

class Server:
    def __init__(self, root, port=8000):
      server = socketserver.TCPServer(("", port), simple_handler(root))
      print("Serving site %s at localhost:%d" % (root, port))
      server.serve_forever()

if __name__ == "__main__":
  server = Server("./example/")