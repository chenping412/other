projectPath = "http://" + window.location.host + "/HMMP/";
top.F.loading.hide();
var bedTypeList = [];
var breakfastTypeList = [];
var pricePlanList = [];
var additionalList = [];
var additionalMap = {};
var pricePlanMap = {};
var saleCurrency = '';
var baseCurrency = '';
var rateMap = {};

$(function() {
	initAgentAutocomplete(bindCredit);
	initSupplyAutocomplete(initAddOrder);
	initHotelAutocomplete(initAddOrder);
	var rateStr = $('input[name="exchange"]').val();
	var baseOrderRequestJSON = $('input[name="baseOrderRequestJSON"]').val();
	if (rateStr) {
		rateMap = eval('(' + rateStr + ')');
	}
	var payMethod = $('select[name="payMethod"]').val();
	if (payMethod && payMethod === 'pay') {
		$('.saleCPrice').show();
		$('.additionalSaleCPrice').show();
	} else {
		$('.saleCPrice').hide();
		$('.additionalSaleCPrice').hide();
	}
	F.UI.scan();
	// 调用表单验证控件
	var valid = new validform('#addOrderFrom', {
		msgTooltip : true
	});
	$(".btn_save_long").on('click',	function() {
		// 校验参数
		valid.validate();
		if ($(".validform_error").length > 0) {
			$("body,html").animate({
				scrollTop : 0
			}, 300)
			return;
		}
		if ($('tr[name="roomTableTr"]').length < 1) {
			alert("请录入产品房费!")
			return;
		}
		var orderDayPriceList = getRoomInfo();
		var orderAdditionalList = getAdditionalInfo();
		var payMethod = $('select[name="payMethod"]').val();
		if (!validateOrderProduct(orderDayPriceList, payMethod)){
			return;
		}
		if (!validateOrderAdditional(orderAdditionalList, payMethod)) {
			return;
		}
		var agentCode,agentName,guestName,settlement,channelCode,supplyCode,supplyName,hotelId,hotelName,payMethod,remark,confirmNo,roomNo,orderType;
		agentCode = $('input[name="agentCode"]').val();
		agentName = $('input[name="agentName"]').val();
		guestName = $('input[name="guestName"]').val();
		customerOrderCode = $('input[name="customerOrderCode"]').val();
		channelCode = $('select[name="channelCode"]').val();
		supplyCode = $('input[name="supplyCode"]').val();
		supplyName = $('input[name="supplyName"]').val();
		hotelId = $('input[name="hotelId"]').val();
		hotelName = $('input[name="hotelName"]').val();
		confirmNo = $('input[name="confirmNo"]').val();
		roomNo = $('input[name="roomNo"]').val();
		payMethod = $('select[name="payMethod"]').val();
		remark = $('textarea[name="remark"]').val();
		orderType = $('select[name="orderType"]').val();
		var data = {
			agentCode:agentCode,
			agentName:agentName,
			guestName:guestName,
			customerOrderCode:customerOrderCode,
			channelCode:channelCode,
			supplyCode:supplyCode,
			supplyName:supplyName,
			hotelId:hotelId,
			hotelName:hotelName,
			payMethod:payMethod,
			remark:remark,
			confirmNo:confirmNo,
			roomNo:roomNo,
			orderType:orderType,
			orderDayPriceList:orderDayPriceList,
			orderAdditionalList:orderAdditionalList
		};
		// 按钮灰色不可用
//		$this.attr("class", "btn_save_no");
		F.loading.show('mask');
		$.ajax({
	        type:'POST',
	        dataType : 'json',
	        contentType : 'application/json; charset=UTF-8',
	        context : document.body,
	        url : projectPath+'admin/addOrder',
	        data:JSON.stringify(data),
	        success : function(data) {
	            if(data.result && data.result == 1){
	                new Tip({ msg: '保存成功',timer: 3000});
	                var orderId;
	                if (data.obj && data.obj.orderId) {
	                	orderId = data.obj.orderId;
	                	var path = projectPath+'admin/toEditOrder/'+orderId;
	                	$(window.parent.document).find(".order-manage").children().attr('src',path);
	                }
	            }else{
	                new Tip({ msg: data.errorReason,timer: 3000, type:2});
	            }
	            F.loading.remove();
	        }
	    });
	});
	$('input[name="roomStartDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="roomEndDate"]').datepicker( "option", "minDate", dateText );
			/*var startDate,endDate;
			startDate = $('input[name="roomStartDate"]').val();
			endDate = $('input[name="roomEndDate"]').val();
			if (startDate && endDate) {
				batchAppend(startDate, endDate, 'room');
			}*/
		}
	});
	$('input[name="roomEndDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="roomStartDate"]').datepicker( "option", "maxDate", dateText );
			/*var startDate,endDate;
			startDate = $('input[name="roomStartDate"]').val();
			endDate = $('input[name="roomEndDate"]').val();
			if (startDate && endDate) {
				batchAppend(startDate, endDate, 'room');
			}*/
		}
	});
	$('input[name="additionalStartDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="additionalEndDate"]').datepicker( "option", "minDate", dateText );
			/*var startDate,endDate;
			startDate = $('input[name="additionalStartDate"]').val();
			endDate = $('input[name="additionalEndDate"]').val();
			if (startDate && endDate) {
				batchAppend(startDate, endDate, 'additional');
			}*/
		}
	});
	$('input[name="additionalEndDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="additionalStartDate"]').datepicker( "option", "maxDate", dateText );
			/*var startDate,endDate;
			startDate = $('input[name="additionalStartDate"]').val();
			endDate = $('input[name="additionalEndDate"]').val();
			if (startDate && dateText) {
				batchAppend(startDate, endDate, 'additional');
			}*/
		}
	});
	if (baseOrderRequestJSON) {
		var baseData = eval('(' + baseOrderRequestJSON + ')');
		$('input[name="hotelId"]').val(baseData.hotelId);
		$('input[name="hotelName"]').val(baseData.hotelName);
		$('input[name="supplyCode"]').val(baseData.supplyCode);
		$('input[name="supplyName"]').val(baseData.supplyName);
		$('input[name="supplyMultipleCurrency"]').val(baseData.isMultipleCurrency);
		$('input[name="supplySettlementCurrency"]').val(baseData.settlementCurrency);
		var item = {
			hotelId:baseData.hotelId,
			hotelName:baseData.hotelName,
			supplyCode:baseData.supplyCode,
			supplyName:baseData.supplyName,
			settlementCurrency:baseData.settlementCurrency,
			isMultipleCurrency:baseData.isMultipleCurrency
		}
		initAddOrder(null,{item:item},baseData);
	}
	$('select[name="payMethod"]').bind('change',function(){
		var val = $(this).val();
		if (val === 'pay') {
			$('.saleCPrice').show();
			$('.additionalSaleCPrice').show();
			$('tr',$('#roomInfoDay')).each(function(k,v) {
				var trName = $(v).attr('name');
				if (trName && trName === 'roomTableTr') {
					$('#saleCCurrency',$(v)).html('CNY');
				}
			});
			$('tr',$('#additionDay')).each(function(k,v) {
	       		 var trName = $(v).attr('name');
	       		 if (trName && trName === 'adtTr') {
	       			 $('#additionalSaleCCurrency',$(v)).html('CNY');
	       		 }
	       	});
		} else {
			$('.saleCPrice').hide();
			$('.additionalSaleCPrice').hide();
		}
		calculateProfit();
	});
});

