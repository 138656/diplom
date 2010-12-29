
var urllib = require('url')
var formidable = require('formidable')

exports = {
	/**
	 * req - HTTP request
	 * cb - fn(err, data);
	 * data = {path: [], fields: {}, files: []}
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
	}
}

