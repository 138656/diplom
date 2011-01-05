
var im = require("imagemagick")
var path = require("path")
var storage = require("../storage").storage
var fs = require("fs")
var async = require("async")


exports.action = function(req, res, model) {
	var config = model.config.images
	var res_md = {
		get: function(id, cb) {
			model.files().get(id, cb)
		},
		get_thumb: function(id, max_width, max_height, cb) {
			mode.files.get(id, function(e, f) {
				if(e)
					cb(e, null)
				else {
					var s = storage(path.join(config.cache_path, max_width.toString() + "x" + max_height))
					var fname = s.get(id)
					fs.stat(fname, function(e, st) {
							if(e) {
								s.insert(id, function(e, fp) {
										if(e)
											cb(e, null)
										else {
											im.convert(["-resize", max_width.toString() + "x" + max_height + ">", f.path, "jpeg:" + fp], function(err) {
													if(err)
														cb(err, null)
													else {
														fs.stat(fp, function(e, stat) {
															if(e)
																cb(e, null)
															else {
																cb(null, { "path": fp, "length": stat.size, "mime": "image/jpeg" })
															}
														})
													}
												})
										}
									})
							} else {
								cb(null, { "path": fname, "length": st.size, "mime": "image/jpeg" })
							}
						})
				}
			})			
		},
		put: function(file, cb) {
			im.identify(file.path, function(err, features) {
				if (err)
					cb(err, null)
				else if(features.width>config.max_width || features.height>config.max_height)
					cb(new Error("Слишком большое изображение. Максимальный размер - " + config.max_width + "x" + config.max_height + " пикселей"), null)
				else
					model.files().put(file, cb)
			})
		},
		remove: function(id, cb) {
			model.files().remove(id, cb)
		}
	}
	return res_md
}
