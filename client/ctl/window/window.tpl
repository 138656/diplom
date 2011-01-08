${lambda(${ctl} window) |id:${util.generate_id()} title:"Untitled" yield:""| #
	<div id="${id}" class="ctl-window-overlay">
		<div class="ctl-window">
			<div id="${id}_title" class="ctl-window-title">${title}</div>
			<div class="ctl-window-content">${yield()}</div>
		</div>
	</div>
	${init(${id})}
#end}