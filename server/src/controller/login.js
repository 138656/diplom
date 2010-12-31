
var util = require("./util")
var cookie = require('cookie')

exports.action = function(req, res, model) {
	util.parse_request(req, function(err, path, fields, files) {
			if(err)
				util.error(err)
			else if(!fields.action || fields.action=="login") {
				if(!fields.login && !fields.password)
					util.error(res, "Введите логин и пароль")
				else if(!fields.login)
					util.error(res, "Введите логин")
				else if(!fields.password)
					util.error(res, "Введите пароль")
				else {
					model.login().login(fields.login, fields.password, function(e, session_id) {
							if(e) {
								res.clearCookie("session")
								util.error(res, e)
							} else {
								res.setSecureCookie("session", JSON.stringify(
									(fields.timeout && fields.timeout.match(/^\d+$/)) ? {
											id: session_id,
											timeout: parseInt(fields.timeout),
											last: new Date().getTime()
										} : { id: session_id }))
								util.success(res, "null")
							}
						})
				}
			} else if(fields.action=="logout") {
				res.clearCookie("session")
				model.login().logout(function(e) {
					if(e)
						util.error(res, e)
					else
						util.success(res, null)
				})
			} else
				util.error(res, "Параметры заданы неправильно")
		})
}
