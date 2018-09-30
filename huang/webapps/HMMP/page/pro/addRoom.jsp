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
    <title>产品管理-新增房型</title>
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
                <h3>新增房型</h3>
                <br/>

                <form id="addRoomForm" class="form-list" action="addRoom" method="post">

                    <ul class="row">
                        <%--<li class="list"><span>房型ID：</span><input type="text" placeholder="请输入房型ID" value="${roomTypeId}" disabled="disabled"><i class="empty iconfont icon-ArtboardCopy"></i></li>--%>

                        <li class="list drop-box"><span>酒店<i class="colorYellow">*</i>：</span>
                            <input type="text" placeholder="请选择酒店" id="project" value="${roomPO.hotelName}" name="hotelName" class="input-effective">
                            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
                            <input type="hidden" id="project-id" name="hotelId" value="${roomPO.hotelId}" />

                        </li>
                        <li class="list"><span>房型名称<i class="colorYellow">*</i>：</span><input name="roomName" id="roomName" class="text w_140 c_666 " placeholder="请输入房型名称" autocomplete="off" type="text"><i class="empty iconfont icon-ArtboardCopy"></i></li>

                    <table>
                        <tr>
                            <td><span style="width: 120px">床型</span></td>
                            <td>
                                <ul class="dowebok" style="list-style-type: none;" id="bedSelectBox">

                                    <c:forEach items="${bedTypeMap}" var="bedTypeItem">
                                        <li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="${bedTypeItem.key}" data-labelauty="${bedTypeItem.value}"></li>
                                    </c:forEach>
                                    <%--<li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="10" data-labelauty="大床"></li>--%>
                                    <%--<li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="20" data-labelauty="双床"></li>--%>
                                    <%--<li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="30" data-labelauty="三床"></li>--%>
                                    <%--<li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="40" data-labelauty="四床"></li>--%>
                                    <%--<li style="margin: 1px 0;display: inline-block;"><input type="checkbox" name="bedType" value="99" data-labelauty="其他"></li>--%>
                                </ul>
                            </td>
                        </tr>
                        <tr></tr>
                    </table>
                    <br/>
                    <%--<input id="roomTypeId" name="roomTypeId" value="${roomTypeId}" type="hidden">--%>
                    <%--<input id="hotelId" name="hotelId" value="${roomPO.hotelId}" type="hidden">--%>

                    <li class="list"><span>房型描述：</span><textarea  name="descp" id="descp" class="text w_140 c_666 " placeholder="对床型尺寸、楼层的等描述信息" autocomplete="off" type="text"></textarea></li>
                    </ul>
                    <input id="bedTypeList" name="bedTypeList" value="" type="hidden">
                </form>

            </div>
        </div>
        <div class="baseline" style="margin-top: 100px;"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="##" id="cancelRoom" class="cancel">返回</a><a href="##" id="saveRoom" class="save" >保存</a>
            </div>
        </div>
    </div>
</div>

</div>


</body>
</html>

<script src="<%=basePath%>js/jquery-1.8.3.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-labelauty.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script>
    //点击出现弹出框
    $('#cancelRoom').on('click', function () {
        var hotelId = $("#project-id").val();
        var hotelName = $("#project").val();
        window.location.href = '<%=basePath%>admin/queryRoomList?hotelId='+hotelId+"&hotelName="+hotelName;
        <%--var d = dialog({--%>
                <%--title: '提示',--%>
                <%--padding: '30px 20px',--%>
                <%--width: 310,--%>
                <%--content: '<p>您确定要放弃填写吗？</p>',--%>
                <%--skin: 'saas_comfirm edit-port-dialog',--%>
                <%--cancelValue: '取消',--%>
                <%--okValue: '确定',--%>
                <%--ok: function () {--%>
                    <%--window.location.href = '<%=basePath%>admin/queryRoomList?hotelId='+hotelId+"&hotelName="+hotelName;--%>
                <%--},--%>
                <%--cancel: function () {--%>

                <%--}--%>

        <%--}).showModal();--%>
//        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    })

//    $('#hotelSelectBox li').on('click',function () {
//        $("#hotelId").val($(this).attr("value"));
//    });

    var firstClick = true;
    // 保存酒店
    $('#saveRoom').on('click', function () {
        var roomName = $("#roomName").val();

        if(null == roomName || '' == roomName){
            new Tip({msg: "房型名称为空", timer: 1000, type:2 });
            return;
        }

        if (firstClick == true){
            firstClick = false;
            $("#addRoomForm").submit();
        }
    });


    $(function(){

        //床型的多选框
        $(':input').labelauty();

        //酒店的下拉联想框
        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
    });
</script>