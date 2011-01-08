${lambda(${ctl} button)  |id:${util.generate_id()} caption:"Button" mode:"button" href:"" action:"\$history().data(${href})" icon:"none"| #
	<a class="ctl-button-${mode}-normal" id="${id}" onclick="${util.html.escape(${action})}; return false;" href="\#${util.html.escape(${href})}">
		${ctl.icon(id:"${id}_icon" name:${icon})}
		<span ${unless(${caption})#style="display: none;"#end} class="ctl-button-${mode}-caption">${if(${caption})#${util.html.escape(${caption})}#end}</span>
	</a>
	${init(${id})}
#end}
