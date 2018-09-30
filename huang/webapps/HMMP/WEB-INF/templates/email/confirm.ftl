<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Insert title here</title>
<style type="text/css">
body {
	text-align: left;
	color: #333;
	font-size: 14px;
	font-family: SimSun;
}

table {
	font-size: 14px;
	line-height: 24px;
}

.main {
	margin: 0 auto;
	width: 700px;
	padding-left: 50px;
	position: relative;
}

.main_1 {
	position: absolute;
	right: 20px;
	bottom: 54px;
}

.red {
	color: #8f552d;
	font-weight: bold;
}

.b_b333 {
	border-bottom: solid 1px #999;
	margin: 10px 0;
	width: 650px;
	padding-bottom: 10px;
}

.fs_24 {
	font-size: 24px;
	line-height: 36px;
	font-family: SimSun;
	font-weight: bold;
}

.b_b3331 {
	border-bottom: solid 1px #999;
	display: block;
}

.head {
	width: 650px;
	border-bottom: solid 3px #999;
	margin-bottom: 10px;
	padding-bottom: 10px;
}

.box {
	border-left: solid 1px #999;
	border-top: solid 1px #999;
	margin: 10px 0;
}

.box td {
	border-bottom: solid 1px #999;
	border-right: solid 1px #999;
}
</style>
</head>
<body>
	<div class="main">
		<div class="head">
			<img src="${logoPath!}" width="650" height="100"></img>
		</div>
		<div class="b_b333">
			<table width="650" border="0" cellspacing="0">
				<tbody>
					<tr>
						<td>订单号：</td>
						<td><span class="red">${orderCode!}</span></td>
						<td align="right">邮箱：</td>
						<td><span class="red">${emailFrom!}</span></td>
					</tr>
					<tr>
						<td valign="top" colspan="2">预订日期：<span class="red">${.now?date}</span>
							时间：<span class="red">${.now?time}</span>
						</td>
						<td align="right" valign="top">热线电话：</td>
						<td><span class="red">${tel!}</span></td>
					</tr>
				</tbody>
			</table>
			<table width="650" border="0" cellspacing="0">
				<tr>
					<td align="center"><span class="fs_24">${title!}</span></td>
				</tr>
				<tr>
					<td>致：<span class="red">${agentName!}</span></td>
				</tr>
				<tr>
					<td>邮箱：<span class="red">${emailTo!}</span></td>
				</tr>
				<tr>
					<td>发送人：<span class="red">${sender!}</span></td>
				</tr>
			</table>
		</div>
		<div class="b_b333">
			<table width="650" border="0" cellspacing="0">
				<tr>
					<td colspan="3">酒店名称：<span class="red">${hotelName!}</span></td>
				</tr>
				<tr>
					<td colspan="3" style="overflow: hidden; word-break: break-all;">客人姓名：<span
						class="red">${guestName!}</span></td>
				</tr>
				<tr>
					<td>入住日期：<span class="red">${checkInDate!}</span></td>
					<td>离店日期：<span class="red">${checkOutDate!}</span></td>
					<td></td>
				</tr>
			</table>
			<table width="640" border="0" cellspacing="0" class="box">
				<tr>
					<td align="center">日期</td>
					<td align="center">房型</td>
					<td align="center">床型</td>
					<td align="center">房间数</td>
					<td align="center">付款方式</td>
					<td align="center">代收价</td>
					<td align="center">结算价</td>
				</tr>
				<#if orderDayProductPriceList?? && (orderDayProductPriceList?size > 0)>
					<#list orderDayProductPriceList as orderDayProductPrice>
						<tr>
							<td align="center"><span class="red">${orderDayProductPrice.saleDate!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.roomTypeName!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.bedTypeName!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.rooms!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.payMethod!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.saleCPrice!}</span></td>
							<td align="center"><span class="red">${orderDayProductPrice.saleBPrice!}</span></td>
						</tr>
					</#list>
				</#if>
			</table>
			<table width="640" border="0" cellspacing="0">
				<tr>
					<td colspan="6">订单总额：<span class="red">${receivable!}</span></td>
				</tr>
			</table>
		</div>
		<div class="b_b333">
			<table width="640" border="0" cellspacing="0">
				<tr>
					<td>备注：<span class="red">${remark!}</span></td>
					<td width="250" rowspan="4" align="center" colspan="2"></td>
				</tr>
			</table>
			<table width="640" border="0" cellspacing="0" class="box">
				<tr>
					<td colspan="2">以上订房，已经确认！请按以下账号支付房费，并将银行汇款单传真至本公司。谢谢！</td>
				</tr>
				<tr>
					<td>开户行</td>
					<td>帐号</td>
				</tr>
				<#if bankAccountList?? && (bankAccountList?size > 0)>
					<#list bankAccountList as bankAccount>
						<tr>
							<td>${bankAccount.bankName!}</td>
							<td>${bankAccount.bankNo!}</td>
						</tr>
					</#list>
				</#if>
			</table>
		</div>
	</div>
</body>
</html>