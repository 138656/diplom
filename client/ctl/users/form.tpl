${lambda(${ctl} users_form) |id:${util.generate_id()} value:""| #
	<div id="${id}" class="ctl-users_form">
		${ctl.content_title("${unless(${value}) #Создание пользователя#end}${if(${value}) #Редактирование данных пользователя#end}" )}
		${set(form) #
			<div class="ctl-users_form-form">
				${ctl.form(id:"${id}_form") |row| #
					${row(name:name1 caption:"Фамилия" ctl_name:string ctl_params:{id:"${id}_name1" value:"${value.name1}"})}
					${row(name:name2 caption:"Имя" ctl_name:string ctl_params:{id:"${id}_name2" value:"${value.name2}"})}
					${row(name:name3 caption:"Отчество" ctl_name:string ctl_params:{id:"${id}_name3" value:"${value.name3}"})}
					${row(name:address caption:"Адрес" ctl_name:string ctl_params:{id:"${id}_address" value:"${value.address}"})}
					${row(name:phone caption:"Телефон" ctl_name:string ctl_params:{id:"${id}_phone" value:"${value.phone}"})}
					${row(name:_login caption:"Логин" ctl_name:string ctl_params:{id:"${id}_login" value:"${value._login}"})}
					${row(name:_password caption:"Пароль" ctl_name:string ctl_params:{id:"${id}_password" type:password value:""})}
					${row(name:_confirm caption:"Подтверждение" ctl_name:string ctl_params:{id:"${id}_confirm" type:password value:""})}
					${row(name:_role caption:"Роль" ctl_name:select ctl_params:{id:"${id}_role" window_title:"Выберете роль" value:${value.role}})}
					${row(name:_blocked caption:"Заблокирован" ctl_name:checkbox ctl_params:{id:"${id}_blocked" value:${value._blocked}})}
				#end}
			</div>
		#end}
		${set(actions) #
				${ctl.button(id:"${id}_save" mode:link caption:"Сохранить")}
				${ctl.button(id:"${id}_back" mode:link href:${util.json.stringify({page:[users]})} caption:"Вернуться к списку")}
			#end}
		${ctl.content_divider(${form} ${actions})}
	</div>
	${init(${id})}
#end}
