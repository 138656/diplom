<!DOCTYPE html>
<html>
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Test</title>
		${foreach(${styles}) |s| #<link href="/static/css/${s}" media="screen" rel="stylesheet" type="text/css" />#end}
		${foreach(${scripts}) |s| #<script type="text/javascript" src="/static/js/${s}"></script>#end}
	</head>
	<body>
		<script type="text/javascript">
			\$(function() {
				\$("body").html(tpl2js("client/ctl/controls.tpl", {
						ctl_name: "button",
						ctl_params: { "id": "tst_1", "caption": "Войти" }
					}));
				\$ctl.button("tst_1").click(function() {
					\$ctl.button("tst_1").caption("Выйти");
				})
			})
		</script>
	</body>
</html>
