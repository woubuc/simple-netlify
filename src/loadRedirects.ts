import redirectParser from 'netlify-redirect-parser';
import { match, MatchFunction } from 'path-to-regexp';
import { join } from 'path';

import { fileExists } from './utils';

export interface RedirectRule {
	to : string;
	status : number;
	match : MatchFunction;
}

export async function loadRedirects(publish : string) : Promise<RedirectRule[]> {
	let file;

	for (let dir of [publish, process.cwd()]) {
		let f = join(dir, '_redirects');
		let exists = await fileExists(f);

		if (exists) {
			file = f;
		}
	}

	if (file === undefined) {
		return [];
	}


	let redirects = await redirectParser.parseRedirectsFormat(file).then(r => r.success);

	return redirects.map(rule => ({
		to: rule.to,
		status: rule.status || 301,
		match: match(rule.path.replace('*', '(.+)')),
	}));
}
