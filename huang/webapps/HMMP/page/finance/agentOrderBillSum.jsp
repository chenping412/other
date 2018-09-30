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
			<a href="javascript:;">客户出账销账</a>
		</div>
		<div class="main-content">
			<div class="filter-bar " style="line-height: 54px;">
				<form id="queryAgentBillSumForm" action="pageSum" method="post">
					<input type="hidden" id="totalCount" name="page.totalCount"
						value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="totalPages" name="page.totalPages"
						value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
					<input type="hidden" id="currentPage" name="currentPage"
						value="<c:choose><c:when test='${empty agentCheckOutQueryDTO.currentPage}'>1</c:when><c:otherwise>${agentCheckOutQueryDTO.currentPage}</c:otherwise></c:choose>" />
					<input type="hidden" id="pageSize" name="pageSize"
						value="<c:choose><c:when test='${empty agentCheckOutQueryDTO.pageSize}'>5</c:when><c:otherwise>${agentCheckOutQueryDTO.pageSize}</c:otherwise></c:choose>" />
					<ul>
						<li class="filter-bar-list" >
							<input class="select-box-value" style="padding-left: 1%;width: 80px;" type="text" placeholder="选择出账口径"
									<c:choose>
										<c:when test="${agentCheckOutQueryDTO.dateType == 1}">value="按居住日期"</c:when>
										<c:when test="${agentCheckOutQueryDTO.dateType == 2}">value="按入住日期"</c:when>
										<c:when test="${agentCheckOutQueryDTO.dateType == 3}">value="按离店日期"</c:when>
										<c:when test="${agentCheckOutQueryDTO.dateType == 4}">value="按预定日期"</c:when>
										<c:otherwise>value="选择出账口径"</c:otherwise>
									</c:choose>  />
							<%--<i class="iconfont  icon-downTriangle" style="right: 100px"></i>--%>
							<div class="filter-bar-drop-box" style="width: 30%" >
								<ul class="clearfix"  id="dateTypeSelectBox" >
									<li class="clearfix"   value="1">按居住日期</li>
									<li class="clearfix"  value="2">按入住日期</li>
									<li class="clearfix"  value="3">按离店日期</li>
									<li class="clearfix"  value="4">按预订日期</li>
								</ul>
							</div>
							<input type="hidden" id="dateType" name="dateType" value="${agentCheckOutQueryDTO.dateType}"/>
							<input type="text" style="padding-left: 1%;width: 78px;" placeholder="开始日期"  name="beginDate" id="beginDate" value="${agentCheckOutQueryDTO.beginDate}" autocomplete="off" class="text w_140 c_666 ">
							<input type="text" style="padding-left: 1%;width: 78px;" placeholder="结束日期"  name="endDate" id="endDate" value="${agentCheckOutQueryDTO.endDate}" autocomplete="off" class="text w_140 c_666 ">
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">客户</span>
							<input type="text" placeholder="请选择客户" name="agentName" id="agentName" value="${agentCheckOutQueryDTO.agentName}" class="text w_140 c_666 ">
							<i class="iconfont  icon-downTriangle"></i>
							<input type="hidden" id="agentCode" name="agentCode" value="${agentCheckOutQueryDTO.agentCode}"/>
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">挂账方式:</span>
							<input type="text"  class="select-box-value" readonly
									<c:choose>
										<c:when test="${agentCheckOutQueryDTO.payMethod == 'prepay_all'}">value="所有费用挂账"</c:when>
										<c:when test="${agentCheckOutQueryDTO.payMethod == 'prepay_room'}">value="房费挂账杂费自理"</c:when>
										<c:when test="${agentCheckOutQueryDTO.payMethod == 'pay'}">value="前台现付"</c:when>
										<c:when test="${agentCheckOutQueryDTO.payMethod == 'cash'}">value="现金支付"</c:when>
										<c:otherwise>value="不限"</c:otherwise>
									</c:choose>  /> <i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="payMethodBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="prepay_all">所有费用挂账</li>
									<li class="clearfix" value="prepay_room">房费挂账杂费自理</li>
									<li class="clearfix" value="pay">前台现付</li>
									<li class="clearfix" value="cash">现金支付</li>
								</ul>
							</div>
							<input type="hidden" id="payMethod" name="payMethod" value="${agentCheckOutQueryDTO.payMethod}"/>
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">币种</span>
							<input type="text"
								<c:choose><c:when test="${not empty agentCheckOutQueryDTO.currency}">value="${agentCheckOutQueryDTO.currency}"</c:when><c:otherwise>value="不限"</c:otherwise></c:choose> 
								class="select-box-value" autocomplete="off"><i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box">
								<ul class="clearfix" id="currencySelectBox">
									<li value="">不限</li>
									<c:forEach items="${currencyMap}" var="currencyItem">
										<li value="${currencyItem.key}">${currencyItem.value}</li>
									</c:forEach>
								</ul>
							</div>
							<input type="hidden" id="currency" name="currency" value="${agentCheckOutQueryDTO.currency}"/>
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">供应商</span>
							<input type="text" placeholder="请选择共供应商" name="supplyName" id="supplyName" value="${agentCheckOutQueryDTO.supplyName}" class="text w_140 c_666 ">
							<i class="iconfont  icon-downTriangle"></i>
							<input type="hidden" id="supplyCode" name="supplyCode" value="${agentCheckOutQueryDTO.supplyCode}"/>
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">酒店</span>
							<input type="text" placeholder="请选择酒店" name="hotelName" id="hotelName" value="${agentCheckOutQueryDTO.hotelName}" class="text w_140 c_666 ">
							</i><i class="iconfont  icon-downTriangle"></i>
							<input type="hidden" id="hotelId" name="hotelId" value="${agentCheckOutQueryDTO.hotelId}" />
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">入住人</span>
							<input type="text" placeholder="" name="guestName" id="guestName" value="${agentCheckOutQueryDTO.guestName}" class="text w_140 c_666 ">
						</li>
						<li class="filter-bar-list" > <span class="filter-bar-list-title">对账状态:</span>
							<input class="select-box-value" type="text" readonly
								   <c:choose>
									   <c:when test="${agentCheckOutQueryDTO.billState == 2}">value="已对账"</c:when>
									   <c:when test="${agentCheckOutQueryDTO.billState == 1}">value="未对账"</c:when>
									   <c:otherwise>value="不限"</c:otherwise>
								   </c:choose>  /> <i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="billStateSelectBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="2">已对账</li>
									<li class="clearfix" value="1">未对账</li>
								</ul>
							</div>
							<input type="hidden" id="billState" name="billState" value="${agentCheckOutQueryDTO.billState}"/>
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">编制部门</span>
							<input type="text" placeholder="请选择部门" name="deptName" id="deptName" value="${agentCheckOutQueryDTO.deptName}" class="text w_140 c_666 ">
							</i><i class="iconfont  icon-downTriangle"></i>
							<input type="hidden" id="deptNo" name="deptNo" value="${agentCheckOutQueryDTO.deptNo}">
						</li>
						<li class="filter-bar-list"><span class="filter-bar-list-title">订单号</span>
							<input type="text" placeholder="" name="orderCode" id="orderCode" value="${agentCheckOutQueryDTO.orderCode}" class="text w_140 c_666 ">
						</li>
						<li class="filter-bar-list" ><span class="filter-bar-list-title">订单状态:</span>
							<input type="text" class="select-box-value"
									<c:choose>
										<c:when test="${agentCheckOutQueryDTO.orderState == 1}">value="已取消"</c:when>
										<c:when test="${agentCheckOutQueryDTO.orderState == 0}">value="未取消"</c:when>
										<c:otherwise>value="不限"</c:otherwise>
									</c:choose>  /> <i class="iconfont  icon-downTriangle"></i>
							<div class="filter-bar-drop-box" id="orderStateSelectBox">
								<ul class="clearfix">
									<li class="clearfix" value="">不限</li>
									<li class="clearfix" value="1">已取消</li>
									<li class="clearfix" value="0">未取消</li>
								</ul>
							</div>
							<input type="hidden" id="orderState" name="orderState" value="${agentCheckOutQueryDTO.orderState}"/>
						</li>
						<li class="filter-bar-list" >
							<input type="checkbox" id="isGreaterZeroChekBox" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" >
							<input type="hidden" name="isGreaterZero" id="isGreaterZero" value="${agentCheckOutQueryDTO.isGreaterZero}"/>
							<font size="3">尚欠不为0</font>
						</li>

						<li><a class="search-btn" href="javascript:queryOrderBillList();"><i
								class="iconfont icon-search"></i></a></li>
					</ul>
				</form>
			</div>

			<div class="baseline" style="margin-top: 12%; margin-bottom: -100px;"></div>
			<div class="table-list" style="padding: 140px 0 40px 10px;">
				<div class="table-list-header" style="width: 100%">
					<ul class="clearfix">
						<li style="width: 20%; text-align: center;">客户名称</li>
						<li style="width: 20%; text-align: center;">应收</li>
						<li style="width: 20%; text-align: center;">已收</li>
						<li style="width: 20%; text-align: center;">尚欠</li>
						<li style="width: 20%; text-align: center;">操作</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width: 100%">
					<c:if test="${not empty page}">
						<c:forEach items="${page.recordList}" var="orgCheckOutResponseDTO" varStatus="status">
							<ul class="row clearfix">
								<li style="width: 20%;text-align: center;">${orgCheckOutResponseDTO.orgName}-${orgCheckOutResponseDTO.orgCode}</li>
								<li style="width: 20%;text-align: center;">
									<c:if test="${not empty orgCheckOutResponseDTO.multipleCurrencyList}">
										<c:forEach items="${orgCheckOutResponseDTO.multipleCurrencyList}" var="multipleCurrency" varStatus="status">
											${multipleCurrency.reveivable}${multipleCurrency.currency}&nbsp;
										</c:forEach>
									</c:if>
								</li>
								<li style="width: 20%;text-align: center;">
									<c:if test="${not empty orgCheckOutResponseDTO.multipleCurrencyList}">
										<c:forEach items="${orgCheckOutResponseDTO.multipleCurrencyList}" var="multipleCurrency" varStatus="status">
											${multipleCurrency.actualReceived}${multipleCurrency.currency}&nbsp;
										</c:forEach>
									</c:if>
								</li>
								<li style="width: 20%;text-align: center;">
									<c:if test="${not empty orgCheckOutResponseDTO.multipleCurrencyList}">
										<c:forEach items="${orgCheckOutResponseDTO.multipleCurrencyList}" var="multipleCurrency" varStatus="status">
											${multipleCurrency.unReceivable}${multipleCurrency.currency}&nbsp;
										</c:forEach>
									</c:if>
								</li>
								<li style="width: 20%;text-align: center; color: #FF6000;">
									<div class="table-list-content-tools">
										<ul class="clearfix">
											<li><a href="javascript:queryDetailList('${orgCheckOutResponseDTO.orgCode}','${orgCheckOutResponseDTO.orgName}');" class="check-btn">查看明细</a><span>|</span></li>
											<li><a href="javascript:exportPdf('${orgCheckOutResponseDTO.orgCode}');" class="check-btn">导出PDF</a><span>|</span></li>
											<li><a href="javascript:exportExcel('${orgCheckOutResponseDTO.orgCode}');" class="check-btn">导出Excel</a><span>|</span></li>
											<%--<li><a href="javascript:balanceAccount();" class="check-btn">销账</a><span>|</span></li>--%>
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
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common2.js"></script>
<script src="<%=basePath%>js/finance/orderBill.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script type="application/javascript">

	$(function () {
		initSupplyAutocomplete();
		initHotelAutocomplete();
		initAgentAutocomplete();
		initDeptAutocomplete();
		initGreaterZeroCheckBox();
		initDatepicker();
		initPagination(queryOrderBillList);

	});


	$('#dateTypeSelectBox li').on('click', function () {
		if('全部' != $(this).html()){
			$("#dateType").val($(this).attr("value"));
		}else{
			$( "#dateType").val(null);
		}
	});

	$('#currencySelectBox li').on('click', function () {
		if('不限' != $(this).html()){
			$("#currency").val($(this).attr("value"));
		}else{
			$("#currency").val(null);
		}
	});

	$('#orderStateSelectBox li').on('click', function () {
		if('不限' != $(this).html()){
			$("#orderState").val($(this).attr("value"));
		}else{
			$("#orderState").val(null);
		}
	});

	$('#billStateSelectBox li').on('click', function () {
		if('不限' != $(this).html()){
			$("#billState").val($(this).attr("value"));
		}else{
			$("#billState").val(null);
		}
	});
	$('#payMethodBox li').on('click', function () {
		if('不限' != $(this).html()){
			$("#payMethod").val($(this).attr("value"));
		}else{
			$("#payMethod").val(null);
		}
	});

	$("#isGreaterZeroChekBox").on('click',function () {

		$("#isGreaterZero").val($("#isGreaterZeroChekBox").is(":checked"));
//		if($("#isGreaterZeroChekBox").is(":checked")== true){
//			$("#isGreaterZero").val(true);
//		}else{
//			$("#isGreaterZero").val(false);
//		}
	});

	function initGreaterZeroCheckBox(){
		if ("true" == $("#isGreaterZero").val()){
			$("#isGreaterZeroChekBox").prop("checked",true);
		}
	}

	function  queryOrderBillList() {
		$("#queryAgentBillSumForm").submit();
	}

	//客户编码
	function queryDetailList(agentCode,agentName) {
		var data={
			"dateType":$("#dateType").val(),
			"beginDate":$("#beginDate").val(),
			"endDate":$("#endDate").val(),
			"agentCode":agentCode,
			"agentName":agentName,
			"payMethod":$("#payMethod").val(),
			"currency":$("#currency").val(),
			"hotelId":$("#hotelId").val(),
			"guestName":$("#guestName").val(),
			"supplyCode":$("#supplyCode").val(),
			"billState":$("#billState").val(),
			"deptNo":$("#deptNo").val(),
			"orderCode":$("#orderCode").val(),
			"orderState":$("#orderState").val(),
			"isGreaterZero":$("#isGreaterZero").val()
		}

		var h = window.screen.availHeight-80;
		var w = window.screen.availWidth-30;
		var param = "&dateType="+$("#dateType").val()+"&beginDate="+$("#beginDate").val()+"&endDate="+$("#endDate").val()
				+"&agentCode="+agentCode+"&agentName="+agentName+"&payMethod="+$("#payMethod").val()+"&currency="+$("#currency").val()
				+"&hotelId="+$("#hotelId").val()+"&guestName="+$("#guestName").val()+"&supplyCode="+$("#supplyCode").val()
				+"&billState="+$("#billState").val()+"&deptNo="+$("#deptNo").val()+"&orderCode="+$("#orderCode").val()+"&orderState="+$("#orderState").val()+"&isGreaterZero="+$("#isGreaterZero").val();
		window.open("pageDetail?"+param,"客户销账", "height="+h+", width="+w+",top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

	}

	function exportPdf(orgCode){
		var form = getQueryParam(projectPath + 'admin/exportAgentBillPDF',orgCode);
		if (form) {
			form.submit();
			form.remove();
		}
	}

	function exportExcel(orgCode){
		var form = getQueryParam(projectPath + 'admin/exportAgentBillExcel',orgCode);
		if (form) {
			form.submit();
			form.remove();
		}
	}


	function getQueryParam(path,agentCodeValue) {
		var form = $("<form>");
		form.attr("style","display:none");
		form.attr("method","post");
		form.attr("action",path);
		var dateType = $("<input>");
		dateType.attr("type","hidden");
		dateType.attr("name","dateType");
		dateType.attr("value",$("#dateType").val());
		var beginDate = $("<input>");
		beginDate.attr("type","hidden");
		beginDate.attr("name","beginDate");
		beginDate.attr("value",$("#beginDate").val());
		var endDate = $("<input>");
		endDate.attr("type","hidden");
		endDate.attr("name","endDate");
		endDate.attr("value",$("#endDate").val());
		var agentCode = $("<input>");
		agentCode.attr("type","hidden");
		agentCode.attr("name","agentCode");
		agentCode.attr("value",agentCodeValue);
		var payMethod = $("<input>");
		payMethod.attr("type","hidden");
		payMethod.attr("name","payMethod");
		payMethod.attr("value",$("#payMethod").val());
		var currency = $("<input>");
		currency.attr("type","hidden");
		currency.attr("name","currency");
		currency.attr("value",$("#currency").val());
		var hotelId = $("<input>");
		hotelId.attr("type","hidden");
		hotelId.attr("name","hotelId");
		hotelId.attr("value",$("#hotelId").val());
		var guestName = $("<input>");
		guestName.attr("type","hidden");
		guestName.attr("name","guestName");
		guestName.attr("value",$("#guestName").val());
		var supplyCode = $("<input>");
		supplyCode.attr("type","hidden");
		supplyCode.attr("name","supplyCode");
		supplyCode.attr("value",$("#supplyCode").val());
		var billState = $("<input>");
		billState.attr("type","hidden");
		billState.attr("name","billState");
		billState.attr("value",$("#billState").val());
		var deptNo = $("<input>");
		deptNo.attr("type","hidden");
		deptNo.attr("name","deptNo");
		deptNo.attr("value",$("#deptNo").val());
		var orderCode = $("<input>");
		orderCode.attr("type","hidden");
		orderCode.attr("name","orderCode");
		orderCode.attr("value",$("#orderCode").val());
		var orderState = $("<input>");
		orderState.attr("type","hidden");
		orderState.attr("name","orderState");
		orderState.attr("value",$("#orderState").val());
		var isGreaterZero = $("<input>");
		isGreaterZero.attr("type","hidden");
		isGreaterZero.attr("name","isGreaterZero");
		isGreaterZero.attr("value",$("#isGreaterZero").val());
		$("body").append(form);
		form.append(dateType);
		form.append(beginDate);
		form.append(endDate);
		form.append(agentCode);
		form.append(payMethod);
		form.append(currency);
		form.append(hotelId);
		form.append(guestName);
		form.append(supplyCode);
		form.append(billState);
		form.append(deptNo);
		form.append(orderCode);
		form.append(orderState);
		form.append(isGreaterZero);
		return form;
	}


</script>