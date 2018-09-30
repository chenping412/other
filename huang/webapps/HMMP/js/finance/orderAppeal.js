projectPath="http://"+window.location.host+"/HMMP/";

$('#statusTextBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$('input[name="status"]').val($(this).attr('value'))
	} else {
		$('input[name="status"]').val(null)
	}
});

$('#statusBox').on('click', 'li', function() {
	$('input[name="status"]').val($(this).attr('value'))
});

/**
 * 初始化分页
 */
$(function() {
	initPagination(queryOrderAppealList);
});

/**
 * 申诉查询
 * @returns
 */
function queryOrderAppealList() {
	$("#queryOrderAppealListForm").submit();
}

/**
 * 新增订单申诉
 * @returns
 */
function addOrderAppeal() {
	var orderCode,applyReason,mark;
	orderCode = $('input[name="orderCode"]').val();
	applyReason = $('input[name="applyReason"]').val();
	mark = $('textarea[name="mark"]').val();
	if (!orderCode) {
		new Tip({ msg: '请输入订单编号',timer: 3000,type: 2 });
        return false;
	}
	if (!applyReason) {
		new Tip({ msg: '请输入申诉理由',timer: 3000,type: 2 });
        return false;
	}
	var data = {
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
		data:JSON.stringify(data),
		success : function(data) {
			if (data.result && data.result == 1) {
				new Tip({ msg: '保存成功',timer: 3000});
				var path = projectPath+'admin/orderAppealController/page';
                $(window.parent.document).find(".finance-manage").children().attr('src',path);
			} else {
				new Tip({msg : data.errorReason,timer : 3000,type : 2});
			}
		}
	});
}

/**
 * 修改订单申诉(财务)
 * @returns
 */
function editAppeal() {
	var appealId,orderCode,applyReason,mark;
	appealId = $('input[name="appealId"]').val();
	orderCode = $('input[name="orderCode"]').val();
	applyReason = $('input[name="applyReason"]').val();
	mark = $('textarea[name="mark"]').val();
	if(!appealId) {
		console.log('appealId is not defined');
		return;
	}
	if (!orderCode) {
		new Tip({ msg: '请输入订单编号',timer: 3000,type: 2 });
        return false;
	}
	if (!applyReason) {
		new Tip({ msg: '请输入申诉理由',timer: 3000,type: 2 });
        return false;
	}
	var data = {
		appealId:appealId,
		orderCode:orderCode,
		applyReason:applyReason,
		mark:mark
	};
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/orderAppealController/edit',
		data:JSON.stringify(data),
		success : function(data) {
			if (data.result && data.result == 1) {
				new Tip({ msg: '编辑成功',timer: 3000});
				var path = projectPath+'admin/orderAppealController/page';
                $(window.parent.document).find(".finance-manage").children().attr('src',path);
			} else {
				new Tip({msg : data.errorReason,timer : 3000,type : 2});
			}
		}
	});
}

/**
 * 修改订单申诉(订单)
 * @returns
 */
function editOrderAppeal() {
	var appealId,orderCode,applyReason,mark,status;
	appealId = $('input[name="appealId"]').val();
	orderCode = $('input[name="orderCode"]').val();
	applyReason = $('input[name="applyReason"]').val();
	mark = $('input[name="mark"]').val();
	status = $('input[name="status"]').val();
	if(!appealId) {
		console.log('appealId is not defined');
		return;
	}
	if (!orderCode) {
		new Tip({ msg: '请输入订单编号',timer: 3000,type: 2 });
        return false;
	}
	if (!applyReason) {
		new Tip({ msg: '请输入申诉理由',timer: 3000,type: 2 });
        return false;
	}
	var data = {
		appealId:appealId,
		orderCode:orderCode,
		applyReason:applyReason,
		mark:mark,
		status:status
	};
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType : 'application/json; charset=UTF-8',
		context : document.body,
		url : projectPath+'admin/orderAppealController/order/edit',
		data:JSON.stringify(data),
		success : function(data) {
			if (data.result && data.result == 1) {
				new Tip({ msg: '编辑成功',timer: 3000});
				var path = projectPath+'admin/orderAppealController/order/page';
                $(window.parent.document).find(".order-manage").children().attr('src',path);
			} else {
				new Tip({msg : data.errorReason,timer : 3000,type : 2});
			}
		}
	});
}

/**
 * 删除订单申诉
 * @returns
 */
function deleteOrderAppeal(appealId) {
	var d = dialog({
		title : '提示',
		padding : '30px 20px',
		width : 310,
		content : '确定要删除该申诉吗？',
		skin : 'saas_comfirm edit-port-dialog',
		cancelValue : '取消',
		okValue : '确定',
		ok : function() {
			$.ajax({
				type : 'POST',
				dataType : 'json',
				contentType : 'application/json; charset=UTF-8',
				context : document.body,
				url : projectPath+'admin/orderAppealController/remove',
				data : appealId,
				success : function(data) {
					if (data.result && data.result == 1) {
						new Tip({msg : '删除成功',timer : 3000});
						var path = projectPath+'admin/orderAppealController/page';
						$(window.parent.document).find(".finance-manage").children().attr('src',path);
					} else {
						new Tip({msg : data.errorReason,timer : 3000,type : 2});
					}
				}
			});
		},
		cancel : function() {

		}

	}).showModal();
$('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
}