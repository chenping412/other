	

	PIXI.Sprite.prototype.setWidth = function(width){

		this.width = width;
		this.height = width / (this.texture.width / this.texture.height);
		
	}


	var slide = window.slide =slide||{

		el:null,
		prop:null,
		multiple:1,
		isTocuh:false,
		rate:60,
		minx:0,
		maxx:0,
		sx:0,
		sy:0,
		zx:0,
		zy:0,
		lx:0,
		ly:0,
		st:0,
		at:0,
		ad:0,
		path:[]
 		
	};
	//el,prop,minx,maxx,rate
	slide.init = function(o){

		var t = this;

		t.els = o.els;

		t.el = o.el;
		t.prop = o.prop;
		t.minx = o.minx||0;
		t.maxx = o.maxx||0;
		t.rate = o.rate||60;
		t.multipleTemp = .15;
		t.multiple = o.multiple||1;
		t.allHeight = [];
		t.dataEls = [];
		t.isDont = true;
		t.el.forEach(function(e){

			t.allHeight.push(e.height);

		});

	}

	slide.touchstartCallback = function(e){

		if(this.isDont){
			return false;
		}

		slide.sx = e.x;
		slide.sy = e.y;
		this.isTocuh = true;
		this.st = new Date().getTime();
		this.path = [{x:e.x,y:e.y,t:new Date().getTime()}];

	}

	slide.touchmoveCallback = function(e){

		var t = this;

		if(t.isDont){
			return false;
		}

		document.getElementById('arrow').style.display = 'none';
		slide.isMove = true;

		slide.zx = e.x - slide.sx;
		slide.zy = e.y - slide.sy;

		var prop = t.prop;
		var y = t.ly + slide.zy * t.multiple;

		if(y>t.minx){
			y = t.minx;
		}

		if(Math.abs(y)>=t.maxx - innerHeight){
			y = -(t.maxx - innerHeight);
		}

		t.direction = slide.zy > 0 ? 1 : -1;

		t.path.push({x:e.x,y:e.y,t:new Date().getTime()});

		t.el.forEach(function(_e,i){

			if(y > _e.height*i){

				_e.visible = false;
				_e[prop] = y + t.getHeight(i);

			}else{
				
				_e.visible = true;
				_e[prop] = y + t.getHeight(i);

			}

		});

		t.y = y;

		t.moveCallback();

		t.addActive();

	}

	slide.touchendCallback = function(e){

		if(slide.isDont){
			slide.goPage();
			MtaH5.clickStat("1")
			return false;

		}
		if(!slide.isMove){

			return false;

		}		

		slide.ex = e.x;
		slide.ey = e.y;
		this.isTocuh = false;
		this.isMove = false;
		this.ly = this.el[0][this.prop];

		var l1 = this.path.pop();
		var h1 = this.path.pop();
		var l2 = this.path.pop();
		var h2 = this.path.pop();

		this.at = (l1.t + l2?l2.t:0) - (h1.t+h2?h2.t:0);
		this.ad = (l1.y + l2?l2.y:0) - (h1.y+h2?h2.y:0);

		this.at = this.at > 10000 ?10000:this.at;
		this.at = this.at <= 0 ?15:this.at; 

		this.ad = this.ad == 0 ? 5 : this.ad;

		this.inertia(this.at,this.ad);

	}

	slide.inertia = function(at,ad){

		var t = this;
		var ny = 0;
		var v = (Math.abs(ad/at) > 4 ? 4 : Math.abs(ad/at) )*t.rate;

		var run = function(){

			v = v * .95;
			if(v <= 0.1){
				t.isTocuh = true;
			}

			ny = t.ly + t.direction * v * t.multiple;

			if(ny>t.minx){
				ny = t.minx;
			}

			if(Math.abs(ny)>=t.maxx - innerHeight){
				ny = -(t.maxx - innerHeight);
			}

			t.y = t.ly = ny;

			t.el.forEach(function(_e,i){

				if(ny > _e.height*i){

					_e.visible = false;
					_e[t.prop] = ny + t.getHeight(i);

				}else{
					
					_e.visible = true;
					_e[t.prop] = ny + t.getHeight(i)

				}

			});
			slide.moveCallback();
			slide.addActive();
			!t.isTocuh&&requestAnimationFrame(run);

		}

		run();

	}

	slide.goPage = function(){

		document.getElementById('arrow').style.display = 'none';
		var t = this;

		var run = function(){

			ny = t.ly - 11;

			if(ny>t.minx){
				ny = t.minx;
			}

			if(Math.abs(ny)>=t.maxx - innerHeight){
				ny = -(t.maxx - innerHeight);
			}

			t.y = t.ly = ny;

			t.el.forEach(function(_e,i){

				if(ny > _e.height*i){

					_e.visible = false;
					_e[t.prop] = ny + t.getHeight(i);

				}else{
					
					_e.visible = true;
					_e[t.prop] = ny + t.getHeight(i)

				}

			});
			slide.moveCallback();
			slide.addActive();

			if(Math.abs(ny) >= t.el[0].height){
				t.isStop = true;
				t.isDont = false;
				t.minx = -t.el[0].height;
				app.runPic();

			}

			!t.isStop&&requestAnimationFrame(run);

		}

		run();

	}

	slide.getHeight = function(k){

		var h = this.allHeight;
		var all = 0;
		for (var i = 0; i < k; i++) {
			all+=h[i];
		}
		return all;

	}

	slide.addActive = function(){

		var y = Math.abs(this.y);

		this.dataEls.forEach(function(el,i){

			var a = el.a;
			var b = el.b;
			if(y >= a && y <= b){
				var r = (y-a)/(b - a);
				el.rCallback(r);

			}else if(y>b){
				if(true){
					el.rCallback(1);
					el.eCallback&&el.eCallback();
					el.isEC = true;

				}
			}else if(a-y>0){
				if(true){
					el.rCallback(0);
					el.sCallback&&el.sCallback();
					el.isSC = false;

				}
			}

		});

	}
