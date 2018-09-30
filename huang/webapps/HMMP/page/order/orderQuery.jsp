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
.list-ellipsis {
	text-align: center;
    overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
</head>
<body>
	<div class="order-manage-wrap">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content">
			<shiro:hasPermission name="order:list:query">
			<div class="filter-bar" style="line-height: 50px; margin-top：0px;">
				<form id="queryOrderListForm" action="orderListForPage" method="post">
					<input type="hidden" id="orderState" name="orderState" value="${queryOrderRequest.orderState}" />
					<input type="hidden" id="orderSendState" name="orderSendState" value="${queryOrderRequest.orderSendState}" />
					<input type="hidden" id="orderType" name="orderType" value="${queryOrderRequest.orderType}" />
					<input type="hidden" id="dateType" name="dateType" value="${queryOrderRequest.dateType}" />
					<input type="hidden" id="noShow" name="noShow" value="${queryOrderRequest.noShow}" />
					<input type="hidden" id="currentPage" name="currentPage" value="1" />
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单编号:</span><input id="orderCode"
							name="orderCode" value="${queryOrderRequest.orderCode}" type="text" placeholder="请输入订单编号" /> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
<!-- 						<li class="filter-bar-list"><i -->
<!-- 							class="empty iconfont icon-ArtboardCopy"></i></li> -->
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客户名称:</span><input id="agentName"
							name="agentName" value="${queryOrderRequest.agentName}" type="text" placeholder="请输入客户名称" autocomplete="off" />
                    		<input type="hidden" id="agentCode" name="agentCode" value="${queryOrderRequest.agentCode}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
<!-- 						<li class="filter-bar-list"><i -->
<!-- 							class="empty iconfont icon-ArtboardCopy"></i></li> -->
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">供应商名称:</span><input id="supplyName"
							name="supplyName" value="${queryOrderRequest.supplyName}" type="text" placeholder="请输入供应商名称" autocomplete="off" />
                    		<input type="hidden" id="supplyCode" name="supplyCode" value="${queryOrderRequest.supplyCode}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
<!-- 						<li class="filter-bar-list"><i -->
<!-- 							class="empty iconfont icon-ArtboardCopy"></i></li> -->
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单状态:</span> <input type="text"
							id="orderStateName" name="orderStateName" readonly <c:choose><c:when test="${not empty queryOrderRequest.orderStateText}">value="${queryOrderRequest.orderStateText}"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose> /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="orderStateBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="new">新建</li>
									<li class="clearfix" value="processing">处理中</li>
									<li class="clearfix" value="confirmed">已确认</li>
									<li class="clearfix" value="refused">已拒绝</li>
									<li class="clearfix" value="canceled">已取消</li>
								</ul>
							</div></li>
						<li class="filter-bar-list"><span>日期口径:</span>
<!-- 							<input type="text" -->
<%-- 								<c:choose> --%>
<%-- 									<c:when test="${queryOrderRequest.dateType == 1}">value="按居住日期"</c:when> --%>
<%-- 									<c:when test="${queryOrderRequest.dateType == 2}">value="按入住日期"</c:when> --%>
<%-- 									<c:when test="${queryOrderRequest.dateType == 3}">value="按离店日期"</c:when> --%>
<%-- 									<c:otherwise>value="选择日期口径"</c:otherwise> --%>
<%-- 								</c:choose>	/> --%>
<!-- 							<i class="iconfont  icon-downTriangle"></i> -->
<!-- 							<div class="filter-bar-drop-box" id="dateTypeBox" style="top: 46px"> -->
<!-- 								<ul class="clearfix"> -->
<!-- 									<li class="clearfix"  value="1">按居住日期</li> -->
<!-- 									<li class="clearfix"  value="2">按入住日期</li> -->
<!-- 									<li class="clearfix"  value="3">按离店日期</li> -->
<!-- 								</ul> -->
<!-- 							</div> -->
							<input type="radio" name="dateTypeButton" value="1" checked style="width:13px; vertical-align: middle; margin-left : 5px;" />按居住
							<input type="radio" name="dateTypeButton" value="2" style="width:13px; vertical-align: middle; margin-left: 5px;" />按入住
							<input type="radio" name="dateTypeButton" value="3" style="width:13px; vertical-align: middle; margin-left: 5px;" />按离店</span>
							</li>
						<li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i>
							<input type="text" style="padding-left: 1%;width: 132px;" placeholder="开始日期"  name="startDate" id="beginDate" value="${queryOrderRequest.startDate}" class="text w_140 c_666" autocomplete="off" />
							<input type="text" style="padding-left: 1%;width: 132px;" placeholder="结束日期"  name="endDate" id="endDate" value="${queryOrderRequest.endDate}" class="text w_140 c_666" autocomplete="off" />
							</li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">预定开始日期:</span><input id="beginCreateDate"
							name="beginCreateDate" value="${queryOrderRequest.beginCreateDate}" type="text" placeholder="开始日期" autocomplete="off" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
                    	<li class="filter-bar-list"><span
							class="filter-bar-list-title">预定结束日期:</span><input id="endCreateDate"
							name="endCreateDate" value="${queryOrderRequest.endCreateDate}" type="text" placeholder="结束日期" autocomplete="off" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客户订单号:</span><input id="customerOrderCode"
							name="customerOrderCode" value="${queryOrderRequest.customerOrderCode}" type="text" placeholder="请输入客户订单号" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">客人姓名:</span><input id="guestName"
							name="guestName" value="${queryOrderRequest.guestName}" type="text" placeholder="请输入客人姓名" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">制单部门:</span><input id="deptName"
							name="deptName" value="${queryOrderRequest.deptName}" type="text" placeholder="请输入制单部门" autocomplete="off" />
							<input id="deptNo" name="deptNo" value="${queryOrderRequest.deptNo}" type="hidden" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">制单人:</span><input id="maker"
							name="maker" value="${queryOrderRequest.maker}" type="text" placeholder="请输入制单人" autocomplete="off" />
							<input id="makerId"	name="makerId" value="${queryOrderRequest.maker}" type="hidden" />
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
                    	<li class="filter-bar-list"><span
							class="filter-bar-list-title">酒店名称:</span><input id="hotelName"
							name="hotelName" value="${queryOrderRequest.hotelName}" type="text" placeholder="请输入酒店名称" autocomplete="off" />
                    		<input type="hidden" id="hotelId" name="hotelId" value="${queryOrderRequest.hotelId}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">房型名称:</span><input id="roomTypeName"
							name="roomTypeName" value="${queryOrderRequest.roomTypeName}" type="text" placeholder="请输入房型名称" autocomplete="off" />
                    		<input type="hidden" id="roomTypeId" name="roomTypeId" value="${queryOrderRequest.roomTypeId}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单类型:</span> <input type="text"
							id="orderTypeName" name="orderTypeName" readonly <c:choose><c:when test="${not empty queryOrderRequest.orderTypeText}">value="${queryOrderRequest.orderTypeText}"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose> /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="orderTypeBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="scattered">散房</li>
									<li class="clearfix" value="group">团房</li>
								</ul>
							</div></li>
						
						<li></li>
                    	<li class="filter-bar-list"><span
							class="filter-bar-list-title">发单状态:</span> <input type="text"
							id="orderSendStateName" name="orderSendStateName" readonly <c:choose><c:when test="${not empty queryOrderRequest.orderSendStateText}">value="${queryOrderRequest.orderSendStateText}"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose> /> <i
							class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="orderSendStateBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="unsend">未发单</li>
									<li class="clearfix" value="sended_waitconfirm">已发单待确认</li>
									<li class="clearfix" value="hotel_confirmed">酒店已确认</li>
									<li class="clearfix" value="hotel_notconfirm">酒店不确认</li>
								</ul>
							</div></li>
						<li class="filter-bar-list"><span style="vertical-align: middle;">noshow:</span><input id="noShowCheck" style="width: 13px; vertical-align: middle; margin-left: 15px;"
							name="noShowCheck" <c:if test="${queryOrderRequest.noShow == 1}">checked</c:if> type="checkbox" /></li>
						<li></li>
						<li><a class="search-btn" style="top:5px;" href="javascript:queryOrderList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline" style="margin-top: 220px;"></div>
			<div id="dataList" class="table-list"></div>
			<div class="main_kkpager m_t10" style="margin-bottom: 35px; line-height: 34px;">
					<span style="width: 24%; color: red;">
						<b>总应收：</b><span id="totalReceivable"></span>
					</span>
					<span style="width: 24%; color: red;">
						<b>总应付：</b><span id="totalPayable"></span>
					</span>
					<span style="width: 24%; color: red;">
						<b>总利润：</b><span id="totalProfit"></span>
					</span>
					<span style="width: 24%; color: red;">
						<b>总间夜：</b><span id="totalRoomNights"></span>
					</span>
			</div>
			<div class="table-list-footer ">
				<div class="main_kkpager m_t10 ">
					<div id="kkpager" class="page_turning" style="clear: none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script src="<%=basePath%>js/order/orderList.js"></script>