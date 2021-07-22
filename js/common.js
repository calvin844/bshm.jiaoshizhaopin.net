function getData(url, type, data) {
	var res1 = "";
	$.ajax({
		url: 'http://bshm_api.jiaoshizhaopin.net/' + url,
		type: type,
		data: data,
		success: function(res) {
			res1 = eval('(' + res + ')');
		},
		async: false
	});
	return res1;
}

function toDo(url, type, data) {
	var res1 = "";
	$.ajax({
		url: 'http://bshm_api.jiaoshizhaopin.net/' + url,
		type: type,
		data: data,
		success: function(res) {},
		async: false
	});
}



function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleDateString().replace(/\//g, '-');
}


function checkLonin() {
	let admin_id = localStorage.getItem('admin_id');
	if (admin_id === null) {
		alert('请先登陆！');
		window.location.href = "login.html"
	} else {
		let username = localStorage.getItem('username');
		$('.welcome_user').html('欢迎您，' + username)
	}
}
