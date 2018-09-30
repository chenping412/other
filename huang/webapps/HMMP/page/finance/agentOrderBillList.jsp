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
<style>
	.edit-port-dialog {
		height: 800px;
		width: 600px;
		left: -40px;
		top: -108px;
		padding-left: 19px;
	}

	.edit-port-dialog span:first-child {
		top: 1px;
		left: 4px;
	}

	/* .form-list span {
		display: inline-block;
		width: 80px;
		color: rgba(161, 161, 161, 1);
	} */

	.tmc-dialog .ui-dialog-title {
		padding: 10px 30px 20px 0px;
	}

	.edit-port-dialog .ui-dialog-close {
		top: 0px;
		right: -10px;
	}

	/* .ui-dialog-footer {
		padding: 10px 400px 20px 20px;
	} */

	.font-bold {
		font-weight: bold
	}
</style>
<body>
	<div class="finance-manage-wrap">
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<table>
					<tr>
						<td><a href="##" class="addbtn " onclick="batchCheckOut('agentBillController');">批量标记对账</a></td>
						<td><a href="##" class="addbtn addAgentBillOff">销账</a></td>
						<td><a id="agentBillExportPDF" href="##" class="addbtn">导出PDF</a></td>
						<td><a id="agentBillExportExcel" href="##" class="addbtn">导出Excel</a></td>
					</tr>
				</table>
			</div>
			<br/>
			<%--<div class="filter-bar ">--%>
				<form id="queryOrderBillListForm" method="post">
					<input type="hidden" id="dateType" name="dateType" value="${agentCheckOutQueryDTO.dateType}"/>
					<input type="hidden" name="beginDate" id="beginDate" value="${agentCheckOutQueryDTO.beginDate}" />
					<input type="hidden" name="endDate" id="endDate" value="${agentCheckOutQueryDTO.endDate}"/>
					<input type="hidden" id="agentCode" name="agentCode" value="${agentCheckOutQueryDTO.agentCode}"/>
					<input type="hidden" id="agentName" name="agentName" value="${agentCheckOutQueryDTO.agentName}"/>

					<input type="hidden" id="payMethod" name="payMethod" value="${agentCheckOutQueryDTO.payMethod}"/>
					<input type="hidden" id="currency" name="currency" value="${agentCheckOutQueryDTO.currency}"/>
					<input type="hidden" id="hotelId" name="hotelId" value="${agentCheckOutQueryDTO.hotelId}"/>
					<input type="hidden" id="supplyCode" name="supplyCode" value="${agentCheckOutQueryDTO.supplyCode}"/>
					<input type="hidden" placeholder="" name="guestName" id="guestName" value="${agentCheckOutQueryDTO.guestName}"/>

					<input type="hidden" id="billState" name="billState" value="${agentCheckOutQueryDTO.billState}"/>
					<input type="hidden" id="deptNo" name="deptNo" value="${agentCheckOutQueryDTO.deptNo}">
					<input type="hidden" placeholder="" name="orderCode" id="orderCode" value="${agentCheckOutQueryDTO.orderCode}"/>
					<input type="hidden" id="orderState" name="orderState" value="${agentCheckOutQueryDTO.orderState}"/>
					<input type="hidden" name="isGreaterZero" id="isGreaterZero" value="${agentCheckOutQueryDTO.isGreaterZero}"/>

				</form>
			<%--</div>--%>
			<div class="baseline"></div>
			<div class="table-list">
				<div class="table-list-header" style="width:100%;">
					<ul class="clearfix">
						<li style="width: 2%; text-align: center;"><input type="checkbox" id="selectAll" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" /></li>
						<li style="width: 6%; text-align: center;">订单号</li>
						<li style="width: 11%; text-align: center;">酒店名称</li>
						<li style="width: 5%; text-align: center;">房型</li>
						<li style="width: 4%; text-align: center;">订单状态</li>
						<li style="width: 10%; text-align: center;">客人姓名</li>
						<li style="width: 3%; text-align: center;">房号</li>
						<li style="width: 5%; text-align: center;">入住</li>
						<li style="width: 5%; text-align: center;">退房</li>
						<li style="width: 3%; text-align: center;">间数</li>
						<li style="width: 5%; text-align: center;">同行价</li>
						<li style="width: 5%; text-align: center;">代付价</li>
						<li style="width: 5%; text-align: center;">应收</li>
						<li style="width: 5%; text-align: center;">已收</li>
						<li style="width: 5%; text-align: center;">本次收</li>
						<li style="width: 3%; text-align: center;">币种</li>
						<li style="width: 5%; text-align: center;">制单人</li>
						<li style="width: 3%; text-align: center;">回传单</li>
						<li style="width: 7%; text-align: center;">审核</li>
						<li style="width: 3%; text-align: center;">申诉</li>
					</ul>
				</div>
				<div class="table-list-content clearfix" style="width:100%;">
					<c:if test="${not empty recordList}">
						<c:forEach items="${recordList}" var="dayCheckOut"	varStatus="status">
							<c:if test="${not empty dayCheckOut}">
								<c:forEach items="${dayCheckOut.orgCheckOutDetailList}" var="detail"	varStatus="status">
									<ul class="row clearfix">
										<li style="width: 2%; text-align: center;"><input type="checkbox" name="dayPriceId" value="${detail.dayPriceId}" checkOut="${detail.checkOutId}" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" /></li>
										<li style="width: 6%; text-align: center;">${detail.orderCode}</li>
										<li style="width: 11%;text-align: center;">${detail.hotelName}</li>
										<li style="width: 5%; text-align: center;" class="list_agent_bill_room">${detail.roomTypeName}</li>
										<li style="width: 4%; text-align: center;">${detail.orderStateText}</li>
										<li style="width: 10%; text-align: center;">${detail.guestName}</li>
										<li style="width: 3%; text-align: center;">${detail.roomNo}</li>
										<li style="width: 5%; text-align: center;">${detail.checkInDate}</li>
										<li style="width: 5%; text-align: center;">${detail.checkOutDate}</li>
										<li style="width: 3%; text-align: center;">${detail.rooms}</li>
										<li style="width: 5%; text-align: center;">${detail.saleBPrice}</li>
										<li style="width: 5%; text-align: center;">${detail.saleCPrice}</li>
										<li style="width: 5%; text-align: center;">${detail.receivable}
											<input type="hidden" value="${detail.receivable}" id="receivable_id_${detail.dayPriceId}" />
										</li>
										<li style="width: 5%; text-align: center;">${detail.actualReceived}</li>
										<li style="width: 5%; text-align: center;">
											<c:choose>
												<c:when test="${empty detail.currentActualReceived || detail.currentActualReceived.unscaledValue() == 0}">
													<input style="width: 40px" value="${detail.unreceivable}" id="currentActualReceived_${detail.dayPriceId}"/>
												</c:when>
												<c:otherwise>
													<input style="width: 40px" value="${detail.currentActualReceived}" id="currentActualReceived_${detail.dayPriceId}"/>
												</c:otherwise>
											</c:choose>
										</li>
										<li style="width: 3%">${detail.currency}
											<input type="hidden" id="saleCurrency_${detail.dayPriceId}" value="${detail.currency}" />
										</li>
										<li style="width: 5%; text-align: center;">${detail.maker}</li>
										<li style="width: 3%; text-align: center;;color: #FF6000;">
											<a href="${detail.attachUrl}">回传单</a>
										</li>
										<input type="hidden" value="${detail.orderBillStatus}" id="orderBillStatus_${detail.dayPriceId}">
										<c:choose>
											<c:when test="${empty detail.checkOutId}">
												<li style="cursor:pointer;width: 7%; text-align: center;color: #009BF1" id="label_checkout_${detail.dayPriceId}" onclick=" checkOut('${detail.dayPriceId}','${detail.dayPriceId}','agentBillController')">标记对账</li>
											</c:when>
											<c:otherwise>
												<li style="width: 7%; color: #FF6000;text-align: center;" id="label_checkout_${detail.dayPriceId}">${detail.orderBillUser}</li>
											</c:otherwise>
										</c:choose>
										<li style="width: 3%; text-align: center;color: #FF6000;">
											<a href="javascript:orderAppear('${detail.orderCode}')">申诉</a>
										</li>
									</ul>
								</c:forEach>
							</c:if>
							<ul class="row clearfix">
								<li style="width: 4%" class="font-bold">单天小结</li>
								<li style="width: 1%" class="font-bold"></li>
								<li style="width: 7%" class="font-bold">入住：${dayCheckOut.checkInDate}</li>
								<li style="width: 7%" class="font-bold">离店：${dayCheckOut.checkOutDate}</li>
								<li style="width: 1%"></li>
								<li style="width: 16%" class="font-bold">
									同行价：<c:forEach items="${dayCheckOut.dayCheckOutList}" var="detail"	varStatus="status">${detail.saleBPrice}${detail.currency}&nbsp;</c:forEach>
								</li>
								<li style="width: 16%" class="font-bold">
									代付价：<c:forEach items="${dayCheckOut.dayCheckOutList}" var="detail"	varStatus="status">${detail.saleCPrice}${detail.currency}&nbsp;</c:forEach>
								</li>
								<li style="width: 16%" class="font-bold">
									应收：<c:forEach items="${dayCheckOut.dayCheckOutList}" var="detail"	varStatus="status">${detail.receivable}${detail.currency}&nbsp;</c:forEach>
								</li>
								<li style="width: 16%" class="font-bold">
									已收：<c:forEach items="${dayCheckOut.dayCheckOutList}" var="detail"	varStatus="status">${detail.actualReceived}${detail.currency}&nbsp;</c:forEach>
								</li>
								<li style="width: 16%" class="font-bold">
									未收：<c:forEach items="${dayCheckOut.dayCheckOutList}" var="detail"	varStatus="status">${detail.unreceivable}${detail.currency}&nbsp;</c:forEach>
								</li>
								<li style="width: 1%"></li>
							</ul>
						</c:forEach>
					</c:if>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/finance/orderBill.js"></script>
