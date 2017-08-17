var clickTag = true,
	totalSeconds = 1800,//initial totalseconds
	timer = null,
	breakSeconds = 300,// initial break length
	backPercent = 0,//步进
	bgPercent = 0,//总高度
	breakTag = false;
$(document).ready(function(){
	$('.pic-clock').eq(0).click(function() {
		/* Act on the event */
		if (clickTag) {
			clickTag = false;
			timer = setInterval(calTime, 1000);
		}else{
			clickTag = true;
			clearInterval(timer);
		}
	});
});

function changeBreakLength(num){
	if (!clickTag) {
		return;
	}
	var breakTimes = document.getElementsByClassName('break-times')[0],
		curvalue = +breakTimes.innerText + num;
	if (curvalue<1) {
		curvalue = 1
	}
	totalSeconds -= 60;
	breakTimes.innerText = curvalue;
	breakSeconds = +curvalue*60;
}

function changeSessionLength(num){
	if (!clickTag) {
		return;
	}
	clearInterval(timer);
	var sessionTime = document.getElementsByClassName('session-time')[0],
		curvalue = +sessionTime.innerText + num;
	if (curvalue<1) {
		curvalue = 1
	}
	sessionTime.innerText = curvalue;
	$('#leftTime').text(curvalue);
	totalSeconds = +curvalue*60 + breakSeconds;
	backPercent = 100/(+curvalue*60);
	console.log(totalSeconds);
}

function calTime(){
	if ((totalSeconds-breakSeconds)>0) {
		$('.session').eq(0).text('Session');
		bgPercent = bgPercent + backPercent;
		if (backPercent>100) {
			bgPercent = 100;
		}
		$('.session-time-pic')({
			'height': bgPercent + '%',
			'background': '#0f0'
		});
		totalSeconds--;
		var ctime = totalSeconds - breakSeconds;
		console.log(ctime);
		var minutes = Math.floor(ctime/60),
			seconds = ctime%60;
		if (minutes<10) {
			minutes = '0' + minutes;
		}
		if (seconds<10) {
			seconds = '0' + seconds;
		}
		$('#leftTime').text(minutes + ':' + seconds);
	}else{
		if (!breakTag) {
			backPercent = 100/breakSeconds;
			bgPercent = 0;
			$('.session').eq(0).text('Break!');
			$('.session-time-pic').css({
			'height': 0,
			'background': '#f00',
		});
			breakTag = true;
		}
		if (totalSeconds>0) {
			bgPercent = bgPercent + backPercent;
			if (backPercent>100) {
				bgPercent = 100;
			}
			$('.session-time-pic').css({
				'height': bgPercent + '%'
			});
			totalSeconds--;
			var minutes = Math.floor(totalSeconds/60),
				seconds = totalSeconds%60;
			if (minutes<10) {
				minutes = '0' + minutes;
			}
			if (seconds<10) {
				seconds = '0' + seconds;
			}
			$('#leftTime').text(minutes + ':' + seconds);
		}else{
			totalSeconds = +$('.session-time').eq(0).text()*60 + breakSeconds;
			console.log(totalSeconds);
			breakTag = false;
		}
	}
}