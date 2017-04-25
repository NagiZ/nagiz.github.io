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

//最近一次更新 2017年3月7日11:26:30： 初步完成颜色交换和重绘模块；
//渲染数组
	var fillColor = ['red','green','blue','pink','orange'];
	var image =[];
	image[0] = new Image();
	image[1] = new Image();
	image[2] = new Image();
	image[3] = new Image();
	image[4] = new Image();
	image[0].src = "./image/继续读书.png";
	image[1].src = "./image/商业进阶.png";
	image[2].src = "./image/香水.png";
	image[3].src = "./image/设计.png";
	image[4].src = "./image/心理咨询.png";
	var colorChosen = '';

	var movable;
	var isPause = false;//标记是否暂停
	var isEnd = false;//是否结束

//随机选取颜色
    function colorSelcet(arr1, arr2){
    	var colorIndex = 0;
    	var content = {};
    	colorIndex = Math.floor(Math.random()*4); 
    	content.color = arr1[colorIndex];
    	content.image = arr2[colorIndex];
    	return content;
    };

//创建小球对象
    var Ball = function(indexX, indexY){
    	var cont = colorSelcet(fillColor, image);
    	this.indexX = indexX;
    	this.indexY = indexY;	
    	this.startAngle = 0;
    	this.endAngle = 2*Math.PI;
    	this.x = indexX*60+15;
    	this.y = indexY*60+15;
    	this.radius = 29;
    	this.color = cont.color;
    	this.image = cont.image;
    	this.blur = 0;
    	this.alpha = 1;
    	this.isFade = 0;//判断是否要消失
    	this.opc = null;
    };

//渲染小球
	var mainStage = document.getElementById('main_stage');
	var mainContext = mainStage.getContext('2d');
	mainContext.lineWidth = 1;
	function drawMain(color, x, y){

	};
    
    var ballAll = [];
    Ball.prototype.draw = function(ctx){
    	var pattern = ctx.createPattern(this.image, 'no-repeat');
    	ctx.save();
    	ctx.translate(this.x, this.y);
    	ctx.scale(2, 2);
    	ctx.shadowBlur = this.blur;
    	ctx.shadowColor = 'white';
    	/*ctx.beginPath();
    	ctx.lineWidth = 2;
    	ctx.drawImage(this.image, 0, 0);
    	//ctx.clip();
    	ctx.fillStyle = this.color;*/
    	ctx.roundRect(0, 0, 25, 25, 7);
    	ctx.fillStyle = pattern;
    	ctx.fill();
    	ctx.restore();
    };


//绑定鼠标事件
if (screen.availWidth>600) {
	mainStage.addEventListener('mouseup', mainOnMouseUp, false);
}else{
	//mainStage.removeEventListener('mouseup', mainOnMouseUp, false);
	//mainStage.addEventListener('mouseup', mainOnMouseUp, false);
	mainStage.addEventListener('touchstart', touchStart, false);
}

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
	 			//that.opc = null;
	 		},75);
	 	}
	 	if(this.alpha<=0){
	 		this.alpha = 0;
	 		//clear(mainContext, this.x, this.y);
	 	}
    }

