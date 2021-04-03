import {ipcMain} from 'electron'

import { Decks } from '../backend/decks';
import { DecksApiDeck, DecksApiPlaylist } from '../config'

let status : {
    decks?: Decks
} = {}

export type UpdateClientCallback = (decks: Decks) => void

export const listeners : UpdateClientCallback[] = []

Decks.registerCallback((decks) => {
    status.decks = decks
    listeners.forEach(x => x(decks))
})
const emptyDeckPlayer = (num: number): DecksApiDeck => {
    return {
        playing: false,
        num,
        title: undefined,
        artist: undefined,
        BPM: undefined,
        key: [0, '']
    }

}
const emptyDecks = [1,2,3,4].map(n => emptyDeckPlayer(n))

ipcMain.handle('status/decks', async (event) => {
    return status.decks?.decks?.map(player => {
        const data : DecksApiDeck = {
            playing: player.isPlaying,
            num: player.num,
            title: player.track?.title,
            artist: player.track?.artist,
            BPM: player.track?.BPM,
            key: player.track?.key?.camelot ?? [0, ''],
        }

        return data
    }) ?? emptyDecks
})

ipcMain.handle('status/playlist', async (event) => {
    return status.decks?.playlist?.map(track => {
        const data : DecksApiPlaylist = {
            title: track?.title,
            artist: track?.artist,
            BPM: track?.BPM,
            key: track?.key?.camelot ?? [0, ''],
        }

        return data
    }) ?? []
})