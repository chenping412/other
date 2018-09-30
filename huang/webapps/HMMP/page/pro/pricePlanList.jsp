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
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<style>
    /*.edit-port-dialog {*/
        /*height: 195px;*/
        /*width: 380px;*/
        /*left: -160px;*/
        /*top: -118px;*/
        /*padding-left: 19px;*/
    /*}*/

    .oddrowcolor{
        /*background-color:#e0f2fe;*/
        background-color:rgba(231, 248, 250, 1);
        /*#d4e3e5;*/
    }
    .evenrowcolor{
        background-color:#ffffff;
    }

    .trhover {
        border: 1px solid #009BF0;
        z-index: 1;
    }

</style>
<body>

<div class="hotel-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">产品管理</a>
    </div>
    <div class="main-content">

        <shiro:hasPermission name="product:hotel:product:add">
            <div class="section-wrap section-wrap-function">
                    <%--<div class="section-content">--%>
                    <%--<a href="##" class="addbtn">新增价格计划</a>--%>
                    <%--</div>--%>
                <table>
                    <tr>
                        <td><a href="##" onclick="toBatchSet('toDifferentSetPrice')" class="addbtn batchSetPrice" style="background-color:#009BC1">批量调价</a></td>
                        <td></td><td></td><td></td>
                        <td><a href="##" onclick="toBatchSet('toDifferentSetQuota')" class="addbtn batchSetQuota" style="background-color:#009BC1">批量调房</a></td>
                        <td></td><td></td><td></td>
                        <td><a href="##" onclick="toBatchSet('toBatchSetOnsale')" class="addbtn batchSetOnsale" style="background-color:#009BC1">批量上下架</a></td>
                        <td></td><td></td><td></td>
                        <td><a href="##" class="addbtn addPricePlanBtn">新增价格计划</a></td>
                    </tr>
                </table>
            </div>
        </shiro:hasPermission>

        <shiro:hasPermission name="product:hotel:product:query">
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
                        <input id="hotelName" value="${pricePlanPO.hotelName}" name="hotelName">
                        <input type="hidden" id="hotelId" name="hotelId" value="${pricePlanPO.hotelId}">
                    <li/>

                    <li><a class="search-btn" href="javascript:queryPricePlanList();"><i class="iconfont icon-search"></i></a></li>

                </ul>
            </form>
        </div>
        </shiro:hasPermission>



        <div class="baseline"></div>

        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li style="width: 38px"><input type="checkbox" id="selectAll" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" /></li>
                    <%--<li class="list3" style="width: 130px">供应商</li>--%>
                    <li class="list3" style="width: 240px">酒店</li>
                    <li class="list1" style="width: 100px">房型</li>
                    <li class="list3">价格计划</li>
                    <li class="list1">采购类型</li>
                    <li class="list1">状态</li>
                    <li class="list8" style="width: 218px">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
               <c:if test="${not empty pgSupport}">
                    <c:forEach items="${pgSupport.recordList}" var="pricePlan" varStatus="status">
                        <ul class="row clearfix">
                            <li style="width: 38px"><input type="checkbox" value="${pricePlan.priceplanId}" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" /></li>
                            <input type="hidden" value="${pricePlan.priceplanId}">
                            <%--<li class="list3" style="width: 130px">${pricePlan.supplyName}</li>--%>

                            <li class="list3" style="width: 240px">${pricePlan.hotelName}</li>
                            <input type="hidden" value="${pricePlan.hotelId}" id="hotelId_${pricePlan.priceplanId}">
                            <input type="hidden" value="${pricePlan.hotelName}" id="hotelName_${pricePlan.priceplanId}">

                            <li class="list1" style="width: 100px">${pricePlan.roomTypeName}</li>
                            <input type="hidden" value="${pricePlan.roomTypeName}" id="roomTypeName_${pricePlan.priceplanId}">
                            <input type="hidden" value="${pricePlan.roomTypeId}" id="roomTypeId_${pricePlan.priceplanId}">

                            <li class="list3">${pricePlan.priceplanName}</li>
                            <input type="hidden" value="${pricePlan.priceplanName}" id="priceplanName_${pricePlan.priceplanId}">

                            <input type="hidden" value="${pricePlan.baseCurrency}" id="baseCurrency_${pricePlan.priceplanId}">
                            <input type="hidden" value="${pricePlan.saleBCurrency}" id="saleBCurrency_${pricePlan.priceplanId}">
                            <input type="hidden" value="${pricePlan.saleCCurrency}" id="saleCCurrency_${pricePlan.priceplanId}">

                            <li class="list1">${pricePlan.quotaTypeName}</li>
                            <li class="list1">${pricePlan.isActiveName}</li>
                            <li class="list8" style="width: 218px">
                                <div class="table-list-content-tools">
                                    <ul class="clearfix">

                                        <%--<li><a href="javascript:toRoomControl('${pricePlan.priceplanId}');" class="check-btn">控房</a><span>|</span></li>--%>
                                        <shiro:hasPermission name="product:hotel:product:setPrice">
                                        <li><a href="javascript:setPriceAndQuota('${pricePlan.hotelId}','${pricePlan.roomTypeId}','${pricePlan.priceplanId}','${pricePlan.hotelName}','${pricePlan.roomTypeName}','${pricePlan.priceplanName}','${pricePlan.baseCurrency}','${pricePlan.saleBCurrency}','${pricePlan.saleCCurrency}');">调价</a><span>|</span></li>
                                        </shiro:hasPermission>
                                        <%--<li><a href="javascript:toReserveQuotaNum('${pricePlan.accountId}','${pricePlan.roomTypeId}','${pricePlan.priceplanId}');">预留</a><span>|</span></li>--%>

                                        <shiro:hasPermission name="product:hotel:product:inactive">
                                        <c:if test="${pricePlan.isActive == 1}">
                                            <li><a href="javascript:setIsActive('${pricePlan.priceplanId}',0);">设无效</a><span>|</span></li>
                                        </c:if>
                                        <c:if test="${pricePlan.isActive == 0}">
                                            <li><a href="javascript:setIsActive('${pricePlan.priceplanId}',1);">设有效</a><span>|</span></li>
                                        </c:if>
                                        </shiro:hasPermission>

                                        <shiro:hasPermission name="product:hotel:product:onSale">
                                        <li><a href="javascript:setSaleState('${pricePlan.priceplanId}','${pricePlan.priceplanName}');">上下架</a><span>|</span></li>
                                        </shiro:hasPermission>

                                        <shiro:hasPermission name="product:hotel:product:edit">
                                        <li><a href="javascript:editPricePlanInfo('${pricePlan.priceplanId}');">编辑</a><span>|</span></li>
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

