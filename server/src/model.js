
var pg = require('pg')
var _ = require('underscore')._;

function connect(cb) {
	pg.connect("pg://diplom_user:diplom@localhost:5432/diplom", cb)
}

exports.model = function(session, cb) {
	var user = null
	function has_ability(ab) {
		if(user) {
			if(ab=="users_info")
				return _(['admin', 'teacher']).any(user.role)
		} else
			return false
	}
	var dao = {
		login: function(l, p, cb/*(err, session_id)*/) {
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
		users_get: function(id, cb) {
			var id = arguments.length>=2 ? arguments[0] : null
			var cb = arguments[arguments.length-1]
			connect(function(err, client) {
				if(err)
					cb(err, null)
				else {
					var fields = ["id", "name1", "name2", "name3", "photo", "(SELECT system_name FROM users_roles WHERE id=u._role_id) as role"]
					if(has_ability("user_info"))
						fields = fields.concat(["address", "phone", "email"])
					client.query("SELECT " + fields.join(", ") + " FROM users u WHERE id=$1", [id], function(err, res) {
							if(err)
								cb(err, null)
							else if(res.rows.length)
								cb(err, res.rows[0])
							else
								cb(new Error("Пользователь не найден."), null)
						})
				}
			})
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
		console.log(session)
		connect(function(err, client) {
			if(err)
				cb(err, null)
			else {
				var fields = ["id", "name1", "name2", "name3", "photo", "(SELECT system_name FROM users_roles WHERE id=u._role_id) as role", "address", "phone", "email"]
				client.query("SELECT " + fields.join(", ") + " FROM users u WHERE id=(SELECT user_id FROM users_sessions WHERE user_key=$1)", [session], function(err, res) {
						if(!err && res.rows.length)
							user = res.rows[0]
						cb(null, dao)
					})
			}
		})
	} else
		cb(null, dao)
}