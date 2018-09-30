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
    <title>产品管理-调整价格房态</title>
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

    /*控制房态的单选*/
    #roomStateSelectBox .ui-selecting { background: #acdaf5; }
    #roomStateSelectBox .ui-selected { background: #0e90d2; color: white; }
    #roomStateSelectBox { list-style-type: none; margin: 0; padding: 0; width: 600px; }
    #roomStateSelectBox li {
        margin: 3px;
        padding: 1px;
        float: left;
        width: 80px;
        height: 20px;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 6px;
        cursor: pointer;
    }

    .select-default{
        border: 1px solid #FFFFFF;
        background: #cdcdcd 50% 50% repeat-x;
    }
</style>

<body>
<div class="batchsetprice-manage-wrap">
    <div class="breadcrumb">
    </div>

    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>调整<font color="#0e90d2">${pricePlanDTO.priceplanName}</font>的价格房态条款</h3>
				<h3>房型: ${pricePlanDTO.roomTypeName}</h3>
                <form id="addPriceAndQuotaForm" class="form-list" action="addPriceAndQuota" method="post">

                    <ul class="row">

                        <tr>
                            <li class="list2">
                                <td><span style="width: 100px">日期</span></td>
                                <td>
                                    <label for="beginDate">从</label>
                                    <input style="width: 100px" type="text" id="beginDate" name="beginDate">
                                    <label for="endDate">到</label>
                                    <input style="width: 100px" type="text" id="endDate" name="endDate">
                                </td>
                            </li>
                        </tr>

                        <%--价格--%>
                        <div class="baseline"></div>
                        <tr>

                            <li class="list drop-box">
                                <td><span style="width: 100px">早餐</span></td>
                                <td><input style="width: 160px" type="text" placeholder="请选择早餐" class="input-effective select-box-value"><i style="right: 257px;" class="empty iconfont icon-ArtboardCopy"></i>
                                    <div class="form-list-drop-box" style="left: 104px">
                                        <ul class="clearfix" id="breakfastNumSelectBox">
                                            <li value="none">无早</li>
                                            <li value="one">单早</li>
                                            <li value="two">双早</li>
                                            <li value="three">三早</li>
                                            <li value="four">四早</li>
                                            <li value="bed">床位早</li>
                                        </ul>
                                    </div>
                                </td>
                                <input type="hidden" id="breakfastNum" name="breakfastNum">
                            </li>

                            <li class="list2">
                                <td><span style="width: 100px;"><input type="hidden"/> </span></td>
                                <td align="center"><span style="width: 120px;padding-left: 15px">平日</span></td>
                                <td align="center"><span style="width: 100px;padding-left: 15px">周末</span></td>
                            </li>

                            <li class="list drop-box">
                                <td><span style="width: 100px">底价</span></td>
                                <td><input style="width: 80px" name="basePriceWeekday" id="basePriceWeekday" class="text w_140 c_666 " placeholder="平日底价" autocomplete="off" type="text"><%--平日价--%></td>
                                <td><input style="width: 80px" name="basePriceWeekend" id="basePriceWeekend" class="text w_140 c_666 " placeholder="周末底价" autocomplete="off" type="text"><%--周末价--%></td>
                                <td><input style="width: 80px" name="baseCurrency" id="baseCurrency" value="${pricePlanDTO.baseCurrency}" readonly class="text w_140 c_666 " autocomplete="off" type="text"><%--周末价--%></td>
                                <%--<td><input style="width: 80px" type="text" placeholder="请选择币种" value="币种" class="input-effective select-box-value">--%>
                                    <%--<div class="form-list-drop-box"  style="left: 344px">--%>
                                        <%--<ul class="clearfix" id="baseCurrencySelectBox">--%>
                                            <%--<c:forEach items="${currencyMap}" var="currencyItem">--%>
                                                <%--<li value="${currencyItem.key}">${currencyItem.value}</li>--%>
                                            <%--</c:forEach>--%>
                                        <%--</ul>--%>
                                    <%--</div>--%>
                                <%--</td>--%>
                                <%--<input type="hidden" id="baseCurrency" name="baseCurrency">--%>
                            </li>


                            <li class="list drop-box">
                                <td><span style="width: 100px">直客价</span></td>
                                <td><input style="width: 80px" name="toCPriceWeekday" id="toCPriceWeekday" class="text w_140 c_666 " placeholder="平日直客价" autocomplete="off" type="text"></td><%--平日价--%>
                                <td><input style="width: 80px" name="toCPriceWeekend" id="toCPriceWeekend" class="text w_140 c_666 " placeholder="周末直客价" autocomplete="off" type="text"></td><%--周末价--%>
                                <td><input style="width: 80px" name="toCCurrency" id="toCCurrency" value="${pricePlanDTO.saleCCurrency}" readonly class="text w_140 c_666 " autocomplete="off" type="text"><%--周末价--%></td>
                                <%--<td><input style="width: 80px" type="text" placeholder="请选择币种" value="币种" class="input-effective select-box-value">--%>
                                    <%--<div class="form-list-drop-box" style="left: 344px">--%>
                                        <%--<ul class="clearfix" id="toCCurrencySelectBox">--%>
                                            <%--<c:forEach items="${currencyMap}" var="currencyItem">--%>
                                                <%--<li value="${currencyItem.key}">${currencyItem.value}</li>--%>
                                            <%--</c:forEach>--%>
                                        <%--</ul>--%>
                                    <%--</div>--%>
                                <%--</td>--%>
                                <%--<input type="hidden" id="toCCurrency" name="toCCurrency">--%>
                            </li>

                            <li class="list drop-box" style="width: 600px">
                                <td><span style="width: 100px">同行价</span></td>
                                <td><input style="width: 80px" name="toBPriceWeekday" id="toBPriceWeekday" class="text w_140 c_666 " placeholder="平日同行价" autocomplete="off" type="text"></td><%--平日价--%>
                                <td><input style="width: 80px" name="toBPriceWeekend" id="toBPriceWeekend" class="text w_140 c_666 " placeholder="周末同行价" autocomplete="off" type="text"></td><%--周末价--%>
                                <td><input style="width: 80px" name="toBCurrency" id="toBCurrency" value="${pricePlanDTO.saleBCurrency}" readonly class="text w_140 c_666 " autocomplete="off" type="text"><%--周末价--%></td>
                                <%--<td><input style="width: 80px" type="text" placeholder="请选择币种" value="币种" class="input-effective select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i>--%>
                                    <%--<div class="form-list-drop-box"  style="left: 344px">--%>
                                        <%--<ul class="clearfix" id="toBCurrencySelectBox">--%>
                                            <%--<c:forEach items="${currencyMap}" var="currencyItem">--%>
                                                <%--<li value="${currencyItem.key}">${currencyItem.value}</li>--%>
                                            <%--</c:forEach>--%>
                                        <%--</ul>--%>
                                    <%--</div>--%>

                                <%--</td>--%>
                                <%--<input type="hidden" id="toBCurrency" name="toBCurrency">--%>
                            </li>
                            <li class="list2">
                                <input style="width: 20px" type="checkbox" value="true" id="differentSetPrice"/><span style="width: 150px">单独设置各渠道售价</span>
                            </li>
                            <li class="list2">
                                <td><span style="width: 100px">B2B</span></td>
                                <td><input style="width: 80px" name="B2BPriceWeekday" id="B2BPriceWeekday" class="text w_140 c_666 sale_price" placeholder="平日同行价" autocomplete="off" type="text"></td><%--平日价--%>
                                <td><input style="width: 80px" name="B2BPriceWeekend" id="B2BPriceWeekend" class="text w_140 c_666 sale_price" placeholder="周末同行价" autocomplete="off" type="text"></td><%--周末价--%>
                            </li>

                            <li class="list2">
                                <td><span style="width: 100px">携程</span></td>
                                <td><input style="width: 80px" name="ctripPriceWeekday" id="ctripPriceWeekday" class="text w_140 c_666 sale_price" placeholder="平日携程价" autocomplete="off" type="text"></td><%--平日价--%>
                                <td><input style="width: 80px" name="ctripPriceWeekend" id="ctripPriceWeekend" class="text w_140 c_666 sale_price" placeholder="周末携程价" autocomplete="off" type="text"></td><%--周末价--%>
                            </li>

                            <li class="list2">
                                <td><span style="width: 100px">淘宝</span></td>
                                <td><input style="width: 80px"  name="taobaoPriceWeekday" id="taobaoPriceWeekday" class="text w_140 c_666 sale_price" placeholder="平日淘宝价" autocomplete="off" type="text"></td><%--平日价--%>
                                <td><input style="width: 80px"  name="taobaoPriceWeekend" id="taobaoPriceWeekend" class="text w_140 c_666 sale_price" placeholder="周末淘宝价" autocomplete="off" type="text"></td><%--周末价--%>
                            </li>
                        </tr>
                            <%--房态--%>
                            <div class="baseline"></div>
                            <%--<li class="list drop-box"><span>此房型已设置过房态，直接共享？</span>--%>
                                <%--<select id="shareRoomStatus" name="shareRoomStatus" style="border-width: 1px;padding-left:5px;padding-right:8px;padding-top:10px;padding-bottom:10px;">--%>
                                    <%--<option value="true">共享</option>--%>
                                    <%--<option value="false">我要单独设置</option>--%>
                                <%--</select>--%>
                                <%--<input type="text" placeholder="请选择酒店" name="hotelName" id="hotelName" value="${pricePlanDTO.hotelPO.hotelName}" class="input-effective">--%>
                                <%--<i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>--%>
                                <%--<input type="hidden" id="hotelId" name="hotelId" value="${pricePlanDTO.hotelPO.hotelId}" />--%>
                            <%--</li>--%>
                        <%--<c:choose>--%>
                            <c:if test="${not empty quotaAccountList}">
                                <li class="list2">
                                    <span style="width: 480px;color:#FF0932;">此房型部分日期已设置过房态和配额了，如果再设置将会覆盖</span>
                                    <input type="hidden" id="accountId" name="accountId" value="${quotaAccountList[0].accountId}">
                                </li>
                            </c:if>
                            <%--没有配额账号--%>
                            <%--<c:when test="${empty quotaAccountList}">--%>
                                <table><tr>
                                    <td><span style="width: 100px">设置房态</span></td>
                                    <td>
                                        <ul id="roomStateSelectBox">
                                            <li class="select-default" data-room-state="hasNotOver">有房不可超</li>
                                            <li class="select-default" data-room-state="hasOver">有房可超</li>
                                            <li class="select-default" data-room-state="ask">待查</li>
                                            <li class="select-default" data-room-state="noRoom">满房</li>
                                            <li class="select-default" data-room-state="freeSale">FreeSale</li>
                                        </ul>
                                    </td>
                                    <input type="hidden" id="roomState" name="roomState">
                                </tr>
                                </table>

                                <li class="list2">
                                    <td><span style="width: 100px">在售配额增加</span></td>
                                    <td><input style="width: 80px"  name="quotaNum" id="quotaNum" class="text w_140 c_666" placeholder="在售配额数" autocomplete="off" type="text"></td>

                                </li>

                                <%--<li class="list drop-box">--%>
                                    <%--<select id="setQuotaType" name="setQuotaType" style="border-width: 1px;padding-left:5px;padding-right:8px;padding-top:10px;padding-bottom:10px;">--%>
                                        <%--<option value="setQuotaNum">可售配额</option>--%>
                                        <%--<option value="setDetQuotaNum">扣留配额</option>--%>
                                    <%--</select>--%>

                                    <%--&lt;%&ndash;<input style="width: 80px" type="text" placeholder="调整类型" value="调整类型" class="input-effective select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>&ndash;%&gt;--%>
                                    <%--&lt;%&ndash;<div class="form-list-drop-box" style="left: 102px;width: 120px">&ndash;%&gt;--%>
                                        <%--&lt;%&ndash;<ul class="clearfix" id="quotaNumTypeSelectBox">&ndash;%&gt;--%>
                                            <%--&lt;%&ndash;<li value="add">增加</li>&ndash;%&gt;--%>
                                            <%--&lt;%&ndash;<li value="sub">减少</li>&ndash;%&gt;--%>
                                            <%--&lt;%&ndash;<li value="set">设置为</li>&ndash;%&gt;--%>
                                        <%--&lt;%&ndash;</ul>&ndash;%&gt;--%>
                                    <%--&lt;%&ndash;</div>&ndash;%&gt;--%>
                                    <%--<input style="width: 80px"  name="quotaNum" id="quotaNum" class="text w_140 c_666 " placeholder="配额数" autocomplete="off" type="text">--%>
                                <%--</li>--%>
                            <%--</c:when>--%>

                        <%--</c:choose>--%>

                            <%--条款--%>
                            <div class="baseline"></div>
                            <tr>
                            <li class="list2">
                                <td><span style="width: 100px">预订条款</span></td>
                                <td><span style="width: 40px">提前</span><input style="width: 30px" name="bookDays" id="bookDays" class="text w_140 c_666 " autocomplete="off" type="text"><span style="width: 30px">天</span>
                                    <input style="width: 80px" name="bookTime" id="bookTime" placeholder="输入1-23" class="text w_140 c_666 " autocomplete="off" type="text"><span style="width: 80px">点前预订</span></td>
                            </li>

                            <%--<table><tr> 客户想要建完产品之后就是默认此条款--%>
                                <%--<td><span style="width: 100px">取消条款</span></td>--%>
                                <%--<td>--%>
                                    <%--<ul id="cancelRestrictSelectBox">--%>
                                        <%--<li class="select-default" data-room-state="noCancel">一经预订不可取消</li>--%>
                                    <%--</ul>--%>
                                <%--</td>--%>
                            <%--</tr>--%>
                            <%--</table>--%>

                            <li class="list2">
                                <td><span style="width: 100px">间数条款</span></td>
                                <td><input style="width: 80px" name="bookRooms" id="bookRooms" class="text w_140 c_666 " autocomplete="off" type="text"><span style="width: 80px">间起订</span></td>
                           </li>

                            <li class="list2">
                                <td><span style="width: 100px">连住条款</span></td>
                                <td><span>连住</span><input style="width: 80px"  name="occupancyDays" id="occupancyDays" class="text w_140 c_666 " autocomplete="off" type="text"><span>天</span></td>
                            </li>
                        </tr>

                     </ul>

                    <%--在售配额调整类型--%>
                    <input type="hidden" id="quotaNumType" name="quotaNumType"  />
                    <input type="hidden" id="hotelId" name="hotelId" value="${pricePlanDTO.hotelId}">
                    <input type="hidden" id="roomTypeId" name="roomTypeId" value="${pricePlanDTO.roomTypeId}">
                    <input type="hidden" id="pricePlanId" name="pricePlanId" value="${pricePlanDTO.priceplanId}">
                    <input type="hidden" id="priceplanName" name="pricePlanName" value="${pricePlanDTO.priceplanName}" />
                    <input type="hidden" id="roomTypeName" name="pricePlanId" value="${pricePlanDTO.roomTypeName}" />
                    <input type="hidden" id="hotelName" name="hotelName" value="${pricePlanDTO.hotelName}" />
                    <input type="hidden" id="sameSalePrice" name="sameSalePrice" value="true"/>
                    <input type="hidden" id="pageFrom" name="pageFrom" value="${pageFrom}"/>
                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="##" id="cancelPriceAndQuota" class="cancel">返回</a><a href="##" id="savePriceAndQuota" class="save" >保存</a>
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
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script>

    //点击出现弹出框
    $('#cancelPriceAndQuota').on('click', function () {
        window.close();
        <%--var hotelId = $("#hotelId").val();--%>
        <%--var hotelName = $("#hotelName").val();--%>
        <%--var d = dialog({--%>
            <%--title: '提示',--%>
            <%--padding: '30px 20px',--%>
            <%--width: 310,--%>
            <%--content: '<p>您确定要放弃填写吗？</p>',--%>
            <%--skin: 'saas_comfirm edit-port-dialog',--%>
            <%--cancelValue: '取消',--%>
            <%--okValue: '确定',--%>
            <%--ok: function () {--%>
                <%--window.location.href = '<%=basePath%>admin/queryPricePlanList?hotelId='+hotelId+"&hotelName="+hotelName;--%>
            <%--},--%>
            <%--cancel: function () {--%>

            <%--}--%>

        <%--}).showModal();--%>
        <%--$('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')--%>
    });

    $("#differentSetPrice").click(function () {
        //不同设置
        if ($('#differentSetPrice').is(':checked')) {
            $(".sale_price").attr("disabled",false);
            $("#sameSalePrice").val("false");
        } else {
            //相同设置
            $(".sale_price").attr("disabled",true);
            $("#sameSalePrice").val("true");
        }
    });

    // 保存酒店
    $('#savePriceAndQuota').on('click', function () {

        console.log("savePriceAndQuota");
        if(!(notNull("beginDate") && notNull("endDate"))){
            new Tip({msg: "日期不能空", timer: 1000, type:2 });
            return false;
        }

        //底价不空，则底价币种必填
        if ((notNull("basePriceWeekday") || notNull("basePriceWeekend")) && !notNull("baseCurrency")){
            new Tip({msg: "底价币种不能空", timer: 1000, type:2 });
            return false;
        }

        if ((notNull("toCPriceWeekday") || notNull("toCPriceWeekend")) && !notNull("toCCurrency")){
            new Tip({msg: "直客价币种不能空", timer: 1000, type:2 });
            return false;
        }

        if ("true" == $("#sameSalePrice").val()){
            if ((notNull("toBPriceWeekday") || notNull("toBPriceWeekend")) && !notNull("toBCurrency")){
                new Tip({msg: "同行价币种不能空", timer: 1000, type:2 });
                return false;
            }
        } else{
            if ((notNull("B2BPriceWeekday") || notNull("B2BPriceWeekend")
                || notNull("ctripPriceWeekday") || notNull("ctripPriceWeekend")
                    || notNull("taobaoPriceWeekday") || notNull("taobaoPriceWeekend")) && !notNull("toBCurrency")){
                new Tip({msg: "同行价币种不能空", timer: 1000, type:2 });
                return false;
            }
        }

//        //如果配额账户不为空，且又没有设置配额和房态
//        $("#addPriceAndQuotaForm").submit();

        var data={
            "beginDate":$("#beginDate").val(),
            "endDate":$("#endDate").val(),
            "breakfastNum":$("#breakfastNum").val(),
            "basePriceWeekday":$("#basePriceWeekday").val(),
            "basePriceWeekend":$("#basePriceWeekend").val(),
            "baseCurrency":$("#baseCurrency").val(),
            "toCPriceWeekday":$("#toCPriceWeekday").val(),
            "toCPriceWeekend":$("#toCPriceWeekend").val(),
            "toCCurrency":$("#toCCurrency").val(),
            "toBPriceWeekday":$("#toBPriceWeekday").val(),
            "toBPriceWeekend":$("#toBPriceWeekend").val(),
            "toBCurrency":$("#toBCurrency").val(),
            "B2BPriceWeekday":$("#B2BPriceWeekday").val(),
            "B2BPriceWeekend":$("#B2BPriceWeekend").val(),
            "ctripPriceWeekday":$("#ctripPriceWeekday").val(),
            "ctripPriceWeekend":$("#ctripPriceWeekend").val(),
            "taobaoPriceWeekday":$("#taobaoPriceWeekday").val(),
            "taobaoPriceWeekend":$("#taobaoPriceWeekend").val(),
            "accountId":$("#accountId").val(),
            "roomState":$("#roomState").val(),
            "quotaNum":$("#quotaNum").val(),
            "bookDays":$("#bookDays").val(),
            "bookTime":$("#bookTime").val(),
            "bookRooms":$("#bookRooms").val(),
            "occupancyDays":$("#occupancyDays").val(),
            "hotelId":$("#hotelId").val(),
            "roomTypeId":$("#roomTypeId").val(),
            "pricePlanId":$("#pricePlanId").val(),
            "priceplanName":$("#priceplanName").val(),
            "roomTypeName":$("#roomTypeName").val(),
            "hotelName":$("#hotelName").val(),
            "sameSalePrice":$("#sameSalePrice").val(),
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/addPriceAndQuotaJSON',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    if($("#pageFrom").val() == "list"){
                        //如果是价格计划的列表页，点击调价进入的。则就将弹出框关闭
                        setTimeout("window.close()",1010);
                    } else{
                        window.location.href = '<%=basePath%>admin/queryPricePlanList?hotelId='+$("#hotelId").val()+"&hotelName="+$("#hotelName").val();
                    }
                } else {
                    new Tip({ msg: "设置失败",timer: 3000, type:2});
                }
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                new Tip({ msg: '系统异常',timer: 1000, type:2});
            }
        });

    });

    function notNull(inputId){

        if ($("#"+inputId).val() == null || $("#"+inputId).val() == ""){
            return false;
        }
        return true;
    }

    $(function(){

        //初始设置，统一设置各渠道售价
        $(".sale_price").attr("disabled",true);

        //房态
        $( "#roomStateSelectBox" ).selectable({
            selected: function() {
                //点击一次选中，再点击一次取消选中
                var oldValue = $("#roomState").val();
                var newValue = $( ".ui-selected").data("room-state");
                if (oldValue == newValue){
                    $( ".ui-selected").removeClass("ui-selected");
                    $("#roomState").val("");
                }else{
                    $("#roomState").val($( ".ui-selected").data("room-state"));
                }
            }
        });

        //在售配额的调整类型（新增，减少，设置）
        $("#quotaNumTypeSelectBox li").on('click',function (){
            $("#quotaNumType").val($(this).attr("value"));
        });

//        //扣留配额调整类型
//        $("#holdQuotaNumTypeSelectBox li").on('click',function (){
//            $("#holdQuotaNumType").val($(this).attr("value"));
//        });

        //早餐类型
        $("#breakfastNumSelectBox li").on('click',function (){
            $("#breakfastNum").val($(this).attr("value"));
        });

//        $("#baseCurrencySelectBox li").on('click',function (){
//            $("#baseCurrency").val($(this).attr("value"));
//        });
//
//        $("#toCCurrencySelectBox li").on('click',function (){
//            $("#toCCurrency").val($(this).attr("value"));
//        });
//
//        $("#toBCurrencySelectBox li").on('click',function (){
//            $("#toBCurrency").val($(this).attr("value"));
//        });




        $( "#beginDate" ).datepicker({
//            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            yearRange:"2017:2028",
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( "#endDate" ).datepicker( "option", "minDate", selectedDate );
            }
        });
        $( "#endDate" ).datepicker({
//            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            yearRange:"2017:2028",
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( "#beginDate" ).datepicker( "option", "maxDate", selectedDate );
            }
        });

    });


</script>