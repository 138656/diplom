#*actions: [{name:message text:"Отправить сообщение"}
		{name:edit text:"Подробнее"}
		{name:block text:"Заблокировать"}
		{name:delete text:"Удалить"}]*#
${lambda(${ctl} users_list_item)  |user id:${util.generate_id()}| #
	<div class="ctl-users_list-item">
		<div class="ctl-users_list-item-name">${user.name1} ${user.name2} ${user.name3}</div>
		<table id="${id}">
			<td class="ctl-users_list-item-info">
				<div>${user.role}</div>
			</td>
			<td class="ctl-users_list-item-actions">
				${foreach(${user.actions}) |a| #
					${ctl.button(id:"${id}_${a.name}" mode:link caption:${a.text} href:${util.json.stringify({page:[users ${a.name} ${user.id}]})})}
				#end}
			</td>
		</table>
	</div>
#end}
${lambda(${ctl} users_list) |id:${util.generate_id()} actions:[{name:new text:"Создать"}]| #
	${ctl.content_title("Пользователи")}
	<div id="${id}">
		${ctl.content_divider("<div class=\"ctl-users_list-search\">${ctl.string(id:"${id}_search")}</div><div id=\"${id}_list\" class=\"ctl-users_list\"></div><div id=\"${id}_pages\" class=\"ctl-users_list\"></div>"
			${foreach(${actions}) |a| #
					${ctl.button(caption:${a.text} mode:link href:${util.json.stringify({page:[users ${a.name}]})})}
				#end})}
		${init_control(users_list ${id})}
	</div>
#end}

