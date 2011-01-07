

$ctl.ctl = function(name, params) {
	return tpl2js("client/ctl/controls.tpl", { ctl_name: name, ctl_params: params })
}

$ctl.string = function(id) {
	var focus = false
	var hover = false
	function update_class() {
		var nd = $("#"+id).removeClass().addClass("ctl-string-" + (focus ? "active" : (hover ? "hover": "normal")))
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
};
