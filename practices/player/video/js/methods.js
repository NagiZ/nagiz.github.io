//requestAnimationFrame
var _RAF = (function(){
	return	window.requestAnimationFrame||
			window.webkitRequestAnimationFrame||
			window.mozRequestAnimationFrame||
			window.msRequestAnimationFrame||
			function(callback){
				window.setTimeout(callback, 1000/60);
			};
})();
//cancel
var _CAF = (function(){
	return  window.cancelAnimationFrame ||
		    window.mozCancelAnimationFrame||
		    function(timer){
		    	window.clearTimeout(timer);
		   };
})();


//requestFullscreen
function fullScr(element){
	if (element.requestFullscreen) {
		element.requestFullscreen();
	}else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}else if (element.mozRequestFullscreen) {
		element.mozRequestFullscreen();
	}else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
}
//cancel
function exitFullscreen(element){
	if (element.exitFullscreen) {
		exitFullscreen();
	}else if (element.mozExitFullscreen) {
		element.mozExitFullscreen();
	}else if (element.msExitFullscreen) {
		element.msExitFullscreen();
	}else if (element.webkitExitFullscreen) {
		element.webkitExitFullscreen();
	}
}