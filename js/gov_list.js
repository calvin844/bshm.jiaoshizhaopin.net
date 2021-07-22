$(document).ready(function() {
	checkLonin();
	get_gov_list_page();
	$('.pagination').on('click', 'a', function() {
		var page = $(this).attr('data-page');
		get_gov_list_page(page);
	})
	$('body').on('change', '.a1_select', function() {
		var new_select_str = a2_option_str = ""
		var a1_id = $(this).val();
		var gov_id = $(this).parent().attr('data-gov_id');
		$(this).parent().find('.a2_select').remove();
		$(this).parent().find('.a3_select').remove();
		if (a1_id > 0) {
			var a2_list = getData('area/get_area_list_by_pid', 'get', {
				pid: a1_id
			});
			a2_option_str += '<option selected value="' + a1_id + '">全部</option>';
			$.each(a2_list, function(a, a2_item) {
				a2_option_str += '<option value="' + a2_item.region_code + '">' + a2_item.region_name +
					'</option>';
			})
			new_select_str += "<select class='a2_select form-control'>";
			new_select_str += a2_option_str;
			new_select_str += "</select>";
			$(this).after(new_select_str);
		}
		$(this).parent().find('button').attr('data-area_id', a1_id)
	})
	$('body').on('change', '.a2_select', function() {
		var new_select_str = a3_option_str = ""
		var a2_id = $(this).val();
		var gov_id = $(this).parent().attr('data-gov_id');
		$(this).parent().find('.a3_select').remove();
		var a3_list = getData('area/get_area_list_by_pid', 'get', {
			pid: a2_id
		});
		a3_option_str += '<option selected value="' + a2_id + '">全部</option>';
		$.each(a3_list, function(a, a3_item) {
			a3_option_str += '<option value="' + a3_item.region_code + '">' + a3_item.region_name +
				'</option>';
		})
		new_select_str += "<select class='a3_select form-control'>";
		new_select_str += a3_option_str;
		new_select_str += "</select>";
		$(this).after(new_select_str);
		$(this).parent().find('button').attr('data-area_id', a2_id)
	})
	$('body').on('change', '.a3_select', function() {
		var a3_id = $(this).val();
		$(this).parent().find('button').attr('data-area_id', a3_id)
	})
	$('.gov_list').on('click', 'button', function() {
		var gov_id = $(this).attr('data-gov_id');
		var area_id = $(this).attr('data-area_id');
		var gov_name = $(this).parent().find('input.gov_name').val();
		toDo('gov/set_gov', 'get', {
			gov_id: gov_id,
			area_id: area_id,
			gov_name: gov_name
		});
		alert('修改成功！');
	})
})



function get_gov_list_page(page = 1) {
	var gov_data = getData('gov/get_gov_list_page', 'post', {
		page: page
	});
	var a1_selected = li_str = page_str = '';
	var a1_select_str = a2_select_str = a3_select_str = "";
	var a1_option_str = a2_option_str = a3_option_str = "";
	var parent_area_data = getData('area/get_area_list_by_pid', 'get', {
		pid: '0'
	});
	a1_option_str = '<option value="0">中国</option>';
	$.each(parent_area_data, function(a, a1_item) {
		a1_option_str += '<option value="' + a1_item.region_code + '">' + a1_item.region_name + '</option>';
	})
	$('.a1_select').html(a1_option_str)
	a1_option_str = "";
	$.each(gov_data.list, function(i, item) {
		li_str += "<li data-gov_id='" + item.id + "' class'li_" + item.id + "'>";
		li_str += "<div><label class='item_id'>" + item.id +
			"</label><input class='gov_name form-control' type='text' value='" + item.gov_name + "' /></div>";
		li_str += "<label>所属地区：</label>";
		if (item.area_id > 0) {
			var area_data = getData('area/get_area_by_id', 'get', {
				id: item.area_id
			});
		} else {
			var area_data = ""
		}
		if (area_data == "") {
			var a1_data = "";
			var a2_data = "";
			var a3_data = "";
		} else if (area_data.region_level == 1) {
			var a1_data = area_data;
			var a2_data = "";
			var a3_data = "";
		} else if (area_data.region_level == 2) {
			var a1_data = getData('area/get_area_by_id', 'get', {
				id: area_data.parent_region_code
			});
			var a2_data = area_data;
			var a3_data = "";
		} else if (area_data.region_level == 3) {
			var a2_data = getData('area/get_area_by_id', 'get', {
				id: area_data.parent_region_code
			});
			var a1_data = getData('area/get_area_by_id', 'get', {
				id: a2_data.parent_region_code
			});
			var a3_data = area_data;
		}
		if (item.area_id == 0) {
			a1_selected = 'selected';
		}
		a1_option_str += '<option ' + a1_selected + ' value="0">中国</option>';
		a1_selected = '';
		$.each(parent_area_data, function(a, a1_item) {
			a1_selected = '';
			if (a1_item.region_code === a1_data.region_code) {
				a1_selected = 'selected';
			}
			a1_option_str += '<option ' + a1_selected + ' value="' + a1_item.region_code + '">' + a1_item.region_name +
				'</option>';
		})
		li_str += "<select class='a1_select form-control'>";
		li_str += a1_option_str;
		li_str += "</select>";

		if (a2_data != '') {
			var a2_list = getData('area/get_area_list_by_pid', 'get', {
				pid: a2_data.parent_region_code
			});
			a2_option_str += '<option value="' + a2_data.parent_region_code + '">全部</option>';
			$.each(a2_list, function(a, a2_item) {
				if (a2_item.region_code == a2_data.region_code) {
					var a2_selected = 'selected';
				}
				a2_option_str += '<option ' + a2_selected + ' value="' + a2_item.region_code + '">' + a2_item.region_name +
					'</option>';
			})
			li_str += "<select class='a2_select form-control'>";
			li_str += a2_option_str;
			li_str += "</select>";
		}

		if (a3_data != '') {
			var a3_list = getData('area/get_area_list_by_pid', 'get', {
				pid: a3_data.parent_region_code
			});
			$.each(a3_list, function(a, a3_item) {
				if (a3_item.region_code == a3_data.region_code) {
					var a3_selected = 'selected';
				}
				a3_option_str += '<option ' + a3_selected + ' value="' + a3_item.region_code + '">' + a3_item.region_name +
					'</option>';
			})
			li_str += "<select class='a3_select form-control'>";
			li_str += a3_option_str;
			li_str += "</select>";
		}
		li_str += "<button class='btn btn-default btn-success' data-gov_id='" + item.id + "' data-area_id='" + item.area_id +
			"'>确定</button>";
		li_str += "</li >";
	});
	$('.gov_list').html(li_str);
	$('#page').val(gov_data.option.page);
	for (i = gov_data.page.start_page; i <= gov_data.page.end_page; i++) {
		if(i == gov_data.page.now_page){
			page_str += "<li class='active'><span>" + i + "</span></li>";
		}else{
			page_str += "<li><a data-page='" + i + "' href='javascript:void(0);'>" + i + "</a></li>";
		}
	}
	$('.pagination').html(page_str);
}
