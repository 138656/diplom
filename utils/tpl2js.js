#!/usr/bin/env node

var fs = require("fs")
var path = require("path")


var parser = require("./parser").generate(function(bi) {
		with(bi) {
			var mbs = maybe("space")
			rule("text", named("text", /^([^@#\$]+|\\[^])+/))
			rule("comment", /(^#\*([^\*]+|\*[^#])*\*#)|(^##.+\r?\n?)/)
			rule("space", /^(\s|(^#\*([^\*]+|\*[^#])*\*#)|(^##.+\n?))+/)
			rule("name", named("name", /^[a-zA-Z_][a-zA-Z_0-9]*/))
			rule("number", named("number", /^\d+/))
			rule("string", named("string", and(/^"/, rep(or(
							named("text", /^([^@#\$"]+|\\[^])+/),
							"var", "directive", "comment"
						)), /^"/)))
			rule("array", named("array", and(/^\[/, mbs, join("value", "space"), mbs, /^\]/)))
			rule("hash", named("hash", and(/^\{/, mbs, join("pair", "space"), mbs, /^\}/)))
			rule("text_value", or("name", "number", "var", "string", "directive"))
			rule("value", or("name", "number", "var", "string", "directive", "array", "hash"))
			rule("pair", named("pair", and("text_value", mbs, /^:/ , mbs, "value")))
			rule("directive", named("directive", and(/^@/, "name", mbs, /^\(/, mbs, named("file_name", /^"([^"\\]|\\[^])+"/), mbs, /^\)/)))
			function arg_list(s, e) {
				with(bi) {
					return named("args", and(s, mbs, maybe(join(or("pair", "value"), "space")), mbs, e))
				}
			}
			rule("index", named("index", and(/^\[/, mbs, "text_value", mbs, /^\]/)))
			var _var = and(maybe("name"), rep(or(and(/^\./, "name"), and(mbs, "index"))), maybe(named("call", and(mbs, arg_list(/^\(/, /^\)/), maybe(and(mbs, "block"))))))
			rule("var", named("var", or(and(/^\$\{/, _var, /^\}/), and(/^\$/, _var))))
			rule("block", named("block", and(/^#/, maybe(and(mbs, arg_list(/^\|/, /^\|/))), rep(or("text", "comment", "var")), /^#end/)))
			main_rule(rep(or("text", "comment", "var", "directive")))
		}
	})

var includes = {}
var parsed = {}

function include_file(file_name) {
	if(!includes[file_name])
		includes[file_name] = fs.readFileSync(file_name).toString("UTF-8")
}

function parse_file(file_name) {
	if(parsed[file_name])
		return;
	function unescape_str(str) {
		return str.replace(/\\[^]/g, function(m) {
				return m[0].substring(1, 2)
			})
	}
	function get_val(nd) {
		var c = nd.children || []
		var r = "$ctx"
		for(var i=0; i<c.length; i++)
			if(c[i].name!='call')
				r = ["var_index(", r, ", ", val_node(c[i]), ")"].join("")
		return r
	}
	function val_node(nd) {
		if(nd.name=="name") {
			return JSON.stringify(nd.value())
		} else if(nd.name=="string") {
			var c = nd.children
			if(!c)
				return "''"
			else if(c.length==1)
				return val_node(c[0])
			else {
				var r = ["(function() {\nvar $out = [];\n"]
				for(var i=0; i<c.length; i++)
					r.push(txt_node(c[i]))
				r.push("return $out.join('');\n})()")
				return r.join("")
			}
		} else if(nd.name=="number") {
			return nd.value()
		} else if(nd.name=="text") {
			return JSON.stringify(unescape_str(nd.value()))
		} else if(nd.name=="array") {
			var c = nd.children || []
			var r = []
			for(var i=0; i<c.length; i++)
				r.push(val_node(c[i]))
			return "[" + r.join(", ") + "]"
		} else if(nd.name=="hash") {
			if(!nd.children)
				return "{}"
			var c = nd.children
			var r = ["(function() {\nvar r = {};\n"]
			for(var i=0; i<c.length; i++) {
				r.push("r[")
				r.push(val_node(c[i].children[0]))
				r.push("] = ")
				r.push(val_node(c[i].children[1]))
				r.push(";\n")
			}
			r.push("return r;\n})()")
			return r.join("")
		} else if(nd.name=="index") {
			return val_node(nd.children[0])
		} else if(nd.name=="var") {
			if(nd.children && nd.children[nd.children.length-1].name=="call")
				return ["(function() {\nvar $out = [];\n", txt_node(nd), "return $out.join('');\n})()"].join("")
			else
				return get_val(nd)
		} else if(nd.name=="directive") {
			var c = nd.children
			var nm = path.join(path.dirname(file_name), unescape_str(c[1].value().replace(/^"|"$/g, "")))
			if(c[0].value()=="include") {
				include_file(nm)
				return ["includes[", JSON.stringify(nm), "]"].join("")
			} else if(c[0].value()=="parse") {
				parse_file(nm)
				return ["(function() {\nvar $out = [];\nparsed[", JSON.stringify(nm), "]($ctx, $out);\nreturn $out.join('');\n})()"].join("")
			} else
				throw new Error("Unknown directive: " + JSON.stringify())
		} else if(nd.name=="block") {
			var c = nd.children || []
			var r = ["(function(ctx) {\nreturn function($args, $out) {\n$ctx = context(ctx);\n"]
			for(var i=0; i<c.length; i++) {
				if(c[i].name=="args") {
					var al = c[i].children || []
					for(var j=0; j<al.length; j++) {
						if(al[j].name=="pair") {
							var nm = val_node(al[j].children[0])
							r.push("$ctx[")
							r.push(nm)
							r.push("] = $args[")
							r.push(j)
							r.push("] || $args[")
							r.push(nm)
							r.push("] || ")
							r.push(val_node(al[j].children[1]))
							r.push(";\n")
						} else {
							var nm = val_node(al[j])
							r.push("$ctx[")
							r.push(nm)
							r.push("] = $args[")
							r.push(j)
							r.push("] || $args[")
							r.push(nm)
							r.push("];\n")
						}
					}
				} else
					r.push(txt_node(c[i]))
			}
			r.push("};\n})($ctx)")
			return r.join("")
		}
	}
	function txt_node(nd) {
		if(nd instanceof Array) {
			var r = []
			for(var i=0; i<nd.length; i++)
				r.push(txt_node(nd[i]))
			return r.join("")
		} else if(nd.name=="directive" && nd.children[0].value()=="parse") {
			var c = nd.children
			var nm = path.join(path.dirname(file_name), unescape_str(c[1].value().replace(/^"|"$/g, "")))
			parse_file(nm)
			return ["parsed[", JSON.stringify(nm), "]($ctx, $out);\n"].join("")
		} else if(nd.name=="var" && nd.children && nd.children[nd.children.length-1].name=="call") {
			var fn = get_val(nd)
			var cl = nd.children[nd.children.length-1].children || []
			var r = ["(function() {\nvar args = {};\n"]
			if(cl.length>=1) {
				var al = cl[0].children || []
				for(var j=0; j<al.length; j++) {
					if(al[j].name=="pair") {
						r.push("args[")
						r.push(val_node(al[j].children[0]))
						r.push("] = ")
						r.push(val_node(al[j].children[1]))
						r.push(";\n")
					} else {
						r.push("args[")
						r.push(j)
						r.push("] = ")
						r.push(val_node(al[j]))
						r.push(";\n")
					}
				}
			}
			if(cl.length>=2) {
				r.push("args['yield'] = ")
				r.push(val_node(cl[1]))
				r.push(";\n")
			}
			r.push("var_call(")
			r.push(fn)
			r.push(", $ctx, args, $out);\n})();\n")
			return r.join("")
		} else
			return ["$out.push(", val_node(nd), ");\n"].join("")
	}
	var tree = parser(fs.readFileSync(file_name).toString("UTF-8"))
	parsed[file_name] = "function($ctx, $out) {\n" + txt_node(tree) + "}\n"
}

var out = function(s) {
		require("sys").puts(s)
	}
var fn_name = "tpl2js"

for(var i=2; i<process.argv.length; i++) {
	if(process.argv[i]=="-o") {
		i++
		out = (function(fname) {
				return function(s) {
						fs.writeFileSync(fname, s)
					}
			})(process.argv[i])
	} else if(process.argv[i]=="-fn") {
		i++;
		fn_name = process.argv[i]
	} else
		parse_file(process.argv[i])
}

var r = ["function ", fn_name, "(file_name, ctx) {\n"]

r.push("function context() { if(arguments.length) { var rfn = function(){}; rfn.prototype = arguments[0]; return new rfn(); } else return {}; };\n")
r.push("function var_index(v, i) { return v ? v[i] : null; };\n")
r.push("function var_call(v, ctx, args, out) { if(v && typeof v=='function') v(ctx, args, out); };\n")

r.push("var $ctx = context(ctx);\n")

r.push("$ctx['set'] = function($ctx, $args, $out) {\n")
r.push("if($args[0] && $args[1]!==undefined && $args.yield) { var o = []; $args.yield({}, o); $args[0][$args[1]] = o.join(''); return; };\n")
r.push("if($args[0] && $args.yield) { var o = []; $args.yield({}, o); $ctx[$args[0]] = o.join(''); return; };\n")
r.push("if($args[0] && $args[1] && $args[2]!=undefined) { $args[0][$args[1]] = $args[2]; return; };\n")
r.push("if($args[0] && $args[1]!=undefined) { $ctx[$args[0]] = $args[1]; return; };\n")
r.push("};\n")

r.push("$ctx['lambda'] = function($ctx, $args, $out) {\n")
r.push("if(!$args.yield || !$args[0]) return;\n")
r.push("var res_fn = function(ctx, args, out) { $args.yield(args, out); };\n")
r.push("if($args[1]) { $args[0][$args[1]] = res_fn; return; };\n")
r.push("$ctx[$args[0]] = res_fn; return;\n")
r.push("};\n")

r.push("$ctx['if'] = function($ctx, $args, $out) { if($args[0] && $args.yield) $args.yield({}, $out); };\n")
r.push("$ctx['unless'] = function($ctx, $args, $out) { if((!$args[0]) && $args.yield) $args.yield(null, $out); };\n")

r.push("$ctx['foreach'] = function($ctx, $args, $out) {\n")
r.push("if(!$args[0] || !$args.yield) return;\n")
r.push("var arr = $args[0];\n")
r.push("if(arr instanceof Array) {\nfor(var i=0; i<arr.length; i++) $args.yield([arr[i], i], $out);\n}")
r.push(" else {\nfor(var i in arr) $args.yield([arr[i], i], $out);\n} }\n")

var plugins_dir = path.join(__dirname, "plugins")
var plugins = fs.readdirSync(plugins_dir)
for(var i in plugins) {
	r.push("$ctx[")
	r.push(JSON.stringify(plugins[i].replace(/\.js$/, "")))
	r.push("] = ")
	r.push(fs.readFileSync(path.join(plugins_dir, plugins[i])))
	r.push(";\n")
}

r.push("var includes = ")
r.push(JSON.stringify(includes))
r.push(";\n")

r.push("var parsed = {\n")
var fst = true
for(var i in parsed) {
	if(!fst) {
		r.push(",\n")
		fst = false
	}
	r.push(JSON.stringify(i))
	r.push(": ")
	r.push(parsed[i])
}
r.push("\n};\n")

r.push("if(!parsed[file_name])\nthrow new Error('File not found: \"' + file_name + '\"');\n")
r.push("var $out = [];\n")
r.push("parsed[file_name]($ctx, $out);\n")
r.push("return $out.join('');\n")
r.push("}\n")

if(r.length)
	out(r.join(""))

