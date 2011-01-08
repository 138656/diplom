
$ctl = (function() {
	var init_fn = {}
	var res = function(id) {
		var nd = $("#" + id)
		if(nd) {
			if(!nd.data("ctl"))
				nd.data("ctl", init_fn[_.select(nd.attr("class").split(/\s+/), function(x) { return x.match(/^ctl\-/); }) [0].split("-")[1]](id, nd))
			return nd.data("ctl")
		} else
			$.log("Html node not exists. id: " + JSON.stringify(id))
	}
	res.html = function(name, params) {
		return tpl2js("client/ctl/controls.tpl", { ctl_name: name, ctl_params: params })
	}
	res.control = function(name, ifn) {
		init_fn[name] = ifn
	}
	return res
})();