<script>

	$(function(){
		//去销账：必须选有选中的数据才能销账。选中的数据必须是已标记对账的数据。计算选中的总金额（应收，本次收）。
		$(".addAgentBillOff").on("click",function () {
			var dayPriceIdList = [],checkOutIdList = [];
			var totalCurrentActualReceived = '';
			var totalReceivable = '';
			//是否未出账：默认不是。
			var isUncheckout = false;
			var receivableMap = {};
			var currentActualReceivedMap = {};
			$("input[name='dayPriceId']:checked").each(function() {
				var rowNum = $(this).val();
				var checkOutId = $(this).attr('checkOut');
				var billStatus = $("#orderBillStatus_"+rowNum).val();
				var checkOuter = $("#label_checkout_"+rowNum).html();
				var currency = $('#saleCurrency_'+rowNum).val();
				//没有对账，而且当前的对账人为“标记对账”。则表示真的是没有对账
				if ((2 != billStatus) && (checkOuter == "标记对账") ){
					isUncheckout = true;
					return false;
				}
				if (!receivableMap[currency]) {
					receivableMap[currency] = parseInt($("#receivable_id_"+rowNum).val());
				} else {
					receivableMap[currency] += parseInt($("#receivable_id_"+rowNum).val());
				}
				if (!currentActualReceivedMap[currency]) {
					currentActualReceivedMap[currency] = parseInt($("#currentActualReceived_"+rowNum).val());
				} else {
					currentActualReceivedMap[currency] += parseInt($("#currentActualReceived_"+rowNum).val());
				}
				dayPriceIdList.push(rowNum);
				if (checkOutId) {
					checkOutIdList.push(checkOutId);
				}
			});
			$.each(receivableMap, function(k,v){
				totalReceivable += v+k+'&nbsp;';
			});
			$.each(currentActualReceivedMap, function(k,v){
				totalCurrentActualReceived += v+k+'&nbsp;';
			});
			//如果有未出账的数据
			if (isUncheckout == true){
				new Tip({msg : "没有对账不能销账",timer : 1000,type : 2});
				return false;
			}
			if (dayPriceIdList === undefined || dayPriceIdList.length == 0) {
				new Tip({msg : "请选择要销账的数据",timer : 1000,type : 2});
				return false;
			}
			var dayPriceIdJSON = dayPriceIdList.join(',');
			var checkOutIdJSON = checkOutIdList.join(',');
			var data ={
				orgCode:$("#agentCode").val(),
				orgName:$("#agentName").val(),
				dayPriceIdList:dayPriceIdJSON,
				receivable:totalReceivable,
				checkOutIdList:checkOutIdJSON,
				billOffAmount:totalCurrentActualReceived
			}
			$.ajax({
				type : 'POST',
				dataType : 'html',
				context : document.body,
				url : '<%=basePath%>admin/agentBillController/toAddBillOff',
				data : data,
				success : function(resultData) {
					if (resultData) {
						var d = dialog({
							title: '客户销账',
							content: resultData,
							width: 600,
							height:480,
							button:[
								{
									value: '取消',
									callback: function () {

									}
								},
								{
									value: '确定',
									callback: function () {
										billOff();
									},
									autofocus: true
								},
							]
						}).showModal();
					} else {
						new Tip({msg : resultData.errorReason,timer : 1000,type : 2});
					}
				}
			});
		});
		$("#agentBillExportPDF").on("click",function () {
			var form = getQueryParam(projectPath + 'admin/exportAgentBillPDF');
			if (form) {
				form.submit();
				form.remove();
			}
		});
		$("#agentBillExportExcel").on("click",function () {
			var form = getQueryParam(projectPath + 'admin/exportAgentBillExcel');
			if (form) {
				form.submit();
				form.remove();
			}
		});
	});
	function getQueryParam(path) {
		var param = "&dateType="+$("#dateType").val()+"&beginDate="+$("#beginDate").val()+"&endDate="+$("#endDate").val()
		+"&agentCode="+agentCode+"&payMethod="+$("#payMethod").val()+"&currency="+$("#currency").val()
		+"&hotelId="+$("#hotelId").val()+"&guestName="+$("#guestName").val()+"&supplyCode="+$("#supplyCode").val()
		+"&billState="+$("#billState").val()+"&deptNo="+$("#deptNo").val()+"&orderCode="+$("#orderCode").val()+"&orderState="+$("#orderState").val()+"&isGreaterZero="+$("#isGreaterZero").val();
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
		agentCode.attr("value",$("#agentCode").val());
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

	function billOff() {
		var orgCode = $("#orgCode").val();
		var orgName = $("#agentName").val();
		var serialNumber = $("#serialNumber").val();
		var receivable = $("#receivable").val();
		var billOffAmount = $("#billOffAmount").val();
		var dayPriceIdList = $("#dayPriceIdList").val();
		var checkOutIdList = $("#checkOutIdList").val();
		var remark = $("#remark").val();
		var bankNo = $("#bankNo").val();
		var bankName = $("#bankName").val();

		var data ={
			"orgCode":orgCode,
			"orgName":orgName,
			"serialNumber":serialNumber,
			"receivable":receivable,
			"billOffAmount":billOffAmount,
			"dayPriceStr":dayPriceIdList,
			"checkOutStr":checkOutIdList,
			"remark":remark,
			"bankNo":bankNo,
			"bankName":bankName
		};
		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			url : '<%=basePath%>admin/agentBillController/billOff',
			data : JSON.stringify(data),
			success : function(resultData) {
				if (resultData.result && resultData.result == 1) {
					new Tip({msg : "销账成功",timer : 1000,type : 1});
					location.reload();
				} else {
					new Tip({msg : resultData.errorReason,timer : 1000,type : 2});
				}
			}
		});
	}

	secondLimitStr($('.finance-manage-wrap .list_agent_bill_room'), '6');
</script>