$(document).ready(function() {
	// Stuff to do as soon as the DOM is ready;
	$("#dmlinks").click(function(){
		$('#options').removeClass('in');
	})
	var	$nav_ul = $("#nav-ul").children();
	$(window).scroll(function(){
		var wHeight = 0.5*$(window).height();
		var demosTop = $("#demos").offset().top - wHeight,
			contactTop = $("#contact").offset().top - wHeight,
			top = $(document).scrollTop();
		if (top>contactTop) {
			exchangeClass($nav_ul, 2);
		}else if(top>demosTop){
			exchangeClass($nav_ul, 1);
		}else{
			exchangeClass($nav_ul, 0);
		}
		if ($("#dmlinks").hasClass('open')) {
			$("#dmlinks").removeClass('open');
		}
	})
	// initRoll();
});

function exchangeClass($eleArr, index){
	for (var i = 0; i < $eleArr.length; i++) {
		$eleArr.eq(i).removeClass('active');
	}
	$eleArr.eq(index).addClass('active');
}