

var _ = require("underscore")._;

var views = {
		"full": ["id", "name1", "name2", "name3", "phone", "NOT(photo IS NULL) as has_photo", "_login", "_role_id", "(SELECT name FROM users_roles WHERE system_name=users._role_id) as role", "_blocked"],
		"short": ["id", "name1", "name2", "name3", "NOT(photo IS NULL) as has_photo", "(SELECT name FROM users_roles WHERE system_name=users._role_id) as role"],
		"combo": ["id", "(name1 || ' ' || name2 || COALESCE(' ' || name3, '')) as text"]
	}

var columns = ["name1", "name2", "name3", "phone", "_login",  "_password", "_role_id", "_blocked"]

exports.init = function(model) {
	var res_md = {
		search: function(params, cb) {
			//params: {limit: n, id: n, offset: n, text: s, role: s}
			var mode = (params.mode && _.indexOf(_(views).keys(), params.mode)!=-1) ? params.mode : "short"
			var cb = arguments[arguments.length-1]
			var cnd = []
			var values = [];
			function val(v) { return "$" + values.push(v); }
			if(params.text)
				cnd.push("_fts @@ plainto_tsquery('pg_catalog.russian', " + val(params.text) + ")")
			if(params.role)
				cnd.push("_role_id=" + val(params.role))
			if(params.id) {
				if(params.id instanceof Array)
					cnd.push("id IN (" + _(params.id).map(val).join(", ") + ")")
				else
					cnd.push("id=" + val(params.id))
			}
			if(params.group)
				cnd.push("id IN (SELECT user_id FROM groups_users WHERE group_id=" + val(params.group) + ")")
			var q = []
			q.push("SELECT " + views[mode].join(", ") + " FROM users ")
			if(cnd.length) {
				q.push("WHERE ")
				q.push(_(cnd).map(function(x) { return "(" + x + ")"; }).join(" AND "))
			}
			q.push(" ORDER BY name1, name2, id")
			if(params.limit) {
				var v = val(params.limit)
				q.push(" LIMIT ")
				q.push(v)
			}
			if(params.offset) {
				var v = val(params.offset)
				q.push(" OFFSET ")
				q.push(v)
			}
			model.db.query(q.join(""), values, function(e, r) {
				if(e)
					cb(e, null)
				else
					cb(null, r.rows)
			})
		},
		create: function(data, cb) {
			var fields = []
			var values = []
			function val(v) { return "$" + values.push(v); }
			var val_ref = []
			_(columns).each(function(c) {
				if(typeof data[c] != "undefined") {
					fields.push(c)
					val_ref.push(val(data[c]))
				}
			})
			if(fields.length) {
				model.db.query("INSERT INTO users(" + fields.join(", ") + ") VALUES(" + val_ref.join(", ") + ") RETURNING id", values, function(e, r) {
					if(e)
						cb(e, null)
					else
						cb(null, r.rows[0].id)
				})
			} else
				_.defer(function() { cb(new Error("Нет данных"), null); })
		},
		update: function(data, cb) {
			if(!data.id) {
				cb(new Error("Не указан идентификатор пользователя"))
			} else {
				var fields = []
				var values = []
				function val(v) { return "$" + values.push(v); }
				_(columns).each(function(c) {
					if(typeof data[c] != "undefined")
						fields.push(c + "=" + val(data[c]))
				})
				var ids = val(data["id"])
				if(fields.length)
					model.db.query("UPDATE users SET " + fields.join(", ") + " WHERE id=" + ids, values, function(e, r) {
						if(e)
							cb(e)
						else
							cb(null)
					})
				else
					_.defer(function() { cb(null); })
			}
		},
		set_photo: function(id, photo) {
		
		},
		remove_photo: function(id) {
		
		},
		get_photo: function(id) {
		
		}
	}
	return res_md
}
