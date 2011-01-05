function($ctx, $args, $out) {
	if($args[0] && $args[1]!==undefined && $args.yield) {
		var o = []
		$args.yield($ctx, {}, o)
		$args[0][$args[1]] = o.join('')
		return
	} else if($args[0] && $args.yield) { 
		var o = []
		$args.yield($ctx, {}, o)
		$ctx[$args[0]] = o.join('')
		return;
	} else if($args[0] && $args[1] && $args[2]!==undefined)
		$args[0][$args[1]] = $args[2]
	else if($args[0] && $args[1]!=undefined)
		$ctx[$args[0]] = $args[1]
}
