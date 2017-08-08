$(document).ready(function(){
	$icon = $("#search-icon");
	$text = $("#search");
	$icon.click(function(event) {
		/* Act on the event */
		if (!$text.val()) {
			$text.toggleClass('search-visible');
			$icon.toggleClass('icon-in');
			return;
		};
		var input = $text.val();
		$.ajax({
			type: 'GET',
			url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json',
			data: {titles: input},
			dataType: 'jsonp',
			jsonp: 'callback',
			success: function(data){
				if (!data.query) {
					return;
				}
				console.log(data);
				var idArr = [];
				for(var pageid in data.query.pages){
					idArr.push(pageid);
				}
				console.log(idArr);
				idArr = idArr[0];
				var title = encodeURIComponent(data.query.pages[idArr].title);
				var newWindowUrl = 'http://en.wikipedia.org/wiki/' + title;
				window.open(newWindowUrl, '_blank');
			}
		});
	});
});