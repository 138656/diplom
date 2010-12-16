

var parser_generator = function(fn) {
	var max_pos
	var rules = {}
	var main_rule = null
	function rule(x) {
		if(typeof x=="string") {
			if(rules[x])
				return rules[x]
			else
				throw new Error(JSON.stringify(x) + " - is not a rule")
		} else if(x instanceof RegExp)
			return function(tree) {
					return tree.match(x)
				}
		else if(typeof x=="function")
			return x
		else
			throw new Error(JSON.stringify(x) + " - is not a rule")
		
	}
	var build_interface = {
		main_rule: function(mr) {
			main_rule = mr
		},
		rule: function(name, rl) {
			rules[name] = rule(rl)
		},
		or: function() {
			var args = arguments
			return function(tree) {
					for(var i=0; i<args.length; i++) {
						if(rule(args[i])(tree))
							return true
					}
					return false
				}
		},
		and: function() {
			var args = arguments
			return function(tree) {
					tree.begin()
					for(var i=0; i<args.length; i++) {
						if(!rule(args[i])(tree)) {
							tree.rollback()
							return false
						}
					}
					tree.commit()
					return true
				}
		},
		rep: function(r) {
			var min_rep = arguments[1] || 0
			var max_rep = arguments[1] || false
			return function(tree) {
				var rl = rule(r)
				tree.begin()
				for(var cnt = 0; (!max_rep) || cnt<max_rep; cnt++) {
					if(!rl(tree)) {
						if(cnt<min_rep) {
							tree.rollback()
							return false
						} else
							break
					}
				}
				tree.commit()
				return true
			}
		},
		maybe: function(r) {
			return build_interface.rep(r, 0, 1)
		},
		join: function(x, splitter) {
			return build_interface.and(x, build_interface.rep(build_interface.and(splitter, x)))
		},
		named: function(name, r) {
			return function(tree) {
				if(name=="value") {
					var x = 5;
					x += 9;
				}
				tree.begin()
				tree.named(name)
				if(rule(r)(tree)) {
					tree.named_end()
					tree.commit()
					return true
				} else {
					tree.rollback()
					return false
				}
			}
		}
	}
	fn(build_interface)
	function tree(source) {
		var str = source;
		var seq = []
		var seqpos = 0
		var max_pos = 0
		var seq_begin = 1,
			seq_commit = 2,
			seq_rollback = 3,
			seq_named = 4,
			seq_named_end = 5;
		return {
			begin: function() {
				seq[seqpos] = {
						type: seq_begin,
						string: str
					}
				seqpos++
			},
			commit: function() {
				var l = 0
				for(var sp=seqpos-1;; sp--) {
					var tp = seq[sp].type
					if(tp===seq_begin) {
						if(l==0) {
							seq[sp].string = null
							break
						} else
							l--
					} else if(tp===seq_commit)
						l++
				}
				seq[seqpos] = { type: seq_commit }
				seqpos++
			},
			rollback: function() {
				var l = 0
				for(; seqpos--; seq[seqpos]=null) {
					var tp = seq[seqpos].type
					if(tp===seq_begin) {
						if(l==0) {
							str = seq[seqpos].string
							return;
						} else
							l--
					} else if(tp===seq_commit)
						l++
				}
			},
			named: function(name) {
				seq[seqpos] = { type: seq_named, name: name, pos: source.length-str.length }
				seqpos++
			},
			named_end: function() {
				seq[seqpos] = { type: seq_named_end, pos: source.length-str.length }
				seqpos++
			},
			match: function(re) {
				var m = str.match(re)
				if(m) {
					str = str.substring(m[0].length, str.length)
					max_pos = Math.max(max_pos, source.length-str.length)
					return true
				} else
					return false
			},
			tree: function() {
				if(str) {
					var ps = source.substring(0, source.length-str.length)
					ps = ps.split(/$/mg)
					throw new Error(":" + ps.length + ":" + ps[ps.length-1].length + " - syntax error")
				} else {
					var res = []
					var i = 0;
					function named() {
						var sp = seq[i].pos
						var ep = null
						var name = seq[i].name
						var children = []
						for(i = i+1; seq[i].type!==seq_named_end; i++)
							if(seq[i].type===seq_named)
								children.push(named())
						children = children.length ? children : null
						ep = seq[i].pos
						var value = null
						return {
								name: name,
								children: children,
								value: function() {
									if(value===null)
										value = source.substring(sp, ep)
									return value
								}
							}
					}
					while(i<seqpos) {
						for(; i<seqpos && seq[i].type!=seq_named; i++) { }
						if(i>=seqpos)
							break
						res.push(named())
					}
					return res;
				}
			}
		}
	}
	return function(str) {
			var tr = tree(str)
			rule(main_rule)(tr)
			return tr.tree()
		}
}

exports.generate = parser_generator
	

