
	var f = window.f = {};

	f.isIos = function(){

		var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	    if (isAndroid) {
	       return false;
	    }
	    if (isIOS) {
	　　 	return true;
	    }

	}

	f.isWeiXin = function(){

		var is = false;

	    var ua = window.navigator.userAgent.toLowerCase(); 
	    if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
	        is = true;
	    } else { 
	        is = false
	    } 

	    return is;

	}

	f.creatrImage = function(ob,a){

		var _b = new PIXI.Sprite(ob.texture);
		_b.setWidth(a?a:innerWidth);
		app.stage.addChild(_b);

		return _b;

	}

	f.creatrBit = function(ob,w,x,y,rx,ry,isAdd){
		
		var _b = new PIXI.Sprite(ob.texture);
		_b.setWidth(w);
		_b.anchor.x = rx == undefined ? .5:rx;
		_b.anchor.y = ry == undefined ? .5:ry;
		_b.x = x;
		_b.y = y;
		app.stage.addChild(_b);

		return _b;

	}


	f.creatrBit2 = function(ob,w,x,y,rx,ry){
		
		var _b = new PIXI.Sprite(ob.texture);
		_b.setWidth(w * innerWidth);
		_b.anchor.x = rx == undefined ? .5:rx;
		_b.anchor.y = ry == undefined ? .5:ry;
		_b.x = x * innerWidth;
		_b.y = y * innerHeight;
		app.stage.addChild(_b);

		return _b;

	}
	

	f.creatrText = function(ob,w,x,y,rx,ry){
		
		var _b = new PIXI.Sprite(ob.texture);
		_b.setWidth(w * innerWidth);
		_b.anchor.x = rx == undefined ? .5:rx;
		_b.anchor.y = ry == undefined ? .5:ry;
		_b.alpha = 0;
		_b.x = x * innerWidth;
		_b.y = y * innerHeight;
		app.stage.addChild(_b);

		return _b;

	}

	f.creatrMan = function(ob,w,x,y,rx,ry){
		
		var _b = new PIXI.Sprite(ob.texture);
		_b.setWidth(w * innerWidth);
		_b.anchor.x = rx == undefined ? .5:rx;
		_b.anchor.y = ry == undefined ? .5:ry;
		_b.alpha = 0;
		_b.x = x * innerWidth;
		_b.y = y * innerHeight;
		app.stage.addChild(_b);

		return _b;

	}

	f.imageData = [];
	f.timerFTP = function(){

		var timer = setInterval(function(){

			f.imageData.forEach(function(el){

				el.el.texture = el.data[el.now].texture;
				el.now++;
				if(el.now>=el.data.length){
					el.now = 0;
				}
			});

		},300);

	}

	f.tweenData = [];
	f.tween = function(){

		f.tweenData.forEach(function(el){

			if(el.now<=el.min){

				el.isFTP = 0.01;
			}else if(el.now>=el.max){
				el.isFTP = -0.01
			}
			// console.log(el.min,el.max);
			el.now+=el.isFTP;
			el.el.alpha = el.now.toFixed(1);

		});

	}

	f.play = function(b){

		if(!app.isCloseAudio){
			// app.b1.pause();
			// app.b2.pause();
			// app.b3.pause();
			app.b4.pause();
			app.b5.pause();
			app.b7.pause();
			// app.b8.pause();
			app.b9.pause();
			app.b10.pause();
			app[b].load();
			app[b].play();
		}

	}

	f.close = function(){

		// app.b1.pause();
		// app.b3.pause();
		app.b4.pause();
		app.b5.pause();
		app.b7.pause();
		// app.b8.pause();
		app.b9.pause();
		app.b10.pause();
		app.a1.pause();

		app.isCloseAudio = true;

	}

	f.open = function(){

		var w = innerWidth;
		var h = w * 1.93;
		var d = Math.abs(slide.y/h);

		app.a1.play();
		app.isCloseAudio = false;

	}

	f.getN = function(r){
		var n = 0;

		if(r<=0.333){
			n = ( r / 0.333 * 59 / 100).toFixed(2).substring(2,4);
		}else if(r>0.333 && r<= 0.666){
			n = ( (r-0.333) / 0.333 * 59 / 100).toFixed(2).substring(2,4);
		}else if(r>0.666&&r<1){
			n = ( (r-0.666) / 0.333 * 59 / 100).toFixed(2).substring(2,4);
		}else if(r>=1){
			n = '00';
		}

		return n;

	}

	f.getM = function(r,min,max){

		var m = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		return (m[Math.floor(r * (max - min))+min]/100).toFixed(2).substring(2,4);

	}



	f.random = function(Min,Max){
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	}


	f.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if(r != null){
        return unescape(r[2]);
    }else if(q != null){
        return unescape(q[2]);
    }else{
        return null;
    }
}


