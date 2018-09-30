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
    <title>区间报价</title>
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link href="<%=basePath%>css/jquery.mCustomScrollbar.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<style>
	body{
		overflow-x:hidden;
		overflow-y:hidden;
	}
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
    #dynamicPriceList table td{
    	border: solid #e2e2e2;
    	border-width: 0 1px 1px 0;
    	white-space: nowrap;
    	height: 30px;
    	line-height: 30px;
    }
    #dynamicPriceList table th{
    	border: solid #e2e2e2;
    	border-width: 0 1px 1px 0;
    	height: 30px;
    	background: #f2f2f2;
    	color: #999;
    	white-space: nowrap;
    	height: 30px;
    	line-height: 30px;
    }
    #dynamicPriceList table {
    	border: solid #e2e2e2;
    	border-width: 0 0 0 1px;
    }
    #dynamicPriceList table td span{
    	width:50%;
    	white-space: nowrap;
    	height: 30px;
    	line-height: 30px;
    }
    #dynamicPriceList table .background-red{
        background-color: #FF6B6B;
        color: #ffffff;
    }
</style>
<body>

<div class="roomcontrol-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:void(0);">区间报价</a>
    </div>
    <div class="main-content">
        <shiro:hasPermission name="product:hotel:query">
        <form id="intervalPriceForm" action="intervalPage" method="post">
            <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                   value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                   value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty dynamicPriceQuery.currentPage}'>1</c:when><c:otherwise>${dynamicPriceQuery.currentPage}</c:otherwise></c:choose>" />
            <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty dynamicPriceQuery.pageSize}'>5</c:when><c:otherwise>${dynamicPriceQuery.pageSize}</c:otherwise></c:choose>" />
            <input type="hidden" id="cityCode" name="cityCode"  value="${dynamicPriceQuery.cityCode}" />
            <input type="hidden" id="starKey" name="starKey"  value="${dynamicPriceQuery.starKey}" />
            <input type="hidden" name="rateMap"  value='${rate}' />
            <input type="hidden" name="dynamicCurrency" />
            <input type="hidden" name="queryPrice" value="${dynamicPriceQuery.queryPrice}" />
            <input type="hidden" name="queryQuota" value="${dynamicPriceQuery.queryQuota}" />
            <div class="filter-bar">
            <ul>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">城市:</span>
                    <input id="cityName" type="text" placeholder="请选择城市" readonly <c:choose><c:when test="${not empty dynamicPriceQuery.cityName}">value="${dynamicPriceQuery.cityName}"</c:when><c:otherwise>value="全部"</c:otherwise></c:choose> />
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
                    <input name="hotelName" id="project" value="${dynamicPriceQuery.hotelName}" class="text w_140 c_666 " placeholder="请输入酒店名称" autocomplete="off" type="text">
                    <input type="hidden" id="project-id" name="hotelId" value="${dynamicPriceQuery.hotelId}">
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">星级:</span>
                    <input type="text" placeholder="请选择星级" readonly <c:choose><c:when test="${not empty dynamicPriceQuery.starValue}">value="${dynamicPriceQuery.starValue}"</c:when><c:otherwise>value="全部"</c:otherwise></c:choose> />
                    <div class="filter-bar-drop-box">
                        <ul class="clearfix"  id="starSelectBox">
                            <li class="clearfix">全部</li>
                            <c:forEach items="${starMap}" var="starItem">
                                <li value="${starItem.key}">${starItem.value}</li>
                            </c:forEach>
                        </ul>
                    </div>
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">开始日期:</span>
                    <input type="text" name="beginDate" value="${dynamicPriceQuery.beginDate}" autocomplete="off" />
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">结束日期:</span>
                    <input type="text" name="endDate" value="${dynamicPriceQuery.endDate}" autocomplete="off" />
                </li>
            </ul>
        </div>
        <div class="filter-bar" style="margin-top: 10px">
        	<ul>
                <li class="filter-bar-list">
                    <input type="checkbox" name="isQueryPrice" style="width: 20px; vertical-align: middle; margin-right:5px;" value="${dynamicPriceQuery.queryPrice}" <c:if test="${not empty dynamicPriceQuery.queryPrice && dynamicPriceQuery.queryPrice == true}">checked</c:if> />
                    <span style="vertical-align: middle;">隐藏无价格</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" name="isQueryQuota" style="width: 20px; vertical-align: middle; margin-right:5px;" value="${dynamicPriceQuery.queryQuota}" <c:if test="${not empty dynamicPriceQuery.queryQuota && dynamicPriceQuery.queryQuota == true}">checked</c:if> />
                    <span style="vertical-align: middle;">隐藏无配额</span>
                </li>
                <li><a class="search-btn" href="javascript:queryIntervalPriceList();"><i class="iconfont icon-search"></i></a></li>
			</ul>
        </div>
        </form>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="table-list">
        	<p style="text-align: center; font-size: 18px; height: 30px; line-height: 30px;">${intervalInfo.title}</p>
        	<div class="table-list-content" style="width:100%; overflow-x: scroll;overflow-y:scroll;margin-bottom: 10px">
        	<div id="dynamicPriceList">
        	<table cellpadding="0" cellspacing="0" width="100%">
        		<tr>
        			<th>酒店名称</th>
        			<th>房型名称</th>
        			<th>产品名称</th>
        			<c:if test="${not empty dateList}">
        				<c:forEach items="${dateList}" var="dt" varStatus="dtStatus">
        					<th <c:if test="${dt.weekDay == '周六' || dt.weekDay == '周五'}">class="background-red"</c:if> >
        						<p><fmt:formatDate value="${dt.saleDate}" pattern="yyyy-MM-dd"/></p>
        						<p>${dt.weekDay}</p>
        					</th>
        				</c:forEach>
        			</c:if>
        		</tr>
        		<c:if test="${not empty page}">
        			<c:forEach items="${page.recordList}" var="hotel" varStatus="hotelStatus">
        				<c:if test="${not empty hotel.roomList}">
        					<c:forEach items="${hotel.roomList}" var="room" varStatus="roomStatus">
        						<c:if test="${not empty room.pricePlanList}">
        							<c:forEach items="${room.pricePlanList}" var="pricePlan" varStatus="pricePlanStatus">
        								<tr id="${pricePlan.priceplanId}">
	        								<c:choose>
	        									<c:when test="${roomStatus.index == 0 && pricePlanStatus.index == 0}">
			        								<td rowspan="${hotel.rowspan}" title="电话：${hotel.tel}&#10;传真：${hotel.fax}&#10;邮箱：${hotel.email}&#10;加床：${hotel.bedSalePrice}${hotel.bedSaleCurrency}&#10;加早：${hotel.breakfastSalePrice}${hotel.breakfastSaleCurrency}&#10;地址：${hotel.address}">${hotel.hotelName}</td>
			        								<td rowspan="${room.rowspan}">${room.roomName}</td>
	        									</c:when>
	        									<c:otherwise>
	        										<c:choose>
	        											<c:when test="${pricePlanStatus.index == 0}">
	        												<td rowspan="${room.rowspan}">${room.roomName}</td>
	        											</c:when>
	        										</c:choose>
	        									</c:otherwise>
	        								</c:choose>
							        		<td>
							        			${pricePlan.priceplanName}
							        			<input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}" />
							        			<input type="hidden" name="saleBCurrency" value="${pricePlan.saleBCurrency}" />
							        			<input type="hidden" name="hotelId" value="${hotel.hotelId}" />
							        			<input type="hidden" name="hotelName" value="${hotel.hotelName}" />
							        			<input type="hidden" name="saleBCurrency" value="${pricePlan.saleBCurrency}" />
							        		</td>
							        		<c:if test="${not empty pricePlan.priceList}">
							        			<c:forEach items="${pricePlan.priceList}" var="price" varStatus="priceStatus">
							        				<c:if test="${not empty price.saleBPrice}">
							        					<c:if test="${price.weekDay == '周六' || price.weekDay == '周日'}">
							        						<td id="${price.priceId}" style="text-align: center; background-color: #f7f706; font-size: 15px; cursor:pointer;">
								        						<p><span class="saleBPrice">${price.saleBPrice}</span><span class="saleBCurrency">${pricePlan.saleBCurrency}</span></p>
								        						<input type="hidden" name="priceId" value="${price.priceId}" />
								        						<input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}" />
								        						<input type="hidden" name="weekDay" value="${price.weekDay}" />
								        						<input type="hidden" name="saleBPrice" value="${price.saleBPrice}" />
								        						<input type="hidden" name="saleDate" value="<fmt:formatDate value="${price.saleDate}" pattern="yyyy-MM-dd"/>" />
								        					</td>
							        					</c:if>
							        					<c:if test="${price.weekDay != '周六' && price.weekDay != '周日'}">
							        						<c:choose>
							        							<c:when test="${not empty price.holiday && price.holiday == 1}">
							        								<td id="${price.priceId}" style="text-align: center; background-color: #efd1d1; font-size: 15px; cursor:pointer;">
							        							</c:when>
							        							<c:otherwise>
							        								<td id="${price.priceId}" style="text-align: center; font-size: 15px; cursor:pointer;">
							        							</c:otherwise>
							        						</c:choose>
								        						<p><span class="saleBPrice">${price.saleBPrice}</span><span class="saleBCurrency">${pricePlan.saleBCurrency}</span></p>
								        						<input type="hidden" name="priceId" value="${price.priceId}" />
								        						<input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}" />
								        						<input type="hidden" name="weekDay" value="${price.weekDay}" />
								        						<input type="hidden" name="saleBPrice" value="${price.saleBPrice}" />
								        						<input type="hidden" name="saleDate" value="<fmt:formatDate value="${price.saleDate}" pattern="yyyy-MM-dd"/>" />
								        					</td>
							        					</c:if>
							        				</c:if>
							        				<c:if test="${empty price.saleBPrice}">
							        					<c:if test="${price.weekDay == '周六' || price.weekDay == '周日'}">
								        					<td style="text-align: center; background-color: #f7f706; font-size: 15px;">
								        						<p>查</p>
								        					</td>
							        					</c:if>
							        					<c:if test="${price.weekDay != '周六' && price.weekDay != '周日'}">
							        						<td style="text-align: center; background-color: #a1a1a1; font-size: 15px;">
								        						<p>查</p>
								        					</td>
							        					</c:if>
						        					</c:if>
							        			</c:forEach>
							        		</c:if>
        								</tr>
        							</c:forEach>
        						</c:if>
        					</c:forEach>
        				</c:if>
	        		</c:forEach>
        		</c:if>
        	</table>
        	</div>
        	</div>
            <p style="font-size: 14px; height: 20px; line-height: 20px;"><span>电话：${intervalInfo.tel}</span><span style="padding-left: 50px;">传真：${intervalInfo.fax}</span></p>
            <p style="font-size: 14px; height: 60px; line-height: 60px;">${intervalInfo.remark}</p>
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
<script type="text/javascript" src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery.form.js"></script>
<script type="text/javascript" src="<%=basePath%>js/main.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>js/localdate.js"></script>
<script>
	var height = document.documentElement.clientHeight-348-30-80;
	$('.table-list-content').css('height',height);
	var rateMap = {};
	var tdArr = [];
    var rateStr = $('input[name="rateMap"]').val();
	if (rateStr) {
		rateMap = eval('(' + rateStr + ')');
	}
	//城市查询条件
    $('#cityCodeBox li').on('click', function () {
        if('全部' != $(this).html()){
            $("#cityCode").val($(this).attr("value"));
        }else{
            $("#cityCode").val(null);
        }
    });
	//酒店星级
    $('#starSelectBox li').on('click', function () {
        if('全部' != $(this).html()){
            $("#starKey").val($(this).attr("value"));
        }else{
            $("#starKey").val(null);
        }
    });

    //初始化分页
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
                queryIntervalPriceList();
                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });
        var hotelMap = '${hotelList}';
        initAutocomplete(hotelMap,'project','project-id');
        $('input[name="beginDate"]').datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths: 2,
	        onSelect: function(dateText, inst){
				$('input[name="endDate"]').datepicker( "option", "minDate", dateText );
			}
        });
        $('input[name="endDate"]').datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths: 2,
	        onSelect: function(dateText, inst){
				$('input[name="beginDate"]').datepicker( "option", "maxDate", dateText );
			}
        });
    });

    // 查询区间报价列表
    function queryIntervalPriceList() {
    	var isQueryPrice = $('input[name="isQueryPrice"]').is(':checked');
    	var isQueryQuota = $('input[name="isQueryQuota"]').is(':checked');
    	if (isQueryPrice) {
    		$('input[name="queryPrice"]').val(true);
    	} else {
    		$('input[name="queryPrice"]').val(false);
    	}
    	if (isQueryQuota) {
    		$('input[name="queryQuota"]').val(true);
    	} else {
    		$('input[name="queryQuota"]').val(false);
    	}
    	var hotelId = $('input[name="hotelId"]').val();
    	var beginDate = $('input[name="beginDate"]').val();
    	var endDate = $('input[name="endDate"]').val();
    	if (!beginDate) {
    		new Tip({ msg: "请选择开始日期",timer: 3000, type:2});
            return false;
        }
    	if (!endDate) {
    		new Tip({ msg: "请选择结束日期",timer: 3000, type:2});
            return false;
        }
        var days = daysBetween(endDate,beginDate);
    	if (hotelId){
            if (days > 31){
                new Tip({ msg: "单个酒店最多查一个月的数据",timer: 3000, type:2});
                return false;
            }
        } else{//酒店为空
            if (days > 7){
                new Tip({ msg: "未选择酒店时，最多查7天的数据",timer: 3000, type:2});
                return false;
            }
        }
        $("#intervalPriceForm").submit();
    }
    
  //+---------------------------------------------------
    //| 求两个时间的天数差 日期格式为 YYYY-MM-dd
    //+---------------------------------------------------
    function daysBetween(DateOne,DateTwo) {
        var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
        var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
        var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

        var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
        var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
        var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

        var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
        return Math.abs(cha);
    }
</script>