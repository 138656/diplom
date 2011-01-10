${lambda(${ctl} window) |id:${util.generate_id()} title yield:""| #
	<div id="${id}" class="ctl-window-overlay">
		<div class="ctl-window">
			<div id="${id}_title" class="ctl-window-title">
				<span class="ctl-window-title_text" id="${id}_caption">${title}</span>
				<div style="float: right">${ctl.button(id:"${id}_close" icon:close)}</div>
			</div>
			<div class="ctl-window-content">${yield()}</div>
		</div>
	</div>
	${init(${id})}
#end}
${lambda(${ctl} select_window_items) |id:${util.generate_id()} items:[]| #
	<div id="${id}" class="ctl-select_window_items">
		${foreach(${items}) |i| #
			<div id="${id}" onclick="${util.html.escape(${i.action})}"
				class="ctl-select_window_items-normal">${util.html.escape(${i.text})}</div>
		#end}
	</div>
	${init(${id})}
#end}
${lambda(${ctl} select_window) |id:${util.generate_id()} title enable_search:""| #
	<div id="${id}" class="ctl-select_window">
		${ctl.window(id:"${id}_window" title:${title}) #
			${if(${enable_search}) #
				${ctl.string(id:"${id}_search")}
			#end}
			${ctl.list(id:"${id}_list" item_control:select_window_items)}
		#end}
		${init(${id})}
	</div>
#end}
