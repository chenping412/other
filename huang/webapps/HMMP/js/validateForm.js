/**表单提交，全属性校验。用于固定表单的提交的一些常用校验*/
function trim(str) {
    if (str == null) {
        return "";
    }
    if (str.length == 0) {
        return "";
    }
    var i = 0, j = str.length - 1, c;
    for (; i < str.length; i++) {
        c = str.charAt(i);
        if (c != " ") {
            break;
        }
    }
    for (; j > -1; j--) {
        c = str.charAt(j);
        if (c != " ") {
            break;
        }
    }
    if (i > j) {
        return "";
    }
    return str.substring(i, j + 1);
}
function validateDate(date, format, alt) {
    var time = trim(date.value);
    if (time == "") {
        return;
    }
    var reg = format;
    var reg = reg.replace(/yyyy/, "[0-9]{4}");
    var reg = reg.replace(/yy/, "[0-9]{2}");
    var reg = reg.replace(/MM/, "((0[1-9])|1[0-2])");
    var reg = reg.replace(/M/, "(([1-9])|1[0-2])");
    var reg = reg.replace(/dd/, "((0[1-9])|([1-2][0-9])|30|31)");
    var reg = reg.replace(/d/, "([1-9]|[1-2][0-9]|30|31))");
    var reg = reg.replace(/HH/, "(([0-1][0-9])|20|21|22|23)");
    var reg = reg.replace(/H/, "([0-9]|1[0-9]|20|21|22|23)");
    var reg = reg.replace(/mm/, "([0-5][0-9])");
    var reg = reg.replace(/m/, "([0-9]|([1-5][0-9]))");
    var reg = reg.replace(/ss/, "([0-5][0-9])");
    var reg = reg.replace(/s/, "([0-9]|([1-5][0-9]))");
    reg = new RegExp("^" + reg + "$");
    if (reg.test(time) == false) {// 验证格式是否合法
        alert(alt);
        date.focus();
        return false;
    }
    return true;
}
function validateDateGroup(year, month, day, alt) {
    var array = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var y = parseInt(year.value);
    var m = parseInt(month.value);
    var d = parseInt(day.value);
    var maxday = array[m - 1];
    if (m == 2) {
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
            maxday = 29;
        }
    }
    if (d > maxday) {
        alert(alt);
        return false;
    }
    return true;
}
function validateCheckbox(obj, alt) {
    var rs = false;
    if (obj != null) {
        if (obj.length == null) {
            return obj.checked;
        }
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked == true) {
                return true;
            }
        }
    }
    alert(alt);
    return rs;
}
function validateRadio(obj, alt) {alert(1);
    var rs = false;
    if (obj != null) {
        if (obj.length == null) {
            return obj.checked;
        }
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked == true) {
                return true;
            }
        }
    }
    alert(alt);
    return rs;
}
function validateSelect(obj, alt) {
    var rs = false;
    if (obj != null) {
        for (var i = 1; i < obj.options.length; i++) {
            if (obj.options[i].selected == true) {
                return true;
            }
        }
    }
    alert(alt);
    return rs;
}
function validateEmail(email, alt, separator) {
    var mail = trim(email.value);
    if (mail == "") {
        return true;
    }
    var em;
    var myReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/;
    if (separator == null) {
        if (myReg.test(email.value) == false) {
            alert(alt);
            email.focus();
            return false;
        }
    } else {
        em = email.value.split(separator);
        for (i = 0; i < em.length; i++) {
            em[i] = em[i].trim();
            if (em[i].length > 0 && myReg.test(em[i]) == false) {
                alert(alt);
                email.focus();
                return false;
            }
        }
    }
    return true;
}

function getStringLength(str) {
	var endvalue = 0;
	var sourcestr = new String(str);
	var tempstr;
	for (var strposition = 0; strposition < sourcestr.length; strposition++) {
		tempstr = sourcestr.charAt(strposition);
		if (tempstr.charCodeAt(0) > 255 || tempstr.charCodeAt(0) < 0) {
			endvalue = endvalue + 2;
		} else {
			endvalue = endvalue + 1;
		}
	}
	return (endvalue);
}

