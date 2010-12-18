
var pg = require('pg')

function connect(cb) {
	pg.connect("pg://user:password@host:port/diplom", cb)
}

var dao = {
	login: function(l, p, cb/*err, session_id, user*/) {
		
	},
	logout: function(session_id, cb) {
		
	},
	get_user: function(id, cb) {
	
	}
}

exports = dao