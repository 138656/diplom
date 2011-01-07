${lambda(${ctl} button)  |id:${util.generate_id()} caption:"Button" mode:"button" href:"" action:"\$history().data(${href})"| #
	<a class="ctl-${mode}-normal" id="${id}" onclick="${util.html.escape(${action})}; return false;" href="\#${util.html.escape(${href})}">
		<span ${unless(${caption})#style="display: none;"#end} class="ctl-${mode}-caption">${if(${caption})#${util.html.escape(${caption})}#end}</span>
	</a>
	${init_control(button ${id})}
#end}
