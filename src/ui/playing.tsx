import React from 'react';
import DecksDisplay from './decks';
import Playlist from './playlist';

const PlayingDisplay: React.FC<{}> = () => {
	return (
		<div className="view view-playing">
			<DecksDisplay />
			<Playlist />
		</div>
	);
};

export default PlayingDisplay;