//点击两个小球，交换颜色
	var index = {} ,tag = 0;//index用来存储第一次点击的球的颜色， tag用于判断第几次点击
	function mainOnMouseUp(e){
		e = event||window.event;
		var mouseX = e.pageX-div.offsetLeft-pad;
		var mouseY = e.pageY-div.offsetTop-pad;
		console.log(ballAll[5][5]);
		if(isGameStart===1){
			if (tag == 0) {
				tag = 1;
				index.x = Math.floor(mouseX/(2*ballRadius));
				index.y = Math.floor(mouseY/(2*ballRadius));
				ballAll[index.x][index.y].blur = 15;
				reDraw(mainContext, ballAll[index.x][index.y]);
				//console.log(tag);
			}else if (tag==1) {
				tag = 0;
				var trans = {};
				trans.x = Math.floor(mouseX/(2*ballRadius));
				trans.y = Math.floor(mouseY/(2*ballRadius));
				if (ballAll[index.x][index.y].alpha> 0) {
					var firball = ballAll[index.x][index.y];
					var secball = ballAll[trans.x][trans.y];
					firball.blur = 0;
					reDraw(mainContext, firball);
					if (secball.checkNearBall(firball, secball)&&movable==1&&firball.color!==secball.color&&secball.alpha>0) {	
						//firball.changeAlpha();
						//secball.changeAlpha();	//setTimeout独立挂起，被放在最后执行。理论上应该消失的，但是重绘了alpha为1的情况。待解	
						exchangeColor(firball, secball);
						//console.log(firball.checkEliBall());
						if((firball.checkEliBall()||secball.checkEliBall())&&(firball.isFade == 1||secball.isFade == 1)){
							firball.blur = 0;
							reDraw(mainContext, firball);
							reDraw(mainContext, secball);
						}else{
							exchangeColor(firball, secball);
							//console.log(ballAll[5][5]);
						}
					}/*else{
						firball.blur = 0;
						reDraw(mainContext, firball);
					}*/
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
    var tr, t, tc, skidArr={}
    skidArr.x = 0;
    skidArr.y = 0;
    //时钟
	function dropBall(){
		if (isPause) {
			return false;
		}
		//reDraw(mainContext, ballAll[5][5]);
		clearTimeout(tr);
		var flag = false, firstFade = 0; 
		for (var i = 0; i < ballAll.length; i++) {
			flag = false;
			for (var j = ballAll[i].length-1; j >= 0; j--) {
				var ba = ballAll[i][j];
				if (!flag&&ba.isFade) {
					flag = true;
					firstFade = j;
				}else if (!ba.isFade&&flag&&ba.alpha==1) {
					ballAll[i][firstFade].alpha = ba.alpha;
					ballAll[i][firstFade].color = ba.color;
					ballAll[i][firstFade].image = ba.image;
					ballAll[i][firstFade].isFade = 0;
					reDraw(mainContext, ballAll[i][firstFade]);
					firstFade--;
				}
				if (j==0&&firstFade>=0&&mode==mode1&&flag==true) {
					for (var k = firstFade; k >= 0; k--) {
						ballAll[i][firstFade] = null;
						ballAll[i][firstFade] = new Ball(i, firstFade);
						reDraw(mainContext, ballAll[i][firstFade]);
						firstFade--;
					}
				}else if(j==0&&firstFade>=0&&mode==mode2){
					while(firstFade>=0&&flag==true){
						//console.log(len);
						ballAll[i][firstFade] = null;
						ballAll[i][firstFade] = new Ball(i, firstFade);
						reDraw(mainContext, ballAll[i][firstFade]);
						firstFade--;
					}
				}
			}
		}
	
		document.getElementById('score').innerHTML = 'Total Score: '+score;

		/*var clearMusic = document.getElementById("clearMusic");
		clearMusic.src = "./music/clear.ogg";
		clearMusic.autoplay = true;*/
	
		var ableEli = 0;
		for (var x = 0; x < ballAll.length; x++) {
			for (var y = 0; y < ballAll[x].length; y++) {
				if (anyEliBall(ballAll[x][y])&&(!isEnd)) {
					ableEli++;
				}
			}
		}

		//console.log(ableEli);
		if (isEnd) {
			gameOver();
		}else{
			if(mode==mode2&&ableEli==0){
				var sub_ballColor = [];
				for (var indexx = 0; indexx < ballAll.length; indexx++) {
					for (var indexy = 0; indexy < ballAll[indexx].length; indexy++) {
						sub_ballColor[indexx][indexy] = ballAll[indexx][indexy].color;
					}
				}
				sub_ballColor.sort(randomSorting);
				mainContext.clearRect(0,0,mainWidth,mianHeight);
				for (var indexi = 0; indexi < ballAll.length; indexi++) {
					for (var indexj = 0; indexj < ballAll[indexi].length; indexj++) {
						ballAll[indexi][indexj].color = sub_ballColor[indexi][indexj];
						reDraw(mainContext,ballAll[indexi][indexj]);
					}
				}

			}else if (mode==mode1&&ableEli==0) {
				gameOver();
			}
			movable = 1;

			tr = setTimeout(function(){
				for (var i = 0; i < ballAll.length; i++) {
					for (var j = 0; j < ballAll[j].length; j++) {
						clearTimeout(ballAll[i][j].opc);
					}
				}
				ballAll[0][0].checkEliBall();
			}, 100);
			return true;
		}
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
					var clearMusic = document.getElementById("clearMusic");
					/*clearMusic.src = "./music/clear.ogg";
					clearMusic.autoplay = true;*/
					clearMusic.play();
					t = setTimeout(function(){
						dropBall();
					}, 1500);
				}
			}
		}
	}



//重绘交换后的小球 2017年3月7日11:26:06
	function reDraw(ctx, ball){
		clear(ctx, ball.indexX, ball.indexY);
		var pattern = ctx.createPattern(ball.image, 'no-repeat');
		ctx.save();
		ctx.translate(ball.x, ball.y);
    	ctx.scale(2, 2);
    	ctx.shadowBlur = ball.blur;
    	ctx.shadowColor = 'white';
		ctx.beginPath();
		ctx.globalAlpha = ball.alpha;
		/*ctx.lineWidth = 2;
		ctx.drawImage(ball.image, 0, 0);
		ctx.fillStyle = ball.color;*/
		ctx.roundRect(0, 0, 25, 25, 7);
    	ctx.fillStyle = pattern;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}



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

//检测消除条件，但不标记
	Ball.prototype.ceBall = function(x, y, count, direction){
		if(count>=3){
			return true;
		}
		return false;
	}

//检测相同颜色小球的长度
//判断貌似有问题，无论全局检查能否消除，最后canEli都是true，待解
	function clear(ctx, x, y){
		ctx.clearRect(60*x+10, 60*y+10, 60, 60);
	}

	Ball.prototype.checkEliBall = function(){
		if (isPause) {
			return false;
		}else{
			var canEli = false;
			//console.log(canEli);
			var eliCount;
			for (var i = 0; i < ballAll.length; i++) {
				eliCount = 0;
				var color;
				//2017年4月11日17:48:02
				/*var k = 0;
				var startBall = 0;
				if (ballAll[i][6].color!='black') {
					for(k=0; k<ballAll[i].length;k++){
						if (ballAll[i][k].alpha<=0||ballAll[i][k].color == 'black') {
							startBall++;
						}
					}*/
				color = ballAll[i][0].color;
				/*}else{
					color = null;
				}*/

				for (var j = 0; j < ballAll[i].length; j++) {
					var thisBall = ballAll[i][j];
					if (thisBall.color!='black') {
					//颜色相同，长度加1
						if (thisBall.color == color) {
							eliCount++;
							//到底部，直接检测
							if (j == ballAll[i].length-1&&thisBall.checkBall(i, j+1, eliCount, 'y')) {
								canEli = true;
								score += getscore(eliCount);
								//Te();
							}
						}else{
							//能消除
							if(thisBall.checkBall(i, j , eliCount, 'y')){
								canEli = true;
								score += getscore(eliCount);
								//Te();
							}
							//重置起始颜色和长度
							color = thisBall.color;
							eliCount = 1;
						}
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
								score += getscore(eliCount);
								//Te();
							}
						}else{
							if (thisball.checkBall(i, j, eliCount, 'x')) {
								canEli = true;
								score += getscore(eliCount);
								//Te();
							}
							color = thisball.color;
							eliCount = 1;
						}
					}else{
						if (ballAll[i][j].checkBall(i,j,eliCount,'x')) {
							canEli = true;
							score +=getscore(eliCount);
						}
						color = null;
						eliCount = 0;
					}
				}
			}
			if (canEli) {
				Te();
			}
			//console.log(eliCount+": "+ballAll[0][0].color+": "+ballAll[0][0].alpha+canEli);
			return canEli;
		}
	}

