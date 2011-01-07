
var $history = function() {
	var res = $control("data", "hash")
	res.data(null)
	var in_ch = false
	res.hash.change(function(h) {
		if(!in_ch) {
			in_ch = true
			if(h) {
				try {
					if(h!=JSON.stringify(res.data()))
						res.data(JSON.parse(h))
				} catch(e) {
					res.data(null)
				}
			} else
				res.data(null)
			jQuery.history.load(h)
			in_ch = false
		}
	})
	var in_ch2 = false
	res.data.change(function(d) {
			if(!in_ch2) {
				in_ch2 = true
				res.hash(JSON.stringify(d))
				in_ch2 = false
			}
		})
	$.history.init(function(h) {
			res.hash(h)
		}, { unescape: true })
	$history = function() {
		return res;
	}
	return res;
}



function $show_error(msg, details) {
	window.alert(msg);
}

$(function() {
	function update_page(data, path) {
		if(path.length==0 || path[0]=="main") {
		
		} else if(path[0]=="login") {
			var l = $("#login_login").val()
			var p = $("#login_password").val()
			if(!l || !p)
				$show_error("Введите логин и пароль")
			else
				$model.login(l, p, function(r) {
						if(r.status)
							window.location = "/"
						else
							$show_error("Неправильный логин или пароль", null)
					})
		} else if(path[0]=="logout") {
			$model.logout(function() {
				window.location = "/"
			})
		} else if(path.length==1 && path[0]=="users") {
			$("#content").html(tpl2js("client/ctl/controls.tpl", { ctl_name: "users_list",
					ctl_params: {}
				}))
		}
	}
	$history().data.change(function(data) {
		update_page(data, (data && data.page && data.page instanceof Array) ? data.page : [])
	})
});
