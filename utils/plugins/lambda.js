function($ctx, $args, $out) {
	if(!$args.yield || !$args[0])
		return;
	var res_fn = function(ctx, args, out) { $args.yield(args, out); };
	if($args[1])
		$args[0][$args[1]] = res_fn;
	else
		$ctx[$args[0]] = res_fn;
}