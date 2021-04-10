import { app } from '../webhandler';
import { logRequest, proxyRequests, responseKuvo, logUnexpected } from '../webhandler'

import './auth'
import './events'
import './play'




app.all('/isup', (req, res) => {
    logRequest(req)

    if(proxyRequests) {
        return
    }

    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    res.writeHead(200, 'success', {
        'ContentType': 'application/json'
    })
    res.write(JSON.stringify({
        status: 'RUNNING'
    }, null, 2))
    res.end()
})