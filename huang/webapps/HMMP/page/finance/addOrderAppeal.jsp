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
<title>平台运营-订单申诉管理-新增订单申诉</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<body>
	<div class="add-newuser-wrap">
		<div class="breadcrumb">
			<%-- <a class="return" href="javascript:;"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
			<span>当前位置：</span> <a href="javascript:;">订单申诉管理</a> <span>></span> <a
				href="javascript:;">新增订单申诉</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>新增订单申诉</h3>
					<form id="addOrderAppealFrom" action="add" method="post"
						class="form-list">
						<input type="hidden" id="status" name="status" value="new" />
						<ul class="row">
							<li class="list"><span>订单编号<i class="colorYellow">*</i>
									：
							</span><input type="text" id="orderCode" name="orderCode"
								placeholder="请输订单编号" value="${orderAppealRequestDTO.orderCode}"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>申诉理由<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="applyReason" name="applyReason"
								placeholder="请输入申诉理由"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>备注 ：</span><textarea id="mark" name="mark" placeholder="请输入备注" datatype="m" maxlength="200"></textarea><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span></span><i class="empty iconfont icon-ArtboardCopy"></i></li>
						</ul>
					</form>
				</div>
			</div>
			<div class="baseline"></div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/orderAppealController/page" class="cancel">取消</a>
					<a href="javascript:addOrderAppeal();" class="save">保存</a>
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