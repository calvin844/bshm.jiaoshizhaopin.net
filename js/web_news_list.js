$(document).ready(function () {
	$("#start_time").datepicker({
		defaultDate: new Date()
	});
	$("#start_time").datepicker($.datepicker.regional["zh-TW"]);
	$("#start_time").datepicker("option", "dateFormat", "yy-mm-dd");

	$("#end_time").datepicker({
		defaultDate: new Date()
	});
	$("#end_time").datepicker($.datepicker.regional["zh-TW"]);
	$("#end_time").datepicker("option", "dateFormat", "yy-mm-dd");


	var gov_id = $('#gov_id').val();
	var start_time = $('#start_time').val();
	var end_time = $('#end_time').val();
	var key = $('#key').val();
	var page = getQueryVariable('page');
	if (page == false) {
		page = 1;
	}
	$('#page').val(page);

	$('.search').click(function () {
		gov_id = $('.gov_list').val();
		start_time = $('#start_time').val();
		end_time = $('#end_time').val();
		key = $('#key').val();
		page = 1;
		get_news_list(gov_id, start_time, end_time, key, page);

	})
	$('.pagination').on('click', 'a', function () {
		gov_id = $('.gov_list').val();
		start_time = $('#start_time').val();
		end_time = $('#end_time').val();
		key = $('#key').val();
		page = $(this).attr('data-page');
		get_news_list(gov_id, start_time, end_time, key, page);

	})

	var parent_area_data = getData('area/get_area_list_by_pid', 'get', {
		pid: '0'
	});
	var a1_option_str = "<option value='-1'>不限</option>";
	a1_option_str += "<option value='0'>全国</option>";
	$.each(parent_area_data, function (a, a1_item) {
		a1_option_str += '<option value="' + a1_item.region_code + '">' + a1_item.region_name + '</option>';
	})
	$('.area_list').html(a1_option_str);


	$('.area_list').change(function () {
		var area_id = $(this).val();
		var a2_option_str = "";
		$(this).parent().find('.a2_select').remove()
		$(this).parent().find('.a3_select').remove()
		if (area_id > 0) {
			var area2_data = getData('area/get_area_list_by_pid', 'get', {
				pid: area_id
			});
			a2_option_str += "<select class='a2_select form-control'>";
			a2_option_str += '<option value="' + area_id + '">省级</option>';
			$.each(area2_data, function (a, a2_item) {
				a2_option_str += '<option value="' + a2_item.region_code + '">' + a2_item.region_name + '</option>';
			})
			a2_option_str += '</select>';
			$(this).after(a2_option_str)
		}
		get_gov_list(area_id)
	})

	$('body').on('change', '.a2_select', function () {
		var area_id = $(this).val();
		var area3_data = getData('area/get_area_list_by_pid', 'get', {
			pid: area_id
		});
		var a3_option_str = "<select class='a3_select form-control'>";
		a3_option_str += '<option value="' + area_id + '">市级</option>';
		$.each(area3_data, function (a, a3_item) {
			a3_option_str += '<option value="' + a3_item.region_code + '">' + a3_item.region_name + '</option>';
		})
		a3_option_str += '</select>';
		$(this).parent().find('.a3_select').remove()
		$(this).after(a3_option_str)
		get_gov_list(area_id)
	})

	get_gov_list(-1)
	get_news_list(gov_id, start_time, end_time, key, page)
})


function get_news_list(gov_id, start_time, end_time, key, page) {
	var news_list = getData('news/news_list', 'get', {
		gov_id: gov_id,
		start_time: start_time,
		end_time: end_time,
		key: key,
		page: page
	});
	var page_str = li_str = ""
	$.each(news_list.list, function (i, item) {
		let top_str = ''
		if (item.top == 1) {
			top_str = 'top'
		}
		li_str += "<tr class='tr_" + item.id + " " + top_str + "'><td>" + item.id +
			"</td><td><a target='_blank' href='" + item.url + "'>" + item.title +
			"</a></td><td>" + item.gov.gov_name + "</td><td>" + getLocalTime(item.addtime) +
			"</td></tr>";

	});
	$('.news_list').html(li_str);
	$('#page').val(news_list.option.page);
	$('#gov_id').val(news_list.option.gov_id);
	$('#start_time').val(news_list.option.start_time);
	$('#end_time').val(news_list.option.end_time);
	$('#key').val(news_list.option.key);

	for (i = news_list.page.start_page; i <= news_list.page.end_page; i++) {
		if (i == news_list.page.now_page) {
			page_str += "<li class='active'><span>" + i + "</span></li>";
		} else {
			page_str += "<li><a data-page='" + i + "' href='javascript:void(0);'>" + i + "</a></li>";
		}
	}
	page_str += "<li><a data-page='" + news_list.page.totalpage + "' href='javascript:void(0);'>末页：" + news_list.page.totalpage + "</a></li>";
	$('.pagination').html(page_str);
}


function get_gov_list(area_id) {
	var gov_data = getData('gov/get_gov_list', 'post', {
		area_id: area_id
	});
	select_str = "<option value=''>不限</option>";
	$.each(gov_data, function (i, item) {
		select_str += "<option value='" + item.id + "'>" + item.gov_name + "</option>";
	});
	$('.gov_list').html(select_str);
}
