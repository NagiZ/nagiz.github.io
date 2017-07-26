'use strict'
//屏幕宽度
var screenWidth = screen.width;
//滚动完成标记
var finroll = 1, rollDirection = "left";

window.onload = function(){
	var picDiv = document.getElementById("picDiv");
	var imgs = picDiv.getElementsByTagName("img");
	var devJud = IsPC();
	if (!devJud) {
		picDiv.className = "picD_sub";
		for (var i = 0; i < imgs.length; i++) {
			imgs[i].className = "rollpic_sub";
		}
		picDiv.style.height = imgs[0].offsetHeight+'px';
	}
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].style.left = i*imgs[0].offsetWidth+'px';
		imgs[i].ondragstart = function(){
			return false;
		}
	}
	var timer;//图片滚动次数，定时滚动定时器
	var tag = 0;//是否按下左键
	var initX = null, direX = null, direction;//滚动方向标记
	var  offarr=[], imgwidth = imgs[0].offsetWidth;

	timer = setTimeout(function cycle(){
		sliding(imgs,"left");
		clearTimeout(timer);
		timer = setTimeout(cycle, 2000);
	},2000);

	if (!devJud) {
		//clearInterval(timer);
		picDiv.addEventListener("touchstart", touchs, false);
		picDiv.addEventListener("touchend", touche, false);
		picDiv.addEventListener("touchmove", touchm, false);
	}else{
		//鼠标悬停在图片上则停止轮播
		/*picDiv.onmouseover = function(){
			clearTimeout(timer);
		}
		picDiv.onmouseout = function(){
			timer = setTimeout(function cycle(){
				sliding(imgs,"left");
				clearTimeout(timer);
				timer = setTimeout(cycle, 2000);
			},2000);
		}*/

		//左键按下则开始监听
		picDiv.onmousedown = function(e){
			console.log('down');
			clearTimeout(timer);
			if (initX) {
				console.log(initX);
				var upX = Math.abs(e.pageX-initX);
				upX = upX*2<imgs[0].offsetWidth ? upX : (imgs[0].offsetWidth-upX);
				initX = null;
				sliding(imgs, rollDirection, upX);
				tag = 0;
				timer = setTimeout(function cycle(){
					sliding(imgs,"left");
					clearTimeout(timer);
					timer = setTimeout(cycle, 2000);
					},2000);
				return;
			}
			if (!finroll) {
				return false;
			}
			initX =e.pageX;
			for (var i = 0; i < imgs.length; i++) {
				offarr[i] = imgs[i].offsetLeft;
			}
			tag = 1;
		}
		picDiv.onmouseup = function(e){
			if (!initX) {
				return false;
			}
			var upX = Math.abs(e.pageX-initX);
			upX = upX*2<imgs[0].offsetWidth ? upX : (imgs[0].offsetWidth-upX);
			tag = 0;
			initX = null;
			sliding(imgs, rollDirection, upX);
			console.log('up');
			timer = setTimeout(function cycle(){
				sliding(imgs,"left");
				clearTimeout(timer);
				timer = setTimeout(cycle, 2000);
			},2000);
		}
		//判断鼠标拖动方向
		picDiv.onmousemove = function(e){
			if (!tag) {
				return false;
			}
			if (!finroll) {
				return false;
			}
			var curX = e.pageX;
			var dragX = Math.abs(curX-initX)*2>imgwidth? true : false;
			if (direX==null) {
				direX = curX;
				return;
			}
			if(curX>direX){//右
				if (dragX) {
					rollDirection = "right";
				}else{
					rollDirection = "left";
				}
			}else if (curX<direX) {//左
				if (dragX) {
					rollDirection = "left";
				}else{
					rollDirection = "right"
				}
			}
			rolling(imgs,offarr,initX,curX);
			console.log("move"+":"+rollDirection);
		}
	}
	//触屏
	function touchs(e){
		clearTimeout(timer);
		if (!finroll) {
			return false;
		}
		initX =e.touches[0].pageX;
		for (var i = 0; i < imgs.length; i++) {
			offarr[i] = imgs[i].offsetLeft;
		}
		tag = 1;
	}

	function touche(e){
		if (!initX) {
			return false;
		}
		var upX = Math.abs(e.changedTouches[0].pageX-initX);
		upX = upX*2<imgs[0].offsetWidth ? upX : (imgs[0].offsetWidth-upX);
		tag = 0;
		initX = null;
		sliding(imgs, rollDirection, upX);
		console.log('up');
		timer = setTimeout(function cycle(){
			sliding(imgs,"left");
			clearTimeout(timer);
			timer = setTimeout(cycle, 2000);
		},2000);
	}

	function touchm(e){
		e = e||window.event;
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble = true;
			e.returnValue = false;
		}
		if (!tag) {
			return false;
		}
		if (!finroll) {
			return false;
		}
		var curX = e.touches[0].pageX;
		var dragX = Math.abs(curX-initX)*2>imgwidth? true : false;
		if (direX==null) {
			direX = curX;
			return;
		}
		if(curX>direX){//右
			if (dragX) {
				rollDirection = "right";
			}else{
				rollDirection = "left";
			}
		}else if (curX<direX) {//左
			if (dragX) {
				rollDirection = "left";
			}else{
				rollDirection = "right"
			}
		}
		rolling(imgs,offarr,initX,curX);
		console.log("move:"+rollDirection);
	}

	//窗口失焦则停止滚动
	window.onblur = function(){
		//clearInterval(timer);
		clearTimeout(timer);
	}
	window.onfocus = function(){
		timer = setTimeout(function cycle(){
			sliding(imgs,"left");
			clearTimeout(timer);
			timer = setTimeout(cycle, 2000);
		},2000);
	}
	//窗口resize
}


