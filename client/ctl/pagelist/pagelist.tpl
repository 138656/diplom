${lambda(${ctl} pagelist_items)  |id pages| #
	${foreach(${pages}) |p| #<span id="${id}_${p.page}" class="${unless(${p.active}) #ctl-pagelist-normal#end}${if(${p.active}) #ctl-pagelist-selected#end}">${p.text}</span>#end}
#end}
${lambda(${ctl} pagelist)  |id pages:[]| #
	<div class="ctl-pagelist" id="${id}">
		${ctl.pagelist_items(${id} ${pages})}
	</div>
	${init_control(pagelist ${id})}
#end}
