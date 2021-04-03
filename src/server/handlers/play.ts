import { app } from '../webhandler';
import { logRequest, proxyRequests, responseKuvo, logUnexpected } from '../webhandler'
import { RekordboxDJModel, DataFormatVersion, KuvoEventId, MessageTypes, KuvoBasicMessage } from './common'
import { Kuvo, KuvoStatusChange, KuvoStatusChangeMessage } from '../../backend/kuvo'

// event regist-play
interface KuvoPlayRequestBody extends KuvoBasicMessage {
    SecretKey: string;
    MessageType: MessageTypes.PlayRequest;
    ModelName: RekordboxDJModel;
    DataFormatVersion: DataFormatVersion;
    EventID: KuvoEventId; //Same event ID as given back in notify-event
    CycleNumber: number;
    [key: string]: number | string;
}

interface KuvoPlayResponseBody extends KuvoBasicMessage {
    MessageType: MessageTypes.PlayResponse;
    StatusCode: 0;
    CycleNumber: number; // Same Cycle Number as in request
}

app.all('/liveplaylist/:version/regist-play', (req, res) => {
    logRequest(req)

    if(proxyRequests) {
        return
    }
    
    const message : KuvoPlayRequestBody = req.body
    const response : KuvoPlayResponseBody = {
        MessageType: MessageTypes.PlayResponse,
        StatusCode: 0,
        CycleNumber: message.CycleNumber
    }    
    
    if(message.MessageType == MessageTypes.PlayRequest) {
        let stringValues : {[key: string]: string} = {}
        let numberValues : {[key: string]: number} = {}

        Object.keys(message).forEach(key => {
            const typedKey = key as keyof typeof KuvoStatusChange
            if(typeof KuvoStatusChange[typedKey] === 'undefined') {
                return
            }
            if(typeof KuvoStatusChange[typedKey] === 'number') {
                numberValues[key] = Number(message[key])
            }
            if(typeof KuvoStatusChange[typedKey] === 'string') {
                stringValues[key] = String(message[key])
            }
        })

        Kuvo.status(message.SecretKey, Number(message.EventID), {
            ...numberValues,
            ...stringValues
        } as KuvoStatusChangeMessage)

        return responseKuvo(res, response)
    }

    logUnexpected(req);
    return responseKuvo(res, {MessageType: MessageTypes.NotifyResponse});
})