<%--<div id="room_type_list"></div>--%>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<%--<script src="http://hres.fangcang.com/css/saas/js/fangcang.min.js"></script>--%>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>

<script>

//    //展示限制
    secondLimitStr($('.hotel-manage-wrap .list1'), '8');
    secondLimitStr($('.hotel-manage-wrap .list3'), '11');

//全选和反选
$("#selectAll").on('click',function () {
    var isSelectAll = $("#selectAll").is(":checked");
    $("input[type='checkbox']").each(function() {
        this.checked = isSelectAll; //循环赋值给每个复选框是否选中
    });
});

    //初始化分页
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

        initHotelAutocomplete();
    });


    // 查询酒店列表
    function queryPricePlanList() {
        $("#pricePlanForm").submit();
    }

//批量调价、调房、上下架
function toBatchSet(controller) {
    var dataArray = [];
    $("input[type='checkbox']:checked").each(function() {

        //FIXME 校验所选的产品是同一个酒店。否则不让设置

        var priceplanId = $(this).val();
        console.log("priceplanId==="+priceplanId);
        if ("on" != priceplanId){
            var data = {
                "priceplanId":priceplanId,
                "hotelId":$("#hotelId_"+priceplanId).val(),
                "roomTypeId":$("#roomTypeId_"+priceplanId).val(),
                "hotelName":$("#hotelName_"+priceplanId).val(),
                "roomTypeName":$("#roomTypeName_"+priceplanId).val(),
                "priceplanName":$("#priceplanName_"+priceplanId).val(),
                "baseCurrency":$("#baseCurrency_"+priceplanId).val(),
                "saleBCurrency":$("#saleBCurrency_"+priceplanId).val(),
                "saleCCurrency":$("#saleCCurrency_"+priceplanId).val()
            };
            dataArray.push(data);
        }
    });

    $.ajax({
        type : 'POST',
        dataType : 'html',
        context : document.body,
        url : projectPath+'admin/'+controller,
        data : {"pricePlanDTOListJson":JSON.stringify(dataArray)},
        success : function(resultData) {
            if (resultData) {
            	console.log('click');
                var d = dialog({
                    title: '批量调整',
                    content: resultData,
                    width: 900,
                    height:480,
                    onclose: function () {
                    	$('#ui-datepicker-div').remove();
                    },
                    button:[
                        {
                            value: '取消',
                            callback: function () {

                            }
                        },
                        {
                            value: '确定',
                            callback: function () {
                                var arrayData = [];
                                if ("toDifferentSetPrice" == controller){

                                    arrayData = getPriceInfo();
                                    batchSet(arrayData);
                                }

                                else if ("toDifferentSetQuota" == controller){
                                    arrayData = getQuotaInfo();
                                    batchSet(arrayData);
                                }

                                else if ("toBatchSetOnsale" == controller){
                                    arrayData = getOnsaleInfo();
                                    batchOnsale(arrayData);
                                }


                            },
                            autofocus: true
                        },
                    ]
                }).showModal();
                $("input[name='beginDate']",'#different').datepicker({
                    changeMonth: true,
                    changeYear: true
                });
                $("input[name='endDate']",'#different').datepicker({
                    changeMonth: true,
                    changeYear: true
                });

                altRows('price_table');

            } else {
                new Tip({msg : "请退出重新操作",timer : 1000,type : 2});
            }
        }
    });
}

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


