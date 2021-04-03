export type RekordboxDJModel = string | 'rekordboxDJ'
export type DataFormatVersion = '1'
export type KuvoEventId = string | number
export enum MessageTypes {
    StartRequest = 1,
    StartResponse = 2,
    PlayRequest = 3,
    PlayResponse = 4,
    NotifyRequest = 5,
    NotifyResponse = 6,
}
export interface KuvoBasicMessage {
    MessageType: MessageTypes;
    [key: string]: string | number | boolean
}