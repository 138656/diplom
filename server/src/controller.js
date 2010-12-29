
var formidable = require('formidable')
var cookie = require('cookie')
var urllib = require('url')
var _ = require('underscore')._;

var ctl_list = ["login", "root", "static"]
var ctl = _(ctl_list).reduce(function(r, v){
		r[v] = require("./controller/" + v).action
		return r
	}, {})

var model = require("./model")

exports.controller = function(req, res) {
	var ctl_name = urllib.parse(req.url).pathname
	if(ctl_name=="/" || !ctl_name)
		ctl_name = "root"
	else
		ctl_name = ctl_name.split("/")[1]
	if(_(ctl_list).any(function(x) { return x==ctl_name; })) {
		ctl[ctl_name](req, res, model)
	} else {
		res.writeHead(404, {"Content-Type": "text/plain"})
		res.end("Resource not found.")
	}
}

/*function(req, res) {
	var dao = null
	function error(msg) {
		res.writeHead(200, {"Content-Type": "application/json; charset=UTF-8"})
		res.end(JSON.stringify({ status: false, meassage: msg }))
	}
	function success(dt) {
		res.writeHead(200, {"Content-Type": "application/json; charset=UTF-8"})
		res.end(JSON.stringify({ status: true, data: dt }))
	}
	function action(path, fields, files) {
		function match() {
			if(arguments.length!=path.length)
				return false
			else {
				return !!_(_.zip(_(arguments).toArray(), path)).reduce(function(r, v) {
						if(typeof v[0] == "string")
							return r && v[0]==v[1]
						else if(typeof v[0] == "function")
							return r && v[0](v[1])
						else
							return false
					}, true)
			}
		}
		if(match("login")) {
			if(!fields.login)
				error("Не введен логин.")
			else if(!fields.password)
				error("Не введен пароль.")
			else {
				dao.login(fields.login, fields.password, function(err, ses_id) {
						if(err)
							error(err.message, 403)
						else {
							var ses = { id: ses_id }
							if(fields.timeout && fields.timeout.match(/^\d+$/)) {
								ses.at = new Date().getTime()
								ses.ex = fields.timeout
							}
							res.setSecureCookie("session", JSON.stringify(ses))
							success(null)
						}
					})
			}
		} else if(match("logout")) {
			dao.logout(function(err, fn) {
					res.clearCookie("session")
					success(err ? err.message : "Сессия удалена.")
				})
		} else if(match("users", "get", "current")) {
			dao.users_get_current(function(err, res) {
					if(err)
						error(err.message)
					else
						success(res)
				})
		} else if(match("users", "get", /^\d+$/)) {
			dao.users_get(path[2], function(err, v) {
					if(err)
						error(err.message)
					else
						success(v)
				})
		} else {
			res.writeHead(404, {"Content-Type": "text/plain"})
			res.end("Resource /" + path.join("/") + " not found.")
		}
	}
	function process_request() {
		var parsed_url = urllib.parse(req.url, true)
		var path = parsed_url.pathname && parsed_url.pathname.replace(/^\/|\/$/g, "").split("/")
		if(req.method.toLowerCase() == 'post') {
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields, files) {
					if(err) {
						error("Внутренняя ошибка сервера, обратитесь к администратору.")
					} else
						action(path, fields || {}, files || [])
				})
		} else {
			action(path, parsed_url.query || {}, [])
		}
	}
	(function() {
		var session = null
		try {
			session = req.getSecureCookie("session")
		} catch(e) {
			session = null
		}
		function to_dao(ses) {
			model(ses, function(err, mdao) {
				if(err) {
					error("Внутренняя ошибка сервера, обратитесь к администратору.")
				} else {
					dao = mdao
					process_request()
				}
			})
		}
		if(session) {
			if(session.at && session.ex) {
				if((parseInt(session.at)+parseInt(session.ex))<new Date().getTime()) {
					session = null
					res.clearCookie("session")
				} else {
					session.at = new Date().getTime()
					res.setSequreCookie("session", JSON.stringify(session))
				}
			}
			to_dao(session ? JSON.parse(session).id : "")
		} else
			to_dao(null)
	})();
	
}*/
