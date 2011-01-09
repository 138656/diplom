
var util = require("./util")

exports.action = function(req, res, model) {
	model.roles().roles(function(e, r) {
		if(e)
			util.error(res, e)
		else
			util.success(res, r)
	})
}
