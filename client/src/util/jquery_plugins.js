(function($) {
	$.fn.active = function(normal, hover, active) {
		this.each(function() {
			var h = false
			var item = $(this)
			item.hover(function() {
					item.removeClass([active, normal].join(" ")).addClass(hover)
					h = true
				}, function() {
					item.removeClass([active, hover].join(" ")).addClass(normal)
					h = false
				}).mousedown(function(e) {
					if(e.which==1)
						item.removeClass([normal, hover].join(" ")).addClass(active)
				}).mouseup(function(e) {
					if(e.which==1)
						item.removeClass([active, hover, normal].join(" ")).addClass(h ? hover : normal)
				})
		})
		return this
	}
})(jQuery); 

