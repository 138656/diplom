${lambda(${ctl} pagelist_pages) |id pages| #
	${foreach(${pages}) |p| #<span onclick="\$ctl('${id}').page.dispatch(${p.page})" class="${unless(${p.active}) #ctl-pagelist-normal#end}${if(${p.active}) #ctl-pagelist-selected#end}">${p.text}</span>#end}
#end}
${lambda(${ctl} pagelist)  |id:${util.generate_id()}| #
	<div class="ctl-pagelist" id="${id}"></div>
	${init(${id})}
#end}
