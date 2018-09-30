<%-- <%@ page language="java" pageEncoding="utf-8" %> --%>
<%-- <%@ page isELIgnored="false"%> --%>
<%-- <%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %> --%>
<%-- <%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%> --%>
<%-- <%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%> --%>
<%-- <%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%> --%>
<!-- <div> -->
<!-- 	<table cellpadding="0" cellspacing="0" width="100%"> -->
<!-- 		<tr> -->
<!-- 			<th>订单号</th> -->
<!-- 			<th>间数</th> -->
<!-- 			<th>分销商</th> -->
<!-- 		</tr> -->
<%-- 		<c:if test="${not empty usedQuotaPOList}"> --%>
<%-- 			<c:forEach items="${usedQuotaPOList}" var="usedQuota" varStatus="status"> --%>
<!-- 				<tr> -->
<%-- 					<td>${usedQuota.orderCode}</td> --%>
<%-- 					<td>${usedQuota.rooms}</td> --%>
<%-- 					<td>${usedQuota.agentName}</td> --%>
<!-- 				</tr> -->
<%-- 			</c:forEach> --%>
<%-- 		</c:if> --%>
<!-- 	</table> -->
<!-- </div> -->
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
<meta http-equiv="Pragma" content="no-cache"> 
<meta http-equiv="Cache-Control" content="no-cache"> 
<meta http-equiv="Expires" content="-1">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>平台运营-订单管理</title>
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/jquery.autocomplete.css" />
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/style.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
<style>
.order-manage-wrap .filter-bar .filter-bar-list {
    width: 18.3%;
}
.list-ellipsis {
	text-align: center;
    overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
</head>
<body>
	<div class="order-manage-wrap" style="width:100%;">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content">
			<shiro:hasPermission name="order:list:query">
			<div class="filter-bar" style="line-height: 50px; margin-top：0px;">
				<form id="queryUsedQuotaForm" action="queryUsedQuota" method="post">
					<input type="hidden" name="pricePlanId" id="pricePlanId" value="${quotaQuery.pricePlanId}" />
					<input type="hidden" name="saleDate" id="saleDate" value="${quotaQuery.saleDate}" />
					<ul class="clearfix">
						<p>
							酒店名称: <span style="padding-left: 20px;">${quotaQuery.hotelName}</span>
							<input type="hidden" id="hotelName" name="hotelName" value="${quotaQuery.hotelName}">
							<input type="hidden" id="hotelId" name="hotelId" value="${quotaQuery.hotelId}">
						</p>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单编号:</span><input id="orderCode"
							name="orderCode" value="${quotaQuery.orderCode}" type="text" placeholder="请输入订单编号" /> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客户名称:</span><input id="agentName"
							name="agentName" value="${quotaQuery.agentName}" type="text" placeholder="请输入客户名称" autocomplete="off" />
                    		<input type="hidden" id="agentCode" name="agentCode" value="${quotaQuery.agentCode}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客人姓名:</span><input id="guestName"
							name="guestName" value="${quotaQuery.guestName}" type="text" placeholder="请输入客人姓名" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li><a class="search-btn" style="top:5px;" href="javascript:queryUsedQuotaList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline" style="margin-top: 80px;"></div>
			<div class="table-list">
				<div class="table-list-header" style="width:100%;">
					<ul class="clearfix">
						<li style="width: 7%; text-align:  center;">订单编号</li>
						<li style="width: 2%; text-align:  center;"></li>
						<li style="width: 5%; text-align:  center;">订单状态</li>
						<li style="width: 7%; text-align:  center;">发单状态</li>
						<li style="width: 10%; text-align:  center;">供应商名称</li>
						<li style="width: 10%; text-align:  center;">客户名称</li>
						<li style="width: 10%; text-align:  center;">酒店名称</li>
						<li style="width: 5%; text-align:  center;">房型名称</li>
						<li style="width: 5%; text-align:  center;">房号</li>
						<li style="width: 6%; text-align:  center;">应收</li>
						<li style="width: 6%; text-align:  center;">应付</li>
						<li style="width: 5%; text-align:  center;">客人姓名</li>
						<li style="width: 5%; text-align:  center;">间夜</li>
						<li style="width: 5%; text-align:  center;">确认号</li>
						<li style="width: 5%; text-align:  center;">入离日期</li>
						<li style="width: 7%; text-align:  center;">预定日期</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width:100%;">
					<c:if test="${not empty usedQuotaPOList}">
						<c:forEach items="${usedQuotaPOList}" var="order"
							varStatus="status">
							<ul class="row clearfix" <c:if test="${order.orderState == 'canceled'}">style="background-color: #ff000045;"</c:if>>
								<li style="width: 7%; text-align:  center; color: #FF6000;">
									<a href="javascript:void(0);" title="${order.orderCode}" value="${order.orderId}">${order.orderCode}</a>
								</li>
								<li style="width: 2%; text-align:  center;">
									<c:if test="${order.financeLockStatus == 1}"><img style="vertical-align: middle;" width="20" height="15" src="../images/lock39.png"></c:if>
								</li>
								<li style="width: 5%; text-align: center;">${order.orderStateText}</li>
								<li style="width: 7%; text-align: center;">${order.orderSendStateText}</li>
								<li class="list-ellipsis" style="width: 10%;" title="${order.supplyName}">${order.supplyName}</li>
								<li class="list-ellipsis" style="width: 10%;" title="${order.agentName}">${order.agentName}</li>
								<li class="list-ellipsis" style="width: 10%;" title="${order.hotelName}">${order.hotelName}</li>
								<li class="list-ellipsis" style="width: 5%;" title="${order.roomTypeNameText}">${order.roomTypeNameText}</li>
								<li class="list-ellipsis" style="width: 5%;" title="${order.roomNo}">${order.roomNo}</li>
								<li class="list-ellipsis" style="width: 6%;" title="${order.saleBPriceText}">${order.saleBPriceText}</li>
								<li class="list-ellipsis" style="width: 6%;" title="${order.basePriceText}">${order.basePriceText}</li>
								<li class="list-ellipsis" style="width: 5%;" title="${order.guestName}">${order.guestName}</li>
								<li style="width: 5%; text-align: center;">${order.roomNights}</li>
								<li class="list-ellipsis" style="width: 5%;" title="${order.confirmNo}">${order.confirmNo}</li>
								<li style="width: 5%; text-align: center;">
									<p style="height: 18px; line-height: 18px;"><fmt:formatDate value="${order.checkinDate}" pattern="yyyy-MM-dd"/></p>
									<p style="height: 18px; line-height: 18px;"><fmt:formatDate value="${order.checkoutDate}" pattern="yyyy-MM-dd"/></p>
								</li>
								<li style="width: 7%; text-align:  center;"><fmt:formatDate value="${order.createDate}" pattern="yyyy-MM-dd"/></li>
							</ul>
						</c:forEach>
					</c:if>
				</div>
				<div class="table-list-footer ">
					<div class="main_kkpager m_t10 ">
<!-- 						<div id="kkpager" class="page_turning"></div> -->
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
<script src="<%=basePath%>js/localdate.js"></script>
<script>
$(function() {
	initAgentAutocomplete();
	initSupplyAutocomplete();
	initHotelAutocomplete();
	$('.row a').bind('click', function() {
		var orderCode = $(this).attr('title');
		var orderId = $(this).attr('value');
		if (!orderCode) {
			console.error('orderCode is not defined');
			return;
		}
		if(!orderId) {
			console.error('orderId is not defined');
			return;
		}
		window.parent.$.createTab(projectPath+'admin/toEditOrder/'+orderId,orderCode);
	});
});
function queryUsedQuotaList() {
	$("#queryUsedQuotaForm").submit();
}
</script>