
$ctl.control("groups_list", function(id, nd) {
	function data_source() {
		var text = $ctl(id + "_search").value()
		return function(o, l, cb) {
				$model.groups.search({ offset: o, limit: l, text: text }, function(r) {
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
