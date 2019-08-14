/*走马灯效果*/

var lampIndex=1;

function lamp(dom,stepWidth,step,callback){
    var div=$(dom);
    var m=0;
    var timer=setInterval(function(){
        if(m<step){
            div.width(stepWidth*m);
            m++;
        }else {
            div.width(153);
            m=0;
            clearInterval(timer);
            setTimeout(function(){
                if(callback) callback();
            },600)
        }
    },1000/step)
}

function lamp2(){
    lamp('.lamp1',38,4,function(){
        lamp('.lamp2',14,9,function(){
            lamp('.lamp3',19,8,function(){
                lamp('.lamp4',19,8,function(){
                    lamp('.lamp5',19,8,function(){
                        lamp('.lamp6',19,8,function(){
                            lamp2();
                        });
                    });
                });
            });
        });
    });
}
lamp2();



/*线条和黄点闪烁*/

function lineLamp(index){
    var green=$('.green'+index);
    var line=$('.line'+index);
    var lineHeight=line.css('height').replace('px','');
    var m=0;
    var max=10;
    var timerInterval=setInterval(function(){
        if(m<=max){
            line.css('height',lineHeight/max*m);
            m++;
        }else {
            clearInterval(timerInterval);
            green.addClass('active');
            setTimeout(function(){
                green.removeClass('active');
            },2000)
        }
    },1000/max)
}

var lineIndex=1;
setInterval(function(){
    var random=Math.ceil(Math.random()*10);
    console.log(random)
    if(random == lineIndex) {
        lineIndex=random+1;
    }else{
        lineIndex=random
    }
    if(lineIndex>=10) lineIndex=10;
    lineLamp(lineIndex);
    lineIndex++;
},3000);


