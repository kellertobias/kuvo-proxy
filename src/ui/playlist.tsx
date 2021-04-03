import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { DecksApiPlaylist } from '../config';
import Track from './trackdetails';

const Playlist: React.FC<{}> = () => {
	const [playlist, setPlaylist] = useState<DecksApiPlaylist[]>([]);

	useEffect(() => {
		const update = () => {
			ipcRenderer
				.invoke('status/playlist')
				.then((newPlaylist: DecksApiPlaylist[]) => {
					setPlaylist(newPlaylist);
				});
		};
		const listener: (
			event?: Electron.IpcRendererEvent,
			...args: any[]
		) => void = (e, msg) => update();

		ipcRenderer.on('decks', listener);
		update();

		return () => {
			ipcRenderer.off('decks', listener);
		};
	}, []);

	return (
		<div className="playlist">
			<h3>Last Played</h3>
			{playlist.map((track, key) => {
				return (
					<div key={key} className="playlist-track">
						<div className="playstate"></div>
						<Track
							title={track.title}
							artist={track.artist}
							musicalKey={track.key}
							bpm={track.BPM}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Playlist;
