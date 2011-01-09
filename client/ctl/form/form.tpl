${lambda(${ctl} string) |id:${util.generate_id()} name:${util.generate_id()} value:"" type:text description:""| #
	<input id="${id}" class="ctl-string-normal"
		name="${name}"
		value="${util.html.escape(${value})}"
		${if(${description})#title="${util.html.escape(${description})}"#end}
		type="${type}">
	${init(${id})}
#end}
${lambda(${ctl} text) |id:${util.generate_id()} name:${util.generate_id()} value:"" description:""| #
	<textarea id="${id}" name="${name}" class="ctl-string-normal ctl-string-text"
		${if(${description})#title="${util.html.escape(${description})}"#end}">${util.html.escape(${value})}</textarea>
	${init(${id})}
#end}
${lambda(${ctl} select) |id:${util.generate_id()} name:${util.generate_id()} window_title value:""| #
	<div id="${id}" class="ctl-select">
		<input type="hidden" name="${name}" value="${value}">
		${ctl.button(id:"${id}_select" caption:${util.coalesce(${value.text} "Выбрать")})}
		${ctl.button(id:"${id}_clear" caption:"" icon:close)}
		${ctl.select_window(id:"${id}_window" title:${window_title})}
	</div>
	${init(${id})}
#end}
${lambda(${ctl} checkbox) |id:${util.generate_id()} name:${util.generate_id()} value:""| #
	<input class="ctl-checkbox" id="${id}" type="checkbox" name="${name}" value="1" ${if(${value}) #checked="yes"#end}>
	${init(${id})}
#end}
${lambda(${ctl} form) |id:${util.generate_id()} yield:""| #
	${lambda(row) |name caption ctl_name ctl_params| #
		<tr>
			<td class="ctl-form-caption">${caption}</td>
			<td class="ctl-form-control">
				${apply(${ctl[${ctl_name}]} ${ctl_params})}
			</td>
		</tr>
	#end}
	<table id="${id}" class="ctl-form">
		<tbody>
			${yield(${row})}
		</tbody>
	</table>
#end}
