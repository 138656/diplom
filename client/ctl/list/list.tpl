${lambda(${ctl} list) |id:${util.generate_id()} item_control:"" empty_text:"Список пуст"| #
<div id="${id}" class="ctl-list-${item_control}">
	<div id="${id}_empty" class="ctl-list-empty">${empty_text}</div>
	<div id="${id}_items">
	</div>
	<div class="ctl-list-pages">${ctl.pagelist(id:"${id}_pages")}</div>
</div>
${init(${id})}
#end}