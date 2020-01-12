exports.handler = async function(evt, ctx, cb) {
	return {
		body: JSON.stringify({
			message: `hello from async function`,
		}),
	};
};
