projectPath = "http://" + window.location.host + "/HMMP/";

top.F.loading.hide();

$(function() {
	initHotelAutocomplete();
	initPagination(searchRoomList);
	$('input[name="startDate"]').datepicker({
		changeMonth: true,
		changeYear: true,
		numberOfMonths:2,
		format: 'yyyy-mm-dd',
		onSelect: function(dateText, inst){
			$('input[name="endDate"]').datepicker( "option", "minDate", dateText );
		}
	});
	$('input[name="endDate"]').datepicker({
		changeMonth: true,
		changeYear: true,
		numberOfMonths:2,
		format: 'yyyy-mm-dd',
		onSelect: function(dateText, inst){
			$('input[name="startDate"]').datepicker( "option", "maxDate", dateText );
		}
	});
//	if (!$('input[name="startDate"]').val()) {
//		$('input[name="startDate"]').datepicker('setDate',new Date());
//		$('input[name="startDate"]').datepicker('option','maxDate',new Date());
//	}
//	if (!$('input[name="endDate"]').val()) {
//		$('input[name="endDate"]').datepicker('setDate',new Date());
//		$('input[name="endDate"]').datepicker('option','minDate',new Date());
//	}
	$('.row a').bind('click', function() {
		var hotelId = $(this).attr('hotelId');
		var hotelName = $(this).attr('hotelName');
		var dateType = $('input[name="dateType"]').val();
		var startDate = $('input[name="startDate"]').val();
		var endDate = $('input[name="endDate"]').val();
		var orderState = $('input[name="orderState"]').val();
		if (!hotelId) {
			console.error('hotelId is not defined');
			return;
		}
		var h = window.screen.availHeight-80;
		var w = window.screen.availWidth-30;
		window.open(projectPath +'admin/searchRoomOrderManage?hotelId=' + hotelId + '&hotelName=' + hotelName + '&dateType=' + dateType + '&startDate=' + startDate + '&endDate=' + endDate + '&orderState=' + orderState, '订单列表', 'height='+h+', width='+w+',top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
	});
});


function searchRoomList() {
	$("#searchRoomForm").submit();
}
$('#orderStateBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#orderState").val($(this).attr('value'))
	} else {
		$("#orderState").val(null)
	}
});
$('#dateTypeBox').on('click', 'li', function() {
	if ('选择日期口径' != $(this).html()) {
		$("#dateType").val($(this).attr('value'))
	} else {
		$("#dateType").val(null)
	}
});
$('#cityCodeBox').on('click', 'li', function() {
	$("#cityCode").val($(this).attr('value'))
	if ($(this).attr('value') == 'HKG') {
		$("#orderState").val(null);
		$("#orderStateName").val('不限');
	}
});