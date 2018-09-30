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
<title>平台运营-客户管理-编辑客户</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/page.css">
<link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
<style>
th{
    height: 30px;
    background: #f2f2f2;
    color: #999;
}
td{
    text-align: left;
    word-break: break-all;
    box-sizing: border-box;
    border: solid #e2e2e2;
    border-width: 0 1px 1px 0
}
</style>
</head>

<body>

	<div class="add-agent-wrap">
		<div class="breadcrumb">
			<span>当前位置：</span> <a href="javascript:;">客户管理</a> <span>></span> <a
				href="javascript:;">编辑客户</a>
		</div>
		<div class="main-content">
			<div class="section-wrap section-wrap-function">
				<div class="section-content">
					<h3>编辑客户</h3>
					<form id="editAgentFrom" action="edit" method="post"
						class="form-list">
						<ul class="row">
							<input type="hidden" id="agentId" name="agentId"
								value="${agent.agentId}" />
							<input type="hidden" id="agentCode" name="agentCode"
								value="${agent.agentCode}" />
							<input type="hidden" id="isActive" name="isActive"
								value="${agent.isActive}">
							<input type="hidden" id="originalIsActive" name="originalIsActive"
								value="${agent.isActive}">
							<input type="hidden" id="settlement" name="settlement" 
								value="${agent.settlement}" />
							<input type="hidden" id="originalSettlement" name="originalSettlement" 
								value="${agent.settlement}" />
							<input type="hidden" id="originalCreditLine" name="originalCreditLine" 
								value="${agent.creditLine}" />
							<input type="hidden" id="originalTemporary" name="originalTemporary" 
								value="${agent.temporary}" />
							<input type="hidden" id="settlementCurrency" name="settlementCurrency" 
								value="${agent.settlementCurrency}" />
							<input type="hidden" id="originalSettlementCurrency" name="originalSettlementCurrency" 
								value="${agent.settlementCurrency}" />
							<li class="list"><span>客户名称<i class="colorYellow">*</i>
									：
							</span><input type="text" id="agentName" name="agentName"
								value="${agent.agentName}" placeholder="请输入客户名称"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>客户地址<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="address" name="address"
								value="${agent.address}" placeholder="请输入客户地址"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>联系人<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="contacts"
								name="contacts" value="${agent.contacts}" placeholder="请输入联系人"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>联系电话<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="tel" name="tel"
								value="${agent.tel}" placeholder="请输入联系电话"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>是否有效<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="activeName" name="activeName"  class=" select-box-value"
								<c:if test="${ empty agent.isActiveText}"> value="无效" </c:if><c:if test="${ not empty agent.isActiveText}"> value="${agent.isActiveText}"</c:if> placeholder="请选择是否有效">
								<i
								class="iconfont  icon-downTriangle"></i>
								<div class="form-list-drop-box" id="activeBox">
								<ul class="clearfix">
									<li class="clearfix" value="1">有效</li>
									<li class="clearfix" value="0">无效</li>
								</ul>
							</div></li>
							<li class="list"><span>结算方式<i
									class="colorYellow">*</i> ：
							</span> <input type="text" id="settlementText" name="settlementText"
								value="${agent.settlementText}" readonly class="input-effective needborder select-box-value"
								placeholder="请选择结算方式"></i><i
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
								readonly value="${agent.settlementCurrency}"
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
								autocomplete="off" id="fax" name="fax" value="${agent.fax}"
								placeholder="请输入传真号码"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>邮箱 ：</span><input type="text"
								autocomplete="off" id="email" name="email"
								value="${agent.email}" placeholder="请输入邮箱地址"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>财务邮箱 ：</span><input type="text"
								autocomplete="off" id="financeEmail" name="financeEmail"
								value="${agent.financeEmail}" placeholder="请输入财务邮箱地址"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>信用额度<i class="colorYellow">*</i>
								 ：</span><input type="text"
								autocomplete="off" id="creditLine" name="creditLine"
								value="${agent.creditLine}" placeholder="请输入信用额度"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>临时额度<i class="colorYellow"></i>
								 ：</span><input type="text"
								autocomplete="off" id="temporary" name="temporary"
								value="${agent.temporary}" placeholder="请输入临时额度"><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list"><span>剩余信用额度 ：</span><input type="text"
								id="surplus" name="surplus"
								value="${agent.surplus}" readonly="readonly" /><i
								class="empty iconfont icon-ArtboardCopy"></i></li>
							<li class="list">
								<span>是否多币种 ：</span>
								<input type="radio" name="multipleCurrency" value="1" style="width: 30px; height: auto;" <c:if test="${not empty agent.isMultipleCurrency && agent.isMultipleCurrency == 1}">checked</c:if> />是
								<input type="radio" name="multipleCurrency" value="0" style="width: 30px; height: auto;" <c:if test="${empty agent.isMultipleCurrency || agent.isMultipleCurrency == 0}">checked</c:if> />否
							</li>
							<li class="list" style="height: 80px;"><span style="vertical-align: middle;">备注 ：</span><textarea type="text" style="vertical-align: middle;"
								id="remark" name="remark"></textarea></li>
						</ul>
					</form>
					<div class="baseline"></div>
					<h3>附件管理</h3>
					<div>
						<table cellpadding="0" cellspacing="0" width="100%">
							<colgroup>
								<col width="20%">
								<col width="35%">
								<col width="25%">
								<col>
							</colgroup>
							<tr>
								<th align="left">附件类型</th>
								<th align="left">文件名称</th>
								<th align="left">上传时间</th>
								<th align="left">操作</th>
							</tr>
							<c:if test="${not empty agent.attachmentList}">
								<c:forEach items="${agent.attachmentList}" var="attachment" varStatus="status">
									<tr id="${attachment.attachmentId}">
										<td style="padding: 5px 0px 5px 0px;">${attachment.attachmentTypeText}</td>
										<td style="padding: 5px 0px 5px 0px;"><a href="javascript:void(0)" style="color: #FF6000;" onclick="downloadAttachment('${attachment.attachmentId}','${attachment.originalAttachmentName}')">${attachment.originalAttachmentName}</td>
										<td style="padding: 5px 0px 5px 0px;"><fmt:formatDate value="${attachment.uploadDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
										<td style="padding: 5px 0px 5px 0px;"><a href="javascript:void(0);" style="color: #FF6000;" onclick="removeAttachment(this);">删除</a></td>
									</tr>
								</c:forEach>
							</c:if>
						</table>
						<p style="padding-top: 20px;">
							<a href="javascript:contractUpload();" style="color: #FF6000;">上传合同</a>&nbsp;&nbsp;
							<a href="javascript:styleUpload();" style="color: #FF6000;">上传样式单</a>
				    	</p>
					</div>
					<div class="baseline"></div>
					<h3>操作日志</h3>
					<div>
						<table cellpadding="0" cellspacing="0" width="100%" style="padding-left: 3px;">
							<colgroup>
								<col width="5%">
								<col width="20%">
								<col width="15%">
								<col>
							</colgroup>
							<tr>
								<th align="left">序号</th>
								<th align="left">操作人</th>
								<th align="left">操作时间</th>
								<th align="left">操作内容</th>
							</tr>
							<c:if test="${not empty agent.agentLogList}">
								<c:forEach items="${agent.agentLogList}" var="log" varStatus="status">
									<tr>
										<td style="padding: 5px 0px 5px 0px;">${status.index + 1}</td>
										<td style="padding: 5px 0px 5px 0px;">${log.creator}</td>
										<td style="padding: 5px 0px 5px 0px;"><fmt:formatDate value="${log.createDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
										<td style="padding: 5px 0px 5px 0px;">${log.content}</td>
									</tr>
								</c:forEach>
							</c:if>
						</table>
					</div>
				</div>
			</div>
			<div class="baseline"></div>
			<div class="search-footer">
				<div style="float: right">
					<a href="<%=basePath%>admin/agentController/page" class="cancel">取消</a>
					<a href="javascript:editAgent();" class="save">保存</a>
				</div>
			</div>
		</div>
	</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/member/agent.js"></script>