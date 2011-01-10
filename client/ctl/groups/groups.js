
$ctl.control("groups_list", function(id, nd) {
	function data_source() {
		var text = $ctl(id + "_search").value()
		return function(o, l, cb) {
				$model.groups.search({ offset: o, limit: l, text: text }, function(r) {
						if(!r.status)
							$show_error("Ошибка поиска", r)
						else
							cb(r.data)
					})
			}
	}
	$ctl(id + "_list").data_source(data_source())
	$ctl(id + "_search").value.change(function() { $ctl(id + "_list").data_source(data_source()); })
	return {}
});


$ctl.control("groups_form", function(id, nd) {
	var res = { value: $ctl(id + "_form").value };
	$ctl(id + "_manager").data_source(function(s, l, cb) {
		$model.users.search({ mode:"combo", offset:s, limit:l, role:"teacher" }, function(r) {
			if(r.status)
				cb(r.data)
		})
	})
	return res
});

$ctl.control("groups_new", function(id, nd) {
	var gr_form = $ctl(id + "_form")
	$ctl(id + "_save").click(function() {
		$model.groups.create(gr_form.value(), function(r) {
			if(r.status)
				$history().data({page:["groups", r.data]})
		})
	})
	return {}
});

$ctl.control("groups_edit", function(id, nd) {
	var res = $control("value")
	var gr_form = $ctl(id + "_form")
	res.value.change(gr_form.value)
	gr_form.value.change(res.value)
	$ctl(id + "_save").click(function() {
		$model.groups.save(gr_form.value(), function(r) {
			/*if(r.status)
				$history().data({page:["groups", r.data]})*/
		})
	})
	var sel_student = $ctl(id + "_select_student")
	var students = $ctl(id + "_students")
	var students_ds = null
	res.value.change(function(v) {
		students_ds = function(s, l, cb) {
				$model.users.search({ offset:s, limit:l, role:"student", group:res.value().id }, function(r) {
					if(r.status)
						cb(_.map(r.data, function(x) {
								return _.extend(_.clone(x), { actions:[{name:"Удалить", action:"$ctl('" + id + "').remove_student('" + x.id + "')"}] })
							}))
				})
			}
		students.data_source(students_ds)
	})
	sel_student.data_source(function(s, l, cb) {
		$model.users.search({ mode:"combo", offset:s, limit:l, role:"student" }, function(r) {
			if(r.status)
				cb(_.map(r.data, function(x) {
						return _.extend(_.clone(x), { action: "$ctl('" + id + "').append_student('" + x.id + "')" })
					}))
		})
	})
	res.append_student = function(s) {
		sel_student.visible(false)
		$model.groups.append_student(res.value().id, s, function() {
			students.data_source(null)
			students.data_source(students_ds)
		})
	}
	res.remove_student = function(s) {
		if(window.confirm("Вы действительно хотите удалить ученика из класса?")) {
			$model.groups.remove_student(res.value().id, s, function() {
				students.data_source(null)
				students.data_source(students_ds)
			})
		}
	}
	$ctl(id + "_addst").click(function() {
		sel_student.visible(true)
	})
	return res
});

