import minimist from 'minimist';
import getPort from 'get-port';
import _get from 'lodash.get';
import path from 'path';
import toml from 'toml';

import { readFile } from './utils';

const argv = minimist(process.argv.slice(2), {
	alias: {
		p: 'publish',
		c: 'command',
	},
});

export interface Config {
	publish : string;
	port : number;

	command ?: string;
}

export async function loadConfig() {
	let config : Config = {
		publish: undefined,
		command: undefined,
		port: undefined,
	};

	if (argv['p']) {
		config.publish = path.resolve(argv['p']);
	}

	if (argv['c']) {
		config.command = argv['c'];
	}

	if (argv['port']) {
		config.port = parseInt(argv['port'], 10);
	}

	let netlify = await readFile('netlify.toml');

	if (netlify !== undefined) {
		netlify = toml.parse(netlify);

		if (config.publish === undefined) {
			let publish = _get(netlify, 'dev.publish', _get(netlify, 'build.publish'));
			if (publish !== undefined) {
				config.publish = path.resolve(publish);
			}
		}

		if (config.command === undefined) {
			let command = _get(netlify, 'dev.command', _get(netlify, 'build.command'));
			if (command !== undefined) {
				config.command = command;
			}
		}

		if (config.port === undefined) {
			let port = _get(netlify, 'dev.port');
			if (port !== undefined) {
				config.port = parseInt(port, 10);
			}
		}
	}

	if (config.publish === undefined) {
		config.publish = path.resolve('dist');
	}

	if (config.port === undefined) {
		config.port = await getPort({
			port: getPort.makeRange(9000, 9999),
		});
	}

	return config;
}
