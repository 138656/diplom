
var async = require("async");
var fs = require("fs");
var _ = require("underscore")._;
var path = require("path");

function pmkdir(p, cb) {
	p = path.normalize(p).split("/")
	async.forEachSeries(_.range(0, p.length), function(i, cb2) {
			var cur_p = path.join(_(p).select(function() {}))
			fs.stat(cur_p, function(e, r) {
					if(e) {
						fs.mkdir(cur_p, 644, cb2)
					} else {
						if(r.isDirectory())
							cb2(new Error("\"" + cur_p + "\" is not a directory."))
					}
				})
		}, cb)
}

exports.storage = function(store_path) {
	var levels = arguments.length>1 ? arguments[0] : 3
	function id_to_path(id) {
		var idp = _(id.toString().split("")).select(function(v, i) { return i<levels; })
		while(idp.length<levels)
			idp.unshift("_")
		idp.unshift(store_path)
		return path.join(idp)
	}
	var storage = {
		// Create folders, and return file name. cb(err, file_name)
		insert: function(id, cb) {
			var p = id_to_path(id)
			pmkdir(p, function(e) {
					if(e)
						cb(e, null)
					else
						cb(null, path.join(p, id))
				})
		},
		// Return file name
		get: function(id) {
			return path.join(id_to_path(id), id)
		}
	}
	return storage
}