function batchInit(data){
	$.each(data.saleDateList,function(k,v){
		var uuidValue = generateUUID();
		// 组装拼接
		var roomTypeOption = '', bedTypeOption = '', breakfastOption = '';
		$.each(pricePlanList, function(k, v) {
			var pricePlanId = v.pricePlanId;
			var pricePlanName = v.pricePlanName;
			var roomTypeId = v.roomTypeId;
			if (!pricePlanId) {
				pricePlanId = -1;
			}
			if (!pricePlanName) {
				pricePlanName = '';
			}
			pricePlanId = pricePlanId + '@' + roomTypeId;
			roomTypeOption = roomTypeOption + '<option value=' + pricePlanId
					+ '>' + pricePlanName + '(' + v.roomTypeName + ')</option>';
		});
		$.each(breakfastTypeList, function(k, v) {
			breakfastOption = breakfastOption + '<option value=' + v.breakfastNum
					+ '>' + v.breakfastNumText + '</option>';
		});
		var trInfo = "<tr name='roomTableTr' class ='RoomInfo_list' id='"
			+ uuidValue
			+ "'>"
			+ "<input type='hidden' name='uuid' value='"
			+ uuidValue
			+ "'/>"
			+ "<td class='p_115'><span><select name='pricePlanId' style='width:170px;height:28px;'><option value=''>请选择</option>"
			+ roomTypeOption
			+ "</select></span></td>"
			+ "<td class='p_115'><span><input type='text' name='bedType' class='order-type-input' readonly='readonly' value='' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='saleDate' class='order-date-input' readonly='readonly' value='" + v + "' autocomplete='off' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='roomNum' class='order-number-input' value='1' onblur='calculateProfit();' /></span></td>"
			+ "<td class='p_115 saleCPrice'><span><input type='text' name='saleCPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='saleCCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='saleBPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='saleBCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='basePrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='baseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><a onclick='pricePlanDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
		$("#roomTarget").before(trInfo);
		var row = $('#'+uuidValue);
		var supplySettlementCurrency = $('input[name="supplySettlementCurrency"]').val();
		var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
		$('#saleBCurrency',row).html(data.targetCurrency);
		$('#saleCCurrency',row).html(data.targetCurrency);
		var payMethod = $('select[name="payMethod"]').val();
		if (payMethod && payMethod === 'pay') {
			$('.saleCPrice').show();
			$('.additionalSaleCPrice').show();
		} else {
			$('.saleCPrice').hide();
			$('.additionalSaleCPrice').hide();
		}
		if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
			var selectBaseStr = '<select name="baseCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
			$('#baseCurrency',row).html(selectBaseStr);
			$('select[name="baseCurrency"]',row).val(supplySettlementCurrency);
		} else {
			$('#baseCurrency',row).html(supplySettlementCurrency);
		}
		var key = data.pricePlanId + '@' + data.roomTypeId;
		$('select[name="pricePlanId"]', row).val(key);
		var pricePlan = pricePlanMap[key];
		if (pricePlan) {
			$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
			bindPrice(row,pricePlan,v,data.targetCurrency);
		}
		$('select[name="pricePlanId"]', row).change(function() {
			var pricePlanId = $(this).val();
			var saleDate = $('input[name="saleDate"]', row).val();
			var uuid = $('input[name="uuid"]', row).val();
			var pricePlan = pricePlanMap[pricePlanId];
			if (pricePlan) {
				$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
				saleCurrency = pricePlan.saleBCurrency;
				baseCurrency = pricePlan.baseCurrency;
			}
			bindPrice(row,pricePlan,saleDate);
		});
		$('input[name="saleDate"]', row).datepicker({
	        changeMonth: true,
	        changeYear: true,
			onSelect: function(dateText, inst){
				var pricePlanId = $('select[name="pricePlanId"]',row).val();
				var pricePlan = pricePlanMap[pricePlanId];
				if (pricePlan) {
					bindPrice(row,pricePlan,dateText);
				}
			}
		});
		$('input[name="roomNum"]', row).on('blur',function(){
			var val = $(this).val();
			var pricePlanId = $('select[name="pricePlanId"]', row).val();
			var pricePlan = pricePlanMap[pricePlanId];
			var saleDate = $('input[name="saleDate"]',row).val();
			if (pricePlan && saleDate) {
				bindPrice(row,pricePlan,saleDate);
			}
		});
	});
}

function batchAppend(type){
	var getDate = function(str){
        var tempDate = new Date("2000-1-1");
        var list = str.split("-");
        tempDate.setFullYear(list[0]);
        //考虑到当前日期天数可能超过30号,2月是没有30号的，先setMonth会导致月份产生进位而再加1
        //故此先设置日期，再设置月份
        tempDate.setDate(list[2]);
        tempDate.setMonth(list[1]-1);
        return tempDate;
   }
	function Rnub(day){
    	if(parseInt(day) < 10){
    		return "0" + day;
    	}else{
    		return day + "";
    	}
    }
	if (type === 'room') {
		/*$('tr',$('#roomInfoDay')).each(function(k,v) {
			var trName = $(v).attr('name');
			if (trName && trName === 'roomTableTr') {
				$(v).remove();
			}
		});*/
		var beginDate = $('input[name="roomStartDate"]').val();
		var endDate = $('input[name="roomEndDate"]').val();
		var pricePlanId = $('select[name="pricePlanRoom"]').val();
		var room = $('input[name="room"]').val();
		if (!beginDate) {
			new Tip({ msg: '请选择开始日期',timer: 3000, type:2});
			return false;
		}
		if (!endDate) {
			new Tip({ msg: '请选择结束日期',timer: 3000, type:2});
			return false;
		}
		if (!pricePlanId) {
			new Tip({ msg: '请选择产品',timer: 3000, type:2});
			return false;
		}
		if (!room) {
			new Tip({ msg: '请选输入间数',timer: 3000, type:2});
			return false;
		}
		
		var date1 = getDate(beginDate);
	    var date2 = getDate(endDate);
	    while(!(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())){
	    	var dateString = date1.getFullYear() + "-" + Rnub((date1.getMonth() + 1)) + "-" + Rnub(date1.getDate());
	    	appendRoomDetail(dateString,pricePlanId,room);
	    	date1.setDate(date1.getDate() + 1);
	    }
	    $('#roomDate').hide();
    }
    if (type === 'additional') {
    	/*$('tr',$('#additionDay')).each(function(k,v) {
       		 var trName = $(v).attr('name');
       		 if (trName && trName === 'adtTr') {
       			 $(v).remove();
       		 }
       	});*/
    	var beginDate = $('input[name="additionalStartDate"]').val();
		var endDate = $('input[name="additionalEndDate"]').val();
		var additional = $('select[name="additional"]').val();
		var count = $('input[name="room"]').val();
		if (!beginDate) {
			new Tip({ msg: '请选择开始日期',timer: 3000, type:2});
			return false;
		}
		if (!endDate) {
			new Tip({ msg: '请选择结束日期',timer: 3000, type:2});
			return false;
		}
		if (!additional) {
			new Tip({ msg: '请选择附加项',timer: 3000, type:2});
			return false;
		}
		if (!count) {
			new Tip({ msg: '请输入数量',timer: 3000, type:2});
			return false;
		}
		var date1 = getDate(beginDate);
	    var date2 = getDate(endDate);
	    while(!(date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate())){
	    	var dateString = date1.getFullYear() + "-" + Rnub((date1.getMonth() + 1)) + "-" + Rnub(date1.getDate());
	    	appendAdditionalDetail(dateString, additional, count);
	    	date1.setDate(date1.getDate() + 1);
	    }
	    $('#additionalDate').hide();
    }
}

/**
 * 绑定分销商剩余信用额度
 * @param event
 * @param ui
 * @returns
 */
