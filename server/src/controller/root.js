
var fs = require("fs")
var Buffer = require('buffer').Buffer;

exports.action = function(req, res, model) {
	var content = new Buffer(require("../../build/templates").tpl("main.tpl", {
		scripts: ["ctl_tpl.js", "client_lib.js", "client.js", "ctl.js"],
		styles: ["ctl.css"],
		actions: model.login().actions(),
		user: model.login().current_user()
	}))
	res.writeHead(200, {
			"Content-Type": "text/html",
			"Content-Length": content.length.toFixed(0)
		})
	res.end(content)
}

