$ctl.control("list", function(id, nd) {
	var res = $control("data_source", "page_size", "preload", "items_control").page_size(20).preload(3).items_control(nd.attr("class").replace(/^ctl-list-/, ""));
	$("#" + id + "_pages").html($ctl.html("pagelist", { id:id+"_pl" }))
	var pagelist = $ctl(id+"_pl")
	var list = null
	pagelist.page(function(p) {
		if(list)
			list.page(p)
	})
	function update_view() {
		if(res.items_control())
			$("#" + id + "_items").html($ctl.html(res.items_control(), { items: list && list.items() }));
	}
	res.items_control.change(update_view);
	function update_list() {
		if(list)
			list.unbind_all()
		list = $list(res.page_size(), res.preload())
		pagelist.page_list(list.page_list() || [])
		list.page_list.change(pagelist.page_list)
		list.items.change(update_view)
		list.data_source(res.data_source())
		res.data_source.change(list.data_source)
	}
	res.data_source.change(update_list)
	res.page_size.change(update_list)
	res.preload.change(update_list)
	return res
});