function bindCredit(event, ui) {
	var amount = 0.00;
	if (ui && ui.item) {
		if (ui.item.amount) {
			amount = parseFloat(ui.item.amount);
			amount = amount.toFixed(2);
		}
		$('input[name="agentMultipleCurrency"]').val(ui.item.isMultipleCurrency);
		$('input[name="agentSettlementCurrency"]').val(ui.item.settlementCurrency);
		$('input[name="credit"]').val(amount);
		var roomTr = $('tr[name="roomTableTr"]');
		var adtTr = $('tr[name="adtTr"]');
		var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
		if (roomTr.length > 0) {
			$.each(roomTr,function(k,v){
				if (ui.item.isMultipleCurrency && ui.item.isMultipleCurrency == 1) {
					$('#saleBCurrency',v).html(selectSaleBStr);
					$('select[name="saleBCurrency"]',v).val(ui.item.settlementCurrency);
				} else {
					$('#saleBCurrency',v).html(ui.item.settlementCurrency);
				}
				$('#saleCCurrency',v).html(ui.item.settlementCurrency);
				var pricePlanId = $('select[name="pricePlanId"]',v).val();
				var saleDate = $('input[name="saleDate"]',v).val();
				var pricePlan = pricePlanMap[pricePlanId];
				if (pricePlan && saleDate) {
					bindPrice(v,pricePlan, saleDate);
				}
			});
		}
		/*if (adtTr.length > 0) {
			$.each(adtTr,function(k,v){
				var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
				var agentMultipleCurrency = ui.item.isMultipleCurrency
				var chargeId = $('select[name="additionalChargeId"]',v).val();
				var additional = additionalMap[chargeId];
				var saleRate = 1;
				if (agentMultipleCurrency && agentMultipleCurrency == 1) {
					$('#additionalSaleBCurrency',v).html(selectSaleBStr);
					$('select[name="saleBCurrency"]',v).val(ui.item.settlementCurrency);
					$('select[name="saleBCurrency"]',v).bind('change',function(){
						var val = $(this).val();
						var saleRate = 1;
						if (additional) {
							if (val != additional.saleBCurrency) {
								var key = additional.saleBCurrency + '-' + val;
								if (rateMap[key] && rateMap[key].rate && additional.saleBPrice) {
									saleRate = rateMap[key].rate;
									$('input[name="additionalSaleBPrice"]',v).val((additional.saleBPrice * saleRate).toFixed(2));
									calculateProfit();
								}
							} else {
								if (additional.saleBPrice) {
									$('input[name="additionalSaleBPrice"]',v).val(additional.saleBPrice);
									calculateProfit();
								}
							}
						}
						$('#additionalSaleCCurrency',v).html(saleCurrency);
					});
				} else {
					$('#additionalSaleBCurrency',v).html(ui.item.settlementCurrency);
				}
				$('#additionalSaleCCurrency',v).html(ui.item.settlementCurrency);
				var saleCurrency = ui.item.settlementCurrency
				if (additional && saleCurrency) {
					if (saleCurrency != additional.saleBCurrency) {
						var key = additional.saleBCurrency + '-' + saleCurrency;
						if (rateMap[key] && rateMap[key].rate && additional.saleBPrice) {
							saleRate = rateMap[key].rate;
							$('input[name="additionalSaleBPrice"]',v).val((additional.saleBPrice * saleRate).toFixed(2));
							calculateProfit();
						}
					} else {
						if (additional.saleBPrice) {
							$('input[name="additionalSaleBPrice"]',v).val(additional.saleBPrice);
							calculateProfit();
						}
					}
				}
				$('select[name="additionalChargeId"]', v).change(function() {
					var chargeId = $(this).val();
					var additional = additionalMap[chargeId];
					if (additional) {
						$('input[name="additionalSaleBPrice"]',v).val(additional.saleBPrice);
						$('input[name="additionalBasePrice"]',v).val(additional.basePrice);
						$('input[name="additionalChargeName"]',v).val(additional.chargeName);
						var salePrice,basePrice;
						salePrice = additional.saleBPrice;
						basePrice = additional.basePrice;
						if (agentMultipleCurrency && agentMultipleCurrency == 1) {
							$('#additionalSaleBCurrency',v).html(selectSaleBStr);
							$('select[name="saleBCurrency"]',v).val(agentSettlementCurrency);
							$('select[name="saleBCurrency"]',v).bind('change',function(){
								var saleCurrency = $(this).val();
								var saleRate = 1;
								if (saleCurrency != additional.saleBCurrency) {
									var key = additional.saleBCurrency + '-' + saleCurrency;
									if (rateMap[key] && rateMap[key].rate && salePrice) {
										saleRate = rateMap[key].rate;
										$('input[name="additionalSaleBPrice"]',v).val((salePrice * saleRate).toFixed(2));
										calculateProfit();
									}
								} else {
									if (salePrice) {
										$('input[name="additionalSaleBPrice"]',v).val(salePrice);
										calculateProfit();
									}
								}
								$('#additionalSaleCCurrency',row).html(saleCurrency);
							});
						} else {
							$('#additionalSaleBCurrency',row).html(agentSettlementCurrency);
						}
						$('#additionalSaleCCurrency',row).html(agentSettlementCurrency);
					}
					calculateProfit();
				});
				calculateProfit();
			});
		}*/
	}
}

/**
 * 校验房费
 * @param orderDayPriceList
 * @returns
 */
function validateOrderProduct(orderDayPriceList, payMethod) {
	var flag = true;
	$.each(orderDayPriceList, function(k,v) {
		if (!v.pricePlanId) {
			flag = false;
			new Tip({ msg: '请选择房型或产品',timer: 3000, type:2});
			return false;
		}
		if (!v.saleDate) {
			flag = false;
			new Tip({ msg: '请选择日期',timer: 3000, type:2});
			return false;
		}
		if (!v.roomNum) {
			flag = false;
			new Tip({ msg: '请输入间数',timer: 3000, type:2});
			return false;
		}
		if (payMethod === 'pay') {
			if (!v.saleCPrice) {
				flag = false;
				new Tip({ msg: '请输入代收价',timer: 3000, type:2});
				return false;
			}
			var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
			if (!regPrice.test(v.saleCPrice)) {
				flag = false;
				new Tip({ msg: '代收价最多4位整数，2位小数',timer: 3000, type:2});
				return false;
			}
		}
		if (!v.saleBPrice) {
			flag = false;
			new Tip({ msg: '请输入同行价',timer: 3000, type:2});
			return false;
		}
		var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regPrice.test(v.saleBPrice)) {
			flag = false;
			new Tip({ msg: '同行价最多4位整数，2位小数',timer: 3000, type:2});
			return false;
		}
		if (!v.basePrice) {
			flag = false;
			new Tip({ msg: '底价不能为空',timer: 3000, type:2});
			return false;
		}
//		if (v.basePrice == 0) {
//			flag = false;
//			new Tip({ msg: '底价不能为0',timer: 3000, type:2});
//			return false;
//		}
		var regBasePrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regBasePrice.test(v.basePrice)) {
			flag = false;
			new Tip({ msg: '底价最多4位整数，2位小数',timer: 3000, type:2});
			return false;
		}
	});
	return flag;
}

/**
 * 校验附加费
 * @param orderDayPriceList
 * @returns
 */
