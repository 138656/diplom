

$ctl.users_list = function(id) {
	var list = $list(30, 3)
	$("#" + id).data("list", list)
	list.items.change(function(items) {
		$("#" + id + "_list").html(_(items).map(function(i) {
				return $ctl.ctl("users_list_item", { user: i })
			}).join(""))
	})
	list.data_source(function(o, l, cb) {
		$model.users.search({ offset: o, limit: l }, function(r) {
				if(!r.status)
					$show_error("Ошибка поиска", r)
				else
					cb(r.data)
			})
	});
	list.page_list.change(function(pl) {
		$("#" + id + "_pages").html($ctl.ctl("pagelist", {pages: _(pl).map(function(p) {
				return _(p).chain().clone().extend({
						action: "$('#" + id + "').data('list').page(" + p.page + ")"
					}).value()
			})}))
	})
}

$ctl.users_list.set_page = function(id, page) {
	
};