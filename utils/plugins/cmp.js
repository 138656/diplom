{
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
}