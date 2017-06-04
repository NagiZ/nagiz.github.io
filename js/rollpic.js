		var screenWidth = screen.width;
		window.onload = function(){
			var picDiv = document.getElementById("picDiv");
			var imgs = picDiv.getElementsByTagName("img");
			if (screenWidth<500) {
				picDiv.className = "picD_sub";
				picDiv.style.height = imgs[0].offsetHeight+'px';
				for (var i = 0; i < imgs.length; i++) {
					imgs[i].className = "rollpic_sub";
				}
			}
			for (var i = 0; i < imgs.length; i++) {
				imgs[i].style.left = i*imgs[0].offsetWidth+'px';
			}
			var rollTimes = 0,timer;//图片滚动次数，定时滚动定时器
			var tag = 0;//是否按下左键
			var initX = null, direction;//滚动方向标记
			timer = setInterval(function cycle(){
				rolling(imgs,rollTimes,"left");
			},2000);

			//鼠标悬停在图片上则停止轮播
			picDiv.onmouseover = function(){
				clearInterval(timer);
			}
			picDiv.onmouseout = function(){
				timer = setInterval(function cycle(){
					rolling(imgs,rollTimes,"left");
				},5000);	
			}

			//左键按下则开始监听方面
			picDiv.onmousedown = function(){
			initX = null;
			tag = 1;
			}
			picDiv.onmouseup = function(){
				tag = 0;
				initX = null;
				console.log(tag);
			}
			//判断鼠标拖动方向
			picDiv.onmousemove = function(e){
				if (!tag) {
					return;
				}
				var curX = e.pageX;
				if (initX==null) {
					initX = curX;
					return;
				}
				if(curX>initX){//右
					direction = "right";
					rolling(imgs, rollTimes,"right");
				}else if (curX<initX) {//左
					direction = "left";
					rolling(imgs, rollTimes,"left");
				}
				tag = 0;
			}
			//窗口失焦则停止滚动
			window.onblur = function(){
				clearInterval(timer);
			}
			window.onfocus = function(){
				timer = setInterval(function cycle(){
					rolling(imgs,rollTimes,"left");
				},5000);	
			}
			//窗口resize
		}
		//图片轮播
		function rolling(arr, times, direction){
			var timer = null;
			var length = arr.length;
			clearInterval(timer);
			var rollWidth = arr[0].offsetWidth;
			var initLeft = [];
			for (var i = 0; i < arr.length; i++) {
				initLeft.push(arr[i].offsetLeft);
			}
			timer = setInterval(function(){
				/*divs.onmouseover=function(){
					clearInterval(timer);
				}*/
				if (times>=50) {//左移50次，刚好是一张图片的宽度
					return false;
				}
				times++;
				for (var i = 0; i < length; i++) {
					if (direction=="left") {
						var rollleft = arr[i].offsetLeft;
						if (times==50) {
							arr[i].style.left = (initLeft[i]-rollWidth)+'px';
						}else{
							arr[i].style.left = (rollleft-rollWidth/50)+'px';
						}
						if (arr[i].offsetLeft==(1-length)*rollWidth) {
							arr[i].style.left = rollWidth+'px';
						}
					}else{	
						if (arr[i].offsetLeft==(length-1)*rollWidth) {
							arr[i].style.left = (-1)*rollWidth+'px';
						}
						var rollleft = arr[i].offsetLeft;
						arr[i].style.left = (rollleft+rollWidth/50)+'px';
					}
				}
			},1000/60);
		}