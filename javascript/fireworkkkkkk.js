//烟花特效，参考
//动画间隔
window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();
var fireWidth, fireHeight;
var fireWork = document.getElementById( 'fireWork' ),
		fireCtx = fireWork.getContext( '2d' ),
		//宽高
		cw,
		ch,
		// 烟花数组
		fireworks = [],
		// 粒子数组
		particles = [],
		// 初始色相
		hue = 120,
		// 自动发射烟花
		timerTotal = 80,
		timerTick = 0,
		mousedown = false;

if (screen.availWidth<800) {
	fireWork.style.width = window.innerWidth + 'px';
	fireWork.style.height = window.innerWidth*0.875 + 'px';
}
fireWidth = parseInt(fireWork.style.width);
fireHeight = parseInt(fireWork.style.height);
if (screen.availWidth>800) {
	cw = 500;
	ch = 440;
}else{
	cw = fireWidth;
	ch = fireHeight;
}


		

// 随机数
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// 计算两点距离
function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// 创建烟花类
function Firework( sx, sy, tx, ty ) {
	this.x = sx;
	this.y = sy;
	this.sx = sx;
	this.sy = sy;
	this.tx = tx;
	this.ty = ty;
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	this.coordinates = [];
	this.coordinateCount = 3;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	this.targetRadius = 1;
}

// 更新烟花
Firework.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	
	this.speed *= this.acceleration;
	
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		fireworks.splice( index, 1 );
	} else {
		this.x += vx;
		this.y += vy;
	}
}

// 渲染烟花
Firework.prototype.draw = function() {
	fireCtx.beginPath();
	fireCtx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	fireCtx.lineTo( this.x, this.y );
	fireCtx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	fireCtx.stroke();
	
	fireCtx.beginPath();
	fireCtx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	fireCtx.stroke();
}

//创建粒子类
function Particle( x, y ) {
	this.x = x;
	this.y = y;
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	this.friction = 0.95;
	this.gravity = 1;
	this.hue = random( hue - 20, hue + 20 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	this.decay = random( 0.015, 0.03 );
}

//更新粒子
Particle.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

// 渲染粒子
Particle.prototype.draw = function() {
	fireCtx. beginPath();
	fireCtx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	fireCtx.lineTo( this.x, this.y );
	fireCtx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	fireCtx.stroke();
}

function createParticles( x, y ) {
	var particleCount = 30;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

// 循环
function loop() {

	requestAnimFrame( loop );
	
	hue += 0.5;
	
	fireCtx.globalCompositeOperation = 'destination-out';
	fireCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	fireCtx.fillRect( 0, 0, cw, ch );
	fireCtx.globalCompositeOperation = 'lighter';
		
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}
		
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );
	}
		
	if( timerTick >= timerTotal ) {
		fireworks.push( new Firework( 250, 440, random( 0, 520 ), random( 0, 440 ) ) );
		timerTick = 0;
	} else {
		timerTick++;
	}
}

