${lambda(${ctl} users_list_items)  |id items actions: [
		{name:message text:"Отправить сообщение"}
		{name:edit text:"Подробнее"}
		{name:delete text:"Заблокировать"}
		{name:delete text:"Удалить"}]| #
	${foreach(${items}) |i| #
		<div class="ctl-users_list-item" id="${id}_${i.id}">
			<div class="ctl-users_list-actions">
			
			</div>
		</div>
	#end}
#end}

