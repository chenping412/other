projectPath = "http://" + window.location.host + "/HMMP/";
top.F.loading.hide();
var roomDetailList = [],additionalDetailList = [];
var bedTypeList = [];
var pricePlanList = [];
var additionalList = [];
var additionalMap = {};
var pricePlanMap = {};
var breakFastMap = {};
var saleCurrency = '';
var baseCurrency = '';
var rateMap = {};

$(function() {
	initAgentAutocomplete(bindCredit);
	initSupplyAutocomplete();
	initHotelAutocomplete(bindSupply);
	var rateStr = $('input[name="exchange"]').val();
	if (rateStr) {
		rateMap = eval('(' + rateStr + ')');
	}
	F.UI.scan();
	var roomJSON = $('input[name="roomJSON"]').val();
	var additionalJSON = $('input[name="additionalJSON"]').val();
	var financeLockStatus = $('input[name="financeLockStatus"]').val();
	var breakFastJSON = $('input[name="breakFastJSON"]').val();
	if (roomJSON) {
		roomDetailList = JSON.parse(roomJSON);
	}
	if (additionalJSON) {
		additionalDetailList = JSON.parse(additionalJSON);
	}
	if (breakFastJSON) {
		breakFastMap = JSON.parse(breakFastJSON);
	}
	var payMethod = $('select[name="payMethod"]').val();
	if (payMethod && payMethod === 'pay') {
		$('.saleCPrice').show();
		$('.additionalSaleCPrice').show();
	} else {
		$('.saleCPrice').hide();
		$('.additionalSaleCPrice').hide();
	}
	initEditOrder();
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
	// 调用表单验证控件
	var valid = new validform('#editOrderFrom', {
		msgTooltip : true
	});
	$("#editOrderBtn").on('click',	function() {
		if ($(this).hasClass('btn_save_no')) {
			return;
		}
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
		var orderId,orderCode,agentCode,agentName,guestName,settlement,channelCode,supplyCode,supplyName,hotelId,hotelName,payMethod,remark,confirmNo,roomNo,orderType,noShow;
		orderId = $('input[name="orderId"]').val();
		orderCode = $('input[name="orderCode"]').val();
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
		if ($('input[name="noShow"]').is(':checked')) {
			noShow = 1;
		}
		var data = {
			orderId:orderId,
			orderCode:orderCode,
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
			noShow:noShow,
			orderDayPriceList:orderDayPriceList,
			orderAdditionalList:orderAdditionalList
		};
		F.loading.show('mask');
		$.ajax({
	        type:'POST',
	        dataType : 'json',
	        contentType : 'application/json; charset=UTF-8',
	        context : document.body,
	        url : projectPath+'admin/editOrder',
	        data:JSON.stringify(data),
	        success : function(data) {
	            if(data.result && data.result == 1){
	                new Tip({ msg: '保存成功',timer: 3000});
	                location.reload();
	            }else{
	                new Tip({ msg: data.errorReason,timer: 3000, type:2});
	            }
	            F.loading.remove();
	        }
	    });
	});
	$('#orderConfirmPage').on('click',function() {
		if ($(this).hasClass('btn_save_no')) {
			return;
		}
		var agentCode = $('input[name="agentCode"]').val();
		if (!agentCode) {
			console.error('agentCode is null');
			return;
		}
		$.ajax({
	        type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{agentCode:agentCode},
	        url : projectPath+'admin/orderConfirmPage',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '确认客人',
	                    content: data,
	                    width: 430,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '预览',
	                    		callback: function () {
	                    			var da = getOrderEmailData();
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'html',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/orderPreview',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data) {
	                    						if (!data.result) {
	                    							var di = dialog({
		                    							title: '订单预览',
		                    		                    content: data,
		                    		                    width: 800,
		                    		                    height: 500,
		                    		                    button:[
		                    		                    	{
		                    		                    		value: '取消',
		                    		                    		callback: function () {
		                    		                    			
		                    		                    		}
		                    		                    	},
		                    		                    	{
		                    		                    		value: '导出PDF',
		                    		                    		callback: function () {
		                    		                    			var form = createForm(projectPath + 'admin/exportOrderPDF', da);
		                    		                    			if (form) {
		                    		                    				form.submit();
		                    		                    				form.remove();
		                    		                    			}
		                    		                    		}
		                    		                    	}
		                    		                    ]
		                    						}).showModal();
	                    						} else {
	                    							new Tip({msg : '订单预览异常',timer : 3000,type : 2});
	                    						}
	                    					} else {
	                    						new Tip({msg : '订单预览异常',timer : 3000,type : 2});
	                    					}
	                    				}
	                    			});
	                    			return false;
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var da = getOrderEmailData();
                    				if (!da.emailFrom) {
                    					new Tip({msg : '发件箱不能为空',timer : 3000,type : 2});
                    					return false;
                    				}
                    				if (!da.emailTo) {
                    					new Tip({msg : '收件箱不能为空',timer : 3000,type : 2});
                    					return false;
                    				}
                    				if (!da.emailSubject) {
                    					new Tip({msg : '邮件主题不能为空',timer : 3000,type : 2});
                    					return false;
                    				}
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/orderConfirm',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '确认成功',timer: 3000});
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var orderCode = $('input[name="orderCode"]').val();
	        		$('input[name="subject"]','#orderConfirm').val(orderCode+$("input[type='radio']:checked",'#orderConfirm').attr('text'));
	        		$('input[name="confirmType"]','#orderConfirm').on('click',function(){
	        			var text = $(this).attr('text');
	        			$('input[name="subject"]','#orderConfirm').val(orderCode+text);
	        		});
	        	}
	        }
	    });
	});
	$('#orderOperatePage').on('click',function() {
		if ($(this).hasClass('btn_save_no')) {
			return;
		}
		var channelCode = $('input[name="channelCode"]').val();
		if (!channelCode) {
			console.error('channelCode is null');
			return;
		}
		$.ajax({
			type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{channelCode:channelCode},
	        url : projectPath+'admin/order/operate/operatePage',
	        success : function(data) {
	        	if (channelCode === 'ctrip') {
	        		createCtripOperate(data);
	        	} else if (channelCode === 'qunar') {
	        		createQunarOperate(data);
	        	}
	        }
		});
	});
	$('#sendSupplyPage').on('click',function() {
		if ($(this).hasClass('btn_save_no')) {
			return;
		}
		var supplyCode = $('input[name="supplyCode"]').val();
		if (!supplyCode) {
			console.error('supplyCode is null');
			return;
		}
		$.ajax({
	        type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{supplyCode:supplyCode},
	        url : projectPath+'admin/sendOrderPage',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '发单给供应商',
	                    content: data,
	                    width: 430,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '预览',
	                    		callback: function () {
	                    			var da = getSupplyOrderEmailData();
	                    			var url = projectPath+'admin/supplyOrderPreview?orderId='+da.orderId+'&orderCode='+da.orderCode+'&confirmType='+da.confirmType+'&emailFrom='+da.emailFrom+'&emailTo='+da.emailTo+'&emailSubject='+da.emailSubject;
	                    			window.open(url,'_blank');
	                    			/*$.ajax({
	                    				type : 'POST',
	                    				dataType : 'html',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/supplyOrderPreview',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data) {
	                    						if (!data.result) {
	                    							var di = dialog({
		                    							title: '订单预览',
		                    		                    content: data,
		                    		                    width: 800,
		                    		                    height: 500,
		                    		                    button:[
		                    		                    	{
		                    		                    		value: '取消',
		                    		                    		callback: function () {
		                    		                    			
		                    		                    		}
		                    		                    	},
		                    		                    	{
		                    		                    		value: '导出PDF',
		                    		                    		callback: function () {
		                    		                    			var form = createForm(projectPath + 'admin/exportSupplyOrderPDF', da);
		                    		                    			if (form) {
		                    		                    				form.submit();
		                    		                    				form.remove();
		                    		                    			}
		                    		                    		}
		                    		                    	}
		                    		                    ]
		                    						}).showModal();
	                    						} else {
	                    							new Tip({msg : '订单预览异常',timer : 3000,type : 2});
	                    						}
	                    					} else {
	                    						new Tip({msg : '订单预览异常',timer : 3000,type : 2});
	                    					}
	                    				}
	                    			});*/
	                    			return false;
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var da = getSupplyOrderEmailData();
	                    			if (da.confirmType !== 'other') {
		                    			if (!da.emailFrom) {
		                    				new Tip({msg : '发件箱不能为空',timer : 3000,type : 2});
		                    				return false;
		                    			}
		                    			if (!da.emailTo) {
		                    				new Tip({msg : '收件箱不能为空',timer : 3000,type : 2});
		                    				return false;
		                    			}
		                    			if (!da.emailSubject) {
		                    				new Tip({msg : '邮件主题不能为空',timer : 3000,type : 2});
		                    				return false;
		                    			}
	                    			}
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/sendOrder',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '发单成功',timer: 3000});
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var orderCode = $('input[name="orderCode"]').val();
	        		$('input[name="subject"]','#sendOrder').val(orderCode+$("input[type='radio']:checked",'#sendOrder').attr('text'));
	        		$('input[name="confirmType"]','#sendOrder').on('click',function(){
	        			var text = $(this).attr('text');
	        			var val = $(this).val();
	        			if (val === 'other') {
	        				$('#sendContent').hide();
	        			} else {
	        				$('#sendContent').show();
	        			}
	        			$('input[name="subject"]','#sendOrder').val(orderCode+text);
	        		})
	        	}
	        }
	    });
	});
	$('#cancelBtn').on('click',function() {
		if ($(this).hasClass('btn_save_no')) {
			return;
		}
		var orderCode = $('input[name="orderCode"]').val();
		var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 310,
            content: '<p>您确定要撤销吗</p>',
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
            	$.ajax({
        			type : 'POST',
        			context : document.body,
        			contentType : 'application/json; charset=UTF-8',
        			url : projectPath + 'admin/cancelOrder',
        			data: orderCode,
        			dataType: 'json',
        			success : function(data) {
        				if (data && data.result === 1) {
        					new Tip({ msg: '订单撤销成功',timer: 3000});
        					location.reload();
        				} else {
        					new Tip({msg : data.errorReason,timer : 3000,type : 2});
        				}
        			}
        		});
            },
            cancel: function () {

            }
        }).showModal();
	});
});

