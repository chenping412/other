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
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<body>
	<div class="finance-manage-wrap">
		<div class="breadcrumb">
			<div class="section-content"></div>
		</div>
		<div class="main-content" style="width: 1366px;">
<%-- 			<shiro:hasPermission name="finance:orderLock:query"> --%>

		<div class="section-wrap section-wrap-function">

			<table>
				<tr>
					<td><a id="exportDailyProfitExcel" href="##" class="addbtn">导出</a></td>
				</tr>
			</table>
		</div>

			<div class="filter-bar ">
				<form id="queryDailyProfitForm" action="dailyProfit" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty dailyProfitQueryDTO.currentPage}'>1</c:when><c:otherwise>${dailyProfitQueryDTO.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty dailyProfitQueryDTO.pageSize}'>5</c:when><c:otherwise>${dailyProfitQueryDTO.pageSize}</c:otherwise></c:choose>" />

					<%--<c:forEach items="${dailyProfitQueryDTO.cityCode}" var="city">--%>
						<%--<input type="hidden" name="cityCode" value="${city}">--%>
					<%--</c:forEach>--%>

					<input type="hidden" id="city" name="city" value="${dailyProfitQueryDTO.city}">

					<ul class="clearfix">
						<li class="filter-bar-list"><span class="filter-bar-list-title">日期:</span><i class="empty iconfont icon-ArtboardCopy"></i>
							&nbsp;<input type="text" placeholder="日期"  name="saleDate" id="saleDate" value="${dailyProfitQueryDTO.saleDate}" class="text w_140 c_666 ">
						</li>
						<li class="filter-bar-list"><span class="filter-bar-list-title">酒店名称:</span><input id="hotelName"
							name="hotelName" value="${dailyProfitQueryDTO.hotelName}" type="text" placeholder="请选择酒店" autocomplete="off" />
                    		<input type="hidden" id="hotelId" name="hotelId" value="${dailyProfitQueryDTO.hotelId}">
                    		 <i	class="empty iconfont icon-ArtboardCopy"></i></li>

						<li><a class="search-btn" href="javascript:queryDailyProfit();"><i
								class="iconfont icon-search"></i></a></li>

					</ul>
				</form>
			</div>

<%-- 			</shiro:hasPermission> --%>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header" style="width:1366px;">
					<ul class="clearfix" style="width:1366px;">
						<li style="width: 10%">分销商</li>
						<li style="width: 10%">酒店</li>
						<%--<li style="width: 5%">客人</li>--%>
						<%--<li style="width: 5%">房号</li>--%>
						<%--<li style="width: 5%">备注</li>--%>
						<li style="width: 10%">房型</li>
						<li style="width: 6%">入住</li>
						<li style="width: 6%">离店</li>
						<li style="width: 8%">支付方式</li>
						<li style="width: 5%">间数</li>
						<li style="width: 7%">底价</li>
						<li style="width: 7%">售价</li>
						<li style="width: 7%">前台价</li>
						<li style="width: 7%">毛利</li>
						<%--<li style="width: 15%">订单状态</li>--%>
						<li style="width: 6%">订单号</li>
						<%--<li style="width: 15%">下单日期</li>--%>
						<%--<li style="width: 15%">供应商</li>--%>
						<%--<li style="width: 15%">制单人</li>--%>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width:1366px;">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="daliyProfit"
							varStatus="status">
							<ul class="row clearfix" style="width:1366px;">
								<li style="width: 10%">${daliyProfit.agentName}</li>
								<li style="width: 10%">${daliyProfit.hotelName}</li>
								<%--<li style="width: 5%">${daliyProfit.guestName}</li>--%>
								<%--<li style="width: 5%">${daliyProfit.roomNo}</li>--%>
								<%--<li style="width: 5%">${daliyProfit.remark}</li>--%>
								<li style="width: 10%">${daliyProfit.roomTypeName}</li>
								<li style="width: 6%">${daliyProfit.checkinDate}</li>
								<li style="width: 6%">${daliyProfit.checkoutDate}</li>
								<li style="width: 8%">${daliyProfit.payMethod}</li>
								<li style="width: 5%">${daliyProfit.rooms}</li>
								<li style="width: 7%">${daliyProfit.basePrice} ${daliyProfit.baseCurrency}</li>
								<%--<li style="width: 5%">${daliyProfit.baseCurrency}</li>--%>
								<li style="width: 7%">${daliyProfit.saleBPrice} ${daliyProfit.saleBCurrency}</li>
								<%--<li style="width: 5%">${daliyProfit.saleBCurrency}</li>--%>
								<li style="width: 7%">${daliyProfit.saleCPrice} ${daliyProfit.saleCCurrency}</li>
								<%--<li style="width: 5%">${daliyProfit.saleCCurrency}</li>--%>
								<li style="width: 7%">${daliyProfit.profit}</li>
								<%--<li style="width: 2%">${daliyProfit.orderState}</li>--%>
								<li style="width: 6%">${daliyProfit.orderCode}</li>
								<%--<li style="width: 5%">${daliyProfit.createDate}</li>--%>
								<%--<li style="width: 5%">${daliyProfit.supplyName}</li>--%>
								<%--<li style="width: 5%">${daliyProfit.maker}</li>--%>
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
	initHotelAutocomplete();
	initPagination(queryDailyProfit);
	$('input[name="saleDate"]').datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths:2,
	});
});
function queryDailyProfit() {
	var saleDate = $("#saleDate").val();
	if (null == saleDate){
		new Tip({ msg: "请选择日期",timer: 3000, type:2});
		return;
	}
	$("#queryDailyProfitForm").submit();
}

$("#exportDailyProfitExcel").on("click",function () {
	var saleDate = $("#saleDate").val();
	if (null == saleDate){
		new Tip({ msg: "请选择日期",timer: 3000, type:2});
		return;
	}

	var form = getQueryParam(projectPath + 'admin/reportController/exportDailyProfitExcel');
	if (form) {
		form.submit();
		form.remove();
	}
});

function getQueryParam(path) {
	var form = $("<form>");
	form.attr("style", "display:none");
	form.attr("method", "post");
	form.attr("action", path);

	var saleDate = $("<input>");
	saleDate.attr("type", "hidden");
	saleDate.attr("name", "saleDate");
	saleDate.attr("value", $("#saleDate").val());

	var city = $("<input>");
	city.attr("type", "city");
	city.attr("name", "city");
	city.attr("value", $("#city").val());

	var hotelId = $("<input>");
	hotelId.attr("type", "hidden");
	hotelId.attr("name", "hotelId");
	hotelId.attr("value", $("#hotelId").val());

	$("body").append(form);
	form.append(saleDate);
	form.append(hotelId);
	form.append(city);
	return form;
}

</script>