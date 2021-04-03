import { RekordboxDJModel, DataFormatVersion, KuvoBasicMessage, MessageTypes } from './common'
import { app } from '../webhandler';
import { logRequest, proxyRequests, responseKuvo, logUnexpected } from '../webhandler'
import { Kuvo } from '../../backend/kuvo'

// START: challenge-auth
interface KuvoStartRequestBody extends KuvoBasicMessage  {
    SecretKey: string;
    ModelName: RekordboxDJModel;
    DataFormatVersion: DataFormatVersion;
    MessageType: MessageTypes.StartRequest
}

interface KuvoStartResponseBody extends KuvoBasicMessage  {
    MessageType: MessageTypes.StartResponse;
    StatusCode?: 0;
}

app.all('/liveplaylist/:version/challenge-auth', (req, res) => {
    logRequest(req)
    if(proxyRequests) {
        return
    }

    const message : KuvoBasicMessage = req.body
    if(message.MessageType == MessageTypes.StartRequest) {
        const response : KuvoStartResponseBody = {
            MessageType: MessageTypes.StartResponse,
            StatusCode: 0,
        }

        Kuvo.login((message as KuvoStartRequestBody).SecretKey)

        return responseKuvo(res, response)
    }

    logUnexpected(req);
    return responseKuvo(res, {MessageType: MessageTypes.NotifyResponse});
    
})