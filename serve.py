#!/usr/bin/env python3
"""Tiny static server with HTTP Range support — needed for video scrubbing."""
import http.server, os, re, socketserver, sys, mimetypes
from pathlib import Path

ROOT = Path(__file__).parent / "site"
PORT = int(os.environ.get("PORT", "5173"))

mimetypes.add_type("video/mp4", ".mp4")

class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().do_GET()

        rng = self.headers.get("Range")
        if not rng:
            return super().do_GET()

        m = re.match(r"bytes=(\d*)-(\d*)$", rng)
        if not m:
            self.send_error(416, "Invalid Range")
            return
        size = os.path.getsize(path)
        start = int(m.group(1)) if m.group(1) else 0
        end   = int(m.group(2)) if m.group(2) else size - 1
        end = min(end, size - 1)
        if start > end or start >= size:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return

        ctype = self.guess_type(path)
        length = end - start + 1
        with open(path, "rb") as f:
            f.seek(start)
            self.send_response(206)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(length))
            self.end_headers()
            remaining = length
            while remaining:
                chunk = f.read(min(64 * 1024, remaining))
                if not chunk: break
                try: self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError): return
                remaining -= len(chunk)

    def log_message(self, *a, **k): pass


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    print(f"→ http://127.0.0.1:{PORT}  (root: {ROOT})", file=sys.stderr)
    with Server(("127.0.0.1", PORT), RangeHandler) as httpd:
        try: httpd.serve_forever()
        except KeyboardInterrupt: pass
