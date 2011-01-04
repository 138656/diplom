
var $list = function(data_fn, page_size, preload_pages) {
	var res = $control("page", "page_list", "items")
	var data = []
	var eos = false
	function preload_data(max_pos, cb) {
		if(max_pos>data.length && !eos) {
			data_fn(data.length, max_pos-data.length, function(itms) {
					data = data.concat(itms)
					if(data.length!=max_pos)
						eos = true
				})
		} else
			_.defer(cb)
	}
	res.page(0).items([]).page_list([])
	function update() {
		preload_data((res.page()+preload_pages)*page_size, function() {
			res.items(data.slice(res.page()*page_size, (res.page()+1)*page_size))
			var min_page = res.page() - preload_pages;
			var max_page = res.page() + preload_pages;
			var pc = Math.ceil(data.length/page_size)
			if(min_page<0) {
				max_page = Math.min(pc, max_page-min_page)
				man_page = 0
			} else if(max_page>pc) {
				min_page = Math.max(0, min_page-(max_page-pc))
				max_page = pc
			}
			var current_page = res.page()
			res.page_list(_.map(_.range(min_page, max_page), function(p) {
					return { page: p,
							active: p==current_page,
							text: (function() {
									if(p==min_page && p!=0)
										return "<"
									else if(p==max_page && !(eos && p==pc))
										return ">"
									else
										return new String(p+1)
								})() }
				}))
		})
	}
	res.reset = function() {
		data = []
		eos = false
		update()
	}
	preload_data(Math.max(preload_pages*2, res.page()+preload_pages)*page_size, function() {
		update()
		res.page.change(update)
	})
	
	return res
};