function validateOrderAdditional(orderAdditionalList, payMethod) {
	var flag = true;
	$.each(orderAdditionalList, function(k,v) {
		if (!v.chargeId || v.chargeId == 0) {
			flag = false;
			new Tip({ msg: '请选择附加项',timer: 3000, type:2});
			return false;
		}
		if (!v.saleDate) {
			flag = false;
			new Tip({ msg: '请选择日期',timer: 3000, type:2});
			return false;
		}
		if (!v.count) {
			flag = false;
			new Tip({ msg: '请输入份数',timer: 3000, type:2});
			return false;
		}
		if (payMethod === 'pay') {
			if (!v.saleCPrice) {
				flag = false;
				new Tip({ msg: '请输入代收价',timer: 3000, type:2});
				return false;
			}
			var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
			if (!regPrice.test(v.saleCPrice)) {
				flag = false;
				new Tip({ msg: '代收价最多4位整数，2位小数',timer: 3000, type:2});
				return false;
			}
		}
		if (!v.saleBPrice) {
			flag = false;
			new Tip({ msg: '请输入同行价',timer: 3000, type:2});
			return false;
		}
		var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regPrice.test(v.saleBPrice)) {
			flag = false;
			new Tip({ msg: '同行价最多4位整数，2位小数',timer: 3000, type:2});
			return false;
		}
		if (!v.basePrice) {
			flag = false;
			new Tip({ msg: '底价不能为空',timer: 3000, type:2});
			return false;
		}
//		if (v.basePrice == 0) {
//			flag = false;
//			new Tip({ msg: '底价不能为0，请检查附加项底价是否录入正确',timer: 3000, type:2});
//			return false;
//		}
		var regBasePrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regBasePrice.test(v.basePrice)) {
			flag = false;
			new Tip({ msg: '底价最多4位整数，2位小数',timer: 3000, type:2});
			return false;
		}
	});
	return flag;
}

function initAddOrder(event, ui,baseData) {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode, supplyName;
	if (ui && ui.item) {
		if (ui.item.supplyCode) {
			supplyCode = ui.item.supplyCode;
			$('input[name="supplyCode"]').val(supplyCode);
		}
		if (ui.item.supplyName) {
			supplyName = ui.item.supplyName;
			$('input[name="supplyName"]').val(supplyName);
		}
		if (ui.item.settlementCurrency) {
			$('input[name="supplySettlementCurrency"]').val(ui.item.settlementCurrency);
		} else {
			$('input[name="supplySettlementCurrency"]').val('');
		}
		if (ui.item.isMultipleCurrency) {
			$('input[name="supplyMultipleCurrency"]').val(ui.item.isMultipleCurrency);
		} else {
			$('input[name="supplyMultipleCurrency"]').val('');
		}
	} else {
		supplyCode = $('input[name="supplyCode"]').val();
	}
	if (!hotelId || !supplyCode) {
		console.error('hotelId or supplyCode is null');
		return;
	}
	var da = {
		hotelId:hotelId,
		supplyCode:supplyCode
	};
	$.ajax({
		type : 'POST',
		context : document.body,
		contentType : 'application/json; charset=UTF-8',
		url : projectPath + 'admin/initRoomDetail',
		data: JSON.stringify(da),
		dataType: 'json',
		success : function(data) {
			if (data) {
				var d = data;
				pricePlanList = d.pricePlanList;
				additionalList = d.additionalList;
				if (pricePlanList.length > 0) {
					$.each(pricePlanList,function(k,v) {
						pricePlanMap[v.pricePlanId+'@'+v.roomTypeId] = v;
					});
				}else{
					$('tr',$('#roomInfoDay')).each(function(k,v) {
						var trName = $(v).attr('name');
						if (trName && trName === 'roomTableTr') {
							$(v).remove();
						}
					});
				}
				if (additionalList.length > 0) {
					$.each(additionalList,function(k,v) {
						additionalMap[v.chargeId] = v;
					});
				}else{
					$('tr',$('#additionDay')).each(function(k,v) {
						var trName = $(v).attr('name');
						if (trName && trName === 'adtTr') {
							$(v).remove();
						}
					});
				}
				if (baseData) {
					batchInit(baseData);
				}
			} else {
				console.log('酒店联想未返回数据');
			}
		}
	});
}

/**
 * 分销商验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckDistributor(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#agentCode").val()) && checkEmpty($("#agentName").val())) {
			return true;
		}
	}
	return false;
}

/**
 * 客户单号验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckCustomerOrderCode(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#customerOrderCode").val()) && checkEmpty($("#customerOrderCode").val())) {
			return true;
		}
	}
	return false;
}

/**
 * 供应商验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckSupplier(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#supplyCode").val()) && checkEmpty($("#supplyName").val())) {
			return true;
		}
	}
	return false;
}

/**
 * 入住人验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckGuestName(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#guestName").val())) {
			return true;
		}
	}
	return false;
}

/**
 * 结算方式验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckSettlement(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#settlement").val())) {
			return true;
		}
	}
	return false;
}
/**
 * 酒店验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckHotel(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#hotelId").val()) && checkEmpty($("#hotelName").val())) {
			return true;
		}
	}
	return false;
}
/**
 * 售卖渠道验证
 * 
 * @param value
 * @param customArgs
 * @param inputDom
 * @returns
 */
function fucCheckChannel(value, customArgs, inputDom) {
	if (checkEmpty(value)) {
		if (checkEmpty($("#channelCode").val())) {
			return true;
		}
	}
	return false;
}

function generateUUID() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
														// clock_seq_hi_and_reserved
														// to 01
	s[8] = s[13] = s[18] = s[23];

	var uuid = s.join("");
	return uuid;
}

/**
 * 新增房费
 * @returns
 */
