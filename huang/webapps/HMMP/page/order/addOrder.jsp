<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ taglib prefix="c" uri="core"%>
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
<title>录入订单信息</title>
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
			<h3 class="MyAssets_top p_l15">订单管理 >手工录单 > 录入订单信息</h3>
		</div>
	</div>
	<div class="MissionRoom p_t56">
		<form id="addOrderFrom" name="addOrderFrom">
			<input id="agentCode" name="agentCode" type="hidden" />
			<input id="agentMultipleCurrency" name="agentMultipleCurrency" type="hidden" />
			<input id="agentSettlementCurrency" name="agentSettlementCurrency" type="hidden" />
			<input id="supplyMultipleCurrency" name="supplyMultipleCurrency" type="hidden" />
			<input id="supplySettlementCurrency" name="supplySettlementCurrency" type="hidden" />
			<input id="supplyCode" name="supplyCode" type="hidden" />
			<input id="hotelId" name="hotelId" type="hidden" />
			<input type="hidden" name="exchange" value='${exchange}' />
			<input type="hidden" name="baseOrderRequestJSON" value='${baseOrderRequestJSON}' />
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
												value="" customFun="fucCheckDistributor" errormsg="必填项"
												autocomplete="off" />
										</label> <label class="teamInfo_label"> <span class="fl">入住人：<i class="c_f00">*</i></span>
												<input id="guestName" name="guestName" maxlength="50"
												type="text" class="fl f_ui-grey-input text w_250" customFun="fucCheckGuestName" errormsg="必填项"
												placeholder="请输入入住人" />
										</label> <span class="fl teamInfo_span01">售卖渠道：<i
													class="c_f00">*</i></span>
												<select id="channelCode" name="channelCode" value="" class="select w_200 c_666"
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
												class="fl">剩余额度：</span> <input
												id="credit" name="credit" type="text"
												class="fl f_ui-grey-input text w_250 " readonly="readonly"
												value="" />
										</label> <label class="teamInfo_label"><span class="fl">客户订单号：<i
													class="c_f00">*</i></span><input
												id="customerOrderCode" name="customerOrderCode" type="text"
												class="fl f_ui-grey-input text w_250 " customFun="fucCheckCustomerOrderCode" errormsg="必填项" placeholder="请输入客户订单号"
												value="" />
										</label><span class="fl teamInfo_span01">支付类型：<i
													class="c_f00">*</i></span>
										<select id="payMethod" name="payMethod" value="" class="select w_200 c_666">
													<option value="prepay_room">房费挂账杂费自理</option>
													<option value="prepay_all">所有费用挂账</option>
													<option value="pay">前台现付</option>
													<option value="cash">现金支付</option>
												</select>
										</li>
										<li><label class="teamInfo_label"> <span
												class="fl">订单类型：<i class="c_f00">*</i></span>
												<select id="orderType" name="orderType" value="" class="select c_666" style="width: 260px;">
													<option value="scattered">散房</option>
													<option value="group">团房</option>
												</select>
										</label> <label class="teamInfo_label"> <span class="fl"></span>
										</label> <span class="fl teamInfo_span01"></span>
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
												name="hotelName" type="text"
												class="fl f_ui-grey-input text w_250"
												customFun="fucCheckHotel" errormsg="必填项"
												placeholder="请输入酒店名称" autocomplete="off" />
										</label><label class="teamInfo_label"> <span
												class="fl">供应商：<i class="c_f00">*</i></span> <input
												id="supplyName" name="supplyName" type="text" value=""
												class="fl f_ui-grey-input text w_250 valiSupplier"
												id="teamInfo_gxs" placeholder="请输入供应商名称"
												customFun="fucCheckSupplier" errormsg="必填项"
												autocomplete="off" />
										</label><span class="fl teamInfo_span01">确认号：<i
													class="c_f00">&nbsp;&nbsp;&nbsp;&nbsp;</i></span><input
												id="confirmNo" name="confirmNo" type="text"
												class="fl f_ui-grey-input text w_170 " placeholder="请输入确认号" /></li>
										<li><label class="teamInfo_label"> <span class="fl"><i
													class="c_f00"></i></span>
										</label><label class="teamInfo_label"> <span
												class="fl"><i class="c_f00"></i></span>
										</label><span class="fl teamInfo_span01"><i
													class="c_f00"></i></span></li>
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
										<th><i class="c_f00"></i>底价</th>
										<th>操作</th>
									</tr>
									<tr id="roomTarget"></tr>
								</table>
								<p class="additional-notice">
									<a href="javascript:void(0)" onclick="appendRoomDetail()" class="fl mission-room-add underline J-modal-room">新增</a>&nbsp;&nbsp;&nbsp;&nbsp;
									<a href="javascript:void(0)" onclick="showAppendRoomDetail()"	class="fl mission-room-add underline J-modal-room">批量新增</a>
									<span id="roomDate" style="display: none;">
										从&nbsp;<input type="text" class="order-date-input" style="width: 10%;" name="roomStartDate" autocomplete="off" />
										到&nbsp;<input type="text" class="order-date-input" style="width: 10%;" name="roomEndDate" autocomplete="off" />
										&nbsp;&nbsp;
										<select id="pricePlanRoom" name="pricePlanRoom" class="select w_200 c_666">
											<option value="">请选择产品</option>
										</select>&nbsp;&nbsp;
										<input type="text" class="order-date-input" style="width: 10%;" name="room" value="1" autocomplete="off" placeholder="请输入间数" />
										<a href="javascript:void(0)" onclick="batchAppend('room');" class="mission-room-add underline J-modal-room">添加</a>
									</span>
								</p>
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
								<p class="additional-notice">
									<a href="javascript:void(0)" onclick="appendAdditionalDetail()"	class="fl mission-room-add underline J-modal-room">新增</a>&nbsp;&nbsp;&nbsp;&nbsp;
									<a href="javascript:void(0)" onclick="showAppendAdditionalDetail()"	class="fl mission-room-add underline J-modal-room">批量新增</a>
									<span id="additionalDate" style="display: none;">
										从&nbsp;<input type="text" class="order-date-input" style="width: 10%;" name="additionalStartDate" autocomplete="off" />
										到&nbsp;<input type="text" class="order-date-input" style="width: 10%;" name="additionalEndDate" autocomplete="off" />
										<select id="additional" name="additional" class="select w_200 c_666">
											<option value="">请选择附加项</option>
										</select>&nbsp;&nbsp;
										<input type="text" class="order-date-input" style="width: 10%;" name="room" value="1" autocomplete="off" placeholder="请输入间数" />
										<a href="javascript:void(0)" onclick="batchAppend('additional');" class="mission-room-add underline J-modal-room">添加</a>
									</span>
								</p>
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
											<td class="p_l30"><span class="textStyle01">应收金额：</span><span id="receiveable"></span></td>
											<td><span class="textStyle01">已收：</span><span id="receiveabled"></span></td>
											<td><span class="textStyle01">未收：</span><span id="unreceiveable"></span></td>
											<td><span class="textStyle01"></span></td>
										</tr>
										<tr>
											<td class="p_l30"><span class="textStyle01">应付金额：</span><span id="payable"></span></td>
											<td><span class="textStyle01">已付：</span><span	id="payabled"></span></td>
											<td><span class="textStyle01">未付：</span><span	id="unpayable"></span></td>
											<td><span class="textStyle01"></span></td>
										</tr>
										<tr>
											<td colspan="4" class="p_l30"><span class="textStyle01"
												style="">利&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;润：</span><i
												class="colorGreen fs16" id="profit">0.00 CNY</i>
											</td>
										</tr>
									</table>
								</div>
							</td>
						</tr>
						<tr>
							<td class="MissionRoom_td01">备注</td>
							<td>
								<div class="MissionRoom_Remark clearfix" style="float: left; width: 25%;">
									<textarea id="remark" name="remark" class="text" placeholder="请输入备注信息" maxlength="200"></textarea>
								</div>
								<div style="float: left; width: 50%;padding-top: 30px;">
									<input type="checkbox" name="quickRemark" value="尽量大床" />尽量大床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="quickRemark" value="原房续住" />原房续住<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量双床" />尽量双床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="quickRemark" value="尽量吸烟房" />尽量吸烟房<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量高层" />尽量高层<br/><br/>
									<input type="checkbox" name="quickRemark" value="尽量无烟房" />尽量无烟房<br/><br/>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</form>
		<div class="bottomBtn1">
			<a class="btn_save_long btn_save_padding12"><i class="l17"></i>保存</a>
			<!-- <a class="btn_exit_long bnt_exit_padding12 J_exitKan">关闭</a> -->
		</div>
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
<script type="text/javascript" src="<%=basePath%>js/order/orderAdd.js"></script>