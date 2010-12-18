#!/usr/bin/env node

var fs = require("fs")
var path = require("path")

var parser = require("./parser").generate(function(bi) {
	with(bi) {
		rule("spaces", /^(\s|\/\*([^\*]|\*[^\/])*\*\/)+/)
		rule("text", named("text", /^[^;\$]+/))
		rule("var", named("var", /^\$([a-zA-Z_][a-zA-Z_0-9\-]*|\{[a-zA-Z_][a-zA-Z_0-9\-]*\})/))
		rule("value", named("value", rep(or("var", "text"))))
		rule("name", named("name", /^[a-zA-Z_\-][a-zA-Z_0-9\-]*/))
		rule("decl", named("decl", and("name", maybe("spaces"), /^:/, maybe("spaces"), "value", maybe("spaces"), /^;/)))
		rule("namespace", named("namespace", and("name", maybe("spaces"), /^\[/, rep(or("spaces", "decl", "rule", "namespace", "include")), /^\]/)))
		rule("rule_name", named("rule_name", /^[a-zA-Z_](\s*[a-zA-Z_0-9>\.#\-\*:])*/))
		rule("parent_list", named("parent_list", and(/^\(/, maybe("spaces"), join("name", and(maybe("spaces"), /^,/, maybe("spaces"))), maybe("spaces"), /^\)/)))
		rule("rule", named("rule", and(join("rule_name", and(maybe("spaces"), /^,/, maybe("spaces"))), maybe("spaces"), maybe("parent_list"), maybe("spaces"), /^\{/, rep(or("spaces", "decl")), /^\}/ )))
		rule("include", named("include", and(/^include/, maybe("spaces"), /^\(/, maybe("spaces"), /^"/, named("file_name", /^[^"]+/), /^"/, maybe("spaces"), /\)/, maybe("spaces"), /^;/)))
		main_rule(rep(or("spaces", "decl", "namespace", "rule", "include")))
	}
})
	

function process_file(fname) {
	function context() {
		if(!arguments.length)
			return {}
		else {
			var r = function (p) { this.$parent = p; }
			r.prototype = arguments[0]
			return new r(arguments[0])
		}
	}
	function read_file(fname) {
		return parser(fs.readFileSync(fname).toString("UTF-8"))
	}
	function process_item(file_name, prefix, ctx, item) {
		var r = []
		function decl_to_pair(d) {
			var nm = d.children[0].value()
			var v = []
			var c = d.children[1].children || []
			for(var i=0; i<c.length; i++) {
				if(c[i].name=="text")
					v.push(c[i].value())
				else {
					var k = c[i].value().replace(/^\$\{|^\$|\}$/g, "")
					if(ctx[k])
						v.push(ctx[k])
					else
						throw new Error("Undefined constant: " + JSON.stringify(k))
				}
			}
			return [nm, v.join("")]
		}
		if(item instanceof Array) {
			for(var i=0; i<item.length; i++)
				r.push(process_item(file_name, prefix, ctx, item[i]))
		} else if(item.name=="decl") {
			var p = decl_to_pair(item)
			ctx[p[0]] = p[1]
		} else if(item.name=="namespace") {
			var c2 = context(ctx)
			var p2 = prefix + item.children[0].value() + "-"
			for(var i=1; i<item.children.length; i++)
				r.push(process_item(file_name, p2, c2, item.children[i]))
		} else if(item.name=="rule") {
			var cl = item.children
			var classes = []
			var rules = {}
			for(var i=0; i<cl.length; i++) {
				var c = cl[i]
				if(c.name=="rule_name") {
					classes.push(c.value())
				} else if(c.name=="parent_list") {
					var pl = c.children || []
					for(var j=0; j<pl.length; j++) {
						var pn = pl[j].value()
						if(ctx[pn] && !(typeof ctx[pn] == "string")) {
							for(var k in ctx[pn])
								rules[k] = ctx[pn][k]
						} else
							throw new Error("Unknown class name: " + JSON.stringify(pn))
					}
				} else if(c.name=="decl") {
					var p = decl_to_pair(c)
					rules[p[0]] = p[1]
				}
			}
			var rules_str = ["{\n"]
			for(var i in rules) {
				rules_str.push("\t")
				rules_str.push(i)
				rules_str.push(": ")
				rules_str.push(rules[i])
				rules_str.push(";\n")
			}
			rules_str.push("}\n\n")
			rules_str = rules_str.join("")
			for(var i=0; i<classes.length; i++) {
				ctx[classes[i]] = rules
				r.push(".")
				r.push(prefix)
				r.push(classes[i])
				r.push(" ")
				r.push(rules_str)
			}
		} else if(item.name=="include") {
			var nm = path.join(path.dirname(file_name), item.children[0].value())
			r.push(process_item(nm, prefix, ctx, read_file(nm)))
		}
		return r.join("")
	}
	return process_item(fname, "", context(), read_file(fname))
}

var out = function(s) {
		require("sys").puts(s)
	}

var r = []

for(var i=2; i<process.argv.length; i++) {
	if(process.argv[i]=="-o") {
		i++
		out = (function(fname) {
				return function(s) {
						fs.writeFileSync(fname, s)
					}
			})(process.argv[i])
	} else
		r.push(process_file(process.argv[i]))
}

if(r.length)
	out(r.join(""))

