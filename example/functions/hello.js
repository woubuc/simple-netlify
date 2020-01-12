exports.handler = function(evt, ctx, cb) {
	cb(null, {
		body: JSON.stringify({
			message: `hello from function`,
		}),
	});
};
