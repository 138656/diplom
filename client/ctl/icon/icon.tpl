${lambda(${ctl} icon) |id:${util.generate_id()} name:none state:normal| #
	<span id="${id}" class="ctl-icon-${name} ctl-icon-state_${state}"></span>
	${init(${id})}
#end}