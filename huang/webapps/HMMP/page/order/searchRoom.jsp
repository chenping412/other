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
    width: 25.3%;
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
				<form id="searchRoomForm" action="searchRoom" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty searchRoomQuery.currentPage}'>1</c:when><c:otherwise>${searchRoomQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize" 
						value="<c:choose><c:when test='${empty searchRoomQuery.pageSize}'>5</c:when><c:otherwise>${searchRoomQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="orderState" name="orderState" value="${searchRoomQuery.orderState}">
					<input type="hidden" id="cityCode" name="cityCode" value="${searchRoomQuery.cityCode}">
					<input type="hidden" id="dateType" name="dateType" value="<c:choose><c:when test='${empty searchRoomQuery.dateType}'>1</c:when><c:otherwise>${searchRoomQuery.dateType}</c:otherwise></c:choose>" />
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">日期口径:</span> <input type="text"
								<c:choose>
									<c:when test="${searchRoomQuery.dateType == 1}">value="按居住日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 2}">value="按入住日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 3}">value="按离店日期"</c:when>
									<c:when test="${searchRoomQuery.dateType == 4}">value="按预定日期"</c:when>
									<c:otherwise>value="按入住日期"</c:otherwise>
								</c:choose>	/>
							<i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="dateTypeBox" style="top: 46px">
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
							<input type="text" style="padding-left: 1%;width: 96px;" placeholder="开始日期"  name="startDate" id="startDate" value="${searchRoomQuery.startDate}" class="text w_140 c_666 " autocomplete="off" />
							<input type="text" style="padding-left: 1%;width: 96px;" placeholder="结束日期"  name="endDate" id="endDate" value="${searchRoomQuery.endDate}" class="text w_140 c_666 " autocomplete="off" />
						</li>
						<li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
                    	<li class="filter-bar-list">
	                        <span class="filter-bar-list-title">城市:</span>
	                        <input id="cityName" type="text" placeholder="请选择城市" readonly value="<c:choose><c:when test='${searchRoomQuery.cityCode == "ZHH"}'>珠海</c:when><c:when test='${searchRoomQuery.cityCode == "HKG"}'>港澳</c:when><c:otherwise>珠海</c:otherwise></c:choose>" />
	                        <div class="filter-bar-drop-box">
	                            <ul class="clearfix"  id="cityCodeBox">
	                                <li class="clearfix"  value="ZHH">珠海</li>
	                                <li class="clearfix"  value="HKG">港澳</li>
	                            </ul>
	                        </div>
	                    </li>
	                    <li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">酒店名称:</span><input id="hotelName"
							name="hotelName" value="${searchRoomQuery.hotelName}" type="text" placeholder="请输入酒店名称" autocomplete="off" />
                    		<input type="hidden" id="hotelId" name="hotelId" value="${searchRoomQuery.hotelId}"> <i
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">订单状态:</span> <input type="text"
							id="orderStateName" name="orderStateName" readonly <c:choose><c:when test="${not empty searchRoomQuery.orderStateText}">value="${searchRoomQuery.orderStateText}"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose> /> <i
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
						<li class="filter-bar-list">
                    		<i class="empty iconfont icon-ArtboardCopy"></i></li>
						<li><a class="search-btn" href="javascript:searchRoomList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
			</shiro:hasPermission>
			<div class="baseline" style="margin-top: 70px;"></div>
			<div class="table-list">
				<div class="table-list-header">
					<ul class="clearfix">
						<li style="width: 17%; text-align:  center;">酒店名称</li>
						<li style="width: 7%; text-align:  center;">订单数量</li>
						<li style="width: 7%; text-align:  center;">间夜数量</li>
					</ul>
				</div>
				<div class="table-list-content clearfix">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="orderCount"
							varStatus="status">
							<ul class="row clearfix">
								<li style="width: 17%; text-align:  center;">${orderCount.hotelName}</li>
								<li style="width: 7%; text-align:  center; color: #FF6000;"><a href="javascript:void(0);" hotelName="${orderCount.hotelName}" hotelId="${orderCount.hotelId}">${orderCount.count}</a></li>
								<li style="width: 7%; text-align:  center; color: #FF6000;"><a href="javascript:void(0);" hotelName="${orderCount.hotelName}" hotelId="${orderCount.hotelId}">${orderCount.roomNights}</a></li>
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
<script src="<%=basePath%>js/order/searchRoom.js"></script>