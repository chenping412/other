/**
* ajaxForm提交
*/
function ajaxFormSubmit(formID,v_url,v_target,callbackFunction,errorFunction){
    var options = {
    type: "post",
    url:v_url,
    target:v_target,
    success:callbackFunction,
    error:errorFunction};
    //console.log("options.success------"+options.success);
    
    jQuery('#'+formID).ajaxSubmit(options);
}

//酒店查询页面点击附加项
 function addition_open(hotelId ,pricePlanId , supplierCode, supplierName, hotelName, url, supplyway){
	 top.F.loading.show();
		$.ajax({
		type : "post",
    dataType : "html",
       async : false,
        data : {"hotelId":hotelId,"supplierCode":supplierCode,"pricePlanId":pricePlanId,"supplierName":supplierName,"hotelName":hotelName,"supplyway":supplyway}, 
     context : document.body, 
         url : url,
     success : function(data){
        	if(supplyway == 1){
        		var d =  window.top.dialog({
                    title: ' ',
                    padding: '0 0 20px 0',
                    content:data,
                    skin : 'saas_pop',
                    button : [
                        {
                            value: '确定选择',
                            skin : 'btn btn_save',
                            callback: function () {
                        		return window.top.save_bind();
                            }
                        },
                        {
                            value: '取消',
                            skin : 'btn btn_grey btn_exit',
                            callback: function () {
                            }
                        }
                    ]
                 }).showModal();
        	}else{
        		var d =  window.top.dialog({
                    title: ' ',
                    padding: '0 0 20px 0',
                    content:data,
                    skin : 'saas_pop',
                    button : [
                        {
                            value: '取消',
                            skin : 'btn btn_grey btn_exit',
                            callback: function () {
                            }
                        }
                    ]
                 }).showModal();
        	}
        	top.F.loading.hide();
            }, 
    error : function(e,t){
               new window.top.Tip({ type:3, msg:'打开失败！请您重试一次！' });
               top.F.loading.hide();
            }
    });
    }
 
 //立即售卖  新增价格计划处立即售卖
 function sale_open_p(pricePlanId,payMethod,hotelId,hotelName,cityCode,supplierCode,quotaType,url){
	 top.F.loading.show();
	 $.ajax({
         dataType : 'html',
          context : document.body,
            async : false,
             data : {'pricePlanId':pricePlanId,"payMethod":payMethod,"hotelId":hotelId,"hotelName":hotelName,"cityCode":cityCode,"supplierCode":supplierCode,"quotaType":quotaType},
              url : url,
         success : function(html){
             var d =  window.top.dialog({
                 title: ' ',
                 padding: '0 0 0px 0 ',
                 content: html,
                 skin : 'saas_pop',
					width: 780,
					button : [ 
                     {
                         value: '立即售卖',
                         skin : 'btn ',
                         callback: function () {
	                    	 top.toSale(function(r){
	                    		if(r==true){
	                    			d.remove();
	                    		}
	                    	 });
	                    	 return false;
                         },
                         autofocus: true
                     },
                     {
                         value: '取消',
                         skin : 'btn btn_grey btn_exit',
                         callback: function () {
                         }
                     }
                 ]
             }).showModal();
             top.F.loading.hide();
         },
         error : function(e,t){
        	 new Tip({ type:3, msg:'打开失败！请您重试一次！' });
        	 top.F.loading.hide();
        }
     });
 }
 
 //酒店查询页面点击渠道配额 , 20170807 mlq add 加一个参数paymethod
	function channelquota_open(pricePlanId,url, supplyway,quotaType,payMethod){
		console.info("payMethod="+payMethod);
		window.top.createIframeDialog({
         url : url+'?pricePlanId='+pricePlanId+'&supplyway='+supplyway+'&quotaType='+quotaType+'&other='+payMethod,//other参数后带框架参数  无用
         loadComplete : function(){             
         }
     });
	}
 
	//酒店查询页面点击价格计划公告
    function declare_open(pricePlanId,url, supplyway){
    	top.F.loading.show();
    	$.ajax({
            dataType : 'html',
            context : document.body,
            type : 'post',
           async : false,
            data : {"pricePlanId":pricePlanId,"supplyway":supplyway},
            url : url,
            success : function(html){
                var d =  window.top.dialog({
                    title: ' ',
                    padding: '0 0 0px 0',
                    content: html,
                    skin : 'saas_pop'
                }).showModal();
                top.F.loading.hide();
            },
            error : function(e,t){
	        	 new Tip({ type:3, msg:'失败！' });
	        	 top.F.loading.hide();
	        }
        })
    }

  //点击"关闭" 关闭对话框
    function closeDialog(){
    	top.removeIframeDialog();
     }
    
  // 单个按钮的确认框(例如保存失败时提醒)
  // title:标题（例如：'操作失败'）
  // content:内容
  // okfunction:回调函数
  // okValue:按钮名称（例如：'我知道了'）
    function singleDialog(title,content,okValue,okfunction,height,padding){
    	 window.top.createConfirm({
             title : title,
             padding : padding,
             content : '<p class="f_16" style="'+height+'">'+content+'</p>',
             ok : function(){
	    		 if(null != okfunction){
	            	 okfunction(); 
	             }
	    	 },
             okValue : okValue,
             cancel : false,
             skin : 'oneBtns',
         });
    }
   
    function singleDialog2(title,content,okValue,okfunction,height,padding){
    	createConfirm({
    		title : title,
    		padding : padding,
            height : height,
            content : '<p class="f_16"  style="'+height+'">'+content+'</p>',
            ok : function(){
	    		 if(null != okfunction){
	            	 okfunction(); 
	             }
	    	 },
            okValue : okValue,
            cancel : false,
            skin : 'oneBtns',
		});
    }
    
	//分页
	// totalPage 总页数 
	// totalCount 总条数
	// currentPage 当前页
	// currentPageId 给当前页域赋值  供查询使用
	// pagDivArea 分页div的id
	// callbacck 回调函数
    function initProductPage(totalPage,totalCount,currentPage,currentPageId,pagDivArea,callbacck){
    			console.log("totalPage---"+totalPage+",totalCount----"+totalCount+",currentPage---"+currentPage+",currentPageId----"+currentPageId);
    		    new Pager({
    		    	pagerid:pagDivArea,
    		           pno : currentPage,
    		         total : totalPage,
    		  totalRecords : totalCount,
        isShowTotalRecords :true,
    			  isGoPage : true,
    		          mode : 'click',
    		         click : function(n){
    		    			 if(isNaN(n)){
    		    				 n = 1
    		    			 }
    		    			 $('#'+currentPageId).val(n);
	    		    	     callbacck();
		    		         this.selectPage(n);
		    		         return false;
    		                }
    		    });
    	    }
    
  //控制星期是否全选
  //weeks: 星期定位   checkAllWeekId：星期全选定位
    function weekChecked(checkAllWeek,weeks){
    	var l = $(weeks+' span[uitype=checkbox].checked').length;
    	var c = $(checkAllWeek).find('input[type=checkbox]').attr('checked');
    	if(c == 'checked'){
    		if(l<8){
    			$(checkAllWeek).removeClass('checked');
    			$(checkAllWeek).find('input[type=checkbox]').attr('checked',false);
    		}
    	}else{
    		if(l==7){
    			$(checkAllWeek).addClass('checked');
    			$(checkAllWeek).find('input[type=checkbox]').attr('checked',true);
    		}
    	}
    }
    
    //对传进的日期进行加减  年  月  日 
    function getDate(date,year,month,day){
    	var newyear = date.getFullYear();
    	var newmonth = date.getMonth();
    	var newday = date.getDate();
    	
    	if(date == null || !date instanceof Date){
    		console.log('传入的date不是Date类型');
    		return new Date();
    	}
    	
    	if(year != null && year != ""){
    	    newyear = newyear + year;
    	}
    	if(month != null && month != ""){
    		newmonth = newmonth + month;
    	}
    	if(day != null && day != ""){
    		newday = newday + day;
    	}
    	
    	var newDate = new Date(newyear,newmonth,newday);
    	
    	var day = newDate.getMonth()+1;
    	
    	var newDateStr = newDate.getFullYear()+'-'+day+'-'+newDate.getDate();
    	
    	return newDateStr;
    }
    
    //附加项 渠道配额 售卖 ---日历框获取选中的日期
    function getCheckedDates(){
    	var arrt = [];
    	$('.daytbody .clickBg').each(function(index, element){
    		arrt.push($(this).find('.J_dates').val());	
    	})
    	return arrt;
    }
    
    function dateFormat(now,mask)
    {
        var d = now;
        var zeroize = function (value, length)
        {
            if (!length) length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++)
            {
                zeros += '0';
            }
            return zeros + value;
        };
     
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
        {
            switch ($0)
            {
                case 'd': return d.getDate();
                case 'dd': return zeroize(d.getDate());
                case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                case 'M': return d.getMonth() + 1;
                case 'MM': return zeroize(d.getMonth() + 1);
                case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                case 'yy': return String(d.getFullYear()).substr(2);
                case 'yyyy': return d.getFullYear();
                case 'h': return d.getHours() % 12 || 12;
                case 'hh': return zeroize(d.getHours() % 12 || 12);
                case 'H': return d.getHours();
                case 'HH': return zeroize(d.getHours());
                case 'm': return d.getMinutes();
                case 'mm': return zeroize(d.getMinutes());
                case 's': return d.getSeconds();
                case 'ss': return zeroize(d.getSeconds());
                case 'l': return zeroize(d.getMilliseconds(), 3);
                case 'L': var m = d.getMilliseconds();
                    if (m > 99) m = Math.round(m / 10);
                    return zeroize(m);
                case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
                case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
                case 'Z': return d.toUTCString().match(/[A-Z]+$/);
                // Return quoted strings with the surrounding quotes removed
                default: return $0.substr(1, $0.length - 2);
            }
        });
    }
    
    /*
     *   功能:实现VBScript的DateAdd功能.
     *   参数:interval,字符串表达式，表示要添加的时间间隔.
     *   参数:number,数值表达式，表示要添加的时间间隔的个数.
     *   参数:date,时间对象.
     *   返回:新的时间对象.
     *   var now = new Date();
     *   var newDate = DateAdd( "d", 5, now);
     *---------------   DateAdd(interval,number,date)   -----------------
     */
    function DateAdd(interval, number, date) {
        switch (interval) {
        case "y ": {
            date.setFullYear(date.getFullYear() + number);
            return date;
            break;
        }
        case "q ": {
            date.setMonth(date.getMonth() + number * 3);
            return date;
            break;
        }
        case "m ": {
            date.setMonth(date.getMonth() + number);
            return date;
            break;
        }
        case "w ": {
            date.setDate(date.getDate() + number * 7);
            return date;
            break;
        }
        case "d ": {
            date.setDate(date.getDate() + number);
            return date;
            break;
        }
        case "h ": {
            date.setHours(date.getHours() + number);
            return date;
            break;
        }
        case "m ": {
            date.setMinutes(date.getMinutes() + number);
            return date;
            break;
        }
        case "s ": {
            date.setSeconds(date.getSeconds() + number);
            return date;
            break;
        }
        default: {
           /* date.setDate(date.getDate() + number);
            return date;*/
            break;
        }
        }
    }
