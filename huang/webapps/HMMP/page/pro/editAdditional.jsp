<%--
  Created by IntelliJ IDEA.
  User: Vinney
  Date: 2018/1/8
  Time: 17:11
  To change this template use File | Settings | File Templates.
--%>
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
    <title>附加费管理-编辑附加费</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-labelauty.css">
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
<div class="add-hotel-manage-wrap">
    <div class="breadcrumb">
        附加费管理
    </div>

    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>编辑附加费</h3>

                <form id="editAdditionalForm" class="form-list" action="editAdditional" method="post">

                    <ul class="row">
                        <%--<li class="list"><span>附加费ID</span>--%>
                            <%----%>
                        <%--</li>--%>

                        <input type="hidden" name="chargeId" value="${additionalDTO.chargeId}" readonly>


                        <li class="list"><span>酒店</span>
                            <input type="text"  value="${additionalDTO.hotelName}" disabled>
                            <input type="hidden" name="hotelName" id="hotelName" value="${additionalDTO.hotelName}">
                        </li>

                        <li class="list drop-box"><span>类型</span>
                            <input name="chargeTypeName" type="text" placeholder="请选择附加费类型" value="${additionalDTO.chargeTypeName}" class="input-effective select-box-value">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" >
                                <ul class="clearfix" id="chargeTypeSelectBox">
                                    <c:forEach items="${chargeTypeMap}" var="chargeTypeItem">
                                        <li value="${chargeTypeItem.key}">${chargeTypeItem.value}</li>
                                    </c:forEach>
                                </ul>
                            </div>
                        </li>

                        <li class="list"><span>名称</span>
                            <input name="chargeName" id="chargeName" class="text w_140 c_666 " value="${additionalDTO.chargeName}" autocomplete="off" type="text" value="${pricePlanDTO.priceplanName}"><i class="empty iconfont icon-ArtboardCopy"></i>
                        </li>


                        <li class="list drop-box">
                            <td><span>底价</span></td>
                            <td><input style="width: 80px" name="basePrice" id="basePrice" class="text w_140 c_666 " value="${additionalDTO.basePrice}"  autocomplete="off" type="text"></td>
                            <td><input style="width: 80px" type="text" placeholder="请选择币种" value="${additionalDTO.baseCurrencyName}"  class="input-effective select-box-value">
                                <div class="form-list-drop-box"  style="left: 213px">
                                    <ul class="clearfix" id="baseCurrencySelectBox">
                                    <c:forEach items="${currencyMap}" var="currencyItem">
                                    <li value="${currencyItem.key}">${currencyItem.value}</li>
                                    </c:forEach>
                                    </ul>
                                </div>
                            </td>
                        </li>

                        <li class="list drop-box">
                            <td><span>同行价</span></td>
                            <td><input style="width: 80px" name="saleBPrice" id="saleBPrice" class="text w_140 c_666 " value="${additionalDTO.saleBPrice}"  autocomplete="off" type="text"></td>
                            <td><input style="width: 80px" type="text" placeholder="同行价币种" value="${additionalDTO.saleBCurrencyName}" class="input-effective select-box-value">
                                <div class="form-list-drop-box"  style="left: 213px">
                                    <ul class="clearfix" id="saleBCurrencySelectBox">
                                        <c:forEach items="${currencyMap}" var="currencyItem">
                                            <li value="${currencyItem.key}">${currencyItem.value}</li>
                                        </c:forEach>
                                    </ul>
                                </div>
                            </td>
                        </li>

                        <li class="list drop-box">
                            <td><span>直客价</span></td>
                            <td><input style="width: 80px" name="saleCPrice" id="saleCPrice" class="text w_140 c_666 " value="${additionalDTO.saleCPrice}"  autocomplete="off" type="text"></td>
                            <td><input style="width: 80px" type="text" placeholder="请选择直客价币种" value="${additionalDTO.saleCCurrencyName}"  class="input-effective select-box-value">
                                <div class="form-list-drop-box"  style="left: 213px">
                                    <ul class="clearfix" id="saleCCurrencySelectBox">
                                        <c:forEach items="${currencyMap}" var="currencyItem">
                                            <li value="${currencyItem.key}">${currencyItem.value}</li>
                                        </c:forEach>
                                    </ul>
                                </div>
                            </td>
                        </li>
                     </ul>
                    <input type="hidden" id="hotelId" name="hotelId" value="${additionalDTO.hotelId}" />
                    <input type="hidden" id="chargeType" name="chargeType" value="${additionalDTO.chargeType}" />
                    <input type="hidden" id="saleBCurrency" name="saleBCurrency" value="${additionalDTO.saleBCurrency}" />
                    <input type="hidden" id="saleCCurrency" name="saleCCurrency" value="${additionalDTO.saleCCurrency}" />
                    <input type="hidden" id="baseCurrency" name="baseCurrency" value="${additionalDTO.baseCurrency}" />
                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="##" id="cancelAdditional" class="cancel">返回</a><a href="##" id="saveAdditional" class="save" >保存</a>
            </div>
        </div>
    </div>
</div>

</div>


</body>
</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<%--<script src="<%=basePath%>js/jquery-labelauty.js"></script>--%>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>

    //采购类型下拉框
    $('#chargeTypeSelectBox li').on('click',function () {
        $("#chargeType").val($(this).attr("value"));
    });

    $('#saleBCurrencySelectBox li').on('click',function () {
        $("#saleBCurrency").val($(this).attr("value"));
    });

    $('#saleCCurrencySelectBox li').on('click',function () {
        $("#saleCCurrency").val($(this).attr("value"));
    });

    $('#baseCurrencySelectBox li').on('click',function () {
        $("#baseCurrency").val($(this).attr("value"));
    });

    //点击出现弹出框
    $('#cancelAdditional').on('click', function () {
        var hotelId = $("#hotelId").val();
        var hotelName = $("#hotelName").val();
        window.location.href = '<%=basePath%>admin/queryAdditionalList?hotelId='+hotelId+"&hotelName="+hotelName;
        <%--var d = dialog({--%>
            <%--title: '提示',--%>
            <%--padding: '30px 20px',--%>
            <%--width: 360,--%>
            <%--content: '<p>您确定要放弃填写吗？</p>',--%>
            <%--skin: 'saas_comfirm edit-port-dialog',--%>
            <%--cancelValue: '取消',--%>
            <%--okValue: '确定',--%>
            <%--ok: function () {--%>
                <%--window.location.href = '<%=basePath%>admin/queryAdditionalList?hotelId='+hotelId+"&hotelName="+hotelName;--%>
            <%--},--%>
            <%--cancel: function () {--%>

            <%--}--%>

        <%--}).showModal();--%>
        <%--$('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')--%>
    });

    // 保存酒店
    $('#saveAdditional').on('click', function () {

        if (notNull("chargeType","请选择杂费类型") && notNull("hotelId","请选择酒店")
                && notNull("chargeName","请输入杂费名称")){
            $("#editAdditionalForm").submit();
        }
    });

    function notNull(inputId,errorMsg){

        if ($("#"+inputId).val() == null || $("#"+inputId).val() == ""  || $("#"+inputId).val() == "-1"){
            new Tip({msg: errorMsg, timer: 1000, type:2 });
            return false;
        }
        return true;
    }

    $(function(){

        //酒店的下拉联想框
        var hotelMap = '${hotelMap}';
        initAutocomplete(hotelMap,'hotelName','hotelId');
    });


</script>