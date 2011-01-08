${set(ctl { })}
${lambda(init) |id| #<script type="text/javascript">\$ctl("${id}")</script>#end}
@parse("button/button.tpl")
@parse("pagelist/pagelist.tpl")
@parse("list/list.tpl")
@parse("util/util.tpl")
@parse("users/list.tpl")
@parse("icon/icon.tpl")
@parse("form/form.tpl")