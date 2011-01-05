{
	html: {
		escape: function($ctx, $args, $out) {
			if($args[0])
				$out.push(new String($args[0]).replace(/["><]/g, function(s) {
						return { "\"": "&quot;", "<": "&lt;", ">": "&gt;" }[s];
					}))
		}
	},
	cmp: {
		equal: function($ctx, $args, $out) {
				if(args[0]==args[1])
					$out.push("1")
			},
		not_equal: function($ctx, $args, $out) {
				if(args[0]!=args[1])
					$out.push("1")
			},
		less: function($ctx, $args, $out) {
				if(args[0]<args[1])
					$out.push("1")
			},
		greater: function($ctx, $args, $out) {
				if(args[0]>args[1])
					$out.push("1")
			},
		less_or_equal: function($ctx, $args, $out) {
				if(args[0]<=args[1])
					$out.push("1")
			},
		greater_or_equal: function($ctx, $args, $out) {
				if(args[0]>=args[1])
					$out.push("1")
			}
	},
	json: {
		stringify: function($ctx, $args, $out) {
			if($args[0])
				$out.push(JSON.stringify($args[0]))
		},
		parse: function($ctx, $args, $out) {
			if($args[0] && $args.yield)
				$args.yield($ctx, [JSON.parse($args[0])], $out)
		}
	}
}
