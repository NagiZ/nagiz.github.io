$(document).ready(function(){
	var player = $('#player'),
		controller = {
			body: $('.controller'),
			prev_one: $('#last-song'),
			next_one: $('#next-song'),
			play: $('#play'),
			pause: $('#pause'),
			add_song: $('#add-song'),
			song_list: $('#song-list'),
			volumn: $('#volumn'),
			songsUl: $('#songs'),
			isPlay: false,//是否正在播放
			lastSongPlay: '', 
			currentSongIndex: 0
		},
		songArr = [];//存放所有曲目

	var ac = new (window.AudioContext||window.webkitAudioContext)();
	var sr1 = ac.createAnalyser();
	console.log(sr1);
	var source = ac.createMediaElementSource(player.get(0));
	var gainNODE = ac.createGain();
	source.connect(gainNODE);
	gainNODE.connect(ac.destination);
	console.log(source);
	
	controller.volumn.click(function(event) {
		/* Act on the event */
		gainNODE.gain.value = 5;
	});
	window.onkeyup = (e)=>{
		if (e.keyCode==38) {
			if (gainNODE.gain.value>=5) {
				gainNODE.gain.value==5
			}else{
				gainNODE.gain.value+=0.2;
			}
		}
	}

	controller.body.click(function(event) {
		/* Act on the event */
		console.log(event.target.id);
	});


	/*
	*=========================================================================>列表隐现
	*/
	controller.song_list.click(()=>{
		$('.song-list').toggleClass('hide');
	});


	/*
	*=========================================================================>添加歌曲
	*/
	controller.add_song.click(()=>{
		addSong(songArr, player);
	});


	/*
	*=========================================================================>点击曲目播放
	*对点击事件冒泡，判断是否含有del-song类。若有=>删除该li；否则播放。
	*可以尝试分开？
	*/
	controller.songsUl.click(function(event) {
		var songsLen = controller.songsUl.children('li').length;
		if (songsLen<=0) {
			return;
		};
		var targetEle = event.target;

		/*删除曲目*/
		if ($(targetEle).hasClass('del-song')) {
			var del_id = $('.del-song').index($(targetEle));
			console.log($('.del-song').index($(targetEle)));
			$(targetEle).parent('li').remove();
			if (player.attr('src')==songArr[del_id].songSrc) {
				player.attr('src', '');
			}
			songArr.splice(del_id, 1);
			updateSrc(player, songArr, controller);
			return;
		};

		/*播放点击曲目*/
		var targetSong = $.trim($(targetEle).text());
		if (targetSong==controller.lastSongPlay) {
			if (controller.isPlay) {
				controller.pause.click();
			}else{
				controller.play.click();
			}
			return;
		}
		console.log(targetSong);
		songArr.forEach((v, i)=>{
			if (v.songName == targetSong) {
				controller.isPlay = true;
				controller.currentSongIndex = i;
				updateSrc(player, songArr, controller);
				if (!controller.play.hasClass('hide')) {
					controller.play.click();
				}
			}
		});
	});


	/*
	*=========================================================================>播放/暂停
	*/
	controller.play.click(function() {
		if (songArr.length) {
			if (!player.attr('src')) {
				updateSrc(player, songArr, controller);
			}
			controller.isPlay = true;
			player.get(0).play();
			controller.pause.toggleClass('hide');
			$(this).toggleClass('hide');
		}else{
			console.log('no song!');
		}
	});
	controller.pause.click(function() {
		controller.isPlay = false;
		player.get(0).pause();
		controller.play.toggleClass('hide');
		$(this).toggleClass('hide');
	});


	/*
	*=========================================================================>上一曲
	*/
	controller.prev_one.click(()=>{
		if (!songArr.length) {
			return;
		}
		var curId = controller.currentSongIndex;
		controller.currentSongIndex = curId == 0 ? songArr.length - 1 : curId - 1;
		updateSrc(player, songArr, controller);
	});

	/*
	*=========================================================================>上一曲
	*/
	controller.next_one.click(()=>{
		if (!songArr.length) {
			return;
		}
		var curId = controller.currentSongIndex;
		controller.currentSongIndex = curId == songArr.length-1 ? 0 : curId + 1;
		updateSrc(player, songArr, controller);
	});
});



//songArr: 当前所有载入的曲目的src；
function addSong(songArr, player){
	var last_index = songArr.length;
	$('#new-song').click();
	newSongs = $('#new-song');
	newSongs.change(function() {
		/* Act on the event */
		var songs = [].slice.call(newSongs.get(0).files, null);
		console.log(newSongs.get(0).files[0]);
		console.log(songs);
		//生成列表条目
		songs.forEach((v)=>{
			if (true) {}
			var span = '<span class="del-song" title="删除">x</span>',
				name_span = `<span class="song-name">${v.name}</span>`;
			$('#songs').append(`<li class="song-item">${name_span}${span}</li>`);
			//读取文件内容并存入songArr===========filereader太慢，换用web audioapi/U
			var songUrl = window.URL.createObjectURL(v);
			songArr.push({songSrc: songUrl, songName: v.name});
			last_index++;
		});
		$('#new-song').val('');
		console.log(songArr);
	});
}

/*
*=======================================>更新播放器曲目
*/
function updateSrc(audio, srcArray, controller){
	if (!srcArray.length) {
		return;
	}
	var curSong = srcArray[controller.currentSongIndex];
	controller.lastSongPlay = curSong.songName;
	audio.attr('src', curSong.songSrc);
	controller.songsUl.children('li').each(function(index, el) {
		if (index == controller.currentSongIndex) {
			$(el).addClass('auto-trans');
		}else{
			$(el).removeClass('auto-trans');
		}
	});
	if (controller.isPlay) {
		audio.get(0).play();
	}
}