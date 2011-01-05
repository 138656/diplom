${lambda(${ctl} title) |yield| #<div class="ctl-title">${yield()}</div>#end}
${lambda(${ctl} string) |id value:"" type:text onchange:"" description:""| #
	<input id="${id}" value="${value}" ${if(${description})#title="${description}"#end} onchange="${onchange}" type="${type}" class="ctl-string-normal">
	${init_control(string ${id})}
#end}
