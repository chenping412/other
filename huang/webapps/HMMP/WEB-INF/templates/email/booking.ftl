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
	right: 50px;
	bottom: 120px;
}

.red {
	color: #8f552d;
	font-weight: bold;
}

.b_b333 {
	border-bottom: solid 2px #999;
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

.w_650 {
	margin: 10px 0;
	width: 650px;
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
				<tr>
					<td>订单号：<span class="red">${orderCode!}</span></td>
				</tr>
				<tr>
					<td>发送日期：<span class="red">${.now?date}</span> 时间：<span class="red">${.now?time}</span>
					</td>
				</tr>
			</table>
			<table width="650" border="0" cellspacing="0">
				<tr>
					<td colspan="3" align="center"><span class="fs_24">${title!}</span></td>
				</tr>
				<tr>
					<td>致：<span class="red">${supplyName!}</span></td>
					<td align="right">发送方邮箱：</td>
					<td align="left"><span class="red">${emailFrom!}</span></td>
				</tr>
				<tr>
					<td valign="top">邮箱：<span class="red">${emailTo!}</span></td>
					<td align="right" valign="top">发送方热线电话：</td>
					<td align="left" valign="top"><span class="red">${tel!}</span></td>
				</tr>
				<tr>
					<td>发送人:<span class="red">${sender!}</span></td>
					<td align="right">发送方传真号码：</td>
					<td align="left"><span class="red">${fax!}</span></td>
				</tr>
			</table>
		</div>
		<div class="b_b333">
			<table width="650" border="0" cellspacing="0">
				<tr>
					<td colspan="2">酒店名称：<span class="red">${hotelName!}</span></td>
					<td>制单人：<span class="red">${creator!}</span></td>
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
					<td colspan="6" width="50%">备注：<span class="red">${remark!}</span></td>
				</tr>
				<tr>
					<td colspan="6">订单总额：<span class="red">${receivable!}</span></td>
				</tr>
				<tr>
					<td>请尽快给予订单确认，谢谢合作 ！</td>
				</tr>
			</table>
		</div>
		<div class="w_650">
			<table width="640" border="0" cellspacing="0">
				<tr>
					<td width="150">供应商回复:</td>
					<td width="250">口 本单确认</td>
					<td width="250">口 本单不确认</td>
				</tr>
				<tr>
					<td width="150">订单确认号码:</td>
					<td width="" class="b_b3331"></td>
					<td width="250" rowspan="4" align="center"><img src="${signetPath!}"></img></td>

				</tr>
				<tr>
					<td>供应商确认人签名:</td>
					<td width="" class="b_b3331"></td>
				</tr>
				<tr>
					<td>日 期:</td>
					<td width="" class="b_b3331"></td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>