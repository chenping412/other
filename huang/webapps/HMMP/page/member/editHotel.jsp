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
    <title>平台运营-角色管理-新增角色</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
</head>
<style>
    .edit-port-dialog {
        height: 195px;
    }
</style>

<body>

<div class="add-hotel-manage-wrap">
    <div class="breadcrumb">
    </div>

    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>编辑酒店</h3>

                <form id="editHotelForm" class="form-list" action="updateBaseHotel" method="post">
                    <ul class="row">
                        <li class="list"><span>酒店ID：</span><input type="text" placeholder="请输入酒店ID" value="${hotelPO.hotelId}" disabled="disabled"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>酒店名称<i class="colorYellow">*</i>：</span><input value="${hotelPO.hotelName}" name="hotelName" id="hotelName" class="text w_140 c_666 " placeholder="请输入酒店名称" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>
                        <li class="list drop-box"><span>城市<i class="colorYellow">*</i>：</span><input type="text" placeholder="请选择酒店城市" value="${hotelPO.cityName}" class="input-effective select-box-value">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box"  style="left: 146px">
                                <ul class="clearfix" id="citySelectBox">
                                    <c:forEach items="${cityMap}" var="cityItem">
                                        <li value="${cityItem.key}">${cityItem.value}</li>
                                    </c:forEach>
                                </ul>
                            </div>
                        </li>

                        <li class="list drop-box"><span>供应商<i class="colorYellow">*</i>：</span>
                            <input type="text" placeholder="请选择供应商" name="supplyName" id="supplyName" value="${hotelPO.supplyName}" class="input-effective">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <input type="hidden" id="supplyCode" name="supplyCode" value="${hotelPO.supplyCode}" />
                        </li>

                        <li class="list drop-box"><span>酒店星级：</span><input type="text" placeholder="请选择酒店星级" value="${hotelPO.starName}" class="input-effective select-box-value">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box"  style="left: 146px">
                                <ul class="clearfix" id="starSelectBox" >

                                    <c:forEach items="${starMap}" var="starItem">
                                        <li value="${starItem.key}">${starItem.value}</li>
                                    </c:forEach>
                                </ul>
                            </div>
                        </li>

                        <li class="list drop-box"><span>能否预留房：</span><input type="text" value="${hotelPO.preHoldQuotaName}" class="input-effective select-box-value">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box"  style="left: 146px">
                                <ul class="clearfix" id="preHoldQuotaSelectBox">
                                    <li value="1">是</li>
                                    <li value="0">否</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list"><span>结算方式<i
                                class="colorYellow">*</i> ：
							</span> <input type="text" id="settlementText" name="settlementText"
                                           value="${hotelPO.settlementText}" readonly class="input-effective needborder select-box-value"
                                           placeholder="请选择结算方式"></i><i
                                class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box"  style="left: 149px" id="settlementBox">
                                <ul class="clearfix">
                                    <li value="monthly">月结</li>
                                    <li value="halfmonthly">半月结</li>
                                    <li value="weekly">周结</li>
                                    <li value="single">单结</li>
                                </ul>
                            </div></li>

                        <li class="list"><span>联系人<i class="colorYellow">*</i>
									：
							</span><input type="text" autocomplete="off" id="contacts"
                                          name="contacts" value="${hotelPO.contacts}" placeholder="请输入联系人"><i
                                class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>传真号码 ：</span><input type="text"
                                                                   autocomplete="off" id="fax" name="fax" value="${hotelPO.fax}"
                                                                   placeholder="请输入传真号码"><i
                                class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>酒店电话：</span><input value="${hotelPO.tel}" name="tel" id="tel" class="text w_140 c_666 " placeholder="请输入酒店电话" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>
                        <li class="list"><span>酒店邮箱：</span><input value="${hotelPO.email}"  name="email" id="email" class="text w_140 c_666 " placeholder="请输入酒店邮箱" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>
                        <li class="list"><span>酒店扣税：</span><input value="${hotelPO.rebateTax}" name="rebateTax" id="rebateTax" class="text w_140 c_666 " placeholder="请输入酒店返佣扣税的税率" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>%
                        <li class="list"><span>扣客户税：</span><input value="${hotelPO.customerRebateTax}" name="customerRebateTax" id="customerRebateTax" class="text w_140 c_666 " placeholder="请输入酒店返佣扣税的税率" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>%
                        <li class="list drop-box">
                            <span >加床：<i class="colorYellow"></i></span>
                            <input style="width: 85px" name="bedSalePrice" id="bedSalePrice" class="text w_140 c_666 " value="${hotelPO.bedSalePrice}" placeholder="请输入价格" autocomplete="off" type="text">元/张
                            <input style="width: 120px" type="text" placeholder="请选择币种" class="input-effective select-box-value" value="${hotelPO.bedSaleCurrency}" />
                            <div class="form-list-drop-box"  style="width:153px; left: 307px;">
                                <ul class="clearfix" id="bedCurrencySelectBox">
                                <c:forEach items="${currencyMap}" var="currencyItem">
                                <li value="${currencyItem.key}">${currencyItem.value}</li>
                                </c:forEach>
                                </ul>
                            </div>
                        </li>
                        <li class="list drop-box">
                            <span >加早：<i class="colorYellow"></i></span>
                            <input style="width: 85px" name="breakfastSalePrice" id="breakfastSalePrice" value="${hotelPO.breakfastSalePrice}" class="text w_140 c_666 " placeholder="请输入价格" autocomplete="off" type="text">元/份
                            <input style="width: 120px" type="text" placeholder="请选择币种" class="input-effective select-box-value" value="${hotelPO.breakfastSaleCurrency}" />
                            <div class="form-list-drop-box"  style="width:153px; left: 307px;">
                                <ul class="clearfix" id="breakfastCurrencySelectBox">
                                <c:forEach items="${currencyMap}" var="currencyItem">
                                <li value="${currencyItem.key}">${currencyItem.value}</li>
                                </c:forEach>
                                </ul>
                            </div>
                        </li>
                        <li class="list"><span>酒店地址：</span><input value="${hotelPO.address}"  name="address" id="hotelAddress" class="text w_140 c_666 " placeholder="请输入酒店地址" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i>
                        <li class="list need-edit big-input-edit"><span>酒店简介：</span><textarea name="introduction" id="introduction" class="text w_140 c_666 " placeholder="请输入酒店简介" autocomplete="off" type="textArea">${hotelPO.introduction}</textarea><i class="empty iconfont icon-ArtboardCopy"></i>

                    </ul>

                    <input type="hidden" id="cityCode" name="cityCode" value="${hotelPO.cityCode}"></li>
                    <input type="hidden" id="hotelStar" name="star" value="${hotelPO.star}">
                    <input type="hidden" value="${hotelPO.hotelId}"  id="hotelId" name="hotelId">
                    <input type="hidden" id="preHoldQuota" name="preHoldQuota" value="${hotelPO.preHoldQuota}">
                    <input type="hidden" id="relationId" name="relationId" value="${hotelPO.relationId}" />
                    <input type="hidden" id="settlement" name="settlement" value="${hotelPO.settlement}" />
                    <input type="hidden" id="bedSaleCurrency" name="bedSaleCurrency" value="${hotelPO.bedSaleCurrency}" />
                    <input type="hidden" id="breakfastSaleCurrency" name="breakfastSaleCurrency" value="${hotelPO.breakfastSaleCurrency}" />
                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="##" id="cancelHotel" class="cancel">返回</a><a href="##" id="saveHotel" class="save" >保存</a>
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
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>

