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

