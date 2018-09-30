<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Insert title here</title>
<style type="text/css">
.main td {
	font-weight: bold;
}

body {
	text-align: left;
	color: #333;
	font-size: 14px;
	font-family: SimSun;
}

table {
	font-size: 12px;
	line-height: 18px;
}

.main {
	margin: 0 auto;
	width: 680px;
	position: relative;
}

.main_1 {
	position: absolute;
	right: 50px;
	bottom: 120px;
}

.red {
	color: #8f552d;
	font-weight: bold;
	font-size: 12px;
}

.b_b333 {
	border-bottom: solid 2px #999;
	margin: 10px 0;
	width: 680px;
	padding-bottom: 10px;
}

.b_b3331 {
	border-bottom: solid 1px #999;
	display: block;
}

.head {
	text-align: center;
	border-bottom: solid 2px #999;
	margin-bottom: 10px;
}

.box {
	border-left: solid 2px #999;
	border-top: solid 2px #999;
	margin: 10px 0;
}

.box td {
	border-bottom: solid 2px #999;
	border-right: solid 2px #999;
}

.w_680 {
	margin: 10px 0;
	width: 680px;
}
</style>
</head>
<body>
	<div class="main">
		<div class="head">
			<h1>客户对账单</h1>
		</div>
		<div>
			<table width="680" border="0" cellspacing="0" style="position:relative;">
				<tr>
					<td>发送到：<span class="red">${agentName!}</span></td>
					<td>发送者：<span class="red">${companyName!}</span></td>
				</tr>
				<tr>
					<td>收件人：<span class="red">${contacts!}</span>	</td>
					<td>发件人：<span class="red">${sender!}</span></td>
				</tr>
				<tr>
					<td>传真：<span class="red">${fax!}</span></td>
					<td>传真：<span class="red">${merchantFax!}</span></td>
				</tr>
				<tr>
					<td>电话：<span class="red">${tel!}</span></td>
					<td>电话：<span class="red">${merchantTel!}</span></td>
				</tr>
				<tr>
					<td valign="top">地址：<span class="red">${address!}</span></td>
					<td rowspan="5" align="right"><img src="${signetPath!}" style="position: absolute;right: -20px;top: -20px;" /></td>
				</tr>
			</table>
		</div>
		<div>
			<table width="680" border="0" cellspacing="0" class="box">
				<tr>
					<td style="width: 12%;" align="center">酒店名称</td>
					<td style="width: 8%;" align="center">房型</td>
					<td style="width: 12%;" align="center">客人姓名</td>
					<td style="width: 6%;" align="center">房号</td>
					<td style="width: 8%;" align="center">入住</td>
					<td style="width: 8%;" align="center">退房</td>
					<td style="width: 6%;" align="center">付款方式</td>
					<td style="width: 5%;" align="center">晚数</td>
					<td style="width: 5%;" align="center">间数</td>
					<td style="width: 5%;" align="center">代付价</td>
					<td style="width: 5%;" align="center">同行价</td>
					<td style="width: 5%;" align="center">应收</td>
					<td style="width: 5%;" align="center">已收</td>
				</tr>
				<#if dataList?? && (dataList?size > 0)>
					<#list dataList as bill>
						<tr>
							<td style="width: 12%;" align="center"><span class="red">${bill.hotelName!}</span></td>
							<td style="width: 8%;" align="center"><span class="red">${bill.roomTypeName!}</span></td>
							<td style="width: 12%;" align="center"><span class="red">${bill.guestName!}</span></td>
							<td style="width: 6%;" align="center"><span class="red">${bill.roomNo!}</span></td>
							<td style="width: 8%;" align="center"><span class="red">${bill.checkInDate!}</span></td>
							<td style="width: 8%;" align="center"><span class="red">${bill.checkOutDate!}</span></td>
							<td style="width: 6%;" align="center"><span class="red">${bill.payMethodText!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.nights!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.rooms!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.saleCPrice!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.saleBPrice!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.receivable!}</span></td>
							<td style="width: 5%;" align="center"><span class="red">${bill.actualReceived!}</span></td>
						</tr>
					</#list>
				</#if>
			</table>
		</div>
		<div class="w_680">
			<table width="680" border="0" cellspacing="0">
				<tr>
					<td width="150">户名</td>
					<td width="250">账号</td>
					<td width="250">开户行</td>
				</tr>
				<#if bankList?? && (bankList?size > 0)>
					<#list bankList as bank>
						<tr>
							<td width="150">${bank.bankUserName!}</td>
							<td width="250">${bank.bankNo!}</td>
							<td width="250">${bank.bankName!}</td>
						</tr>
					</#list>
				</#if>
			</table>
		</div>
	</div>
</body>
</html>