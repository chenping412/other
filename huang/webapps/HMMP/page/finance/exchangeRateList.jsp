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
    <title>汇率管理</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
    .edit-port-dialog {
        height: 195px;
        width: 424px;
        left: -160px;
        top: -118px;
        padding-left: 19px;
    }
</style>
<body>

<div class="room-manage-wrap">

    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">汇率管理</a>
    </div>

    <div class="main-content">

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list2" style="width: 50px">源币种</li>
                    <li class="list1" style="width: 10px"></li>
                    <li class="list2" style="width: 60px">目标币种</li>
                    <li class="list2" style="width: 60px">汇率</li>
                    <li class="list3" style="width: 120px">最后修改人</li>
                    <li class="list3" style="width: 240px">最后修改时间</li>
                    <li class="list8">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
                <c:forEach items="${exchangeRateList}" var="exchangeRate" varStatus="status">
                    <ul class="row clearfix">
                        <li class="list2" style="width: 34px">${exchangeRate.sourceCurrency}</li>
                        <li class="list1" style="width: 32px">兑</li>
                        <li class="list2" style="width: 48px">${exchangeRate.targetCurrency}</li>
                        <li class="list2" style="width: 68px"><input type="text" style="width: 48px" value="${exchangeRate.rate}" id="rate_${status.index}"/></li>
                        <li class="list3" style="width: 120px">${exchangeRate.modifier}</li>
                        <li class="list3" style="width: 240px">
                            <fmt:formatDate value="${exchangeRate.modifyDate}" type="both"/></li>
                        <li class="list8">
                            <div class="table-list-content-tools">
                                <ul class="clearfix">
                                    <shiro:hasPermission name="finance:exchange:save">
                                    <li><a href="javascript:editExchangeRate('${exchangeRate.sourceCurrency}','${exchangeRate.targetCurrency}','${status.index}');">保存</a><span>|</span></li>
                                    </shiro:hasPermission>
                                    <shiro:hasPermission name="finance:exchange:log">
                                    <li><a href="javascript:queryExchangeRateLogList('${exchangeRate.sourceCurrency}','${exchangeRate.targetCurrency}');">日志</a></li>
                                    </shiro:hasPermission>
                                        <%--<li><a href="javascript:setQuota('${roomType.roomTypeId}');">设置房态</a><span>|</span></li>--%>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </c:forEach>
            </div>

        </div>
    </div>

</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script>

    $(function () {
    });
    
    function queryExchangeRateLogList(sourceCurrency,targetCurrency) {
        var param = "sourceCurrency="+sourceCurrency+"&targetCurrency="+targetCurrency;
        window.open("queryLogList?"+param,"批量调整价格房态", "height=600, width=1200,top=100,left=100,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    // 编辑酒店信息
    function editExchangeRate(sourceCurrency,targetCurrency,rateInputId) {
        var rate = $("#rate_"+rateInputId).val();

        var data = {
            "sourceCurrency":sourceCurrency,
            "targetCurrency":targetCurrency,
            "rate":rate
        };

        console.log("data....."+data);
        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/editExchangeRate',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    queryRoomTypeList();
                } else {
                    new Tip({ msg: rs.errorReason,timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 2000, type:2});
            }
        });

    }


</script>