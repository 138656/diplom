
var util = require("./util")

exports.action = function(req, res, model) {
	util.parse_request(req, function(err, path, fields, files) {
		if(err)
			util.error(res, err)
		else if(path.length==2 && path[1]=="current")
			util.success(res, model.login().current_user())
		else
			util.error(res, "Invalid request")
	})
}
