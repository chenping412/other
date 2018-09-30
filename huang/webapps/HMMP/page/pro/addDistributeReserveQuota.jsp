<%--
  Created by IntelliJ IDEA.
  User: Vinney
  Date: 2018/1/8
  Time: 17:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>对客户设置预留配额</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-labelauty.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
    .edit-port-dialog {
        height: 195px;
    }
</style>

<body>
<div class="add-room-manage-wrap">
    <div class="breadcrumb">
    </div>

    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>对客户设置预留配额</h3>
                <br/>
                <br/>

                <form id="addReserveQuotaForm" class="form-list" action="addReserveQuota" method="post">

                    <input type="hidden" id="priceplanId" name="priceplanId" value="${reserveQuotaPO.priceplanId}"/>
                    <input type="hidden" id="saleDate" name="saleDate" value="${reserveQuotaPO.saleDateStr}"/>
                    <input type="hidden" id="quotaAccountId" name="quotaAccountId" value="${reserveQuotaPO.quotaAccountId}"/>

                    <ul class="row">

                        <li class="list drop-box"><span>分销商：<i class="colorYellow">*</i>：</span>
                            <input type="text" placeholder="请选择分销商" id="agentName" name="agentName" class="input-effective">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <input type="hidden" id="agentCode" name="distributeCode" />

                        </li>
                        <li class="list"><span>预留配额数：<i class="colorYellow">*</i>：</span>
                            <input name="reserveQuotaNum" id="reserveQuotaNum" class="text w_140 c_666 " placeholder="请输入预留配额数" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>
                        </li>
                     </ul>

                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <%--<a href="##" id="cancelRoom" class="cancel">取消</a>--%>
                <a href="##" id="saveAgentReserveQuota" class="save" >保存</a>
            </div>
        </div>
    </div>
</div>

</div>


</body>
</html>

<script src="<%=basePath%>js/jquery-1.8.3.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-labelauty.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>

    // 保存酒店
    $('#saveAgentReserveQuota').on('click', function () {
        var agentCode = $("#agentCode").val();
        var reserveQuotaNum = $("#reserveQuotaNum").val();
        var priceplanId = $("#priceplanId").val();
        var saleDate = $("#saleDate").val();
        var quotaAccountId = $("#quotaAccountId").val();

        if(null == agentCode || '' == agentCode || null == reserveQuotaNum || '' == reserveQuotaNum ){
            new Tip({msg: "分销商和预留配额数不能为空", timer: 1000, type:2 });
            return;
        }

        var data = {
            "amount":reserveQuotaNum,
            "reserveQuotaNum":reserveQuotaNum,
            "distributeCode":agentCode,
            "priceplanId":priceplanId,
            "saleDateStr":saleDate,
            "quotaAccountId":quotaAccountId
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/addReserveQuotaDistribute',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    resetAddReserveQuotaForm();
                    //刷新父页面
                    window.opener.location.reload();
                    //刷新父页面的父页面
                    window.opener.opener.location.reload();
                } else {
                    new Tip({ msg: rs.errorReason+"("+rs.result+")",timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 1000, type:2});
            }
        });
    });
    
    function resetAddReserveQuotaForm() {
        $("#agentCode").val("");
        $("#agentName").val("");
        $("#reserveQuotaNum").val("");
    }

    $(window).on("beforeunload",function () {
        console.log("beforeunload");
    });

    $(function(){
        initAgentAutocomplete();
    });
</script>