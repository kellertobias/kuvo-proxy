import http from 'http'
import https from 'https'
import ws from 'ws'

import { HOST, WEB_PORT } from '../config'
import { createOrLoadKeys } from './encryption'
import { requestHandler } from './webhandler'

const wsClients : Set<((msg: string) => void)> = new Set()

let lastMessage : string = '{}'

export const sendWebsocketMessage = (msg: Record<string, any>) => {
    const msgString = JSON.stringify(msg)
    lastMessage = msgString
    wsClients.forEach(fn => fn(msgString))
}

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

        webserver.on('upgrade', (request, socket, head) => {
            wsServer.handleUpgrade(request, socket, head, (s) => {
                wsServer.emit('connection', s, request)
            })
        })
    
        return Promise.resolve()
    })
}

export default setupWebserver