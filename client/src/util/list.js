
var $list = function(page_size, preload_pages) {
	var res = $control("page", "page_list", "items", "data_source")
	var data = []
	var eos = false
	var ds_id = [Math.random()]
	function preload_data(max_pos, cb) {
		if(!res.data_source()) {
			eos = true
			_.defer(cb)
		} else if(max_pos>=data.length && !eos) {
			var dl = data.length
			var ods_id = ds_id
			res.data_source()(data.length, max_pos-data.length, function(itms) {
					if(ods_id===ds_id) {
						for(var i=0; i<itms.length; i++)
							data[i+dl] = itms[i];
						if(data.length<max_pos)
							eos = true
						cb()
					}
				})
		} else
			_.defer(cb)
	}
	res.page(0).items([]).page_list([])
	function update() {
		preload_data(Math.max((res.page()+preload_pages), preload_pages*2)*page_size, function() {
			res.items(data.slice(res.page()*page_size, (res.page()+1)*page_size))
			var min_page = res.page() - preload_pages;
			var max_page = res.page() + preload_pages;
			var pc = Math.ceil(data.length/page_size)
			if(min_page<0) {
				max_page = Math.min(pc, max_page-min_page)
				min_page = 0
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
	res.page.change(update)
	res.data_source.change(function() {
		data = []
		eos = false
		ds_id = [Math.random()]
		if(res.page()!=0)
			res.page(0)
		else
			update()
	})
	return res
};
