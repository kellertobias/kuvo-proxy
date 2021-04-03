import http from 'http'
import HttpProxy from 'http-proxy'
import dns from 'dns'
import express, {Request} from 'express'
import { Response, ParamsDictionary, Query} from 'express-serve-static-core'
import util from 'util'

export type HttpHandler = (req: http.IncomingMessage, res: http.ServerResponse) => boolean

export const app = express()

export type ExpressRequest = Request<ParamsDictionary, any, any, Query, Record<string, any>>
export type ExpressResponse = Response<any, Record<string, any>, number>

app.use(
    express.urlencoded({
        extended: true
    })
)

const kuvoHost = 'kuvo.com'
let kuvoOriginal : string | false = false
export const proxyRequests = process.env.SPY

const lookupOriginalKuvo = () => {
    dns.resolve(kuvoHost, (err, address) => {
        kuvoOriginal = `https://${address.join('.')}:443`
        console.log(`Looked up KUVO.COM: ${kuvoOriginal}`)
    })
}

if(proxyRequests) {
    setInterval(lookupOriginalKuvo, 5 * 60 * 1000)
    lookupOriginalKuvo()
}

const proxy = HttpProxy.createProxyServer({
    secure: false,
})

export const logRequest = (req: ExpressRequest) => {
    if(process.env.LOG != '1') {
        return
    }

    console.log(`[REQ | ${req.method}] ${req.url}`)
    console.log(util.inspect({
        body: req.body
    }, {
        colors: true,
        depth: 10
    }))
}

export const logUnexpected = (req: ExpressRequest) => {
    console.log(`📙: Unexpected Request for handler ${req.url}`, req.body)
    
}

export const responseKuvo = (res: ExpressResponse, body: {[key: string]: number | boolean | string}) => {
    res.writeHead(200, 'success', {
        'ContentType': 'text/plain'
    })
    if(!body.StatusCode) {
        body.StatusCode = 0
    }
    const data = Object.keys(body).map((key) => `${key}=${body[key]}`).join('\n')
    res.write(data)
    res.end()
}

export const requestHandler: http.RequestListener = (req, res) => {
    if(process.env.LOG != '1') {
        console.log(`[${req.method}] ${req.url}`)
    }
    app(req, res)
    if(proxyRequests && kuvoOriginal) {
        console.log("> FWD")
        let fullData = ''
        // @ts-ignore
        res.oldWrite = res.write
        // @ts-ignore
        res.write = (data) => {
            fullData += data.toString('utf-8')
            // @ts-ignore
            res.oldWrite(data)
        }
        proxy.web(req, res, {target: kuvoOriginal})
        res.on('close', () => {
            console.log(`[RES | ${req.method}] ${req.url}`)
            console.log(util.inspect({
                body: fullData
            }, {
                colors: true,
                depth: 10
            }))
        })
    }
}
