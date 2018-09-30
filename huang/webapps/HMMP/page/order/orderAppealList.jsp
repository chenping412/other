<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
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
<title>平台运营-订单管理</title>
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
	<div class="order-manage-wrap">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content">
			<shiro:hasPermission name="order:appeal:query">
			<div class="filter-bar ">
				<form id="queryOrderAppealListForm" action="page" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty orderAppealQuery.currentPage}'>1</c:when><c:otherwise>${orderAppealQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty orderAppealQuery.pageSize}'>5</c:when><c:otherwise>${orderAppealQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="status" name="status" value="${orderAppealQuery.status}" />
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单编号:</span><input id="orderCode"
							name="orderCode" value="${orderAppealQuery.orderCode}" type="text" placeholder="请输入订单编号" />
                    		 <i	class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">申诉状态:</span> <input type="text"
							id="statusText" name="statusText" readonly <c:choose><c:when test="${empty orderAppealQuery.statusText}">value="不限"</c:when><c:otherwise>value="${orderAppealQuery.statusText}"</c:otherwise></c:choose>  /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="statusTextBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="new">新建</li>
									<li class="clearfix" value="processing">处理中</li>
									<li class="clearfix" value="success">申诉成功</li>
									<li class="clearfix" value="fail">申诉失败</li>
								</ul>
							</div></li>
						<li><a class="search-btn" href="javascript:queryOrderAppealList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header">
					<ul class="clearfix">
						<li style="width: 3%">序号</li>
						<li style="width: 10%">订单编号</li>
						<li style="width: 17%">申诉原因</li>
						<li style="width: 10%">申诉人</li>
						<li style="width: 15%">申诉时间</li>
						<li style="width: 10%">处理人</li>
						<li style="width: 15%">处理时间</li>
						<li style="width: 10%">申诉状态</li>
						<li style="width: 10%">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="orderAppeal"
							varStatus="status">
							<ul class="row clearfix">
								<li style="width: 3%">${status.index + 1}</li>
								<li style="width: 10%">${orderAppeal.orderCode}</li>
								<li style="width: 17%">${orderAppeal.applyReason}</li>
								<li style="width: 10%">${orderAppeal.complainant}</li>
								<li style="width: 15%"><fmt:formatDate value="${orderAppeal.createDate}" pattern="yyyy-MM-dd HH:mm:ss"/></li>
								<li style="width: 10%">${orderAppeal.handler}</li>
								<li style="width: 15%"><fmt:formatDate value="${orderAppeal.handleTime}" pattern="yyyy-MM-dd HH:mm:ss"/></li>
								<li style="width: 10%">${orderAppeal.statusText}</li>
								<li style="width: 10%;color:#FF6000">
									<shiro:hasPermission name="order:appeal:handle">
									<div class="table-list-content-tools">
										<ul class="clearfix">
												<c:if test="${orderAppeal.status == 'new' or orderAppeal.status == 'processing'}">
													<li><a href="<%=basePath%>admin/orderAppealController/order/editPage/${orderAppeal.appealId}">处理申诉</a></li>
												</c:if>
										</ul>
									</div>
									</shiro:hasPermission>
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
<script src="<%=basePath%>js/finance/orderAppeal.js"></script>