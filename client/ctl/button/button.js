
$ctl.button = function(id) {
	var nd = $("#" + id)
	if(!nd)
		throw new Error("Can't find node: " + JSON.stringify(id))
	if(nd.data("ctl"))
		return nd.data("ctl")
	else {
		var ctl = $control("caption", "@click")
		ctl.id = id
		nd.data("ctl", ctl)
		ctl.caption(nd.text()).caption.change(function(v) {
				nd.text(v || "")
			})
		function set_class(cl) {
			nd.removeClass().addClass(cl)
		}
		nd.click(function() {
				ctl.click(ctl)
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