function validateForm(theForm) {// 若验证通过则返回true
	var disableList = new Array();
    var field = theForm.elements; // 将表单中的所有元素放入数组
    for (var i = 0; i < field.length; i++) {
        var empty = false;
        var value = trim(field[i].value);
		if (value.length == 0) {// value是否是空值
			empty = true;
		}
		var disabled=$("#"+field[i].id).attr("disabled");
		//1、 非空属性验证 emptyInfo
        var emptyInfo = $("#"+field[i].id).attr("emptyInfo");//.属性无法识别非原生属性,使用jQuery改写
        var notCheck = $("#"+field[i].id).attr("notCheck");
        if (emptyInfo != null && empty == true && disabled!="disabled" && notCheck == undefined) {
            alert(emptyInfo);
			if(!arguments[1]){
				 setTimeout(function(){
		           $(field[i]).focus();
		         },100);
			}
				//$(field[i]).focus();
			return false;
		}
		// 2、最大长度验证lengthInfo
		var lengthInfo =$("#"+field[i].id).attr("lengthInfo");
		if (lengthInfo != null && disabled!="disabled") {
			var length =$("#"+field[i].id).attr("length");
			if(getStringLength(value) >length){
				alert(lengthInfo);
				if(!arguments[1])
					$(field[i]).focus();
				return false;
			}
		}
		//以下代码规则暂未开放,若有需要，可放开。

		//3、增加开始-结束时间大小,在需要比较的两个时间域里其中一个中增加timeCompare属性，值为两个区域的id，以“-”分隔
		//提示信息目前固定：开始时间不能晚于结束时间
//		var dateids=field[i].timeCompare;
//		if(dateids!=null){
//			var ids=dateids.split("-");
//			if(ids.length==2){
//				if(!dateValid(ids[0],ids[1])){
//					return false;
//				}
//			}
//		}
//		4、validatorType设置的 属性校验
		var validatorType = $("#"+field[i].id).attr("validatorType");
		var rs = true;
		if (validatorType == "Select" && disabled!="disabled" ) {
			rs = validateSelect(field[i],$("#"+field[i].id).attr("errorInfo"));
		}
		if (validatorType == "Email" && disabled!="disabled") {
			rs = validateEmail(field[i], $("#"+field[i].id).attr("errorInfo"));
		}
		if (rs == false) {
			return false;
		}
//
//		if (validatorType != null) {
//			var rs = true;
//			if (validatorType == "javascript") {
//				eval("rs=" + field[i].functionName + "()");
//				if (rs == false) {
//					return false;
//				} else {
//					continue;
//				}
//			} else {
//				if (validatorType == "disable") {// 提交表单前disable的按钮
//					disableList.length++;
//					disableList[disableList.length - 1] = field[i];
//					continue;
//				} else {
//					if (validatorType == "Date") {
//						rs = validateDate(theForm.elements(field[i].fieldName), field[i].format, field[i].errorInfo);
//					} else {
//						if (validatorType == "DateGroup") {
//							rs = validateDateGroup(theForm.elements(field[i].year), theForm.elements(field[i].month), theForm.elements(field[i].day), field[i].errorInfo);
//						} else {
//							if (validatorType == "Checkbox") {
//								rs = validateCheckbox(theForm.elements(field[i].fieldName), field[i].errorInfo);
//							} else {
//								if (validatorType == "Radio") {
//									rs = validateRadio(theForm.elements(field[i].fieldName), field[i].errorInfo);
//								} else {
//									if (validatorType == "Select") {
//										rs = validateSelect(theForm.elements(field[i].fieldName), field[i].errorInfo);
//									} else {
//										if (validatorType == "Email") {
//											rs = validateEmail(theForm.elements(field[i].fieldName), field[i].errorInfo);
//										} else {
//											alert("\u9a8c\u8bc1\u7c7b\u578b\u4e0d\u88ab\u652f\u6301, fieldName: " + field[i].name);
//											return false;
//										}
//									}
//								}
//							}
//						}
//					}
//				}
//			}
//			if (rs == false) {
//				return false;
//			}
//		} else {
			// 一般规则的验证
			if (empty == false) {
				var v =$("#"+field[i].id).attr("validator");// 获取其validator属性(正则表达式的字符串)
				if (v) {
					var reg = new RegExp(v);
					if (reg.test(field[i].value) == false) {
						alert($("#"+field[i].id).attr("errorInfo"));//配合 errorInfo提示信息属性
						if(!arguments[1])
							field[i].focus();
						return false;
					}
				} // 如果该属性不存在,忽略当前元素
				var maxvalue=$("#"+field[i].id).attr("maxValue");
				if(!maxvalue){
					continue;
				}else{
					if(parseFloat(field[i].value)>parseFloat(maxvalue)){
						alert($("#"+field[i].id).attr("maxInfo"));
						field[i].focus();
						return false;
					}
				}
			}
//		}
	}
//	if(disableList.length>0){
//		for (i = 0; i < disableList.length; i++) {
//			disableList[i].disabled = true;
//		}
//	}
	
	return true;
}