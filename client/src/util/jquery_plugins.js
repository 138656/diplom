(function($) {
	$.fn.active = function(normal, hover, active) {
		this.each(function() {
			var h = false
			var item = $(this)
			item.hover(function() {
					if(typeof hover=="string") {
						item.removeClass([active, normal].join(" ")).addClass(hover)
						h = true
					} else
						hover(item, "hover")
				}, function() {
					if(typeof normal=="string") {
						item.removeClass([active, hover].join(" ")).addClass(normal)
						h = false
					} else
						normal(item, "normal")
				}).mousedown(function(e) {
					if(e.which==1) {
						if(typeof active=="string")
							item.removeClass([normal, hover].join(" ")).addClass(active)
						else
							active(item, "active")
					}
				}).mouseup(function(e) {
					if(e.which==1) {
						var cl = h ? hover : normal
						if(typeof cl == "string")
							item.removeClass([active, hover, normal].join(" ")).addClass(cl)
						else
							cl(item, h ? "hover" : "normal")
					}
				})
		})
		return this
	}
})(jQuery); 

