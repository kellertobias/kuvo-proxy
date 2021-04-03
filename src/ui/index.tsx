import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import PlayingDisplay from './playing';
import SettingsView from './settings';

enum ViewName {
	home = 'home',
	settings = 'settings',
	playing = 'playing',
}

const MainApplication: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
	const [view, setView] = useState<ViewName>(ViewName.home);

	const buildViewChanger = (
		view: ViewName,
	): React.MouseEventHandler<HTMLButtonElement> => {
		return (e) => {
			e.stopPropagation();
			e.preventDefault();
			setView(view);
		};
	};

	useEffect(() => {
		ipcRenderer
			.invoke('settings/get')
			.then((props: { callbackPath?: string }) => {
				if (props.callbackPath) {
					setView(ViewName.playing);
				}
			});
	}, []);

	const setViewPlaying = buildViewChanger(ViewName.playing);
	const setViewSettings = buildViewChanger(ViewName.settings);

	return (
		<div className={'app theme-' + (theme ?? 'dark')}>
			<div className="title-bar">
				<div className="title">
					<h1>Tobisk KUVO Proxy</h1>
				</div>
				<div className="settings-button">
					<button
						onClick={
							view === ViewName.settings ? setViewPlaying : setViewSettings
						}
					>
						{view === ViewName.settings ? 'CLOSE' : ''} SETTINGS
					</button>
				</div>
			</div>
			<div className="content">
				{view !== ViewName.home ? null : (
					<>
						<h2>Welcome</h2>
						<p>This appliction needs some manual configuration</p>
						<p>
							You need to setup your hosts-file to resolve kuvo.com to{' '}
							<code>127.0.0.1</code>
						</p>
						<p>
							You then need to install our CA Certificate to allow this
							application to fake the secure connection to kuvo
						</p>
						<p>Open settings in order to setup your Application</p>
					</>
				)}
				{view !== ViewName.settings ? null : <SettingsView />}
				{view !== ViewName.playing ? null : <PlayingDisplay />}
			</div>
		</div>
	);
};

export default MainApplication;
