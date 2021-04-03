import { Decks } from './decks';

// A little hack to avoid writing code over and over again
// this is being used to cast the inputs (which is all string)
// to the correct type inside the rest api as sadly typescript
// does not support stuff like this
export const KuvoStatusChange = {
    CycleNumber: 0,
    CDJ1: 0,
    CDJ2: 0,
    CDJ3: 0,
    CDJ4: 0,
    OA_CDJ1: 0,
    OA_CDJ2: 0,
    OA_CDJ3: 0,
    OA_CDJ4: 0,
    OA_Received_CDJ: 0,
    OFF_Received_CDJ: 0,
    UniversalTime: 0,
    CDJFlag: 0,
    Flag: 0,
    Time: 0,
    ContentsID: '',
    Title: '',
    Artist: '',
    Genre: '',
    Comment2: '',
    Album: '',
    Composer: '',
    Lyricist: '',
    RecordLabel: '',
    ISRC: '',
    Key: 0,
    BPM: 0, // bpm * 100
    MusicID: '',
    LoadID: 0,
}

export type KuvoStatusChangeMessage = typeof KuvoStatusChange

const maxStartPlaylistNumber = 9999
const mixStartPlaylistNumber = 1000

export class Kuvo {
    static nextPlaylistNumber = Math.floor(Math.random()*(maxStartPlaylistNumber-mixStartPlaylistNumber+1)+mixStartPlaylistNumber);
    static playlists : {[userId: string]: Kuvo} = {}

    eventId : number;
    userId : string;
    decks: Decks

    constructor(userId: string) {
        this.userId = userId
        this.eventId = Kuvo.nextPlaylistNumber++
        this.decks = new Decks()
    }

    static login(userId: string): void {
        console.log(`KUVO CONNECTED`)
    }

    static start(userId: string): number {
        console.log("KUVO PLAYLIST STARTED")
        if(Kuvo.playlists[userId]) {
            console.log('User Already Playing')
            return Kuvo.playlists[userId].eventId
        }
        const session = new Kuvo(userId)
        Kuvo.playlists[userId] = session
        return session.eventId++
    }

    static stop(userId: string): void {
        console.log("KUVO PLAYLIST STOPPED")
        if(!Kuvo.playlists[userId]) {
            console.log('User Not Playing')
            return
        }
        delete Kuvo.playlists[userId]
    }

    static status(userId: string, eventId: number, status: KuvoStatusChangeMessage): void {
        // In a "Real" Kuvo server this would not happen.
        // But as we want to avoid crashes as we usually only
        // server a single user, we create a new Session if
        // session does not exist. This could happen e.g.
        // if our app restarted while the Client still thought
        // the session was active
        if(!Kuvo.playlists[userId]) {
            Kuvo.start(userId)
        }

        const session = Kuvo.playlists[userId]
        const startingPlayer = status.OA_Received_CDJ
        const stoppingPlayer = status.OFF_Received_CDJ
        if(startingPlayer > 0) {
            const {
                Title,
                Artist,
                Genre,
                Album,
                Comment2: Comment,
                Composer,
                Lyricist,
                RecordLabel,
                ISRC,
                BPM,
                Key,
                Time,
            } = status
            console.log(status)
            session.decks.setPlaying(
                startingPlayer,
                status.LoadID,
                status.UniversalTime,
                {
                    Title,
                    Artist,
                    Genre,
                    Album,
                    Comment,
                    Composer,
                    Lyricist,
                    RecordLabel,
                    ISRC,
                    BPM,
                    Key,
                    Time,
                }
            )
        }
        if(stoppingPlayer > 0) {
            session.decks.setStop(
                stoppingPlayer,
                status.LoadID,
                status.UniversalTime
            )
        }
    }
}