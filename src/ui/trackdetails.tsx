import React from 'react';

const Track: React.FC<{
	title?: string;
	artist?: string;
	musicalKey?: [number, string];
	bpm?: number;
}> = ({ title, artist, musicalKey, bpm }) => {
	return (
		<>
			<div className="track">
				<div className="title">{title ? title : '-----'}</div>
				<div className="artist">{artist ? artist : ''}</div>
			</div>
			<div className="details">
				<div className="key">
					{musicalKey[0] ? (
						<>
							{musicalKey[0]}
							{musicalKey[1]}
						</>
					) : null}
				</div>
				<div className="bpm">{bpm ?? ''}</div>
			</div>
		</>
	);
};

export default Track;
