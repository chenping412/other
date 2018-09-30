<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
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
<title>供应商管理-新增供应商</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<body>
	<div class="add-supply-wrap">
		<div class="breadcrumb">
			<%-- <a class="return" href="javascript:;"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
			<span>当前位置：</span> <a href="javascript:;">供应商管理</a> <span>></span> <a
				href="javascript:;">新增供应商</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>新增供应商</h3>
					<form id="addSupplyFrom" action="add" method="post"
						class="form-list">
						<input type="hidden" id="settlement" name="settlement" value="monthly" />
						<input type="hidden" id="settlementCurrency" name="settlementCurrency" value="CNY" />
						<ul class="row">
							<li class="list"><span>供应商名称<i class="colorYellow">*</i>
									：
							</span><input type="text" id="supplyName" name="supplyName"
								placeholder="请输供应商名称"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>供应商地址<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="address" name="address"
								placeholder="请输入供应商地址"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>联系人<i class="colorYellow">*</i>
									:
							</span><input type="text" id="contacts" name="contacts"
								placeholder="请输入联系人"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>联系电话<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="tel" name="tel"
								placeholder="请输入联系电话"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>结算方式<i class="colorYellow">*</i>
									：
							</span> <input type="text" id="settlementText" name="settlementText"
								value="月结" readonly
								class="input-effective needborder  select-box-value"
								placeholder="请选择结算方式"><i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="settlementBox">
									<ul class="clearfix">
										<li value="monthly">月结</li>
										<li value="halfmonthly">半月结</li>
										<li value="weekly">周结</li>
										<li value="single">单结</li>
									</ul>
								</div></li>
							<li class="list"><span>结算币种<i class="colorYellow">*</i>
									：
							</span> <input type="text" id="settlementCurrencyText" name="settlementCurrencyText"
								value="CNY" readonly
								class="input-effective needborder  select-box-value"
								placeholder="请选择结算币种"><i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="settlementCurrencyBox">
									<ul class="clearfix">
										<li value="CNY">CNY</li>
										<li value="HKD">HKD</li>
										<li value="MOP">MOP</li>
									</ul>
								</div></li>
							<li class="list"><span>传真号码 ：</span><input type="text"
								id="fax" name="fax" placeholder="请输入传真号码" datatype="m"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>邮箱 ：</span><input type="text"
								id="email" name="email" placeholder="请输入邮箱地址"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list">
								<span>是否多币种 ：</span>
								<input type="radio" name="multipleCurrency" value="1" style="width: 30px; height: auto;" />是
								<input type="radio" name="multipleCurrency" value="0" style="width: 30px; height: auto;" checked />否
							</li>
						</ul>
					</form>

				</div>
			</div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/supplyController/page" class="cancel">取消</a>
					<a href="javascript:addSupply();" class="save">保存</a>
				</div>

			</div>
		</div>
	</div>
</body>
</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/member/supply.js"></script>