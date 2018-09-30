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
	<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
	.edit-port-dialog {
		height: 195px;
	}
</style>
<body>
<div class="finance-manage-wrap">

	<div class="breadcrumb">
		<span>当前位置：</span>
		<a href="javascript:;">客户销账记录</a>
	</div>


	<div class="main-content">
		<div class="filter-bar " style="line-height: 54px;">
			<form id="querySupplyBillOffForm" action="listSupplyBillOffPage" method="post">
				<input type="hidden" id="totalCount" name="page.totalCount"
					   value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
				<input type="hidden" id="totalPages" name="page.totalPages"
					   value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
				<input type="hidden" id="currentPage" name="currentPage"
					   value="<c:choose><c:when test='${empty billOffQuery.currentPage}'>1</c:when><c:otherwise>${billOffQuery.currentPage}</c:otherwise></c:choose>" />
				<input type="hidden" id="pageSize" name="pageSize"
					   value="<c:choose><c:when test='${empty billOffQuery.pageSize}'>5</c:when><c:otherwise>${billOffQuery.pageSize}</c:otherwise></c:choose>" />
				<input name="payMethod" id="payMethod" value="${billOffQuery.payMethod}" type="hidden">
				<input name="payType" id="payType" value="${billOffQuery.payType}" type="hidden">
				<ul>
					<li class="filter-bar-list" ><span class="filter-bar-list-title">销账凭号</span>
						<input name="serialNumber" id="serialNumber" value="${billOffQuery.serialNumber}" type="text" placeholder="" class="text w_140 c_666 ">
					</li>
					<li class="filter-bar-list" ><span class="filter-bar-list-title"> 供应商</span>
						<input type="text" placeholder="请选择供应商" name="supplyName" id="supplyName" value="${billOffQuery.orgName}" class="text w_140 c_666 ">
						<i class="iconfont  icon-downTriangle"></i>
						<input type="hidden" id="supplyCode" name="supplyCode" value="${billOffQuery.orgCode}"/>
					</li>
					<li><a class="search-btn" style="top: 7px;" href="javascript:queryBillOffList();"><i class="iconfont icon-search"></i></a></li>
				</ul>
			</form>
		</div>
		<div class="baseline"></div>
		<div class="table-list">
			<div class="table-list-header" style="width:100%;">
				<ul class="clearfix">
					<li style="width: 10%; text-align: center;">销账凭号</li>
					<li style="width: 12%; text-align: center;">供应商</li>
					<c:if test="${billOffQuery.payType == 1}">
						<li style="width: 20%; text-align: center;">应付</li>
						<li style="width: 20%; text-align: center;">已付</li>
					</c:if>
					<c:if test="${billOffQuery.payType == 0}">
						<li style="width: 20%; text-align: center;">应收</li>
						<li style="width: 20%; text-align: center;">已收</li>
					</c:if>
					<li style="width: 18%; text-align: center;">销账时间</li>
					<li style="width: 16%; text-align: center;">销账人</li>
					<li style="width: 4%; text-align: center;">操作</li>
				</ul>
			</div>
			<div class="table-list-content clearfix" style="width:100%;">
				<c:if test="${not empty page}">
					<c:forEach items="${page.recordList}" var="billOffResponseDTO" varStatus="status">
						<ul class="row clearfix">
							<li style="width: 10%; text-align: center">${billOffResponseDTO.serialNumber}</li>
							<li style="width: 12%; text-align: center">${billOffResponseDTO.orgName}</li>
							<li style="width: 20%; text-align: center">
								<c:if test="${not empty billOffResponseDTO.billOffDetailList}">
									<c:forEach items="${billOffResponseDTO.billOffDetailList}" var="billOffDetail" varStatus="status">
										${billOffDetail.receivable}${billOffDetail.currency}&nbsp;
									</c:forEach>
								</c:if>
							</li>
							<li style="width: 20%; text-align: center">
								<c:if test="${not empty billOffResponseDTO.billOffDetailList}">
									<c:forEach items="${billOffResponseDTO.billOffDetailList}" var="billOffDetail" varStatus="status">
										${billOffDetail.actualReceived}${billOffDetail.currency}&nbsp;
									</c:forEach>
								</c:if>
							</li>
							<li style="width: 18%; text-align: center"><fmt:formatDate value="${billOffResponseDTO.createDate}" pattern="yyyy-MM-dd HH:mm:ss"/></li>
							<li style="width: 16%; text-align: center">${billOffResponseDTO.creator}</li>
							<c:choose>
								<c:when test="${billOffResponseDTO.state == 0}">
									<li style="width: 4%; text-align: center;color: #FF6000;">
										<div class="table-list-content-tools">
											<ul class="clearfix">
												<li><a href="javascript:reverse('${billOffResponseDTO.billOffId}');" class="check-btn">反核销</a></li>
											</ul>
										</div>
									</li>
								</c:when>
								<c:otherwise>
									<li style="width: 4%; text-align: center;">已反核销</li>
								</c:otherwise>
							</c:choose>
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
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common2.js"></script>
<script src="<%=basePath%>js/finance/orderBill.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script type="application/javascript">

	$(function () {
		initSupplyAutocomplete();
		initPagination(queryBillOffList);
	});
	//查询
	function queryBillOffList() {
		$("#querySupplyBillOffForm").submit();
	}

	//反核销
	function reverse(billOffId) {

		var data={
			"billOffId":billOffId
		};

		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			url : '<%=basePath%>admin/supplyBillController/reverse',
			data : JSON.stringify(data),
			success : function(resultData) {
				if (resultData.result && resultData.result == 1) {
					new Tip({msg : "反核销成功",timer : 1000,type : 1});
					location.reload();
				} else {
					new Tip({msg : resultData.errorReason,timer : 1000,type : 2});
				}
			}
		});
	}

</script>