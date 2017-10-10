function Bird(imgArr){
	this.imgArr = imgArr;
	this.idx = 0;
	this.height  = this.imgArr[this.idx].height;
	this.width =  this.imgArr[this.idx].width;
	this.y = 0;
	this.x = 0;
	this.padding = 10;
	this.f = 0;

	this.A = {
		x : -this.padding,
		y : -this.padding
	};

	this.B = {
		x : this.padding,
		y : -this.padding
	};

	this.C = {
		x : -this.padding,
		y : this.padding
	};

	this.D = {
		x : this.padding,
		y : this.padding
	}
	this.state = "D";
}

Bird.prototype = {
	constructor:Bird,
	swing:function(){
		this.idx++; 
		if(this.idx >=this.imgArr.length){
			this.idx=0;
		} 
	},
	energy:function(){
	   this.state = "U";
	   this.f = 15;
	},
	go:function(){
		 if(this.state === "D"){
		 this.f++;
		  this.y+=Math.sqrt(this.f);
		 }else if(this.state ==="U") {
		 	this.f--;
		 	if(this.f ===0){
		 		this.state = "D"; 
		 	}
		 	this.y-= (Math.sqrt(this.f));
		 }
	} 
}
