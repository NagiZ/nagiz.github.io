//最近一次更新 2017年3月7日11:26:30： 初步完成颜色交换和重绘模块；
//渲染数组
	var fillColor = ['red','green','blue','pink','orange'];
	var colorChosen = '';

	var movable;

//随机选取颜色
    function colorSelcet(arr){
    	var colorIndex = 0;
    	colorIndex = Math.floor(Math.random()*4); 
    	return arr[colorIndex];
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
    	this.alpha = 1;//判断是否要消失
    	this.isFade = 0;
    };

//渲染小球
	var mainStage = document.getElementById('main_stage');
	var mainContext = mainStage.getContext('2d');
	mainContext.lineWidth = 1;
	function drawMain(color, x, y){

	};
    
    var ballAll = [];
    for (var i = 0; i < 8; i++) {
    	ballAll[i] = [];
    	for (var j = 0; j < 7; j++) {
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
  	Ball.prototype.checkNearBall = function(ball1, ball2){
  		return (ball1.indexX-ball2.indexX===1&&ball1.indexY-ball2.indexY===0)||(ball1.indexX-ball2.indexX===-1&&ball1.indexY-ball2.indexY===0)||(ball1.indexX-ball2.indexX===0&&ball1.indexY-ball2.indexY===1)||(ball1.indexX-ball2.indexX===0&&ball1.indexY-ball2.indexY===-1);
 	}

 //点击改变透明度
 	Ball.prototype.changeAlpha = function(){
 		clearTimeout(this.opc);
 		this.alpha -= 0.1;
	 	if (this.alpha>0&&this.isFade==1) {
	 		var that = this;
	 		reDraw(mainContext, this);
	 		this.opc = setTimeout(function(){
	 			that.changeAlpha(); 
	 		},50);
	 	}
	 	if(this.alpha<=0){
	 		this.alpha = 0;
	 	}
    }

//点击两个小球，交换颜色
	var index = {} ,tag = 0;//index用来存储第一次点击的球的颜色， tag用于判断第几次点击
	function mainOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft;
		var mouseY = e.pageY-div.offsetTop;
		if(isGameStart===1){
			if (tag == 0) {
				tag = 1;
				index.x = Math.floor(mouseX/60);
				index.y = Math.floor(mouseY/60);
				console.log(tag);
			}else if (tag == 1) {
				tag = 0;
				var trans = {};
				trans.x = Math.floor(mouseX/60);
				trans.y = Math.floor(mouseY/60);
				if (ballAll[index.x][index.y].alpha> 0) {
					var firball = ballAll[index.x][index.y];
					var secball = ballAll[trans.x][trans.y];
					if (secball.checkNearBall(firball, secball)&&firball.color!==secball.color&&secball.alpha>0) {	
						//firball.changeAlpha();
						//secball.changeAlpha();	//setTimeout独立挂起，被放在最后执行。理论上应该消失的，但是重绘了alpha为1的情况。待解	
						exchangeColor(firball, secball);
						console.log(firball.checkEliBall());
						if((firball.checkEliBall()||secball.checkEliBall())&&(firball.isFade == 1||secball.isFade == 1)){
							reDraw(mainContext, firball);
							reDraw(mainContext, secball);
						}else{
							exchangeColor(firball, secball);
							//console.log(ballAll[5][5]);
						}
					}
				}
			}
		}	
	}

//遍历小球数组，若消失flag=1，则上方小球下落
//点击小球，并不按预想情况执行
//第一行总会被消除,len下限设置的问题
//循环调用dropBall函数，如果没有设置触发条件，会一直运行该函数
//设置触发条件，必须将判断是否满足消除条件的函数设置为返回布尔值，满足为true，否则为false。对disappear函数进行拆分改动
//下落模块，下落速度有问题
    var tr, t, tc;//时钟
	function dropBall(){
		clearTimeout(tr);
		var len = 0, firstFade = false; 
		for (var i = 0; i < ballAll.length; i++) {
			firstFade = false;
			for (var j = ballAll[i].length-1; j >= 0; j--) {
				var ba = ballAll[i][j];
				if (!firstFade&&ba.isFade) {
					firstFade = true;
					len = j;
				}else if (!ba.isFade&&firstFade&&ba.alpha>0) {
					ballAll[i][len].alpha = ba.alpha;
					ballAll[i][len].color = ba.color;
					ballAll[i][len].isFade = 0;
					reDraw(mainContext, ballAll[i][len]);
					len--;
				}
				if (j==0&&len>=0&&mode==mode1&&firstFade==true) {
					for (var k = len; k >= 0; k--) {
						ballAll[i][k].color = 'black';
						ballAll[i][k].alpha = 0;
						clear(mainContext, i, k);
					}
				}else if(j==0&&len>=0&&mode==mode2){
					while(len>=0&&firstFade==true){
						//console.log(len);
						ballAll[i][len] = null;
						ballAll[i][len] = new Ball(i, len);
						reDraw(mainContext, ballAll[i][len]);
						len--;
					}
				}
			}
		}

		for (var i = 0; i < ballAll.length; i++) {
			for(var j = ballAll[i].length-1; j>=0; j--){
				if(skidding(ballAll[i][j])){
					dropBall();
				};
			};
		};
		tr = setTimeout(function(){
			for (var i = 0; i < ballAll.length; i++) {
				for (var j = 0; j < ballAll[j].length; j++) {
					clearTimeout(ballAll[i][j].opc);
				}
			}
			ballAll[0][0].checkEliBall();
			//console.log('x');
		}, 100);
	}

	function Te(){
		clearTimeout(t);
		movable = 0;
		for (var i = 0; i <ballAll.length; i++) {
			for (var j = ballAll[i].length-1 ; j >= 0; j--) {
				if (ballAll[i][j].isFade) {
					ballAll[i][j].changeAlpha();
				}
				if (i==7&&j==0) {
					t = setTimeout(function(){
						dropBall();
					}, 1000);
				}
			}
		}
		//console.log('why repeat');
	}



//重绘交换后的小球 2017年3月7日11:26:06
	function reDraw(ctx, ball){
		clear(ctx, ball.indexX, ball.indexY);
		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = ball.alpha;
		ctx.lineWidth = 3;
		ctx.arc(ball.x, ball.y, ball.radius, ball.startAngle, ball.endAngle);
		ctx.fillStyle = ball.color;
		ctx.fill();
		ctx.restore();
	}

//测试用的消除模块【待改进】

//标记满足消除条件的同色小球

	Ball.prototype.checkBall = function(x, y, count, direction){
		if(count>=3){
			while(count>0){
				var eliBall = direction == "y"?ballAll[x][y-count]:ballAll[x-count][y];
				eliBall.isFade = 1;
				count--;
			}
			return true;
		}
		return false;
	}

//检测相同颜色小球的长度
//判断貌似有问题，无论全局检查能否消除，最后canEli都是true，待解
	function clear(ctx, x, y){
		ctx.clearRect(60*x, 60*y, 60, 60);
	}

	Ball.prototype.checkEliBall = function(){
		var canEli = false;
		//console.log(canEli);
		var eliCount;
		for (var i = 0; i < ballAll.length; i++) {
			eliCount = 0;
			var color;
			var k = 0;
			var startBall = 0;
			if (ballAll[i][6].color!='black'&&ballAll[i][6].alpha==1) {
				for(k=0; k<ballAll[i].length;k++){
					if (ballAll[i][k].alpha<=0||ballAll[i][k].color == 'black') {
						startBall++;
					}
				}
			}
			//console.log(startBall+'row');
			color = ballAll[i][startBall].color;

			for (var j = startBall; j < ballAll[i].length; j++) {
				var thisBall = ballAll[i][j];
				//颜色相同，长度加1
				if (thisBall.color == color) {
					eliCount++;
					//到底部，直接检测
					if (j == ballAll[i].length-1&&thisBall.checkBall(i, j+1, eliCount, 'y')) {
						canEli = true;
						//Te();
					}
				}else{
					//能消除
					if(thisBall.checkBall(i, j , eliCount, 'y')){
						canEli = true;
						//Te();
					}
					//重置起始颜色和长度
					color = thisBall.color;
					eliCount = 1;
				}
			}
		}
		for (var j = 0; j < ballAll[0].length; j++) {
			eliCount = 0;
			var color;
			/*var k = 0;
			var startBall = 0;
			for(k=0; k<ballAll.length;k++){
				if (ballAll[k][j].alpha<=0||ballAll[k][j].color == 'black') {
					startBall++;
				}
			}*/
			color = ballAll[0][j].color;

			for(var i = 0; i<ballAll.length; i++){
				if (ballAll[i][j].color!='black'||ballAll[i][j].alpha==1) {
					var thisball = ballAll[i][j];
					if (thisball.color == color) {
						eliCount++;
						if(i==ballAll.length-1&&thisball.checkBall(i+1, j , eliCount, 'x')){
							canEli = true;
							//Te();
						}
					}else{
						if (thisball.checkBall(i, j, eliCount, 'x')) {
							canEli = true;
							//Te();
						}
						color = thisball.color;
						eliCount = 1;
					}
				}
			}
		}
		if (canEli) {
			Te();
		}
		console.log(eliCount+": "+ballAll[0][0].color+": "+ballAll[0][0].alpha+canEli);
		return canEli;
	}

//得分计算
	function gscor(count){
		var scr = String(count*10);

	}
	Ball.prototype.getScore = function(count){
		clearTimeout(this.scr);
		var score = String(count*10);
		drawText(score, (this.indexX-1)*30, (this.indexY-1)*30, mainContext);
		this.scr = setTimeout(function(){
			clear(mainContext, this.indexX-1, this.indexY-1);
		}, 500);
	}


	/*function disappear(){
		for (var i = 0; i < ballAll.length-2; i++) {
			for (var j = 0; j < ballAll[i].length; j++) {
				if (ballAll[i][j].color==ballAll[i+1][j].color&&ballAll[i+1][j].color==ballAll[i+2][j].color) {
					//符合消除条件，isFade = 1；
					if (ballAll[i][j].alpha>0&&ballAll[i+1][j].alpha>0&&ballAll[i+2][j].alpha>0) {
						ballAll[i][j].isFade = 1;
						ballAll[i+1][j].isFade = 1;
						ballAll[i+2][j].isFade = 1;
					}
					/*clear(mainContext, i, j);
					clear(mainContext, i+1, j);
					clear(mainContext, i+2, j);*/
				/*}
			}
		}
		for(var i = 0; i<ballAll.length; i++){
			for(var j = 0; j<ballAll[i].length-2; j++){
				if(ballAll[i][j].color==ballAll[i][j+1].color&&ballAll[i][j+1].color==ballAll[i][j+2].color){
					if (ballAll[i][j].alpha>0&&ballAll[i][j+1].alpha>0&&ballAll[i][j+2].alpha>0) {
						ballAll[i][j].isFade = 1;
						ballAll[i][j+1].isFade = 1;
						ballAll[i][j+2].isFade = 1;
					}
					/*clear(mainContext, i, j);
					clear(mainContext, i, j+1);
					clear(mainContext, i, j+2);*/
				/*}
			}
		}
	}*/
    var isGameStart = 0;//判断是否开始
	var ballAll = [];
	function gameLoading(){
		//初始化
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

		mainContext.clearRect(0, 0, mainWidth, mainHeight);
		bg.fillStyle = 'black';
	    bg.fillRect(0, 0, mainWidth, mainHeight);
	    bground.style.zIndex = 30;//背景位于主画布上方
	    bg.font = '60px Arial';
	    var bgNameGradient = bg.createLinearGradient(mainWidth*0.19, mainHeight*0.286, mainWidth, mainHeight*0.43);
	    drawText(gameName, mainWidth*0.19, mainHeight*0.34, bg, bgNameGradient);


	    var bgStartGradient = bg.createLinearGradient(mainWidth*0.375, mainHeight*0.524, 340, 220);
	    bg.font = '30px Arial';
	    drawText(startGame, 180, 220, bg, bgStartGradient);
	    drawText(about, 210, 270, bg, bgStartGradient);
	    drawText(endGame, 180, 320, bg, bgStartGradient);
	}