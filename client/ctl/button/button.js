$ctl.button = function(id) {
	var nd = $("#" + id)
	var mode = nd.hasClass("ctl-button-normal") ? "button" : "link";
	nd.active("ctl-" + mode + "-normal", "ctl-" + mode + "-hover", "ctl-" + mode + "-active")
};