function appendRoomDetail(dateText, pricePlanId, room) {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode = $('input[name="supplyCode"]').val();
	if (!hotelId || !supplyCode) {
		new Tip({ msg: '请选择酒店和供应商',timer: 3000, type:2});
		return;
	}
	if (pricePlanList.length < 1) {
		new Tip({ msg: '当前酒店没有房型，请录入房型信息',timer: 3000, type:2});
		return;
	}
	if (!dateText) {
		dateText = '';
	}
	var uuidValue = generateUUID();
	// 组装拼接
	var roomTypeOption = '', bedTypeOption = '', breakfastOption = '';
	$.each(pricePlanList, function(k, v) {
		var pricePlanId = v.pricePlanId;
		var pricePlanName = v.pricePlanName;
		var roomTypeId = v.roomTypeId;
		if (!pricePlanId) {
			pricePlanId = -1;
		}
		if (!pricePlanName) {
			pricePlanName = '';
		}
		pricePlanId = pricePlanId + '@' + roomTypeId;
		roomTypeOption = roomTypeOption + '<option value=' + pricePlanId
				+ '>' + pricePlanName + '(' + v.roomTypeName + ')</option>';
	});
	$.each(breakfastTypeList, function(k, v) {
		breakfastOption = breakfastOption + '<option value=' + v.breakfastNum
				+ '>' + v.breakfastNumText + '</option>';
	});
	var trInfo = "<tr name='roomTableTr' class ='RoomInfo_list' id='"
			+ uuidValue
			+ "'>"
			+ "<input type='hidden' name='uuid' value='"
			+ uuidValue
			+ "'/>"
			+ "<td class='p_115'><span><select name='pricePlanId' style='width:170px;height:28px;'><option value=''>请选择</option>"
			+ roomTypeOption
			+ "</select></span></td>"
			+ "<td class='p_115'><span><input type='text' name='bedType' class='order-type-input' readonly='readonly' value='' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='saleDate' class='order-date-input' readonly='readonly' value='" + dateText + "' autocomplete='off' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='roomNum' class='order-number-input' value='1' onblur='calculateProfit();' /></span></td>"
			+ "<td class='p_115 saleCPrice'><span><input type='text' name='saleCPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='saleCCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='saleBPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='saleBCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='basePrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='baseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><a onclick='pricePlanDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
	$("#roomTarget").before(trInfo);
	var row = $('#'+uuidValue);
	var agentSettlementCurrency = $('input[name="agentSettlementCurrency"]').val();
	var supplySettlementCurrency = $('input[name="supplySettlementCurrency"]').val();
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	var payMethod = $('select[name="payMethod"]').val();
	if (payMethod && payMethod === 'pay') {
		$('.saleCPrice').show();
		$('.additionalSaleCPrice').show();
	} else {
		$('.saleCPrice').hide();
		$('.additionalSaleCPrice').hide();
	}
	if (agentMultipleCurrency && agentMultipleCurrency == 1) {
		var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
		$('#saleBCurrency',row).html(selectSaleBStr);
		$('select[name="saleBCurrency"]',row).val(agentSettlementCurrency);
		$('select[name="saleBCurrency"]',row).change(function(){
			if (payMethod && payMethod === 'pay') {
				$('#saleCCurrency',row).html('CNY');
			} else {
				$('#saleCCurrency',row).html($(this).val());
			}
		});
	} else {
		$('#saleBCurrency',row).html(agentSettlementCurrency);
	}
	if (payMethod && payMethod === 'pay') {
		$('#saleCCurrency',row).html('CNY');
	} else {
		$('#saleCCurrency',row).html(agentSettlementCurrency);
	}
	if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
		var selectBaseStr = '<select name="baseCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
		$('#baseCurrency',row).html(selectBaseStr);
		$('select[name="baseCurrency"]',row).val(supplySettlementCurrency);
	} else {
		$('#baseCurrency',row).html(supplySettlementCurrency);
	}
	if (pricePlanId) {
		$('select[name="pricePlanId"]', row).val(pricePlanId);
		var uuid = $('input[name="uuid"]', row).val();
		var pricePlan = pricePlanMap[pricePlanId];
		if (pricePlan) {
			$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
			saleCurrency = pricePlan.saleBCurrency;
			baseCurrency = pricePlan.baseCurrency;
			if (dateText) {
				bindPrice(row,pricePlan,dateText);
			}
		}
	}
	if (room) {
		$('input[name="roomNum"]',row).val(room);
	}
	$('select[name="pricePlanId"]', row).change(function() {
		var pricePlanId = $(this).val();
		var saleDate = $('input[name="saleDate"]', row).val();
		var uuid = $('input[name="uuid"]', row).val();
		var pricePlan = pricePlanMap[pricePlanId];
		if (pricePlan) {
			$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
			saleCurrency = pricePlan.saleBCurrency;
			baseCurrency = pricePlan.baseCurrency;
			bindPrice(row,pricePlan,saleDate);
		}
	});
	$('input[name="saleDate"]', row).datepicker({
        changeMonth: true,
        changeYear: true,
		onSelect: function(dateText, inst){
			var pricePlanId = $('select[name="pricePlanId"]',row).val();
			var pricePlan = pricePlanMap[pricePlanId];
			if (pricePlan) {
				bindPrice(row,pricePlan,dateText);
			}
		}
	});
	$('input[name="roomNum"]', row).on('blur',function(){
		var val = $(this).val();
		var pricePlanId = $('select[name="pricePlanId"]', row).val();
		var pricePlan = pricePlanMap[pricePlanId];
		var saleDate = $('input[name="saleDate"]',row).val();
		if (pricePlan && saleDate) {
			bindPrice(row,pricePlan,saleDate);
		}
	});
}

function showAppendRoomDetail() {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode = $('input[name="supplyCode"]').val();
	if (!hotelId || !supplyCode) {
		new Tip({ msg: '请选择酒店和供应商',timer: 3000, type:2});
		return;
	}
	if (pricePlanList.length < 1) {
		new Tip({ msg: '当前酒店没有房型信息，请录入房型信息',timer: 3000, type:2});
		return;
	}
	if (pricePlanList && pricePlanList.length > 0) {
		$('select[name="pricePlanRoom"]').empty();
		$('select[name="pricePlanRoom"]').append('<option value="">请选择</option>');
		$.each(pricePlanList,function(k,v){
			var name = '';
			var id = '';
			if (v.pricePlanName) {
				name = v.pricePlanName + '(' + v.roomTypeName + ')';
			} else {
				name = '(' + v.roomTypeName + ')';
			}
			id = v.pricePlanId + '@' + v.roomTypeId;
			$('select[name="pricePlanRoom"]').append('<option value="'+id+'">'+name+'</option>');
		});
	}
	$('#roomDate').show();
}

function showAppendAdditionalDetail() {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode = $('input[name="supplyCode"]').val();
	if (!hotelId || !supplyCode) {
		new Tip({ msg: '请选择酒店和供应商',timer: 3000, type:2});
		return;
	}
	if (additionalList.length < 1) {
		new Tip({ msg: '当前酒店没有附加项信息，请录入附加项信息',timer: 3000, type:2});
		return;
	}
	if (additionalList && additionalList.length > 0) {
		$('select[name="additional"]').empty();
		$('select[name="additional"]').append('<option value="">请选择</option>');
		$.each(additionalList,function(k,v){
			$('select[name="additional"]').append('<option value="'+v.chargeId+'">'+v.chargeName+'</option>');
		});
	}
	$('#additionalDate').show();
}

/**
 * 新增附加项
 * @returns
 */
function appendAdditionalDetail(dateText, chargeId, count) {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode = $('input[name="supplyCode"]').val();
	if (!hotelId || !supplyCode) {
		new Tip({ msg: '请选择酒店和供应商',timer: 3000, type:2});
		return;
	}
	if (additionalList.length < 1) {
		new Tip({ msg: '当前供应商没有附加项信息，请录入附加项信息',timer: 3000, type:2});
		return;
	}
	if (!dateText) {
		dateText = '';
	}
	var uuidValue = generateUUID();
	// 组装拼接
	var additionalOption = '';
	$.each(additionalList, function(k, v) {
		additionalOption = additionalOption + '<option value=' + v.chargeId
				+ '>' + v.chargeName + '</option>'
	});
	var trInfo = "<tr name='adtTr' id='"
			+ uuidValue
			+ "'>"
			+ "<input type='hidden' name='uuid' value='"
			+ uuidValue
			+ "'/>"
			+ "<td class='p_115'><span><select name='additionalChargeId' style='width:170px;height:28px;'><option value=''>请选择</option>"
			+ additionalOption
			+ "</select></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalChargeName' readonly='readonly' class='order-type-input' value=''/></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalSaleDate' class='order-date-input' readonly='readonly' value='" + dateText + "' autocomplete='off' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalCount' class='order-number-input' value='1' onblur='calculateProfit();' /></span></td>"
			+ "<td class='p_115 additionalSaleCPrice'><span><input type='text' name='additionalSaleCPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleCCurrency' class='additionalSaleCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalSaleBPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleBCurrency' class='additionalSaleCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalBasePrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalBaseCurrency' class='additionalBaseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><a onclick='additionalDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
	$("#additionTarget").before(trInfo);
	var row = $('#'+uuidValue);
	var payMethod = $('select[name="payMethod"]').val();
	if (payMethod && payMethod === 'pay') {
		$('.saleCPrice').show();
		$('.additionalSaleCPrice').show();
	} else {
		$('.saleCPrice').hide();
		$('.additionalSaleCPrice').hide();
	}
	if (chargeId) {
		$('select[name="additionalChargeId"]', row).val(chargeId);
		setAdditionalDetail(chargeId,row);
		calculateProfit();
	}
	if (count) {
		$('input[name="additionalCount"]', row).val(count);
	}
	$('select[name="additionalChargeId"]', row).change(function() {
		var chargeId = $(this).val();
		setAdditionalDetail(chargeId,row);
		calculateProfit();
	});
	$('input[name="additionalSaleDate"]', row).datepicker({
        changeMonth: true,
        changeYear: true
	});
}

