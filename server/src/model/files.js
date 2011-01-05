
var storage = require("../storage").storage
var fs = require("fs")


exports.init = function(model) {
	var s = storage()
	var res_md = {
		put: function(fileinfo, cb) {
			model.db.query("INSERT INTO FILES files(content_type, content_length) VALUES($1, $2) RETURNING id", [fileinfo.mime, fileinfo.length], function(e, r) {
				if(e)
					cb(e, null)
				else {
					var id = r.rows[0].id
					s.insert(id.toString(), function(e, path) {
						fs.rename(fileinfo.path, path, function(e) {
							if(e)
								cb(e, null)
							else
								cb(null, id)
						})
					})
				}
			})
		},
		get: function(id, cb) {
			model.db.query("SELECT id, content_type AS mime, content_length as length FROM files where id=$1", [id], function(e, r) {
				if(e)
					cb(e, null)
				else if(r.rows.length==0)
					cb(new Error("Файл не найден"), null)
				else {
					fi = r.rows[0]
					fi.id = fi.id.toFixed(0)
					fi.path = s.get(fi.id)
					cb(null, fi)
				}
			})
		},
		remove: function(id, cb) {
			model.db.query("DELETE FROM files where id=$1", [id], function(e, r) {
				if(e)
					cb(e)
				else
					fs.unlink(s.get(fi.id.toString()), function(e) { cb(e); })
			})
		}
	}
	return res_md
}