//得分计算
	function getscore(count){
		var scr = 0;
		if (count==3) {
			scr = count*10;
		}else if (count>3&&count<=6) {
			var subCount = count - 3;
			scr = 30 + subCount*20;
		}else if (count>6) {
			var maxCount = count - 6;
			scr = 90 + maxCount*30;
		}
		return scr;
	}

//触摸
var touchTag = 0, tmove = false;
var preX=0, preY=0, curX=0, curY=0;

function touchStart(e){
	e = event||window.event;
	var fingerX = e.touches[0].pageX-div.offsetLeft-pad;
	var fingerY = e.touches[0].pageY-div.offsetTop-pad;
	console.log(ballAll[5][5]);
	if(isGameStart===1){
		if (touchTag == 0) {
			touchTag = 1;
			index.x = Math.floor(fingerX/(2*ballRadius));
			index.y = Math.floor(fingerY/(2*ballRadius));
			ballAll[index.x][index.y].blur = 15;
			reDraw(mainContext, ballAll[index.x][index.y]);
			//console.log(tag);
		}else if (touchTag==1) {
			touchTag = 0;
			var trans = {};
			trans.x = Math.floor(fingerX/(2*ballRadius));
			trans.y = Math.floor(fingerY/(2*ballRadius));
			if (ballAll[index.x][index.y].alpha> 0) {
				var firball = ballAll[index.x][index.y];
				var secball = ballAll[trans.x][trans.y];
				firball.blur = 0;
				reDraw(mainContext, firball);
				if (secball.checkNearBall(firball, secball)&&movable==1&&firball.color!==secball.color&&secball.alpha>0) {	
					//firball.changeAlpha();
					//secball.changeAlpha();	//setTimeout独立挂起，被放在最后执行。理论上应该消失的，但是重绘了alpha为1的情况。待解	
					exchangeColor(firball, secball);
					//console.log(firball.checkEliBall());
					if((firball.checkEliBall()||secball.checkEliBall())&&(firball.isFade == 1||secball.isFade == 1)){
						firball.blur = 0;
						reDraw(mainContext, firball);
						reDraw(mainContext, secball);
					}else{
						exchangeColor(firball, secball);
						//console.log(ballAll[5][5]);
					}
				}/*else{
					firball.blur = 0;
					reDraw(mainContext, firball);
				}*/
			}
		}
	}	
}
