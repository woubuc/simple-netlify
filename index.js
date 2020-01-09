#!/usr/bin/env node
const redirectParser = require('netlify-redirect-parser');
const { match } = require('path-to-regexp');
const minimist = require('minimist');
const getPort = require('get-port');
const _get = require('lodash.get');
const send = require('koa-send');
const boxen = require('boxen');
const execa = require('execa');
const toml = require('toml');
const path = require('path');
const Koa = require('koa');
const fs = require('fs');

const argv = minimist(process.argv.slice(2), {
	alias: {
		p: 'publish',
		c: 'command',
	},
});

function readFile(file) {
	try {
		return fs.readFileSync(file).toString();
	} catch (_) {
		return undefined;
	}
}

function getConfig() {
	let config = {
		publish: path.resolve('dist'),
		command: 'yon dev',
	};

	if (argv['p']) {
		config.publish = path.resolve(argv['p']);
	}

	if (argv['c']) {
		config.command = argv['c'];
	}

	let netlify = readFile('netlify.toml');
	if (netlify === undefined) {
		return config;
	}

	netlify = toml.parse(netlify);

	if (config.publish === undefined) {
		let publish = _get(netlify, 'dev.publish', _get(netlify, 'build.publish', 'dist'));
		config.publish = path.resolve(publish);
	}

	if (config.command === undefined) {
		config.command = _get(netlify, 'dev.command', _get(netlify, 'build.command', 'dist'));
	}

	return config;
}

async function getRedirects(publish) {
	let redirects = await redirectParser.parseRedirectsFormat(path.join(publish, '_redirects')).then(r => r.success);

	return redirects.map(rule => ({
		to: rule.to,
		status: rule.status || 301,
		match: match(rule.path.replace('*', ':splat')),
	}));
}

function fileExists(file) {
	return new Promise(resolve => {
		fs.stat(file, (err, stat) => {
			if (err) {
				resolve(false);
			} else {
				resolve(stat.isFile());
			}
		})
	});
}

(async function dev() {
	console.log('Parsing configuration');
	let config = getConfig();
	let redirects = await getRedirects(config.publish);

	async function handler(ctx) {
		if (ctx.url.endsWith('/')) {
			ctx.url = ctx.url.slice(0, -1);
		}

		for (let add of ['', '.html', '/index.html']) {
			let exists = await fileExists(path.join(config.publish, ctx.url + add));
			if (!exists) continue;

			console.log('%s', ctx.url + add);

			await send(ctx, ctx.url + add, { root: config.publish });
			return;
		}

		for (let rule of redirects) {
			let matched = rule.match(ctx.url);
			if (matched === false) continue;

			let to = rule.to;
			for (let [key, value] of Object.entries(matched.params)) {
				to = to.replace(`:${ key }`, value);
			}

			console.log('%s -> %s (%d)', ctx.url, to, rule.status);

			if (rule.status === 301 || rule.status === 302) {
				ctx.status = rule.status;
				ctx.redirect(to);
				return;
			}

			ctx.url = to;
			ctx.status = rule.status;
			await handler(ctx, true);
			return;
		}

		ctx.status = 404;
		ctx.body = '';
	}


	const app = new Koa();
	app.use(handler);

	const port = await getPort({ port: 9000 });
	await app.listen(port);

	console.log(boxen(`Dev server listening on http://localhost:${ port }/`, {
		padding: 1,
		borderColor: 'cyan',
		borderStyle: 'round',
	}));

	console.log('Executing dev command', config.command);
	let child = execa(config.command, {
		shell: true,
		preferLocal: true,
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
})();
