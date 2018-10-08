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
    <title>代理通酒店映射</title>
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
</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">代理通酒店映射</a>
    </div>
    <div class="main-content">
        <%--<shiro:hasPermission name="product:hotel:query">--%>
        <form id="dltHotelMappingForm" action="dltHotelMappingForPage" method="post">
            <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                   value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                   value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

            <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty pgSupport.currentPage}'>1</c:when><c:otherwise>${pgSupport.currentPage}</c:otherwise></c:choose>" />
            <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty pgSupport.pageSize}'>5</c:when><c:otherwise>${pgSupport.pageSize}</c:otherwise></c:choose>" />
            <input type="hidden" id="cityCode" name="cityCode"  value="${null eq dltHotelMappingQueryDTO.cityCode ? null : dltHotelMappingQueryDTO.cityCode}" />
            <input type="hidden" id="mappingStatus" name="mappingStatus"  value="${null eq dltHotelMappingQueryDTO.mappingStatus ? null : dltHotelMappingQueryDTO.mappingStatus}" />

            <div class="filter-bar">
            <ul>

                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">城市:</span>
                    <input id="cityName" type="text" placeholder="请选择城市" readonly value="${dltHotelMappingQueryDTO.cityName}" />
                    <%--<i class="iconfont  icon-downTriangle"></i>--%>
                    <div class="filter-bar-drop-box">
                        <ul class="clearfix"  id="cityCodeBox">
                            <li class="clearfix">全部</li>
                            <c:forEach items="${cityMap}" var="cityItem">
                                <li class="clearfix"  value="${cityItem.key}">${cityItem.value}</li>
                            </c:forEach>
                        </ul>
                    </div>
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">酒店:</span>
                    <input name="hotelName" id="project" value="${dltHotelMappingQueryDTO.hotelName}" class="text w_140 c_666 " placeholder="请输入酒店名称" autocomplete="off" type="text">
                    <input type="hidden" id="project-id" name="hotelId" value="${dltHotelMappingQueryDTO.hotelId}">
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">映射状态:</span>
                    <input type="text" placeholder="请选择映射状态" readonly value="<c:choose><c:when test="${1 eq dltHotelMappingQueryDTO.mappingStatus}">已映射</c:when><c:otherwise><c:choose><c:when test="${0 eq dltHotelMappingQueryDTO.mappingStatus}">未映射</c:when><c:otherwise>全部</c:otherwise></c:choose></c:otherwise></c:choose>" />
                    <div class="filter-bar-drop-box">
                        <ul class="clearfix" id="mappingStatusBox">
                            <li class="clearfix">全部</li>
                            <li class="clearfix" value="1">已映射</li>
                            <li class="clearfix" value="0">未映射</li>
                        </ul>
                    </div>
                </li>

                <li><a class="search-btn" href="javascript:queryHotelMappingList();"><i class="iconfont icon-search"></i></a></li>
            </ul>

        </div>
        </form>
        <%--</shiro:hasPermission>--%>
        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li style="width: 5%; text-align:  center;">酒店ID</li>
                    <li style="width: 30%; text-align:  center;">酒店名称</li>
                    <li style="width: 6%; text-align:  center;">城市</li>
                    <li style="width: 6%; text-align:  center;">星級</li>
                    <li style="width: 15%; text-align:  center;">联系电话</li>
                    <li style="width: 18%; text-align:  center;">代理通子酒店ID</li>
                    <li style="width: 20%; text-align:  center;">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
               <c:if test="${not empty pgSupport}">
                    <c:forEach items="${pgSupport.recordList}" var="hotel">
                        <ul class="row clearfix">
                            <li style="width: 5%; text-align:  center;">${hotel.hotelId}</li>
                            <li style="width: 30%; text-align:  center;">${hotel.hotelName}</li>
                            <li style="width: 6%; text-align:  center;">${hotel.cityName}</li>
                            <li style="width: 6%; text-align:  center;">${hotel.starName}</li>
                            <li style="width: 15%; text-align:  center;">${hotel.tel}</li>
                            <c:if test="${not empty hotel.dltHotelId}">
                            <li style="width: 18%; text-align:  center;" id="li_dltHotelId_${hotel.hotelId}">${hotel.dltHotelId}</li>
                            </c:if>
                            <c:if test="${empty hotel.dltHotelId}">
                                <li style="width: 18%; text-align:  center;" id="li_dltHotelId_${hotel.hotelId}"><input name="dltHotelId" id="dltHotelId_${hotel.hotelId}" placeholder="请输入代理通子酒店ID" style="width: 80%; height: 24px;"/></li>
                            </c:if>
                            <li style="width: 20%; text-align:  center; color: #FF6000;">
                                <div class="table-list-content-tools">
                                    <ul class="clearfix" id="ul_operate_${hotel.hotelId}">
                                        <%--<shiro:hasPermission name="product:hotel:room:query">--%>
                                        <c:if test="${not empty hotel.dltHotelId}">
                                            <li><a href="javascript:modifyDltHotelMapping('${hotel.hotelId}','${hotel.dltHotelId}');" class="check-btn">修改</a><span>|</span></li>
                                            <li><a href="javascript:inactiveDltHotelMapping('${hotel.hotelId}');" class="check-btn">断开</a><span>|</span></li>
                                        </c:if>
                                        <c:if test="${empty hotel.dltHotelId}">
                                            <li><a href="javascript:saveDltHotelMapping('${hotel.hotelId}');" class="check-btn">保存</a><span>|</span></li>
                                        </c:if>
                                        <li><a href="javascript:queryDltHotelMappingLog('${hotel.hotelId}');" class="check-btn">日志</a></li>
                                        <%--</shiro:hasPermission>--%>
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

