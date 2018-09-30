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
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content"></div>
			</div>
<%-- 			<shiro:hasPermission name="finance:orderLock:query"> --%>
			<div class="filter-bar ">
				<form id="queryPayableForm" action="payable" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty payableQuery.currentPage}'>1</c:when><c:otherwise>${payableQuery.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty payableQuery.pageSize}'>5</c:when><c:otherwise>${payableQuery.pageSize}</c:otherwise></c:choose>" />
					<input type="hidden" id="dateType" name="dateType" value="${payableQuery.dateType}" />
					<ul class="clearfix">
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">日期口径:</span> <input type="text"
								<c:choose>
									<c:when test="${payableQuery.dateType == 1}">value="按居住日期"</c:when>
									<c:when test="${payableQuery.dateType == 2}">value="按入住日期"</c:when>
									<c:when test="${payableQuery.dateType == 3}">value="按离店日期"</c:when>
									<c:when test="${payableQuery.dateType == 4}">value="按预定日期"</c:when>
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
							从&nbsp;<input type="text" style="padding-left: 1%;width: 96px;" placeholder="开始日期"  name="beginDate" id="beginDate" value="${payableQuery.beginDate}" class="text w_140 c_666 ">
							到&nbsp;<input type="text" style="padding-left: 1%;width: 96px;" placeholder="结束日期"  name="endDate" id="endDate" value="${payableQuery.endDate}" class="text w_140 c_666 ">
						</li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title">供应商名称:</span><input id="supplyName"
							name="orgName" value="${payableQuery.orgName}" type="text" placeholder="请输入供应商名称" autocomplete="off" />
                    		<input type="hidden" id="supplyName" name="orgCode" value="${payableQuery.orgCode}">
                    		 <i	class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><i 
							class="empty iconfont icon-ArtboardCopy"></i></li>
						<li class="filter-bar-list"><span
							class="filter-bar-list-title"></span></li>
						<li><a class="search-btn" href="javascript:listPayable();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>
<%-- 			</shiro:hasPermission> --%>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header">
					<ul class="clearfix">
						<li style="width: 30%">订单编号</li>
						<li style="width: 15%">入住日期</li>
						<li style="width: 15%">离店日期</li>
						<li style="width: 15%">币种</li>
						<li style="width: 15%">应付</li>
					</ul>
				</div>
				<div class="table-list-content clearfix">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="payable"
							varStatus="status">
							<ul class="row clearfix">
								<li style="width: 30%">${payable.supplyName}</li>
								<li style="width: 15%"><fmt:formatDate value="${payable.checkInDate}" pattern="yyyy-MM-dd"/></li>
								<li style="width: 15%"><fmt:formatDate value="${payable.checkOutDate}" pattern="yyyy-MM-dd"/></li>
								<li style="width: 15%">${payable.baseCurrency}</li>
								<li style="width: 15%">${payable.payable}</li>
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
	initSupplyAutocomplete();
	initPagination(listPayable);
	$('input[name="beginDate"]').datepicker({
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
			$('input[name="beginDate"]').datepicker( "option", "maxDate", dateText );
		}
	});
});
function listPayable() {
	$("#queryPayableForm").submit();
}
$('#dateTypeBox').on('click', 'li', function() {
	if ('选择日期口径' != $(this).html()) {
		$("#dateType").val($(this).attr('value'));
	} else {
		$("#dateType").val(null);
	}
});
</script>