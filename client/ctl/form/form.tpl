${lambda(${ctl} string) |id:${util.generate_id()} value:"" type:text description:""| #
	<input id="${id}" class="ctl-string-normal"
		value="${util.html.escape(${value})}"
		${if(${description})#title="${util.html.escape(${description})}"#end}
		type="${type}">
	${init(${id})}
#end}
${lambda(${ctl} text) |id:${util.generate_id()} value:"" description:""| #
	<textarea id="${id}" class="ctl-string-normal ctl-string-text"
		${if(${description})#title="${util.html.escape(${description})}"#end}">${util.html.escape(${value})}</textarea>
	${init(${id})}
#end}