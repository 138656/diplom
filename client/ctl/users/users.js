
$ctl.control("users_list_item", function(id, nd) {
	nd.active("ctl-users_list_item-normal", "ctl-users_list_item-hover", "ctl-users_list_item-active")
})

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
})
