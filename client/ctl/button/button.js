
$ctl.button = function(id) {
	var nd = $("#" + id)
	if(!nd)
		throw new Error("Can't find node: " + JSON.stringify(id))
	var caption_nd = $(".ctl-button-caption", nd)
	if(nd.data("ctl"))
		return nd.data("ctl")
	else {
		var ctl = $control("caption", "@click")
		ctl.id = id
		nd.data("ctl", ctl)
		ctl.caption(caption_nd.text()).caption.change(function(v) {
				caption_nd.text(v || "")
				caption_nd.css("display", v ? "inline-block" : "none")
			})
		function set_class(cl) {
			nd.removeClass().addClass(cl)
		}
		nd.click(function() {
				ctl.click.dispatch(ctl)
			})
		var hover = false
		nd.hover(function() {
				set_class("ctl-button-hover")
				hover = true
			}, function() {
				set_class("ctl-button-normal")
				hover = false
			})
		nd.mousedown(function(e) {
			if(e.which==1)
				set_class("ctl-button-active")
		})
		nd.mouseup(function(e) {
			if(e.which==1)
				set_class(hover ? "ctl-button-hover" : "ctl-button-normal")
		})
		return ctl
	}
}

