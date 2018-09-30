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
<title>平台运营-财务管理</title>
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
	<div class="finance-manage-wrap">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content"></div>
			</div>
			<shiro:hasPermission name="finance:orderLock:query">
			<div class="filter-bar ">
				<form id="queryOrderLockListForm" action="page" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty orderLockQuery.currentPage}'>1</c:when><c:otherwise>${orderLockQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty orderLockQuery.pageSize}'>5</c:when><c:otherwise>${orderLockQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="financeLockStatus" name="financeLockStatus"
						value="${orderLockQuery.financeLockStatus}">
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单编号:</span><input id="orderCode"
							name="orderCode" value="${orderLockQuery.orderCode}" type="text" placeholder="请输入订单编号" />
                    		 <i	class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">锁单状态:</span> <input type="text"
							id="statusText" name="statusText" readonly <c:choose><c:when test="${orderLockQuery.financeLockStatus == 1}">value="已锁定"</c:when><c:when test="${orderLockQuery.financeLockStatus == 0}">value="已解锁"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose>  /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="lockStatetBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="1">已锁定</li>
									<li class="clearfix" value="0">已解锁</li>
								</ul>
							</div></li>
						<li><a class="search-btn" href="javascript:queryOrderLockList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header">
					<ul class="clearfix">
						<li style="width: 5%">序号</li>
						<li style="width: 10%">订单编号</li>
						<li style="width: 15%">酒店名称</li>
						<li style="width: 20%">入住姓名</li>
						<li style="width: 10%">入住日期</li>
						<li style="width: 10%">离店日期</li>
						<li style="width: 10%">操作人</li>
						<li style="width: 10%">锁单状态</li>
						<li style="width: 10%">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="orderLock"
							varStatus="status">
							<ul class="row clearfix">
								<li style="width: 5%">${status.index + 1}</li>
								<li style="width: 10%">${orderLock.orderCode}</li>
								<li style="width: 15%">${orderLock.hotelName}</li>
								<li style="width: 20%">${orderLock.guestName}</li>
								<li style="width: 10%"><fmt:formatDate value="${orderLock.checkinDate}" pattern="yyyy-MM-dd"/></li>
								<li style="width: 10%"><fmt:formatDate value="${orderLock.checkoutDate}" pattern="yyyy-MM-dd"/></li>
								<li style="width: 10%">${orderLock.financeLocker}</li>
								<li style="width: 10%">${orderLock.financeLockStateText}</li>
								<li style="width: 10%">
									<div class="table-list-content-tools">
										<ul class="clearfix">
											<shiro:hasPermission name="finance:orderLock:lock">
												<c:choose>
													<c:when test="${orderLock.financeLockStatus == 1}">
														<li><a href="javascript:unlock('${orderLock.orderId}');">解锁</a></li>
													</c:when>
													<c:otherwise>
														<li><a href="javascript:lock('${orderLock.orderId}');">锁定</a></li>
													</c:otherwise>
												</c:choose>
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
<script src="<%=basePath%>js/finance/orderLock.js"></script>