${lambda(${ctl} groups_list_item)  |id:${util.generate_id()} items:[]| #
	${foreach(${items}) |item i| #
		${ctl.clickable_list_item(action:"\$history().data(${util.json.stringify({page:[groups ${item.id}]})})") #
			<div class="ctl-groups_list_item-name">${item.name}</div>
			<div class="ctl-groups_list_item-info">
				${if(${item.manager_name}) #<div>Классный руководитель: ${item.manager_name}</div>#end}
			</div>
		#end}
	#end}
#end}
${lambda(${ctl} groups_list) |id:${util.generate_id()} actions:[{name:new text:"Создать"}]| #
	${ctl.content_title("Классы")}
	<div id="${id}" class="ctl-groups_list">
		${ctl.content_divider("<div class=\"ctl-groups_list-search\">${ctl.string(id:"${id}_search")}</div><div class=\"ctl-groups_list-list\">${ctl.list(id:"${id}_list" item_control:groups_list_item)}</div>"
			${foreach(${actions}) |a| #
					${ctl.button(caption:${a.text} mode:link href:${util.json.stringify({page:[groups ${a.name}]})})}
				#end})}
	</div>
	${init(${id})}
#end}
