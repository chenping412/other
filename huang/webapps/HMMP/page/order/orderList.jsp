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
<input type="hidden" id="totalCount" name="page.totalCount"
	value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
<input type="hidden" id="totalPages" name="page.totalPages"
	value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
<input type="hidden" id="pageSize" name="pageSize"
	value="<c:choose><c:when test='${empty queryOrderRequest.pageSize}'>10</c:when><c:otherwise>${queryOrderRequest.pageSize}</c:otherwise></c:choose>" />
<div class="table-list-header" style="width: 100%">
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
<div class="table-list-content clearfix" style="width: 100%">
	<c:if test="${not empty page}">
		<c:forEach items="${page.recordList}" var="order"
			varStatus="status">
			<ul class="row clearfix" <c:if test="${order.orderState == 'canceled'}">style="background-color: #ff000045;"</c:if>>
				<li style="width: 7%; text-align:  center; color: #FF6000;">
					<a href="javascript:void(0);" title="${order.orderCode}" value="${order.orderId}" onclick="orderDetail(this);">${order.orderCode}</a>
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