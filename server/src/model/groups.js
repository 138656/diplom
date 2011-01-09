
var _ = require("underscore")._;

var columns = ["name", "manager_id"]

exports.init = function(model) {
	var res_md = {
		search: function(params, cb) {
			//params: {limit: n, id: n, offset: n, text: s, manager_id: s}
			var mode = (params.mode && _.indexOf(_(views).keys(), params.mode)!=-1) ? params.mode : "short"
			var cb = arguments[arguments.length-1]
			var cnd = []
			var values = [];
			function val(v) { return "$" + values.push(v); }
			if(params.text)
				cnd.push("_fts @@ plainto_tsquery('pg_catalog.russian', " + val(params.text) + ")")
			if(params.manager_id)
				cnd.push("manager_id=" + val(params.role))
			if(params.id) {
				if(params.id instanceof Array)
					cnd.push("id IN (" + _(params.id).map(val).join(", ") + ")")
				else
					cnd.push("id=" + val(params.id))
			}
			cnd.push("NOT(in_archive)")
			var q = []
			q.push("SELECT id, name, manager_id, (SELECT name2 || ' ' || name1 FROM users WHERE id=g.manager_id) as manager_name FROM groups g ")
			if(cnd.length) {
				q.push("WHERE ")
				q.push(_(cnd).map(function(x) { return "(" + x + ")"; }).join(" AND "))
			}
			q.push(" ORDER BY name, id")
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
				model.db.query("INSERT INTO groups(" + fields.join(", ") + ") VALUES(" + val_ref.join(", ") + ") RETURNING id", values, function(e, r) {
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
				cb(new Error("Не указан идентификатор группы"))
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
					model.db.query("UPDATE groups SET " + fields.join(", ") + " WHERE id=" + ids, values, function(e, r) {
						if(e)
							cb(e)
						else
							cb(null)
					})
				else
					_.defer(function() { cb(null); })
			}
		},
		move_to_arch: function(id, new_name, cb) {
			model.db.connect(function(e, cn) {
				if(e)
					cb(e, null)
				else {
					if(!new_name) {
					
					} else {
						var new_id = null
						async.waterfall([
							function(callback){
								cn.query("BEGIN", callback)
							},
							function(r, callback){
								cn.query("INSERT INTO groups(name, manager_id) SELECT $1, name FROM groups WHERE id=$2 RETURNING id", [new_name, id], callback)
							},
							function(r, callback){
								if(r.rows.length) {
									new_id = r.rows[0].id
									cn.query("UPDATE groups_users SET group_id=$1 WHERE group_id=$2", [new_id, id], callback)
								} else
									callback(new Error("Группа не найдена. id: " + JSON.stringify(id)), null)
							},
							function(r, callback) {
								cn.query("UPDATE groups SET in_archive=TRUE WHERE id=$1", [id], callback)
							},
							function(r, callback) {
								cn.query("COMMIT", callback)
							},
							function(r, callback) {
								cb(null, new_id)
							}
						], function(e) {
							cn.query("ROLLBACK", function() { cb(e, null); })
						});
					}
				}
			})
		},
	}
	return res_md
}
