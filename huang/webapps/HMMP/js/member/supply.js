projectPath="http://"+window.location.host+"/HMMP/";

function querySupplyList() {
	$("#querySupplyListForm").submit();
}

/**
 * 删除供应商
 * @param id
 * @returns
 */
function deleteSupply(id) {
	var d = dialog({
				title : '提示',
				padding : '30px 20px',
				width : 310,
				content : '确定要删除该供应商吗？',
				skin : 'saas_comfirm edit-port-dialog',
				cancelValue : '取消',
				okValue : '确定',
				ok : function() {
					$.ajax({
						type : 'POST',
						dataType : 'json',
						contentType : 'application/json; charset=UTF-8',
						context : document.body,
						url : projectPath+'admin/supplyController/remove',
						data : id,
						success : function(data) {
							if (data.result && data.result == 1) {
								new Tip({msg : '删除成功',timer : 3000});
								var path = projectPath+'admin/supplyController/page';
								$(window.parent.document).find(".user-data").children().attr('src',path);
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

$('#activeBox').on('click', 'li', function() {
	if ('不限' != $(this).html()) {
		$("#isActive").val($(this).attr('value'))
	} else {
		$("#isActive").val(null)
	}
});

$('#settlementBox').on('click', 'li', function() {
	$('input[name="settlement"]').val($(this).attr('value'))
});

$('#settlementCurrencyBox').on('click', 'li', function() {
	$('input[name="settlementCurrency"]').val($(this).attr('value'))
});

/**
 * 保存供应商
 * @returns
 */
function addSupply() {
	var supplyName,address,contacts,tel,fax,settlement,email,settlementCurrency,isMultipleCurrency;
	supplyName = $('input[name="supplyName"]').val();
	address = $('input[name="address"]').val();
	contacts = $('input[name="contacts"]').val();
	tel = $('input[name="tel"]').val();
	fax = $('input[name="fax"]').val();
	settlement = $('input[name="settlement"]').val();
	email = $('input[name="email"]').val();
	settlementCurrency = $('input[name="settlementCurrency"]').val();
	isMultipleCurrency = $('input[type="radio"]:checked').val();
	var data = {
			supplyName:supplyName,
            address:address,
            contacts:contacts,
            tel:tel,
            fax:fax,
            settlement:settlement,
            email:email,
            settlementCurrency:settlementCurrency,
            isMultipleCurrency:isMultipleCurrency
	};
	if (!validateSupply(data)) {
		return false;
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/supplyController/add',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '保存成功',timer: 3000});
                var path = projectPath+'admin/supplyController/page';
                $(window.parent.document).find(".user-data").children().attr('src',path);
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

/**
 * 修改供应商
 * @returns
 */
function editSupply() {
	var supplyId,supplyName,address,contacts,tel,fax,settlement,email,isActive,remark,originalIsActive,originalSettlement,settlementCurrency,originalSettlementCurrency,isMultipleCurrency;
	supplyId = $('input[name="supplyId"]').val();
	supplyName = $('input[name="supplyName"]').val();
	address = $('input[name="address"]').val();
	contacts = $('input[name="contacts"]').val();
	tel = $('input[name="tel"]').val();
	fax = $('input[name="fax"]').val();
	settlement = $('input[name="settlement"]').val();
	originalSettlement = $('input[name="originalSettlement"]').val();
	email = $('input[name="email"]').val();
	isActive = $('input[name="isActive"]').val();
	originalIsActive = $('input[name="originalIsActive"]').val();
	remark = $('textarea[name="remark"]').val();
	settlementCurrency = $('input[name="settlementCurrency"]').val();
	originalSettlementCurrency = $('input[name="originalSettlementCurrency"]').val();
	isMultipleCurrency = $('input[type="radio"]:checked').val();
	var data = {
			supplyId:supplyId,
			supplyName:supplyName,
            address:address,
            contacts:contacts,
            tel:tel,
            fax:fax,
            settlement:settlement,
            email:email,
            isActive:isActive,
            remark:remark,
            settlementCurrency:settlementCurrency,
            isMultipleCurrency:isMultipleCurrency
	};
	if (!validateSupply(data)) {
		return false;
	}
	if (isActive != originalIsActive || settlement != originalSettlement || originalSettlementCurrency != settlementCurrency) {
		if (!data.remark) {
			new Tip({ msg: '请输入备注',timer: 3000,type: 2 });
	        return false;
		}
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/supplyController/edit',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '编辑成功',timer: 3000});
                var path = projectPath+'admin/supplyController/page';
                $(window.parent.document).find(".user-data").children().attr('src',path);
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

/**
 * 上传合同
 * @returns
 */
function contractUpload() {
	toUpload('contract');
}

/**
 * 上传样式单
 * @returns
 */
function styleUpload() {
	toUpload('style');
}

/**
 * 刷新父页面
 * @returns
 */
function refresh() {
	location.reload();
}

/**
 * 打开上传页面
 * @param attachmentType
 * @returns
 */
function toUpload (attachmentType) {
	var h = window.screen.availHeight / 2 + 100;
	var w = window.screen.availWidth / 2;
	var top = h / 2 - 100;
	var left = w / 2;
	var supplyCode = $('input[name="supplyCode"]').val();
	window.open(projectPath+'admin/supplyController/toSupplyFileUpload?supplyCode='+supplyCode+'&attachmentType=' + attachmentType, '附件管理', 'height='+h+', width='+w+',top='+top+',left='+left+',channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
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

/**
 * 下载附件
 * @param attachmentId
 * @param originalAttachmentName
 * @returns
 */
function downloadAttachment(attachmentId,originalAttachmentName) {
	if (!attachmentId && !originalAttachmentName) {
		return;
	}
	window.open(projectPath + 'admin/download?attachmentId='+attachmentId);
}

/**
 * 校验供应商数据
 * @param data
 * @returns
 */
function validateSupply(data) {
	if (!data.supplyName) {
		new Tip({ msg: '请输入供应商名称',timer: 3000,type: 2 });
        return false;
	}
	if (data.supplyName.length > 100) {
		new Tip({ msg: '供应商名称长度不能大于100',timer: 3000,type: 2 });
        return false;
	}
	if (!data.address) {
		new Tip({ msg: '请输入供应商地址',timer: 3000,type: 2 });
        return false;
	}
	if (data.address.length > 128) {
		new Tip({ msg: '供应商地址长度不能大于128',timer: 3000,type: 2 });
        return false;
	}
	if (!data.contacts) {
		new Tip({ msg: '请输入联系人',timer: 3000,type: 2 });
        return false;
	}
	if (data.contacts.length > 64) {
		new Tip({ msg: '联系人长度不能大于64',timer: 3000,type: 2 });
        return false;
	}
	if (!data.tel) {
		new Tip({ msg: '请输入联系电话',timer: 3000,type: 2 });
        return false;
	}
	if (data.tel.length > 15) {
		new Tip({ msg: '联系电话长度不能大于15',timer: 3000,type: 2 });
        return false;
	}
	if (data.fax) {
		if (data.fax.length > 15) {
			new Tip({ msg: '传真长度不能大于15',timer: 3000,type: 2 });
	        return false;
		}
	}
	if (data.email) {
//		var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
//		if (!reg.test(data.email)) {
//			new Tip({ msg: '邮箱格式错误',timer: 3000,type: 2 });
//	        return false;
//		}
		if (data.email.length > 128) {
			new Tip({ msg: '邮箱长度超出128个字符',timer: 3000,type: 2 });
			return false;
		}
	}
	return true;
}