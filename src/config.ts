export const HOST = "localhost";
export const WEB_PORT = 443;
export const PROXY_PORT = 8080;
export const PROXY_DOMAINS = [
    'kuvo.com',
    '*.kuvo.com',
    'localhost'
];

export interface DecksApiPlaylist {
    title: string;
    artist: string;
    BPM: number;
    key: [number, string]
}

export interface DecksApiDeck extends DecksApiPlaylist{
    playing: boolean;
    num: number;
}
