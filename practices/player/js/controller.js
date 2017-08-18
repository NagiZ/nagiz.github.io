var _RAF = (function(){
	return	window.requestAnimationFrame||
			window.webkitRequestAnimationFrame||
			window.mozRequestAnimationFrame||
			window.msRequestAnimationFrame||
			function(callback){
				window.setTimeout(callback, 1000/60);
			};
})();
var _CAF = (function(){
	return  window.cancelAnimationFrame ||
		    window.mozCancelAnimationFrame||
		    function(timer){
		    	window.clearTimeout(timer);
		   };
})();

$(document).ready(function(){
	// var player = $('#player'),
	// 	controller = {
	// 		body: $('.controller'),
	// 		prev_one: $('#last-song'),
	// 		next_one: $('#next-song'),
	// 		play: $('#play'),
	// 		pause: $('#pause'),
	// 		add_song: $('#add-song'),
	// 		song_list: $('#song-list'),
	// 		songsUl: $('#songs'),
	// 		isPlay: false,//是否正在播放
	// 		lastSongPlay: '', 
	// 		currentSongIndex: 0,
	// 		song_name: $('#song-name'),
	// 		playedTime: $('#time'),
	// 		cTimeCtrl: {
	// 			duration: $('#duration'),
	// 			cTime: $('#currentTime'),
	// 			initX: $('#duration').offset().left,
	// 			curX: $('#duration').offset().left,
	// 			flag: false
	// 		},
	// 		vCtrl: {
	// 			volumn: $('#volumn'),
	// 			curV: $('#v-ctrl'),
	// 			initX: $('#volumn').offset().left,
	// 			vAll: $('#volumn').width(),
	// 			flag: false
	// 		}
	// 	},
	// 	songArr = [];//存放所有曲目
	// /*
	// *=========================================================================>audioapi, 主要用于可视化
	// */
	// var ac = new (window.AudioContext||window.webkitAudioContext)();
	// // var spliter = ac.createChannelSplitter(2);
	// // console.log(spliter);
	// var analyser = ac.createAnalyser(),
	// 	source = ac.createMediaElementSource(player.get(0)),
	// 	gainNODE = ac.createGain();
	// source.connect(analyser);
	// analyser.connect(gainNODE);
	// gainNODE.connect(ac.destination);
	// var canvas = document.getElementById('myCanvas');
	// var ctx = canvas.getContext('2d');
	// var drawVisual = null;
	// 	// startTime = null;
	// /*
	// *=========================================================================>audio 事件
	// */
	
	// player.get(0).addEventListener('playing', function(){
	// 	// console.log(_RAF);
	// 	// startTime = window.mozAnimationStartTime||Date.now();
	// 	$('#freq>span').eq(1).text(songArr[0].songSrc);
	// 	(function rafDraw(timestamp){
	// 		draw(canvas, ctx, analyser);
	// 		console.log(drawVisual);
	// 		$('#freq>span').eq(0).text(player.get(0).currentTime);
	// 		drawVisual = _RAF(rafDraw);
	// 	})();
	// });
	// player.get(0).addEventListener('seeked', function(){
	// 	if (!controller.play.hasClass('hide')) {
	// 		controller.play.click(drawVisual);
	// 	}else{
	// 		player.get(0).play();
	// 	}
	// });
	// player.get(0).addEventListener('pause', function(){
	// 	console.log(drawVisual);
	// 	_CAF(drawVisual);
	// });
	// player.get(0).addEventListener('timeupdate', timeUpdate.bind(player.get(0), player.get(0), controller), false);
	// player.get(0).addEventListener('ended', function(){
	// 	songNextPrev(songArr, controller, 1);
	// 	updateSrc(player, songArr, controller);
	// });
	// /*
	// *=========================================================================>音量调节
	// */
	// window.onkeyup = (e)=>{
	// 	if (e.keyCode==38) {
	// 		if (gainNODE.gain.value>=4.8) {
	// 			gainNODE.gain.value = 5
	// 		}else{
	// 			gainNODE.gain.value += 0.2;
	// 		}
	// 	}else if (e.keyCode == 40) {
	// 		if (gainNODE.gain.value<=0.2) {
	// 			gainNODE.gain.value = 0
	// 		}else{
	// 			gainNODE.gain.value -= 0.2
	// 		}
	// 	}
	// 	if (gainNODE.gain.value>=2) {
	// 		calPer(1, 1, controller.vCtrl.curV, 'width');
	// 	}else{
	// 		calPer(gainNODE.gain.value, 2, controller.vCtrl.curV, 'width');
	// 	}
	// }
	// //左键点击
	// controller.vCtrl.volumn.mousedown(function(e) {
	// 	if (!e.which==1) {
	// 		return;
	// 	}
	// 	controller.vCtrl.flag = true;
	// 	controller.vCtrl.initX = $('#volumn').offset().left;
	// });
	// controller.vCtrl.volumn.mouseleave(function(e) {
	// 	controller.vCtrl.flag = false;
	// });
	// //拖动
	// controller.vCtrl.volumn.mousemove(function(e) {
	// 	if (!controller.vCtrl.flag) {
	// 		return;
	// 	}
	// 	var startX = controller.vCtrl.initX,
	// 		v_all = controller.vCtrl.vAll,
	// 		diff = (e.clientX - startX) < 0.95*v_all ? e.clientX - startX : v_all;
	// 	calPer(diff, v_all, controller.vCtrl.curV, 'width');
	// 	diff = 2*diff/v_all;
	// 	gainNODE.gain.value = diff;
	// });

	// //end click
	// controller.vCtrl.volumn.mouseup(function(e) {
	// 	if (!controller.vCtrl.flag) {
	// 		return;
	// 	}
	// 	controller.vCtrl.flag = false;
	// 	var startX = controller.vCtrl.initX,
	// 		v_all = controller.vCtrl.vAll,
	// 		diff = (e.clientX - startX) < 0.95*v_all ? e.clientX - startX : v_all;
	// 	calPer(diff, v_all, controller.vCtrl.curV, 'width');
	// 	diff = 2*diff/v_all;
	// 	gainNODE.gain.value = diff;
	// });


	// // controller.body.click(function(event) {
	// // 	if (player.get(0).currentTime) {
	// // 		console.log(player.get(0).currentTime);
	// // 		console.log(player.get(0).duration);
	// // 	}
	// // });


	// /*
	// *=========================================================================>列表隐现
	// */
	// controller.song_list.click(()=>{
	// 	$('.song-list').toggleClass('hide');
	// });


	// /*
	// *=========================================================================>添加歌曲
	// */
	// controller.add_song.click(()=>{
	// 	addSong(songArr, player);
	// });


	// /*
	// *=========================================================================>点击曲目播放
	// *对点击事件冒泡，判断是否含有del-song类。若有=>删除该li；否则播放。
	// *可以尝试分开？
	// */
	// controller.songsUl.click(function(event) {
	// 	var songsLen = controller.songsUl.children('li').length;
	// 	if (songsLen<=0) {
	// 		return;
	// 	};
	// 	var targetEle = event.target;

	// 	/*删除曲目*/
	// 	if ($(targetEle).hasClass('del-song')) {
	// 		if (event.stopPropagation) {
	// 			event.stopPropagation();
	// 		}else{
	// 			event.cancelBubble();
	// 		}
	// 		var del_id = $('.del-song').index($(targetEle));
	// 		$(targetEle).parent('li').remove();
	// 		if (player.attr('src')==songArr[del_id].songSrc) {
	// 			player.attr('src', '');
	// 			updateSrc(player, songArr, controller);
	// 		}
	// 		window.URL.revokeObjectURL(songArr[del_id].songSrc);
	// 		songArr.splice(del_id, 1);
	// 		if (controller.currentSongIndex>del_id) {
	// 			controller.currentSongIndex--;
	// 		}
	// 		return;
	// 	};

	// 	/*播放点击曲目*/
	// 	var targetSong = $.trim($(targetEle).text());
	// 	var play_id = $('.song-item').index($(targetEle))==-1? $('.song-name').index($(targetEle)) : $('.song-item').index($(targetEle));
	// 	if (play_id==controller.currentSongIndex) {
	// 		if (controller.isPlay) {
	// 			controller.pause.click();
	// 		}else{
	// 			controller.play.click();
	// 		}
	// 		return;
	// 	};
	// 	controller.isPlay = true;
	// 	controller.currentSongIndex = play_id;
	// 	updateSrc(player, songArr, controller);
	// 	if (!controller.play.hasClass('hide')) {
	// 		controller.play.click();
	// 	}
	// 	// songArr.forEach((v, i)=>{
	// 	// 	if (v.songName == targetSong) {
	// 	// 		controller.isPlay = true;
	// 	// 		controller.currentSongIndex = i;
	// 	// 		updateSrc(player, songArr, controller);
	// 	// 		if (!controller.play.hasClass('hide')) {
	// 	// 			controller.play.click();
	// 	// 		}
	// 	// 	}
	// 	// });
	// });


	// /*
	// *=========================================================================>播放/暂停
	// */
	// controller.play.click(function() {
	// 	if (songArr.length) {
	// 		if (!player.attr('src')) {
	// 			updateSrc(player, songArr, controller);
	// 		}
	// 		controller.isPlay = true;
	// 		player.get(0).play();
	// 		controller.pause.toggleClass('hide');
	// 		$(this).toggleClass('hide');
	// 	}else{
	// 		console.log('no song!');
	// 	}
	// });
	// controller.pause.click(function() {
	// 	controller.isPlay = false;
	// 	player.get(0).pause();
	// 	controller.play.toggleClass('hide');
	// 	$(this).toggleClass('hide');
	// });


	// /*
	// *=========================================================================>上一曲
	// */
	// controller.prev_one.click(()=>{
	// 	songNextPrev(songArr, controller, -1);
	// 	updateSrc(player, songArr, controller);
	// });

	// /*
	// *=========================================================================>下一曲
	// */
	// controller.next_one.click(()=>{
	// 	songNextPrev(songArr, controller, 1);
	// 	updateSrc(player, songArr, controller);
	// });
	// /*
	// *=========================================================================>播放进度控制
	// */
	// controller.cTimeCtrl.duration.mousedown(function(e){
	// 	if (!player.attr('src')||e.which!=1) {
	// 		return;
	// 	}
	// 	controller.cTimeCtrl.flag = true;
	// 	controller.cTimeCtrl.initX = $('#duration').offset().left,
	// 	controller.cTimeCtrl.curX = e.clientX;
	// });
	// $(document).mousemove(function(e) {
	// 	if (!controller.cTimeCtrl.flag) {
	// 		return;
	// 	}
	// 	var startX = controller.cTimeCtrl.initX;
	// 	    endX = controller.cTimeCtrl.initX + controller.cTimeCtrl.duration.width(),
	// 	    durEle = controller.cTimeCtrl.duration;
	// 	if(e.clientX<startX){
	// 		controller.cTimeCtrl.curX = startX;
	// 	}else if(e.clientX>endX){
	// 		controller.cTimeCtrl.curX = endX;
	// 	}else{
	// 		controller.cTimeCtrl.curX = e.clientX;
	// 	}
	// 	var diff = controller.cTimeCtrl.curX - startX;
	// 	var per = diff/durEle.width();
	// 	calTime(per*player.get(0).duration, player.get(0).duration, controller.playedTime);
	// 	calPer(diff, durEle.width(), controller.cTimeCtrl.cTime, 'width');
	// });
	// $(document).mouseup(function(e) {
	// 	if (controller.cTimeCtrl.flag) {
	// 		controller.cTimeCtrl.flag = false;
	// 		var per = (controller.cTimeCtrl.curX - controller.cTimeCtrl.initX)/controller.cTimeCtrl.duration.width();
	// 		controller.cTimeCtrl.cTime.css({
	// 			'width': 100*per + '%'
	// 		});
	// 		player.get(0).currentTime = player.get(0).duration * per;
	// 	}
	// });
	$('#player').get(0).play();
});



