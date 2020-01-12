import { join, basename, extname } from 'path';
import send from 'koa-send';

import { Context, Middleware } from 'koa';
import { fileExists } from './utils';
import { Config } from './loadConfig';
import { RedirectRule } from './loadRedirects';
import { execFunction } from './execFunction';

export function requestHandler(config : Config, redirects : RedirectRule[]) : Middleware {
	return async function handleRequest(ctx : Context) : Promise<void> {

		if (config.functions !== undefined && ctx.path.startsWith('/.netlify/functions')) {
			let functionName = basename(ctx.path);
			return execFunction(config, functionName, ctx);
		}

		for (let add of ['', '.html', 'index.html', '/index.html']) {
			let exists = await fileExists(join(config.publish, ctx.path + add));
			if (!exists) continue;

			console.log('%s', ctx.path + add);

			return send(ctx, ctx.path + add, { root: config.publish });
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
			return handleRequest(ctx);
		}

		ctx.status = 404;
		ctx.body = '';
	}
}
