window.onload = loadFun;

var cvs = document.getElementById('myCanvas'),
	cvsCtx = cvs.getContext('2d');

function loadFun(){
	cvs.width = (window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth);
	cvs.height = (window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight);
	reDB();
	window.onresize = function(){
		var W = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
			H = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
		console.log(cvs.width);
		cvs.width = W;
		cvs.height = H;
		reDB();
	}
}

function reDB(){
	cvsCtx.clearRect(0,0, cvs.width, cvs.height);
	cvsCtx.fillStyle = 'rgb(0,0,0)';
	cvsCtx.fillRect(0,0, cvs.width, cvs.height);
}