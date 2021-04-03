import React from 'react';
import * as ReactDOM from 'react-dom';

import MainApplication from './ui/index';

import './index.css';

ReactDOM.render(
	<MainApplication theme={'dark'} />,
	document.getElementById('app'),
);

console.log(
	'👋 welcome. this tool was developed by Tobias S. Keller. Have fun :)',
);
