import os
import sys

import traceback

from mitmproxy import http
from mitmproxy.master import Master
from mitmproxy.proxy import ProxyConfig, ProxyServer
from mitmproxy.options import Options
from mitmproxy.addons import core
from kuvo_handler import kuvo
import urllib
from pprint import pprint

class TestInterceptor(Master):
    def __init__(self, options, server):
        Master.__init__(self, options)
        self.server = server

    def run(self):
        while True:
            try:
                Master.run(self)
            except KeyboardInterrupt:
                self.shutdown()
                sys.exit(0)


class KuvoInterceptor:
    def __init__(self):
        print("Starting KuvoInterceptor")
        self.num = 0

    def load(self, loader):
        loader.add_option(
            name = "kuvo",
            typespec = bool,
            default = False,
            help = "Add a count header to responses",
        )

    def getField(self, data, field):
        try:
            data = data[field]
            return data[0]
        except Exception as e:
            print("getField", e)
            return None

    def _response(self, flow):
        print(f"handling: {flow.request.host} -- {flow.request.path}")
        if not flow.request.host == "kuvo.com":
            print("NOT KUVO")
            return
        

        musical_keys = [
            "1A", "1B",
            "2A", "2B",
            "3A", "3B",
            "4A", "4B",
            "5A", "5B",
            "6A", "6B",
            "7A", "7B",
            "8A", "8B",
            "9A", "9B",
            "10A", "10B",
            "11A", "11B",
            "12A", "12B"
        ]

        path = "%s" % flow.request.path
        if path.startswith('/liveplaylist/'):
            print("-------------------- HANDLING KUVO --------------------")

            headers = flow.request.headers
            content = flow.request.content
            req_body = urllib.parse.parse_qs(content.decode("utf-8"))

            if path == "/liveplaylist/1.00/challenge-auth":
                print("challenge-auth")
                flow.response = http.HTTPResponse.make(
                    200,  # (optional) status code
                    b"MessageType=2\nStatusCode=0",  # (optional) content
                    {"Content-Type": "text/plain"}  # (optional) headers
                )

                return
            
            if path == "/liveplaylist/1.00/notify-event-status":
                print("notify-event-status")
                flow.response = http.HTTPResponse.make(
                    200,  # (optional) status code
                    b"MessageType=6\nStatusCode=0\nEventID=%d" % self.num,  # (optional) content
                    {"Content-Type": "text/plain"}  # (optional) headers
                )
                self.num = self.num + 1
                
                return

            if path == "/liveplaylist/1.00/regist-play":
                print("regist-play")
                start_player = int(float(self.getField(req_body, "OA_Received_CDJ") or "0"))
                stop_player = int(float(self.getField(req_body, "OFF_Received_CDJ") or "0"))
                kuvo_req = {
                    'BPM': int(float(self.getField(req_body, "BPM") or "")),
                    'title': "%s" % self.getField(req_body, "Title"),
                    'artist': "%s" % self.getField(req_body, "Artist"),
                    'genre': "%s" % self.getField(req_body, "Genre"),
                    'time': int(float(self.getField(req_body, "Time") or "0")),
                    'key_num': int(float(self.getField(req_body, "Key") or "0")),
                    'player': max(start_player, stop_player),
                    'playing': start_player > 0
                }
                kuvo_req["key"] = musical_keys[kuvo_req['key_num'] - 1]
                kuvo(
                    kuvo_req["title"],
                    kuvo_req["artist"],
                    kuvo_req["genre"],
                    kuvo_req["BPM"],
                    kuvo_req["key"],
                    kuvo_req["time"],
                    kuvo_req["player"],
                    kuvo_req["playing"],
                )

                return

            return
       

    def request(self, flow):
        try:
            return self._response(flow)
        except Exception as e:
            print("EXCEPTION IN HANDLER")
            print(e)
            track = traceback.format_exc()
            print(track)



def start_proxy_server():
    options = Options(
        listen_port=8080
    )
    config = ProxyConfig(
        options=options
    )

    server = ProxyServer(config)
    m = TestInterceptor(options, server)
    m.addons.add(core.Core())
    m.addons.add(KuvoInterceptor())
    print('Intercepting Proxy listening on {0}'.format(8080))

    try:
        m.run()
    except KeyboardInterrupt:
        m.shutdown()