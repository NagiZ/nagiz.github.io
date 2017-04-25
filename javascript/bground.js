"use strict"
//背景画布当前状态标志 0为游戏初始界面  1为模式选择界面  2为关于界面  3为暂停界面 4为结束界面
 	var currentState = 0;

//游戏中用到的字符串
	var gameName = "星素消除", startGame = "开始游戏", endGame = "结束游戏", about = "关于", mode1 = "计时模式", mode2 = "限时模式", mode, gover = "游戏结束", conGame = "继续游戏";
	var aboutUS = "闲来无事，做做毕设。反正也不知道该干啥，心慌慌。";
	var score = 0, totalScore = 0;//分数
	var time, tCount = 0;//计时
	var timeFlag = false;
	var timeId = null;
//渲染背景
	var div = document.getElementById('cantainer');
    var bground = document.getElementById('background');
    var bg = bground.getContext('2d');
    if (screen.availWidth>600) {
    	bground.addEventListener('mouseup', bgOnMouseUp, false);
   		bground.addEventListener('mousemove', bgOnMouseMove, false);
   	}else{
   		bground.addEventListener('touchstart', bgTouchStart, false);
   		bground.addEventListener('touchmove', bgTouchMove, false);
   	}

//根据不同设备 调节画布大小 设置小球大小
	var mainWidth, mainHeight, bgroundWidth, bgroundHeight, ballRadius, pad;
	function resizeCanvas() {
	if (screen.availWidth<800) {
		document.getElementById('cantainer').style.width = window.innerWidth + 'px';
		document.getElementById('cantainer').style.height = window.innerWidth + 'px';
		document.getElementById('box').style.width = window.innerWidth + 'px';
		document.getElementById('box').style.height = window.innerWidth*0.875 + 'px'

		var buttonHeight = window.innerHeight - window.innerWidth*0.875;
		console.log(buttonHeight+":" +window.innerWidth*0.875+":" + window.innerHeight);

        mainStage.style.width = window.innerWidth + 'px';
        mainStage.style.height = window.innerWidth*0.875 + 'px';
        //context.fillRect(0, 0, canvas.width(), canvas.height());
        bground.style.width = window.innerWidth + 'px';
        bground.style.height = window.innerWidth*0.875 + 'px';
		mainWidth = parseInt(mainStage.style.width);
		mainHeight = parseInt(mainStage.style.height);
		bgroundWidth = parseInt(bground.style.width);
		bgroundHeight = parseInt(bground.style.height);	

		var subTop = mainHeight+buttonHeight*0.2+60;  

		document.getElementById('score').style.top = (mainHeight+20) + 'px';
		document.getElementById('score').style.left = 0;
		document.getElementById('score').style.width = 0.4*window.innerWidth + 'px';
		document.getElementById('score').style.height = buttonHeight*0.2+'px';
		document.getElementById('score').style.fontSize = 50+'px';

		document.getElementById('playTime').style.top = (mainHeight+20) + 'px';
		document.getElementById('playTime').style.right = 0;
		document.getElementById('playTime').style.width = 0.4*window.innerWidth + 'px';
		document.getElementById('playTime').style.height = buttonHeight*0.2+'px';
		document.getElementById('playTime').style.fontSize = 50+'px';

		document.getElementById('pauseGame').style.top = subTop + 'px';
		document.getElementById('pauseGame').style.left = 0;
		document.getElementById('pauseGame').style.width = 0.4*window.innerWidth + 'px';
		document.getElementById('pauseGame').style.height = buttonHeight*0.2+'px';
		document.getElementById('pauseGame').style.fontSize = 50+'px';

		document.getElementById('exit').style.right = 0;
		document.getElementById('exit').style.top = subTop + 'px';
		document.getElementById('exit').style.width = 0.4*window.innerWidth + 'px';
		document.getElementById('exit').style.height = buttonHeight*0.2+'px';
		document.getElementById('exit').style.fontSize = 50+'px';
	}else{
		mainWidth = 500;
		mainHeight = 440;
		bgroundWidth = 500;
		bgroundHeight = 440;
	}
	ballRadius = parseInt(mainWidth/16);
	pad = 0.02*mainWidth;

};

