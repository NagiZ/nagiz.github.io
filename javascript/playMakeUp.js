"use strict"
//背景画布当前状态标志 0为游戏初始界面  1为模式选择界面  2为关于界面  3为暂停界面 4为结束界面
 	var currentState = 0;

//游戏中用到的字符串
	var gameName = "球球大消除", startGame = "开始游戏", endGame = "结束游戏", about = "关于", mode1 = "限时模式", mode2 = "计时模式", mode, gover = "游戏结束", conGame = "继续游戏";
	var aboutUS = "闲来无事，做做毕设。反正也不知道该干啥，心慌慌。";
	var score = 0, totalScore = 0;//分数
	var time, tCount = 0;//计时
	var timeFlag = false;
	var timeId = null;

//渲染背景
	var div = document.getElementById('cantainer');
    var bground = document.getElementById('background');
    var bg = bground.getContext('2d');
    bground.addEventListener('mouseup', bgOnMouseUp, false);

//根据不同设备 调节画布大小 设置小球大小
	var mainWidth, mainHeight, bgroundWidth, bgroundHeight, ballRadius;
	function resizeCanvas() {
	if (screen.availWidth<800) {
		document.getElementById('cantainer').style.width = screen.availWidth + 'px';
		document.getElementById('cantainer').style.height = screen.availHeight + 'px';
        mainStage.style.width = screen.availWidth + 'px';
        mainStage.style.height = screen.availWidth*0.875 + 'px';
        //context.fillRect(0, 0, canvas.width(), canvas.height());
        bground.style.width = screen.availWidth + 'px';
        bground.style.height = screen.availWidth*0.875 + 'px';
		mainWidth = parseInt(mainStage.style.width);
		mainHeight = parseInt(mainStage.style.height);
		bgroundWidth = parseInt(bground.style.width);
		bgroundHeight = parseInt(bground.style.height);	   
	}else{
		mainWidth = 480;
		mainHeight = 420;
		bgroundWidth = 480;
		bgroundHeight = 420;
	}
	ballRadius = mainWidth/16;

};

//2017年3月8日17:40:25
//读取完毕，准备开始游戏界面	then 要完成，三个选项的点击效果  要解决第二层画布的点击问题，还没绘制，但是点击事件能触发  
//暂时的解决方法 用一个flag来标记游戏是否开始
//背景点击事件无法触发，猜测是z-index的问题 

    var isGameStart = 0;//判断是否开始
	var ballAll = [];
	function gameLoading(){
		//初始化
		console.log(ballRadius);
		console.log(mainWidth);
		currentState = 0;
		isPause = false;
		isEnd = false;
		timeId = null;
		tCount = 0;
		clearTimeout(time);
		timeFlag = false;
		mode = '';

    	for (var i = 0; i < 8; i++) {
    		ballAll[i] = [];
    		for (var j = 0; j < 7; j++) {
    			ballAll[i][j] = new Ball(i, j);
    		};
    	};

		mainContext.clearRect(0, 0, 480, 420);
		bg.fillStyle = 'black';
	    bg.fillRect(0,0,480,420);
	    bground.style.zIndex = 30;//背景位于主画布上方
	    bg.font = '60px Arial';
	    var bgNameGradient = bg.createLinearGradient(90, 120, 410, 180);
	    drawText(gameName, 90, 140, bg, bgNameGradient);


	    var bgStartGradient = bg.createLinearGradient(180, 220, 340, 220);
	    bg.font = '30px Arial';
	    drawText(startGame, 180, 220, bg, bgStartGradient);
	    drawText(about, 210, 270, bg, bgStartGradient);
	    drawText(endGame, 180, 320, bg, bgStartGradient);
	}
//背景画布绑定事件，选项点击效果
	function bgOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		//console.log(mouseX);
		//console.log(mouseY);
		if (currentState == 0) {
			if(mouseX >180&&mouseX<330&&mouseY>190&&mouseY<225){
			//进入模式选择界面
				currentState = 1;
				var modeGradient = bg.createLinearGradient(180, 0, 340, 0);
				bg.font = '40px Arial';
				pageSkip(bg, 0.5);
				drawText(mode1, 160, 170, bg, modeGradient);
				drawText(mode2, 160, 260, bg, modeGradient);
			}else if(mouseX>210&&mouseX<270&&mouseY>240&&mouseY<275){
				//a计入关于界面
				currentState = 2;
				pageSkip(bg, 0.5);
				var aboutGradient = bg.createLinearGradient(60, 0, 660, 0);
				bg.font = '40px Arial';
				var x = subStr(aboutUS, 40, bg, bground);
				for (var i = 0; i < x.length; i++) {
					drawText(x[i], 2*40, (i+4)*40, bg, aboutGradient);
				};
			}else if(mouseX>180&&mouseX<330&&mouseY>290&&mouseY<325){
				//结束游戏，关闭网页
				window.close();
			}
		}else if (currentState == 1) {//模式选择界面
			if (mouseX >160&&mouseX<320&&mouseY>130&&mouseY<175) {
				document.getElementById('score').style.display = "block";
				document.getElementById('playTime').style.display = "block";
				
				mode = mode1;//限时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0.5);
				gameStart();
				isGameStart = 1;

			}else if(mouseX >160&&mouseX<320&&mouseY>225&&mouseY<265){
				document.getElementById('score').style.display = "block";
				document.getElementById('playTime').style.display = "block";

				mode = mode2;//计时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0.5);
				gameStart();
				isGameStart = 1;

			}else{
				if(mouseX>0&&mouseX<480&&mouseY>0&&mouseY<420){
					currentState = 0;
					gameLoading();
				}
			}
			
		}else if (currentState == 2 ) {//about界面
			if(mouseX>0&&mouseX<480&&mouseY>0&&mouseY<420){
				currentState = 0;
				gameLoading();
			}
		}else if (currentState == 3) {//暂停界面
			if (mouseX >160&&mouseX<320&&mouseY>130&&mouseY<175) {
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				if (tCount<=60) {
					bground.style.zIndex = 0;
					pageSkip(bg, 0.5);
					timeCount();
					if(!dropBall()){
						ballAll[0][0].checkEliBall();
					}
				}
			}else if (mouseX >160&&mouseX<320&&mouseY>220&&mouseY<270) {
				//alert('123132');
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				bground.style.zIndex = 0;
				pageSkip(bg,0.5);
				gameOver();
			}
		}else if (currentState == 4) {
			if (mouseX>0&&mouseX<480&&mouseY>0&&mouseY<420) {
				window.location.reload(true);
			}
		}
	};

//初始化
	function init(){
		resizeCanvas();
		gameLoading();
	};

    function gameStart(){
    	isPause = false;
    	for (let i = 0; i < ballAll.length; i++) {
    		for (let j = 0; j < ballAll[i].length; j++) {
    			   /*clearTimeout(ballAll[i][j].timer);
    				ballAll[i][j].timer = setTimeout(function(){
    					ballAll[i][j].draw(mainContext);   					
    				},1000);*/
    				ballAll[i][j].draw(mainContext); 
			};
    				
    	};

    	score = 0;
    	totalScore = 0;

    	var ti;
    	clearTimeout(ti);
    	ti = setTimeout(function(){
				ballAll[0][0].checkEliBall();
				timeCount(tCount);
			},1000);	
    };
	document.getElementById('score').onclick = function(){
		if(confirm('确定结束游戏？')){
			gameOver();
			//window.close();
		}
		//gameOver();
	}

	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}