//最近一次更新 2017年3月7日11:26:30： 初步完成颜色交换和重绘模块；
//渲染数组
	var fillColor = ['red','green','blue','pink','orange','yellow','purple'];
	var colorChosen = '';

//背景画布当前状态标志 0为游戏初始界面  1为模式选择界面  2为关于界面  3为暂停界面 4为结束界面
 	var currentState = 0;

//游戏中用到的字符串
	var gameName = "球球大消除", startGame = "开始游戏", endGame = "结束游戏", about = "关于", mode1 = "限时模式", mode2 = "计时模式";	
	var aboutUS = "闲来无事，做做毕设。反正也不知道该干啥，心慌慌。";

//随机选取颜色
    function colorSelcet(arr){
    	var colorIndex = 0;
    	colorIndex = Math.floor(Math.random()*6); 
    	return arr[colorIndex];
    };

//渲染背景
	var div = document.getElementById('cantainer');
    var bground = document.getElementById('background');
    var bg = bground.getContext('2d');
    bground.addEventListener('mouseup', bgOnMouseUp, false);

//2017年3月8日17:40:25
//读取完毕，准备开始游戏界面	then 要完成，三个选项的点击效果  要解决第二层画布的点击问题，还没绘制，但是点击事件能触发  
//暂时的解决方法 用一个flag来标记游戏是否开始
//背景点击事件无法触发，猜测是z-index的问题 

    var isGameStart = 0;//判断是否开始

	function gameLoading(){
		mainContext.clearRect(0, 0, 720, 480);
	    bg.fillRect(0,0,720,480);
	    bground.style.zIndex = 30;//背景位于主画布上方
	    bg.font = '60px Arial';
	    var bgNameGradient = bg.createLinearGradient(210, 150, 510, 210);
	    drawText(gameName, 210, 170, bg, bgNameGradient);

	   /* bg.beginPath();
	    bg.fillStyle = bgNameGradient;
	    bg.strokeStyle = 'pink';
	    bg.fillText(startStr, 210, 170);
	    bg.strokeText(startStr, 210, 170);
	    bg.closePath();*/

	    var bgStartGradient = bg.createLinearGradient(280, 250, 440, 250);
	    bg.font = '30px Arial';
	    drawText(startGame, 280, 250, bg, bgStartGradient);
	    drawText(about, 310, 300, bg, bgStartGradient);
	    drawText(endGame, 280, 350, bg, bgStartGradient);
	    /*bg.beginPath();
	    
	    bg.fillStyle = bgStartGradient;
	    bg.strokeStyle = 'green';
	    bg.fillText(startGame, 280, 250);
	    bg.strokeText(startGame, 280, 250);

	    bg.fillText(about, 310, 300);
	    bg.strokeText(about, 310, 300);

	    bg.fillText(endGame, 280, 350);
	    bg.strokeText(endGame, 280, 350);
	    bg.closePath();*/

	}

//背景画布绑定事件，选项点击效果
	function bgOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		//console.log(mouseX);
		//console.log(mouseY);
		if (currentState == 0) {
			if(mouseX >280&&mouseX<430&&mouseY>220&&mouseY<250){
			//进入模式选择界面
				currentState = 1;
				var modeGradient = bg.createLinearGradient(280, 0, 440, 0);
				bg.font = '40px Arial';
				pageSkip(bg);
				drawText(mode1, 280, 180, bg, modeGradient);
				drawText(mode2, 280, 300, bg, modeGradient);
			}else if(mouseX>310&&mouseX<400&&mouseY>270&&mouseY<300){
				//a计入关于界面
				pageSkip(bg);
				var x = bg.measureText(aboutUS);
				console.log(aboutUS.charAt(3));
				//drawText();
			}else if(mouseX>280&&mouseX<430&&mouseY>320&&mouseY<350){
				//结束游戏，关闭网页
				window.close();
			}
		}else if (currentState == 1) {
			if (mouseX >280&&mouseX<440&&mouseY>140&&mouseY<185) {
				document.getElementsByTagName('p')[0].style.display = "block";
				mode = mode1;
				bground.style.zIndex = 0;
				pageSkip(bg);
				gameStart();
				isGameStart = 1;
			}else if(mouseX >280&&mouseX<440&&mouseY>265&&mouseY<305){
				document.getElementsByTagName('p')[0].style.display = "block";
				bground.style.zIndex = 0;
				pageSkip(bg);
				gameStart();
				isGameStart = 1;
			}
			/*console.log(mouseX);
			console.log(mouseY);*/
		}
	};


//创建小球对象
    var Ball = function(indexX, indexY){
    	this.indexX = indexX;
    	this.indexY = indexY;	
    	this.startAngle = 0;
    	this.endAngle = 2*Math.PI;
    	this.x = indexX*60+30;
    	this.y = indexY*60+30;
    	this.radius = 30;
    	this.color = colorSelcet(fillColor);
    };

