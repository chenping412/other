<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
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
<title>平台运营-订单申诉管理-处理订单申诉</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

	<div class="add-newuser-wrap">
		<div class="breadcrumb">
			<span>当前位置：</span> <a href="javascript:;">订单申诉管理</a> <span>></span> <a
				href="javascript:;">处理订单申诉</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>处理订单申诉</h3>
					<form id="editOrderAppealFrom" action="edit" method="post"
						class="form-list">
						<ul class="row">
							<input type="hidden" id="appealId" name="appealId"
								value="${orderAppeal.appealId}" />
							<input type="hidden" id="status" name="status"
								<c:choose><c:when test="${orderAppeal.status == 'success'}">value="success"</c:when><c:when test="${orderAppeal.status == 'fail'}">value="fail"</c:when><c:otherwise>value="success"</c:otherwise></c:choose> />
							<li class="list"><span>订单编号<i class="colorYellow">*</i>
									：
							</span><input type="text" id="orderCode" name="orderCode"
								value="${orderAppeal.orderCode}" readonly="readonly"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>申诉理由<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="applyReason" name="applyReason"
								value="${orderAppeal.applyReason}"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>申诉人<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="complainant"
								name="complainant" value="${orderAppeal.complainant}" readonly="readonly"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>申诉时间<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="createDate" name="createDate"
								value="<fmt:formatDate value='${orderAppeal.createDate}' pattern='yyyy-MM-dd HH:mm:ss'/>" readonly="readonly"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>是否成功<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="statusText" name="statusText" class="select-box-value" <c:choose><c:when test="${orderAppeal.status == 'success'}">value="申诉成功"</c:when><c:when test="${orderAppeal.status == 'fail'}">value="申诉失败"</c:when><c:otherwise>value="申诉成功"</c:otherwise></c:choose> />
								<i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="statusBox">
								<ul class="clearfix">
									<li class="clearfix" value="success">申诉成功</li>
									<li class="clearfix" value="fail">申诉失败</li>
								</ul>
							</div></li>
						</ul>
					</form>
				</div>
			</div>
			<div class="baseline"></div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/orderAppealController/order/page" class="cancel">取消</a>
					<a href="javascript:editOrderAppeal();" class="save">保存</a>
				</div>
			</div>
		</div>
	</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/finance/orderAppeal.js"></script>