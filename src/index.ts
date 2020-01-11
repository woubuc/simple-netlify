import getPort from 'get-port';
import send from 'koa-send';
import boxen, { BorderStyle } from 'boxen';
import path from 'path';
import Koa from 'koa';

import { execCommand } from './execCommand';
import { fileExists } from './utils';
import { loadConfig } from './loadConfig';
import { loadRedirects } from './loadRedirects';

(async function main() {
	console.log('Parsing configuration');
	let config = await loadConfig();
	let redirects = await loadRedirects(config.publish);

	async function handler(ctx : Koa.Context) {
		for (let add of ['', '.html', 'index.html', '/index.html']) {
			let exists = await fileExists(path.join(config.publish, ctx.path + add));
			if (!exists) continue;

			console.log('%s', ctx.path + add);

			await send(ctx, ctx.path + add, { root: config.publish });
			return;
		}

		for (let rule of redirects) {
			let matched = rule.match(ctx.path);
			if (matched === false) continue;

			let to = rule.to;
			for (let [key, value] of Object.entries(matched.params)) {
				to = to.replace(`:${ key }`, value);
			}

			console.log('%s -> %s (%d)', ctx.path, to, rule.status);

			if (rule.status === 301 || rule.status === 302) {
				ctx.status = rule.status;
				ctx.redirect(to);
				return;
			}

			ctx.path = to;
			ctx.status = rule.status;
			await handler(ctx);
			return;
		}

		ctx.status = 404;
		ctx.body = '';
	}


	const app = new Koa();
	app.use(handler);
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
