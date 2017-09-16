let gele = function(id){
	return document.getElementById(id);
};
const creurl = window.URL.createObjectURL;
const revurl = window.URL.revokeObjectURL;

function pdf(e){
	if (e.stopPropagation) {
		e.stopPropagation();
	}else{
		e.cancelBubble();
	}
}
//如果页面没加载完，controller会初始化失败
//初始化
var controller = {
	controller: gele('controller'),
	isPlay: false,
	play: gele('play'),
	pause: gele('pause'),
	forward: gele('forward'),
	backward: gele('backward'),
	stepBackward: gele('step-backward'),
	stepForward: gele('step-forward'),
	addVideo: gele('new-video'),
	listShow: gele('list-show'),
	addV: gele('upload'),
	videoList: gele('video-list'),
	currentIndex: 0,
	vCtrl: {
		volumn: $('#volumn'),
		curV: $('#v-ctrl'),
		initX: $('#volumn').offset().left,
		vAll: $('#volumn').width(),
		flag: false
	},
	tCtrl: {
		duration: $('#duration'),
		curT: $('#curtime'),
		initX: $('#duration').offset().left,
		tAll: $('#duration').width(),
		flag: false,
	}
}
var videos = [];

var player = gele('myVideo');
var audioCtx = new (window.AudioContext||window.webkitAudioContext)();
var source = audioCtx.createMediaElementSource(gele('myVideo')),
	gainNODE = audioCtx.createGain();
source.connect(gainNODE);
gainNODE.connect(audioCtx.destination);

window.onload = ctrlStart;
function ctrlStart(){
	
//==============================================================>> 列表样式
	controller.videoList.style.height = (controller.controller.offsetHeight + gele('container-box').offsetHeight) + 'px';
//==============================================================>> bing eventlistener
	player.addEventListener('timeupdate', updateProBar.bind(player, player, controller), false);
//==============================================================>> 播放/暂停
	controller.play.onclick = function(e){
		e = e||window.event;
		pdf(e);
		if (!videos.length) return;
		if (player.src==location.href) {
			player.src = videos[0].videoSrc;
		}
		player.play();
		controller.isPlay = true;
		$(controller.pause).toggleClass('hide');
		$(this).toggleClass('hide');
	};
	controller.pause.onclick = function(e){
		e = e||window.event;
		pdf(e);
		player.pause();
		controller.isPlay = false;
		$(controller.play).toggleClass('hide');
		$(this).toggleClass('hide');
	};

//==============================================================>> 进度条
// forward: 前进5s;
// backward：后退5s；
//durdrag：拖动进度条;
	controller.forward.onclick = function(e){
		e = e||window.event;
		pdf(e);
		if (!player.src==location.href) {
			return;
		}
		if (player.currentTime>=player.duration-5) {
			player.end();
		}
		player.currentTime = player.currentTime + 5;
	};
	controller.backward.onclick = function(e){
		e = e||window.event;
		pdf(e);
		if (!player.src==location.href) {
			return;
		}
		if (player.currentTime<=5) {
			player.currentTime = 0;
		}
		player.currentTime = player.currentTime - 5;
	}
	//==============================duration
	//down=>start
	controller.tCtrl.duration.get(0).onmousedown = function(e){
		e = e||window.event;
		pdf(e);
		if (!e.which == 1||player.src==location.href) {
			return;
		}
		controller.tCtrl.flag = true;
		controller.tCtrl.initX = $(this).offset().left;
		controller.tCtrl.tAll = this.offsetWidth;
	}
	controller.tCtrl.duration.get(0).onmouseleave = function(e){
		e = e||window.event;
		pdf(e);
		controller.tCtrl.flag = false;
	}
	//drag
	controller.tCtrl.duration.get(0).onmousemove = function(e){
		e = e||window.event;
		pdf(e);
		if (!controller.tCtrl.flag||player.src==location.href) {
			return;
		}
		var tLen = controller.tCtrl.tAll,
			startX = controller.tCtrl.initX;
		var dis = e.clientX - startX;
		calPer(dis, tLen, controller.tCtrl.curT, 'width');
	}

	//end
	controller.tCtrl.duration.get(0).onmouseup = function(e){
		e = e||window.event;
		pdf(e);
		if (!controller.tCtrl.flag||player.src==location.href) {
			return;
		}
		controller.tCtrl.flag = false;
		var tLen = controller.tCtrl.tAll,
			startX = controller.tCtrl.initX;
		var dis = e.clientX - startX;
		var tPer = dis/tLen;
		calPer(dis, tLen, controller.tCtrl.curT, 'width');
		player.currentTime = player.duration * tPer;
	}


/*
*=========================================================================>音量调节
*/

	window.onkeyup = (e)=>{
		if (e.keyCode==38) {
			if (gainNODE.gain.value>=4.8) {
				gainNODE.gain.value = 5
			}else{
				gainNODE.gain.value += 0.2;
			}
		}else if (e.keyCode == 40) {
			if (gainNODE.gain.value<=0.2) {
				gainNODE.gain.value = 0
			}else{
				gainNODE.gain.value -= 0.2
			}
		}
		if (gainNODE.gain.value>=2) {
			calPer(1, 1, controller.vCtrl.curV, 'width');
		}else{
			calPer(gainNODE.gain.value, 2, controller.vCtrl.curV, 'width');
		}
	}
	//mousedown
	controller.vCtrl.volumn.get(0).onmousedown = function(e){
		e = e||window.event;
		pdf(e);
		if (!e.which == 1) {
			return;
		}
		controller.vCtrl.flag = true;
		controller.vCtrl.initX = $(this).offset().left;//用js获取...多层元素嵌套的话很麻烦(要自己封装)，直接用jq了
		controller.vCtrl.vAll = this.offsetWidth;
	}
	controller.vCtrl.volumn.get(0).onmouseleave = function(e){
		e = e||window.event;
		pdf(e);
		controller.vCtrl.flag = false;
	}
	//drag
	controller.vCtrl.volumn.get(0).onmousemove = function(e){
		if (!controller.vCtrl.flag) {
			return;
		}
		e = e||window.event;
		var len = controller.vCtrl.vAll,
			startX = controller.vCtrl.initX;
		var dis = e.clientX - startX < 0.95*len ? e.clientX - startX : len;
		calPer(dis, len, controller.vCtrl.curV, 'width');
		dis = 2*dis/len;
		gainNODE.gain.value = dis;
	}
	//end click
	controller.vCtrl.volumn.get(0).onmouseup = function(e){
		if (!controller.vCtrl.flag) {
			return;
		}
		e = e||window.event;
		pdf(e);
		controller.vCtrl.flag = false;
		var len = controller.vCtrl.vAll,
			startX = controller.vCtrl.initX;
		var dis = e.clientX - startX < 0.95*len ? e.clientX - startX : len;
		calPer(dis, len, controller.vCtrl.curV, 'width');
		dis = 2*dis/len;
		gainNODE.gain.value = dis;
	}
//==============================================================>> 列表隐现
	controller.listShow.onclick = function(e){
		e = e||window.event;
		pdf(e);
		$(controller.videoList).toggleClass('hide');
	}
//==============================================================>> 添加视频
	controller.addV.onclick = function(e){
		e = e||window.event;
		pdf(e);
		addVideo(videos, player, controller);
	}
//==============================================================>> lastone/nextone
	controller.stepForward.onclick = function(e){
		e = e||window.event;
		pdf(e);
		videoNextPrev(videos, controller, 1);
	};
	controller.stepBackward.onclick = function(e){
		e = e||window.event;
		pdf(e);
		videoNextPrev(videos, controller, 1);
	}
//==============================================================>>点击视频列表播放
	controller.videoList.onclick = function(e){
		e = e||window.event;
		pdf(e);
		var targetE = e.target||e.srcElement;
		if (targetE.className == 'del'||!videos.length) {
			return;
		};
		var targetIndex = [].indexOf.call(gele('videos').children, targetE.parentNode);
		controller.currentIndex = targetIndex;
		controller.isPlay = false;
		updateSrc(player, videos, controller);
		player.play();
	}
}



