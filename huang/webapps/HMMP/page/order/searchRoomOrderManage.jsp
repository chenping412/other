<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ taglib prefix="c" uri="core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Pragma" content="no-cache"> 
<meta http-equiv="Cache-Control" content="no-cache"> 
<meta http-equiv="Expires" content="-1">
<title>订单信息</title>
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/style.css">
<link rel="stylesheet" href="<%=basePath%>css/tabstyle.css">

<style type="text/css">
body {
	background: #f8fbfe;
}

#scroll {
	background: none;
}
</style>
</head>
<body>
	<input type="hidden" name="hotelId" id="hotelId" value="${queryOrderRequest.hotelId}" />
	<input type="hidden" name="hotelName" id="hotelName" value="${queryOrderRequest.hotelName}" />
	<input type="hidden" id="orderState" name="orderState" value="${queryOrderRequest.orderState}" />
	<input type="hidden" id="dateType" name="dateType" value="${queryOrderRequest.dateType}" />
	<input type="hidden" name="startDate" id="startDate" value="${queryOrderRequest.startDate}" />
	<input type="hidden" name="endDate" id="endDate" value="${queryOrderRequest.endDate}" />
	<div class="menu"></div>
	<div class="wapper">
		<div id="page-tab">
            <button class="tab-btn" id="page-prev"></button>
            <nav id="page-tab-content">
                <div id="menu-list">
                	<!-- <a href="javascript:void(0);" data-url="#" data-vaule="订单列表" class="active">订单列表</a> -->
                </div>
            </nav>
            <button class="tab-btn" id="page-next"></button>
            <div id="page-operation">
				<div id="menu-all">
					<ul id="menu-all-ul"></ul>
				</div>
            </div>
        </div>
		<!--菜单HTML End-->
		<!--iframe Start (根据页面顶部占用高度，自行调整高度数值)-->
        <div id="page-content" style="height: calc(100% - 30px);">
        	<%-- <iframe class="iframe-content active" src="<%=basePath%>admin/orderListForPage"></iframe> --%>
        </div>
	</div>
</body>
</html>
<script type="text/javascript" src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/main.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/order/tab.js"></script>
<script type="text/javascript">
	var hotelId = $('input[name="hotelId"]').val();
	var hotelName = $('input[name="hotelName"]').val();
	var orderState = $('input[name="orderState"]').val();
	var dateType = $('input[name="dateType"]').val();
	var startDate = $('input[name="startDate"]').val();
	var endDate = $('input[name="endDate"]').val();
	$.createTab('<%=basePath%>admin/searchRoomDetail?hotelId=' + hotelId + '&hotelName=' + hotelName + '&orderState=' + orderState + '&dateType=' + dateType + '&startDate=' + startDate + '&endDate=' + endDate,'查房列表',true);
</script>