
var $model = (function() {
	function load(path, params, cb) {
		$.ajax({ url: path, data: params, type: (params && params.password) ? "POST" : "GET", success: function(data) {
			if(data.restart) {
				window.setTimeout(function() {
					window.location.href = "/";
				}, 1000)
			}
			cb(data)
		}});
	}
	var model = {
		login: function(l, p, cb) {
			load("/login", {login: l, password: p}, cb)
		},
		logout: function(cb) {
			load("/login", {action: "logout", test:1}, cb)
		},
		users: {
			search: function(params, cb) {
				load("/users/search", params, cb)
			},
			get: function(id, cb) {
				load("/users/search", { mode:"full", id:id }, function(r) {
					var u = r.data[0]
					u._role = { id: u._role_id, text: u.role }
					cb(u)
				})
			},
			create: function(dt, cb) {
				if(dt._role)
					dt._role_id = dt._role.id
				dt._blocked = !!dt._blocked
				load("/users/create", _(["name1", "name2", "name3", "phone",
					"_login", "_password", "_role_id", "_blocked"]).reduce(function(r, v) {
							r[v] = dt[v] || ""
							if(v="_blocked")
								r[v] = r[v] ? "1" : "0"
							return r
						}, {}), cb);
			},
			save: function(dt, cb) {
				if(!dt.id)
					cb(null)
				else {
					load("/users/update", _(["id", "name1", "name2", "name3", "phone",
						"_login", "_password", "_role_id", "_blocked"]).reduce(function(r, v) {
								if(v!="_password" || dt[v])
									r[v] = dt[v] || ""
								if(v="_blocked")
									r[v] = r[v] ? "1" : "0"
								return r
							}, {}), cb);
				}
			}
		},
		roles: function(cb) {
			load("/roles", {}, function(dt) {
				model.roles = function(cb2) { _.defer(function() { cb2(dt); }); }
				cb(dt)
			})
		}
	}
	return model
})();
