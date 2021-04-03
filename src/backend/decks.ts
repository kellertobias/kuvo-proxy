import { Player, Track } from './player'
import { Queue } from './queue'

export type DeckCallbck = (d: Decks) => void

export class Decks {
    static listeners : DeckCallbck[] = []

    private _decks : Player[] = [1, 2, 3, 4].map(x => new Player(x))
    private _playlist : Queue<Track> = new Queue<Track>()

    public player(deck: number) {
        if(deck < 1 || deck > this._decks.length) {
            throw new Error('Deck does not exist')
        }
        return this._decks[deck-1]
    }

    static registerCallback(cb: DeckCallbck): void {
        Decks.listeners.push(cb)
    }

    private callCallbacks(): void {
        Decks.listeners.forEach(cb => cb(this))
    }

    get decks() {
        return this._decks
    }

    get playlist() {
        return this._playlist.array
    }

    public setPlaying(deck: number, loadIndex: number, time: number, trackData: {
        Title: string;
        Artist: string;
        Genre: string;
        Album: string;
        Comment: string;
        Composer: string;
        Lyricist: string;
        RecordLabel: string;
        ISRC: string;
        BPM: number;
        Key: number;
        Time: number;
    }): void {
        const player = this.player(deck)
        const trackChanged = player.load(
            loadIndex,
            trackData.Title,
            trackData.Artist,
            trackData.Genre,
            trackData.Album,
            trackData.Comment,
            trackData.Key,
            trackData.BPM / 100,
            trackData.Time
        )

        const track = player.track
        const playerWasStopped = !player.isPlaying
        player.start()

        if((trackChanged || playerWasStopped) && this._playlist.first != track) {
            this._playlist.add(track)
        }

        this.callCallbacks()
    }

    public setStop(deck: number, loadIndex: number, time: number): void {
        const player = this.player(deck)
        player.stop()
        this.callCallbacks()
    }
}