<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
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
<title>平台运营-银行账户管理</title>
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<style>
.edit-port-dialog {
	height: 195px;
}
</style>

<body>

	<div class="main-manage-wrap">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content">
			<shiro:hasPermission name="member:agent:add">
				<div class="section-wrap section-wrap-function">
					<div class="section-content">
						<a href="<%=basePath%>admin/bankAccountController/addPage"
							class="addbtn">新增银行账户</a>
					</div>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="member:agent:query">
			<div class="filter-bar ">
				<form id="queryBankAccountListForm" action="page" method="post">
					<input type="hidden" id="isActive" name="isActive"
						value="${agentQuery.isActive}">
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">开户行名称:</span><input id="bankName"
							name="bankName" value="${bankAccountQuery.bankName}" type="text" placeholder="请输入开户行名称" autocomplete="off" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">是否有效:</span> <input type="text"
							id="activeName" name="activeName" readonly <c:choose><c:when test="${bankAccountQuery.isActive == 1}">value="有效"</c:when><c:when test="${bankAccountQuery.isActive == 0}">value="无效"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose>  /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="activeBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="1">有效</li>
									<li class="clearfix" value="0">无效</li>
								</ul>
							</div></li>
						<li><a class="search-btn" href="javascript:queryBankAccountList();"><i class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header" style="width:100%;">
					<ul class="clearfix">
						<li style="width: 5%">序号</li>
						<li style="width: 25%">开户行名称</li>
						<li style="width: 35%">账户卡号</li>
						<li style="width: 15%">开户姓名</li>
						<li style="width: 5%">币种</li>
						<li style="width: 10%">是否有效</li>
						<li style="width: 5%">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width:100%;">
					<c:if test="${not empty list}">
						<c:forEach items="${list}" var="bank" varStatus="status">
							<ul class="row clearfix">
								<li style="width: 5%">${status.index + 1}</li>
								<li style="width: 25%">${bank.bankName}</li>
								<li style="width: 35%">${bank.bankNo}</li>
								<li style="width: 15%">${bank.bankUserName}</li>
								<li style="width: 5%">${bank.currency}</li>
								<li style="width: 10%">${bank.isActiveText}</li>
								<li style="width: 5%; color: #FF6000;">
									<div class="table-list-content-tools">
										<ul class="clearfix">
											<shiro:hasPermission name="member:agent:edit">
												<li><a
													href="<%=basePath%>admin/bankAccountController/editPage/${bank.bankAccountId}">编辑</a><span>|</span></li>
											</shiro:hasPermission>
<%-- 											<shiro:hasPermission name="member:agent:delete"> --%>
												<li><a
													href="javascript:deleteBankAccount('${bank.bankAccountId}');"
													class="delete">删除</a></li>
<%-- 											</shiro:hasPermission> --%>
										</ul>
									</div>
								</li>
							</ul>
						</c:forEach>
					</c:if>
				</div>
			</div>
		</div>
	</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/member/bank.js"></script>