function setAdditionalDetail(chargeId, row){
	var agentSettlementCurrency = $('input[name="agentSettlementCurrency"]').val();
	var supplySettlementCurrency = $('input[name="supplySettlementCurrency"]').val();
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	var payMethod = $('select[name="payMethod"]').val();
	var additional = additionalMap[chargeId];
	if (additional) {
		$('input[name="additionalSaleBPrice"]',row).val(additional.saleBPrice);
		$('input[name="additionalBasePrice"]',row).val(additional.basePrice);
		$('input[name="additionalChargeName"]',row).val(additional.chargeName);
		var salePrice,basePrice;
		salePrice = additional.saleBPrice;
		basePrice = additional.basePrice;
		if (salePrice) {
			var saleRate = 1;
			if (agentSettlementCurrency != additional.saleBCurrency) {
				var key = additional.saleBCurrency + '-' + agentSettlementCurrency;
				if (rateMap[key] && rateMap[key].rate && salePrice) {
					saleRate = rateMap[key].rate;
					$('input[name="additionalSaleBPrice"]',row).val((salePrice * saleRate).toFixed(2));
				}
			} else {
				$('input[name="additionalSaleBPrice"]',row).val(salePrice);
			}
		}
		if (basePrice) {
			var baseRate = 1;
			if (supplySettlementCurrency != additional.baseCurrency) {
				var key = additional.baseCurrency + '-' + supplySettlementCurrency;
				if (rateMap[key] && rateMap[key].rate && basePrice) {
					baseRate = rateMap[key].rate;
					$('input[name="additionalBasePrice"]',row).val((basePrice * baseRate).toFixed(2));
				}
			} else {
				$('input[name="additionalBasePrice"]',row).val(basePrice);
			}
		}
		if (agentMultipleCurrency && agentMultipleCurrency == 1) {
			var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
			$('#additionalSaleBCurrency',row).html(selectSaleBStr);
			$('select[name="saleBCurrency"]',row).val(agentSettlementCurrency);
			$('select[name="saleBCurrency"]',row).bind('change',function(){
				var saleCurrency = $(this).val();
				var saleRate = 1;
				if (saleCurrency != additional.saleBCurrency) {
					var key = additional.saleBCurrency + '-' + saleCurrency;
					if (rateMap[key] && rateMap[key].rate && salePrice) {
						saleRate = rateMap[key].rate;
						$('input[name="additionalSaleBPrice"]',row).val((salePrice * saleRate).toFixed(2));
						calculateProfit();
					}
				} else {
					if (salePrice) {
						$('input[name="additionalSaleBPrice"]',row).val(salePrice);
						calculateProfit();
					}
				}
				if (payMethod && payMethod === 'pay') {
					$('#additionalSaleCCurrency',row).html('CNY');
				} else {
					$('#additionalSaleCCurrency',row).html(saleCurrency);
				}
			});
		} else {
			$('#additionalSaleBCurrency',row).html(agentSettlementCurrency);
		}
		if (payMethod && payMethod === 'pay') {
			$('#additionalSaleCCurrency',row).html('CNY');
		} else {
			$('#additionalSaleCCurrency',row).html(agentSettlementCurrency);
		}
		if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
			var selectBaseStr = '<select name="baseCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
			$('#additionalBaseCurrency',row).html(selectBaseStr);
			$('select[name="baseCurrency"]',row).val(supplySettlementCurrency);
			$('select[name="baseCurrency"]',row).bind('change',function(){
				var baseCurrency = $(this).val();
				var baseRate = 1;
				if (baseCurrency != additional.baseCurrency) {
					var key = additional.baseCurrency + '-' + baseCurrency;
					if (rateMap[key] && rateMap[key].rate && basePrice) {
						baseRate = rateMap[key].rate;
						$('input[name="additionalBasePrice"]',row).val((basePrice * baseRate).toFixed(2));
						calculateProfit();
					}
				} else {
					if (basePrice) {
						$('input[name="additionalBasePrice"]',row).val(basePrice);
						calculateProfit();
					}
				}
			});
		} else {
			$('#additionalBaseCurrency',row).html(supplySettlementCurrency);
		}
	}
}


/**
 * 查询价格
 * @param uuid
 * @param pricePlanId
 * @param saleDate
 * @returns
 */
function bindPrice(row,pricePlan, saleDate, targetCurrency) {
	var agentSettlementCurrency = $('input[name="agentSettlementCurrency"]').val();
	var supplySettlementCurrency = $('input[name="supplySettlementCurrency"]').val();
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	var payMethod = $('select[name="payMethod"]').val();
	if (pricePlan.pricePlanId && pricePlan.pricePlanId > 0 && saleDate) {
		var da = {
			pricePlanIdList:[pricePlan.pricePlanId],
			saleDate:saleDate
		};
		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			data: JSON.stringify(da),
			url : projectPath+'admin/getSaleDatePrice',
			success : function(data) {
				if (data.result && data.result == 1) {
					if(data && data.obj) {
						var room = $('input[name="roomNum"]',row).val();
						var orderType = $('select[name="orderType"]').val();
						var salePrice, basePrice;
						if (orderType == 'group') {
							if (data.obj.groupSalePrice) {
								salePrice = data.obj.groupSalePrice;
							}
							if (data.obj.groupBasePrice) {
								basePrice = data.obj.groupBasePrice;
							}
						} else {
							if (data.obj.saleBPrice) {
								salePrice = data.obj.saleBPrice;
							}
							if (data.obj.basePrice) {
								basePrice = data.obj.basePrice;
							}
						}
						if (salePrice) {
							var saleRate = 1;
							var currency = agentSettlementCurrency;
							if (targetCurrency) {
								currency = targetCurrency;
							}
							if (currency != pricePlan.saleBCurrency) {
								var key = pricePlan.saleBCurrency + '-' + currency;
								if (rateMap[key] && rateMap[key].rate && salePrice) {
									saleRate = rateMap[key].rate;
									$('input[name="saleBPrice"]',row).val((salePrice * saleRate).toFixed(2));
								}
							} else {
								$('input[name="saleBPrice"]',row).val(salePrice);
							}
						}
						if (basePrice) {
							var baseRate = 1;
							if (supplySettlementCurrency != pricePlan.baseCurrency) {
								var key = pricePlan.baseCurrency + '-' + supplySettlementCurrency;
								if (rateMap[key] && rateMap[key].rate && basePrice) {
									baseRate = rateMap[key].rate;
									$('input[name="basePrice"]',row).val((basePrice * baseRate).toFixed(2));
								}
							} else {
								$('input[name="basePrice"]',row).val(basePrice);
							}
						}
						if (agentMultipleCurrency && agentMultipleCurrency == 1) {
							$('select[name="saleBCurrency"]',row).bind('change',function(){
								var saleCurrency = $(this).val();
								var saleRate = 1;
								if (payMethod && payMethod === 'pay') {
									$('#saleCCurrency',row).html('CNY');
								} else {
									$('#saleCCurrency',row).html(saleCurrency);
								}
								if (saleCurrency != pricePlan.saleBCurrency) {
									var key = pricePlan.saleBCurrency + '-' + saleCurrency;
									if (rateMap[key] && rateMap[key].rate && salePrice) {
										saleRate = rateMap[key].rate;
										$('input[name="saleBPrice"]',row).val((salePrice * saleRate).toFixed(2));
										calculateProfit();
									}
								} else {
									if (salePrice) {
										$('input[name="saleBPrice"]',row).val(salePrice);
										calculateProfit();
									}
								}
							});
						}
						if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
							$('select[name="baseCurrency"]',row).bind('change',function(){
								var baseCurrency = $(this).val();
								var baseRate = 1;
								if (baseCurrency != pricePlan.baseCurrency) {
									var key = pricePlan.baseCurrency + '-' + baseCurrency;
									if (rateMap[key] && rateMap[key].rate && basePrice) {
										baseRate = rateMap[key].rate;
										$('input[name="basePrice"]',row).val((basePrice * baseRate).toFixed(2));
										calculateProfit();
									}
								} else {
									if (basePrice) {
										$('input[name="basePrice"]',row).val(basePrice);
										calculateProfit();
									}
								}
							});
						}
					}
					calculateProfit();
				}
			}
		});
	}
}

