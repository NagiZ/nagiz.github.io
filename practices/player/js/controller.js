$(document).ready(function(){
	var player = $('#player'),
		controller = {
			body: $('.controller'),
			last_one: $('#last-song'),
			next_one: $('#next-song'),
			play: $('#play'),
			pause: $('#pause'),
			add_song: $('#add-song'),
			song_list: $('#song-list')
		};
	controller.body.click(function(event) {
		/* Act on the event */
		console.log(event.target.id);
	});

	/*
	*=========================================================================>添加歌曲
	*/
	controller.add_song.click(addSong);

	/*
	*=========================================================================>播放/暂停
	*/
	controller.play.click(function() {
		if (player.attr('src')) {
			player.get(0).play();
			controller.pause.toggleClass('hide');
			$(this).toggleClass('hide');
		}else{
			console.log('no song!');
		}
	});
	controller.pause.click(function() {
		player.get(0).pause();
		controller.play.toggleClass('hide');
		$(this).toggleClass('hide');
	});

	/*
	*=========================================================================>上一曲
	*/
	controller.last_one.click(()=>{
		var list_length = [];
		$('.song-list li').each(function(index, el) {
			list_length.push(el);
		});
		if (list_length<=0) {
			return;
		}
		if (true) {}
	});
});

function addSong(){
	$('#new-song').click();
	newSongs = $('#new-song');
	newSongs.change(function() {
		/* Act on the event */
		var songs = [].slice.call(newSongs.get(0).files, null);
		console.log(songs);
	});
}