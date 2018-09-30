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
    <title>产品管理-新增价格计划</title>
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
    }
</style>

<body>
<div class="add-room-manage-wrap">
    <div class="breadcrumb">
    </div>

    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>设置上下架</h3><br/>

                <form id="setSaleStateForm" class="form-list" action="setSaleState" method="post">

                    <ul class="row">
                        <li class="list"><span>价格计划ID：</span><input type="text" id="priceplanId" readonly value="${pricePlanId}"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>价格计划名称：</span><input name="priceplanName" id="priceplanName" readonly class="text w_140 c_666 "  autocomplete="off" type="text" value="${pricePlanName}"><i class="empty iconfont icon-ArtboardCopy"></i>

                        <li class="list drop-box"><span>B2B<i class="colorYellow">*</i>：</span>
                            <input type="text" class="input-effective select-box-value" value="${saleStateResponseDTO.saleStateToBValue}">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" style="left: 120px">
                                <ul class="clearfix" id="saleB2BStateSelectBox">
                                    <li value="1">上架</li>
                                    <li value="0">下架</li>
                                </ul>
                            </div>
                        </li>

                        <li class="list drop-box"><span>Ctrip<i class="colorYellow">*</i>：</span>
                            <input type="text" class="input-effective select-box-value" value="${saleStateResponseDTO.saleStateToCtripValue}">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" style="left: 120px">
                                <ul class="clearfix" id="saleCtripStateSelectBox">
                                    <li value="1">上架</li>
                                    <li value="0">下架</li>
                                </ul>
                            </div>
                        </li>
                     </ul>

                    <input type="hidden" value="${saleStateResponseDTO.saleStateToB}" name="saleStateToB" id="saleStateToB">
                    <input type="hidden" value="${saleStateResponseDTO.saleStateToCtrip}" name="saleStateToCtrip" id="saleStateToCtrip">
                    <input type="hidden" value="${saleStateResponseDTO.stateIdToB}" name="stateIdToB" id="stateIdToB">
                    <input type="hidden" value="${saleStateResponseDTO.stateIdToCtrip}" name="stateIdToCtrip" id="stateIdToCtrip">
                </form>
            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="##" id="cancelOnSale" class="cancel">取消</a><a href="##" id="saveOnSale" class="save" >保存</a>
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

    $(function(){

        $('#saleB2BStateSelectBox li').on('click',function () {
            $("#saleStateToB").val($(this).attr("value"));
        });

        $('#saleCtripStateSelectBox li').on('click',function () {
            $("#saleStateToCtrip").val($(this).attr("value"));
        });

        //点击出现弹出框
        $('#cancelOnSale').on('click', function () {
            window.close();
        });

        // 保存酒店
        $('#saveOnSale').on('click', function () {
            setSaleState();
        });
    });

    //TODO 添加渠道时，此方法需要修改
    function setSaleState(){
        var data = {
            "pricePlanId":$("#priceplanId").val(),
            "saleStateToB":$("#saleStateToB").val(),
            "saleStateToCtrip":$("#saleStateToCtrip").val(),
            "stateIdToB":$("#stateIdToB").val(),
            "stateIdToCtrip":$("#stateIdToCtrip").val()
        }

        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/setSaleState',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 1000, type:1});
                    setTimeout("window.close()",1010);
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