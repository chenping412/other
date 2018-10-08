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
    <meta http-equiv="Pragma" content="no-cache"> 
	<meta http-equiv="Cache-Control" content="no-cache"> 
	<meta http-equiv="Expires" content="-1">
    <title>我的房型</title>

    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">

    <link rel="stylesheet" href="<%=basePath%>css/jquery-labelauty.css">
</head>
<style>
.addbtn {
    display: block;
    color: #fff;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #009BF1;
    border-radius: 3px;
    width: 90px;
    padding: 0 10px;
}

.room_bottom {
    height: 60px;
    border-top: 1px solid #edeff2;
    background: #f7f9fb;
    text-align: center;
    width: 97%;
    position: fixed;
    bottom: 0;
    margin: 0 auto;
    box-shadow: 0 -2px 3px #f0f3f6;
}
.list-ellipsis {
    overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
<body>

<div class="roomcontrol-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">控房管理</a>
    </div>
    <div class="main-content">
            <shiro:hasPermission name="product:controlRoom:query">
            <form id="roomControlForm" action="queryRoomControlList" method="post">
                <div class="filter-bar" style="height: 100px;line-height: 58px">
<!--                 <input type="hidden" id="totalCount" name="pgSupport.totalCount" -->
<%--                        value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>"> --%>
<!--                 <input type="hidden" id="totalPage" name="pgSupport.totalPages" -->
<%--                        value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>"> --%>

<%--                 <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty roomControlRequestDTO.currentPage}'>1</c:when><c:otherwise>${roomControlRequestDTO.currentPage}</c:otherwise></c:choose>" /> --%>
<%--                 <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty roomControlRequestDTO.pageSize}'>5</c:when><c:otherwise>${roomControlRequestDTO.pageSize}</c:otherwise></c:choose>" /> --%>
                <ul>
                    <li class="filter-bar-list"><span class="filter-bar-list-title">供应商</span>
                        <input type="text" placeholder="请选择供应商" name="supplyName" id="supplyName" value="${roomControlRequestDTO.supplyName}" autocomplete="off" class="text w_140 c_666 ">
                        <%--<i class="iconfont  icon-downTriangle"></i>--%>
                        <i class="empty iconfont icon-ArtboardCopy"></i>
                    </li>
                    <li class="filter-bar-list"><span class="filter-bar-list-title">酒店</span>
                        <input type="text" placeholder="请选择酒店" name="hotelName" id="hotelName" value="${roomControlRequestDTO.hotelName}" autocomplete="off" class="text w_140 c_666 "><i class="empty iconfont icon-ArtboardCopy"></i>
                        <%--<i class="iconfont  icon-downTriangle"></i>--%>
                        <i class="empty iconfont icon-ArtboardCopy"></i>
                    </li>

                    <li class="filter-bar-list"><span class="filter-bar-list-title">开始日期</span>
                        <input type="text"  name="beginDate" id="beginDate" value="${roomControlRequestDTO.beginDate}" class="text w_140 c_666 ">
                        <%--<i class="iconfont  icon-downTriangle"></i>--%>
                    </li>

                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">结束日期</span>
                        <input type="text"  name="endDate" id="endDate" value="${roomControlRequestDTO.endDate}" class="text w_140 c_666 ">
                        <%--<i class="iconfont  icon-downTriangle"></i>--%>
                    </li>

                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">状态:</span>
                        <input id="isActiveName" name="isActiveName" type="text" placeholder="不限" readonly value="${roomControlRequestDTO.isActiveName}"/>
                        <div class="filter-bar-drop-box">
                            <ul class="clearfix"  id="activeSelectBox">
                                <li value="">不限</li>
                                <li value="1">有效</li>
                                <li value="0">无效</li>
                            </ul>
                        </div>
                    </li>
					<li class="filter-bar-list"><span class="filter-bar-list-title">房型</span>
                        <input type="text" placeholder="请选择房型" name="roomTypeName" id="roomTypeName" value="${roomControlRequestDTO.roomTypeName}" autocomplete="off" class="text w_140 c_666 ">
                        <%--<i class="iconfont  icon-downTriangle"></i>--%>
                        <i class="empty iconfont icon-ArtboardCopy"></i>
                    </li>
                    <li style="font-size: 14px">
                        	包房类型:
                        <c:forEach items="${quotaTypeMap}" var="quotaTypeItem">
                            <c:choose>
                                <c:when test="${fn:contains(roomControlRequestDTO.quotaTypeList,quotaTypeItem.key)}">
                                    <input checked type="checkbox" name="quotaTypeList" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑'; font-size: 18px" value="${quotaTypeItem.key}">${quotaTypeItem.value}</input>
                                </c:when>
                                <c:otherwise>
                                    <input type="checkbox" name="quotaTypeList" style="width: 20px; height: 14px;padding-left: 0px;padding-right: 0px;outline: none;border: 1px solid rgba(218, 223, 226, 1);margin-right: 0px;font-family: '微软雅黑';font-size: 18px" value="${quotaTypeItem.key}">${quotaTypeItem.value}</input>
                                </c:otherwise>
                            </c:choose>
                        </c:forEach>
                    </li>
                     <br/>

                    <li style="margin-left:28px;">
                        <a class="search-btn" href="javascript:queryRoomTypeList(1);"><i class="iconfont icon-search"></i></a>
                    </li>
                    <li style="margin-left:112px;">
						<a href="javascript:void(0);" class="addbtn" style="color:#fff;">批量保存</a>
					</li>
                </ul>
                </div>
                <input type="hidden" id="hotelId" name="hotelId" value="${roomControlRequestDTO.hotelId}" />
                <input type="hidden" id="supplyCode" name="supplyCode" value="${roomControlRequestDTO.supplyCode}" />
                <input type="hidden" id="roomTypeId" name="roomTypeId" value="${roomControlRequestDTO.roomTypeId}" />
                <input type="hidden" id="pricePlanId" name="pricePlanId" value="${roomControlRequestDTO.pricePlanId}" />
                <input type="hidden" name="isActive" id="isActive" value="${roomControlRequestDTO.isActive}">
            </form>
            </shiro:hasPermission>
        <div class="baseline"></div>
            <div class="table-list" >
                <div class="table-list-header" style="width:100%">
                    <ul class="clearfix">
                        <li style="width: 2%"><input type="checkbox" name="chkAll" /></li>
                        <li style="width: 10%">酒店</li>
                        <li style="width: 10%">供应商</li>
                        <li style="width: 10%">房型</li>
                        <li style="width: 6%">日期</li>
                        <li style="width: 6%">类型</li>
                        <li style="width: 6%">底价</li>
                        <li style="width: 6%">同行价</li>
                        <li style="width: 6%">携程价</li>
                        <li style="width: 6%">总库存</li>
                        <li style="width: 4%">已售数</li>
                        <li style="width: 4%">在售数</li>
                        <li style="width: 5%">扣留数</li>
                        <li style="width: 4%">预留数</li>
                        <li style="width: 5%">允许预留</li>
                        <li style="width: 5%">是否有效</li>
                        <li style="width: 4%">操作</li>
                    </ul>
                </div>
                <div class="table-list-content clearfix" style="width:100%">
                    <c:if test="${not empty recordList}">
                        <c:forEach items="${recordList}" var="dayRoomControl" varStatus="status">
                            <ul class="row clearfix">
                                <li style="width: 2%">
                                	<input type="checkbox" name="chk" value="" />
                                	<input type="hidden" name="saleDate" value="${dayRoomControl.saleDateStr}" />
                                	<input type="hidden" name="hotelId" value="${dayRoomControl.hotelId}" />
                                	<input type="hidden" name="pricePlanId" value="${dayRoomControl.pricePlanId}" />
                                	<input type="hidden" name="priceId" value="${dayRoomControl.priceId}" />
                                	<input type="hidden" name="roomTypeId" value="${dayRoomControl.roomTypeId}" />
                                	<input type="hidden" name="accouontId" value="${dayRoomControl.accouontId}" />
                                	<input type="hidden" name="quotaId" value="${dayRoomControl.quotaId}" />
                                	<input type="hidden" name="roomTypeName" value="${dayRoomControl.roomTypeName}" />
                                	<input type="hidden" name="pricePlanName" value="${dayRoomControl.pricePlanName}" />
                                </li>
                                <li class="list-ellipsis" style="width: 10%; color: #FF6000;" title="${dayRoomControl.hotelName}">
                                	<a href="javascript:queryHotelRoomTypeList('${dayRoomControl.hotelId}','${dayRoomControl.hotelName}');">${dayRoomControl.hotelName}</a>
                                </li>
                                <li class="list-ellipsis" style="width: 10%" title="${dayRoomControl.supplyName}">${dayRoomControl.supplyName}</li>
                                <li class="list-ellipsis" style="width: 10%" title="${dayRoomControl.roomTypeName}-${dayRoomControl.pricePlanName}">${dayRoomControl.roomTypeName}-${dayRoomControl.pricePlanName}</li>
                                <li style="width: 6%">${dayRoomControl.saleDateStr}</li>
                                <li style="width: 6%">${dayRoomControl.quotaTypeName}</li>
                                <li style="width: 6%">
                                    <input type="text" name="basePrice" value="${dayRoomControl.basePriceText}" onclick="changeBgColor('basePrice_${status.index}','#BFEFFF')" id="basePrice_${status.index}" style="width: 50px; height: 22px;"> ${dayRoomControl.baseCurrency}
                                </li>
                                <li style="width: 6%">
                                    <input type="text" name="saleBPrice" value="${dayRoomControl.saleBPriceText}" onclick="changeBgColor('saleBPrice_${status.index}','#BFEFFF')" id="saleBPrice_${status.index}" style="width: 50px; height: 22px;"> ${dayRoomControl.saleBCurrency}
                                </li>
                                <li style="width: 6%">
                                    <input type="text" name="saleCtripPrice" value="${dayRoomControl.saleCtripPriceText}" onclick="changeBgColor('saleCPrice_${status.index}','#BFEFFF')" id="saleCPrice_${status.index}" style="width: 50px; height: 22px;"> ${dayRoomControl.saleCtripCurrency}
                                </li>
                                <li style="width: 6%">
                                    <input type="text" name="allQuotaNum" value="${dayRoomControl.allQuotaNum}" id="allQuotaNum_${status.index}" onclick="changeBgColor('allQuotaNum_${status.index}','#BFEFFF')" style="width: 50px; height: 22px;">
                                </li>
                                <li style="width: 4%">
                                    <label  style="cursor:pointer;color: #FF6000" onclick="viewUsedQuota('${dayRoomControl.pricePlanId}','${dayRoomControl.saleDateStr}')">${empty dayRoomControl.usedQuotaNum ? 0 : dayRoomControl.usedQuotaNum}</label>
                                    <input type="hidden" value="${dayRoomControl.usedQuotaNum}" disabled readonly id="usedQuotaNum_${status.index}" style="width: 50px; height: 22px;">
                                </li>
                                <li style="width: 4%">
                                	<label>${empty dayRoomControl.quotaNum ? 0 : dayRoomControl.quotaNum}</label>
