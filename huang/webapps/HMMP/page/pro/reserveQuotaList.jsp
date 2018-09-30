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
    <title>预留配额</title>
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
        <a href="javascript:;">预留配额列表</a>
    </div>

    <div class="main-content">
            <div class="section-wrap section-wrap-function">
                <div class="section-content">
                    <a href="##" class="addbtn">给客户预留</a>
                </div>
            </div>
        <div class="filter-bar">
            <form id="reserveQuotaForm" action="queryReserveQuotaList" method="post">
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty reserveQuotaPO.currentPage}'>1</c:when><c:otherwise>${reserveQuotaPO.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty reserveQuotaPO.pageSize}'>5</c:when><c:otherwise>${reserveQuotaPO.pageSize}</c:otherwise></c:choose>" />

                <input type="hidden" id="priceplanId" name="priceplanId" value="${reserveQuotaPO.priceplanId}"/>
                <input type="hidden" id="saleDateStr" name="saleDateStr" value="${reserveQuotaPO.saleDateStr}"/>
                <input type="hidden" id="quotaAccountId" name="quotaAccountId" value="${reserveQuotaPO.quotaAccountId}"/>
                <input type="hidden" id="pricePlanName" name="pricePlanName" value="${reserveQuotaPO.pricePlanName}"/>

            </form>
        </div>

            <div class="table-list">

                <div class="table-list-header">
                    <ul class="clearfix">
                        <li class="list2">分销商</li>
                        <li class="list2">日期</li>
                        <li class="list2">预留数</li>
                        <li class="list2">截止时间</li>
                        <li class="list8">操作</li>
                    </ul>
                </div>

                <div class="table-list-content clearfix">
                    <c:if test="${not empty pgSupport}">
                        <c:forEach items="${pgSupport.recordList}" var="reserveQuota" varStatus="status">
                            <ul class="row clearfix">
                                <li class="list3" style="width: 120px">${reserveQuota.agentName}</li>
                                <li class="list3" style="width: 150px">
                                    <fmt:formatDate value="${reserveQuota.saleDate}" pattern="yyyy-MM-dd" />
                                </li>
                                <li class="list3" style="width: 120px">
                                    <input type="text" style="width: 80px" value="${reserveQuota.reserveQuotaNum}" id="reserve_quota_${status.index}">
                                </li>
                                <li class="list3" style="width: 170px">
                                    <fmt:formatDate value="${reserveQuota.endTime}" type="both"/>
                                </li>
                                <li class="list8">
                                    <div class="table-list-content-tools">
                                        <ul class="clearfix">
                                            <li><a href="javascript:editReserveQuotaInfo('${reserveQuota.reserveQuotaNum}','${reserveQuota.quotaAccountId}','${reserveQuota.reserveId}','${status.index}');">保存</a></li>
                                        </ul>
                                    </div>
                                </li>
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

                queryReserveQuotaList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });

    });

    function queryReserveQuotaList() {
        $("#reserveQuotaForm").submit();
    }

    $('.addbtn').on('click', function () {
        var priceplanId = $("#priceplanId").val();
        var saleDateStr = $("#saleDateStr").val();
        var quotaAccountId = $("#quotaAccountId").val();
        var pricePlanName = $("#pricePlanName").val();

        var param = "quotaAccountId="+quotaAccountId+"&pricePlanName="+pricePlanName+"&priceplanId="+priceplanId+"&saleDateStr="+saleDateStr;

        window.open("toAddReserveQuotaDistribute?"+param,"给分销商设置预留配额", "height=600, width=1024,top=100,left=300,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no, fullscreen=yes");
    });

    function editReserveQuotaInfo(oldReserveQuotaNum,quotaAccountId,reserveId,index){

        var newReserveQuotaNum = $("#reserve_quota_"+index).val();
        //本次要新增的預留配額數，可能是負數。
        var amount = Number(newReserveQuotaNum) - Number(oldReserveQuotaNum);
        var data = {
            "saleDateStr":$("#saleDateStr").val(),
            "quotaAccountId": quotaAccountId,
            "reserveId":reserveId,
            "reserveQuotaNum":newReserveQuotaNum,
            "amount":amount,
            "priceplanId": $("#priceplanId").val()
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/editReserveQuota',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    window.opener.location.reload();
                } else {
                    new Tip({ msg: "设置失败",timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 1000, type:2});
            }
        });


    }


</script>