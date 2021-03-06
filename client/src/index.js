
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
		} else if(path.length>=1 && path[0]=="users") {
			if(path.length>1) {
				if(path[1]=="new")
					$("#content").html($ctl.html("users_form", {}))
				else if(path[1].toString().match(/^\d+$/)) {
					$model.users.get(path[1], function(r) {
						$("#content").html($ctl.html("users_form", {id:"user_edit", value: r }))
						$ctl("user_edit").value(r)
					})
				}
			} else
				$("#content").html($ctl.html("users_list", {}))
		} else if(path.length>=1 && path[0]=="groups")  {
			if(path.length>1) {
				if(path[1]=="new")
					$("#content").html($ctl.html("groups_new", {}))
				else if(path[1].toString().match(/^\d+$/)) {
					$model.groups.get(path[1], function(r) {
						$("#content").html($ctl.html("groups_edit", {id:"groups_edit", value: r }))
						$ctl("groups_edit").value(r)
					})
				}
			} else
				$("#content").html($ctl.html("groups_list", {}))
		}
	}
	function call_update(data) {
		update_page(data, (data && data.page && data.page instanceof Array) ? data.page : [])
	}
	$history().data.change(call_update)
	call_update($history().data())
});
