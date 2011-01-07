${lambda(${ctl} pagelist)  |id:${util.generate_id()} pages:[]| #
	<div class="ctl-pagelist" id="${id}">
		${if(${pages["1"]}) #
			${foreach(${pages}) |p| #<span id="${id}_${p.page}" onclick="${p.action}" class="${unless(${p.active}) #ctl-pagelist-normal#end}${if(${p.active}) #ctl-pagelist-selected#end}">${p.text}</span>#end}#end}
	</div>
	${init_control(pagelist ${id})}
#end}
