$ctl.control("button", function(id, nd) {
	var mode = nd.hasClass("ctl-button-button-normal") ? "button" : "link";
	var caption = $(".ctl-button-" + mode + "-caption", nd)
	var res = $control("@click", "caption", "icon")
	var icon = $ctl(id+"_icon")
	nd.click(res.click.dispatch)
	res.caption.change(function(c) {
		if(c)
			caption.text(c)
		else
			caption.hide()
	})
	res.caption(caption.text())
	nd.active("ctl-button-" + mode + "-normal", "ctl-button-" + mode + "-hover", "ctl-button-" + mode + "-active")
	function icon_state(item, st) { icon.state(st); }
	nd.active(icon_state, icon_state, icon_state)
	res.icon(icon.icon())
	res.icon.change(icon.icon)
	return res
});