/**
 * 删除房费当前行
 * @param thiz
 * @returns
 */
function pricePlanDelete(thiz) {
	$(thiz).parents("tr[class ='RoomInfo_list']").remove();
	calculateProfit();
}

/**
 * 删除附加费当前行
 * @param thiz
 * @returns
 */
function additionalDelete(thiz) {
	$(thiz).parents("tr[name ='adtTr']").remove();
	calculateProfit();
}

// 计算利润
function calculateProfit() {
	var shouldReceive = 0.00;// 应收
	var shouldPay = 0.00;// 应付
	// 房费
	var roomnum = 0;
	var night = 0;
	var payMethod = $('select[name="payMethod"]').val();
	var saleBPriceMap = {}, basePriceMap = {};
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	$('tr[name="roomTableTr"]').each(function() {
		var $tr = $(this);
		var saleBPrice = 0;
		var saleCPrice = 0;
		var basePrice = 0;
		var saleBCurrency = '';
		var saleCCurrency = '';
		var baseCurrency = '';
		var saleBrate = 1, saleCrate = 1, baseRate = 1;
		basePrice = $tr.find('input[name="basePrice"]').val();
		if (!basePrice) {
			basePrice = 0;
		}
		roomnum = $tr.find('input[name="roomNum"]').val();
		if (!roomnum) {
			roomnum = 0;
		}
		saleCPrice = $tr.find('input[name="saleCPrice"]').val();
		if (!saleCPrice) {
			saleCPrice = 0;
		}
		saleBPrice = $tr.find('input[name="saleBPrice"]').val();
		if (!saleBPrice) {
			saleBPrice = 0;
		}
		if (agentMultipleCurrency && agentMultipleCurrency == 1) {
			saleBCurrency = $('select[name="saleBCurrency"]',$tr).val();
		} else {
			saleBCurrency = $tr.find('#saleBCurrency').html();
		}
		saleCCurrency = $tr.find('#saleCCurrency').html();
		if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
			baseCurrency = $('select[name="baseCurrency"]',$tr).val();
		} else {
			baseCurrency = $tr.find('#baseCurrency').html();
		}
		if (!saleBCurrency) {
			console.error('calculateProfit: saleBCurrency is null');
			return;
		}
		if (!saleCCurrency) {
			console.error('calculateProfit: saleCCurrency is null');
			return;
		}
		if (!baseCurrency) {
			console.error('calculateProfit: baseCurrency is null');
			return;
		}
		if (saleBCurrency === 'CNY') {
			saleBrate = 1;
		} else {
			saleBrate = rateMap[saleBCurrency + '-CNY'].rate;
		}
		if (saleCCurrency === 'CNY') {
			saleCrate = 1;
		} else {
			saleCrate = rateMap[saleCCurrency + '-CNY'].rate;
		}
		if (baseCurrency === 'CNY') {
			baseRate = 1;
		} else {
			baseRate = rateMap[baseCurrency + '-CNY'].rate;
		}
		if (payMethod === 'pay') {
			var r = 1;
			if (saleCCurrency == saleBCurrency) {
				r = 1;
			} else {
				r = rateMap[saleBCurrency + '-' + saleCCurrency].rate;
			}
			saleBPrice = Math.round((Number(saleBPrice) * r) * 100) / 100;
			if (saleBPriceMap[saleCCurrency]) {
				saleBPriceMap[saleCCurrency] = saleBPriceMap[saleCCurrency] + ((Number(saleBPrice)  - Number(saleCPrice)) * roomnum);
			} else {
				saleBPriceMap[saleCCurrency] = (Number(saleBPrice)  - Number(saleCPrice)) * roomnum;
			}
			var rate = 1;
			if (saleCCurrency === baseCurrency) {
				rate = 1;
			} else {
				rate = rateMap[saleCCurrency + '-' + baseCurrency].rate;
			}
			saleCPrice = Math.round((Number(saleCPrice) * rate) * 100) / 100;
			var base = 0 - ((saleCPrice - Number(basePrice)) * roomnum);
			if (basePriceMap[baseCurrency]) {
				basePriceMap[baseCurrency] = basePriceMap[baseCurrency] + base;
			} else {
				basePriceMap[baseCurrency] = base;
			}
			shouldReceive += (Number(saleBPrice) * roomnum * saleBrate) - (Number(saleCPrice) * roomnum * saleCrate);
			shouldPay += 0 - (Number(saleCPrice) * saleCrate * roomnum - Number(basePrice) * baseRate * roomnum);
		} else {
			if (saleBPriceMap[saleBCurrency]) {
				saleBPriceMap[saleBCurrency] = saleBPriceMap[saleBCurrency] + (Number(saleBPrice) * roomnum);
			} else {
				saleBPriceMap[saleBCurrency] = Number(saleBPrice) * roomnum;
			}
			if (basePriceMap[baseCurrency]) {
				basePriceMap[baseCurrency] = basePriceMap[baseCurrency] + (Number(basePrice) * roomnum);
			} else {
				basePriceMap[baseCurrency] = Number(basePrice) * roomnum;
			}
			shouldReceive += (Number(saleBPrice) * roomnum) * saleBrate;
			shouldPay += (Number(basePrice) * roomnum) * baseRate;
		}
	});
	// 附加费
	var additionNum = 0;
	var addnight = 0;
	$('tr[name="adtTr"]').each(function() {
		var $tr = $(this);
		var adsaleBPrice = 0, adsaleCPrice = 0, adbasePrice = 0, excAdsaleBPrice = 0, excAdsaleCPrice = 0, excAdbasePrice = 0;
		additionNum = $tr.find('input[name="additionalCount"]').val();
		adsaleBPrice = $tr.find('input[name="additionalSaleBPrice"]').val();
		adsaleCPrice = $tr.find('input[name="additionalSaleCPrice"]').val();
		adbasePrice = $tr.find('input[name="additionalBasePrice"]').val();
		if (agentMultipleCurrency && agentMultipleCurrency == 1) {
			saleBCurrency = $('select[name="saleBCurrency"]',$tr).val();
		} else {
			saleBCurrency = $tr.find('#additionalSaleBCurrency').html();
		}
		saleCCurrency = $tr.find('#additionalSaleCCurrency').html();
		if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
			baseCurrency = $('select[name="baseCurrency"]',$tr).val();
		} else {
			baseCurrency = $tr.find('#additionalBaseCurrency').html();
		}
		if (!saleBCurrency) {
			console.error('calculateProfit: saleBCurrency is null');
			return;
		}
		if (!saleCCurrency) {
			console.error('calculateProfit: saleCCurrency is null');
			return;
		}
		if (!baseCurrency) {
			console.error('calculateProfit: baseCurrency is null');
			return;
		}
		var saleBrate = 1, saleCrate = 1, baseRate = 1;
		if (additionNum == "" || typeof (additionNum) == "undefined" || isNaN(additionNum)) {
			additionNum = Number(0)
		} else {
			additionNum = Number(additionNum);
		}
		if (adsaleBPrice == "" || typeof (adsaleBPrice) == "undefined" || isNaN(adsaleBPrice)) {
			adsaleBPrice = Number(0)
		} else {
			adsaleBPrice = Number(adsaleBPrice);
		}
		if (adsaleCPrice == "" || typeof (adsaleCPrice) == "undefined" || isNaN(adsaleCPrice)) {
			adsaleCPrice = Number(0)
		} else {
			adsaleCPrice = Number(adsaleCPrice);
		}
		if (adbasePrice == "" || typeof (adbasePrice) == "undefined" || isNaN(adbasePrice)) {
			adbasePrice = Number(0)
		} else {
			adbasePrice = Number(adbasePrice);
		}
		if (saleBCurrency === 'CNY') {
			saleBrate = 1;
		} else {
			saleBrate = rateMap[saleBCurrency + '-CNY'].rate;
		}
		if (saleCCurrency === 'CNY') {
			saleCrate = 1;
		} else {
			saleCrate = rateMap[saleCCurrency + '-CNY'].rate;
		}
		if (baseCurrency === 'CNY') {
			baseRate = 1;
		} else {
			baseRate = rateMap[baseCurrency + '-CNY'].rate;
		}
		if (payMethod === 'pay') {
			var r = 1;
			if (saleCCurrency == saleBCurrency) {
				r = 1;
			} else {
				r = rateMap[saleBCurrency + '-' + saleCCurrency].rate;
			}
			adsaleBPrice = Math.round((adsaleBPrice * r) * 100) / 100;
			if (saleBPriceMap[saleCCurrency]) {
				saleBPriceMap[saleCCurrency] = saleBPriceMap[saleCCurrency] + ((adsaleBPrice  - adsaleCPrice) * additionNum);
			} else {
				saleBPriceMap[saleCCurrency] = (adsaleBPrice  - adsaleCPrice) * additionNum;
			}
			var rate = 1;
			if (saleCCurrency === baseCurrency) {
				rate = 1;
			} else {
				rate = rateMap[saleCCurrency + '-' + baseCurrency].rate;
			}
			adsaleCPrice = Math.round((adsaleCPrice * rate) * 100) / 100;
			var base = 0 - ((adsaleCPrice - adbasePrice) * additionNum);
			if (basePriceMap[baseCurrency]) {
				basePriceMap[baseCurrency] = basePriceMap[baseCurrency] + base;
			} else {
				basePriceMap[baseCurrency] = base;
			}
			shouldReceive += (adsaleBPrice * additionNum * saleBrate) - (adsaleCPrice * additionNum * saleCrate);
			shouldPay += 0 - (adsaleCPrice * saleCrate * additionNum - adbasePrice * baseRate * additionNum);
		} else {
			if (saleBPriceMap[saleBCurrency]) {
				saleBPriceMap[saleBCurrency] = saleBPriceMap[saleBCurrency] + (adsaleBPrice * additionNum);
			} else {
				saleBPriceMap[saleBCurrency] = adsaleBPrice * additionNum;
			}
			if (basePriceMap[baseCurrency]) {
				basePriceMap[baseCurrency] = basePriceMap[baseCurrency] + (adbasePrice * additionNum);
			} else {
				basePriceMap[baseCurrency] = adbasePrice * additionNum;
			}
			shouldReceive += (adsaleBPrice * additionNum) * saleBrate;
			shouldPay += (adbasePrice * additionNum) * baseRate;
		}
	});
	// 利润
	var recStr = '', recedStr = '', unrecStr = '';
	var payStr = '', payedStr = '', unpayStr = '';
	$.each(saleBPriceMap,function(k,v){
		v = Math.round(v * 100) / 100;
		recStr += v + k + '&nbsp;';
		recedStr += 0 + k + '&nbsp;';
		unrecStr += v + k + '&nbsp;';
	});
	$.each(basePriceMap,function(k,v){
		v = Math.round(v * 100) / 100;
		payStr += v + k + '&nbsp;';
		payedStr += 0 + k + '&nbsp;';
		unpayStr += v + k + '&nbsp;';
	});
	$("#receiveable").html(recStr);
	$("#receiveabled").html(recedStr);
	$("#unreceiveable").html(unrecStr);
	$("#payable").html(payStr);
	$("#payabled").html(payedStr);
	$("#unpayable").html(unpayStr);
	$("#notPay").html(unrecStr);
	$("#profit").html((shouldReceive - shouldPay).toFixed(2) + ' CNY');
}

