import http from 'http'
import net from 'net'
import URL from 'url'

import { HOST, WEB_PORT, PROXY_PORT } from './config'



const PROXY_CONFIG = `
function FindProxyForURL(url, host) {
    PROXY = "PROXY 127.0.0.1:${PROXY_PORT}"

    if (shExpMatch(host,"kuvo.com")) {
        return PROXY;
    }
    if (shExpMatch(host,"*.kuvo.com")) {
         return PROXY;
    }
    // Everything else directly!
    return "DIRECT";
}
`

const requestHandler: http.RequestListener = (req, res) => {
    res.writeHead(200);
    res.end(PROXY_CONFIG);
}

const webserver = http.createServer(requestHandler)

webserver.listen(WEB_PORT, HOST, () => {
    console.log(`WebServer is running on http://${HOST}:${WEB_PORT}`);
})