//渲染小球
	var mainStage = document.getElementById('main_stage');
	var mainContext = mainStage.getContext('2d');
	mainContext.lineWidth = 1;
	function drawMain(color, x, y){

	};
    
    var ballAll = [];
    for (var i = 0; i < 12; i++) {
    	ballAll[i] = [];
    	for (var j = 0; j < 8; j++) {
    		ballAll[i][j] = new Ball(i, j);
    	};
    };
    Ball.prototype.draw = function(ctx){
    	ctx.save();
    	ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    	//ctx.clip();
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.restore();
    };


//绑定鼠标事件
	mainStage.addEventListener('mouseup', mainOnMouseUp, false);

//检测两个小球是否相邻
  function checkNearBall(ball1, ball2){
  	return (ball1.indexX-ball2.indexX===1&&ball1.indexY-ball2.indexY===0)||(ball1.indexX-ball2.indexX===-1&&ball1.indexY-ball2.indexY===0)||(ball1.indexX-ball2.indexX===0&&ball1.indexY-ball2.indexY===1)||(ball1.indexX-ball2.indexX===0&&ball1.indexY-ball2.indexY===-1);
  }

//点击两个小球，交换颜色
	var index = {} ,tag = 0;//index用来存储第一次点击的球的颜色， tag用于判断第几次点击
	function mainOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		//console.log(mouseX);
	    /*var x = Math.floor(mouseX/60);
		var y = Math.floor(mouseY/60);
		clear(mainContext, x, y);*/
		if(isGameStart===1){
			if (tag == 0) {
				tag = 1;
				index.x = Math.floor(mouseX/60);
				index.y = Math.floor(mouseY/60);
			}else if (tag == 1) {
				tag = 0;
				var trans = {};
				trans.x = Math.floor(mouseX/60);
				trans.y = Math.floor(mouseY/60);
				//test
				//console.log(ballAll[index.x][index.y].color);
				//console.log(ballAll[trans.x][trans.y].color);
				var color = ballAll[index.x][index.y].color;
				if (checkNearBall(ballAll[index.x][index.y], ballAll[trans.x][trans.y])&&color!==ballAll[trans.x][trans.y].color) {				
					ballAll[index.x][index.y].color = ballAll[trans.x][trans.y].color;
					ballAll[trans.x][trans.y].color = color;
					//console.log('after');
					//console.log(ballAll[index.x][index.y].color);
					//console.log(ballAll[trans.x][trans.y].color);
					reDraw(mainContext, ballAll[index.x][index.y]);
					reDraw(mainContext, ballAll[trans.x][trans.y]);
					//console.log('exchange');
				}
			}
		}	
		/* ballAll = [];
         for (var i = 0; i < 12; i++) {
    	 ballAll[i] = [];
    	 for (var j = 0; j < 8; j++) {
    		ballAll[i][j] = new Ball(i, j);
    	};
    };
    gameStart();*/
	}

//重绘交换后的小球 2017年3月7日11:26:06
	function reDraw(ctx, ball){
		ctx.save();
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, ball.startAngle, ball.endAngle);
		ctx.fillStyle = ball.color;
		ctx.fill()
		ctx.restore();
	}

//测试用的消除模块【待改进】
	function clear(ctx, x, y){
		ctx.clearRect(60*x, 60*y, 60, 60);
	}

	function display(){
		for (var i = 0; i < ballAll.length-2; i++) {
			for (var j = 0; j < ballAll[i].length; j++) {
				if (ballAll[i+1][j].color==ballAll[i+1][j].color&&ballAll[i+1][j].color==ballAll[i+2][j].color) {
					clear(mainContext, i, j);
					clear(mainContext, i+1, j);
					clear(mainContext, i+2, j);
				}
			}
		}
	}


//初始化
	function init(){
		gameLoading();
	};

    function gameStart(){
    	for (let i = 0; i < ballAll.length; i++) {
    		for (let j = 0; j < ballAll[i].length; j++) {
    				var timer1 = setTimeout(function(){
    					ballAll[i][j].draw(mainContext);
    				},1000)
			};
    				
    	};
    };
	/*function drawInit(){
		mainContext.save();
		for (var i = 0; i < 12; i++) {
			for (var j = 0; j < 8; j++) {
				colorChosen = colorSelcet(fillColor);
				mainContext.beginPath();
				mainContext.arc(60*i+30, 60*j+30 , 28, 0, 2*Math.PI);
				mainContext.fillStyle = colorChosen;
				mainContext.fill();
				//mainContext.stroke();
			};
		};
		mainContext.restore();
	};
	function init(){
		var timer = setInterval(drawInit,1000);
	};*/
	document.getElementsByTagName('p')[0].onclick = function(){
		window.close();
	}