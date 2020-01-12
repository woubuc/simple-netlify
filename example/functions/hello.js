exports.handler = function(evt, ctx) {
	return {
		body: JSON.stringify({
			message: `hello from function`,
		}),
	};
};
