import { RekordboxDJModel, DataFormatVersion, KuvoEventId, KuvoBasicMessage, MessageTypes } from './common'
import { app } from '../webhandler';
import { logRequest, proxyRequests, logUnexpected, responseKuvo } from '../webhandler'
import { Kuvo } from '../../backend/kuvo'

enum EventStatus {
    PLAY = 1,
    STOP = 0,
}

interface KuvoNotifyRequestBody extends KuvoBasicMessage {
    EventStatus: EventStatus;
    MessageType: MessageTypes.NotifyRequest;
    SecretKey: string;
    ModelName: RekordboxDJModel;
    DataFormatVersion: DataFormatVersion;
}

// START: notify-event-status
interface KuvoNotifyStartRequestBody extends KuvoNotifyRequestBody  {
    EventStatus: EventStatus.PLAY;
}

interface KuvoNotifyStartResponseBody extends KuvoBasicMessage  {
    MessageType: MessageTypes.NotifyResponse;
    StatusCode: 0;
    EventID: KuvoEventId;
}

// STOP: notify-event-status
interface KuvoNotifyStopRequestBody extends KuvoNotifyRequestBody  {
    EventStatus: EventStatus.STOP;
}

interface KuvoNotifyStopResponseBody extends KuvoBasicMessage  {
    MessageType: MessageTypes.NotifyResponse;
    StatusCode: 0;
}

app.all('/liveplaylist/:version/notify-event-status', (req, res) => {
    logRequest(req)
    if(proxyRequests) {
        return
    }

    const message : KuvoNotifyRequestBody = req.body
    if(message.MessageType != MessageTypes.NotifyRequest) {
        logUnexpected(req);
        return responseKuvo(res, {MessageType: MessageTypes.NotifyResponse});
    }

    const status = Number(message.EventStatus)
    if(status == EventStatus.PLAY) {
        const startMessage = message as KuvoNotifyStartRequestBody
        const eventId = Kuvo.start(startMessage.SecretKey)
        const response : KuvoNotifyStartResponseBody = {
            StatusCode: 0,
            EventID: eventId,
            MessageType: MessageTypes.NotifyResponse
        }

        return responseKuvo(res, response)
    } else if(status == EventStatus.STOP) {
        const stopMessage = message as KuvoNotifyStopRequestBody
        Kuvo.stop(stopMessage.SecretKey)
        const response : KuvoNotifyStopResponseBody = {
            StatusCode: 0,
            MessageType: MessageTypes.NotifyResponse
        }

        return responseKuvo(res, response)
    } else {
        logUnexpected(req);
        return responseKuvo(res, {MessageType: MessageTypes.NotifyResponse});
    }


    
})
