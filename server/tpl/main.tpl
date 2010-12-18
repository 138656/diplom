<!DOCTYPE html>
<html>
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Test</title>
		${foreach($styles) # |s|<link href="$s" media="screen" rel="stylesheet" type="text/css" />#end}
		${foreach($scripts) # |s|<script type="text/javascript" src="$s"></script>#end}
	</head>
	<body>
	</body>
</html>