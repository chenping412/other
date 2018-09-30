<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
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
<meta http-equiv="Pragma" content="no-cache"> 
<meta http-equiv="Cache-Control" content="no-cache"> 
<meta http-equiv="Expires" content="-1">
<title>修改订单信息</title>
<link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/style.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/jquery.autocomplete.css" />
<link rel="stylesheet" href="<%=basePath%>css/DeepSkyBlue/css/style.css">
<link rel="stylesheet" href="<%=basePath%>css/MissionRoom.css" data-export="true">

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

	<div id="scroll">
		<div class="main_sell clearfix user_title">
			<h3 class="MyAssets_top p_l15">
				<span>订单管理 >我的订单 > 修改订单信息</span>
				<span style="padding-left: 25%; font-size: 18px;">
					<c:if test="${order.financeLockStatus == 1}">&nbsp;&nbsp;&nbsp;&nbsp;订单被${order.financeLocker}锁定</c:if>
				</span>
			</h3>
		</div>
	</div>
	<div class="MissionRoom p_t56">
		<form id="editOrderFrom" name="editOrderFrom">
			<input id="roomJSON" name="roomJSON" type="hidden" value='${roomJSON}' />
			<input id="additionalJSON" name="additionalJSON" type="hidden" value='${additionalJSON}' />
			<input id="breakFastJSON" name="breakFastJSON" type="hidden" value='${breakFastJSON}' />
			<input id="orderId" name="orderId" type="hidden" value="${order.orderId}" />
			<input id="channelCode" name="channelCode" type="hidden" value="${order.channelCode}" />
			<input id="orderCode" name="orderCode" type="hidden" value="${order.orderCode}" />
			<input id="agentCode" name="agentCode" type="hidden" value="${order.agentCode}" />
			<input id="supplyCode" name="supplyCode" type="hidden" value="${order.supplyCode}" />
			<input id="orderState" name="orderState" type="hidden" value="${order.orderState}" />
			<input id="agentMultipleCurrency" name="agentMultipleCurrency" type="hidden" value="${agent.isMultipleCurrency}" />
			<input id="agentSettlementCurrency" name="agentSettlementCurrency" type="hidden" value="${agent.settlementCurrency}" />
			<input id="supplyMultipleCurrency" name="supplyMultipleCurrency" type="hidden" value="${supply.isMultipleCurrency}" />
			<input id="supplySettlementCurrency" name="supplySettlementCurrency" type="hidden" value="${supply.settlementCurrency}" />
			<input id="financeLockStatus" name="financeLockStatus" type="hidden" value="${order.financeLockStatus}" />
			<input id="hotelId" name="hotelId" type="hidden" <c:if test="${(order.orderProductDTOList)!= null && fn:length(order.orderProductDTOList) > 0}">value="${order.orderProductDTOList[0].hotelId}"</c:if> />
			<input type="hidden" name="exchange" value='${exchange}' />
			<div class="MissionRoom_content borderColor">
				<div class="MissionRoom_contentBg">
					<table cellspacing="0" cellpadding="0" width="100%"
						class="MissionRoom_table01">
						<colgroup>
							<col width="100">
							<col>
						</colgroup>
						<tr>
							<td class="MissionRoom_td01">客户信息</td>
							<td>
								<div class="teamInfo_content teamInfo_content_list ">
									<ul>
										<li><label class="teamInfo_label"> <span
												class="fl">客户名称：<i class="c_f00">*</i></span> <input
												id="agentName" name="agentName" type="text"
												class="fl f_ui-grey-input text w_250 " placeholder="请输入客户名称"
												value="${order.agentName}" customFun="fucCheckDistributor" errormsg="必填项"
												autocomplete="off" />
										</label> <label class="teamInfo_label"> <span class="fl">入住人：<i class="c_f00">*</i></span>
												<input id="guestName" name="guestName" maxlength="50" value="${order.guestName}"
												type="text" class="fl f_ui-grey-input text w_250" customFun="fucCheckGuestName" errormsg="必填项"
												placeholder="请输入入住人" />
										</label> <span class="fl teamInfo_span01">售卖渠道：<i class="c_f00">*</i></span>
												<select id="channelCode" name="channelCode" value="${order.channelCode}" class="select w_200 c_666"
												<c:if test="${order.channelCode != null && order.channelCode != 'B2B'}">disabled="disabled"</c:if>
												placeholder="请选择售卖渠道" customFun="fucCheckChannel"
												errormsg="必填项">
													<option value="B2B">同行</option>
													<option value="ctrip">携程</option>
													<option value="qunar">去哪儿</option>
													<option value="feizhu">飞猪</option>
													<option value="xmd">新美大</option>
													<option value="tuniu">途牛</option>
													<option value="jd">京东</option>
													<option value="tongcheng">同城</option>
												</select></li>
										<li><label class="teamInfo_label"> <span
												class="fl">剩余额度：<i class="c_f00">&nbsp;&nbsp;</i></span> <input
												id="credit" name="credit" type="text"
												class="fl f_ui-grey-input text w_250 " readonly="readonly"
												value="${surplus}" />
										</label> <label class="teamInfo_label"><span class="fl">客户单号：<i
													class="c_f00">&nbsp;&nbsp;</i></span><input
												id="customerOrderCode" name="customerOrderCode" type="text"
												class="fl f_ui-grey-input text w_250 " placeholder="请输入客户订单号"
												value="${order.customerOrderCode}" />
										</label><span class="fl teamInfo_span01">支付类型：<i
													class="c_f00">*</i></span>
										<select id="payMethod" name="payMethod" value="${order.payMethod}" class="select w_200 c_666">
													<option value="prepay_room">房费挂账杂费自理</option>
													<option value="prepay_all">所有费用挂账</option>
													<option value="pay">前台现付</option>
													<option value="cash">现金支付</option>
												</select>
										</li>
										<li><label class="teamInfo_label"> <span
												class="fl">订单类型：<i class="c_f00">*</i></span>
												<select id="orderType" name="orderType" value="${order.orderType}" class="select c_666" style="width: 260px;">
													<option value="scattered">散房</option>
													<option value="group">团房</option>
												</select>
											</label><label class="teamInfo_label"> <span class="fl">订单状态：<i class="c_f00">&nbsp;&nbsp;</i></span>
											<span style="line-height: 28px; color: #888;">${order.orderStateText}</span>
											</label> <span class="fl teamInfo_span01">渠道订单状态：<i class="c_f00"></i></span>
											<span style="line-height: 28px; color: #888;">
													<c:choose>
														<c:when test="${order.channelOrderStateText == null || order.channelOrderStateText == ''}">无</c:when>
														<c:otherwise>${order.channelOrderStateText}</c:otherwise>
													</c:choose>
												</span>
										</li>
										<li><label class="teamInfo_label"> <span
												class="fl">入离日期：<i class="c_f00">&nbsp;&nbsp;</i></span>
												<span style="line-height: 28px; color: #888;"><fmt:formatDate value="${order.checkinDate}" pattern="yyyy-MM-dd"/> / <fmt:formatDate value="${order.checkoutDate}" pattern="yyyy-MM-dd"/></span>
											</label><label class="teamInfo_label"> <span
												class="fl">发单状态：<i class="c_f00">&nbsp;&nbsp;</i></span>
												<span style="line-height: 28px; color: #888;">
													<c:choose>
														<c:when test="${order.orderSendStateText == null || order.orderSendStateText == ''}">未发单</c:when>
														<c:otherwise>${order.orderSendStateText}</c:otherwise>
													</c:choose>
												</span>
											</label><span class="fl teamInfo_span01">noshow<i class="c_f00"></i></span>
											<span style="line-height: 28px; padding-left: 10px;"><input type="checkbox" name="noShow" style="width: 16px; height: 16px;" <c:if test="${order.noShow == 1}">checked</c:if> /></span>
										</li>
									</ul>
								</div>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">酒店信息</td>
							<td>
								<div class="teamInfo_content">
									<ul>
										<li><label class="teamInfo_label"> <span class="fl">酒店名称：<i
													class="c_f00">*</i></span> <input id="hotelName"
												name="hotelName" type="text" <c:if test="${(order.orderProductDTOList)!= null && fn:length(order.orderProductDTOList) > 0}">value="${order.orderProductDTOList[0].hotelName}"</c:if>
												class="fl f_ui-grey-input text w_250"
												customFun="fucCheckHotel" errormsg="必填项"
												placeholder="请输入酒店名称" autocomplete="off" />
										</label><label class="teamInfo_label"> <span
												class="fl">供应商：<i class="c_f00">*</i></span> <input
												id="supplyName" name="supplyName" type="text" value="${order.supplyName}"
												class="fl f_ui-grey-input text w_250 valiSupplier"
												id="teamInfo_gxs" placeholder="请输入供应商名称"
												customFun="fucCheckSupplier" errormsg="必填项"
												autocomplete="off" />
										</label><span class="fl teamInfo_span01">确认号：<i
													class="c_f00">&nbsp;&nbsp;&nbsp;&nbsp;</i></span><input
												id="confirmNo" name="confirmNo" type="text"
												class="fl f_ui-grey-input text w_170 " placeholder="请输入确认号"
												value="${order.confirmNo}" /></li>
										<li><label class="teamInfo_label"> <span class="fl"><i class="c_f00"></i></span>
										</label><label class="teamInfo_label"> <span class="fl"><i class="c_f00"></i></span>
										</label><span class="fl teamInfo_span01"><i	class="c_f00"></i></span></li>
									</ul>
								</div>
							</td>
						</tr>
						<tr id="roomInfoDay">
							<td class="MissionRoom_td01">房费</td>
							<td class="MissionRoom_td02 MissionRoom_td04 pd-0">
								<table cellpadding="0" cellspacing="0" width="100%"
									class="mission-room-info" >
									<colgroup>
										<col width="17%">
										<col width="7%">
										<col width="10%">
										<col width="5%">
										<col width="10%">
										<col width="10%">
										<col width="10%">
										<col width="5%">
									</colgroup>
									<tr id="roomOpt">
										<th><i class="c_f00">*</i>产品名称</th>
										<th><i class="c_f00"></i>床型</th>
										<th><i class="c_f00">*</i>日期</th>
										<th><i class="c_f00">*</i>间数</th>
										<th class="saleCPrice"><i class="c_f00">*</i>代收价</th>
										<th><i class="c_f00">*</i>同行价</th>
										<th><i class="c_f00">*</i>底价</th>
										<th>操作</th>
									</tr>
									<tr id="roomTarget"></tr>
								</table>
								<p class="additional-notice"><a href="javascript:void(0)" onclick="appendRoomDetail()"	class="fl mission-room-add underline J-modal-room">新增</a></p>
							</td>
						</tr>
						<tr id="additionDay">
							<td class="MissionRoom_td01">附加项</td>
							<td class="MissionRoom_td02 MissionRoom_td04">
								<table cellpadding="0" cellspacing="0" width="100%"
									class="mission-room-info" >
									<colgroup>
										<col width="17%">
										<col width="7%">
										<col width="10%">
										<col width="5%">
										<col width="10%">
										<col width="10%">
										<col width="10%">
										<col width="5%">
									</colgroup>
									<tr id="additionOpt">
										<th><i class="c_f00">*</i>附加项名称</th>
										<th><i class="c_f00"></i>类型</th>
										<th><i class="c_f00">*</i>日期</th>
										<th><i class="c_f00">*</i>数量</th>
										<th class="additionalSaleCPrice"><i class="c_f00">*</i>代收价/晚</th>
										<th><i class="c_f00">*</i>同行价/晚</th>
										<th><i class="c_f00">*</i>底价/晚</th>
										<th>操作</th>
									</tr>
									<tr id="additionTarget"></tr>
								</table>
								<p class="additional-notice"><a href="javascript:void(0)" onclick="appendAdditionalDetail()"	class="fl mission-room-add underline J-modal-room">新增</a></p>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">合计</td>
							<td class="MissionRoom_td02 MissionRoom_td04">
								<div class="MissionRoom_Show" id="additionDiv">
									<table cellpadding="0" cellspacing="0" width="100%"
										class="MissionRoom_table06">
										<colgroup>
											<col width="28%">
											<col width="23%">
											<col width="25%">
											<col>
										</colgroup>
										<tr>
											<td class="p_l30">
												<span class="textStyle01">应收金额：</span>
												<span id="receiveable">
													<c:if test="${not empty order.receivableList}">
															<c:forEach items="${order.receivableList}" var="receive" varStatus="status">
																${receive.price}${receive.currency}&nbsp;
															</c:forEach>
														</span>
													</c:if>
												</span>
											</td>
											<td>
												<span class="textStyle01">已收：</span>
												<span id="receiveabled">
													<c:if test="${not empty order.receivableList}">
															<c:forEach items="${order.receivableList}" var="receive" varStatus="status">
																${receive.actualPrice}${receive.currency}&nbsp;
															</c:forEach>
														</span>
													</c:if>
												</span>
											</td>
											<td>
												<span class="textStyle01">未收：</span>
												<span id="unreceiveable">
													<c:if test="${not empty order.receivableList}">
														<c:forEach items="${order.receivableList}" var="receive" varStatus="status">
															${receive.unActualPrice}${receive.currency}&nbsp;
														</c:forEach>
													</c:if>
												</span>
											</td>
											<td><span class="textStyle01"></span></td>
										</tr>
										<tr>
											<td class="p_l30">
												<span class="textStyle01">应付金额：</span>
												<span id="payable">
													<c:if test="${not empty order.payableList}">
														<c:forEach items="${order.payableList}" var="payable" varStatus="status">
															${payable.price}${payable.currency}&nbsp;
														</c:forEach>
													</c:if>
												</span>
											</td>
											<td>
												<span class="textStyle01">已付：</span>
												<span id="payabled">
													<c:if test="${not empty order.payableList}">
														<c:forEach items="${order.payableList}" var="payable" varStatus="status">
															${payable.actualPrice}${payable.currency}&nbsp;
														</c:forEach>
													</c:if>
												</span>
											</td>
											<td>
												<span class="textStyle01">未付：</span>
												<span id="unpayable">
													<c:if test="${not empty order.payableList}">
														<c:forEach items="${order.payableList}" var="payable" varStatus="status">
															${payable.unActualPrice}${payable.currency}&nbsp;
														</c:forEach>
													</c:if>
												</span>
											</td>
											<td><span class="textStyle01"></span></td>
										</tr>
										<tr>
											<td colspan="4" class="p_l30"><span class="textStyle01"
												style="">利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;润：</span><i
												class="colorGreen fs16" id="profit">${order.profit} CNY</i>
											</td>
										</tr>
									</table>
								</div>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">附件管理</td>
							<td id="attachmentManage" class="MissionRoom_td02 MissionRoom_td04">
								<table cellpadding="0" cellspacing="0" width="100%" class="mission-room-info">
									<tr id="file-list">
										<th>附件类型</th>
										<th>文件名称</th>
										<th>上传时间</th>
										<th>操作</th>
									</tr>
									<c:if test="${not empty order.attachmentList}">
										<c:forEach items="${order.attachmentList}" var="attachment"	varStatus="status">
											<tr id="${attachment.attachmentId}">
												<td>${attachment.attachmentTypeText}</td>
												<td><a href="javascript:void(0)" style="color: #FF6000;" onclick="downloadAttachment('${attachment.attachmentId}','${attachment.originalAttachmentName}')">${attachment.originalAttachmentName}</td>
												<td><fmt:formatDate value="${attachment.uploadDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
												<td><a href="javascript:void(0);" style="color: #FF6000;" onclick="removeAttachment(this);">删除</a></td>
											</tr>
										</c:forEach>
										<tr></tr>
									</c:if>
								</table>
								<p class="additional-notice">
									<a href="javascript:imageUpload();" style="color: #FF6000;">上传回传单</a>&nbsp;&nbsp;
									<a href="javascript:fileUpload();" style="color: #FF6000;">上传入住人</a>
						    	</p>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">备注</td>
							<td>
								<div class="MissionRoom_Remark clearfix" style="float: left; width: 25%;">
									<textarea id="remark" name="remark" class="text" placeholder="请输入备注信息" maxlength="200" value="${order.remark}">${order.remark}</textarea>
								</div>
								<div style="float: left; width: 50%;padding-top: 30px;">
									<input type="checkbox" name="quickRemark" value="尽量大床" />尽量大床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="quickRemark" value="原房续住" />原房续住<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量双床" />尽量双床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="quickRemark" value="尽量吸烟房" />尽量吸烟房<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量高层" />尽量高层<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量无烟房" />尽量无烟房<br/>
								</div>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">日志</td>
							<td class="MissionRoom_td02 MissionRoom_td04">
								<table cellpadding="0" cellspacing="0" width="100%"	class="mission-room-info" >
									<colgroup>
										<col width="7%">
										<col width="10%">
										<col>
									</colgroup>
									<tr>
										<th>操作人</th>
										<th>操作时间</th>
										<th>操作内容</th>
									</tr>
									<c:if test="${not empty order.orderLogList}">
										<c:forEach items="${order.orderLogList}" var="log"	varStatus="status">
											<tr>
												<td>${log.creator}</td>
												<td><fmt:formatDate value="${log.createDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
												<td>${log.content}</td>
											</tr>
										</c:forEach>
									</c:if>
								</table>
							</td>
						</tr>
						<tr></tr>
					</table>
				</div>
			</div>
		</form>
		<!-- <div class="bottomBtn1"> -->
	</div>
		<div class="MissionRoom_bottom">
			<c:choose>
				<c:when test="${order.channelCode=='B2B'}">
					<a id="orderConfirmPage"
						<c:choose>
							<c:when test="${order.financeLockStatus == 1 || order.orderState == 'canceled' || order.orderState == 'refused' || order.orderState == 'applying_cancel'}">
								class="btn_save_no"
							</c:when>
							<c:otherwise>
								class="settingBtn borderColor J_ConfirmP"
							</c:otherwise>
						</c:choose>
					>确认客人</a>
				</c:when>
				<c:otherwise>
					<a id="orderOperatePage"
						<c:choose>
							<c:when test="${order.financeLockStatus == 1 || order.orderState == 'canceled' || order.orderState == 'refused' || order.orderState == 'applying_cancel'}">
								class="btn_save_no"
							</c:when>
							<c:otherwise>
								class="settingBtn borderColor J_ConfirmP"
							</c:otherwise>
						</c:choose>
					>订单操作</a>
				</c:otherwise>
			</c:choose>
			
			<a id="sendSupplyPage"
				<c:choose>
					<c:when test="${order.financeLockStatus == 1 || order.orderState == 'canceled' || order.orderState == 'refused' || order.orderState == 'applying_cancel'}">
						class="btn_save_no"
					</c:when>
					<c:otherwise>
						class="settingBtn borderColor J_ConfirmP"
					</c:otherwise>
				</c:choose>
			>发单给供应商</a>
			<a id="editOrderBtn"
				<c:choose>
					<c:when test="${order.financeLockStatus == 1 || order.orderState == 'canceled' || order.orderState == 'refused' || order.orderState == 'applying_cancel'}">
						class="btn_save_no"
					</c:when>
					<c:otherwise>
						class="btn_save_long btn_save_padding12"
					</c:otherwise>
				</c:choose>
			><i class="l17"></i>保存</a>
			<a id="cancelBtn"
				<c:choose>
					<c:when test="${order.financeLockStatus == 1 || order.orderState == 'canceled' || order.orderState == 'refused' || order.orderState == 'applying_cancel'}">
						class="btn_save_no"
					</c:when>
					<c:otherwise>
						class="btn_save_long btn_save_padding12"
					</c:otherwise>
				</c:choose>
			>撤销订单</a>
		</div>
</body>
</html>
<script type="text/javascript" src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery.form.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery.validate.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/main.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>js/localdate.js"></script>
<script type="text/javascript" src="<%=basePath%>js/validateForm.js"></script>
<script type="text/javascript" src="<%=basePath%>js/order/orderEdit.js"></script>
<script type="text/javascript">
var channelCode = $('input[name="channelCode"]').val();
	$('select[name="channelCode"]').val(channelCode);
var payMethod = '${order.payMethod}';
	$('select[name="payMethod"]').val(payMethod);
var orderType = '${order.orderType}';
	$('select[name="orderType"]').val(orderType);
</script>