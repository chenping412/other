<%--
  Created by IntelliJ IDEA.
  User: Vinney
  Date: 2018/1/8
  Time: 17:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<div>
<%--<div class="add-room-manage-wrap">--%>
    <%--<div class="main-content">--%>
        <%--<div class="section-wrap section-wrap-function">--%>
            <%--<div class="section-content">--%>

<form id="addSupplyBillOffForm" class="form-list" action="billOff" method="post">
    <input type="hidden" value="${orgCode}" name="orgCode" id="orgCode"/>
    <input type="hidden" value="${dayPriceIdList}" name="dayPriceIdList" id="dayPriceIdList"/>
    <input type="hidden" value="${checkOutIdList}" name="checkOutIdList" id="checkOutIdList"/>
    <input type="hidden" value="${payType}" name="payType" id="payType"/>

    <ul class="row">
        <li class="list" style="margin-bottom: 24px;"><span>销账凭号：<i class="colorYellow">*</i></span><input name="serialNumber" id="serialNumber" class="text w_140 c_666 " placeholder="请销账凭号" autocomplete="off" type="text" value=""></li>
        <li class="list" style="margin-bottom: 24px;">
            <c:if test="${payType == 1}">
                <span>本次应付：<i class="colorYellow">*</i></span>
            </c:if>
            <c:if test="${payType == 0}">
                <span>本次应收：<i class="colorYellow">*</i></span>
            </c:if>
            <input name="receivable" id="receivable" readonly class="text w_140 c_666 "  autocomplete="off" type="text" value="${receivable}">
        </li>

        <li class="list" style="margin-bottom: 24px;">
            <c:if test="${payType == 1}">
                <span>本次实付：<i class="colorYellow">*</i></span>
            </c:if>
            <c:if test="${payType == 0}">
                <span>本次实收：<i class="colorYellow">*</i></span>
            </c:if>
            <input name="billOffAmount" id="billOffAmount"  readonly class="text w_140 c_666 " autocomplete="off" type="text" value="${billOffAmount}"></li>

        <li class="list drop-box"  style="margin-bottom: 24px;"><span>银行账号：<i class="colorYellow">*</i></span><input type="text" id="bankName" name="bankName" placeholder="请选择银行账号" value="请选择银行账号" class="input-effective select-box-value">
            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle" style="right: 15px"></i>
            <div class="form-list-drop-box" style="left: 150px;width: 294px;">
                <ul class="clearfix" id="bankSelectBox">
                    <c:forEach items="${bankMap}" var="bankItem">
                        <li value="${bankItem.key}">${bankItem.value}</li>
                    </c:forEach>
                </ul>
            </div>
        </li>

        <li class="list"  style="margin-bottom: 24px;"><span>备注：</span><textarea rows="3" cols="20" name="remark" id="remark"></textarea>
        </li>
    </ul>

    <input type="hidden" name="bankNo" id="bankNo"/>
</form>
            <%--</div></div></div>--%>
</div>

<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<%--<script src="<%=basePath%>js/jquery-labelauty.js"></script>--%>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>

    //银行下拉框
    $('#bankSelectBox li').on('click',function () {
        $("#bankNo").val($(this).attr("value"));
    });

</script>