function animate(){context.clearRect(0,0,screenW,screenH);$.each(stars,function(){this.draw(context)})}function Star(a,d,c,b){this.x=parseInt(a);this.y=parseInt(d);this.length=parseInt(c);this.opacity=b;this.factor=1;this.increment=Math.random()*0.03}var canvas;var context;var screenH;var screenW;var stars=[];var fps=50;var numStars=100;Star.prototype.draw=function(){context.rotate((Math.PI*1/10));context.save();context.translate(this.x,this.y);if(this.opacity>1){this.factor=-1}else{if(this.opacity<=0){this.factor=1;this.x=Math.round(Math.random()*screenW);this.y=Math.round(Math.random()*screenH)}}this.opacity+=this.increment*this.factor;context.beginPath();for(var a=5;a--;){context.lineTo(0,this.length);context.translate(0,this.length);context.rotate((Math.PI*2/10));context.lineTo(0,-this.length);context.translate(0,-this.length);context.rotate(-(Math.PI*6/10))}context.lineTo(0,this.length);context.closePath();context.fillStyle="rgba(255, 255, 200, "+this.opacity+")";context.shadowBlur=5;context.shadowColor="#ffff33";context.fill();context.restore()};