//2017年3月8日17:40:25
//读取完毕，准备开始游戏界面	then 要完成，三个选项的点击效果  要解决第二层画布的点击问题，还没绘制，但是点击事件能触发  
//暂时的解决方法 用一个flag来标记游戏是否开始
//背景点击事件无法触发，猜测是z-index的问题 

    var isGameStart = 0;//判断是否开始
	var ballAll = [];
	function gameLoading(){
		//初始化
		//console.log(ballRadius);
		//console.log(mainWidth);
		/*var loadingMusic = document.getElementById('loadingMusic');
		loadingMusic.src = "./music/loadingmusic.wav";
		loadingMusic.loop = true;
		loadingMusic.autoplay =true;*/

		currentState = 0;
		isPause = false;
		isEnd = false;
		timeId = null;
		loopPause = false;
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

		mainContext.clearRect(0, 0, 500, 440);
		/*bg.fillStyle = 'black';
	    bg.fillRect(0,0,500,440);*/
	    bground.style.zIndex = 30;//背景位于主画布上方
	    bg.font = '75px YouYuan';
	    var bgNameGradient = bg.createLinearGradient(100, 130, 420, 190);
	    drawText(gameName, 100, 150, bg, bgNameGradient);


	    var bgStartGradient = bg.createLinearGradient(190, 230, 350, 230);
	    bg.font = '30px Arial';
	    drawText(startGame, 190, 230, bg, bgStartGradient);
	    drawText(about, 220, 280, bg, bgStartGradient);
	    drawText(endGame, 190, 330, bg, bgStartGradient);
	}

//鼠标移入菜单高亮
	function bgOnMouseMove(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		if (currentState==0) {
			if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.472&&mouseY<mainHeight*0.556){
				pageSkip(bg, 190, 200, 130, 40);
				drawText(startGame, 190, 230, bg);
			}else if (mouseX>mainWidth*0.4575&&mouseX<mainWidth*0.5825&&mouseY>mainHeight*0.591&&mouseY<mainHeight*0.675) {
				pageSkip(bg, 220, 250, 70, 40);
				drawText(about, 220, 280, bg);
			}else if (mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.71&&mouseY<mainHeight*0.794) {
				pageSkip(bg, 190, 300, 130, 40);
				drawText(endGame, 190, 330, bg);
			}else{
				pageSkip(bg, 190, 200, 130, 50);
				pageSkip(bg, 220, 250, 70, 50);
				pageSkip(bg, 180, 300, 130, 50);
				var bgStartGradient = bg.createLinearGradient(190, 230, 350, 230);
				drawText(startGame, 190, 230, bg, bgStartGradient);
	    		drawText(about, 220, 280, bg, bgStartGradient);
	    		drawText(endGame, 190, 330, bg, bgStartGradient);
			}

		}else if (currentState==1) {
			if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437){
				pageSkip(bg, 180, 155, 180, 65);
				drawText(mode1, 170, 180, bg);
			}else if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.556&&mouseY<mainHeight*0.651) {
				pageSkip(bg, 170, 235, 170, 55);
				drawText(mode2, 170, 270, bg);
			}else{
				pageSkip(bg, 170, 145, 170, 55);
				pageSkip(bg, 170, 235, 170, 55);
				var modeGradient = bg.createLinearGradient(190, 0, 350, 0);
				drawText(mode1, 170, 180, bg, modeGradient);
				drawText(mode2, 170, 270, bg, modeGradient);
			}

		}else if (currentState==3) {
			var pauseGradient = bg.createLinearGradient(190, 0, 350, 0);
			if(mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437){
				pageSkip(bg, 170, 145, 170, 55, 0.5, 1);
				drawText(conGame, 170, 180, bg, pauseGradient);
			}else if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.544&&mouseY<mainHeight*0.663) {
				pageSkip(bg, 170, 235, 170, 55, 0.5, 1);
				drawText(endGame, 170, 270, bg, pauseGradient);
			}else{
				pageSkip(bg, 170, 145, 170, 55, 0.5, 1);
				pageSkip(bg, 170, 235, 170, 45, 0.5, 1);
				
				drawText(conGame, 170, 180, bg);
				drawText(endGame, 170, 270, bg);
			}
		}
	}

	function bgTouchMove(e){
		e = event||window.event;
		e.preventDefault();
		var mouseX = e.touches[0].pageX-div.offsetLeft;
		var mouseY = e.touches[0].pageY-div.offsetTop;
		if (currentState==0) {
			if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.472&&mouseY<mainHeight*0.556){
				pageSkip(bg, 190, 200, 130, 40);
				drawText(startGame, 190, 230, bg);
			}else if (mouseX>mainWidth*0.4575&&mouseX<mainWidth*0.5825&&mouseY>mainHeight*0.591&&mouseY<mainHeight*0.675) {
				pageSkip(bg, 220, 250, 70, 40);
				drawText(about, 220, 280, bg);
			}else if (mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.71&&mouseY<mainHeight*0.794) {
				pageSkip(bg, 190, 300, 130, 40);
				drawText(endGame, 190, 330, bg);
			}else{
				pageSkip(bg, 190, 200, 130, 50);
				pageSkip(bg, 220, 250, 70, 50);
				pageSkip(bg, 180, 300, 130, 50);
				var bgStartGradient = bg.createLinearGradient(190, 230, 350, 230);
				drawText(startGame, 190, 230, bg, bgStartGradient);
	    		drawText(about, 220, 280, bg, bgStartGradient);
	    		drawText(endGame, 190, 330, bg, bgStartGradient);
			}

		}else if (currentState==1) {
			if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437){
				pageSkip(bg, 180, 155, 180, 65);
				drawText(mode1, 170, 180, bg);
			}else if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.556&&mouseY<mainHeight*0.651) {
				pageSkip(bg, 170, 235, 170, 55);
				drawText(mode2, 170, 270, bg);
			}else{
				pageSkip(bg, 170, 145, 170, 55);
				pageSkip(bg, 170, 235, 170, 55);
				var modeGradient = bg.createLinearGradient(190, 0, 350, 0);
				drawText(mode1, 170, 180, bg, modeGradient);
				drawText(mode2, 170, 270, bg, modeGradient);
			}

		}else if (currentState==3) {
			var pauseGradient = bg.createLinearGradient(190, 0, 350, 0);
			if(mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437){
				pageSkip(bg, 170, 145, 170, 55, 0.5, 1);
				drawText(conGame, 170, 180, bg, pauseGradient);
			}else if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.544&&mouseY<mainHeight*0.663) {
				pageSkip(bg, 170, 235, 170, 55, 0.5, 1);
				drawText(endGame, 170, 270, bg, pauseGradient);
			}else{
				pageSkip(bg, 170, 145, 170, 55, 0.5, 1);
				pageSkip(bg, 170, 235, 170, 45, 0.5, 1);
				
				drawText(conGame, 170, 180, bg);
				drawText(endGame, 170, 270, bg);
			}
		}
	}
