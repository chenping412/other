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
        width: 424px;
        left: -160px;
        top: -118px;
        padding-left: 19px;
    }
</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">附加费管理</a>
    </div>
    <div class="main-content">

        <shiro:hasPermission name="product:hotel:additional:add">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <a href="##" class="addbtn">新增附加费</a>
            </div>
        </div>
        </shiro:hasPermission>

        <shiro:hasPermission name="product:hotel:additional:query">
        <div class="filter-bar">
            <form id="additionalForm" action="queryAdditionalList" method="post">
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty additionalDTO.currentPage}'>1</c:when><c:otherwise>${additionalDTO.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty additionalDTO.pageSize}'>5</c:when><c:otherwise>${additionalDTO.pageSize}</c:otherwise></c:choose>" />

                <ul>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">酒店:</span>
                        <input id="project" value="${additionalDTO.hotelName}" name="hotelName">
                        <input type="hidden" id="project-id" name="hotelId" value="${additionalDTO.hotelId}">
                    <li/>

                    <li><a class="search-btn" href="javascript:queryAdditionalList();"><i class="iconfont icon-search"></i></a></li>

                </ul>
            </form>
        </div>
        </shiro:hasPermission>

        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list1" style="width: 45px">ID</li>
                    <li class="list3">酒店</li>
                    <li class="list3">附加费类型</li>
                    <li class="list3">附加费名称</li>
                    <li class="list3">底价</li>
                    <li class="list3">同行价</li>
                    <li class="list3">直客价</li>
                    <li class="list8">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
               <c:if test="${not empty pgSupport}">
                    <c:forEach items="${pgSupport.recordList}" var="additionalDTO">
                        <ul class="row clearfix">
                            <li class="list1" style="width: 45px">${additionalDTO.chargeId}</li>
                            <li class="list3">${additionalDTO.hotelName}</li>
                            <li class="list3">${additionalDTO.chargeTypeName}</li>
                            <li class="list3">${additionalDTO.chargeName}</li>
                            <li class="list3">${additionalDTO.basePrice}${additionalDTO.baseCurrency}</li>
                            <li class="list3">${additionalDTO.saleBPrice}${additionalDTO.saleBCurrency}</li>
                            <li class="list3">${additionalDTO.saleCPrice}${additionalDTO.saleCCurrency}</li>
                            <li class="list8">
                                <div class="table-list-content-tools">
                                    <ul class="clearfix">
                                        <shiro:hasPermission name="product:hotel:additional:edit">
                                        <li><a href="javascript:edit('${additionalDTO.chargeId}','${additionalDTO.hotelName}');">编辑</a><span>|</span></li>
                                        </shiro:hasPermission>
                                        <shiro:hasPermission name="product:hotel:additional:delete">
                                        <li><a href="javascript:del('${additionalDTO.chargeId}');" class="check-btn">删除</a></li>
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

                queryAdditionalList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });


        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
    });


    // 查询酒店列表
    function queryAdditionalList() {
        $("#additionalForm").submit();
    }

    $('.addbtn').on('click', function () {


        var hotelId = $("#project-id").val();
        var hotelName = $("#project").val();
        var param = "hotelId="+hotelId+"&hotelName="+hotelName;
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toAddAdditional?'+param);
    });


    function doDel(chargeId){
        var data = {
            "chargeId":chargeId
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/delAdditional',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    queryAdditionalList();
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


    function del(chargeId) {
        var contentDom =  '<p>您确定要删除吗</p>';

        var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 350,
            content: contentDom,
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                doDel(chargeId);
                //$(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/delHotel?hotelId='+hotelid);
            },
            cancel: function () {

            }
        }).showModal();

    }

    function edit(chargeId,hotelName){
        var param = 'chargeId='+chargeId+'&hotelName='+hotelName;
       $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toEditAdditional?'+param);
    }

</script>