
var $control = (function() {
	function prop(obj) {
		var listeners = []
		var value = null
		function res() {
			if(arguments.length) {
				var v = arguments[0]
				if(v!=value) {
					value = v
					_.each(listeners, function(l) { l(value); })
				}
				return obj
			} else
				return value
		}
		res.change = function(fn) {
			listeners.push(fn)
			return obj
		},
		res.bind = function(p) {
			res(p())
			p.change(res)
			return obj
		}
		return res
	}
	
	function ev(obj) {
		var listeners = []
		function res(l) {
			listeners.push(l)
			return obj
		}
		res.dispatch = function() {
			var args = arguments
			_.each(listeners, function(l) {
					l.apply(null, args)
				})
			return obj
		}
		return res
	}
	
	return function() {
		return _.reduce(arguments, function(r, v) {
				if(v.substr(0, 1)=="@")
					r[v.substr(1, v.length)] = ev(r)
				else
					r[v] = prop(r)
				return r
			}, {})
	}
})()



