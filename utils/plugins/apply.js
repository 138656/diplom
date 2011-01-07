function($ctx, $args, $out) {
	if($args[0])
		$args[0]($ctx, $args[1] || {}, $out)
}