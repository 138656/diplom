$ctl.control("icon", function(id, nd) {
	var res = $control("icon", "state")
	res.icon(_.select(nd.attr("class").split(" "), function(x) {
			return !x.match(/(state_active|state_hover|state_normal)$/)
		})[0].replace("ctl-icon-", ""));
	res.state(_.select(nd.attr("class").split(" "), function(x) { return x.match(/(state_active|state_hover|state_normal)$/); })[0].replace("ctl-icon-state_", ""));
	res.state.change(function(st) {
		nd.removeClass("ctl-icon-state_normal ctl-icon-state_hover ctl-icon-state_active").addClass("ctl-icon-state_" + st)
	})
	res.icon.change(function(i) { nd.attr("class", "ctl-icon-" + i + " ctl-icon-state_" + res.state()); })
	return res
});