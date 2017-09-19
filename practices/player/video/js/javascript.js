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
var timestamp = null;
var cbox = document.querySelector('.container-box'),
	cboxL = cbox.offsetLeft,
	cboxT = cbox.offsetTop,
	cboxW = cbox.offsetWidth,
	cboxH = cbox.offsetHeight;
var d = document.createElement('div');
var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');
var mv = document.getElementById('myVideo');
var lD = new Date();//预渲染用
//分割块数，x：横向； y：纵向
var Nx = 1,
	Ny = 1;
//视频源是720P，为1280*720像素
var W = cvs.width,
	H = cvs.height,
	srcW = W/Nx,
	srcH = H/Ny;
//目标画布的zIndex======>主要是应对切割后的视频堆叠问题
curIndex = 9;
//canvas 数组
var canvasArr = [];

var tCanvas = function(x, y, cw, ch, indexX, indexY){
	this.cs = document.createElement('canvas');
	cbox.appendChild(this.cs);
	this.x = x;
	this.y = y;
	this.w = cw;
	this.h = ch;
	this.ix = indexX;
	this.iy = indexY;
	this.ctx = null;
	this.disTomove = {
		x: 0,
		y: 0
	};
	this.isMove = false;
}

tCanvas.prototype = {
	create: function(){
		this.cs.className = 'cvsbor';
		this.cs.width = this.w;
		this.cs.height = this.h;
		this.cs.style.left = this.x + 'px';
		this.cs.style.top = this.y + 'px';
		this.ctx = this.cs.getContext('2d');
	},
	updateZindex: function(){
		if (this.style.zIndex < curIndex) {
			this.style.zIndex = curIndex;
			curIndex ++;
		}
	},
	updatePos: function(){
		this.cs.style.left = this.x + this.disTomove.x + 'px';
		this.cs.style.top = this.y + this.disTomove.y + 'px';
	},
	// events: function(){
	// 	var that = this;
	// 	this.cs.onmousedown = function(e){
	// 		e = e||window.event;
	// 		var dis = that.disTomove;
	// 		that.isMove = true;
	// 		that.disTomove.x = e.clientX;
	// 		that.disTomove.y = e.clientY;
	// 		window.onmousemove = function(e){
	// 			if (!that.isMove) {
	// 				return;
	// 			}
	// 			e = e||window.event;
	// 			that.disTomove = {
	// 				x: e.clientX - dis.x,
	// 				y: e.clientY - dis.y
	// 			};
	// 			that.updatePos();
	// 		};
	// 		window.onmouseup = function(){
	// 			if (that.isMove) {
	// 				that.x += that.disTomove.x;
	// 				that.y += that.disTomove.y;
	// 			};
	// 			this.onmousemove = null;
	// 			that.isMove = false;
	// 		}
	// 	};
	// },
	//@source: https://github.com/whxaxes/canvas-test/blob/master/src/Game-demo/vedioPintu.html
	//关键，在分割画布数量多的情况下，则requestAnimationFrame会超时违规, 暂时没有解决方案
	drawVideo: function(){
		var	srcX = srcW * this.ix,
			srcY = srcH * this.iy;
		this.ctx.drawImage(cvs, srcX, srcY, srcW, srcH, 0, 0, this.w, this.h);
	}
}

for(var i=0; i<Nx; i++){
	for(var j=0; j<Ny; j++){
		var curIndex = i*Ny + j;
		var canvas = new tCanvas(i*cboxW/Nx, j*cboxH/Ny, cboxW/Nx, cboxH/Ny, i, j);
		canvasArr.push(canvas);
		canvas.create();
		// canvas.events();//设置好事件监听
	}
};


// 关键，在分割画布数量多的情况下，则requestAnimationFrame会超时违规, 暂时没有解决方案
function rmv(){
	var nD = new Date();
	timestamp = _RAF(rmv);
	if (nD - lD > 30) {
		lD = nD;
		ctx.drawImage(mv, 0, 0, W, H);
		for(var i=0; i<canvasArr.length; i++){
			canvasArr[i].drawVideo();
		}
	}
}
mv.addEventListener('playing', rmv, false);
mv.addEventListener('pause', function(){
	_CAF(timestamp);
}, false);
mv.onload = function(){
	console.log('就绪');
}
 // mv.play();