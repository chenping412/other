projectPath="http://"+window.location.host+"/HMMP/";

function queryBankAccountList() {
	$("#queryBankAccountListForm").submit();
}

/**
 * 删除分销商
 * @param id
 * @returns
 */
function deleteBankAccount(id) {
	var d = dialog({
				title : '提示',
				padding : '30px 20px',
				width : 310,
				content : '确定要删除银行账户吗？',
				skin : 'saas_comfirm edit-port-dialog',
				cancelValue : '取消',
				okValue : '确定',
				ok : function() {
					$.ajax({
						type : 'POST',
						dataType : 'json',
						contentType : 'application/json; charset=UTF-8',
						context : document.body,
						url : projectPath+'admin/bankAccountController/remove',
						data : id,
						success : function(data) {
							if (data.result && data.result == 1) {
								new Tip({msg : '删除成功',timer : 3000});
								var path = projectPath+'admin/bankAccountController/page';
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

$('#currencyBox').on('click', 'li', function() {
	$("#currency").val($(this).attr('value'))
});

/**
 * 保存银行账户
 * @returns
 */
function addBankAccount() {
	var currency,bankName,bankNo,bankUserName;
	currency = $('input[name="currency"]').val();
	bankName = $('input[name="bankName"]').val();
	bankNo = $('input[name="bankNo"]').val();
	bankUserName = $('input[name="bankUserName"]').val();
	var data = {
			currency:currency,
			bankName:bankName,
			bankNo:bankNo,
			bankUserName:bankUserName
	};
	if (!validateBankAccount(data)) {
		return false;
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/bankAccountController/add',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '保存成功',timer: 3000});
                var path = projectPath+'admin/bankAccountController/page';
                $(window.parent.document).find(".user-data").children().attr('src',path);
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

/**
 * 修改银行账户信息
 * @returns
 */
function editBankAccount() {
	var bankAccountId,currency,bankName,bankNo,bankUserName,originalBankNo;
	bankAccountId = $('input[name="bankAccountId"]').val();
	currency = $('input[name="currency"]').val();
	bankName = $('input[name="bankName"]').val();
	bankNo = $('input[name="bankNo"]').val();
	originalBankNo = $('input[name="originalBankNo"]').val();
	bankUserName = $('input[name="bankUserName"]').val();
	isActive = $('input[name="isActive"]').val();
	var data = {
			bankAccountId:bankAccountId,
			currency:currency,
			bankName:bankName,
			bankNo:bankNo,
			originalBankNo:originalBankNo,
			bankUserName:bankUserName,
			isActive:isActive
	};
	if (!validateBankAccount(data)) {
		return false;
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/bankAccountController/edit',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '编辑成功',timer: 3000});
                var path = projectPath+'admin/bankAccountController/page';
                $(window.parent.document).find(".user-data").children().attr('src',path);
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

/**
 * 校验银行账户数据
 * @param data
 * @returns
 */
function validateBankAccount(data) {
	if (!data.bankName) {
		new Tip({ msg: '请输入开户行名称',timer: 3000,type: 2 });
        return false;
	}
	if (data.bankName.length > 100) {
		new Tip({ msg: '开户行名称长度不能大于100',timer: 3000,type: 2 });
        return false;
	}
	if (!data.bankNo) {
		new Tip({ msg: '请输入账户卡号',timer: 3000,type: 2 });
        return false;
	}
	if (data.bankNo.length > 30) {
		new Tip({ msg: '账户卡号长度不能大于30',timer: 3000,type: 2 });
        return false;
	}
	if (!data.bankUserName) {
		new Tip({ msg: '请输入开户姓名',timer: 3000,type: 2 });
        return false;
	}
	if (data.bankUserName.length > 64) {
		new Tip({ msg: '开户姓名长度不能大于64',timer: 3000,type: 2 });
        return false;
	}
	return true;
}