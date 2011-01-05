
var pg = require("pg")
var _ = require('underscore')._;
var fs = require('fs')
var path = require('path')
var config = JSON.parse(fs.readFileSync("config.json").toString("UTF-8"))

var plugins_list = ["login", "users", "files", "images"]
var plugins = _(plugins_list).reduce(function(r, v) {
		r[v] = require("./model/" + v).init
		return r
	}, {})

var db = {
	connect: function(cb) {
		pg.connect(config.db_connection_string, cb)
	},
	query: function(/*query, [data], callback*/) {
		var args = arguments
		db.connect(function(err, client) {
				if(err)
					args[args.length-1](err, null)
				else
					client.query.apply(client, args)
			})
	}
}

exports.model = function() {
	var res = {
		config: config,
		db: db
	}
	_(plugins_list).each(function(p) {
			var plugin = null
			res[p] = function() {
				if(!plugin)
					plugin = plugins[p](res)
				return plugin
			}
		})
	return res
}


