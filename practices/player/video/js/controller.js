let gele = function(id){
	return document.getElementById(id);
};

function pdf(e){
	if (e.stopPropagation) {
		e.stopPropagation();
	}else{
		e.cancelBubble();
	}
}
var controller = {
	controller: gele('controller'),
	play: gele('play'),
	pause: gele('pause'),
	forward: gele('forward'),
	backward: gele('backward'),
	addVideo: gele('new-video'),
	vCtrl: {
		volumn: $('#volumn'),
		curV: $('#v-ctrl'),
		initX: $('#volumn').offset().left,
		vAll: $('#volumn').width(),
		flag: false
	}
}

var player = gele('myVideo');
// var audioCtx = new (window.AudioContext||window.webkitAudioContext)();
// var source = audioCtx.createMediaElementSource(gele('myVideo')),
// 	gainNode = audioCtx.createGain();
// source.connect(gainNode);
// gainNode.connect(audioCtx.destination);

window.onload = ctrlStart;
function ctrlStart(){
	controller.play.onclick = function(e){
		e = e||window.event;
		pdf(e);
		player.play();
		$(controller.pause).toggleClass('hide');
		$(this).toggleClass('hide');
	};
	controller.pause.onclick = function(e){
		e = e||window.event;
		pdf(e);
		player.pause();
		$(controller.play).toggleClass('hide');
		$(this).toggleClass('hide');
	};
	// controller.controller.onmousewheel = function(e){
	// 	e = e||windwo.event;
	// 	if (e.wheelDelta>0) {
	// 		gainNode.gain.value += 0.1;
	// 	}
	// }
	controller.forward.onclick = function(e){
		e = e||window.event;
		pdf(e);
		if (!player.src) {
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
		if (!player.src) {
			return;
		}
		if (player.currentTime<=5) {
			player.currentTime = 0;
		}
		player.currentTime = player.currentTime - 5;
	}
}


function addVideo(videolist, player, controller){
	var last_index = videolist.length;
	gele('add')
}


