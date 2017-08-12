$(document).ready(function() {
	// Stuff to do as soon as the DOM is ready;
	$('#search').click(function(e){
		e.preventDefault();
		var city = $("#city").val() || "广州",
			appkey = '2c498c3e9b0e17145960e692e01423f9';
		$.ajax({
			type: "GET",
			url: "https://v.juhe.cn/weather/index",
			data: {format: 2, cityname: city, key: appkey},
			dataType: "jsonp",
			jsonp: "callback",
			success: function(data){
				console.log('asdf');
				if (data.resultcode!=200) {
					alert('输入信息有误');
					return;
				}
				$("#future-weather-table").removeClass('future-weather-table');
				$('#h-city').text(city);
				console.log(data);
				var today = data.result.today,
					future = data.result.future,
					futureDay = document.getElementsByClassName('weather-future');
				$("#temp").text(today.temperature).css('color', 'red');
				$("#dressing-advice").text(today['dressing_advice']).css('color', 'red');
				$("#wash-advice").text(today['wash_index']).css('color', 'red');
				$("#travel-advice").text(today['travel_index']).css('color', 'red');
				$("#exercise-advice").text(today['exercise_index']).css('color', 'red');
				$("#uv-index").text(today['uv_index']).css('color', 'red');
				//未来6天
				for (var i = 1; i < 7; i++) {
					var date = future[i].date.substring(0, 4) + '-' + future[i].date.substring(4, 6) + '-' + future[i].date.substring(6, 8)
					futureDay[i-1].getElementsByClassName('date')[0].innerText = date;
					futureDay[i-1].getElementsByClassName('day')[0].innerText = future[i].week;
					futureDay[i-1].getElementsByClassName('temperature')[0].innerText = future[i].temperature;
					futureDay[i-1].getElementsByClassName('weather')[0].innerText = future[i].weather;
					futureDay[i-1].getElementsByClassName('wind')[0].innerText = future[i].wind;
				}
			}
		});
	});
});