function batchOnsale(data){

    $.ajax({
        type: 'POST',
        context : document.body,
        contentType : 'application/json;',
        url: '<%=basePath%>admin/batchSetSaleState',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(rs) {
            $('.f_ui-loading').hide();
            if (rs.result == 1) {
                new Tip({ msg: "设置成功！",timer: 2000, type:1});

            } else {
                new Tip({ msg: rs.errorReason,timer: 3000, type:2});
            }
        },
        error: function(xhr, type) {
            $('.f_ui-loading').hide();
            new Tip({ msg: '系统异常',timer: 1000, type:2});
        }
    });
}

function batchSet(data){

    $.ajax({
        type: 'POST',
        context : document.body,
        contentType : 'application/json;',
        url: '<%=basePath%>admin/batchDifferentSetPriceQuota',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(rs) {
            $('.f_ui-loading').hide();
            if (rs.result == 1) {
                new Tip({ msg: "设置成功！",timer: 2000, type:1});

            } else {
                new Tip({ msg: rs.errorReason,timer: 3000, type:2});
            }
        },
        error: function(xhr, type) {
            $('.f_ui-loading').hide();
            new Tip({ msg: '系统异常',timer: 1000, type:2});
        }
    });
}

function getPriceInfo() {
    var priceList = [];
    $('tr[name="priceTableTr"]').each(function() {
        var $tr = $(this);
        var beginDate = $tr.find('input[name="beginDate"]').val();
        var endDate = $tr.find('input[name="endDate"]').val();

        if (beginDate && endDate) {
            var data = {
                "pricePlanId": $tr.find('input[name="pricePlanId"]').val(),
                "hotelId": $tr.find('input[name="hotelId"]').val(),
                "roomTypeId": $tr.find('input[name="roomTypeId"]').val(),
                "roomTypeName": $tr.find('input[name="roomTypeName"]').val(),
                "pricePlanName": $tr.find('input[name="pricePlanName"]').val(),
                "sameSalePrice": $tr.find('input[name="sameSalePrice"]').val(),

                "beginDate": $tr.find('input[name="beginDate"]').val(),
                "endDate": $tr.find('input[name="endDate"]').val(),

                "basePriceWeekday": $tr.find('input[name="basePriceWeekday"]').val(),
                "basePriceWeekend": $tr.find('input[name="basePriceWeekend"]').val(),
                "baseCurrency": $tr.find('input[name="baseCurrency"]').val(),

                "toBPriceWeekday": $tr.find('input[name="toBPriceWeekday"]').val(),
                "toBPriceWeekend": $tr.find('input[name="toBPriceWeekend"]').val(),
                "toBCurrency": $tr.find('input[name="toBCurrency"]').val(),

                "toCPriceWeekday": $tr.find('input[name="toCPriceWeekday"]').val(),
                "toCPriceWeekend": $tr.find('input[name="toCPriceWeekend"]').val(),
                "toCCurrency": $tr.find('input[name="toCCurrency"]').val(),

                "batchSetRestrict":false,
                "batchSetQuota":false
            };
            priceList.push(data);
        }
    });
    return priceList;
}

