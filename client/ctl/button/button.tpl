${lambda(${ctl} button)  |id caption:"Button"| #
	<div class="ctl-button-normal" id="${id}">
		<span ${unless(${caption})#style="display: none;"#end} class="ctl-button-caption">${if(${caption})#${caption}#end}</span>
	</div>
	${init_control(button ${id})}
#end}
