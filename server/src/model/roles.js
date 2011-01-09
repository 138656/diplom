
exports.init = function(model) {
	var res_md = {
		roles: function(cb) {
			model.db.query("select * from users_roles order by name", function(e, r) {
				if(e)
					cb(e, null)
				else
					cb(null, r.rows)
			})
		}
	}
	return res_md
}