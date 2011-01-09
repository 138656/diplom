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

${lambda(${ctl} groups_form) |id:${util.generate_id()} value:""| #
	<div id="${id}" class="ctl-groups_form">
		${ctl.form(id:"${id}_form") |row| #
			${row(name:id ctl_name:hidden ctl_params:{id:"${id}_id" value:"${value.id}"})}
			${row(name:name caption:"Название" ctl_name:string ctl_params:{id:"${id}_name" value:"${value.name}"})}
			${row(name:manager caption:"Класcный руководитель" ctl_name:select ctl_params:{id:"${id}_manager" window_title:"Выберете клаcсного руководителя" value:${value.manager}})}
		#end}
	</div>
	${init(${id})}
#end}

${lambda(${ctl} groups_new) |id:${util.generate_id()}| #
	<div id="${id}" class="ctl-groups_new">
		${set(actions) #
				${ctl.button(id:"${id}_save" mode:link caption:"Сохранить")}
				#*${ctl.button(id:"${id}_arch" mode:link caption:"Отправить в архив")}*#
				${ctl.button(id:"${id}_back" mode:link href:${util.json.stringify({page:[groups]})} caption:"Вернуться к списку")}
			#end}
		${ctl.content_title("Новый класс")}
		${ctl.content_divider(${ctl.groups_form(id:"${id}_form")} ${actions})}
	</div>
	${init(${id})}
#end}