<%--                                     <input type="text" value="${dayRoomControl.quotaNum}" id="quotaNum_${status.index}" disabled readonly  style="width: 50px; height: 22px;"> --%>
                                    <input type="hidden" value="${dayRoomControl.quotaNum}" id="old_quotaNum_${status.index}" >
                                </li>
                                <li style="width: 5%">
                                     <input type="text" name="detQuotaNum" value="${dayRoomControl.detQuotaNum}" id="detQuotaNum_${status.index}" onclick="changeBgColor('detQuotaNum_${status.index}','#BFEFFF')" style="width: 50px; height: 22px;">
                                </li>
                                <li style="width: 4%">
                                    <label  style="cursor:pointer;color: #FF6000" onclick="viewReserveQuota('${dayRoomControl.accouontId}','${dayRoomControl.pricePlanName}','${dayRoomControl.roomTypeId}','${dayRoomControl.pricePlanId}','${dayRoomControl.saleDateStr}')">${empty dayRoomControl.reserveQuotaNum ? 0 : dayRoomControl.reserveQuotaNum}</label>
                                    <input type="hidden" value="${dayRoomControl.reserveQuotaNum}" readonly id="reserveQuotaNum_${status.index}" onclick="viewReserveQuota('${dayRoomControl.accouontId}','${dayRoomControl.pricePlanName}','${dayRoomControl.roomTypeId}','${dayRoomControl.pricePlanId}','${dayRoomControl.saleDateStr}')" style="width: 40px">
                                    <input type="hidden" value="${dayRoomControl.reserveQuotaNum}" id="old_reserveQuotaNum_${status.index}">
                                </li>
                                <li style="width: 5%">
                                    <select name="preHoldQuota" id="preHoldQuota_${status.index}" style="height: 25px;">
                                        <option value="1" <c:if test="${dayRoomControl.preHoldQuota == 1}">selected</c:if> >预留</option>
                                        <option value="0" <c:if test="${dayRoomControl.preHoldQuota == 0}">selected</c:if> >不预留</option>
                                    </select>
                                </li>
                                <li style="width: 5%">
                                    <select name="isActive" id="isActive_${status.index}" style="height: 25px;">
                                        <option value="1" <c:if test="${dayRoomControl.isActive == 1}">selected</c:if> >有效</option>
                                        <option value="0" <c:if test="${dayRoomControl.isActive == 0}">selected</c:if> >无效</option>
                                    </select>
                                </li>
                                <li style="width: 4%; color: #FF6000;">
                                    <div class="table-list-content-tools">
                                        <ul class="clearfix">
                                            <shiro:hasPermission name="product:controlRoom:save">
                                                <c:if test="${dayRoomControl.canEdit >= 1}">
