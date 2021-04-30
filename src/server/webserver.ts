import http from 'http'
import https from 'https'
import ws from 'ws'

import { HOST, HTTPS_PORT, HTTP_PORT } from '../config'
import { createOrLoadKeys } from './encryption'
import { requestHandler } from './webhandler'
import { setupSystem } from './system-setup'

const wsClients : Set<((msg: string) => void)> = new Set()

let lastMessage : string = '{}'

export const sendWebsocketMessage = (msg: Record<string, any>) => {
    const msgString = JSON.stringify(msg)
    lastMessage = msgString
    wsClients.forEach(fn => fn(msgString))
}

const setupWebserver = () => {
    setupSystem().then(() => {
        return createOrLoadKeys()
    }).then((certificates) => {
    
        const webserver = http.createServer(requestHandler);
        
        const secureWebserver = https.createServer({
            key: certificates.key,
            cert: certificates.cert,
        }, requestHandler)
        
        secureWebserver.listen(HTTPS_PORT, () => {
            console.log(`SecureWebServer is running on https://${HOST}:${HTTPS_PORT}`);
        })
        webserver.listen(HTTP_PORT, () => {
            console.log(`WebServer is running on http://${HOST}:${HTTP_PORT}`);
        })

        const wsServer = new ws.Server({noServer: true});
        wsServer.on('connection', socket => {
            const sendFn = (msg: string) => {
                socket.send(msg)
            }

            wsClients.add(sendFn)
            socket.onclose = () => {
                wsClients.delete(sendFn)
            }

            socket.send(lastMessage)
        })

        secureWebserver.on('upgrade', (request, socket, head) => {
            wsServer.handleUpgrade(request, socket, head, (s) => {
                wsServer.emit('connection', s, request)
            })
        })
        webserver.on('upgrade', (request, socket, head) => {
            wsServer.handleUpgrade(request, socket, head, (s) => {
                wsServer.emit('connection', s, request)
            })
        })
    
        return Promise.resolve()
    })
}

export default setupWebserver