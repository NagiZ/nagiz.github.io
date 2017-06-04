'use strict'
//屏幕宽度
var screenWidth = screen.width;
//滚动完成标记
var finroll = 1;

window.onload = function(){
	var picDiv = document.getElementById("picDiv");
	var imgs = picDiv.getElementsByTagName("img");
	var devJud = IsPC();
	if (!devJud) {
		picDiv.style.height = imgs[0].offsetHeight+'px';
		for (var i = 0; i < imgs.length; i++) {
			imgs[i].className = "rollpic_sub";
		}
	}
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].style.left = i*imgs[0].offsetWidth+'px';
		imgs[i].ondragstart = function(){
			return false;
		}
	}
	var timer;//图片滚动次数，定时滚动定时器
	var tag = 0;//是否按下左键
	var initX = null, direction;//滚动方向标记
	/*timer = setInterval(function (){
		rolling(imgs, "left");
	},2000);*/
	timer = setTimeout(function cycle(){
		rolling(imgs,"left");
		timer = setTimeout(cycle, 2000);
	},2000);

	if (!devJud) {
		//clearInterval(timer);
		picDiv.addEventListener("touchstart", touchs, false);
		picDiv.addEventListener("touchend", touche, false);
		picDiv.addEventListener("touchmove", touchm, false);
	}else{
		//鼠标悬停在图片上则停止轮播
		picDiv.onmouseover = function(){
			//clearInterval(timer);
			clearTimeout(timer);
		}
		picDiv.onmouseout = function(){
			/*timer = setInterval(function cycle(){
				rolling(imgs, "left");
			},2000);	*/
			timer = setTimeout(function cycle(){
				rolling(imgs,"left");
				timer = setTimeout(cycle, 2000);
			},2000);

		}

		//左键按下则开始监听
		picDiv.onmousedown = function(){
			//clearInterval(timer);
			initX = null;
			tag = 1;
		}
		picDiv.onmouseup = function(){
			tag = 0;
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
			if (initX==null) {
				initX = curX;
				return;
			}
			if(curX>initX){//右
				direction = "right";
				rolling(imgs, direction);
			}else if (curX<initX) {//左
				direction = "left";
				rolling(imgs, direction);
			}
			tag = 0;
		}
	}
	//触屏
	function touchs(e){
		clearTimeout(timer);
		initX = null;
		tag = 1;
	}

	function touche(){
		tag = 0;
		initX = null;
		timer = setTimeout(function cycle(){
			if (finroll) {
				rolling(imgs,"left");
			}
			timer = setTimeout(cycle, 2000);
		},2000);
	}

	function touchm(e){
		timer = 0;
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
			console.log('No!');
			return false;
		}
		var curX = e.touches[0].pageX;
		var curY = e.touches[0].pageY
		if (curY<picDiv.offsetHeight) {
			if (initX==null) {
				initX = curX;
				return;
			}
			if(curX>initX){//右
				direction = "right";
				rolling(imgs, direction);
			}else if (curX<initX) {//左
				direction = "left";
				rolling(imgs, direction);
			}
		}
		tag = 0;
	}

	//窗口失焦则停止滚动
	window.onblur = function(){
		//clearInterval(timer);
		clearTimeout(timer);
	}
	window.onfocus = function(){
		/*timer = setInterval(function cycle(){
			rolling(imgs, "left");
		},5000);	*/
		timer = setTimeout(function cycle(){
			rolling(imgs,"left");
			timer = setTimeout(cycle, 2000);
		},2000);
	}
	//窗口resize
}


//图片轮播
function rolling(arr, direction){
	finroll = 0;
	var timer = null;
	var times = 0;
	var length = arr.length;
	clearInterval(timer);
	var rollWidth = arr[0].offsetWidth;
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
				if (arr[i].offsetLeft==(1-length)*rollWidth) {
					arr[i].style.left = rollWidth+'px';
				}
			}else{	
				if (arr[i].offsetLeft==(length-1)*rollWidth) {
					arr[i].style.left = (-1)*rollWidth+'px';
				}
				var rollleft = arr[i].offsetLeft;
				if (times==30) {
					if (initLeft[i]==2*rollWidth) {
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
