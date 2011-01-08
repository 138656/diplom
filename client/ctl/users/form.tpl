${lambda(${ctl} users_form) |id value:""| #
	${set(form) #
		<table class=""
	#end}
	${ctl.content_divider(${form}
		${foreach([{name:save text:"Сохранить"}]) |a| #
			${ctl.button(caption:${a.text} mode:link href:${util.json.stringify({page:[users ${a.name}]})})}
		#end})}
#end}
