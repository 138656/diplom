
var formidable = require('formidable')
var cookie = require('cookie')
var urllib = require('url')
var _ = require('underscore')._;

var ctl_list = ["login", "root", "static", "users", "roles", "groups"]
var ctl = _(ctl_list).reduce(function(r, v){
		r[v] = require("./controller/" + v).action
		return r
	}, {})

var model = require("./model").model

exports.controller = function(req, res) {
	var md = model()
	var ctl_name = urllib.parse(req.url).pathname
	if(ctl_name=="/" || !ctl_name)
		ctl_name = "root"
	else
		ctl_name = ctl_name.split("/")[1]
	function action() { ctl[ctl_name](req, res, md); }
	if(_(ctl_list).any(function(x) { return x==ctl_name; })) {
		cookie.secret = md.config.cookie_secret
		var session = null
		try {
			session = req.getSecureCookie("session");
		} catch(e) {}
		if(session) {
			session = JSON.parse(session)
			md.login().auth(session.id, function(e) {
					if(e || (session.timeout && (new Date().getTime()-session.last)>(session.timeout*1000))) {
						function send_err() {
							session = null
							res.clearCookie("session")
							res.writeHead(200, {"Content-Type": "application/json"})
							res.end(JSON.stringify({ status: false, message: e ? "Сессия удалена" : "Истек интервал неактивности", restart: true }))
						}
						if(!e)
							md.login().logout(send_err)
						else
							send_err()
					} else
						action()
				})
		} else
			action()
	} else {
		res.writeHead(404, {"Content-Type": "text/plain"})
		res.end("Resource not found.")
	}
}


