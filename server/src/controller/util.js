
var urllib = require('url')
var formidable = require('formidable')
var _ = require('underscore')._;

_.extend(exports, {
	/**
	 * req - HTTP request
	 * cb - fn(err, path: [], fields: {}, files: []);
	 */
	parse_request: function(req, cb) {
		var parsed_url = urllib.parse(req.url, true)
		var path = parsed_url.pathname && parsed_url.pathname.replace(/^\/|\/$/g, "").split("/")
		if(req.method.toLowerCase() == 'post') {
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields, files) {
					if(err)
						cb(err, null, null, null)
					else
						cb(null, path, fields || {}, files || [])
				})
		} else
			cb(null, path, parsed_url.query || {}, [])
	},
	error: function(res, msg) {
		res.writeHead(200, {"Content-Type": "application/json"})
		if(typeof msg == "string")
			res.end(JSON.stringify({ status: false, "message": msg }))
		else
			res.end(JSON.stringify({ status: false, "message": msg.message, "stack":msg.stack ? msg.stack.split("\n") : null }))
	},
	success: function(res, data) {
		res.writeHead(200, {"Content-Type": "application/json" })
		res.end(JSON.stringify({ status: true, "data": data }))
	}
})

