
var util = require("./util")

exports.action = function(req, res, model) {
	util.parse_request(req, function(err, path, fields, files) {
		if(err)
			util.error(res, err)
		else if(path.length==2 && path[1]=="current")
			util.success(res, model.login().current_user())
		else if(path.length==2 && path[1]=="search") {
			model.users().search(fields, function(e, r) {
					if(e)
						util.error(res, e)
					else
						util.success(res, r)
				})
		} else if(path.length==2 && path[1]=="create") {
			model.users().create(fields, function(e, id) {
					if(e)
						util.error(res, e)
					else
						util.success(res, id)
				})
		} else if(path.length==2 && path[1]=="update") {
			model.users().update(fields, function(e) {
					if(e)
						util.error(res, e)
					else
						util.success(res, null)
				})
		} else
			util.error(res, "Invalid request")
	})
}
