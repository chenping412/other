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
    <title>报价同步开关</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
    .main-content {
        width: 100%;
        height: 100%;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: rgb(255, 255, 255);
        box-shadow: rgba(0, 0, 0, 0.26) 0px 0px 5px;
        position: relative;
    }

    .radio-group {
        font: 20px sold;
        margin-top: 15px;
    }

    .radio-group input{
        width: 25px;
        margin-left: 10px;
    }

    .notices {
        font-size: 14px;
        color: #FF0000;
        margin-top: 15px;
    }

    .notices p {
        margin-top: 15px;
    }

</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">报价同步开关</a>
    </div>
    <div class="main-content">

        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h2>是否打开报价房态同步开关</h2>
                <div class="radio-group">
                    <ur>
                        <li>打开 ：<input type="radio" name="needSyncRoomDataToDlt" value="true" <c:if test="${true eq needSyncRoomDataToDlt}">checked="checked"</c:if> /></li>
                        <li>关闭 ：<input type="radio" name="needSyncRoomDataToDlt" value="false" <c:if test="${false eq needSyncRoomDataToDlt}">checked="checked"</c:if>/></li>
                    </ur>
                </div>
                <div class="notices">
                    <p>打开同步，所有酒店报价房态房量及条款信息会每两分钟同步一次到代理通</p>
                    <p>关闭同步，将会停止报价房态房量及条款信息同步，需要到代理通后台录入，订单仍然可以正常进入本系统</p>
                </div>
            </div>
        </div>
        <div class="baseline"></div>
        <%--<shiro:hasPermission name="product:hotel:query">--%>
        <div class="search-footer">
            <div style="float:right">
                <a href="javascript:saveDltRoomDateSyncSwitch();" class="save" >保存</a>
            </div>
        </div>
        <%--</shiro:hasPermission>--%>
    </div>
</div>
</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>

    function saveDltRoomDateSyncSwitch(pricePlanId){
//        var needSyncRoomDataToDlt = $("input[name='needSyncRoomDataToDlt']").val();
        var needSyncRoomDataToDlt = $("input[type='radio']:checked").val();
        console.log("needSyncRoomDataToDlt=" + needSyncRoomDataToDlt);
        $.ajax({
            type: 'POST',
            dataType : 'json',
            context : document.body,
            url: '<%=basePath%>admin/saveDltRoomDateSyncSwitch',
            data: {
                "needSyncRoomDataToDlt": needSyncRoomDataToDlt
            },
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "保存成功！",timer: 2000, type:1});
                } else {
                    new Tip({ msg: rs.errorReason,timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 3000, type:2});
            }
        });
    }

</script>