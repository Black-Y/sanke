	var cvs = document.getElementById("myCvs");
	var ctx = cvs.getContext('2d');
	var score = document.getElementById("score");
	var count = 0;
	function getRect(x,y,w,h,c){
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.color = c;
	}
	getRect.prototype.draw = function (){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x,this.y,this.width,this.height);
		ctx.fill();
		ctx.stroke();
	}
	function Snake(kCode,w,h){
		var snakeArr=[];
		for(var i=0;i<4;i++){
			var newRect = new getRect(i*w,h,w,h,"white");
			snakeArr.unshift(newRect);
		}
		this.arr = snakeArr;
		this.head = snakeArr[0];
		this.head.color = "red";
		this.direction = kCode;
	} 
	Snake.prototype.draw = function (){
		for(var i=0;i<this.arr.length;i++){
			this.arr[i].draw();
		}
	}
	Snake.prototype.move = function (){
		var len = this.arr.length;
		var newRect = new getRect(this.head.x,this.head.y,this.head.width,this.head.height,"white");
		
		this.arr.splice(1,0,newRect);
		switch(this.direction){
			case 37 :
				this.head.x -= this.head.width;
				break;
			case 38 :
				this.head.y -= this.head.width; //上
				break;
			case 39 :
				this.head.x += this.head.width; //右
				break;
			case 40 :
				this.head.y += this.head.width; //下
				break;
		}
		// console.log(this.head.x,this.head.y);
		if(this.head.x<=-this.head.width || this.head.x>=cvs.width || this.head.y<=-this.head.width || this.head.y>=cvs.height){//撞墙
			gameOver();
			clearInterval(timer);
		}
		for(var i=1;i<len;i++){//咬到自身
			if(this.arr[i].x == this.head.x && this.arr[i].y == this.head.y){
				gameOver();
				clearInterval(timer);
			}
		}
		if(hasFood()){//是否吃到食物
			score.innerText = ++count;
			food = new getRandomFood();
		}else{
			this.arr.pop();
		}
	}
	var snake = new Snake(39,15,15);
	snake.draw();
	function getRandomFood(){
		var flag = true;//假设食物与蛇身重合
		do{
			var x = Math.floor(0+Math.random()*(cvs.width/snake.head.width))*snake.head.width;
			var y = Math.floor(0+Math.random()*(cvs.height/snake.head.height))*snake.head.height;
			for(var i=0;i<snake.arr.length;i++){
				// console.log(snake.arr[i].x,snake.arr[i].y);
				if(snake.arr[i].x == x && snake.arr[i].y == y){
					flag = true;
					break;
				}else{
					flag = false;
					var o = new getRect(x,y,snake.head.width,snake.head.height,"orange");
				}
			};
		}while(flag)
		return o;
	}
	var food = new getRandomFood();
	
	function hasFood(){
		if(snake.head.x ==food.x && snake.head.y ==food.y){
			flag = true;
		}else{
			flag = false;
		}
		return flag;
	}
	document.onkeydown = function(evt){
		var evt = evt||window.event;
		var val = Math.abs(snake.direction-evt.keyCode);
		evt.preventDefault();
		if(val==1||val==3){
			snake.direction = evt.keyCode;
		}
	};
	function changeSpeed(){
		var speed;
		if(snake.arr.length<10){
			speed = 200;
		}else{
			speed = 200/(snake.arr.length/10);
		}
		return speed;
	}
	var timer;//定时器
	function startGame(){
		timer=setInterval(function (){
			ctx.clearRect(0,0,cvs.width,cvs.height);
			food.draw();
			snake.move();
			snake.draw();
		},changeSpeed());
	}
	function gameOver(){
		document.getElementById("start").disabled = true;
		ctx.font = "30px 微软雅黑";
		ctx.fillStyle = "#fff";
		ctx.fillText("游戏结束！",250,200);
	}
	function changeDrect(id){
		var num;
		var val;
		switch(id){
			case "left":
				num = 37;
				break;
			case "up":
				num = 38;
				break;
			case "right":
				num = 39;
				break;
			case "down":
				num = 40;
				break;
		}
		val = Math.abs(snake.direction-num);
		if(val==1||val==3){
			snake.direction = num;
		}
	}
	var switchNum=0;
	document.getElementById("start").onclick=function(){
			if(switchNum == 0){
				switchNum = 1;
				clearInterval(timer);
				this.style.backgroundPosition = '0 -383px';
				startGame();
			}else{
				switchNum = 0;
				this.style.backgroundPosition = '0 -255px';
				clearInterval(timer);
			}
	}
	document.getElementById("reStart").onclick=function(){
		window.location.reload();
	}
