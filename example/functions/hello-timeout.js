exports.handler = function(evt, ctx, cb) {
	setTimeout(() => {
		cb(null, {
			body: JSON.stringify({
				message: `hello from timeout function`,
			}),
		});
	}, 600);
};
