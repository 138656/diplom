
var util = require("./util")

exports.action = function(req, res, model) {
	function send(res, e, r) {
		if(e)
			util.error(res, e)
		else
			util.success(res, r)
	}
	util.parse_request(req, function(err, path, fields, files) {
		if(err)
			util.error(res, err)
		else if(path.length==2 && path[1]=="search") {
			model.groups().search(fields, function(e, r) {
					send(res, e, r)
				})
		} else if(path.length==2 && path[1]=="create") {
			model.groups().create(fields, function(e, id) {
					send(res, e, id)
				})
		} else if(path.length==2 && path[1]=="update") {
			model.groups().update(fields, function(e) {
					send(res, e, null)
				})
		} else if(path.length==2 && path[1]=="move_to_arch") {
			model.groups(fields.id || "", fields.new_name || "", function(e, r) {
					send(res, e, r)
				})
		} else
			util.error(res, "Invalid request")
	})
}
