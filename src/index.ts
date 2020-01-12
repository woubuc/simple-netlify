import boxen, { BorderStyle } from 'boxen';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';

import { execCommand } from './execCommand';
import { loadConfig } from './loadConfig';
import { loadRedirects } from './loadRedirects';
import { requestHandler } from './handleRequest';

(async function main() {
	console.log('Parsing configuration...');
	let config = await loadConfig();
	let redirects = await loadRedirects(config.publish);

	console.log('Starting server...');
	const app = new Koa();
	app.use(bodyParser());
	app.use(requestHandler(config, redirects));
	await app.listen(config.port);

	console.log(boxen(`Dev server listening on http://localhost:${ config.port }/`, {
		padding: 1,
		borderColor: 'cyan',
		borderStyle: BorderStyle.Round,
	}));

	if (config.command.length > 0) {
		execCommand(config);
	}
})();
