function($ctx, $args, $out) {
	if(!$args[0] || !$args.yield)
		return
	var arr = $args[0]
	if(arr instanceof Array) {
		for(var i=0; i<arr.length; i++)
			$args.yield([arr[i], i], $out)
	} else {
		for(var i in arr)
			$args.yield([arr[i], i], $out)
	}
}