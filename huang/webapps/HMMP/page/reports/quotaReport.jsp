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
    <title>我的酒店</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
    .edit-port-dialog {
        height: 195px;
        width: 380px;
        left: -160px;
        top: -118px;
        padding-left: 19px;
    }

    .tmc-dialog .ui-dialog-title {
        padding: 10px 30px 20px 0px;
    }

    .edit-port-dialog .ui-dialog-close {
        top: 0px;
        right: -10px;
    }


    table.gridtable {
        font-family: verdana,arial,sans-serif;
        font-size:14px;
        color:#333;
        border-width: 1px;
        /*border-color: #009BF1;*/
        border-collapse: collapse;
    }
    table.gridtable th {
        border-width: 0px;
        padding: 8px;
        border-style: solid;
        /*border-color: #009BF1;*/
        /*background-color: #009BF1;*/
    }
    table.gridtable td {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        /*border-color: #009BF1;*/
        /*background-color: #ffffff;*/
        text-align:center;
    }

    .oddrowcolor{
        /*background-color:#e0f2fe;*/
        background-color:rgba(231, 248, 250, 1);
                /*#d4e3e5;*/
    }
    .evenrowcolor{
        background-color:#ffffff;
    }

    .table-list-content tr:hover {
        border: 1px solid #009BF0;
        z-index: 1;
    }
</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">酒店管理</a>
    </div>
    <div class="main-content">

        <form id="quotaReprotForm" action="toQuotaReport" method="post">
            <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                   value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                   value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

            <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty hotelPO.currentPage}'>1</c:when><c:otherwise>${hotelPO.currentPage}</c:otherwise></c:choose>" />
            <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty hotelPO.pageSize}'>5</c:when><c:otherwise>${hotelPO.pageSize}</c:otherwise></c:choose>" />


            <div class="filter-bar">
                <ul>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">酒店:</span>
                        <input name="hotelName" id="hotelName" value="${quotaDailyReportQueryDTO.hotelName}" class="text w_140 c_666 " placeholder="请输入酒店名称" autocomplete="off" type="text">
                        <input type="hidden" id="hotelId" name="hotelId" value="${quotaDailyReportQueryDTO.hotelId}">
                    </li>

                    <li class="filter-bar-list"><span class="filter-bar-list-title">开始日期</span>
                        <input type="text"  name="beginDate" value="${quotaDailyReportQueryDTO.beginDate}" id="beginDate" class="text w_140 c_666 ">
                        </i><i class="iconfont  icon-downTriangle"></i>
                    </li>

                    <%--<li class="filter-bar-list">--%>
                        <%--<span class="filter-bar-list-title">结束日期</span>--%>
                        <%--<input type="text"  name="endDate" id="endDate" class="text w_140 c_666 ">--%>
                        <%--</i><i class="iconfont  icon-downTriangle"></i>--%>
                    <%--</li>--%>

                    <li><a class="search-btn" href="javascript:queryHotelInfoList();"><i class="iconfont icon-search"></i></a></li>
                </ul>

            </div>
        </form>


        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-content clearfix">


                <br/>
                <table class="gridtable" id="quota_report_table">
                    <c:if test="${not empty pgSupport}">
                        <c:forEach items="${pgSupport.recordList}" var="quotaDailyReportResponseDTO">
                            <tr><td>${quotaDailyReportResponseDTO.hotelName}</td></tr>
                            <tr>
                                <td></td>
                                <c:forEach items="${quotaDailyReportResponseDTO.dateList}" var="dateInfo">
                                    <td colspan="3"><fmt:formatDate value="${dateInfo}" pattern="MM月dd日"/></td>
                                    <%--<th></th>--%>
                                </c:forEach>

                            </tr>

                            <tr>
                                <td></td>
                                <c:forEach items="${quotaDailyReportResponseDTO.dateList}" var="dateInfo">
                                    <td>可售</td>
                                    <td colspan="2">已售</td>
                                    <%--<td></td>--%>
                                </c:forEach>
                            </tr>


                            <c:if test="${not empty quotaDailyReportResponseDTO.totalDTOList}">
                                <c:forEach items="${quotaDailyReportResponseDTO.totalDTOList}" var="totalDTO">
                                    <tr>
                                    <th>${totalDTO.roomTypeName}</th>
                                    <c:forEach items="${totalDTO.totalDailyQuotaList}" var="totalDayInfo">
                                        <th>${totalDayInfo.onsaleQuotaNum}</th>
                                        <th>${totalDayInfo.usedQuotaNum}</th>
                                        <th></th>
                                    </c:forEach>

                                    </tr>
                                </c:forEach>
                            </c:if>

                            <c:forEach items="${quotaDailyReportResponseDTO.roomTypeDTOList}" var="roomDTO">
                                <tr>
                                    <td>${roomDTO.roomTypeName}</td>
                                    <c:forEach items="${roomDTO.totalDailyQuotaList}" var="roomDayInfo">
                                        <td>${roomDayInfo.onsaleQuotaNum}</td>
                                        <td colspan="2">${roomDayInfo.usedQuotaNum}</td>
                                        <%--<td></td>--%>
                                    </c:forEach>
                                </tr>
                            </c:forEach>
                        </c:forEach>
                    </c:if>

                <div class="table-list-footer " >
                    <div class="main_kkpager m_t10 ">
                        <div id="kkpager" class="page_turning"></div>
                    </div>
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
<%--<script src="http://hres.fangcang.com/css/saas/js/fangcang.min.js"></script>--%>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>

<script src="<%=basePath%>js/localdate.js"></script>
<script>

    function altRows(id){
        if(document.getElementsByTagName){

            var table = document.getElementById(id);
            var rows = table.getElementsByTagName("tr");

            for(i = 0; i < rows.length; i++){
                if(i % 2 == 0){
                    rows[i].className = "evenrowcolor";
                }else{
                    rows[i].className = "oddrowcolor";
                }
            }
        }
    }

    window.onload=function () {
        altRows('quota_report_table');
    }


    //初始化分页
    //init
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

//                queryHotelInfoList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });


        initHotelAutocomplete();

        initDatepicker();
    });


    // 查询酒店列表
    function queryHotelInfoList() {
        $("#quotaReprotForm").submit();
    }


</script>