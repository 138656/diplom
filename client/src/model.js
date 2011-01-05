
var $model = (function() {
	function load(path, params, cb) {
		$.ajax({ url: path, data: params, type: (params && params.password) ? "POST" : "GET", success: function(data) {
			if(data.restart) {
				window.setTimeout(function() {
					window.location.href = "/";
				}, 1000)
			}
			cb(data)
		}});
	}
	var model = {
		login: function(l, p, cb) {
			load("/login", {login: l, password: p}, cb)
		},
		logout: function(cb) {
			load("/login", {action: "logout", test:1}, cb)
		}
	}
	return model
})();
