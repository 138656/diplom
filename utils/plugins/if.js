function($ctx, $args, $out) {
	if($args[0] && $args.yield)
		$args.yield($ctx, {}, $out)
}
