${set(ctl { })}
${lambda(init_control) |name id| #<script type="text/javascript">\$ctl.${name}("${id}")</script>#end}
@parse("button/button.tpl")
@parse("pagelist/pagelist.tpl")
@parse("util/util.tpl")
@parse("users/list.tpl")
