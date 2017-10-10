// 管子类
function Pipe(pipe_down,pipe_up,speed,medalArr){

	this.up =  pipe_down;

	this.down = pipe_up;
	
	this.speed = speed;

	this.distance = 150;

	this.up_length = parseInt(Math.random() * 250);

	this.down_length = 400 - 150 - this.up_length;

	this.iframe  = 0;

	this.medalArr = medalArr;

	this.idx = parseInt(Math.random()*this.medalArr.length);

	this.medal = this.medalArr[this.idx];

	this.hasMedal =true;
}

Pipe.prototype.move = function(){
	this.iframe ++;
}
