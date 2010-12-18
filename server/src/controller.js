
var model = require('./model')
var formidable = require('formidable')
var cookie = require('cookie')
cookie.secret = "secret"

exports.controller = function(req, res, params) {
	var session_id = null;
	(function() {
		var session = null
		try {
			session = req.getSecureCookie("session")
		}
		if(session) {
			session = JSON.parse(session)
			if(session.at && session.ex) {
				if((parseInt(session.at)+parseInt(session.ex))<new Date().getTime()) {
					session = null
					req.clearCookie("session")
				} else {
					session.at = new Date().getTime()
					req.setSequreCookie(JSON.stringify(session))
				}
			}
			if(session)
				session_id = session.id
		}
	})();
	
}