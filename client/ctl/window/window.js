$ctl.control("window", function(id, nd) {
	var res = $control("visible", "title").visible(false);
	res.title($("#" + id + "_title").text())
	res.title.change(function(t) { $("#" + id + "_title").text(t); })
	res.visible.change(function(x) {
		if(x)
			nd.fadeIn(200)
		else
			nd.fadeOut(200)
	})
	return res
})