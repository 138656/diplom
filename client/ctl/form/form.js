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