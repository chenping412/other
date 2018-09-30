projectPath = "http://" + window.location.host + "/HMMP/";

top.F.loading.hide();

$(function() {
	initAgentAutocomplete();
	initSupplyAutocomplete();
	initHotelAutocomplete(bindInitRoomTypeAutocomplete);
	initDeptAutocomplete();
	initUserAutocomplete();
	initPagination(queryOrderList);
	$('input[name="startDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="endDate"]').datepicker( "option", "minDate", dateText );
		}
	});
	$('input[name="endDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="startDate"]').datepicker( "option", "maxDate", dateText );
		}
	});
	$('input[name="beginCreateDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="endCreateDate"]').datepicker( "option", "minDate", dateText );
		}
	});
	$('input[name="endCreateDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="beginCreateDate"]').datepicker( "option", "maxDate", dateText );
		}
	});
});

function bindInitRoomTypeAutocomplete(event, ui) {
	if (ui && ui.item) {
		initRoomAutocomplete(ui.item.value);
	}
}

function orderDetail(thiz) {
	var orderCode = $(thiz).attr('title');
	var orderId = $(thiz).attr('value');
	if (!orderCode) {
		console.error('orderCode is not defined');
		return;
	}
	if(!orderId) {
		console.error('orderId is not defined');
		return;
	}
	window.parent.$.createTab(projectPath+'admin/toEditOrder/'+orderId,orderCode);
}

function initPagination() {
	if (!typeof callback === 'function') {
		console.error('No function can be found!');
		return;
	}
	var currentPage = $("#currentPage").val();
	var totalPage = $("#totalPages").val();
	var totalRecords = $("#totalCount").val();
	// 生成分页
	// 有些参数是可选的，比如lang，若不传有默认值
	new Pager({
		pno : currentPage,
		// 总页码
		total : totalPage,
		// 总数据条数
		totalRecords : totalRecords,
		isShowTotalRecords : true,
		isGoPage : true,
		mode : 'click', // 默认值是link，可选link或者click
		click : function(n) {
			$("#currentPage").val(n);
			queryOrderList();
			// 手动选中按钮
			this.selectPage(n);
			return false;
		}
	});
}

function queryOrderList() {
//	$("#queryOrderListForm").submit();
	var url = projectPath+'admin/orderListForPage';
	var orderCode,agentCode,agentName,supplyCode,supplyName,orderState,dateType,startDate,endDate,beginCreateDate,endCreateDate,customerOrderCode,guestName,deptNo,deptName,maker,
	hotelId,hotelName,roomTypeId,roomTypeName,orderType,orderSendState,noShow;
	orderCode = $('input[name="orderCode"]').val();
	agentCode = $('input[name="agentCode"]').val();
	agentName = $('input[name="agentName"]').val();
	supplyCode = $('input[name="supplyCode"]').val();
	supplyName = $('input[name="supplyName"]').val();
	orderState = $('input[name="orderState"]').val();
	dateType = $('input[name="dateType"]').val();
	startDate = $('input[name="startDate"]').val();
	endDate = $('input[name="endDate"]').val();
	beginCreateDate = $('input[name="beginCreateDate"]').val();
	endCreateDate = $('input[name="endCreateDate"]').val();
	customerOrderCode = $('input[name="customerOrderCode"]').val();
	guestName = $('input[name="guestName"]').val();
	deptNo = $('input[name="deptNo"]').val();
	maker = $('input[name="maker"]').val();
	hotelId = $('input[name="hotelId"]').val();
	hotelName = $('input[name="hotelName"]').val();
	roomTypeId = $('input[name="roomTypeId"]').val();
	roomTypeName = $('input[name="roomTypeName"]').val();
	orderType = $('input[name="orderType"]').val();
	orderSendState = $('input[name="orderSendState"]').val();
	if ($('input[name="noShowCheck"]').is(':checked')) {
		noShow = 1;
		$('input[name="noShow"]').val(1);
	} else {
		noShow = 0;
		$('input[name="noShow"]').val(0);
	}
	var da = {
		orderCode:orderCode,
		agentCode:agentCode,
		agentName:agentName,
		supplyCode:supplyCode,
		supplyName:supplyName,
		orderState:orderState,
		dateType:dateType,
		startDate:startDate,
		endDate:endDate,
		beginCreateDate:beginCreateDate,
		endCreateDate:endCreateDate,
		customerOrderCode:customerOrderCode,
		guestName:guestName,
		deptNo:deptNo,
		maker:maker,
		hotelId:hotelId,
		hotelName:hotelName,
		roomTypeId:roomTypeId,
		roomTypeName:roomTypeName,
		orderType:orderType,
		orderSendState:orderSendState,
		noShow:noShow
	}
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/queryOrderTotal',
		data : JSON.stringify(da),
		success : function(data) {
			if (data.result && data.result == 1) {
				if (data.obj && data.obj.totalReceivable && data.obj.totalReceivable.length > 0) {
					var str = ''
					$.each(data.obj.totalReceivable, function(k,v){
						if (v) {
							str += v.currency + ':' + v.price + ' ';
						}
					})
					$('#totalReceivable').html(str);
				} else {
					$('#totalReceivable').html('');
				}
				if (data.obj && data.obj.totalPayable && data.obj.totalPayable.length > 0) {
					var str = ''
					$.each(data.obj.totalPayable, function(k,v){
						if (v) {
							str += v.currency + ':' + v.price + ' ';
						}
					})
					$('#totalPayable').html(str);
				} else {
					$('#totalPayable').html('');
				}
				if (data.obj && data.obj.totalPofit && data.obj.totalPofit.length > 0) {
					var str = ''
						$.each(data.obj.totalPofit, function(k,v){
							if (v) {
								str = 'CNY:' + v.price + ' ';
							}
						})
						$('#totalProfit').html(str);
				} else {
					$('#totalProfit').html('');
				}
				if (data.obj && data.obj.totalRoomNights && data.obj.totalRoomNights.length > 0) {
					var str = ''
						$.each(data.obj.totalRoomNights, function(k,v){
							if (v) {
								str = v.price;
							}
						})
						$('#totalRoomNights').html(str);
				} else {
					$('#totalRoomNights').html('');
				}
				ajaxFormSubmit("queryOrderListForm",url,'#dataList',initPagination);
			} else {
				new Tip({msg : data.errorReason,timer : 3000,type : 2});
			}
		}
	});
}

$('#orderStateBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#orderState").val($(this).attr('value'))
	} else {
		$("#orderState").val(null)
	}
});
$('#orderSendStateBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#orderSendState").val($(this).attr('value'))
	} else {
		$("#orderSendState").val(null)
	}
});
$('input[name="dateTypeButton"]').on('click', function() {
	var val = $(this).val();
	$("#dateType").val(val);
});
$('#orderTypeBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#orderType").val($(this).attr('value'))
	} else {
		$("#orderType").val(null)
	}
});