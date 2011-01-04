
//items - write only
$ctl.pagelist = function(id) {
	var nd = $("#" + id)
	if(!nd)
		throw new Error("Can't find node: " + JSON.stringify(id))
	if(nd.data("ctl"))
		return nd.data("ctl")
	else {
		var ctl = $control("items", "@page")
		ctl.id = id
		nd.data("ctl", ctl)
		var hover = false
		function update_events() {
			nd.children().filter(":not(.ctl-pagelist-selected)").click(function() {
					var pgn = $(this)
					ctl.page.dispatch(parse_int(pgn.attr("id").match("\d+$")[0]))
				}).active("ctl-pagelist-normal", "ctl-pagelist-hover", "ctl-pagelist-active")
		}
		ctl.items.change(function(items) {
			nd.html(tpl2js("client/ctl/controls.tpl", { ctl_name: "pagelist_items",
					ctl_params: [id, items] }))
			update_events()
		})
		update_events()
		return ctl
	}
};