<%--                                                     <li><a href="javascript:savePriceAndQuota('${dayRoomControl.saleDateStr}','${dayRoomControl.hotelId}','${dayRoomControl.pricePlanId}','${dayRoomControl.priceId}','${dayRoomControl.roomTypeId}' --%>
<%--                                             ,'${dayRoomControl.accouontId}','${dayRoomControl.quotaId}','${dayRoomControl.usedQuotaNum}','${dayRoomControl.roomTypeName}','${dayRoomControl.pricePlanName}','${status.index}');"> --%>
<!--                                                         保存</a></li> -->
                                                    <li><a href="javascript:void(0);" onclick="savePriceAndQuota(this);">
                                                        保存</a></li>
                                                </c:if>
                                            </shiro:hasPermission>
                                            <shiro:hasPermission name="product:controlRoom:log">
                                            <!--<li><span>|</span><a href="javascript:viewLog('${dayRoomControl.roomTypeId}');">日志</a></li>-->

                                            </shiro:hasPermission>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </c:forEach>
                    </c:if>
                </div>
        </div>
    </div>
    <div class="room_bottom" >
		<div class="main_kkpager m_t10" style="width: 100%;">
			<div style="width: 70%; float:right; height: 40px; line-height: 40px;">
				<span>合计</span>
				<span style="padding-left: 30px;">总配额：${totalAllQuotaNum}</span>
				<span style="padding-left: 30px;">已用配额：${totalUsedQuotaNum}</span>
				<span style="padding-left: 30px;">在售配额：${totalQuotaNum}</span>
				<span style="padding-left: 30px;">扣留配额：${totalDetQuotaNum}</span>
				<span style="padding-left: 30px;">预留配额：${totalReserveQuotaNum}</span>
			</div>
		</div>
	</div>
