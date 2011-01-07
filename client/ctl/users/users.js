

$ctl.users_list = function(id) {
	var list = $list(30, 3)
	$("#" + id).data("list", list)
	function update_source() {
		list.data_source(function(o, l, cb) {
			$model.users.search({ offset: o, limit: l, text: $("#" + id + "_search").val() }, function(r) {
					if(!r.status)
						$show_error("Ошибка поиска", r)
					else
						cb(r.data)
				})
		});
	}
	$("#" + id + "_search").keyup(function(e) {
			if(e.keyCode==13)
				update_source()
		})
	list.items.change(function(items) {
		$("#" + id + "_list").html(_(items).map(function(i) {
				return $ctl.ctl("users_list_item", { user: i })
			}).join(""))
	})
	list.page_list.change(function(pl) {
		$("#" + id + "_pages").html($ctl.ctl("pagelist", {pages: _(pl).map(function(p) {
				return _(p).chain().clone().extend({
						action: "$('#" + id + "').data('list').page(" + p.page + ")"
					}).value()
			})}))
	})
	update_source()
};