function refresh() {
	location.reload();
}

function imageUpload() {
	var h = window.screen.availHeight / 2 + 100;
	var w = window.screen.availWidth / 2;
	var top = h / 2 - 100;
	var left = w / 2;
	var orderCode = $('input[name="orderCode"]').val();
	var orderId = $('input[name="orderId"]').val();
	window.open(projectPath+'admin/toImageUpload?orderId='+orderId+'&orderCode=' + orderCode, '附件管理', 'height='+h+', width='+w+',top='+top+',left='+left+',channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
}

function fileUpload() {
	var h = window.screen.availHeight / 2 + 100;
	var w = window.screen.availWidth / 2;
	var top = h / 2 - 100;
	var left = w / 2;
	var orderCode = $('input[name="orderCode"]').val();
	var orderId = $('input[name="orderId"]').val();
	window.open(projectPath+'admin/toFileUpload?orderId='+orderId+'&orderCode=' + orderCode, '附件管理', 'height='+h+', width='+w+',top='+top+',left='+left+',channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
}

/**
 * 携程渠道订单操作按钮
 * @param data
 * @returns
 */
function createCtripOperate(data) {
	if (data) {
		var d = dialog({
			title: '订单操作',
            content: data,
            width: 500,
            height:250,
            button:[
            	{
            		value: '取消',
            		callback: function () {
            			
            		}
            	},
            	{
            		value: '确定',
            		callback: function () {
            			var da,orderCode,channelCode,operateType;
            			operateType = $('input:radio[name="ctripOperate"]:checked').val();
            			orderCode = $('input[name="orderCode"]').val();
            			channelCode = $('input[name="channelCode"]').val();
            			da = {
    						orderCode:orderCode,
    						channelCode:channelCode,
    						operateType:operateType
    					};
            			if (operateType === 'ctrip_accept') {
            				var confirmNo,confirmTypeRadio;
            				confirmTypeRadio = $('input:radio[name="confirmTypeRadio"]:checked').val();
            				da.confirmType = confirmTypeRadio;
            				if (confirmTypeRadio === '2') {
            					confirmNo = $('input[name="confirmNo"]',$('#ctrip_accept')).val();
            					if (!confirmNo) {
            						new Tip({msg : '请输入确认号',timer : 3000,type : 2});
            						return false;
            					}
            					da.confirmNo = confirmNo;
            				}
            			} else if (operateType === 'ctrip_refuse') {
            				var refuseTypeRadio,refuseReason;
            				refuseTypeRadio = $('input:radio[name="refuseTypeRadio"]:checked').val();
            				refuseReason = $('textarea[name="refuseReason"]').val();
            				da.refuseType = refuseTypeRadio;
            				da.refuseReason = refuseReason;
            			} else if (operateType === 'ctrip_change_confirm_no') {
            				var changeConfirmNo = $('input[name="changeConfirmNo"]').val();
            				if (!changeConfirmNo) {
            					new Tip({msg : '请输入确认号',timer : 3000,type : 2});
        						return false;
            				}
            				da.confirmNo = changeConfirmNo;
            			} else if (operateType === 'ctrip_accept_cancel') {
            				
            			} else if (operateType === 'ctrip_refuse_cancel') {
            				var refuseCancelTypeRadio,refuseCancelReason;
            				refuseCancelTypeRadio = $('input:radio[name="refuseCancelTypeRadio"]:checked').val();
            				refuseCancelReason = $('textarea[name="refuseCancelReason"]').val();
            				da.refuseType = refuseCancelTypeRadio;
            				da.refuseReason = refuseCancelReason;
            			}
            			F.loading.show('mask');
            			$.ajax({
            				type : 'POST',
            				dataType : 'json',
            				contentType : 'application/json; charset=UTF-8',
            				context : document.body,
            				url : projectPath+'admin/order/operate/channelOperate',
            				data:JSON.stringify(da),
            				success : function(data) {
            					if (data.isSuccess && data.isSuccess == 1) {
            						new Tip({ msg: '操作成功',timer: 3000});
            					} else {
            						new Tip({msg : data.failureReason,timer : 5000,type : 2});
            					}
            					F.loading.remove();
            				}
            			});
            		},
            		autofocus: true
            	},
            ]
		}).showModal();
		$('input[name="ctripOperate"]','#ctripOperateForm').on('click',function(){
			var operateType = $(this).val();
			if (operateType === 'ctrip_accept') {
				$('#ctrip_refuse').hide();
				$('#ctrip_change_confirm_no').hide();
				$('#ctrip_refuse_cancel').hide();
				$('#ctrip_accept').show();
			} else if (operateType === 'ctrip_refuse') {
				$('#ctrip_accept').hide();
				$('#ctrip_change_confirm_no').hide();
				$('#ctrip_refuse_cancel').hide();
				$('#ctrip_refuse').show();
			} else if (operateType === 'ctrip_change_confirm_no') {
				$('#ctrip_refuse').hide();
				$('#ctrip_accept').hide();
				$('#ctrip_refuse_cancel').hide();
				$('#ctrip_change_confirm_no').show();
			} else if (operateType === 'ctrip_accept_cancel') {
				$('#ctrip_refuse').hide();
				$('#ctrip_accept').hide();
				$('#ctrip_refuse_cancel').hide();
				$('#ctrip_change_confirm_no').hide();
			} else if (operateType === 'ctrip_refuse_cancel') {
				$('#ctrip_refuse').hide();
				$('#ctrip_accept').hide();
				$('#ctrip_change_confirm_no').hide();
				$('#ctrip_refuse_cancel').show();
			}
		});
		$('input[name="confirmTypeRadio"]',$('#ctrip_accept')).on('click',function () {
			var confirm = $(this).val();
			if (confirm === '2') {
				$('#confirm_no', '#ctrip_accept').show();
			} else {
				$('#confirm_no', '#ctrip_accept').hide();
			}
		});
	}
}

/**
 * 去哪儿渠道订单操作按钮
 * @param data
 * @returns
 */
function createQunarOperate(data) {
	if (data) {
		var d = dialog({
			title: '订单操作',
			content: data,
			width: 500,
			height:250,
			button:[
				{
					value: '取消',
					callback: function () {
						
					}
				},
				{
					value: '确定',
					callback: function () {
						var da,orderCode,channelCode,operateType;
						operateType = $('input:radio[name="qunarOperate"]:checked').val();
						orderCode = $('input[name="orderCode"]').val();
						channelCode = $('input[name="channelCode"]').val();
						da = {
								orderCode:orderCode,
								channelCode:channelCode,
								operateType:operateType
						};
						if (operateType === 'qunar_have_room_and_accept') {
							var confirmNo,confirmTypeRadio;
							confirmTypeRadio = $('input:radio[name="confirmTypeRadio"]:checked').val();
							da.confirmType = confirmTypeRadio;
							if (confirmTypeRadio === '2') {
								confirmNo = $('input[name="confirmNo"]',$('#qunar_have_room_and_accept')).val();
								if (!confirmNo) {
									new Tip({msg : '请输入确认号',timer : 3000,type : 2});
									return false;
								}
								da.confirmNo = confirmNo;
							}
						} else if (operateType === 'qunar_no_room') {
							var noRoomRadio,noRoomReason;
							noRoomRadio = $('input:radio[name="noRoomRadio"]:checked').val();
							noRoomReason = $('textarea[name="noRoomReason"]').val();
							da.refuseType = noRoomRadio;
							da.refuseReason = noRoomReason;
						} else if (operateType === 'qunar_apply_unsubscribe') {
							var unsubscribeAmount = $('input[name="unsubscribeAmount"]').val();
							if (!unsubscribeAmount) {
								new Tip({msg : '请输入退款金额',timer : 3000,type : 2});
								return false;
							}
							var reg = /^[+-]?\d*\.?\d{1,2}$/;
							if (!reg.test(unsubscribeAmount)) {
								new Tip({ msg: '退款金额只能输入数字',timer: 3000,type: 2 });
						        return false;
							}
							da.refundAmount = unsubscribeAmount;
						} else if (operateType === 'qunar_accept_unsubscribe') {
							var acceptUnsubscribeAmount = $('input[name="acceptUnsubscribeAmount"]').val();
							if (!acceptUnsubscribeAmount) {
								new Tip({msg : '请输入退款金额',timer : 3000,type : 2});
								return false;
							}
							var reg = /^[+-]?\d*\.?\d{1,2}$/;
							if (!reg.test(acceptUnsubscribeAmount)) {
								new Tip({ msg: '退款金额只能输入数字',timer: 3000,type: 2 });
						        return false;
							}
							da.refundAmount = acceptUnsubscribeAmount;
						} else if (operateType === 'qunar_refuse_unsubscribe') {
							var refuseUnsubscribeRadio,refuseUnsubscribeReason;
							refuseUnsubscribeRadio = $('input:radio[name="refuseUnsubscribeRadio"]:checked').val();
							refuseUnsubscribeReason = $('textarea[name="refuseUnsubscribeReason"]').val();
							da.refuseType = refuseUnsubscribeRadio;
							da.refuseReason = refuseUnsubscribeReason;
						}
						F.loading.show('mask');
						$.ajax({
							type : 'POST',
							dataType : 'json',
							contentType : 'application/json; charset=UTF-8',
							context : document.body,
							url : projectPath+'admin/order/operate/channelOperate',
							data:JSON.stringify(da),
							success : function(data) {
								if (data.isSuccess && data.isSuccess == 1) {
									new Tip({ msg: '操作成功',timer: 3000});
								} else {
									new Tip({msg : data.failureReason,timer : 5000,type : 2});
								}
								F.loading.remove();
							}
						});
					},
					autofocus: true
				},
				]
		}).showModal();
		$('input[name="qunarOperate"]','#qunarOperateForm').on('click',function(){
			var operateType = $(this).val();
			if (operateType === 'qunar_have_room_and_accept') {
				$('#qunar_no_room').hide();
				$('#qunar_apply_unsubscribe').hide();
				$('#qunar_accept_unsubscribe').hide();
				$('#qunar_refuse_unsubscribe').hide();
				$('#qunar_have_room_and_accept').show();
			} else if (operateType === 'qunar_no_room') {
				$('#qunar_have_room_and_accept').hide();
				$('#qunar_apply_unsubscribe').hide();
				$('#qunar_accept_unsubscribe').hide();
				$('#qunar_refuse_unsubscribe').hide();
				$('#qunar_no_room').show();
			} else if (operateType === 'qunar_apply_unsubscribe') {
				$('#qunar_have_room_and_accept').hide();
				$('#qunar_no_room').hide();
				$('#qunar_accept_unsubscribe').hide();
				$('#qunar_refuse_unsubscribe').hide();
				$('#qunar_apply_unsubscribe').show();
			} else if (operateType === 'qunar_accept_unsubscribe') {
				$('#qunar_have_room_and_accept').hide();
				$('#qunar_no_room').hide();
				$('#qunar_apply_unsubscribe').hide();
				$('#qunar_refuse_unsubscribe').hide();
				$('#qunar_accept_unsubscribe').show();
			} else if (operateType === 'qunar_refuse_unsubscribe') {
				$('#qunar_have_room_and_accept').hide();
				$('#qunar_no_room').hide();
				$('#qunar_apply_unsubscribe').hide();
				$('#qunar_accept_unsubscribe').hide();
				$('#qunar_refuse_unsubscribe').show();
			}
		});
		$('input[name="confirmTypeRadio"]',$('#qunar_have_room_and_accept')).on('click',function () {
			var confirm = $(this).val();
			if (confirm === '2') {
				$('#confirm_no', '#qunar_have_room_and_accept').show();
			} else {
				$('#confirm_no', '#qunar_have_room_and_accept').hide();
			}
		});
	}
}

function bindSupply(event, ui) {
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
	}
}

function createForm(path,data) {
	var form = $("<form>");
	form.attr("style","display:none");
	form.attr("method","post");
	form.attr("action",path);
	var orderId = $("<input>");
	orderId.attr("type","hidden");
	orderId.attr("name","orderId");
	orderId.attr("value",data.orderId);
	var orderCode = $("<input>");
	orderCode.attr("type","hidden");
	orderCode.attr("name","orderCode");
	orderCode.attr("value",data.orderCode);
	var emailFrom = $("<input>");
	emailFrom.attr("type","hidden");
	emailFrom.attr("name","emailFrom");
	emailFrom.attr("value",data.emailFrom);
	var emailTo = $("<input>");
	emailTo.attr("type","hidden");
	emailTo.attr("name","emailTo");
	emailTo.attr("value",data.emailTo);
	var emailSubject = $("<input>");
	emailSubject.attr("type","hidden");
	emailSubject.attr("name","emailSubject");
	emailSubject.attr("value",data.emailSubject);
	var confirmType = $("<input>");
	confirmType.attr("type","hidden");
	confirmType.attr("name","confirmType");
	confirmType.attr("value",data.confirmType);
	
	$("body").append(form);
	form.append(orderId);
	form.append(orderCode);
	form.append(emailFrom);
	form.append(emailTo);
	form.append(emailSubject);
	form.append(confirmType);
	return form;
}

function getOrderEmailData() {
	var orderId = $('input[name="orderId"]').val();
	var orderCode = $('input[name="orderCode"]').val();
	var from = $('input[name="from"]','#orderConfirm').val();
	var to = $('input[name="to"]','#orderConfirm').val();
	var subject = $('input[name="subject"]','#orderConfirm').val();
	var confirmType = $("input[type='radio']:checked",'#orderConfirm').val();
	return da = {
		orderId:orderId,
		orderCode:orderCode,
		emailFrom:from,
		emailTo:to,
		emailSubject:subject,
		confirmType:confirmType
	};
}

function getSupplyOrderEmailData() {
	var orderId = $('input[name="orderId"]').val();
	var orderCode = $('input[name="orderCode"]').val();
	var from = $('input[name="from"]','#sendOrder').val();
	var to = $('input[name="to"]','#sendOrder').val();
	var subject = $('input[name="subject"]','#sendOrder').val();
	var confirmType = $("input[type='radio']:checked",'#sendOrder').val();

	return da = {
			orderId:orderId,
			orderCode:orderCode,
			emailFrom:from,
			emailTo:to,
			emailSubject:subject,
			confirmType:confirmType
	};
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
	}
}

