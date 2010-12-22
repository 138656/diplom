
${set(ctl { })}

${lambda(init_control) |name id| #<script type="text/javascript">\$ctl.${name}("${id}")</script>#end}

@parse("button/button.tpl")

${apply(${ctl[${ctl_name}]} ${ctl_params})}

