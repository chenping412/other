projectPath="http://"+window.location.host+"/HMMP/";

function queryAgentList() {
	$("#queryAgentListForm").submit();
}

/**
 * 删除分销商
 * @param id
 * @returns
 */
function deleteAgent(id) {
	var d = dialog({
				title : '提示',
				padding : '30px 20px',
				width : 310,
				content : '确定要删除该客户吗？',
				skin : 'saas_comfirm edit-port-dialog',
				cancelValue : '取消',
				okValue : '确定',
				ok : function() {
					$.ajax({
						type : 'POST',
						dataType : 'json',
						contentType : 'application/json; charset=UTF-8',
						context : document.body,
						url : projectPath+'admin/agentController/remove',
						data : id,
						success : function(data) {
							if (data.result && data.result == 1) {
								new Tip({msg : '删除成功',timer : 3000});
								var path = projectPath+'admin/agentController/page';
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
	$("#settlement").val($(this).attr('value'))
	if ($(this).attr('value') === 'single') {
		$('#creditLineLi').html('');
	} else {
		$('#creditLineLi').html('*');
	}
});

$('#settlementCurrencyBox').on('click', 'li', function() {
	$('input[name="settlementCurrency"]').val($(this).attr('value'))
});


/**
 * 保存分销商
 * @returns
 */
function addAgent() {
	var agentName,address,contacts,tel,fax,settlement,email,financeEmail,creditLine,settlementCurrency,isMultipleCurrency;
	agentName = $('input[name="agentName"]').val();
	address = $('input[name="address"]').val();
	contacts = $('input[name="contacts"]').val();
	tel = $('input[name="tel"]').val();
	fax = $('input[name="fax"]').val();
	settlement = $('input[name="settlement"]').val();
	email = $('input[name="email"]').val();
	financeEmail = $('input[name="financeEmail"]').val();
	creditLine = $('input[name="creditLine"]').val();
	settlementCurrency = $('input[name="settlementCurrency"]').val();
	isMultipleCurrency = $('input[type="radio"]:checked').val();
	var data = {
			agentName:agentName,
            address:address,
            contacts:contacts,
            tel:tel,
            fax:fax,
            settlement:settlement,
            email:email,
            financeEmail:financeEmail,
            creditLine:creditLine,
            settlementCurrency:settlementCurrency,
            isMultipleCurrency:isMultipleCurrency
	};
	if (!validateAgent(data)) {
		return false;
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/agentController/add',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '保存成功',timer: 3000});
                var path = projectPath+'admin/agentController/page';
                $(window.parent.document).find(".user-data").children().attr('src',path);
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

/**
 * 修改分销商
 * @returns
 */
function editAgent() {
	var agentId,agentName,address,contacts,tel,fax,settlement,email,financeEmail,creditLine,originalCreditLine,temporary,originalTemporary,isActive,settlementCurrency,originalSettlementCurrency,isMultipleCurrency,remark,originalIsActive,originalSettlement;
	agentId = $('input[name="agentId"]').val();
	agentName = $('input[name="agentName"]').val();
	address = $('input[name="address"]').val();
	contacts = $('input[name="contacts"]').val();
	tel = $('input[name="tel"]').val();
	fax = $('input[name="fax"]').val();
	settlement = $('input[name="settlement"]').val();
	originalSettlement = $('input[name="originalSettlement"]').val();
	email = $('input[name="email"]').val();
	financeEmail = $('input[name="financeEmail"]').val();
	creditLine = $('input[name="creditLine"]').val();
	originalCreditLine = $('input[name="originalCreditLine"]').val();
	temporary = $('input[name="temporary"]').val();
	originalTemporary = $('input[name="originalTemporary"]').val();
	isActive = $('input[name="isActive"]').val();
	originalIsActive = $('input[name="originalIsActive"]').val();
	settlementCurrency = $('input[name="settlementCurrency"]').val();
	originalSettlementCurrency = $('input[name="originalSettlementCurrency"]').val();
	isMultipleCurrency = $('input[type="radio"]:checked').val();
	remark = $('textarea[name="remark"]').val();
	var data = {
			agentId:agentId,
			agentName:agentName,
            address:address,
            contacts:contacts,
            tel:tel,
            fax:fax,
            settlement:settlement,
            email:email,
            financeEmail:financeEmail,
            creditLine:creditLine,
            temporary:temporary,
            isActive:isActive,
            settlementCurrency:settlementCurrency,
            isMultipleCurrency:isMultipleCurrency,
            remark:remark
	};
	if (!validateAgent(data)) {
		return false;
	}
	if (isActive != originalIsActive || settlement != originalSettlement || creditLine != originalCreditLine || temporary != originalTemporary || originalSettlementCurrency != settlementCurrency) {
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
        url : projectPath+'admin/agentController/edit',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '编辑成功',timer: 3000});
                var path = projectPath+'admin/agentController/page';
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
	var agentCode = $('input[name="agentCode"]').val();
	window.open(projectPath+'admin/agentController/toAgentFileUpload?agentCode='+agentCode+'&attachmentType=' + attachmentType, '附件管理', 'height='+h+', width='+w+',top='+top+',left='+left+',channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
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
 * 校验分销商数据
 * @param data
 * @returns
 */
function validateAgent(data) {
	if (!data.agentName) {
		new Tip({ msg: '请输入客户名称',timer: 3000,type: 2 });
        return false;
	}
	if (data.agentName.length > 100) {
		new Tip({ msg: '客户名称长度不能大于100',timer: 3000,type: 2 });
        return false;
	}
	if (!data.address) {
		new Tip({ msg: '请输入客户地址',timer: 3000,type: 2 });
        return false;
	}
	if (data.address.length > 128) {
		new Tip({ msg: '客户地址长度不能大于128',timer: 3000,type: 2 });
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
	if (data.financeEmail) {
//		var reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
//		if (!reg.test(data.financeEmail)) {
//			new Tip({ msg: '邮箱格式错误',timer: 3000,type: 2 });
//	        return false;
//		}
		if (data.financeEmail.length > 128) {
			new Tip({ msg: '财务邮箱长度超出128个字符',timer: 3000,type: 2 });
			return false;
		}
	}
	if (!data.settlement) {
		new Tip({ msg: '请选择结算方式',timer: 3000,type: 2 });
        return false;
	}
	if (!data.settlementCurrency) {
		new Tip({ msg: '请选择结算币种',timer: 3000,type: 2 });
		return false;
	}
	if (data.settlement && data.settlement !== 'single') {
		if (!data.creditLine) {
			new Tip({ msg: '请输入信用额度',timer: 3000,type: 2 });
	        return false;
		}
	}
	if (data.creditLine) {
		var reg = /^[+-]?\d*\.?\d{1,2}$/;
		if (!reg.test(data.creditLine)) {
			new Tip({ msg: '信用额度只能输入数字',timer: 3000,type: 2 });
	        return false;
		}
	}
	if ( data.temporary ) {
		var reg = /^[+-]?\d*\.?\d{1,2}$/;
		if (!reg.test(data.temporary)) {
			new Tip({ msg: '临时额度只能输入数字',timer: 3000,type: 2 });
	        return false;
		}
	}
	return true;
}