/**
 * 删除附件
 * @param thiz
 * @returns
 */
function removeAttachment(thiz) {
	var tr = $(thiz).parent().parent();
	var attachmentId = $(tr).attr('id');
	if (attachmentId) {
		$.ajax({
			type : 'POST',
			context : document.body,
			contentType : 'application/json; charset=UTF-8',
			url : projectPath + 'admin/removeFile',
			data: attachmentId,
			dataType: 'json',
			success : function(data) {
				if (data && data.result === 1) {
					new Tip({ msg: '附件删除成功',timer: 3000});
					$(tr).remove();
				} else {
					new Tip({msg : data.errorReason,timer : 3000,type : 2});
				}
			}
		});
	}
}

function downloadAttachment(attachmentId,originalAttachmentName) {
	if (!attachmentId && !originalAttachmentName) {
		return;
	}
	window.open(projectPath + 'admin/download?attachmentId='+attachmentId);
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
 * 校验房费
 * @param orderDayPriceList
 * @returns
 */
function validateOrderProduct(orderDayPriceList, payMethod) {
	var flag = true;
	$.each(orderDayPriceList, function(k,v) {
		v.bedType = 'one';
		if (!v.pricePlanId) {
			flag = false;
			new Tip({msg : '请选择房型或产品',timer : 3000,type : 2});
			return false;
		}
		if (!v.saleDate) {
			flag = false;
			new Tip({msg : '请选择日期',timer : 3000,type : 2});
			return false;
		}
		if (!v.roomNum) {
			flag = false;
			new Tip({msg : '请输入间数',timer : 3000,type : 2});
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
			new Tip({msg : '请输入同行价',timer : 3000,type : 2});
			return false;
		}
		var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regPrice.test(v.saleBPrice)) {
			flag = false;
			new Tip({msg : '同行价最多4位整数，2位小数',timer : 3000,type : 2});
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
			new Tip({msg : '请选择附加项',timer : 3000,type : 2});
			return false;
		}
		if (!v.saleDate) {
			flag = false;
			new Tip({msg : '请选择日期',timer : 3000,type : 2});
			return false;
		}
		if (!v.count) {
			flag = false;
			new Tip({msg : '请输入份数',timer : 3000,type : 2});
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
			new Tip({msg : '请输入同行价',timer : 3000,type : 2});
			return false;
		}
		var regPrice = /^-?[0-9]{1,4}(\.[0-9]{1,2})?$/;
		if (!regPrice.test(v.saleBPrice)) {
			flag = false;
			new Tip({msg : '同行价最多4位整数，2位小数',timer : 3000,type : 2});
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

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
														// clock_seq_hi_and_reserved
														// to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

function initEditOrder() {
	var hotelId = $('input[name="hotelId"]').val();
	var supplyCode = $('input[name="supplyCode"]').val();
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
						pricePlanMap[v.pricePlanId + '@' + v.roomTypeId] = v;
					});
				}
				if (additionalList.length > 0) {
					$.each(additionalList,function(k,v) {
						additionalMap[v.chargeId] = v;
					});
				}
				initRoomAndAdditionalDetail();
			} else {
				console.log('酒店联想未返回数据');
			}
		}
	});
}

