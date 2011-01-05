
$ctl.pagelist = function(id) {
	$("#" + id).children().filter(":not(.ctl-pagelist-selected)").active("ctl-pagelist-normal", "ctl-pagelist-hover", "ctl-pagelist-active")
};

