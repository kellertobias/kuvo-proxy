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
	ipcRenderer
		.invoke('certificate/get')
		.then((props: { certificates: CertificateStore }) => {
			const { certificates: cert } = props;
			console.log(cert);
			download(cert.key || '', 'application/x-pem-file', 'kuvo-ca.pem');
		});
};

const SettingsView: React.FC<{}> = () => {
	const [callbackPath, setCallbackPath] = useState<string>('');
	useEffect(() => {
		ipcRenderer
			.invoke('settings/get')
			.then((props: { callbackPath: string }) => {
				setCallbackPath(props.callbackPath);
			});
	}, []);

	const changeCallbackPath: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const value = e.currentTarget.value;
		setCallbackPath(value);
		ipcRenderer.invoke('settings/set', { callbackPath: value });
	};
	return (
		<div className="view view-settings">
			<div className="view-title">
				<h2>Settings</h2>
			</div>
			<div className="settings-entry">
				<h3>Certificate Authority</h3>
				<p>
					Download this file and install it. To learn how to do this, search
					google (e.g. install certificate Authority on Mac OS)
				</p>
				<button onClick={downloadCertificate}>Download Certificate file</button>
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
