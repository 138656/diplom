$ctl.control("window", function(id, nd) {
	var res = $control("visible", "title").visible(false);
	$ctl(id + "_close").click(function() {
		res.visible(false)
	})
	res.title($("#" + id + "_title").text())
	res.title.change(function(t) { $("#" + id + "_title").text(t); })
	res.visible.change(function(x) {
		if(x)
			nd.fadeIn(200)
		else
			nd.fadeOut(200)
	})
	return res
});

$ctl.control("select_window", function(id, nd) {
	var res = $control("data_source")
	var win = $ctl(id + "_window")
	var list = $ctl(id + "_list")
	res.visible = win.visible
	res.title = win.title
	if($("#" + id + "_search").length) {
		var search_str = $ctl(id + "_search")
		function update_source() {
			if(res.data_source()) {
				list.data_source(function(s, l, cb) {
					res.data_source()(search_str.value(), s, l, cb)
				})
			} else
				list.data_source(null)
		}
		$("#" + id + "_search").keyup(function(e) {
			if(e.keyCode==13)
				update_source()
		})
		update_source()
		res.data_source.change(update_source)
	} else
		res.data_source.change(list.data_source)
	res.page_size = list.page_size
	res.preload = list.preload
	res.preload(3)
	res.page_size(10)
	return res
});

$ctl.control("select_window_items", function(id, nd) {
	nd.children().active("ctl-select_window_items-normal",
		"ctl-select_window_items-hover",
		"ctl-select_window_items-active")
	return {}
});