function getQuotaInfo(){
    var quotaList = [];
    $('tr[name="quotaTableTr"]').each(function() {
        var $tr = $(this);
        var beginDate = $tr.find('input[name="beginDate"]').val();
        var endDate = $tr.find('input[name="endDate"]').val();

        if (beginDate && endDate){
            var data = {
                "pricePlanId": $tr.find('input[name="pricePlanId"]').val(),
                "hotelId": $tr.find('input[name="hotelId"]').val(),
                "roomTypeId": $tr.find('input[name="roomTypeId"]').val(),
                "roomTypeName": $tr.find('input[name="roomTypeName"]').val(),
                "pricePlanName": $tr.find('input[name="pricePlanName"]').val(),

                "beginDate": $tr.find('input[name="beginDate"]').val(),
                "endDate": $tr.find('input[name="endDate"]').val(),

                "roomState": $tr.find('select[name="roomState"]').val(),
                "quotaNum": $tr.find('input[name="quotaNum"]').val(),
                "batchSetPrice":false,
                "batchSetRestrict":false

            };
            quotaList.push(data);
        }

    });
    return quotaList;
}


function getOnsaleInfo(){
    var quotaList = [];
    $('tr[name="onsaleTableTr"]').each(function() {
        var $tr = $(this);
            var data = {
                "pricePlanId": $tr.find('input[name="pricePlanId"]').val(),
                "saleStateToB": $tr.find('select[name="saleStateToB"]').val(),
                "saleStateToCtrip": $tr.find('select[name="saleStateToCtrip"]').val(),
            };
            quotaList.push(data);

    });
    return quotaList;
}




    $('.addPricePlanBtn').on('click', function () {


        var hotelId = $("#hotelId").val();
        var hotelName = $("#hotelName").val();
        var param = "hotelId="+hotelId+"&hotelName="+hotelName;
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toAddPricePlan?'+param);
    });

    // 编辑酒店信息
    function toRoomControl(pricePlanId) {
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/queryRoomControlList?pricePlanId='+pricePlanId);
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


    function setIsActive(pricePlanId,isActive) {
        var contentDom =  '<p>您确定要设置为无效吗</p>';
        if (isActive == 1){
            contentDom =  '<p>您确定要设置有效吗</p>';
        }
        var d = dialog({
            title: '提示',
            width: 341,
            content: contentDom,
            button:[
                {
                    value: '取消',
                    callback: function () {

                    }
                },
                {
                    value: '确定',
                    callback: function () {
                        doSetActive(pricePlanId,isActive);
                    },
                    autofocus: true
                },
            ]

        }).showModal();

    }

    // 查看房型列表
    function editPricePlanInfo(pricePlanId){
       $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toEditPricePlan?priceplanId='+pricePlanId);
    }

    function setSaleState(pricePlanId,pricePlanName){
        window.open ("toSetOnSale?pricePlanId="+pricePlanId+"&pricePlanName="+pricePlanName, "设置上下架", "height=600, width=1024,top=100,left=300,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
    }

    function setPriceAndQuota(hotelId,roomTypeId,pricePlanId,hotelName,roomTypeName,pricePlanName,baseCurrency,saleBCurrency,saleCCurrency){

        var h = window.screen.availHeight;
        var w = window.screen.availWidth;
        var param = "hotelId="+hotelId+"&roomTypeId="+roomTypeId+"&priceplanId="+pricePlanId
                +"&hotelName="+hotelName+"&roomTypeName="+roomTypeName+"&priceplanName="+pricePlanName
                +"&baseCurrency="+baseCurrency+"&saleBCurrency="+saleBCurrency+"&saleCCurrency="+saleCCurrency
                +"&pageFrom=list";
        window.open("toBatchSetPriceAndQuota?"+param,"批量调整价格房态", "height="+h+", width="+w+",top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

//    function toReserveQuotaNum()


</script>