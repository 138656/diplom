
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


$ctl.control("groups_form", function(id, nd) {
	var res = { value: $ctl(id + "_form").value };
	$ctl(id + "_manager").data_source(function(s, l, cb) {
		$model.users.search({ mode:"combo", offset:s, limit:l, role:"teacher" }, function(r) {
			if(r.status)
				cb(r.data)
		})
	})
	return res
});

$ctl.control("groups_new", function(id, nd) {
	var gr_form = $ctl(id + "_form")
	$ctl(id + "_save").click(function() {
		$model.groups.create(gr_form.value(), function(r) {
			if(r.status)
				$history().data({page:["groups", r.data]})
		})
	})
	return {}
});

