<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
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
<title>银行账户管理-新增银行账户</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<body>
	<div class="add-agent-wrap">
		<div class="breadcrumb">
			<%-- <a class="return" href="javascript:;"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
			<span>当前位置：</span> <a href="javascript:;">银行账户管理</a> <span>></span> <a
				href="javascript:;">新增银行账户</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>新增银行账户</h3>
					<form id="addBankAccountFrom" action="add" method="post"
						class="form-list">
						<input type="hidden" id="currency" name="currency"
							value="CNY" />
						<ul class="row">
							<li class="list"><span>开户行名称<i class="colorYellow">*</i>
									：
							</span><input type="text" id="bankName" name="bankName"
								placeholder="请输入开户行名称"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>账户卡号<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="bankNo" name="bankNo"
								placeholder="请输入账户卡号"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>开户姓名<i class="colorYellow">*</i>
									:
							</span><input type="text" id="bankUserName" name="bankUserName"
								placeholder="请输入开户姓名"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>币种<i class="colorYellow">*</i>
									：
							</span> <input type="text" value="CNY" readonly
								class="input-effective needborder  select-box-value"
								placeholder="请选择币种"><i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="currencyBox">
									<ul class="clearfix">
										<li value="CNY">CNY</li>
										<li value="MOP">MOP</li>
										<li value="HKD">HKD</li>
									</ul>
								</div></li>
						</ul>
					</form>

				</div>
			</div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/bankAccountController/page" class="cancel">取消</a>
					<a href="javascript:addBankAccount();" class="save">保存</a>
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