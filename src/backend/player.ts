import { Key } from './key';

export interface Track {
    title: string;
    artist: string;
    genre: string;
    album: string;
    comment: string;
    BPM: number;
    key: Key;
    time: number;
}

export class Player {
    readonly num : number
    private playing = false
    private loadIndexInternal: number = 0
    private loadedTrack : Track | undefined

    constructor(num: number) {
        if(num >= 1 || num <= 4) {
            this.num = num
        } else {
            throw new Error('PlayerNumber is invalid. Must be 1-4')
        }
        
    }

    private isDifferentTrack(a: Track, b: Track): boolean {
        if(a === b) {
            return false
        }
        if(!a) {
            return true
        }
        if(!b) {
            return true
        }
        for(let key in a) {
            if(String(a[key as keyof Track]) != String(b[key as keyof Track])) {
                return true;
            }
        }

        return false
    }

    load(loadIndex: number, title: string, artist: string, genre: string, album: string, comment: string, key: number, BPM: number, time: number): boolean {
        this.loadIndexInternal = loadIndex;
        const nextTrack = {
            title, artist, genre, album, comment, BPM, time,
            key: new Key(key)
        }
        const trackChanged = this.isDifferentTrack(this.loadedTrack, nextTrack)
        if(trackChanged) {
            this.loadedTrack = nextTrack
        }
        console.log(`[${this.num}] LOAD`, trackChanged ? 'different track' : 'same track', this.loadedTrack)

        return trackChanged
    }

    start() {
        this.playing = true
        console.log(`[${this.num}] PLAY >${this.track.title}<`)
    }

    stop() {
        this.playing = false
        console.log(`[${this.num}] STOP >${this.track?.title}<`)
    }

    get isPlaying() {
        return this.playing
    }

    get track() {
        return this.loadedTrack
    }

    get loadIndex() {
        return this.loadIndexInternal
    }
}