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
						ctl_name: "pagelist",
						ctl_params: { "id": "tst_1", "pages": [
							{page: 0, text: "1", active: false},
							{page: 1, text: "2", active: false},
							{page: 2, text: "3", active: true},
							{page: 3, text: "4", active: false},
							{page: 4, text: ">", active: false}] }
					}));
				#*\$ctl.button("tst_1").click(function() {
					\$ctl.button("tst_1").caption("Выйти");
				})*#
			})
		</script>
	</body>
</html>
