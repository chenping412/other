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

</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">杂费管理</a>
    </div>
    <div class="main-content">

        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <a href="##" class="addbtn">新增杂费</a>
            </div>
        </div>

        <div class="filter-bar">
            <form id="pricePlanForm" action="queryPricePlanList" method="post">
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty pricePlanPO.currentPage}'>1</c:when><c:otherwise>${pricePlanPO.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty pricePlanPO.pageSize}'>5</c:when><c:otherwise>${pricePlanPO.pageSize}</c:otherwise></c:choose>" />

                <ul>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">酒店:</span>
                        <input id="project" value="${pricePlanPO.hotelName}" name="hotelName">
                        <input type="hidden" id="project-id" name="hotelId" value="${pricePlanPO.hotelId}">
                    <li/>

                    <li><a class="search-btn" href="javascript:queryPricePlanList();"><i class="iconfont icon-search"></i></a></li>

                </ul>
            </form>
        </div>

        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list1">ID</li>
                    <li class="list3">酒店</li>
                    <li class="list3">房型</li>
                    <li class="list3">供应商</li>
                    <li class="list3">价格计划</li>
                    <li class="list3">采购类型</li>
                    <li class="list1">状态</li>
                    <li class="list8">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
               <c:if test="${not empty pgSupport}">
                    <c:forEach items="${pgSupport.recordList}" var="pricePlan">
                        <ul class="row clearfix">
                            <li class="list1">${pricePlan.priceplanId}</li>
                            <li class="list3">${pricePlan.hotelName}</li>
                            <li class="list3">${pricePlan.roomTypeName}</li>
                            <li class="list3">${pricePlan.supplyName}</li>
                            <li class="list3">${pricePlan.priceplanName}</li>
                            <li class="list3">${pricePlan.quotaTypeName}</li>
                            <li class="list1">${pricePlan.isActiveName}</li>
                            <li class="list8">
                                <div class="table-list-content-tools">
                                    <ul class="clearfix">

                                        <li><a href="javascript:toRoomControl('${pricePlan.hotelId}','${pricePlan.priceplanId}','${pricePlan.hotelName}');" class="check-btn">控房</a><span>|</span></li>
                                        <li><a href="javascript:editPricePlanInfo('${pricePlan.priceplanId}');">编辑</a><span>|</span></li>
                                        <c:if test="${pricePlan.isActive == 1}">
                                            <li><a href="javascript:setIsActive('${pricePlan.priceplanId}',0);">设为无效</a><span></span></li>
                                        </c:if>
                                        <c:if test="${pricePlan.isActive == 0}">
                                            <li><a href="javascript:setIsActive('${pricePlan.priceplanId}',1);">设为有效</a><span></span></li>
                                        </c:if>
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

//    //展示限制
//    secondLimitStr($('.hotel-manage-wrap .list2'), '6');
//    secondLimitStr($('.hotel-manage-wrap .list3'), '8');
//    secondLimitStr($('.hotel-manage-wrap .list7'), '9');

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

                queryPricePlanList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });


        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
    });


    // 查询酒店列表
    function queryPricePlanList() {
        $("#pricePlanForm").submit();
    }

    $('.addbtn').on('click', function () {


        var hotelId = $("#project-id").val();
        var hotelName = $("#project").val();
        var param = "hotelId="+hotelId+"&hotelName="+hotelName;
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toAddPricePlan?'+param);
    });

    // 编辑酒店信息
    function toRoomControl(hotelid) {
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toEditHotel?hotelId='+hotelid);
    }

    function doSetActive(pricePlanId,isActive){
        console.log("doSetActive:pricePlanId="+pricePlanId+",isActive="+isActive);
        var data = {
            "priceplanId":pricePlanId,
            "isActive":isActive
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/setPricePlanActive',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    queryPricePlanList();
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


        // 编辑酒店信息
    function setIsActive(pricePlanId,isActive) {
        var contentDom =  '<p>您确定要设置为无效吗</p>';
        if (isActive == 1){
            contentDom =  '<p>您确定要设置有效吗</p>';
        }
        var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 280,
            content: contentDom,
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                doSetActive(pricePlanId,isActive);
                //$(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/delHotel?hotelId='+hotelid);
            },
            cancel: function () {

            }
        }).showModal();

    }



    // 查看房型列表
    function editPricePlanInfo(pricePlanId){
       $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toEditPricePlan?priceplanId='+pricePlanId);

        <%--$.ajax({--%>
            <%--type:"POST",--%>
            <%--url:"<%=basePath%>admin/queryRoomList",--%>
            <%--data:{hotelId:hotelId},--%>
            <%--dataType: "html",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式--%>
            <%--cache:false,--%>
            <%--success:function(data){--%>
                <%--//var json = eval('('+msg+')');//拼接的json串--%>
                <%--$('#room_type_list').html("");--%>
                <%--$('#room_type_list').html(data);--%>
            <%--},--%>
            <%--error:function(error){alert(error);}--%>
        <%--});--%>
    }


</script>