//songArr: 当前所有载入的曲目的src；
function addSong(songArr, player){
	var last_index = songArr.length;
	$('#new-song').click();
	newSongs = $('#new-song');
	newSongs.change(function() {
		/* Act on the event */
		var songs = [].slice.call(newSongs.get(0).files, null);
		//生成列表条目
		songs.forEach((v)=>{
			var span = '<span class="del-song" title="删除">x</span>',
				name_span = `<span class="song-name">${v.name}</span>`;
			$('#songs').append(`<li class="song-item">${name_span}${span}</li>`);
			//读取文件内容并存入songArr===========filereader太慢，换用web audioapi/U
			var songUrl = window.URL.createObjectURL(v);
			songArr.push({songSrc: songUrl, songName: v.name});
			last_index++;
		});
		$('#new-song').val('');
	});
}

/*
*=======================================>更新播放器曲目
*/
function updateSrc(audio, srcArray, controller){
	if (!srcArray.length) {
		calPer(0, 1, controller.cTimeCtrl.cTime, 'width');
		controller.song_name.text('Song Playing');
		controller.playedTime.text('Time');
		return;
	}
	var curSong = srcArray[controller.currentSongIndex];
	controller.lastSongPlay = curSong.songName;
	audio.attr('src', curSong.songSrc);
	controller.song_name.text(curSong.songName);//设置曲目名
	controller.playedTime.text('Time');//初始化播放时显示
	controller.songsUl.children('li').each(function(index, el) {
		if (index == controller.currentSongIndex) {
			$(el).addClass('auto-trans');
		}else{
			$(el).removeClass('auto-trans');
		}
	});
	if (controller.isPlay) {
		if (arguments[3]) {
			audio.get(0).currentTime = arguments[3];
		}
		audio.get(0).play();
	}
}
/*
*计算播放时间
*/
function calTime(ptime, dtime, timeEle){
	var pts = Math.floor(ptime%60)>=10 ? Math.floor(ptime%60) : '0' + Math.floor(ptime%60),
		ptm = Math.floor(ptime/60)>=10 ? Math.floor(ptime/60) : '0' + Math.floor(ptime/60),
		dts = Math.floor(dtime%60)>=10 ? Math.floor(dtime%60) : '0' + Math.floor(dtime%60),
		dtm = Math.floor(dtime/60)>=10 ? Math.floor(dtime/60) : '0' + Math.floor(dtime/60);
	var timetext = `${ptm}:${pts} / ${dtm}:${dts}`;
	timeEle.text(timetext);
}
/*
*=======================================>计算当前播放百分比，并目标元素设定宽/高百分比
*prop 如果不放在数组里则无效，目前的解决方法就是放在数组里
*/
function calPer(v1, v2, ele, prop){
	var per = v1/v2;
	ele.css({
		[prop]: 100*per + '%'
	});
}

