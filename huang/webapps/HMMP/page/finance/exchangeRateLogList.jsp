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
    <title>我的房型</title>
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
        <a href="javascript:;">汇率日志管理</a>
    </div>

    <div class="main-content">


            <form id="rateLogForm" action="queryLogList" method="post">
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty exchangeRateLogPO.currentPage}'>1</c:when><c:otherwise>${exchangeRateLogPO.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty exchangeRateLogPO.pageSize}'>5</c:when><c:otherwise>${exchangeRateLogPO.pageSize}</c:otherwise></c:choose>" />

                <input type="hidden" id="sourceCurrency" name="sourceCurrency" value="${exchangeRateLogPO.sourceCurrency}"/>
                <input type="hidden" id="targetCurrency" name="targetCurrency" value="${exchangeRateLogPO.targetCurrency}"/>

            </form>


            <div class="table-list">

                <div class="table-list-content clearfix">
                    <c:if test="${not empty pgSupport}">
                        <c:forEach items="${pgSupport.recordList}" var="rateLog">
                            <ul class="row clearfix">
                                <li class="list3" style="width: 150px">
                                    <fmt:formatDate value="${rateLog.createDate}" type="both"/>
                                </li>
                                <li class="list3" style="width: 120px">${rateLog.creator}</li>
                                <li class="list2" style="width: 240px">将${rateLog.sourceCurrency}兑${rateLog.targetCurrency}的汇率调整为${rateLog.rate}</li>
                            </ul>
                        </c:forEach>
                    </c:if>
                </div>

                <div class="table-list-footer " >
                    <div class="main_kkpager m_t10 ">
                        <div id="kkpager" class="page_turning"></div>
                    </div>
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
        var pageNo = $("#currentPage").val();
        var totalPage = $("#totalPage").val();
        var totalRecords = $("#totalCount").val();
        console.log("pageNo="+pageNo+",totalPage="+totalPage+",totalRecords="+totalRecords);
        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        new Pager({
            pno: pageNo,
            //总页码
            total: totalPage,
            //总数据条数
            totalRecords: totalRecords,
            isShowTotalRecords: true,
            isGoPage: true,
            mode: 'click', //默认值是link，可选link或者click

            click: function (n) {
                $("#currentPage").val(n);

                queryRateLogList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });

    });


    function queryRateLogList(hotelId,hotelName){
        //$(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/queryRoomList?hotelId='+hotelId+'&hotelName='+hotelName);
        $("#rateLogForm").submit();
    }


</script>