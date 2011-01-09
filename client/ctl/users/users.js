
$ctl.control("users_list_item", function(id, nd) {
	nd.active("ctl-users_list_item-normal", "ctl-users_list_item-hover", "ctl-users_list_item-active")
	return {}
});

$ctl.control("users_list", function(id, nd) {
	function data_source() {
		var text = $ctl(id + "_search").value()
		return function(o, l, cb) {
				$model.users.search({ offset: o, limit: l, text: text }, function(r) {
						if(!r.status)
							$show_error("Ошибка поиска", r)
						else
							cb(r.data)
					})
			}
	}
	$ctl(id + "_list").data_source(data_source())
	$ctl(id + "_search").value.change(function() { $ctl(id + "_list").data_source(data_source()); })
	return {}
});

$ctl.control("users_form", function(id, nd) {
	$ctl(id + "_role").data_source(function(s,e,cb) {
		$model.roles(function(r) {
			if(r.status) {
				cb(_(r.data).map(function(role) {
					return { id: role.system_name, text: role.name }
				}))
			}
		})
	})
	$ctl(id + "_save").click(function() {
		var v = $ctl(id + "_form").value()
		if(!v.id) {
			$model.users.create(v, function(r) {
					if(r.status)
						$history().data({page:["users", r.data]})
				})
		} else {
			$model.users.save(v, function(r) { })
		}
	})
	return { value: $ctl(id + "_form").value }
});