//图片轮播
function sliding(arr, direction, rollL){
	finroll = 0;
	var timer = null;
	var times = 0;
	var length = arr.length;
	clearInterval(timer);
	var rollWidth;
	if (rollL!=undefined) {
		rollWidth = rollL;
	}else{
		rollWidth = arr[0].offsetWidth;
	}
	var initLeft = [];
	for (var i = 0; i < arr.length; i++) {
		initLeft.push(arr[i].offsetLeft);
	}
	timer = setInterval(function(){
		if (times==30) {//左移30次，刚好是一张图片的宽度
			clearInterval(timer);
			finroll = 1;
			return;
		}
		finroll = 0;
		times++;
		for (var i = 0; i < length; i++) {
			if (direction=="left") {
				var rollleft = arr[i].offsetLeft;
				if (times==30) {
					arr[i].style.left = (initLeft[i]-rollWidth)+'px';
				}else{
					arr[i].style.left = (rollleft-rollWidth/30)+'px';
				}
				if (arr[i].offsetLeft==(1-length)*arr[0].offsetWidth) {
					arr[i].style.left = arr[0].offsetWidth+'px';
				}
			}else{	
				if (arr[i].offsetLeft==(length-1)*arr[0].offsetWidth) {
					arr[i].style.left = (-1)*arr[0].offsetWidth+'px';
				}
				var rollleft = arr[i].offsetLeft;
				if (times==30) {
					if (initLeft[i]==(length-1)*rollWidth) {
						initLeft[i]=-rollWidth;
					}
					arr[i].style.left = (initLeft[i]+rollWidth)+'px';
				}else{
					arr[i].style.left = (rollleft+rollWidth/30)+'px';
				}
			}
		}
	},1000/60);
}

//滑动
function rolling(arr, offsetarr, initx, curx){
	var rollx = curx-initx;
	var len = arr.length;
	var wid = arr[0].offsetWidth;
	for (var i = 0; i < len; i++) {
		if (offsetarr[i] == (len-1)*wid) {
			offsetarr[i] = -wid;
		}
		arr[i].style.left = (offsetarr[i]+rollx)+'px';
		//console.log((offsetarr[i]+rollx));
	}
}

//判断是否pc端
function IsPC()  
{  
           var userAgentInfo = navigator.userAgent;  
           var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
           var flag = true;  
           for (var v = 0; v < Agents.length; v++) {  
               if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
           }  
           return flag;  
} 
