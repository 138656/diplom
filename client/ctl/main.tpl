<!DOCTYPE html>
<html>
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Test</title>
		${foreach(${styles}) |s| #<link href="/static/css/${s}" media="screen" rel="stylesheet" type="text/css"/>#end}
		${foreach(${scripts}) |s| #<script type="text/javascript" src="/static/js/${s}"></script>#end}
	</head>
	<body>
		@parse("import.tpl")
		<div class="main-layer"><div class="main-center" style="width: 830px;">
			${ctl.title() #
				${if(${user}) #<span class="main-user-name">${user.name2} ${user.name1}</span>#end}
				<div style="float: right;">
					${unless(${user}) #
							${ctl.string(login_login description:"Логин")}
							${ctl.string(login_password type:password description:"Пароль")}
							${ctl.button(href:${util.json.stringify({page:[login]})} caption:"Войти")}
							<script type="text/javascript">
								\$(function() {
									\$("\#login_login").add("\#login_password").keyup(function(e) {
										if(e.keyCode==13)
											\$history().data({page:["login"]});
									})
								})
							</script>
					#end}
					${if(${user}) #
						${ctl.button(href:${util.json.stringify({page:[logout]})} caption:"Выйти")}
					#end}
				</div>
			#end}
			<table cellspacing="0" cellpadding="0" class="main-divider">
				<col width="160px">
				<col width="670px">
				<tbody><tr>
					<td class="main-cell">
						<div class="main-menu">
							${foreach(${actions}) |a| #
								${ctl.button(href:"{\"page\":[\"${a.name}\"]}" caption:${a.text} mode:link)}
							#end}
						</div>
					</td>
					<td class="main-cell">
						<div class="main-content-box">
							<div class="main-content" id="content">
								
							</div>
						</div>
					</td>
				</tr></tbody>
			</table>
		</div></div>
		#*<script type="text/javascript">
			\$(function() {
				\$("body").html(tpl2js("client/ctl/controls.tpl", {
						ctl_name: "button",
						ctl_params: { "id": "tst_1", "caption": "Mega test", action: "window.alert(1)" }
					}));
			})
		</script>*#
	</body>
</html>
