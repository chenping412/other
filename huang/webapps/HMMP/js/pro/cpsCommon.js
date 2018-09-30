//获取当前日期2年后的日期
function getYearsLaterDate(number){
	var currentDate=new Date();
	var maxYear=currentDate.getFullYear()+number;
	var maxMonth=currentDate.getMonth()+1;
	var maxDate=currentDate.getDate();
	var twoYearsLaterDate=maxYear+'-'+maxMonth+'-'+maxDate;
	return twoYearsLaterDate;
}
function getDaysBefore(days){
	var currentDate = new Date();
	var beforedays=new Date(currentDate.valueOf()- days * 24 * 60 * 60 * 1000);
	var year=beforedays.getFullYear();
	var month=beforedays.getMonth()+1;
	var date=beforedays.getDate();
	var daysBefore=year+'-'+month+'-'+date;
	return daysBefore;
}
function getDaysAfter(days){
	var currentDate = new Date();
	var afterdays=new Date(currentDate.valueOf()+ days * 24 * 60 * 60 * 1000);
	var year=afterdays.getFullYear();
	var month=afterdays.getMonth()+1;
	var date=afterdays.getDate();
	var daysAfter=year+'-'+month+'-'+date;
	return daysAfter;
}
//取日历控件值
function getDateSegment(dateSegment){
    var date = [];
	for(var i=0;i<dateSegment.getResult().length;i++){
		date.push(dateSegment.getResult()[i].sd+'|'+dateSegment.getResult()[i].ed);
	}
	return date;
 }
function promptInput(textObj,valueObj,msg){
	$('#'+textObj).val(msg);
	$('#'+textObj).css("color","#777777");
	$('#'+textObj).focus(function(){
	   if($(this).val()==msg){
	        $(this).val("");
	        $(this).css("color","#333333");
	        $('#'+valueObj).val("");
	   }else{
			$('#'+valueObj).val($(this).val());
	   }
	});
	$('#'+textObj).blur(function(){
	   if($(this).val()==""){
	        $(this).val(msg);
	        $(this).css("color","#777777");
	        $('#'+valueObj).val("");
	   }else if($(this).val()!=msg){
	   		$('#'+valueObj).val($(this).val());
	   }
	});
	}

function getCheckedCheckBoxVal(element1,element2){
	var checkedValue="";
	if(""==element2){
		$(element1).each(function(){
			//alert("each bedType==="+$(this).val());
			checkedValue=checkedValue+$(this).val()+",";
		  });
	}else{
		element2.find(element1).each(function(){
			checkedValue=checkedValue+$(this).val()+",";
		  });
	}
	return checkedValue;
}

//价格输入框
function clearNoNum(obj)  
{  
 obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
 obj.value = obj.value.replace(/^\./g,"");  //验证第一个字符是数字而不是.  
 obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
 obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
 obj.value=obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
}  
//配额输入框
function clearNoNumAndPoint(obj)  
{  
    obj.value = obj.value.replace(/\D/g,"");  //清除“数字”以外的字符  
}
//百分比输入框
function rateInput(obj){
	 obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
	 obj.value = obj.value.replace(/^\./g,"");  //验证第一个字符是数字而不是.  
	 obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
	 obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
	 obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
	 if(eval(obj.value)>100){
		 obj.value = 100;
	 }
}
function deleteHtmlWithLever(_this){
	var ppLength=_this.parents('tr').siblings().length;
	if(0==ppLength){//判断价格计划的个数
		_this.parents('table').prev('.list_two').remove();
		var roomLength=_this.parents('.list_item').find('.list_two').length;
		if(0==roomLength){//判断房型的个数
			/*删除当前价格计划当前页所属的酒店*/
			_this.parents('.list_item').prev('.list_one').remove();
			_this.parents('.list_item').remove();
			/*删除当前行*/
			_this.parents('tr').remove();
		}else{
			/*删除当前价格计划当前页所属的房型*/
			_this.parents('table').prev('.list_two').remove();
			_this.parents('table').remove();
			/*删除当前行*/
			_this.parents('tr').remove();
		}
	}else{
		/*删除当前行*/
		_this.parents('tr').remove();
	}
}
function judgePrice(value,limit){
	var isValidate=true;
	
	var testReg=/^(\d+(?:\.\d{1,2})?)$/;
	 if("undefined"!=typeof(value) && ""!=value){
		 if(testReg.test(value)){
		  		isValidate=true;
		  }else{
		  		new Tip({type:3,msg:'亲，底价需要大于0（最多支持两位小数）',timer:2000});
		  		return false;
		  }
	 }
	
	var limitLength=(limit+"").length;
	 if(testReg.test(value)){
		 if(value>limit){
		  		new Tip({type:3,msg:'亲，底价不可以超过'+limitLength+'位整数',timer:2000});
		  		return false;
		  }else{
		  		isValidate=true;
		  }
	 }
	 return isValidate;
}
function List(){
    this.value = [];
         /*添加*/
    this.add = function(obj){
        return this.value.push(obj);
    };
     
    /*大小*/
    this.size = function(){
        return this.value.length;
    };
 
    /*返回指定索引的值*/
    this.get = function(index){
        return this.value[index];
    };
 
    /*删除指定索引的值*/
    this.remove = function(index){
        this.value1 = [];                                               
        for(var i=0;i<this.size();i++){
            if(this.value[i]!=this.value[index]){                 
                this.value1.push(this.value[i]);
            }
        }
        this.value = this.value1;  
        delete this.value1;        
        return this.value;         
    };
     
    /*删除全部值*/
    this.removeAll = function(){
        return this.value=[];          
    };
 
    /*是否包含某个对象*/
    this.constains = function(obj){
        for(var i in this.value){
            if( obj == this.value[i] ){
                return true;
            }else{                     
                continue;
            }
        }
        return false;              
    };
 
}
