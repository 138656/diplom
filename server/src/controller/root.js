
var fs = require("fs")
var Buffer = require('buffer').Buffer;
var content = new Buffer(require("../../build/templates").tpl("main.tpl", {
		scripts: ["ctl_tpl.js", "client_lib.js", "client.js", "ctl.js"],
		styles: ["ctl.css"]
	}))

exports.action = function(req, res, model) {
	res.writeHead(200, {
			"Content-Type": "text/html",
			"Content-Length": content.length.toFixed(0)
		})
	res.end(content)
}

