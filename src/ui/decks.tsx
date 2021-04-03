import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { DecksApiDeck } from '../config';
import clsx from 'clsx';

import Track from './trackdetails';

const DecksDisplay: React.FC<{}> = () => {
	const [decks, setDecks] = useState<DecksApiDeck[]>([]);

	useEffect(() => {
		const update = () => {
			ipcRenderer.invoke('status/decks').then((newDecks: DecksApiDeck[]) => {
				setDecks(newDecks);
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
		<div className="decks">
			<h3>Decks</h3>
			{decks.map((deck, key) => {
				return (
					<div
						key={key}
						className={clsx('deck', {
							'deck-playing': deck.playing,
							'deck-stopped': !deck.playing,
						})}
					>
						<div className="playstate">{deck.playing ? 'PLAY' : 'STOP'}</div>
						<Track
							title={deck.title}
							artist={deck.artist}
							musicalKey={deck.key}
							bpm={deck.BPM}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default DecksDisplay;
