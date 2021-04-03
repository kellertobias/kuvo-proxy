import http from 'http'
import https from 'https'

import { HOST, WEB_PORT } from '../config'
import { createOrLoadKeys } from './encryption'
import { requestHandler } from './webhandler'

const setupWebserver = () => {
    createOrLoadKeys().then((certificates) => {
    const encrypted = process.env.UNSAFE !== '1'
    const webserver = !encrypted ? http.createServer(requestHandler) : https.createServer({
            key: certificates.key,
            cert: certificates.cert,

        }, requestHandler)
    
        webserver.listen(WEB_PORT, () => {
            console.log(`WebServer is running on ${encrypted ? 'https' : 'http'}://${HOST}:${WEB_PORT}`);
        })
    
        return Promise.resolve()
    })
}

export default setupWebserver