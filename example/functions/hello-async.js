exports.handler = async function(evt, ctx, cb) {
	await sleep(1200);

	return {
		body: JSON.stringify({
			message: `hello from async function`,
		}),
	};
};

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms);
	})
}
