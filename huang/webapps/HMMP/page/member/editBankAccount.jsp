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
<title>平台运营-银行账户管理-编辑银行账户</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

	<div class="add-agent-wrap">
		<div class="breadcrumb">
			<span>当前位置：</span> <a href="javascript:;">银行账户管理</a> <span>></span> <a
				href="javascript:;">编辑银行账户</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>编辑银行账户</h3>
					<form id="editBankAccountFrom" action="edit" method="post"
						class="form-list">
						<ul class="row">
							<input type="hidden" id="bankAccountId" name="bankAccountId" value="${bank.bankAccountId}" />
							<input type="hidden" id="originalBankNo" name="originalBankNo" value="${bank.bankNo}" />
							<input type="hidden" id="isActive" name="isActive"
								value="${bank.isActive}">
							<li class="list"><span>开户行名称<i class="colorYellow">*</i>
									：
							</span><input type="text" id="bankName" name="bankName"
								value="${bank.bankName}" placeholder="请输入开户行名称"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>账户卡号<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="bankNo" name="bankNo"
								value="${bank.bankNo}" placeholder="请输入账户卡号"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>开户姓名<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="bankUserName"
								name="bankUserName" value="${bank.bankUserName}" placeholder="请输入开户姓名"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>币种<i
									class="colorYellow">*</i> ：
							</span> <input type="text" id="currency" name="currency"
								value="${bank.currency}" readonly class="input-effective needborder select-box-value"
								placeholder="请选择结算方式"></i><i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="currencyBox">
									<ul class="clearfix">
										<li value="CNY">CNY</li>
										<li value="MOP">MOP</li>
										<li value="HKD">HKD</li>
									</ul>
								</div></li>
							<li class="list"><span>是否有效<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="activeName" name="activeName"  class=" select-box-value"
								<c:if test="${ empty bank.isActiveText}"> value="无效" </c:if><c:if test="${ not empty bank.isActiveText}"> value="${bank.isActiveText}"</c:if> placeholder="请选择是否有效">
								<i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="activeBox">
								<ul class="clearfix">
									<li class="clearfix" value="1">有效</li>
									<li class="clearfix" value="0">无效</li>
								</ul>
							</div></li>
						</ul>
					</form>
				</div>
			</div>
			<div class="baseline"></div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/bankAccountController/page" class="cancel">取消</a>
					<a href="javascript:editBankAccount();" class="save">保存</a>
				</div>
			</div>
		</div>
	</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/member/bank.js"></script>