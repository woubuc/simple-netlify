const spawn = require('cross-spawn');
const cleanup = require('node-cleanup');

import { Config } from './loadConfig';

export function execCommand(config : Config) : void {
	console.log('Executing dev command', config.command);

	let cmd = config.command.split(' ');
	let child = spawn(cmd[0], cmd.slice(1), {
		env: {
			URL: `http://localhost:${ config.port }`,
			DEPLOY_URL: `http://localhost:${ config.port }`,
			...process.env,
		},
	});

	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);

	cleanup(function onExit() {
		child.stdout.destroy();
		child.stderr.destroy();
		child.kill('SIGTERM');
	});
}
