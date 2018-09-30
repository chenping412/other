<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
<%@ taglib prefix="fmt" uri="fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>平台运营-区间报价信息管理-编辑区间报价信息</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
<style>
th{
    height: 30px;
    background: #f2f2f2;
    color: #999;
}
td{
    text-align: left;
    word-break: break-all;
    box-sizing: border-box;
    border: solid #e2e2e2;
    border-width: 0 1px 1px 0
}
</style>
</head>

<body>

	<div class="add-agent-wrap">
		<div class="breadcrumb">
			<span>当前位置：</span> <a href="javascript:;">区间报价信息管理</a> <span>></span> <a
				href="javascript:;">编辑区间报价信息</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>编辑区间报价信息</h3>
					<form id="intervalInfoFrom" action="edit" method="post"
						class="form-list">
						<ul class="row">
							<input type="hidden" id="id" name="id"
								value="${intervalInfo.id}" />
							<li class="list"><span>抬头<i class="colorYellow">*</i>
									：
							</span><input type="text" id="title" name="title"
								value="${intervalInfo.title}" placeholder="请输入抬头"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>电话<i class="colorYellow">*</i>
									：
							</span><input type="text" id="tel" name="tel"
								value="${intervalInfo.tel}" placeholder="请输入电话号码"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>传真<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="fax" name="fax"
								value="${intervalInfo.fax}" placeholder="请输入传真号码"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list" style="height: 80px;"><span style="vertical-align: middle;">备注 ：</span><textarea type="text" style="vertical-align: middle;"
								id="remark" name="remark">${intervalInfo.remark}</textarea></li>
						</ul>
					</form>
				</div>
			</div>
			<div class="baseline"></div>
			<div class="search-footer">
				<div style="float: right">
					<a href="javascript:editIntervalInfo();" class="save">保存</a>
				</div>
			</div>
		</div>
	</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script>
function editIntervalInfo() {
	var id,title,tel,fax,remark;
	id = $('input[name="id"]').val();
	title = $('input[name="title"]').val();
	tel = $('input[name="tel"]').val();
	fax = $('input[name="fax"]').val();
	remark = $('textarea[name="remark"]').val();
	var data = {
			id:id,
			title:title,
			tel:tel,
            fax:fax,
            remark:remark
	};
	if (!validateIntervalInfo(data)) {
		return false;
	}
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/intervalInfoController/edit',
        data:JSON.stringify(data),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '编辑成功',timer: 3000});
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
        }
    });
}

function validateIntervalInfo(data) {
	if (!data.title) {
		new Tip({ msg: '请输入抬头',timer: 3000,type: 2 });
        return false;
	}
	if (!data.tel) {
		new Tip({ msg: '请输入电话',timer: 3000,type: 2 });
        return false;
	}
	if (!data.fax) {
		new Tip({ msg: '请输入传真',timer: 3000,type: 2 });
        return false;
	}
	if (data.title) {
		if (data.title.length > 15) {
			new Tip({ msg: '抬头长度不能大于100个字符',timer: 3000,type: 2 });
	        return false;
		}
	}
	if (data.tel) {
		if (data.tel.length > 15) {
			new Tip({ msg: '电话长度不能大于15',timer: 3000,type: 2 });
	        return false;
		}
	}
	if (data.fax) {
		if (data.fax.length > 15) {
			new Tip({ msg: '传真长度不能大于15',timer: 3000,type: 2 });
	        return false;
		}
	}
	if (data.remark) {
		if (data.remark.length > 1000) {
			new Tip({ msg: '备注长度不能大于1000个字符',timer: 3000,type: 2 });
	        return false;
		}
	}
	return true;
}
</script>