/**
 * 初始化已有的房型和附加费
 * @returns
 */
function initRoomAndAdditionalDetail() {
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
	var additionalOption = '';
	$.each(additionalList, function(k, v) {
		additionalOption = additionalOption + '<option value=' + v.chargeId
				+ '>' + v.chargeName + '</option>';
	});
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
	var payMethod = $('select[name="payMethod"]').val();
	$.each(roomDetailList, function(k,v) {
		if (v.orderDayPriceDTOList) {
			$.each(v.orderDayPriceDTOList, function(i,j) {
				var key = v.priceplanId + '@' + v.roomTypeId;
				var pricePlan = pricePlanMap[key];
				var uuidValue = uuid();
				var trInfo = "<tr name='roomTableTr' class ='RoomInfo_list' id='"
					+ uuidValue
					+ "'>"
					+ "<input type='hidden' name='uuid' value='"
					+ uuidValue
					+ "'/><input type='hidden' name='dayPriceId' value='"  + j.dayPriceId + "' /><input type='hidden' name='opId' value='"  + v.opid + "' />" +
							"<input type='hidden' name='actualReceived'  value='"+j.actualReceived+"' />" +
							"<input type='hidden' name='actualPaied'  value='"+j.actualPaied+"' /></td>"
					+ "<td class='p_115'><span><select name='pricePlanId' value='' style='width:170px;height:28px;'><option value=''>请选择</option>"
					+ roomTypeOption
					+ "</select></span></td>"
					+ "<td class='p_115'><span><input type='text' name='bedType' class='order-type-input' readonly='readonly' value='' /></span></td>"
					+ "<td class='p_115'><span><input type='text' name='saleDate' class='order-date-input' readonly='readonly' value='' autocomplete='off' /></span></td>"
					+ "<td class='p_115'><span><input type='text' name='roomNum' class='order-number-input' value='' onblur='calculateProfit();' /></span></td>"
					+ "<td class='p_115 saleCPrice'><span><input type='text' name='saleCPrice' class='order-number-input' value='' style='width:65%;' onblur='calculateProfit();' /></span><span id='saleCCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><input type='text' name='saleBPrice' class='order-number-input' value='' style='width:65%;' onblur='calculateProfit();' /></span><span id='saleBCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><input type='text' name='basePrice' class='order-number-input' value='' style='width:65%;' onblur='calculateProfit();' /></span><span id='baseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><a onclick='pricePlanDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
				$("#roomTarget").before(trInfo);
				var row = $('#'+uuidValue);
				$('select[name="pricePlanId"]',row).val(key);
				if (pricePlan) {
					$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
					saleCurrency = pricePlan.saleBCurrency;
					baseCurrency = pricePlan.baseCurrency;
				}
				$('input[name="saleDate"]',row).val(j.saleDate);
				$('input[name="roomNum"]',row).val(j.rooms);
				$('input[name="saleBPrice"]',row).val(j.saleBPrice);
				$('input[name="saleCPrice"]',row).val(j.saleCPrice);
				$('input[name="basePrice"]',row).val(j.basePrice);
				if (agentMultipleCurrency && agentMultipleCurrency == 1) {
					var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
					$('#saleBCurrency',row).html(selectSaleBStr);
					$('select[name="saleBCurrency"]',row).val(j.saleBCurrency);
					$('select[name="saleBCurrency"]',row).bind('change',function(){
						var saleBCurrency = $(this).val();
						if (payMethod && payMethod === 'pay') {
							$('#saleCCurrency',row).html('CNY');
						} else {
							$('#saleCCurrency',row).html(saleBCurrency);
						}
						var saleRate = 1;
						if (saleBCurrency != j.saleBCurrency) {
							var key = j.saleBCurrency + '-' + saleBCurrency;
							if (rateMap[key] && rateMap[key].rate && j.saleBPrice) {
								saleRate = rateMap[key].rate;
								$('input[name="saleBPrice"]',row).val((j.saleBPrice * saleRate).toFixed(2));
								calculateProfit();
							}
						} else {
							if (j.saleBPrice) {
								$('input[name="saleBPrice"]',row).val(j.saleBPrice);
								calculateProfit();
							}
						}
					});
				} else {
					$('#saleBCurrency',row).html(j.saleBCurrency);
				}
				$('#saleCCurrency',row).html(j.saleCCurrency);
				if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
					var selectBaseStr = '<select name="baseCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
					$('#baseCurrency',row).html(selectBaseStr);
					$('select[name="baseCurrency"]',row).val(j.baseCurrency);
					$('select[name="baseCurrency"]',row).bind('change',function(){
						var baseCurrency = $(this).val();
						var baseRate = 1;
						if (baseCurrency != j.baseCurrency) {
							var key = j.baseCurrency + '-' + baseCurrency;
							if (rateMap[key] && rateMap[key].rate && j.basePrice) {
								baseRate = rateMap[key].rate;
								$('input[name="basePrice"]',row).val((j.basePrice * baseRate).toFixed(2));
								calculateProfit();
							}
						} else {
							if (j.basePrice) {
								$('input[name="basePrice"]',row).val(j.basePrice);
								calculateProfit();
							}
						}
					});
				} else {
					$('#baseCurrency',row).html(j.baseCurrency);
				}
				$('select[name="pricePlanId"]', row).change(function() {
					var pricePlanId = $(this).val();
					var saleDate = $('input[name="saleDate"]', row).val();
					var uuid = $('input[name="uuid"]', row).val();
					var p = pricePlanMap[pricePlanId];
					if (p) {
						$('input[name="bedType"]',row).val(p.bedTypeText);
						bindPrice(row,p,saleDate);
					}
				});
				$('input[name="saleDate"]', row).datepicker({
			        changeMonth: true,
			        changeYear: true,
					onSelect: function(dateText, inst){
						var pricePlanId = $('select[name="pricePlanId"]',row).val();
						var p = pricePlanMap[pricePlanId];
						if (p) {
							bindPrice(row,p,dateText);
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
	});
	$.each(additionalDetailList, function(k,v) {
		if (v.orderDayPriceDTOList) {
			$.each(v.orderDayPriceDTOList, function(i,j) {
				var uuidValue = uuid();
				var trInfo = "<tr name='adtTr' id='"
					+ uuidValue
					+ "'>"
					+ "<input type='hidden' name='uuid' value='"
					+ uuidValue
					+ "'/><input type='hidden' name='dayPriceId' value='"  + j.dayPriceId + "' /><input type='hidden' name='opId' value='"  + v.opid + "' />" +
							"<input type='hidden' name='actualReceived'  value='"+j.actualReceived+"' />" +
							"<input type='hidden' name='actualPaied'  value='"+j.actualPaied+"' /></td>"
					+ "<td class='p_115'><span><select name='additionalChargeId' style='width:170px;height:28px;'><option value=''>请选择</option>"
					+ additionalOption
					+ "</select></span></td>"
					+ "<td class='p_115'><span><input type='text' name='additionalChargeName' readonly='readonly' class='order-type-input' value=''/></span></td>"
					+ "<td class='p_115'><span><input type='text' id='additionalSaleDate' name='additionalSaleDate' class='order-date-input' readonly='readonly' value='' autocomplete='off' /></span></td>"
					+ "<td class='p_115'><span><input type='text' name='additionalCount' class='order-number-input' value='' onblur='calculateProfit();' /></span></td>"
					+ "<td class='p_115 additionalSaleCPrice'><span><input type='text' name='additionalSaleCPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleCCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><input type='text' name='additionalSaleBPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleBCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><input type='text' name='additionalBasePrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalBaseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
					+ "<td class='p_115'><span><a onclick='additionalDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
				$("#additionTarget").before(trInfo);
				var row = $('#'+uuidValue);
				$('select[name="additionalChargeId"]',row).val(v.priceplanId);
				$('input[name="additionalChargeName"]',row).val(v.priceplanName);
				$('input[name="additionalSaleDate"]',row).val(j.saleDate);
				$('input[name="additionalCount"]',row).val(j.rooms);
				$('input[name="additionalSaleBPrice"]',row).val(j.saleBPrice);
				$('input[name="additionalSaleCPrice"]',row).val(j.saleCPrice);
				$('input[name="additionalBasePrice"]',row).val(j.basePrice);
				var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
				if (agentMultipleCurrency && agentMultipleCurrency == 1) {
					var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
					$('#additionalSaleBCurrency',row).html(selectSaleBStr);
					$('select[name="saleBCurrency"]',row).val(j.saleBCurrency);
					$('select[name="saleBCurrency"]',row).bind('change',function(){
						var saleBCurrency = $(this).val();
						if (payMethod && payMethod === 'pay') {
							$('#additionalSaleCCurrency',row).html('CNY');
						} else {
							$('#additionalSaleCCurrency',row).html(saleBCurrency);
						}
						var saleRate = 1;
						if (saleBCurrency != j.saleBCurrency) {
							var key = j.saleBCurrency + '-' + saleBCurrency;
							if (rateMap[key] && rateMap[key].rate && j.saleBPrice) {
								saleRate = rateMap[key].rate;
								$('input[name="additionalSaleBPrice"]',row).val((j.saleBPrice * saleRate).toFixed(2));
								calculateProfit();
							}
						} else {
							if (j.saleBPrice) {
								$('input[name="additionalSaleBPrice"]',row).val(j.saleBPrice);
								calculateProfit();
							}
						}
					});
				} else {
					$('#additionalSaleBCurrency',row).html(j.saleBCurrency);
				}
				$('#additionalSaleCCurrency',row).html(j.saleCCurrency);
				if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
					var selectBaseStr = '<select name="baseCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
					$('#additionalBaseCurrency',row).html(selectBaseStr);
					$('select[name="baseCurrency"]',row).val(j.baseCurrency);
					$('select[name="baseCurrency"]',row).bind('change',function(){
						var baseCurrency = $(this).val();
						var baseRate = 1;
						if (baseCurrency != j.baseCurrency) {
							var key = j.baseCurrency + '-' + baseCurrency;
							if (rateMap[key] && rateMap[key].rate && j.basePrice) {
								baseRate = rateMap[key].rate;
								$('input[name="additionalBasePrice"]',row).val((j.basePrice * baseRate).toFixed(2));
								calculateProfit();
							}
						} else {
							if (j.basePrice) {
								$('input[name="additionalBasePrice"]',row).val(j.basePrice);
								calculateProfit();
							}
						}
					});
				} else {
					$('#additionalBaseCurrency',row).html(j.baseCurrency);
				}
				$('select[name="additionalChargeId"]', row).change(function() {
					var chargeId = $(this).val();
					var additional = additionalMap[chargeId];
					if (additional) {
						$('input[name="additionalSaleBPrice"]',row).val(additional.saleBPrice);
						$('input[name="additionalSaleCPrice"]',row).val(additional.saleCPrice);
						$('input[name="additionalBasePrice"]',row).val(additional.basePrice);
						$('input[name="additionalChargeName"]',row).val(additional.chargeName);
						if (agentMultipleCurrency && agentMultipleCurrency == 1) {
							var selectSaleBStr = '<select name="saleBCurrency" style="width:50px;height: 30px;border: none;"><option value="CNY">CNY</option><option value="HKD">HKD</option><option value="MOP">MOP</option></select>';
							$('#additionalSaleBCurrency',row).html(selectSaleBStr);
							$('select[name="saleBCurrency"]',row).val(additional.saleBCurrency);
							$('select[name="saleBCurrency"]',row).bind('change',function(){
								var saleBCurrency = $(this).val();
								var saleRate = 1;
								if (saleBCurrency != additional.saleBCurrency) {
									var key = additional.saleBCurrency + '-' + saleBCurrency;
									if (rateMap[key] && rateMap[key].rate && additional.saleBPrice) {
										saleRate = rateMap[key].rate;
										$('input[name="additionalSaleBPrice"]',row).val((additional.saleBPrice * saleRate).toFixed(2));
										calculateProfit();
									}
								} else {
									if (additional.saleBPrice) {
										$('input[name="additionalSaleBPrice"]',row).val(additional.saleBPrice);
										calculateProfit();
									}
								}
							});
							if (payMethod && payMethod === 'pay') {
								$('#additionalSaleCCurrency',row).html('CNY');
							} else {
								$('#additionalSaleCCurrency',row).html(saleBCurrency);
							}
						} else {
							$('#additionalSaleBCurrency',row).html(additional.saleBCurrency);
						}
						$('#additionalSaleCCurrency',row).html(additional.saleCCurrency);
						if (supplyMultipleCurrency && supplyMultipleCurrency == 1) {
							$('select[name="baseCurrency"]',row).bind('change',function(){
								var baseCurrency = $(this).val();
								var baseRate = 1;
								if (baseCurrency != additional.baseCurrency) {
									var key = additional.baseCurrency + '-' + baseCurrency;
									if (rateMap[key] && rateMap[key].rate && additional.basePrice) {
										saleRate = rateMap[key].rate;
										$('input[name="additionalSaleBPrice"]',row).val((additional.basePrice * baseRate).toFixed(2));
										calculateProfit();
									}
								} else {
									if (additional.basePrice) {
										$('input[name="additionalSaleBPrice"]',row).val(additional.basePrice);
										calculateProfit();
									}
								}
							});
						} else {
							$('#additionalBaseCurrency',row).html(additional.baseCurrency);
						}
					}
					calculateProfit();
				});
				$('input[name="additionalSaleDate"]', row).datepicker({
			        changeMonth: true,
			        changeYear: true
				});
			});
		}
	});
	calculateProfit();
	if (payMethod && payMethod === 'pay') {
		$('.saleCPrice').show();
		$('.additionalSaleCPrice').show();
	} else {
		$('.saleCPrice').hide();
		$('.additionalSaleCPrice').hide();
	}
	var financeLockStatus = $('input[name="financeLockStatus"]').val();
	if (financeLockStatus == 1) {
		$('a').removeAttr('href');
		$('a').removeAttr('onclick');
		$('select').attr('disabled','disabled');
		$('input').attr('readonly','readonly');
		$('textarea').attr('readonly','readonly');
	}
}

/**
 * 新增房费
 * @returns
 */
function appendRoomDetail() {
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
	var uuidValue = uuid();
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
	$.each(bedTypeList, function(k, v) {
		bedTypeOption = bedTypeOption + '<option value=' + v.bedType + '>'
				+ v.bedTypeText + '</option>';
	});
	var trInfo = "<tr name='roomTableTr' class ='RoomInfo_list' id='"
			+ uuidValue
			+ "'>"
			+ "<input type='hidden' name='uuid' value='"
			+ uuidValue
			+ "'/></td>"
			+ "<td class='p_115'><span><select name='pricePlanId' style='width:170px;height:28px;'><option value=''>请选择</option>"
			+ roomTypeOption
			+ "</select></span></td>"
			+ "<td class='p_115'><span><input type='text' name='bedType' class='order-type-input' readonly='readonly' value='' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='saleDate' class='order-date-input' value='' readonly='readonly' autocomplete='off' /></span></td>"
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
	$('select[name="pricePlanId"]', row).change(function() {
		var pricePlanId = $(this).val();
		var saleDate = $('input[name="saleDate"]', row).val();
		var uuid = $('input[name="uuid"]', row).val();
		var pricePlan = pricePlanMap[pricePlanId];
		if (pricePlan) {
			$('input[name="bedType"]',row).val(pricePlan.bedTypeText);
			if (!saleCurrency) {
				saleCurrency = pricePlan.saleBCurrency;
			}
			if (!baseCurrency) {
				baseCurrency = pricePlan.baseCurrency;
			}
			bindPrice(row,pricePlan,saleDate);
		}
	});
	$('input[name="saleDate"]', row).datepicker({
        changeMonth: true,
        changeYear: true,
		onSelect: function(dateText, inst){
			var pricePlanId = $('select[name="pricePlanId"]',row).val();
			if (pricePlanId) {
				var pricePlan = pricePlanMap[pricePlanId];
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

/**
 * 新增附加项
 * @returns
 */
function appendAdditionalDetail() {
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
	var uuidValue = uuid();
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
			+ "'/></td>"
			+ "<td class='p_115'><span><select name='additionalChargeId' style='width:170px;height:28px;'><option value=''>请选择</option>"
			+ additionalOption
			+ "</select></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalChargeName' readonly='readonly' class='order-type-input' value=''/></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalSaleDate' class='order-date-input' value='' readonly='readonly' autocomplete='off' /></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalCount' class='order-number-input' value='1' onblur='calculateProfit();' /></span></td>"
			+ "<td class='p_115 additionalSaleCPrice'><span><input type='text' name='additionalSaleCPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleCCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalSaleBPrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalSaleBCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><input type='text' name='additionalBasePrice' class='order-number-input' style='width:65%;' value='' onblur='calculateProfit();' /></span><span id='additionalBaseCurrency' style='float: right;text-align: left;line-height: 30px;'></span></td>"
			+ "<td class='p_115'><span><a onclick='additionalDelete(this)'class='blue ml10 underline'>删除</a></span></td></tr>";
	$("#additionTarget").before(trInfo);
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
	$('select[name="additionalChargeId"]', row).change(function() {
		var chargeId = $(this).val();
		var additional = additionalMap[chargeId];
		if (additional) {
			$('input[name="additionalSaleBPrice"]',row).val(additional.saleBPrice);
			$('input[name="additionalBasePrice"]',row).val(additional.basePrice);
			$('input[name="additionalChargeName"]',row).val(additional.chargeName);
			var salePrice,basePrice;
			salePrice = additional.saleBPrice;
			basePrice = additional.basePrice;
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
		calculateProfit();
	});
	$('input[name="additionalSaleDate"]', row).datepicker({
        changeMonth: true,
        changeYear: true
	});
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

/**
 * 计算利润和展示金额
 * @returns
 */
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
				saleBPriceMap[saleCCurrency] = (parseInt(saleBPrice)  - Number(saleCPrice)) * roomnum;
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
			shouldReceive += (Number(saleBPrice) * roomnum * saleBrate) - (Number(saleCPrice) * roomnum * saleBrate)
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
			adbasePrice = Math.round((adbasePrice * rate) * 100) / 100;
			var base = 0 - ((adsaleCPrice - adbasePrice) * additionNum);
			if (basePriceMap[baseCurrency]) {
				basePriceMap[baseCurrency] = basePriceMap[baseCurrency] + base;
			} else {
				basePriceMap[baseCurrency] = base;
			}
			shouldReceive += (adsaleBPrice * additionNum * saleBrate) - (adsaleCPrice * additionNum * saleBrate);
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
 * 查询价格
 * @param uuid
 * @param pricePlanId
 * @param saleDate
 * @returns
 */
function bindPrice(row,pricePlan, saleDate) {
	var agentSettlementCurrency = $('input[name="agentSettlementCurrency"]').val();
	var supplySettlementCurrency = $('input[name="supplySettlementCurrency"]').val();
	var agentMultipleCurrency = $('input[name="agentMultipleCurrency"]').val();
	var supplyMultipleCurrency = $('input[name="supplyMultipleCurrency"]').val();
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
							if (agentSettlementCurrency != pricePlan.saleBCurrency) {
								var key = pricePlan.saleBCurrency + '-' + agentSettlementCurrency;
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
								$('#saleCCurrency',row).html(saleCurrency);
								var saleRate = 1;
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
			opId: $tr.find('input[name="opId"]').val(),
			dayPriceId: $tr.find('input[name="dayPriceId"]').val(),
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
			opId: $tr.find('input[name="opId"]').val(),
			dayPriceId: $tr.find('input[name="dayPriceId"]').val(),
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