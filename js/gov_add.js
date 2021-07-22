$(document).ready(function() {
	checkLonin();
	var a1_option_str = "";
	var parent_area_data = getData('area/get_area_list_by_pid', 'get', {
		pid: '0'
	});
	a1_option_str = '<option value="0">中国</option>';
	$.each(parent_area_data, function(a, a1_item) {
		a1_option_str += '<option value="' + a1_item.region_code + '">' + a1_item.region_name + '</option>';
	})
	$('.a1_select').html(a1_option_str)
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
		$(this).parents('form').find('button').attr('data-area_id', a1_id)
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
		$(this).parents('form').find('button').attr('data-area_id', a2_id)
	})
	$('body').on('change', '.a3_select', function() {
		var a3_id = $(this).val();
		$(this).parents('form').find('button').attr('data-area_id', a3_id)
	})
	$('#add_gov').click(function() {
		var area_id = $(this).attr('data-area_id');
		var gov_name = $(this).parent().find('input.gov_name').val();
		toDo('gov/add_gov', 'post', {
			area_id: area_id,
			gov_name: gov_name
		});
		alert('添加成功！');
		document.location.reload()
	})
})
