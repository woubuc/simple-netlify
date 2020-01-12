import { join } from 'path';
import { Context } from 'koa';
import bodyParser from 'koa-bodyparser';

import { Config } from './loadConfig';

export interface FunctionEvent {
	path : string;
	httpMethod : string;
	headers : Record<string, string>,
	queryStringParameters : Record<string, string>,
	body ?: string;
	isBase64Encoded : boolean;
}

export interface FunctionContext {

}

export interface FunctionResponse {
	isBase64Encoded ?: boolean;
	statusCode ?: number;
	headers ?: Record<string, string>;
	body ?: string;
}

export type Fn = {
	handler : (
		evt : FunctionEvent,
		ctx : FunctionContext,
		cb ?: (err : any, res : FunctionResponse) => void
	) => Promise<any> | void;
};

export async function execFunction(config : Config, functionName : string, ctx : Context) : Promise<void> {
	console.log('Executing function', functionName);

	let fn = loadFunction(join(config.functions, functionName + '.js'));
	if (fn === false) {
		ctx.status = 404;
		return;
	}

	let event : FunctionEvent = {
		path: functionName,
		httpMethod: ctx.method,
		headers: ctx.headers,
		queryStringParameters : ctx.query,
		isBase64Encoded : false, // base64 is not supported currently
	};

	if (ctx.body) {
		event.body = JSON.stringify(ctx.body);
	}

	let context : FunctionContext = {};

	let response = validateResponse(await callFunction(fn, event, context));

	ctx.status = response.statusCode;
	ctx.body = response.body;

	for (let [k, v] of Object.entries(response.headers)) {
		ctx.set(k, v);
	}
}


function loadFunction(path : string) : Fn | false {
	try {
		let filePath = require.resolve(path);
		delete require.cache[filePath];
		return require(filePath);
	} catch (_) {
		return false;
	}
}


function callFunction(fn : Fn, evt : FunctionEvent, ctx : FunctionContext) : Promise<any> {
	return new Promise(async (resolve, reject) => {
		let res = fn.handler(evt, ctx, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});

		if (!res) return;
		resolve(res);
	});
}

function validateResponse(res : any) : FunctionResponse {
	let isBase64Encoded = false;

	let headers = {};
	if (res.headers !== undefined && typeof res.headers === 'object') {
		headers = res.headers;
	}

	let statusCode = 200;
	if (res.statusCode !== undefined) {
		let code = parseInt(res.statusCode, 10);
		if (Number.isFinite(code)) {
			statusCode = code;
		}
	}

	let body = '';
	if (res.body !== undefined) {
		body = res.body.toString();
	}

	return {
		isBase64Encoded,
		headers,
		statusCode,
		body,
	}
}