</div>
</body>
</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>

<script src="<%=basePath%>js/jquery-labelauty.js"></script>
<script>

    //城市查询条件
    $('#cityCodeBox li').on('click', function () {
        if('全部' != $(this).html()){
            $("#cityCode").val($(this).attr("value"));
        }else{
            $("#cityCode").val(null);
        }
    });

    function changeBgColor(inputId,color){
        $("#"+inputId).css('background-color',color);
        if ($('#'+inputId).focus) {
        	$('#'+inputId).select();
        }
    }

    $('#activeSelectBox li').on('click', function () {
        $("#isActive").val($(this).attr("value"));
    });


    secondLimitStr($('.roomcontrol-manage-wrap .list6'), '7');

    $(function () {
        initDatepicker();

        //酒店的下拉联想框
        var hotelMap = '${hotelMap}';
        initAutocomplete(hotelMap,'hotelName','hotelId',initRoomComplete);

        //供应商下拉联想框
        var supplyMap = '${supplyMap}';
        initAutocomplete(supplyMap,'supplyName','supplyCode');

        initIsActive();
        if ($('input[name="hotelId"]').val()) {
        	initRoomAutocomplete($('input[name="hotelId"]').val());
        }

    });
    
    function initRoomComplete (event, ui) {
    	initRoomAutocomplete(ui.item.value);
    }

    function initIsActive() {
        if ('1' == $("#isActive").val()){
            $("#isActiveName").val("有效");
        } else if ('0' == $("#isActive").val()){
            $("#isActiveName").val("无效");
        }
    }

    //+---------------------------------------------------
    //| 求两个时间的天数差 日期格式为 YYYY-MM-dd
    //+---------------------------------------------------
    function daysBetween(DateOne,DateTwo)
    {
        var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
        var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
        var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

        var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
        var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
        var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

        var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
        return Math.abs(cha);
    }

    function queryRoomTypeList(clearPricePlanId){
        //$(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/queryRoomList?hotelId='+hotelId+'&hotelName='+hotelName);
        //如果是从价格计划列表页进来，重新从上面的查询条件中查询后，将此价格计划ID清空，否则一直都是带着价格计划ID在查询
        if (clearPricePlanId){
            $("#pricePlanId").val("");
        }

        var hotelId = $("#hotelId").val();
        var beginDate = $("#beginDate").val();
        var endDate = $("#endDate").val();

        if (hotelId){
            var days = daysBetween(endDate,beginDate);
            if (days > 31){
                new Tip({ msg: "单个酒店能查询最多一个月的数据",timer: 3000, type:2});
                return false;
            }
        } else{//酒店为空
            if (!(beginDate && endDate && beginDate == endDate)){
                new Tip({ msg: "不选择酒店时，开始日期和结束日期必须一致",timer: 3000, type:2});
                return false;
            }
        }

        $("#roomControlForm").submit();
    }

    //查看当前价格计划，当前日期的订单（订单号，下单日期，客户，制单人）
    function viewUsedQuota(pricePlanId,saleDate) {
        var param = "pricePlanId="+pricePlanId+"&saleDate="+saleDate;
		var h = window.screen.availHeight-80;
		var w = window.screen.availWidth-30;
		window.open(projectPath +'admin/searchUsedQuotaManage?'+param, '已用配额明细', 'height='+h+', width='+w+',top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
//        window.open("queryUsedQuota?"+param,"已卖配额", "height="+h+", width="+w+",top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        /* $.ajax({
            type:'POST',
            dataType : 'html',
            context : document.body,
            url : projectPath+'admin/queryUsedQuota',
            data:{
                pricePlanId:pricePlanId,
                saleDate:saleDate
            },
            success : function(data) {
                if (data) {
                    var d = dialog({
                        title: '已卖配额',
                        content: data,
                        width: 730,
                        height:580,
                        top:100,
                        left:340
                    }).showModal();
                }
            }
        }); */

    }

    //roomTypeId 为了查询配额账号使用的。如果直接记录配额账号到预留配额表。后面如果价格计划可以换配额账号，这个表就要同步更新。所以这里还是不记录配额账号。
    function viewReserveQuota(quotaAccountId,pricePlanName,roomTypeId,pricePlanId,saleDate) {
        var h = window.screen.availHeight;
        var w = window.screen.availWidth;
        var param = "quotaAccountId=" + quotaAccountId + "&pricePlanName=" + pricePlanName + "&priceplanId=" + pricePlanId + "&saleDateStr=" + saleDate;
        window.open("queryReserveQuota?" + param, "预留配额", "height=" + h + ", width=" + w + ",top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }


    //保存当前行数据 inde为行号，从0开始
    function savePriceAndQuota(thiz) {
    	var row = $(thiz).parent().parent().parent().parent().parent();
		var data = getData(row);
        F.loading.show('mask');
        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/saveDayPriceAndQuota',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
//                     queryRoomTypeList();
                    location.reload();
                } else {
                    new Tip({ msg: rs.errorReason,timer: 3000, type:2});
                }
                F.loading.remove();
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                F.loading.remove();
                new Tip({ msg: '系统异常',timer: 2000, type:2});
            }
        });
    }
    
    $('input[name="chkAll"]').bind('click',function () {
    	if ($(this).is(':checked')) {
    		$('input[name="chk"]').prop('checked',true);
    	} else {
    		$('input[name="chk"]').prop('checked',false);
    	}
    });
    
    var len = $('input[name="chk"]').length;
    $('input[name="chk"]').each(function (k,v) {
    	$(v).bind('click', function () {
    		if (!$(this).is(':checked')) {
    			if ($('input[name="chkAll"]').is(':checked')) {
    				$('input[name="chkAll"]').prop('checked',false);
    			}
    		} else {
    			var chkLen = $('input[name="chk"]:checked').length;
    			if (len == chkLen) {
    				$('input[name="chkAll"]').prop('checked',true);
    			}
    		}
    	});
    });

    function getData (row) {
    	var saleDate = $('input[name="saleDate"]',row).val();
		var hotelId = $('input[name="hotelId"]',row).val();
		var pricePlanId = $('input[name="pricePlanId"]',row).val();
		var priceId = $('input[name="priceId"]',row).val();
		var roomTypeId = $('input[name="roomTypeId"]',row).val();
		var accouontId = $('input[name="accouontId"]',row).val();
		var quotaId = $('input[name="quotaId"]',row).val();
		var roomTypeName = $('input[name="roomTypeName"]',row).val();
		var pricePlanName = $('input[name="pricePlanName"]',row).val();
		var basePrice = $('input[name="basePrice"]',row).val();
		var saleBPrice = $('input[name="saleBPrice"]',row).val();
		var saleCtripPrice = $('input[name="saleCtripPrice"]',row).val();
		var allQuotaNum = $('input[name="allQuotaNum"]',row).val();
		var detQuotaNum = $('input[name="detQuotaNum"]',row).val();
		var preHoldQuota = $('select[name="preHoldQuota"]',row).val();
		var isActive = $('select[name="isActive"]',row).val();
		return {
	            saleDate:saleDate,
	            hotelId:hotelId,
	            pricePlanId:pricePlanId,
	            priceId:priceId,
	            roomTypeId:roomTypeId,
	            accouontId:accouontId,
	            quotaId:quotaId,
	            roomTypeName:roomTypeName,
	            pricePlanName:pricePlanName,
	            basePrice:basePrice,
	            saleBPrice:saleBPrice,
	            saleCtripPrice:saleCtripPrice,
	            allQuotaNum:allQuotaNum,
	            detQuotaNum:detQuotaNum,
	            preHoldQuota:preHoldQuota,
	            isActive:isActive
	        };
    }
    
    $('.addbtn').bind('click',function () {
    	var dataList = [];
    	$('input[name="chk"]:checked').each(function (k,v) {
    		var row = $(this).parent().parent();
    		dataList.push(getData(row));
    	});
    	if (dataList.length == 0) {
    		new Tip({ msg: '请选择需要保存的记录',timer: 2000, type:2});
    		return false;
    	}
    	F.loading.show('mask');
        $.ajax({
            type: 'POST',
            context : document.body,
            contentType : 'application/json; charset=UTF-8',
            url: '<%=basePath%>admin/batchSaveDayPriceAndQuota',
            data: JSON.stringify(dataList),
            dataType: 'json',
            success: function(rs) {
                $('.f_ui-loading').hide();
                if (rs.result == 1) {
                    new Tip({ msg: "设置成功！",timer: 2000, type:1});
                    location.reload();
                } else {
                    new Tip({ msg: rs.errorReason,timer: 3000, type:2});
                }
                F.loading.remove();
            },
            error: function(xhr, type) {
                $('.f_ui-loading').hide();
                F.loading.remove();
                new Tip({ msg: '系统异常',timer: 2000, type:2});
            }
        });
    });
    
	// 查看房型列表
    function queryHotelRoomTypeList(hotelId,hotelName){
    	var h = window.screen.availHeight-80;
		var w = window.screen.availWidth-30;
		var dt = new Date();
        var sy = dt.getFullYear();
        var sm = dt.getMonth();
        sm = sm + 1;
        var sd = dt.getDate();
        
        var end = new Date(dt.getTime() + 24*60*60*1000*7);
        var ey = end.getFullYear();
        var em = end.getMonth();
        em = em + 1;
        var ed = end.getDate();
        if (sm < 10) {
        	sm = '0'+ sm;
        }
        if (sd < 10) {
        	sd = '0' + sd;
        }
        if (em < 10) {
        	em = '0' + em;
        }
        if (ed < 10) {
        	ed = '0' + ed;
        }
        var beginDate = sy+'-'+sm+'-'+sd;
        var endDate = ey+'-'+em+'-'+ed;
    	window.open('<%=basePath%>admin/queryRoomList?hotelId='+hotelId+'&hotelName='+hotelName+'&beginDate='+beginDate+'&endDate='+endDate,"房型列表", "height="+h+", width="+w+",top=0,left=0,channelmode=yes,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }
</script>