//背景画布绑定事件，选项点击效果
	function bgOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		//console.log(mouseX);
		//console.log(mouseY);
		if (currentState == 0) {
			if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.472&&mouseY<mainHeight*0.556){
			//进入模式选择界面
				currentState = 1;
				var modeGradient = bg.createLinearGradient(190, 0, 350, 0);
				bg.font = '40px Arial';
				pageSkip(bg, 0, 0, 500, 440);
				drawText(mode1, 170, 180, bg, modeGradient);
				drawText(mode2, 170, 270, bg, modeGradient);
			}else if(mouseX>mainWidth*0.4575&&mouseX<mainWidth*0.5825&&mouseY>mainHeight*0.591&&mouseY<mainHeight*0.675){
				//a计入关于界面
				currentState = 2;
				pageSkip(bg, 0, 0, 500, 440, 0.5);
				var aboutGradient = bg.createLinearGradient(70, 0, 450, 0);
				bg.font = '40px Arial';
				var x = subStr(aboutUS, 40, bg, bground);
				for (var i = 0; i < x.length; i++) {
					drawText(x[i], 2*40, (i+4)*40, bg, aboutGradient);
				};
			}else if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.71&&mouseY<mainHeight*0.794){
				//结束游戏，关闭网页
				window.close();
			}
		}else if (currentState == 1) {//模式选择界面
			if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437) {
				document.getElementById('score').style.display = "block";
				document.getElementById('playTime').style.display = "block";
				
				mode = mode1;//限时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameStart();
				isGameStart = 1;

			}else if(mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.556&&mouseY<mainHeight*0.651){
				document.getElementById('score').style.display = "block";
				document.getElementById('playTime').style.display = "block";

				mode = mode2;//计时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameStart();
				isGameStart = 1;

			}else{
				if(mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight){
					currentState = 0;
					pageSkip(bg, 0, 0, 500, 440);
					gameLoading();
				}
			}
			
		}else if (currentState == 2 ) {//about界面
			if(mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight){
				currentState = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameLoading();
			}
		}else if (currentState == 3) {//暂停界面
			if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437) {
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				loopPause = ~loopPause;
				if (tCount<=60) {
					//继续背景音乐
					var bgMusic = document.getElementById("bgMusic");
					exit.addEventListener('click', playEnd, false);
					//var curTime = bgMusic.currentTime;
					bgMusic.play();

					bground.style.zIndex = 0;
					pageSkip(bg, 0, 0, 500, 440);
					loop();
					timeCount();
					if(!dropBall()){
						ballAll[0][0].checkEliBall();
					}
				}
			}else if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.544&&mouseY<mainHeight*0.663) {
				//alert('123132');
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				loopPause = ~loopPause;
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440, 0.5);
				gameOver();
			}
		}else if (currentState == 4) {
			if (mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight) {
				window.location.reload(true);
			}
		}
	};

	function bgTouchStart(e){
		e = event||window.event;
		var mouseX = e.touches[0].pageX-div.offsetLeft;
		var mouseY = e.touches[0].pageY-div.offsetTop;
		//console.log(mouseX);
		//console.log(mouseY);
		if (currentState == 0) {
			if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.472&&mouseY<mainHeight*0.556){
			//进入模式选择界面
				currentState = 1;
				var modeGradient = bg.createLinearGradient(190, 0, 350, 0);
				bg.font = '40px Arial';
				pageSkip(bg, 0, 0, 500, 440);
				drawText(mode1, 170, 180, bg, modeGradient);
				drawText(mode2, 170, 270, bg, modeGradient);
			}else if(mouseX>mainWidth*0.4575&&mouseX<mainWidth*0.5825&&mouseY>mainHeight*0.591&&mouseY<mainHeight*0.675){
				//a计入关于界面
				currentState = 2;
				pageSkip(bg, 0, 0, 500, 440, 0.5);
				var aboutGradient = bg.createLinearGradient(70, 0, 450, 0);
				bg.font = '40px Arial';
				var x = subStr(aboutUS, 40, bg, bground);
				for (var i = 0; i < x.length; i++) {
					drawText(x[i], 2*40, (i+4)*40, bg, aboutGradient);
				};
			}else if(mouseX >mainWidth*0.365&&mouseX<mainWidth*0.6575&&mouseY>mainHeight*0.71&&mouseY<mainHeight*0.794){
				//结束游戏，关闭网页
				window.close();
			}
		}else if (currentState == 1) {//模式选择界面
			if (mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437) {
				
				mode = mode1;//限时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameStart();
				isGameStart = 1;

			}else if(mouseX >mainWidth*0.401&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.556&&mouseY<mainHeight*0.651){
				
				mode = mode2;//计时模式
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameStart();
				isGameStart = 1;

			}else{
				if(mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight){
					currentState = 0;
					pageSkip(bg, 0, 0, 500, 440);
					gameLoading();
				}
			}
			
		}else if (currentState == 2 ) {//about界面
			if(mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight){
				currentState = 0;
				pageSkip(bg, 0, 0, 500, 440);
				gameLoading();
			}
		}else if (currentState == 3) {//暂停界面
			if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.330&&mouseY<mainHeight*0.437) {
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				loopPause = ~loopPause;
				if (tCount<=60) {
					//继续背景音乐
					var bgMusic = document.getElementById("bgMusic");
					exit.addEventListener('click', playEnd, false);
					//var curTime = bgMusic.currentTime;
					bgMusic.play();

					bground.style.zIndex = 0;
					pageSkip(bg, 0, 0, 500, 440);
					timeCount();
					loop();
					if(!dropBall()){
						ballAll[0][0].checkEliBall();
					}
				}
			}else if (mouseX >mainWidth*0.354&&mouseX<mainWidth*0.687&&mouseY>mainHeight*0.544&&mouseY<mainHeight*0.663) {
				//alert('123132');
				timeFlag = ~timeFlag;
				isPause = ~isPause;
				loopPause = ~loopPause;
				bground.style.zIndex = 0;
				pageSkip(bg, 0, 0, 500, 440, 0.5);
				gameOver();
			}
		}else if (currentState == 4) {
			if (mouseX>0&&mouseX<mainWidth&&mouseY>0&&mouseY<mainHeight) {
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
    	//载入音乐
    	var loadingMusic = document.getElementById('loadingMusic');
    	var bgMusic = document.getElementById("bgMusic");

    	//显示分数、时间、暂停和结束游戏按钮
    	document.getElementById('score').style.display = "block";
		document.getElementById('playTime').style.display = "block";
		document.getElementById('pauseGame').style.display = "block";
		document.getElementById('exit').style.display = "block";

		loadingMusic.src = "";
		/*loadingMusic.loop = false;
		loadingMusic.autoplay = false;*/
    	
    	/*bgMusic.src = "./music/bgmusic.wav";
    	bgMusic.loop = true;
    	bgMusic.autoplay = true;*/
    	bgMusic.play();

    	score = 0;
    	totalScore = 0;

    	var ti;
    	clearTimeout(ti);
    	ti = setTimeout(function(){
				ballAll[0][0].checkEliBall();
				timeCount(tCount);
			},1000);	
    };
	