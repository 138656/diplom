#!/usr/bin/env node

var http = require('http')

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.message);
  console.log(err.stack)
});


var controller = require('./controller').controller


http.createServer(function (req, res) {
	controller(req, res)
}).listen(9191, "127.0.0.1");

console.log('Server running at http://127.0.0.1:9191/');

/*async.parallel({
	templates: function(cb) {
			require('child_process').exec("utils/tpl2js.js -fn \"\" " + _(["main.tpl"]).map(function(t) { return "server/tpl/" + t; }).join(" "), function(err, stdout, stderr) {
					if(err)
						cb(err, null)
					else if(stderr)
						cb(new Error(stderr), null)
					else {
						var tpl = eval("(" + stdout + ")")
						cb(null, function(nm, vals) {
								return tpl(path.join("server", "tpl", nm), vals)
							})
					}
				})
		},
	scripts: function(cb) {
			fs.readdir(path.join("static", "js"), cb)
		},
	styles: function(cb) {
			fs.readdir(path.join("static", "css"), cb)
		}
	}, function(errs, vars) {
		if(errs) {
			_.map(_(errs).keys(), function(x) {
					errs[x] = errs[x] ? new String(errs[x]) : null
				})
			throw new Error(JSON.stringify(errs))
		} else
			start_server(vars)
	})*/

