#!/usr/bin/env node

var pg = require('pg')
var http = require('http')
var async = require('async')
var fs = require('fs')
var path = require('path')
var urllib = require('url')
var util = require('util')
var _ = require('underscore')._

var controller = require('./src/controller').controller

function start_server(params) {
	http.createServer(function (req, res) {
		var url = urllib.parse(req.url).pathname
		if(url=="/" || url=="/index.html") {
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.end(params.templates("main.tpl", { scripts: params.scripts, styles: params.styles }))
		} else if(url.match(/^\/(js|css|img)\/[\.a-zA-Z_]+\.(js|css|jpg|jpeg|gif|png)$/)) {
			var tp = url.match(/[a-z]+$/)[0]
			var dir = ({
					"js": "scripts",
					"css": "styles",
					"img": "img"
				})[url.match(/\/(js|css|img)\//)[1]]
			var nm = path.join("static", dir, url.replace(/^\/(js|css|img)\//, ""))
			fs.stat(nm, function(err, st) {
					if(err || !st.isFile()) {
						res.writeHead(404, {'Content-Type': 'text/plain'})
						res.end('File not found.')
					} else {
						res.writeHead(200, {'Content-Type': { js: "text/javacript", css: "text/css"}[tp]})
						var stream = fs.createReadStream(nm)
						util.pump(stream, res)
					}
				})
		} else
			controller(req, res, params)
	}).listen(9090, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:9090/');
}

async.parallel({
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
			fs.readdir(path.join("static", "scripts"), cb)
		},
	styles: function(cb) {
			fs.readdir(path.join("static", "styles"), cb)
		}
	}, function(errs, vars) {
		if(errs) {
			_.map(_(errs).keys(), function(x) {
					errs[x] = errs[x] ? new String(errs[x]) : null
				})
			throw new Error(JSON.stringify(errs))
		} else
			start_server(vars)
	})

