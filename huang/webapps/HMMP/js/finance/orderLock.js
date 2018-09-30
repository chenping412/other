projectPath="http://"+window.location.host+"/HMMP/";

$('#lockStatetBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#financeLockStatus").val($(this).attr('value'));
	} else {
		$("#financeLockStatus").val(null);
	}
});

/**
 * 初始化分页
 */
$(function() {
	initPagination(queryOrderLockList);
});

function queryOrderLockList() {
	$("#queryOrderLockListForm").submit();
}

function lock(orderId) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/orderLockController/lock',
		data : orderId,
		success : function(data) {
			if (data.result && data.result == 1) {
				var path = projectPath+'admin/orderLockController/page';
				$(window.parent.document).find(".finance-manage").children().attr('src',path);
			} else {
				new Tip({msg : data.errorReason,timer : 1000,type : 2});
			}
		}
	});
}

function unlock(orderId) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/orderLockController/unlock',
		data : orderId,
		success : function(data) {
			if (data.result && data.result == 1) {
				var path = projectPath+'admin/orderLockController/page';
				$(window.parent.document).find(".finance-manage").children().attr('src',path);
			} else {
				new Tip({msg : data.errorReason,timer : 1000,type : 2});
			}
		}
	});
}