<div id="room_type_list"></div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>

    //城市查询条件
    $('#cityCodeBox li').on('click', function () {
        if('全部' != $(this).html()){
            $("#cityCode").val($(this).attr("value"));
        }else{
            $("#cityCode").val(null);
        }
    });

    //映射状态查询条件
    $('#mappingStatusBox li').on('click', function () {
        if('全部' != $(this).html()){
            $("#mappingStatus").val($(this).attr("value"));
        }else{
            $("#mappingStatus").val(null);
        }
    });

    //初始化分页
    //init
    $(function () {
        var pageNo = $("#currentPage").val();
        var totalPage = $("#totalPage").val();
        var totalRecords = $("#totalCount").val();

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

                queryHotelMappingList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });


        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
    });

    // 查询酒店列表
    function queryHotelMappingList() {
        $("#dltHotelMappingForm").submit();
    }


    function saveDltHotelMapping(hotelId){
        var dltHotelId = $("#dltHotelId_" + hotelId).val();
        console.log("saveDltHotelMapping:hotelID="+hotelId + ", dltHotelId=" + dltHotelId);
        $.ajax({
            type: 'POST',
            dataType : 'json',
            context : document.body,
            url: '<%=basePath%>admin/saveDltHotelMapping',
            data: {
                "hotelId": hotelId,
                "dltHotelId" : dltHotelId
            },
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "操作成功！",timer: 2000, type:1});
                    changeHtml(hotelId, dltHotelId);
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

    function inactiveDltHotelMapping(hotelId){
        $.ajax({
            type: 'POST',
            dataType : 'json',
            context : document.body,
            url: '<%=basePath%>admin/inactiveDltHotelMapping',
            data: {
                "hotelId": hotelId
            },
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "操作成功！",timer: 2000, type:1});
                    inactiveDltHotelMappingModifyHtml(hotelId);
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

    function changeHtml(hotelId, dltHotelId) {
        if (undefined != dltHotelId && null != dltHotelId) {
            $('#li_dltHotelId_' + hotelId).html(dltHotelId);

            var html2 = '<li><a href="javascript:modifyDltHotelMapping(' + hotelId + ',' + dltHotelId + ');" class="check-btn">修改</a><span>|</span></li>' +
                    '<li><a href="javascript:inactiveDltHotelMapping(' + hotelId + ');" class="check-btn">断开</a><span>|</span></li>' +
                    '<li><a href="javascript:queryDltHotelMappingLog(' + hotelId + ');" class="check-btn">日志</a></li>';
            $('#ul_operate_' + hotelId).html(html2);
        }
    }

    function modifyDltHotelMapping(hotelId, dltHotelId) {
        // ul_operate
        var html1 = '<input name="dltHotelId" id="dltHotelId_' + hotelId + '" placeholder="请输入代理通子酒店ID" style="width: 80%; height: 24px;" value="'+ dltHotelId+'"/>';
        $('#li_dltHotelId_' + hotelId).html(html1);

        var html2 = '<li><a href="javascript:saveDltHotelMapping(' + hotelId + ');" class="check-btn">保存</a><span>|</span></li>'+
                    '<li><a href="javascript:queryDltHotelMappingLog(' + hotelId + ');" class="check-btn">日志</a></li>';
        $('#ul_operate_' + hotelId).html(html2);
    }

    function inactiveDltHotelMappingModifyHtml(hotelId) {
        var html1 = '<input name="dltHotelId" id="dltHotelId_' + hotelId + '" placeholder="请输入代理通子酒店ID" style="width: 80%; height: 24px;"/>';
        $('#li_dltHotelId_' + hotelId).html(html1);

        var html2 = '<li><a href="javascript:saveDltHotelMapping(' + hotelId + ');" class="check-btn">保存</a><span>|</span></li>'+
                '<li><a href="javascript:queryDltHotelMappingLog(' + hotelId + ');" class="check-btn">日志</a></li>';
        $('#ul_operate_' + hotelId).html(html2);
    }

</script>