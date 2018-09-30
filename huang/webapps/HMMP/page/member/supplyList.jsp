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
<title>平台运营-供应商管理</title>
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/jquery.autocomplete.css" />
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/style.css">
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
			<shiro:hasPermission name="member:supplier:add">
				<div class="section-wrap section-wrap-function">
					<div class="section-content">
						<a href="<%=basePath%>admin/supplyController/addPage"
							class="addbtn">新增供应商</a>
					</div>
				</div>
			</shiro:hasPermission>
			<shiro:hasPermission name="member:supplier:query">
			<div class="filter-bar ">
				<form id="querySupplyListForm" action="page" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty supplyQuery.currentPage}'>1</c:when><c:otherwise>${supplyQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty supplyQuery.pageSize}'>5</c:when><c:otherwise>${supplyQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="isActive" name="isActive"
						value="${supplyQuery.isActive}">
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">供应商名称:</span><input id="supplyName"
							name="supplyName" value="${supplyQuery.supplyName}" type="text"
							value="" placeholder="请输入供应商名称" autocomplete="off" /><input type="hidden" id="supplyCode" name="supplyCode" value="${supplyQuery.supplyCode}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">是否有效:</span> <input type="text"
							id="activeName" name="activeName" readonly <c:choose><c:when test="${supplyQuery.isActive == 1}">value="有效"</c:when><c:when test="${supplyQuery.isActive == 0}">value="无效"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose>  /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="activeBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="1">有效</li>
									<li class="clearfix" value="0">无效</li>
								</ul>
							</div></li>
						<li><a class="search-btn" href="javascript:querySupplyList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header" style="width: 100%;">
					<ul class="clearfix">
						<li style="width: 5%">序号</li>
						<li style="width: 10%">供应商编码</li>
						<li style="width: 15%">供应商名称</li>
						<li style="width: 35%">地址</li>
						<li style="width: 10%">结算方式</li>
						<li style="width: 10%">联系人</li>
						<li style="width: 10%">是否有效</li>
						<li style="width: 5%">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width: 100%;">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="supply" varStatus="status">
							<ul class="row clearfix">
								<li style="width: 5%">${status.index + 1}</li>
								<li style="width: 10%">${supply.supplyCode}</li>
								<li style="width: 15%">${supply.supplyName}</li>
								<li style="width: 35%">${supply.address}</li>
								<li style="width: 10%">${supply.settlementText}</li>
								<li style="width: 10%">${supply.contacts}</li>
								<li style="width: 10%">${supply.isActiveText}</li>
								<li style="width: 5%; color: #FF6000;">
									<div class="table-list-content-tools">
										<ul class="clearfix">
											<shiro:hasPermission name="member:supplier:edit">
												<li><a
													href="<%=basePath%>admin/supplyController/editPage/${supply.supplyId}">编辑</a><span>|</span></li>
											</shiro:hasPermission>
											<shiro:hasPermission name="member:supplier:delete">
												<li><a
													href="javascript:deleteSupply('${supply.supplyId}');"
													class="delete">删除</a></li>
											</shiro:hasPermission>
										</ul>
									</div>
								</li>
							</ul>
						</c:forEach>
					</c:if>
				</div>
				<div class="table-list-footer ">
					<div class="main_kkpager m_t10 ">
						<div id="kkpager" class="page_turning"></div>
					</div>
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
<script src="<%=basePath%>js/member/supply.js"></script>
<script>
/**
 * 初始化分页
 */
$(function() {
	initSupplyAutocomplete();
	initPagination(querySupplyList);
});
</script>