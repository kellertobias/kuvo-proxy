import { Decks } from '../backend/decks';

import { sendWebsocketMessage } from './webserver';
Decks.registerCallback((decks) => {
    const playlist : Set<typeof decks.playlist[0] | {paused: true}> = new Set()
    if(decks.decks.every(p => !p.isPlaying)) {
        playlist.add({paused: true})
    }
    decks.playlist.forEach(track => {
        if(!playlist.has(track)) {
            playlist.add(track)
        }
    })

    sendWebsocketMessage(Array.from(playlist))
})