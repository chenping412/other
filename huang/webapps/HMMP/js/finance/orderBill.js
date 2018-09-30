projectPath="http://"+window.location.host+"/HMMP/";

function checkOut (dayPriceId,index,controller) {

	if ($("#label_checkout_"+index).html() != "标记对账"){
		return;
	}

		var currentActualReceived = $("#currentActualReceived_"+index).val();
		if (!dayPriceId) {
			new Tip({msg : "每日价格不存在",timer : 1000,type : 2});
			return ;
		}

		if (!currentActualReceived || !parseFloat(currentActualReceived)) {
			new Tip({msg : "本次收不合法",timer : 1000,type : 2});
			return ;
		}

		var data = {
			dayPriceId: dayPriceId,
			currentActualReceived: currentActualReceived
		};

		var dataArray = [];
		dataArray.push(data);

		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			url : projectPath+'admin/'+controller+'/checkOut',
			data : JSON.stringify(dataArray),
			success : function(data) {
				if (data.result && data.result == 1) {
					$("#label_checkout_"+index).html(data.obj);
					$("#label_checkout_"+index).css("color","#FF6000");
					secondLimitStr($('.finance-manage-wrap .list200'), '4');
				} else {
					new Tip({msg : data.errorReason,timer : 1000,type : 2});
				}
			}
		});
}

//批量标记对账
function batchCheckOut(controller) {
	var dataArray = [];
	$("input[name='dayPriceId']:checked").each(function() {
		var rowNum = $(this).val();
		var data = {
			dayPriceId: rowNum,
			currentActualReceived: $("#currentActualReceived_"+rowNum).val()
		};
		dataArray.push(data);
	});

	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/'+controller+'/checkOut',
		data : JSON.stringify(dataArray),
		success : function(data) {
			if (data.result && data.result == 1) {
				$("input[name='dayPriceId']:checked").each(function() {
					var rowNum = $(this).val();
					$("#label_checkout_"+rowNum).html(data.obj);
					$("#label_checkout_"+rowNum).css("color","#FF6000");
				});
				new Tip({msg : "标记对账成功",timer : 1000,type : 1});
				secondLimitStr($('.finance-manage-wrap .list200'), '4');

			} else {
				new Tip({msg : data.errorReason,timer : 1000,type : 2});
			}
		}
	});
}



function orderAppear(orderCode) {
	if (!orderCode) {
		return;
	}
	$.ajax({
        type:'POST',
        dataType : 'html',
        context : document.body,
        url : projectPath+'admin/orderAppealController/getOrderAppealAddPage',
        data:{orderCode:orderCode},
        success : function(data) {
        	if (data) {
        		var d = dialog({
                    title: '订单申诉',
                    content: data,
                    width: 430,
                    button:[
                    	{
                    		value: '取消',
                    		callback: function () {
                    			
                    		}
                    	},
                    	{
                    		value: '确定',
                    		callback: function () {
                    			var orderCode,applyReason,mark;
                    			orderCode = $('input[name="orderCode"]','#addOrderAppealFrom').val();
                    			applyReason = $('input[name="applyReason"]','#addOrderAppealFrom').val();
                    			mark = $('textarea[name="mark"]','#addOrderAppealFrom').val();
                    			var da = {
                    				orderCode:orderCode,
                    				applyReason:applyReason,
                    				mark:mark
                    			};
                    			$.ajax({
                    				type : 'POST',
                    				dataType : 'json',
                    				contentType : 'application/json; charset=UTF-8',
                    				context : document.body,
                    				url : projectPath+'admin/orderAppealController/add',
                    				data:JSON.stringify(da),
                    				success : function(data) {
                    					if (data.result && data.result == 1) {
                    						new Tip({ msg: '申诉成功',timer: 3000});
                    					} else {
                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
                    					}
                    				}
                    			});
                    		},
                    		autofocus: true
                    	},
                    ]
                }).showModal();
        	}
        }
    });
//	window.open(projectPath+"admin/orderAppealController/addPage?"+param,"财务申诉", "height=600px, width=1366px,top=20px,left=30px,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}

function billOff (orderCode,guestName,hotelName,nightCount,roomCount,checkInDate,checkOutDate,roomTypeName) {
	if (!orderCode) {
		console.log('orderCode is null');
	}
	if (!guestName) {
		console.log('guestName is null');
	}
	if (!hotelName) {
		console.log('hotelName is null');
	}
	if (!nightCount) {
		console.log('nightCount is null');
	}
	if (!roomCount) {
		console.log('roomCount is null');
	}
	if (!checkInDate) {
		console.log('checkInDate is null');
	}
	if (!checkOutDate) {
		console.log('checkOutDate is null');
	}
	if (!roomTypeName) {
		console.log('roomTypeName is null');
	}
}

function reverse (orderCode,guestName,hotelName,nightCount,roomCount,checkInDate,checkOutDate,roomTypeName) {
	if (!orderCode) {
		console.log('orderCode is null');
	}
	if (!guestName) {
		console.log('guestName is null');
	}
	if (!hotelName) {
		console.log('hotelName is null');
	}
	if (!nightCount) {
		console.log('nightCount is null');
	}
	if (!roomCount) {
		console.log('roomCount is null');
	}
	if (!checkInDate) {
		console.log('checkInDate is null');
	}
	if (!checkOutDate) {
		console.log('checkOutDate is null');
	}
	if (!roomTypeName) {
		console.log('roomTypeName is null');
	}
}

//全选和反选[供应商和分销商页面公用的]
$("#selectAll").on('click',function () {
	var isSelectAll = $("#selectAll").is(":checked");
	$("input[type='checkbox']").each(function() {
		this.checked = isSelectAll; //循环赋值给每个复选框是否选中
	});
});

secondLimitStr($('.finance-manage-wrap .list200'), '4');

