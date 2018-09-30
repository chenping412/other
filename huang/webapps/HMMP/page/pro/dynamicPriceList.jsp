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
    <title>动态报价</title>
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
        <a href="javascript:void(0);">动态报价</a>
    </div>
    <div class="main-content">
        <shiro:hasPermission name="product:hotel:query">
        <form id="dynamicPriceForm" action="dynamicPage" method="post">
            <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                   value="<c:choose><c:when test="${not empty page.totalCount}">${page.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
            <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                   value="<c:choose><c:when test="${not empty page.totalPages}">${page.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

            <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty dynamicPriceQuery.currentPage}'>1</c:when><c:otherwise>${dynamicPriceQuery.currentPage}</c:otherwise></c:choose>" />
            <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty dynamicPriceQuery.pageSize}'>5</c:when><c:otherwise>${dynamicPriceQuery.pageSize}</c:otherwise></c:choose>" />
            <input type="hidden" id="cityCode" name="cityCode"  value="${dynamicPriceQuery.cityCode}" />
            <input type="hidden" name="rateMap"  value='${rate}' />
            <input type="hidden" name="dynamicCurrency" />

            <div class="filter-bar">
            <ul>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">城市:</span>
                    <input id="cityName" type="text" placeholder="请选择城市" readonly value="${dynamicPriceQuery.cityName}" />
                    <%--<i class="iconfont  icon-downTriangle"></i>--%>
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
                    <span class="filter-bar-list-title">开始日期:</span>
                    <input type="text" name="beginDate" value="${dynamicPriceQuery.beginDate}" autocomplete="off" />
                </li>
                <li><a class="search-btn" href="javascript:queryDynamicPriceList();"><i class="iconfont icon-search"></i></a></li>
            </ul>
        </div>
        <div class="filter-bar" style="margin-top: 10px">
        	<ul>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">币种:</span>
                    <input id="currency" type="text" placeholder="请选择币种" readonly />
                    <%--<i class="iconfont  icon-downTriangle"></i>--%>
                    <div class="filter-bar-drop-box">
                        <ul class="clearfix"  id="currencyBox">
                            <li class="clearfix">请选择</li>
                            <li class="clearfix"  value="CNY">CNY</li>
                            <li class="clearfix"  value="HKD">HKD</li>
                            <li class="clearfix"  value="MOP">MOP</li>
                        </ul>
                    </div>
                </li>
                <li><a href="javascript:void(0);" class="addbtn" style="color:#fff;">立即下单</a></li>
            </ul>
        </div>
        </form>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="table-list">
        	<div class="table-list-content" style="width:100%; overflow-x: scroll;overflow-y:scroll;">
        	<div id="dynamicPriceList" style="width: 250%">
        	<table cellpadding="0" cellspacing="0" width="100%">
        		<tr>
        			<th width="120">酒店名称</th>
        			<th width="100">房型名称</th>
        			<th width="100">产品名称</th>
        			<c:if test="${not empty dateList}">
        				<c:forEach items="${dateList}" var="dt" varStatus="dtStatus">
        					<th width="50" <c:if test="${dt.weekDay == '周六' || dt.weekDay == '周五'}">class="background-red"</c:if> >
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
							        				<c:if test="${not empty price.saleBPrice && price.saleBPrice != 0}">
							        					<c:if test="${price.weekDay == '周六' || price.weekDay == '周日'}">
							        						<td id="${price.priceId}" style="text-align: center; background-color: #f7f706; font-size: 15px; cursor:pointer;" onclick="checkTD(this);">
								        						<p><span class="saleBPrice">${price.saleBPrice}</span><span class="saleBCurrency">${pricePlan.saleBCurrency}</span></p>
								        						<p>
								        							${price.surplusQuotaCount}&nbsp;&nbsp;<c:if test="${not empty price.reserveQuotaNum && price.reserveQuotaNum > 0}">留</c:if>
								        						</p>
								        						<input type="hidden" name="priceId" value="${price.priceId}" />
								        						<input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}" />
								        						<input type="hidden" name="weekDay" value="${price.weekDay}" />
								        						<input type="hidden" name="saleBPrice" value="${price.saleBPrice}" />
								        						<input type="hidden" name="surplusQuotaCount" value="${price.surplusQuotaCount}" />
								        						<input type="hidden" name="saleDate" value="<fmt:formatDate value="${price.saleDate}" pattern="yyyy-MM-dd"/>" />
								        					</td>
							        					</c:if>
							        					<c:if test="${price.weekDay != '周六' && price.weekDay != '周日'}">
							        						<c:choose>
							        							<c:when test="${not empty price.holiday && price.holiday == 1}">
							        								<td id="${price.priceId}" style="text-align: center; background-color: #efd1d1; font-size: 15px; cursor:pointer;" onclick="checkTD(this);">
							        							</c:when>
							        							<c:otherwise>
							        								<td id="${price.priceId}" style="text-align: center; font-size: 15px; cursor:pointer;" onclick="checkTD(this);">
							        							</c:otherwise>
							        						</c:choose>
								        						<p><span class="saleBPrice">${price.saleBPrice}</span><span class="saleBCurrency">${pricePlan.saleBCurrency}</span></p>
								        						<p>
								        							${price.surplusQuotaCount}&nbsp;&nbsp;<c:if test="${not empty price.reserveQuotaNum && price.reserveQuotaNum > 0}">留</c:if>
								        						</p>
								        						<input type="hidden" name="priceId" value="${price.priceId}" />
								        						<input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}" />
								        						<input type="hidden" name="weekDay" value="${price.weekDay}" />
								        						<input type="hidden" name="saleBPrice" value="${price.saleBPrice}" />
								        						<input type="hidden" name="surplusQuotaCount" value="${price.surplusQuotaCount}" />
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
	var height = document.documentElement.clientHeight-348;
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
    $('.addbtn').on('click',function () {
        var pricePlanIdArr = [];
    	$('input[name="pricePlanId"]').each(function () {
    		var pricePlanId = $(this).val();
			var row = $('#'+pricePlanId);
			$('input[name="priceId"]',row).each(function(){
				var priceId = $(this).val();
				var td = $('#'+priceId);
				var salePrice = $('input[name="saleBPrice"]',td).val();
				var surplusQuotaCount = $('input[name="surplusQuotaCount"]',td).val();
				if (salePrice && salePrice > 0 && surplusQuotaCount && surplusQuotaCount > 0) {
					if (td.prop('priceChecked') == 'checked') {
						pricePlanIdArr.push($('input[name="pricePlanId"]',td).val());
					}
				}
			});
    	});
    	$.unique(pricePlanIdArr);
		if (pricePlanIdArr.length == 0) {
			new Tip({ msg: "请选择价格",timer: 3000, type:2});
			return;
		}
		if (pricePlanIdArr.length > 1) {
			new Tip({ msg: "立即下单只能选择一个产品",timer: 3000, type:2});
			return;
		}
		var hotelId,hotelName,pricePlanId,saleDate;
		$.each(pricePlanIdArr,function(k,v){
			var row = $('#'+v);
			pricePlanId = v;
			hotelId = $('input[name="hotelId"]',row).val();
			hotelName = $('input[name="hotelName"]',row).val();
			var dateArr = [];
			$('input[name="priceId"]',row).each(function(){
				var priceId = $(this).val();
				var td = $('#'+priceId);
				if (td.prop('priceChecked') == 'checked') {
					dateArr.push($('input[name="saleDate"]',td).val());
				}
			});
			if (dateArr.length > 0) {
				saleDate = dateArr.join(';');
			}
		});
		var targetCurrency = $('input[name="dynamicCurrency"]').val();
		if (!targetCurrency) {
			new Tip({ msg: '请选择币种',timer: 3000, type:2});
			return;
		}
		window.parent.$('.platform-sidebar').show();
		window.parent.$('.order-manage-sidebar').show();
		window.parent.$('.finance-manage-sidebar').hide();
		window.parent.$('.user-data-sidebar').hide();
		window.parent.$('.product-manage-sidebar').hide();
		window.parent.$('.supply-manage-sidebar').hide();
		window.parent.$('.agent-manage-sidebar').hide();
		window.parent.$('.order-manage').show().siblings('.finance-manage').hide().siblings('.user-data').hide().siblings('.product-manage').hide().siblings('.agent-manage').hide().siblings('.supply-manage').hide();
		window.parent.$('.platform-header .tab li').each(function (k,v) {
			if ($(v).html() != '订单管理') {
				$(v).removeClass('tab-active')
			} else {
				$(v).addClass('tab-active')
			}
		});
		window.parent.$('.order-manage-sidebar .sidebar-search li').each(function (k,v) {
			if ($(v).html() == '手工录单') {
				$(v).addClass('sidebar-active');
			}
		});
		window.parent.$('.order-manage').children().prop('src', '<%=basePath%>admin/toAddOrder?hotelId='+hotelId+'&hotelName='+hotelName+'&pricePlanId='+pricePlanId+'&targetCurrency='+targetCurrency+'&saleDate='+saleDate);
    });

    function RGBtoHEX(str) {
        if (str.substring(0, 3) == 'rgb') {
            var arr = str.split(",");
            var r = arr[0].replace('rgb(','').trim(), g = arr[1].trim(), b = arr[2].replace(')','').trim();
            var hex = [
                toHex(r),
                toHex(g),
                toHex(b)
            ];
            return "#" + hex.join('');              
        }
        else{
            return str;
        }
    }

    function toHex(N) {
        if (N == null) return "00";
        N = parseInt(N); if (N == 0 || isNaN(N)) return "00";
        N = Math.max(0,N); N = Math.min(N,255); N = Math.round(N);
        return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
    }

    function checkTD (thiz) {
        var bgColor = RGBtoHEX($(thiz).css('background-color'));
        var weekDay = $('input[name="weekDay"]',$(thiz)).val();
        var salePrice = $('input[name="saleBPrice"]',$(thiz)).val();
		var surplusQuotaCount = $('input[name="surplusQuotaCount"]',$(thiz)).val();
		if (salePrice && salePrice > 0 && surplusQuotaCount && surplusQuotaCount > 0) {
	        if ($(thiz).prop('priceChecked') == 'checked') {
	        	$(thiz).prop('priceChecked','');
	        	if (weekDay == '周六' || weekDay == '周日') {
		        	$(thiz).css('background-color','#f7f706');
	            } else {
	            	$(thiz).css('background-color','');
	            }
	        } else {
	        	$(thiz).prop('priceChecked','checked');
	        	$(thiz).css('background-color','#009BF1');
	        }
		}
    }
	//币种切换
    $('#currencyBox li').on('click', function () {
        if('请选择' != $(this).html()){
            var targetCurrency = $(this).attr("value");
            $('input[name="dynamicCurrency"]').val(targetCurrency);
            $('input[name="pricePlanId"]').each(function () {
                var pricePlanId = $(this).val();
				var row = $('#'+pricePlanId);
				var sourceCurrency = $('input[name="saleBCurrency"]',row).val();
				$('input[name="priceId"]',row).each(function () {
					var priceId = $(this).val();
					var td = $('#'+priceId);
					var rateObj = rateMap[sourceCurrency+'-'+targetCurrency];
					var rate = 1.00;
					if (rateObj && rateObj.rate) {
						rate = rateObj.rate;
					}
					var price = $('input[name="saleBPrice"]',td).val();
					var priceStr = Math.round((Number(price) * rate) * 100) / 100;
					$('.saleBPrice',td).html(priceStr);
					$('.saleBCurrency',td).html(targetCurrency);
				})
            });
        }
    });
    //初始化分页
    //init
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
                queryDynamicPriceList();
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
	        numberOfMonths: 1
        });
    });

    // 查询动态报价列表
    function queryDynamicPriceList() {
        $("#dynamicPriceForm").submit();
    }
</script>