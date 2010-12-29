var fs = require('fs')
var urllib = require('url')
var util = require('util')

exports.action = function(req, res, model) {
	var fp = "./" + urllib.parse(req.url, true).pathname.replace(/\.+/g, ".")
	fs.stat(fp, function(e, stat) {
		if(e || !stat.isFile()) {
			res.writeHead(404, {'Content-Type': 'text/plain'})
			res.end('File not found.\x0D\x0A' + req.url)
		} else {
			var tag = "\"" + stat.mtime.getTime().toFixed(0) + "\""
			if(req.headers["if-none-match"] && req.headers["if-none-match"]==tag) {
				res.writeHead(304, {})
				res.end()
			} else {
				var tp = { js: "text/javacript",
					css: "text/css",
					jpg: "image/jpeg",
					jpeg: "image/jpeg",
					png: "image/png",
					gif: "image/gif" }[fp.match(/\.[a-z]+$/) ? fp.match(/[a-z]+$/)[0] : ""] || "application/octetstream";
				res.writeHead(200, {
						"Content-Type": tp,
						"Content-Length": stat.size.toFixed(0),
						"ETag": tag
					})
				util.pump(fs.createReadStream(fp), res)
			}
		}
	})
}
