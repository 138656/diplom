${lambda(${ctl} users_list_item)  |id:${util.generate_id()} items:[]| #
	${foreach(${items}) |item i| #
		<div id="${id}_${i}" class="ctl-users_list_item-normal" onclick="\$history().data(${util.html.escape(${util.json.stringify({page:[users ${item.id}]})})})">
			<div class="ctl-users_list_item-name">${item.name1} ${item.name2} ${item.name3}</div>
			<div class="ctl-users_list_item-info">
				<div>${item.role}</div>
			</div>
		</div>
		${init("${id}_${i}")}
	#end}
#end}
${lambda(${ctl} users_list) |id:${util.generate_id()} actions:[{name:new text:"Создать"}]| #
	${ctl.content_title("Пользователи")}
	<div id="${id}" class="ctl-users_list">
		${ctl.content_divider("<div class=\"ctl-users_list-search\">${ctl.string(id:"${id}_search")}</div><div class=\"ctl-users_list-list\">${ctl.list(id:"${id}_list" item_control:users_list_item)}</div>"
			${foreach(${actions}) |a| #
					${ctl.button(caption:${a.text} mode:link href:${util.json.stringify({page:[users ${a.name}]})})}
				#end})}
	</div>
	${init(${id})}
#end}

