
$ctl.control("pagelist", function(id, nd) {
	var res = $control("@page", "page_list").page_list([])
	res.page_list.change(function(pl) {
		if(pl.length>1) {
			nd.html($ctl.html("pagelist_pages", { id:id,  pages:pl }))
			$("#" + id).children().filter(":not(.ctl-pagelist-selected)").active("ctl-pagelist-normal", "ctl-pagelist-hover", "ctl-pagelist-active")
		} else
			nd.html("")
	})
	return res
});
