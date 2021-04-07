import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import { HOST, WEB_PORT } from '../config';
import { CertificateStore } from '../types/certificate';

import download from './helpers/download';

import PlayingDisplay from './playing';

const downloadCertificate: React.MouseEventHandler<HTMLButtonElement> = (e) => {
	e.preventDefault();
	e.stopPropagation();
	const target = e.currentTarget;
	console.log(target.getAttribute('data-name'));
	ipcRenderer.invoke('certificate/get').then((cert) => {
		console.log(cert);
		download(cert || '', 'application/x-pem-file', 'kuvo-ca.pem');
	});
};

const SettingsView: React.FC<{}> = () => {
	const [callbackPath, setCallbackPath] = useState<string>('');
	const [stopDelay, setStopDelay] = useState<number>(5);
	const [revertTracks, setRevertTracks] = useState<boolean>(true);

	useEffect(() => {
		ipcRenderer
			.invoke('settings/get')
			.then(
				(props: {
					callbackPath: string;
					revertToPreviousAfterStop: boolean;
					stopDelay: number;
				}) => {
					setCallbackPath(props.callbackPath);
					setStopDelay(props.stopDelay);
					setRevertTracks(props.revertToPreviousAfterStop);
				},
			);
	}, []);

	const changeCallbackPath: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const value = e.currentTarget.value;
		setCallbackPath(value);
		ipcRenderer.invoke('settings/set', { callbackPath: value });
	};

	const changeStopDelay: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = Number(e.currentTarget.value);
		setStopDelay(value);
		ipcRenderer.invoke('settings/set', { stopDelay: value });
	};

	const changeRevertTracks: React.ChangeEventHandler<HTMLSelectElement> = (
		e,
	) => {
		const value = e.currentTarget.value == 'true' ? true : false;
		setRevertTracks(value);
		ipcRenderer.invoke('settings/set', { revertToPreviousAfterStop: value });
	};

	return (
		<div className="view view-settings">
			<div className="view-title">
				<h2>Settings</h2>
			</div>
			<div className="settings-entry">
				<h3>Behaviour</h3>
				<p>
					<b>Stop Holdback Time</b> is the time between Rekordbox sending that
					the track no longer is playing and us actually handling this event.
					Higher times means that you can have longer quiet parts in the song
					and longer intervals between Hot Cues Samples without triggering Stop.
				</p>
				<p>Time in Seconds. Set to zero to disable.</p>
				<input
					value={stopDelay}
					onChange={changeStopDelay}
					placeholder="Stop Holdback Time"
				/>

				<p>
					<b>Revert to previous track after stop</b> enabled, means that after
					stopping a track, we search for the next track in the playlist that is
					still playling and will put that again on the top of the playlist.
				</p>
				<select value={String(revertTracks)} onChange={changeRevertTracks}>
					<option value={'true'}>Revert Tracks (On)</option>
					<option value={'false'}>Don't Revert Tracks (Off)</option>
				</select>
			</div>
			<div className="settings-entry">
				<h3>Certificate Authority</h3>
				<p>
					Download this file and install it. To learn how to do this, search
					google (e.g. install certificate Authority on Mac OS)
				</p>
				<button onClick={downloadCertificate}>
					Download Root Certificate file
				</button>
			</div>
			<div className="settings-entry">
				<h3>Setup DNS Resolving</h3>
				<p>
					On Unix Systems (Mac OS, Linux), edit the fole <code>/etc/hosts</code>
					, for windows google how to do it. You need to add the following line:
				</p>
				<pre>
					# if you run the proxy on the same machine as rekordbox
					<br />
					127.0.0.1 kuvo.com
					<br />
					# if you run the proxy on another machine:
					<br />
					your.proxy.ip.address kuvo.vom
				</pre>
				<p>
					To test if it worked, you can restart your browser and then access{' '}
					<a href="https://kuvo.com" target="_blank">
						https://kuvo.com
					</a>
					. You will see text telling you that the proxy is working
				</p>
			</div>
			<div className="settings-entry">
				<h3>Path to file/api server</h3>
				<p>
					Now you can setup the way we inform you about changes in tracks. This
					can be either a http or https-api (start the URL with{' '}
					<code>http://</code> or <code>https://</code>){' '}
					<span className="text-muted text-strike">
						or a local file (start with <code>/</code>)
					</span>
				</p>
				<input
					value={callbackPath}
					onChange={changeCallbackPath}
					placeholder="http://your-server:port/path OR /absolute/path OR ~/user/path"
				/>
			</div>
		</div>
	);
};

export default SettingsView;