/**
 * 获取组装房费数据
 * @returns
 */
function getRoomInfo() {
	var orderDayPriceList = [];
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	$('tr[name="roomTableTr"]').each(function() {
		var $tr = $(this);
		var saleBCurrency = $tr.find('#saleBCurrency').html();
		var saleCCurrency = $tr.find('#saleCCurrency').html();
		var baseCurrency = $tr.find('#baseCurrency').html();
		if (agentMultipleCurrency && agentMultipleCurrency == 1) {
			saleBCurrency = $('select[name="saleBCurrency"]',$tr).val();
		}
		if (supplyMultipleCurrency && supplyMultipleCurrency ==1) {
			baseCurrency = $('select[name="baseCurrency"]',$tr).val();
		}
		var orderDayPrice = {
			pricePlanId: $tr.find('select[name="pricePlanId"]').val(),
			breakFast: $tr.find('input[name="breakFast"]').val(),
			roomNum: $tr.find('input[name="roomNum"]').val(),
			saleDate: $tr.find('input[name="saleDate"]').val(),
			saleBPrice: $tr.find('input[name="saleBPrice"]').val(),
			saleBCurrency: saleBCurrency,
			saleCPrice: $tr.find('input[name="saleCPrice"]').val(),
			saleCCurrency: saleCCurrency,
			basePrice: $tr.find('input[name="basePrice"]').val(),
			baseCurrency: baseCurrency
		}
		orderDayPriceList.push(orderDayPrice);
	});
	return orderDayPriceList;
}

/**
 * 获取组装附加费数据
 * @returns
 */
function getAdditionalInfo() {
	var additionalList = [];
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	$('tr[name="adtTr"]').each(function() {
		var $tr = $(this);
		var saleBCurrency = $tr.find('#additionalSaleBCurrency').html();
		var saleCCurrency = $tr.find('#additionalSaleCCurrency').html();
		var baseCurrency = $tr.find('#additionalBaseCurrency').html();
		if (agentMultipleCurrency && agentMultipleCurrency == 1) {
			saleBCurrency = $('select[name="saleBCurrency"]',$tr).val();
		}
		if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
			baseCurrency = $('select[name="baseCurrency"]',$tr).val();
		}
		var additional = {
			chargeId: $tr.find('select[name="additionalChargeId"]').val(),
			chargeName: $tr.find('input[name="additionalChargeName"]').val(),
			saleDate: $tr.find('input[name="additionalSaleDate"]').val(),
			count: $tr.find('input[name="additionalCount"]').val(),
			saleBPrice: $tr.find('input[name="additionalSaleBPrice"]').val(),
			saleBCurrency: saleBCurrency,
			saleCPrice: $tr.find('input[name="additionalSaleCPrice"]').val(),
			saleCCurrency: saleCCurrency,
			basePrice: $tr.find('input[name="additionalBasePrice"]').val(),
			baseCurrency: baseCurrency
		}
		additionalList.push(additional);
	});
	return additionalList;
}

$('input[name="quickRemark"]').on('click',function () {
	if ($(this).prop('checked')) {
		var remark = $('textarea[name="remark"]').val();
		remark = remark + $(this).val() + '\n';
		$('textarea[name="remark"]').val(remark);
	} else {
		var remark = $('textarea[name="remark"]').val();
		remark = remark.replace($(this).val() + '\n','');
		$('textarea[name="remark"]').val(remark);
	}
});