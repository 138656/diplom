
var pg = require("pg")
var _ = require('underscore')._;
var fs = require('fs')
var path = require('path')
var config = JSON.parse(fs.readFileSync("config.json").toString("UTF-8"))

var plugins_list = ["login", "users"]
var plugins = _(plugins_list).reduce(function(r, v) {
		r[v] = require("./model/" + v).init
		return r
	}, {})

var db = {
	connect: function(cb) {
		pg.connect(config.db_connection_string, cb)
	},
	query: function(/*query, [data], callback*/) {
		var args = arguments
		db.connect(function(err, client) {
				if(err)
					args[args.length-1](err, null)
				else
					client.query.apply(client, args)
			})
	}
}

exports.model = function() {
	var res = {
		config: config,
		db: db
	}
	_(plugins_list).each(function(p) {
			var plugin = null
			res[p] = function() {
				if(!plugin)
					plugin = plugins[p](res)
				return plugin
			}
		})
	return res
}


/*function pg() {
	var pg = require('pg')
}

function connect(cb) {
	pg.connect("pg://diplom_user:diplom@localhost:5432/diplom", cb)
}

function query(q) {
	var cb = arguments[arguments.length-1]
	var data = arguments.length>2 ? arguments[1] : null
	connect(function(e, client) {
		if(e)
			cb(e, null)
		else {
			if(data)
				client.query(q, data, cb)
			else
				client.query(q, cb)
		}
	})
}

var fields = {
	users: ["name1", "name2", "name3", "address", "phone", "photo", "email", "_login", "_password", "_role_id", "_blocked"]
}

function val_to_sql(v) {
	return (v===undefined || v==="") ? null : v
}

var sql = {
	insert: function(table, fields, obj) {
		return {
			sql: "INSERT INTO " + tp + "(" + fields[tp].join(", ") + ") VALUES(" +
				_(fields).map(function(v, i) { return "$" + (i+1).toString(); }).join(", ") + ") RETURNING id",
			data: _(fields[tp]).map(function(x) {
					return val_to_sql(obj[x])
				})
			}
	},
	update: function(table, fields, obj) {
		var fl = _(_.intersect(fields, _(obj).keys()))
		if(fl.length)
			return { sql: "UPDATE " + tp + " SET " + fl.map(function(f, i) { return f + "=$" + i }).loin(", "),
					data: fl.map(function(nm) { return val_to_sql(obj[nm]); }) }
		else
			return null
	},
	select: function(table, fields, ids) {
		return "SELECT " + fields.join(", ") + " FROM " + table + " WHERE id IN (" + _(ids).map(function(v, i) { return "$" + i.toString(); }).join(", ") + ")"
	}
}

var run = {
	search: function(sql, data, cb) {
		query(sql, data || [], function(e,r) {
				if(e)
					cb(e, null)
				else
					cb(null, _(r.rows).pluck("id"))
			})
	},
	select: function(sql, data, cb) {
		function row(r) {
			return _(r).chain().keys().reduce(function(c, v) {
					c[v] = r[v]
					return c
				}, {}).value()
		}
		query(sql, data, function(e, r) {
			if(e)
				cb(e, null)
			else
				cb(null, _(r.rows).chain().toArray().map(row).value())
		})
	},
	select_one: function(sql, data, cb) {
		run.select(sql, data, function(e,v) { cb(e, v && v[0]); })
	},
	insert: function(sql, data, cb) {
		query(sql, data, function(e, r) {
			if(e)
				cb(e, null)
			else
				cb(null, _(r.rows).chain().toArray().map(row).value())
		})
	}
}

exports.model = function(session, cb) {
	var user = null
	function has_ability(ab) {
		function has_role() {
			return _(arguments).chain().toArray().reduce(function(r, v) {
					return r || user.role==v
				}, false).value()
		}
		if(user) {
			if(ab=="users_info")
				return has_role('admin', 'teacher')
			else if(ab=="users_create")
				return has_role('admin')
		} else
			return false
	}
	var dao = {
		login: function(l, p, cb) { //(err, session_id)) {
			connect(function(err, client) {
				if(err)
					cb(err, null)
				else {
					client.query("INSERT INTO users_sessions(user_id) SELECT id FROM users WHERE _login=$1 AND _password=$2 AND NOT(_blocked) RETURNING user_key", [l, p], function(err, res) {
						if(err)
							cb(err, null)
						else {
							if(res.rows && res.rows.length)
								cb(null, res.rows[0].user_key)
							else
								cb(new Error("Неправильный логин или пароль."), null)
						}
					})
				}
			})
		},
		logout: function(cb) {
			if(session) {
				connect(function(err, client) {
					if(err)
						cb(err, false)
					else
						client.query("DELETE FROM users_sessions WHERE user_key=$1", [session], function(err, r) {
								cb(err, !err)
							})
				})
			} else
				cb(null, true)
		},
		users_get: function(id_list, cb) {
			var id = arguments.length>=2 ? arguments[0] : null
			var cb = arguments[arguments.length-1]
			connect(function(err, client) {
				if(err)
					cb(err, null)
				else {
					var fields = ["id", "name1", "name2", "name3", "photo", "_role_id"]
					if(has_ability("users_info"))
						fields = fields.concat(["address", "phone", "email"])
					run.select(sql.select("users", fields, id_list))
					run.select("SELECT " + fields.join(", ") + " FROM users WHERE id=", [id], function(err, res) {
							if(err)
								cb(err, null)
							else if(res.rows.length)
								cb(err, row(res.rows[0]))
							else
								cb(new Error("Пользователь не найден."), null)
						})
				}
			})
		},
		users_insert: function(u, cb) {
			
		},
		users_get_current: function(cb) {
			_.defer(function() {
					if(user)
						cb(null, user)
					else
						cb(new Error("Сначала войдите в систему."), null)
				})
		}
	}
	if(session) {
		connect(function(err, client) {
			if(err)
				cb(err, null)
			else {
				var fields = ["id", "name1", "name2", "name3", "photo", "(SELECT system_name FROM users_roles WHERE id=u._role_id) as role", "address", "phone", "email"]
				client.query("SELECT " + fields.join(", ") + " FROM users u WHERE id=(SELECT user_id FROM users_sessions WHERE user_key=$1)", [session], function(err, res) {
						if(!err && res.rows.length)
							user = row(res.rows[0])
						cb(null, dao)
					})
			}
		})
	} else
		cb(null, dao)
}*/
