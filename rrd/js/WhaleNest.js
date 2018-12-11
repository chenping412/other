!function(){

	var WhaleNest = WhaleNest || {};
	
    /*
    *   功能单元 start
    */

    var Util = {};

    Util.getUrlParams = function() {
        //返回参数的对象
        var url = window.location.search;
        var ansObj = new Object(); 
        if (url.indexOf("?") != -1) { 
            var str = url.substr(1).split("&"); 
            for (var i = 0; i < str.length; i++) {
                var tempArr = str[i].split("="); 
                ansObj[tempArr[0]] = decodeURI(tempArr[1]);
            }
        }
        return ansObj;
    };
    Util.getSourceFromUA = function() {
        // 当前客户端 weixin,qq,alipay,weibo,didi,uber,fulshDriver,taxiDriver,other
        var sourceObj = {};
        var isWeixin = (navigator.userAgent.match(/micromessenger/i) != null);
        var isQQ = (navigator.userAgent.match(/QQ\//i) != null);
        var isWeibo = (navigator.userAgent.toLowerCase().match(/WeiBo/i) == "weibo");
        var isAlipay = (navigator.userAgent.match(/AlipayClient|AliApp/i) != null) && (!isWeibo);
        var isDiDi = (navigator.userAgent.match(/didi.passenger/i) != null);
        var isEcho = (navigator.userAgent.match(/didi.lite/i) != null);
        var isDriver = (navigator.userAgent.match(/didigsui.*_(.+)_\d+$/i) != null) || (navigator.userAgent.match(/ddudriver.*_(.+)$/i) != null); //kuaicheDriver
        var datatype_taxi = Util.getUrlParams().datatype;
        var isTaxiDriver = (navigator.userAgent.match(/ddTaxiDriverAndroid.*/i) != null) || (navigator.userAgent.match(/ddTaxiDriverIOS.*/i) != null) || (datatype_taxi == '2') || (datatype_taxi == '102');
        var source = isWeixin ? "weixin" : (isAlipay ? "alipay" : (isQQ ? "mqq" : (isWeibo ? "weibo" : (isDiDi ? "didi" : (isEcho ? "uber" : (isDriver ? "flushDriver" : (isTaxiDriver ? "taxiDriver" : 'other')))))));
        sourceObj.source = source
        return sourceObj;
    };
    Util.checkPhoneValid = function(phone) {
        /*检测手机号合法性*/
        var PhoneReg = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9]|110)[0-9]{8}$/;
            return PhoneReg.test(phone);
    };


    WhaleNest = Object.assign(Util,WhaleNest);

    /*
    *   功能单元 end
    */


	/*
	*	分享预设 start
	*/

    var Share = {};

	Share.shareSetting = {

		// token 获取地址
		url:'//api.whalesgeek.net/get_wx_sign',
		
		// 是否异步获取
		async:true,

		//设置分享成功回调函数
		callback:null,

        //是否初始化
        isReady:false,

        //wx url
        wxUrl:"//res.wx.qq.com/open/js/jweixin-1.0.0.js",

        //默认分享信息
        info:{
            title:"分享标题",
            desc:"分享描述",
            link:window.location.href,
            imgUrl:"https://tinypng.com/images/panda-chewing.png",
            timeLineCallback:function(){},
            friendCallback:function(){}
        } 

	}

    Share.setAlipay = function(info){

        var _info = info;

        var alipayShare = document.getElementsByTagName('alipay-share');
        if(alipayShare.length != 0 ){
            alipayShare[0].remove();
            alipayShare[1].remove();
            alipayShare[2].remove();
            alipayShare[3].remove();
        }


        var title = document.createElement('meta');
            title.setAttribute("name", "Alipay:title");
            title.setAttribute("content", _info.title);

        var desc = document.createElement('meta');
            desc.setAttribute("name", "Alipay:desc");
            desc.setAttribute("content", _info.desc);

        var imgUrl = document.createElement('meta');
            imgUrl.setAttribute("name", "Alipay:imgUrl");
            imgUrl.setAttribute("content", _info.imgUrl);

        var link = document.createElement('meta');
            link.setAttribute("name", "Alipay:link");
            link.setAttribute("content", _info.link);

            title.className = desc.className = imgUrl.className = link.className = 'alipay-share';

        var meta = document.getElementsByTagName("meta")[0];
            meta.parentNode.insertBefore(title, meta);
            meta.parentNode.insertBefore(desc, meta);
            meta.parentNode.insertBefore(imgUrl, meta);
            meta.parentNode.insertBefore(link, meta);

    }

    Share.setWX = function(info){

        var _info = info;

        if(!this.shareSetting.isReady)return false;

        wx.onMenuShareTimeline({
            debug: false, 
            title : _info.fTitle||_info.title, 
            link : _info.link, 
            imgUrl : _info.imgUrl,    
            success : function() {
                _info.timeLineCallback();
            },
            cancel : function() {
                
            }
        });

        wx.onMenuShareAppMessage({
            title : _info.title, 
            desc : _info.desc, 
            link : _info.link, 
            imgUrl : _info.imgUrl,
            success : function() {
                _info.friendCallback();
            },
            cancel : function() {
                
            }
        });
        wx.error(function (res) {
          //alert(res.errMsg);
        });

    }

    Share.pushWXScript = function(){

        var _self = this,
            script = document.createElement('script'),
            doms = document.getElementsByTagName("script")[0];

        script.async = true;
        script.src = _self.shareSetting.wxUrl;
        doms.parentNode.insertBefore(script, doms);

        script.onload = function(){

            _self.post();

        }

    }

	Share.post = function(){

		var _self = this;

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(e){

			if(xhr.readyState == 4){

				if(xhr.status == 200||xhr.status == 304){

					_self.initShare(JSON.parse(xhr.responseText));

				} 

			}

		}

		xhr.open('POST', _self.shareSetting.url, _self.shareSetting.async);

		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//xhr.setRequestHeader("Content-type","application/json");
		xhr.send("url="+encodeURIComponent(location.href.split('#')[0]));
		//xhr.send({'url':encodeURIComponent(location.href.split('#')[0])});

	}		

	Share.initShare = function(data){

        var _self = this;

    	wx.config({
            debug: false, 
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage"
                ]
        });
        wx.ready(function() {
            
            _self.shareSetting.isReady = true;

            _self.setShare();

        });

	}

	Share.setShare = function(info){

        var _self = this,
            _source = _self.getSourceFromUA().source,
            _info = _self.shareSetting.info;

        _info = Object.assign(_info,info);

        switch(_source)
        {
        case "weixin":

          _self.setWX(_info);

          break;
        case "alipay":

          _self.setAlipay(_info);

          break;
        } 
	}



    WhaleNest = Object.assign(Share,WhaleNest);

    /*
    *   分享预设 end
    */




    //init
    !function(){

        Share.pushWXScript();

    }();

	window.WhaleNest = WhaleNest;


}();

