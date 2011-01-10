${lambda(${ctl} title) |yield| #<div class="ctl-title">${yield()}</div>#end}
${lambda(${ctl} content_title) |title| #<div class="ctl-content_title">${util.html.escape(${title})}</div>#end}
${lambda(${ctl} content_divider) |c a| #
	<table class="ctl-content_divider-box" cellspacing="0" cellpadding="0">
		<col width="70%">
		<col width="30%">
		<tbody>
			<tr>
				<td class="ctl-content_divider-content">${c}</td>
				<td class="ctl-content_divider-actions">${a}</td>
			</tr>
		</tbody>
	</table>
#end}
${lambda(${ctl} clickable_list_item) |id:${util.generate_id()} action yield| #
	<div id="${id}" class="ctl-clickable_list_item-normal" onclick="${util.html.escape(${action})}">
		${yield()}
	</div>
	${init(${id})}
#end}
${lambda(${ctl} actions_list_item) |id:${util.generate_id()} actions yield| #
	<div id="${id}" class="ctl-actions_list_item-normal">
		<table class="ctl-actions_list_item-table"><tr>
			<td width="100%">${yield()}</td>
			<td>
				${foreach(${actions}) |a| #
					${ctl.button(mode:link
						caption:${a.name}
						action:${util.html.escape(${a.action})})}
				#end}
			</td>
		</tr></table>
	</div>
	${init(${id})}
#end}
${lambda(${ctl} group_title) |title| #
	<div class="ctl-group_title">${util.html.escape(${title})}</div>
#end}

