#!/usr/bin/env python3

import threading
from proxy_config_provider import start_proxy_configuration_provider
from proxy_server import start_proxy_server

webserver = threading.Thread(target=start_proxy_configuration_provider)
webserver.start()
start_proxy_server()

webserver.join()