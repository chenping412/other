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
</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">酒店管理</a>
    </div>
    <div class="main-content">

        <div class="section-wrap section-wrap-function">

            <table>
                <tr>
                    <shiro:hasPermission name="product:hotel:add">
                    <td><a href="##" class="addbtn add_hotel">新增酒店</a></td>
                    </shiro:hasPermission>
                </tr>
            </table>
        </div>

        <shiro:hasPermission name="product:hotel:query">
        <form id="hotelInfoForm" action="queryBaseHotelList" method="post">
            <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                   value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                   value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

            <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty hotelPO.currentPage}'>1</c:when><c:otherwise>${hotelPO.currentPage}</c:otherwise></c:choose>" />
            <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty hotelPO.pageSize}'>5</c:when><c:otherwise>${hotelPO.pageSize}</c:otherwise></c:choose>" />
            <input type="hidden" id="cityCode" name="cityCode"  value="${hotelPO.cityCode}" />
            <div class="filter-bar">
            <ul>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">城市:</span>
                    <input id="cityName" type="text" placeholder="请选择城市" readonly value="${hotelPO.cityName}" />
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
                    <input name="hotelName" id="project" value="${hotelPO.hotelName}" class="text w_140 c_666 " placeholder="请输入酒店名称" autocomplete="off" type="text">
                    <input type="hidden" id="project-id" name="hotelId" value="${hotelPO.hotelId}">
                </li>

                <li><a class="search-btn" href="javascript:queryBaseHotelInfoList();"><i class="iconfont icon-search"></i></a></li>
            </ul>

        </div>
        </form>
        </shiro:hasPermission>
        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li style="width: 30%; text-align:  center;">酒店名称</li>
                    <li style="width: 7%; text-align:  center;">城市</li>
                    <li style="width: 7%; text-align:  center;">星級</li>
                    <li style="width: 5%; text-align:  center;">预留</li>
                    <li style="width: 20%; text-align:  center;">联系电话</li>
                    <li style="width: 160px; text-align:  center;">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
               <c:if test="${not empty pgSupport}">
                    <c:forEach items="${pgSupport.recordList}" var="hotel">
                        <ul class="row clearfix">
                            <li style="width: 30%; text-align:  center;">${hotel.hotelName}</li>
                            <li style="width: 7%; text-align:  center;">${hotel.cityName}</li>
                            <li style="width: 7%; text-align:  center;">${hotel.starName}</li>
                            <li style="width: 5%; text-align:  center;">${hotel.preHoldQuotaName}</li>
                            <li style="width: 20%; text-align:  center;">${hotel.tel}</li>
                            <li style="width: 24%; text-align:  right; color: #FF6000;">
                                <div class="table-list-content-tools">
                                    <ul class="clearfix">
                                        <shiro:hasPermission name="product:hotel:edit">
                                        <li><a href="javascript:editHotelInfo('${hotel.hotelId}','${hotel.supplyCode}');">编辑</a><span>|</span></li>
                                        </shiro:hasPermission>
                                        <shiro:hasPermission name="product:hotel:delete">
                                        <li><a href="javascript:delHotelInfo('${hotel.hotelId}','${hotel.hotelName}');">删除</a></li>
                                        </shiro:hasPermission>
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
<%--<script src="http://hres.fangcang.com/css/saas/js/fangcang.min.js"></script>--%>
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

    //展示限制
    secondLimitStr($('.hotel-manage-wrap .list2'), '6');
    secondLimitStr($('.hotel-manage-wrap .list3'), '8');
    secondLimitStr($('.hotel-manage-wrap .list7'), '9');

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

                queryBaseHotelInfoList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });


        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
    });


    // 查询酒店列表
    function queryBaseHotelInfoList() {
        $("#hotelInfoForm").submit();
    }

    $('.add_hotel').on('click', function () {
        $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/toAddBaseHotel');
    });

    // 编辑酒店信息
    function editHotelInfo(hotelid) {
        $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/toEditBaseHotel?hotelId='+hotelid);
    }

    function delHotel(hotelId){
        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/delHotel',
            data: hotelId,
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "删除成功！",timer: 2000, type:1});
                    queryBaseHotelInfoList();
                } else {
                    new Tip({ msg: rs.message,timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 1000, type:2});
            }
        });
    }


        // 编辑酒店信息
    function delHotelInfo(hotelid,hotelName) {
        var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 310,
            content: '<p>删除之后，酒店的房型-价格等所有信息将不可恢复，您确定要删除<font color="#1e90ff">'+hotelName+'</font>吗</p>',
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                delHotel(hotelid);
                //$(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/delHotel?hotelId='+hotelid);
            },
            cancel: function () {

            }
        }).showModal();

    }
</script>