//timeupdate事件，更新进度条
function timeUpdate(audio, controller){
	if (!controller.cTimeCtrl.flag) {
		calPer(audio.currentTime, audio.duration, controller.cTimeCtrl.cTime, 'width');
		if (audio.currentTime>=1) {
			calTime(audio.currentTime, audio.duration, controller.playedTime);
		}
		// ana.fftSize = 256;
		// var dataarr = new Uint8Array(ana.frequencyBinCount);
		// ana.getByteFrequencyData(dataarr);
		// var obj = {
		// 	fft: ana.fftSize,
		// 	unit8a: dataarr
		// }
		// draw(canvas, ctx, dataarr);
		// console.log(obj);
	}
}
//tag用于表示上/下一曲
function songNextPrev(arr, controller, tag){
	if (!arr.length) {
		return;
	}
	calPer(0, 1, controller.cTimeCtrl.cTime, 'width');
	var curId = controller.currentSongIndex;
	switch(tag){
		case -1:
			curId = controller.currentSongIndex = curId == 0 ? arr.length - 1 : curId - 1;
			break;
		case 1:
			controller.currentSongIndex = curId == arr.length-1 ? 0 : curId + 1;
			break;
		default: break;
	}
}

// draw
function draw(canvas, ctx, analyser){
	analyser.fftSize = 256;
	var W = canvas.width,
		H = canvas.height,
		dataArr = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(dataArr);
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0,0, 720,480);
	ctx.font = '48px arial';
	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.fillText('My Canvas', 10, 48);
	// ctx.lineWidth = 2;
	// ctx.strokeStyle = 'rgb(255, 255, 255)';
	// ctx.beginPath();
	var sliceWidth = W/dataArr.length;
	var x = 0;
	for (var i = 0; i < dataArr.length; i++) {
		var y = dataArr[i];
		ctx.fillStyle = 'rgb(' + (y+100) + ',50,50)';
		ctx.fillRect(x, H - y, sliceWidth, y)
		x += sliceWidth;
	}
	ctx.lineTo(W, H/2);
	ctx.stroke();
};