//=================================================================================>>methods

function addVideo(videolist, player, controller){
	var last_index = videolist.length;
	controller.addVideo.click();
	var newvideolist = controller.addVideo;
	newvideolist.onchange = function(){
		var videosupload = [].slice.call(this.files, null);
		videosupload.forEach((v)=>{
			var videoname = `<span class="video-name">${v.name}</span>`,
				deletespan = '<span class="del">x</span>';
			var item = document.createElement('li');
			item.className = 'list-item video-list-item';
			item.innerHTML = `${videoname}${deletespan}`;
			gele('videos').appendChild(item);
			var videoUrl = creurl(v);
			videolist.push({videoSrc: videoUrl, videoName: v.name});
			last_index++;
		});
		newvideolist.value = '';
	}
}

//@param tag:用于表示上/下
function videoNextPrev(arr, controller, tag, player, videolist){
	if (!arr.length) {
		return;
	}
	// calPer(0, 1, controller.cTimeCtrl.cTime, 'width');
	var curId = controller.currentIndex;
	switch(tag){
		case -1:
			controller.currentIndex = curId == 0 ? arr.length - 1 : curId - 1;
			break;
		case 1:
			controller.currentIndex = curId == arr.length-1 ? 0 : curId + 1;
			break;
		default: break;
	}
	controller.isPlay = false;
	updateSrc(player, videolist, controller);
	player.play();
}

function updateSrc(player, videolist, controller){
	if (!videolist.length) {
		return;
	};
	var curVideo = videolist[controller.currentIndex];
	player.src = curVideo.videoSrc;
	if (controller.isPlay) {
		player.play();
	};
	for(var i=0; i<gele('videos').children.length; i++){
		if (i == controller.currentIndex) {
			$(gele('videos').children[i]).addClass('auto-trans');
		}else{
			$(gele('videos').children[i]).removeClass('auto-trans');
		}
	}
}

function calPer(v1, v2, ele, prop){
	var per = v1/v2;
	ele.css({
		[prop]: 100*per + '%'
	});
}

//update curtime==visible
function updateProBar(player, controller){
	if (!controller.tCtrl.flag) {
		var percent = player.currentTime/player.duration;
		calPer(percent, 1, controller.tCtrl.curT, 'width');
	}
}