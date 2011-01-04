
var _ = require("underscore")._;

exports.init = function(model) {
	var current_user = null
	var session_id = null
	var res_md = {
		//cb(err, session_id)
		login: function(l, p, cb) {
			model.db.query("INSERT INTO users_sessions(user_id) SELECT id FROM users WHERE _login=$1 AND _password=$2 AND NOT(_blocked) RETURNING id", [l, p],  function(e, res) {
					if(e)
						cb(e, null)
					else if(res.rows.length==0)
						cb(new Error("Неправильный логин или пароль."), null)
					else {
						res_md.auth(res.rows[0].id, function(e, user) {
								if(e)
									cb(e, null)
								else
									cb(null, session_id)
							})
					}
				})
		},
		auth: function(sess_id, cb) { 
			model.db.query("SELECT id, name1, name2, name3, address, phone, NOT(photo IS NULL) AS has_photo, _role_id, _blocked FROM users WHERE id=(SELECT user_id FROM users_sessions WHERE id=$1)", [sess_id], function(e, r) {
				if(e)
					cb(e, null)
				else if(r.rows.length==0)
					cb(new Error("Сессия не существует."), null)
				else {
					session_id = sess_id
					current_user = r.rows[0]
					cb(null, current_user)
				}	
			})
		},
		current_user: function() {
			return current_user
		},
		session_id: function() {
			return session_id
		},
		logout: function(cb) {
			if(session_id) {
				model.db.query("DELETE FROM users_sessions WHERE id=$1", [session_id], cb)
			} else
				_.defer(function() { cb(null); })
		},
		logout_group: function(/*gr_id, [start_time], cb*/) {
			
		},
		logout_user: function(user_id, cb) {
			if(session_id) {
				model.db.query("DELETE FROM users_sessions WHERE user_id=$1", [session_id], cb)
			} else
				_.defer(function() { cb(new Error("Сначала надо войти в систему.")); })
		}
	}
	return res_md
}
