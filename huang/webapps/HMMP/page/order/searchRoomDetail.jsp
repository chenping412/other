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
				<form id="queryOrderRoomForm" action="searchRoomDetail" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty searchRoomQuery.currentPage}'>1</c:when><c:otherwise>${searchRoomQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty searchRoomQuery.pageSize}'>5</c:when><c:otherwise>${searchRoomQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="orderState" name="orderState" value="${searchRoomQuery.orderState}" />
					<input type="hidden" id="dateType" name="dateType" value="${searchRoomQuery.dateType}" />
					<ul class="clearfix">
						<p>
							酒店名称: <span style="padding-left: 20px;">${searchRoomQuery.hotelName}</span>
							<input type="hidden" id="hotelName" name="hotelName" value="${searchRoomQuery.hotelName}">
							<input type="hidden" id="hotelId" name="hotelId" value="${searchRoomQuery.hotelId}">
						</p>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">日期口径:</span> <input type="text"
								<c:choose>
									<c:when test="${searchRoomQuery.dateType == 1}">value="按居住日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 2}">value="按入住日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 3}">value="按离店日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 4}">value="按预定日期"</c:when>
									<c:otherwise>value="选择日期口径"</c:otherwise>
								</c:choose>	/>
							<i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="dateTypeBox">
								<ul class="clearfix">
									<li class="clearfix"  value="1">按居住日期</li>
									<li class="clearfix"  value="2">按入住日期</li>
									<li class="clearfix"  value="3">按离店日期</li>
									<li class="clearfix"  value="4">按预订日期</li>
								</ul>
							</div>
							</li>
						<li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i>
							<input type="text" style="padding-left: 1%;width: 96px;" placeholder="开始日期"  name="startDate" id="beginDate" value="${searchRoomQuery.startDate}" autocomplete="off" class="text w_140 c_666 ">
							<input type="text" style="padding-left: 1%;width: 96px;" placeholder="结束日期"  name="endDate" id="endDate" value="${searchRoomQuery.endDate}" autocomplete="off" class="text w_140 c_666 ">
							</li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单编号:</span><input id="orderCode"
							name="orderCode" value="${searchRoomQuery.orderCode}" type="text" placeholder="请输入订单编号" /> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客户名称:</span><input id="agentName"
							name="agentName" value="${searchRoomQuery.agentName}" type="text" placeholder="请输入客户名称" autocomplete="off" />
                    		<input type="hidden" id="agentCode" name="agentCode" value="${searchRoomQuery.agentCode}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客人姓名:</span><input id="guestName"
							name="guestName" value="${searchRoomQuery.guestName}" type="text" placeholder="请输入客人姓名" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li><a class="search-btn" style="top:5px;" href="javascript:queryOrderRoomList();"><i
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
						<li style="width: 10%; text-align:  center;">供应商名称</li>
						<li style="width: 10%; text-align:  center;">客户名称</li>
						<li style="width: 6%; text-align:  center;">付款方式</li>
						<li style="width: 5%; text-align:  center;">同行价</li>
						<li style="width: 5%; text-align:  center;">成本价</li>
						<li style="width: 7%; text-align:  center;">房型名称</li>
						<li style="width: 3%; text-align:  center;">间夜数</li>
						<li style="width: 6%; text-align:  center;">入住日期</li>
						<li style="width: 6%; text-align:  center;">退房日期</li>
						<li style="width: 10%; text-align:  center;">客人姓名</li>
						<li style="width: 11%; text-align:  center;">房号</li>
						<li style="width: 11%; text-align:  center;">确认号</li>
						<li style="width: 3%; text-align:  center;">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width:100%;">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="searchRoom"
							varStatus="status">
							<ul class="row clearfix">
								<li style="width: 7%; text-align:  center; color: #FF6000;">
									<input type="hidden" name="orderId" value="${searchRoom.orderId}" />
									<input type="hidden" name="roomTypeId" value="${searchRoom.roomTypeId}" />
									<a href="javascript:void(0);" title="${searchRoom.orderCode}" orderId="${searchRoom.orderId}">${searchRoom.orderCode}</a>
								</li>
								<li style="width: 10%; text-align:  center;">${searchRoom.supplyName}</li>
								<li style="width: 10%; text-align:  center; cursor:default;" <c:if test="${not empty searchRoom.agent}">title="结算方式：${searchRoom.agent.settlementText}&#10;联系电话：${searchRoom.agent.tel}&#10;信用额度：${searchRoom.agent.creditLine-searchRoom.agent.usedCreditAmount}"</c:if>>${searchRoom.agentName}</li>
								<li style="width: 6%; text-align:  center;">${searchRoom.payMethodText}</li>
								<li style="width: 5%; text-align:  center;">
									<c:if test="${not empty searchRoom.saleBPriceList}">
										<c:forEach items="${searchRoom.saleBPriceList}" var="detail" varStatus="status">${detail.saleBPrice}${detail.saleCurrency}&nbsp;</c:forEach>
									</c:if>
								
								<li style="width: 5%; text-align:  center;">
									<c:if test="${not empty searchRoom.basePriceList}">
										<c:forEach items="${searchRoom.basePriceList}" var="detail" varStatus="status">${detail.basePrice}${detail.baseCurrency}&nbsp;</c:forEach>
									</c:if>
								</li>
								<li style="width: 7%; text-align:  center;">${searchRoom.roomTypeName}</li>
								<li style="width: 3%; text-align:  center;">${searchRoom.rooms}</li>
								<li style="width: 6%; text-align:  center;"><fmt:formatDate value="${searchRoom.checkInDate}" pattern="yyyy-MM-dd" /></li>
								<li style="width: 6%; text-align:  center;"><fmt:formatDate value="${searchRoom.checkOutDate}" pattern="yyyy-MM-dd" /></li>
								<li style="width: 10%; text-align:  center;">${searchRoom.guestName}</li>
								<li style="width: 11%; text-align:  center;"><input type="text" name="roomNo" value="${searchRoom.roomNo}" style="width: 90%;height: 30px;line-height: 30px;border:1px solid #e5e5e5;" /></li>
								<li style="width: 11%; text-align:  center;"><input type="text" name="confirmNo" value="${searchRoom.confirmNo}" style="width: 90%;height: 30px;line-height: 30px;border:1px solid #e5e5e5;" /></li>
								<li style="width: 3%; text-align:  center; color: #FF6000;"><a href="javascript:void(0)" onclick="updateOrderRoomNo(this);">保存</a></li>
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
<script src="<%=basePath%>js/localdate.js"></script>
<script>
$(function() {
	initAgentAutocomplete();
	initSupplyAutocomplete();
	initHotelAutocomplete();
	initPagination(queryOrderRoomList);
	$('.row a').bind('click', function() {
		var orderCode = $(this).attr('title');
		var orderId = $(this).attr('orderId');
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
	$('input[name="startDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="endDate"]').datepicker( "option", "minDate", dateText );
		}
	});
	$('input[name="endDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
		onSelect: function(dateText, inst){
			$('input[name="startDate"]').datepicker( "option", "maxDate", dateText );
		}
	});
});
function updateOrderRoomNo(thiz) {
	var row = $(thiz).parent().parent();
	var orderId = $('input[name="orderId"]',row).val();
	var roomTypeId = $('input[name="roomTypeId"]',row).val();
	var roomNo = $('input[name="roomNo"]',row).val();
	var confirmNo = $('input[name="confirmNo"]',row).val();
	var da = {
		orderId:orderId,
		roomNo:roomNo,
		confirmNo:confirmNo,
		roomTypeId:roomTypeId
	};
	F.loading.show('mask');
	$.ajax({
        type:'POST',
        dataType : 'json',
        contentType : 'application/json; charset=UTF-8',
        context : document.body,
        url : projectPath+'admin/editOrderRoomNo',
        data:JSON.stringify(da),
        success : function(data) {
            if(data.result && data.result == 1){
                new Tip({ msg: '修改成功',timer: 1000});
                location.reload();
            }else{
                new Tip({ msg: data.errorReason,timer: 3000, type:2});
            }
            F.loading.remove();
        }
    });
}
function queryOrderRoomList() {
	$("#queryOrderRoomForm").submit();
}
</script>