<script>

    $(function(){
        initSupplyAutocomplete();
    });

    //点击出现弹出框
    $('#cancelHotel').on('click', function () {
        window.location.href = '<%=basePath%>admin/queryBaseHotelList'
    })

    //星级下拉框
    $('#starSelectBox li').on('click', function () {
        $("#hotelStar").val($(this).attr("value"));
    });

    //城市下拉框
    $('#citySelectBox li').on('click',function () {
        $("#cityCode").val($(this).attr("value"));
    });

    //能否预留房下拉框
    $('#preHoldQuotaSelectBox li').on('click', function () {
        $("#preHoldQuota").val($(this).attr("value"));
    });
    
    $('#bedCurrencySelectBox li').on('click',function () {
        $("#bedSaleCurrency").val($(this).attr("value"));
    });

    $('#breakfastCurrencySelectBox li').on('click',function () {
        $("#breakfastSaleCurrency").val($(this).attr("value"));
    });

    var firstClick = true;
    // 保存酒店
    $('#saveHotel').on('click', function () {
        var hotelName = $("#hotelName").val();
        var cityCode = $("#cityCode").val();
        var supplyCode = $("#supplyCode").val();

        if(null == hotelName || '' == hotelName){
            new Tip({msg: "酒店名称为空", timer: 1000, type:2 });
            return;
        }
        if(null == cityCode || '' == cityCode){
            new Tip({msg: "城市编码为空，请重新选择城市", timer: 1000, type:2 });
            return;
        }

        if( true == $("#supplyExist").is(":checked") && (null == supplyCode || '' == supplyCode)){
            new Tip({msg: "供应商不能空", timer: 1000, type:2 });
            return;
        }

        if (firstClick == true){
            firstClick = false;
            $("#editHotelForm").submit();
        }
    });
</script>