function Game(ctx,land,bg,pipe,bird,title,tutorial){
	this.ctx = ctx;
	this.land = land;
	this.bg = bg;
	this.pipeArr = [pipe];
	this.frameNum = 0;
	this.bird = bird;
	this.title = title;
	this.tutorial = tutorial;
	this.pipe_frame = 0;
	// 分数
	this.score = 0;
	
	this.init();
}

Game.prototype = {
	constructor:Game,
	init:function(){
		this.welcome();
	},

	renderBG :function(){
		this.ctx.drawImage(this.bg.pic,0-(this.frameNum*this.bg.speed)%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width-this.frameNum*this.bg.speed%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width*2-this.frameNum*this.bg.speed%this.bg.pic.width,0);
	},
	renderLand:function(){
		this.ctx.drawImage(this.land.pic,0-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width*2-this.frameNum*this.land.speed%this.land.pic.width,400);
	},
start : function(){
		var me = this;
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			me.frameNum++;
			me.pipe_frame++;
			me.clear();
			me.renderBG();
			me.renderLand();
			me.renderPipe();
			me.renderBird();
			me.bird.go();
			if(!(me.frameNum%5)){
				me.bird.swing();
			}

			if(!(me.pipe_frame % 150)){
				me.createpipe();
			}
			me.rendScore();
		},20);
 	},
 	// 清屏
	clear:function(){
		this.ctx.clearRect(0,0,500,600);
	},

	//渲染管子
	renderPipe:function(){
		for(var i = 0;i<this.pipeArr.length;i++){
			this.pipeArr[i].move();

		var up_img_x = 0;
		var up_img_y = this.pipeArr[i].up.height - this.pipeArr[i].up_length;
		var up_img_w =  this.pipeArr[i].up.width;
		var up_img_h = this.pipeArr[i].up_length;
		var up_canvas_x = this.ctx.canvas.width- this.pipeArr[i].iframe * this.pipeArr[i].speed;
		if(up_canvas_x<-up_img_w){
			this.pipeArr.splice(i,1);
			i--;
			continue;
		}
		var up_canvas_y = 0;
		var up_canvas_w = up_img_w;
		var up_canvas_h = up_img_h;
		this.ctx.drawImage(this.pipeArr[i].up,up_img_x,up_img_y,up_img_w,up_img_h,up_canvas_x,up_canvas_y,up_canvas_w,up_canvas_h);
		var down_img_x = 0;
		var down_img_y = 0;
		var down_img_w = up_img_w;
		var down_img_h = this.pipeArr[i].down_length;
		var down_canvas_x = up_canvas_x;
		var down_canvas_y = up_img_h+this.pipeArr[i].distance;
		var down_canvas_w = up_canvas_w;
		var down_canvas_h = down_img_h;
		this.ctx.drawImage(this.pipeArr[i].down,down_img_x,down_img_y,down_img_w,down_img_h,down_canvas_x,down_canvas_y,down_canvas_w,down_canvas_h);

		// 渲染金币
		 if(this.pipeArr[i].hasMedal){
		  		this.ctx.drawImage(this.pipeArr[i].medal,up_canvas_x,up_img_h+(150-this.pipeArr[i].medal.height)/2);
		  }
		}
	},

	//渲染鸟
	renderBird:function(){
		this.ctx.save();
		var y = 0;
		if((178+this.bird.y)<0){
			y = 0;
			this.bird.state = "D";
			this.bird.f = 0;
		}else{
			y = 178+this.bird.y;
		}
		this.ctx.translate(125, y);
		
		var bird_b_x = this.bird.x + this.bird.B.x + 125;
		var up_pipe_c_x = this.ctx.canvas.width -(this.pipeArr[0].speed * this.pipeArr[0].iframe);
		var bird_b_y = this.bird.B.y + y;
		var up_pipe_c_y = this.pipeArr[0].up_length;
		var bird_a_x = this.bird.x +this.bird.A.x +125;

		var up_pipe_d_x = up_pipe_c_x +this.pipeArr[0].up.width;

		if(bird_b_x > up_pipe_c_x && bird_b_y < up_pipe_c_y && bird_a_x < up_pipe_d_x){
			clearInterval(this.timer);
		}
		var bird_d_x = bird_b_x;
		var bird_d_y = y + this.bird.D.y;
		var bird_c_x = bird_a_x;
		var down_pipe_a_x = up_pipe_d_x - this.pipeArr[0].up.width;
		var down_pipe_a_y = this.pipeArr[0].up_length+150;
		var down_pipe_b_x = up_pipe_d_x;
		// 判断管子
		if(bird_d_x > down_pipe_a_x && bird_d_y > down_pipe_a_y && bird_c_x < down_pipe_b_x){
			clearInterval(this.timer);
			
		}
		// 判断地面
		if(bird_d_y>400){
			clearInterval(this.timer);
			
		}
		if(this.bird.state ==="U"){
			this.ctx.rotate(-this.bird.f*2/(180/Math.PI));
		}else{
			this.ctx.rotate(this.bird.f/(180/Math.PI));
		}
			if( this.pipeArr[0].hasMedal &&  bird_d_x>=down_pipe_a_x){
			// 吃到金币了 
			this.score += (this.pipeArr[0].idx+1);
			this.pipeArr[0].hasMedal  = false;
		}
		this.ctx.drawImage(this.bird.imgArr[this.bird.idx],-this.bird.width/2,-this.bird.height/2);

		this.ctx.restore();
	},
	bindEvent:function(){
		var me = this;
		this.ctx.canvas.onclick = function(){
			me.bird.energy();
		}
	},
	createpipe:function(){
		this.pipeArr.push(new Pipe(this.pipeArr[0].up,this.pipeArr[0].down,this.pipeArr[0].speed,this.pipeArr[0].medalArr))
	},
	welcome:function(){
		var me = this;
		this.timer = setInterval(function(){
			me.frameNum++;
			me.clear();
			me.renderBG();
			me.renderLand();
			me.renderTitle();
			me.renderTutorial();
		}, 20)
	},
	renderTitle : function(){ 
		this.ctx.drawImage(this.title,(this.ctx.canvas.width - this.title.width)/2,this.frameNum>150?150:this.frameNum);
	},
	renderTutorial:function(){
		var flag = this.frameNum>150?  true: false;
		if(flag){
			if(!(this.frameNum%10<5)){
			this.ctx.drawImage(this.tutorial,(this.ctx.canvas.width - this.tutorial.width)/2,170+this.title.height)
			this.begin();

			}
		}
	},
	begin:function(){
		var me = this;
		this.ctx.canvas.onclick =  function(e){
			if(e.offsetX >(me.ctx.canvas.width - me.tutorial.width)/2&& e.offsetX<(me.ctx.canvas.width-me.tutorial.width)/2 + me.tutorial.width && e.offsetY>(170+me.tutorial.height) && e.offsetY<(170+me.tutorial.height * 2)){
				me.start();
				me.bindEvent();
			}
		}
	},
	// 渲染分数
	rendScore:function(){
		this.ctx.fillText(this.score, 0, 440);
	} 

	// 渲染游戏说明
	renderGame:function(){

	}
}

