$ctl.control("string", function(id, nd) {
	var res = $control("value")
	res.value(nd.val())
	nd.change(function() { res.value(nd.val()); })
	res.value.change(function(v) { nd.val(v); })
	var focus = false
	var hover = false
	function update_class() {
		var nd = $("#"+id).removeClass("ctl-string-normal ctl-string-active ctl-string-hover").addClass("ctl-string-" + (focus ? "active" : (hover ? "hover": "normal")))
	}
	$("#"+id).hover(function() {
			hover = true
			update_class()
		}, function() {
			hover = false
			update_class()
		}).focus(function() {
			focus = true
			update_class()
		}).blur(function() {
			focus = false
			update_class()
		})
	return res
});

$ctl.control("hidden", function(id, nd) {
	var res = $control("value")
	res.value(nd.val())
	nd.change(function() { res.value(nd.val()); })
	res.value.change(function(v) { nd.val(v); })
	return res
});

$ctl.control("checkbox", function(id, nd) {
	var res = $control("value")
	res.value(nd.attr("checked"))
	res.value.change(function(v) { nd.attr("checked", !!v); })
	nd.change(function() { 
		res.value(nd.attr("checked"));
	})
	return res
});

$ctl.control("select", function(id, nd) {
	var res = $control("value", "data_source")
	var clear_btn = $ctl(id + "_clear")
	var select_btn = $ctl(id + "_select")
	var select_win = $ctl(id + "_window")
	res.data_source.change(function(ds) {
		select_win.data_source(function(s, l, cb) {
			ds(s, l, function(r) {
				cb(_(r).map(function(x) {
						return _.extend(_.clone(x), { action: "$ctl('" + id + "').value(" + JSON.stringify(x) + ");" });
					}))
			})
		})
	})
	select_btn.click(function() {
			select_win.visible(true)
		})
	clear_btn.click(function() {
			res.value(null)
		})
	res.value.change(function(v) {
		select_win.visible(false)
		select_btn.caption(v ? v.text : "Выбрать")
	})
	return res
});

$ctl.control("form", function(nd, id) {
	var res = $control("value").value({})
	var fields = {}
	res.append_field = function(nm, f_id) {
		fields[nm] = $ctl(f_id)
		function upd() {
			if(res.value())
				res.value()[nm] = fields[nm].value()
		}
		upd()
		fields[nm].value.change(upd)
		res.value.change(function(v) {
			if(v)
				fields[nm].value(v[nm])
		})
		$ctl(f_id).value()
	}
	return res
});

