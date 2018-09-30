<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="core"%>
<%@ taglib prefix="fmt" uri="fmt"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Pragma" content="no-cache"> 
	<meta http-equiv="Cache-Control" content="no-cache"> 
	<meta http-equiv="Expires" content="-1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>我的房型</title>
    <link rel="stylesheet" href="<%=basePath%>css/jquery-ui.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/jquery.autocomplete.css" />
    <link rel="stylesheet" href="<%=basePath%>css/jquery-labelauty.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/timebar.css">
    <link rel="stylesheet" href="<%=basePath%>css/product.css">
    <style>
    	.ui-autocomplete{
    		z-index: 1024;
    	}
    </style>
</head>
<body>
<div class="room-manage-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">房型管理</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <table>
                <tr>
                    <shiro:hasPermission name="product:hotel:room:add">
                    <td><a href="##" class="addbtn addRoom">新增房型</a></td>
                    </shiro:hasPermission>
                    <td><a href="##" class="addbtn batchUpdatePrice">批量调价</a></td>
                    <td><a href="##" class="addbtn batchUpdateQuota">批量调房</a></td>
                    <td><a href="##" class="addbtn batchUpdateSale">批量上下架</a></td>
                </tr>
            </table>
        </div>
        <shiro:hasPermission name="product:hotel:room:query">
        <div class="filter-bar">
            <form id="roomForm" action="queryRoomList" method="post">
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty roomQuery.currentPage}'>1</c:when><c:otherwise>${roomQuery.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty roomQuery.pageSize}'>5</c:when><c:otherwise>${roomQuery.pageSize}</c:otherwise></c:choose>" />
				<input type="hidden" name="beginDate" value="${roomQuery.beginDate}" />
				<input type="hidden" name="endDate" value="${roomQuery.endDate}" />
                <input type="hidden" id="hotelId" name="hotelId" value="${roomQuery.hotelId}">
                <input type="hidden" id="hotelId" name="hotelName" value="${roomQuery.hotelName}">
                <ul>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">酒店:</span>
                        <span class="filter-bar-list-text">${roomQuery.hotelName}</span>
                    <li/>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">房型:</span>
                        <input id="roomTypeName" value="${roomQuery.roomTypeName}" name="roomTypeName" placeholder="请输入房型名称" autocomplete="off" />
                        <input type="hidden" id="roomTypeId" name="roomTypeId" value="${roomQuery.roomTypeId}">
                    <li/>
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">日期:</span>
                        <input id="saleDate" value="${roomQuery.saleDate}" name="saleDate" placeholder="请选择日期" autocomplete="off" />
                    <li/>
                    <li><a class="search-btn" href="javascript:queryRoomTypeList();"><i class="iconfont icon-search"></i></a></li>
                </ul>
            </form>
        </div>
        </shiro:hasPermission>
        <div class="baseline"></div>
            <div class="table-list">
                <div class="table-list-header">
                    <ul class="clearfix">
                        <li style="width: 12%; text-align: left; line-height: 38px;"><input type="checkbox" name="roomTypeChk" style="vertical-align:middle;" onclick="chkRoomTypeAll(this)" />&nbsp;房型</li>
                        <li style="width: 12%; text-align: left; line-height: 38px;">价格计划</li>
                        <li style="width: 76%; text-align: center;" id="timebar"></li>
                    </ul>
                </div>
                <div class="table-list-content clearfix">
                	<table cellpadding="0" cellspacing="0" width="100%" class="tab-section">
                		<colgroup>
                            <col width="12%">
                            <col width="88%">
                        </colgroup>
                        <c:if test="${not empty pgSupport}">
                        	<c:forEach items="${pgSupport.recordList}" var="roomType">
		                        <tr id="roomTypeId_${roomType.roomTypeId}">
			                        <td style="padding-top: 10px; text-align: left;">
			                            <p><input type="checkbox" name="roomTypeId" value="${roomType.roomTypeId}" onclick="chkAll(this);" style="vertical-align:middle;" />&nbsp;${roomType.roomName}</p>
			                            <p style="color: #FF6000; padding-top:5px; font-size: 13px;">
			                            	<a href="javascript:void(0);" class="addProduct" val="${roomType.roomTypeId}">添加产品</a>&nbsp;
			                            	<a href="javascript:void(0);" class="delRoom" val="${roomType.roomTypeId}">删除房型</a>
			                            </p>
			                            <p style="color: #FF6000; padding-top:5px; font-size: 13px;">
			                            	<a href="javascript:void(0);" class="setRoom" val="${roomType.roomTypeId}">开关房</a>
			                            </p>
			                        </td>
			                        <td>
			                            <table id="priceList" cellpadding="0" cellspacing="0" width="100%" class="tab-section">
					                        <thead>
					                        	<tr>
					                        		<th width="11%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        		<th width="7%"></th>
					                        	</tr>
					                        </thead>
					                        <tbody>
			                            	<c:if test="${not empty roomType.pricePlanList}">
			                            		<c:forEach items="${roomType.pricePlanList}" var="pricePlan">
					                            	<tr id="pricePlanId_${pricePlan.priceplanId}">
					                            		<td style="padding-top: 10px; text-align: left;">
					                            			<p><input type="checkbox" name="pricePlanId" value="${pricePlan.priceplanId}" style="vertical-align:middle;" />&nbsp;${pricePlan.priceplanName}</p>
					                            		</td>
					                            		<td style="padding-top: 10px; text-align: left;">
					                            			<p>底价</p>
								                            <p>同行价</p>
								                            <p>携程价</p>
								                            <p>总/剩</p>
					                            		</td>
					                            		<c:if test="${not empty pricePlan.priceList}">
					                            			<c:forEach items="${pricePlan.priceList}" var="price">
					                            				<td style="padding-top: 10px;">
					                            					<p><c:choose><c:when test="${not empty price.basePrice}">${price.basePrice}</c:when><c:otherwise>--</c:otherwise></c:choose></p>
					                            					<p><c:choose><c:when test="${not empty price.saleBPrice}">${price.saleBPrice}</c:when><c:otherwise>--</c:otherwise></c:choose></p>
					                            					<p><c:choose><c:when test="${not empty price.ctripPrice}">${price.ctripPrice}</c:when><c:otherwise>--</c:otherwise></c:choose></p>
					                            					<p>
					                            						<c:choose><c:when test="${not empty price.totalQuotaCount}">${price.totalQuotaCount}</c:when><c:otherwise>--</c:otherwise></c:choose>/
					                            						<c:choose><c:when test="${not empty price.surplusQuotaCount}">${price.surplusQuotaCount}</c:when><c:otherwise>--</c:otherwise></c:choose>
					                            					</p>
					                            				</td>
					                            			</c:forEach>
					                            		</c:if>
					                            		<td style="padding-top: 10px;">
					                            			<p style="color: #FF6000; padding-top: 5px;padding-bottom: 5px;font-size: 13px;"><a href="javascript:editPricePlan(${pricePlan.priceplanId});" >编辑产品</a></p>
					                            			<p style="color: #FF6000; padding-top: 5px;padding-bottom: 5px;font-size: 13px;"><a href="javascript:delPricePlan(${pricePlan.priceplanId});">删除产品</a></p>
					                            		</td>
					                            	</tr>
				                            	</c:forEach>
			                            	</c:if>
			                            	</tbody>
			                            </table>
			                        </td>
			                    </tr>
	                    	</c:forEach>
	                    </c:if>
                	</table>
                </div>
                <div class="table-list-footer " >
                    <div class="main_kkpager m_t10 ">
                        <div id="kkpager" class="page_turning"></div>
                    </div>
                </div>
        </div>
    </div>
</div>
</body>
</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/jquery.form.js"></script>
<script src="<%=basePath%>js/jquery-labelauty.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/timebar.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
<script>
	var zindex = 1024;
    $(function () {
        var pageNo = $("#currentPage").val();
        var totalPage = $("#totalPage").val();
        var totalRecords = $("#totalCount").val();
        var hotelId = $('input[name="hotelId"]').val();
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

                queryRoomTypeList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });
		var saleDate = $('input[name="saleDate"]').val();
		if (saleDate) {
			timebar.init("timebar",null, new Date(saleDate));
		} else {
			timebar.init("timebar",null,null);
		}
        $('input[name="saleDate"]').datepicker({
            changeMonth: true,
            changeYear: true
    	});
        if (hotelId) {
	        initRoomAutocomplete(hotelId);
        }
    });
    function chkAll(thiz) {
    	var roomTypeId = $(thiz).val();
    	var id = '#roomTypeId_'+roomTypeId;
    	if ($(thiz).is(':checked')) {
    		$('input[name="pricePlanId"]', id).prop('checked',true);
    	} else {
    		$('input[name="pricePlanId"]', id).prop('checked',false);
    	}
    }
    function chkRoomTypeAll(thiz) {
    	if ($(thiz).is(':checked')) {
    		$('input[name="roomTypeId"]').each(function(){
    			var roomTypeId = $(this).val();
    			var id = '#roomTypeId_'+roomTypeId;
    			$(this).prop('checked',true);
    			$('input[name="pricePlanId"]', id).prop('checked',true);
    		});
    	} else {
    		$('input[name="roomTypeId"]').each(function(){
    			var roomTypeId = $(this).val();
    			var id = '#roomTypeId_'+roomTypeId;
    			$(this).prop('checked',false);
    			$('input[name="pricePlanId"]', id).prop('checked',false);
    		});
    	}
    }
    //新增房型
    $('.addRoom').on('click', function () {
        var hotelId = $('input[name="hotelId"]').val();
        $.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{hotelId:hotelId},
	        url : projectPath+'admin/toAddRoom',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '新增房型',
	                    content: data,
	                    width: 630,
	                    height:500,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var da = {};
	                    			var roomName = $('input[name="roomName"]','#roomDialog').val();
	                    			var descp = $('textarea[name="descp"]','#roomDialog').val();
	                    			var isOpen = $('input[name="setRoom"]:checked','#roomDialog').val();
	                    			var roomLimit = $('input[name="roomLimit"]','#roomDialog').val();
	                    			var bedArr = [];
	                    			if(!roomName){
	                    	            new Tip({msg: "房型名称为空", timer: 1000, type:2 });
	                    	            return false;
	                    	        }
	                    			var reg = /^[0-9]*$/;
	                    			if (roomLimit) {
										if (!reg.test(roomLimit)) {
											new Tip({msg : '请输入整数',timer : 3000,type : 2});
											return false;
										}
		                    		}
	                    			$('input[name="bedType"]:checked','#roomDialog').each(function(){
	                    				bedArr.push($(this).val());
	                    			});
	                    			da.hotelId = hotelId;
	                    			da.roomName = roomName;
	                    			da.descp = descp;
	                    			da.isOpen = isOpen;
	                    			da.bedType = bedArr.join(',');
	                    			if (isOpen == 1) {
		                    			da.roomLimit = roomLimit;
		                    		}
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/addRoom',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '新增房型成功',timer: 3000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	                var di = $('#roomDialog');
	        		$(':input','.dowebok').labelauty();
	        		$('input[name="setRoom"]',di).on('click',function(){
						var val = $(this).val();
						if (val == 1) {
							$('#roomLimitTarget',di).show();
						} else {
							$('#roomLimitTarget',di).hide();
						}
		        	});
	        	}
	        }
    	});
    });
    
    //批量改价
    $('.batchUpdatePrice').on('click', function () {
        var pricePlanIds = [];
        $('input[name="pricePlanId"]:checked').each(function(k,v){
        	pricePlanIds.push($(v).val());
        });
        if (pricePlanIds.length <= 0) {
        	new Tip({msg : '请选择要调价的产品',timer : 3000,type : 2});
        	return false;
        }
        $.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{pricePlanIdList:pricePlanIds},
	        url : projectPath+'admin/toBatchSetPrice',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '批量调价',
	                    content: data,
	                    width: 1150,
	                    height:400,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var col = [];
	                    			$('input[name="standardPrice"]:checked',di).each(function(k,v){
	                    				col.push($(v).val());
	                    			});
	            	        		var price = [];
	            	        		var flag = true;
            	        			var flagMessage = '';
	            	        		$('input[name="pricePlanId"]',di).each(function(){
	            	        			var pricePlanId = $(this).val();
	            	        			var weeks = [];
	            	        			var row = $(this).parent().parent();
	            	        			var beginDate = $('input[name="beginDate"]',row).val();
	            	        			var endDate = $('input[name="endDate"]',row).val();
	            	        			$('input[name="week"]:checked',row).each(function(k,v){
	            	        				weeks.push($(v).val());
	            	        			});
	            	        			var basePrice = $('input[name="basePrice"]',row).val();
	            	        			var saleBPriceSelect = $('select[name="saleBPriceSelect"]',row).val();
	            	        			var saleBPrice = $('input[name="saleBPrice"]',row).val();
	            	        			var ctripSalePriceSelect = $('select[name="ctripSalePriceSelect"]',row).val();
	            	        			var ctripSalePrice = $('input[name="ctripSalePrice"]',row).val();
	            	        			var groupSalePrice = $('input[name="groupSalePrice"]',row).val();
	            	        			var groupBasePrice = $('input[name="groupBasePrice"]',row).val();
	            	        			var pri = {};
	            	        			if (!beginDate) {
	            	        				flag = false;
	            	        				flagMessage = '请选择开始日期';
	            	        				return false;
	            	        			}
	            	        			if (!endDate) {
	            	        				flag = false;
	            	        				flagMessage = '请选择结束日期'
	            	        				return false;
	            	        			}
	            	        			if (weeks.length == 0) {
	            	        				flag = false;
	            	        				flagMessage = '请选择星期'
	            	        				return false;
	            	        			}
	            	        			var reg = /^[+]?\d*\.?\d{1,2}$/;
	            	        			if (basePrice) {
		            	        			if (!reg.test(basePrice)) {
		            	        				flag = false;
		            	        				flagMessage = '底价只能输入数字'
		            	        		        return false;
		            	        			}
	            	        			}
            	        				if (groupSalePrice) {
		            	        			if (!reg.test(groupSalePrice)) {
		            	        				flag = false;
		            	        				flagMessage = '团房售价只能输入数字'
		            	        		        return false;
		            	        			}
	            	        			}
            	        				if (groupBasePrice) {
		            	        			if (!reg.test(groupBasePrice)) {
		            	        				flag = false;
		            	        				flagMessage = '团房底价只能输入数字'
		            	        		        return false;
		            	        			}
	            	        			}
            	        				pri.groupSalePrice = groupSalePrice;
            	        				pri.groupBasePrice = groupBasePrice;
	            	        			pri.pricePlanId = pricePlanId;
	            	        			pri.beginDate = beginDate;
	            	        			pri.endDate = endDate;
	            	        			pri.weeks = weeks;
	            	        			pri.basePrice = basePrice;
	            	        			if (col.length > 0) {
	            	        				$.each(col,function(k,v){
	            	        					if (v === 'b2bSale') {
	            	        						if (!saleBPrice) {
	            	        							if (saleBPriceSelect === 'multiply') {
	            	        								flagMessage = '请输入同行售价百分比'
	            	        								flag = false;
	            	            	        				return false;
	            	        							} else {
	            	        								flagMessage = '请输入同行售价金额';
	            	        								flag = false;
	            	            	        				return false;
	            	        							}
	            	        						}
	            	        						if (!reg.test(saleBPrice)) {
	            	        							if (saleBPriceSelect === 'multiply') {
		    		            	        				flagMessage = '同行售价百分比只能输入数字';
		    		            	        				flag = false;
		    		            	        		        return false;
	            	        							} else {
	            	        								flagMessage = '同行售价只能输入数字';
	            	        								flag = false;
		    		            	        		        return false;
	            	        							}
	    		            	        			}
	            	        						pri.saleBPriceSelect = saleBPriceSelect;
	            	        						pri.saleBPrice = saleBPrice;
	            	        					}
	            	        					if (v === 'ctripSale') {
	            	        						if (!ctripSalePrice) {
	            	        							if (ctripSalePriceSelect === 'multiply') {
	            	        								flagMessage = '请输入携程售价百分比';
	            	        								flag = false;
	            	            	        				return false;
	            	        							} else {
	            	        								flagMessage = '请输入携程售价金额';
	            	        								flag = false;
	            	            	        				return false;
	            	        							}
	            	        						}
	            	        						if (!reg.test(ctripSalePrice)) {
	            	        							if (ctripSalePriceSelect === 'multiply') {
		    		            	        				flagMessage = '携程售价百分比只能输入数字';
		    		            	        				flag = false;
		    		            	        		        return false;
	            	        							} else {
	            	        								flagMessage = '携程售价只能输入数字';
	            	        								flag = false;
		    		            	        		        return false;
	            	        							}
	    		            	        			}
	            	        						pri.ctripSalePriceSelect = ctripSalePriceSelect;
	            	        						pri.ctripSalePrice = ctripSalePrice;
	            	        					}
	            	        				});
	            	        			}
	            	        			price.push(pri);
	            	        		});
	            	        		if (!flag) {
            	        				new Tip({ msg: flagMessage,timer: 1000,type: 2 });
            	        				return false;
            	        			}
	            	        		F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/batchSetPrice',
	                    				data:JSON.stringify(price),
	                    				success : function(data) {
	                    					F.loading.remove();
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '批量调价成功',timer: 3000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    						return false;
	                    					}
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#batchSetPriceDialog');
	        		$('input[name="pricePlanId"]',di).each(function(){
	        			var pricePlanId = $(this).val();
	        			var row = $(this).parent().parent();
	        			//绑定开始和结束日期
		        		$('input[name="beginDate"]',row).datepicker({
		        	        changeMonth: true,
		        	        changeYear: true,
		        	        numberOfMonths:2,
		        			onSelect: function(dateText, inst){
		        				$('input[name="endDate"]',row).datepicker( "option", "minDate", dateText );
		        			}
		        		});
		        		$('input[name="endDate"]',row).datepicker({
		        	        changeMonth: true,
		        	        changeYear: true,
		        	        numberOfMonths:2,
		        			onSelect: function(dateText, inst){
		        				$('input[name="beginDate"]',row).datepicker( "option", "maxDate", dateText );
		        			}
		        		});
	        			//绑定B2B调售价
		        		$('select[name="saleBPriceSelect"]',row).bind('change',function(){
		        			var val = $(this).val();
		        			if (val !== 'multiply') {
		        				$('input[name="saleBPrice"]',row).val('');
		        			} else {
		        				$('input[name="saleBPrice"]',row).val(1);
		        			}
		        		});
	        			//绑定携程调售价
		        		$('select[name="ctripSalePriceSelect"]',row).bind('change',function(){
		        			var val = $(this).val();
		        			if (val !== 'multiply') {
		        				$('input[name="ctripSalePrice"]',row).val('');
		        			} else {
		        				$('input[name="ctripSalePrice"]',row).val(1);
		        			}
		        		});
	        		});
	        		$('input[name="standardPrice"]',di).each(function(k,v){
	        			if ($(v).is(':checked')) {
	        				$('.'+$(v).val()).show();
	        			} else {
	        				$('.'+$(v).val()).hide();
	        			}
        			});
	        		$('input[name="standardPrice"]',di).on('click',function(){
        				if ($(this).is(':checked')) {
        					$('.'+$(this).val()).show();
        				} else {
        					$('.'+$(this).val()).hide();
        				}
        			});
	        		//统一调绑定参数
	        		$('input[name="beginDateAll"]',di).datepicker({
	        	        changeMonth: true,
	        	        changeYear: true,
	        	        numberOfMonths:2,
	        			onSelect: function(dateText, inst){
	        				$('input[name="beginDate"]',di).datepicker('setDate', dateText);
	        				$('input[name="endDateAll"]',di).datepicker( "option", "minDate", dateText ); 
	        				$('input[name="endDate"]',di).datepicker("option", "minDate", dateText);
	        			}
	        		});
	        		$('input[name="endDateAll"]',di).datepicker({
	        	        changeMonth: true,
	        	        changeYear: true,
	        	        numberOfMonths:2,
	        			onSelect: function(dateText, inst){
	        				$('input[name="endDate"]',di).datepicker('setDate', dateText);
	        				$('input[name="beginDateAll"]',di).datepicker( "option", "maxDate", dateText );
	        				$('input[name="beginDate"]',di).datepicker( "option", "maxDate", dateText );
	        			}
	        		});
	        		$('input[name="weekTitleAll"]',di).prop('checked',true);
	        		$('input[name="weekAll"]',di).prop('checked',true);
	        		$('input[name="weekTitle"]',di).prop('checked',true);
	        		$('input[name="week"]',di).prop('checked',true);
	        		$('input[name="basePriceAll"]',di).on('blur',function(){
	        			$('input[name="basePrice"]',di).val($(this).val());
	        		});
	        		$('input[name="groupBasePriceAll"]',di).on('blur',function(){
	        			$('input[name="groupBasePrice"]',di).val($(this).val());
	        		});
	        		$('input[name="groupSalePriceAll"]',di).on('blur',function(){
	        			$('input[name="groupSalePrice"]',di).val($(this).val());
	        		});
	        		$('select[name="saleBPriceSelectAll"]',di).on('change',function(){
	        			$('select[name="saleBPriceSelect"]',di).val($(this).val());
	        		});
	        		$('select[name="ctripSalePriceSelectAll"]',di).on('change',function(){
	        			$('select[name="ctripSalePriceSelect"]',di).val($(this).val());
	        		});
	        		$('input[name="saleBPriceAll"]',di).on('blur',function(){
	        			$('input[name="saleBPrice"]',di).val($(this).val());
	        		});
	        		$('input[name="ctripSalePriceAll"]',di).on('blur',function(){
	        			$('input[name="ctripSalePrice"]',di).val($(this).val());
	        		});
	        	}
	        }
    	});
    });
    
    function checkTitleAll(thiz, id) {
    	var di = $('#'+id);
		if($(thiz).is(':checked')) {
			$('input[name="weekTitleAll"]',di).prop('checked',true);
			$('input[name="weekTitle"]',di).prop('checked',true);
			$('input[name="weekAll"]',di).prop('checked',true);
			$('input[name="week"]',di).prop('checked',true);
		} else {
			$('input[name="weekTitleAll"]',di).prop('checked',false);
			$('input[name="weekTitle"]',di).prop('checked',false);
			$('input[name="weekAll"]',di).prop('checked',false);
			$('input[name="week"]',di).prop('checked',false);
		}
    }
    
    function checkWeekAll(thiz,id) {
    	var di = $('#'+id);
		var val = $(thiz).val();
		if($(thiz).is(':checked')) {
			if (val === '周一') {
				$('.mon',di).prop('checked',true);
				$('.monAll',di).prop('checked',true);
			} else if (val === '周二') {
				$('.tue',di).prop('checked',true);
				$('.tueAll',di).prop('checked',true);
			} else if (val === '周三') {
				$('.wed',di).prop('checked',true);
				$('.wedAll',di).prop('checked',true);
			} else if (val === '周四') {
				$('.thu',di).prop('checked',true);
				$('.thuAll',di).prop('checked',true);
			} else if (val === '周五') {
				$('.fri',di).prop('checked',true);
				$('.friAll',di).prop('checked',true);
			} else if (val === '周六') {
				$('.sat',di).prop('checked',true);
				$('.satAll',di).prop('checked',true);
			} else if (val === '周日') {
				$('.sun',di).prop('checked',true);
				$('.sunAll',di).prop('checked',true);
			}
		} else {
			if (val === '周一') {
				$('.mon',di).prop('checked',false);
				$('.monAll',di).prop('checked',false);
			} else if (val === '周二') {
				$('.tue',di).prop('checked',false);
				$('.tueAll',di).prop('checked',false);
			} else if (val === '周三') {
				$('.wed',di).prop('checked',false);
				$('.wedAll',di).prop('checked',false);
			} else if (val === '周四') {
				$('.thu',di).prop('checked',false);
				$('.thuAll',di).prop('checked',false);
			} else if (val === '周五') {
				$('.fri',di).prop('checked',false);
				$('.friAll',di).prop('checked',false);
			} else if (val === '周六') {
				$('.sat',di).prop('checked',false);
				$('.satAll',di).prop('checked',false);
			} else if (val === '周日') {
				$('.sun',di).prop('checked',false);
				$('.sunAll',di).prop('checked',false);
			}
			$('input[name="weekTitleAll"]',di).prop('checked',false);
			$('input[name="weekTitle"]',di).prop('checked',false);
		}
    }
    
    function checkWeekTitle(thiz) {
    	var row = $(thiz).parent().parent().parent();
    	//绑定星期全选
   		if($(thiz).is(':checked')) {
			$('input[name="week"]',row).prop('checked',true);
		} else {
			$('input[name="week"]',row).prop('checked',false);
		}
    }
    
    function checkWeek(thiz) {
    	var row = $(thiz).parent().parent().parent();
    	//绑定星期全选
   		if(!$(thiz).is(':checked')) {
			$('input[name="weekTitle"]',row).prop('checked',false);
		}
    }
    
	//批量调房
    $('.batchUpdateQuota').on('click', function () {
    	var pricePlanIds = [];
        $('input[name="pricePlanId"]:checked').each(function(k,v){
        	pricePlanIds.push($(v).val());
        });
        if (pricePlanIds.length <= 0) {
        	new Tip({msg : '请选择要调房的产品',timer : 3000,type : 2});
        	return false;
        }
        $.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{pricePlanIdList:pricePlanIds},
	        url : projectPath+'admin/toBatchSetQuota',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '批量调房',
	                    content: data,
	                    width: 1130,
	                    height:400,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var col = [];
	                    			$('input[name="standardQuota"]:checked',di).each(function(k,v){
	                    				col.push($(v).val());
	                    			});
	                    			if (col.length <= 0) {
	                    				new Tip({ msg: '请选择调整内容',timer: 1000,type: 2 });
            	        				return false;
	                    			}
	            	        		var quotaList = [];
	            	        		var flag = true;
            	        			var flagMessage = '';
	            	        		$('input[name="pricePlanId"]',di).each(function(){
	            	        			var pricePlanId = $(this).val();
	            	        			var weeks = [];
	            	        			var row = $(this).parent().parent();
	            	        			var quotaAccountId = $('input[name="quotaAccountId"]',row).val();
	            	        			var roomTypeId = $('input[name="roomTypeId"]',row).val();
	            	        			var beginDate = $('input[name="beginDate"]',row).val();
	            	        			var endDate = $('input[name="endDate"]',row).val();
	            	        			$('input[name="week"]:checked',row).each(function(k,v){
	            	        				weeks.push($(v).val());
	            	        			});
	            	        			var quotaCount = $('input[name="quotaCount"]',row).val();
	            	        			var quotaCountSelect = $('select[name="quotaCountSelect"]',row).val();
	            	        			var quotaLimit = $('select[name="quotaLimitSelect"]',row).val();
	            	        			var quota = {};
	            	        			if (!beginDate) {
	            	        				flag = false;
	            	        				flagMessage = '请选择开始日期';
	            	        				return false;
	            	        			}
	            	        			if (!endDate) {
	            	        				flag = false;
	            	        				flagMessage = '请选择结束日期'
	            	        				return false;
	            	        			}
	            	        			if (weeks.length == 0) {
	            	        				flag = false;
	            	        				flagMessage = '请选择星期'
	            	        				return false;
	            	        			}
	            	        			var reg = /^\+?[1-9][0-9]*$/;
	            	        			quota.quotaAccountId = quotaAccountId;
	            	        			quota.roomTypeId = roomTypeId;
	            	        			quota.pricePlanId = pricePlanId;
	            	        			quota.beginDate = beginDate;
	            	        			quota.endDate = endDate;
	            	        			quota.weeks = weeks;
            	        				$.each(col,function(k,v){
            	        					if (v === 'quotaCount') {
            	        						if (!quotaCount) {
           	        								flagMessage = '请输入可售数量';
           	        								flag = false;
           	            	        				return false;
            	        						}
            	        						if (!reg.test(quotaCount)) {
           	        								flagMessage = '可售数量只能输入数字';
           	        								flag = false;
    		            	        		        return false;
    		            	        			}
            	        						quota.quotaCountSelect = quotaCountSelect;
            	        						quota.quotaCount = quotaCount;
            	        					}
            	        					if (v === 'quotaLimit') {
            	        						quota.quotaLimit = quotaLimit;
            	        					}
            	        				});
	            	        			quotaList.push(quota);
	            	        		});
	            	        		if (!flag) {
            	        				new Tip({ msg: flagMessage,timer: 1000,type: 2 });
            	        				return false;
            	        			}
	            	        		F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/batchSetQuota',
	                    				data:JSON.stringify(quotaList),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '批量调房成功',timer: 3000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#batchSetQuotaDialog');
	        		$('input[name="pricePlanId"]',di).each(function(){
	        			var pricePlanId = $(this).val();
	        			var row = $(this).parent().parent();
	        			//绑定开始和结束日期
		        		$('input[name="beginDate"]',row).datepicker({
		        	        changeMonth: true,
		        	        changeYear: true,
		        	        numberOfMonths:2,
		        			onSelect: function(dateText, inst){
		        				$('input[name="endDate"]',row).datepicker( "option", "minDate", dateText );
		        			}
		        		});
		        		$('input[name="endDate"]',row).datepicker({
		        	        changeMonth: true,
		        	        changeYear: true,
		        	        numberOfMonths:2,
		        			onSelect: function(dateText, inst){
		        				$('input[name="beginDate"]',row).datepicker( "option", "maxDate", dateText );
		        			}
		        		});
	        			//绑定星期全选
		        		$('input[name="weekTitle"]',row).on('click',function(){
		        			if($(this).is(':checked')) {
		        				$('input[name="week"]',row).prop('checked',true);
		        			} else {
		        				$('input[name="week"]',row).prop('checked',false);
		        			}
		        		});
	        		});
	        		//统一调绑定参数
	        		$('input[name="beginDateAll"]',di).datepicker({
	        	        changeMonth: true,
	        	        changeYear: true,
	        	        numberOfMonths:2,
	        			onSelect: function(dateText, inst){
	        				$('input[name="beginDate"]',di).datepicker('setDate', dateText);
	        				$('input[name="endDateAll"]',di).datepicker( "option", "minDate", dateText ); 
	        				$('input[name="endDate"]',di).datepicker("option", "minDate", dateText);
	        			}
	        		});
	        		$('input[name="endDateAll"]',di).datepicker({
	        	        changeMonth: true,
	        	        changeYear: true,
	        	        numberOfMonths:2,
	        			onSelect: function(dateText, inst){
	        				$('input[name="endDate"]',di).datepicker('setDate', dateText);
	        				$('input[name="beginDateAll"]',di).datepicker( "option", "maxDate", dateText );
	        				$('input[name="beginDate"]',di).datepicker( "option", "maxDate", dateText );
	        			}
	        		});
	        		$('input[name="weekTitleAll"]',di).prop('checked',true);
	        		$('input[name="weekAll"]',di).prop('checked',true);
	        		$('input[name="weekTitle"]',di).prop('checked',true);
	        		$('input[name="week"]',di).prop('checked',true);
	        		$('input[name="standardQuota"]',di).each(function(k,v){
	        			if ($(v).is(':checked')) {
	        				$('.'+$(v).val()).show();
	        			} else {
	        				$('.'+$(v).val()).hide();
	        			}
        			});
	        		$('input[name="standardQuota"]',di).on('click',function(){
        				if ($(this).is(':checked')) {
        					$('.'+$(this).val()).show();
        				} else {
        					$('.'+$(this).val()).hide();
        				}
        			});
	        		$('select[name="quotaCountSelectAll"]',di).on('change',function(){
	        			$('select[name="quotaCountSelect"]',di).val($(this).val());
	        		});
	        		$('select[name="quotaLimitSelectAll"]',di).on('change',function(){
	        			$('select[name="quotaLimitSelect"]',di).val($(this).val());
	        		});
	        		$('input[name="quotaCountAll"]',di).on('blur',function(){
	        			$('input[name="quotaCount"]',di).val($(this).val());
	        		});
	        	}
	        }
    	});
    });
	
	//批量上下架
    $('.batchUpdateSale').on('click', function () {
    	var pricePlanIds = [];
        $('input[name="pricePlanId"]:checked').each(function(k,v){
        	pricePlanIds.push($(v).val());
        });
        if (pricePlanIds.length <= 0) {
        	new Tip({msg : '请选择要上下架的产品',timer : 3000,type : 2});
        	return false;
        }
        $.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{pricePlanIdList:pricePlanIds},
	        url : projectPath+'admin/toBatchSetSale',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '批量上下架',
	                    content: data,
	                    width: 1130,
	                    height:400,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var onSaleList = [];
	                    			$('input[name="pricePlanId"]',di).each(function(){
	                    				var pricePlanId = $(this).val();
	                    				var row = $('#pricePlanId-'+pricePlanId);
	                    				var b2bName = 'b2bOnsale-'+pricePlanId;
	                    				var b2bOnSale = $('input[name="'+b2bName+'"]:checked').val();
	                    				if (b2bOnSale) {
		                    				onSaleList.push({
		                    					pricePlanId:pricePlanId,
		                    					channelCode:'B2B',
		                    					onSale:b2bOnSale
		                    				});
	                    				}
	                    				var ctripName = 'ctripOnsale-'+pricePlanId;
	                    				var ctripOnSale = $('input[name="'+ctripName+'"]:checked').val();
	                    				if (ctripOnSale) {
		                    				onSaleList.push({
		                    					pricePlanId:pricePlanId,
		                    					channelCode:'ctrip',
		                    					onSale:ctripOnSale
		                    				});
	                    				}
	                    			});
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/batchSetOnSale',
	                    				data:JSON.stringify(onSaleList),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '批量上下架成功',timer: 3000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#batchSetSaleDialog');
	        	}
	        }
    	});
    });
	
	function jumpQueryRoomList() {
		var beginDate = $("#dli1 input").val();
		var endDate = $("#dli7 input").val();
		var dt = new Date(endDate);
		var end = new Date(dt.getTime() + 24*60*60*1000);
        var ey = end.getFullYear();
        var em = end.getMonth();
        em = em + 1;
        var ed = end.getDate();
        if (em < 10) {
        	em = '0' + em;
        }
        if (ed < 10) {
        	ed = '0' + ed;
        }
        endDate = ey + '-' + em + '-' + ed;
		var pricePlanIdArr = [];
		$('input[name="pricePlanId"]','.tab-section').each(function(){
			pricePlanIdArr.push($(this).val());
		});
		var da = {
			beginDate:beginDate,
			endDate:endDate,
			pricePlanIdList:pricePlanIdArr
		}
		$.ajax({
			type:'POST',
	        dataType : 'json',
	        contentType : 'application/json; charset=UTF-8',
	        context : document.body,
	        url : projectPath+'admin/jumpQueryRoomList',
	        data:JSON.stringify(da),
	        success : function(data) {
	        	if (data && data.result === 1) {
	        		$.each(data.obj,function(k,v){
	        			$('#pricePlanId_' + v.priceplanId).html(getHtml(v));
	        		});
	        	} else {
	        		new Tip({msg : data.errorReason,timer : 3000,type : 2});
	        	}
	        }
		});
	}
	
	function getHtml(data) {
		var pricePlanStr = '<td><p></p></td><td><p></p><p></p><p></p><p></p></td>';
		if (data && data.priceplanId) {
			pricePlanStr = '<td style="padding-top: 10px;text-align: left;"><p><input type="checkbox" name="pricePlanId" value="'+data.priceplanId+'" style="vertical-align:middle;" />&nbsp;'+data.priceplanName+'</p></td>'+
						'<td style="padding-top: 10px;text-align: left;"><p>底价</p><p>同行价</p><p>携程价</p><p>总/剩</p></td>';
		}
		var str = '<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p>--</p><p>--</p><p>--</p><p>--</p></td>'+
				'<td><p></p></td>';
		if (data.priceList && data.priceList.length > 0) {
			str = '';
			$.each(data.priceList, function(x,y){
				var basePrice = '--', saleBPrice = '--', ctripPrice = '--';
				if (y.basePrice) {
					basePrice = y.basePrice;
				}
				if (y.saleBPrice) {
					saleBPrice = y.saleBPrice;
				}
				if (y.ctripPrice) {
					ctripPrice = y.ctripPrice;
				}
				str += '<td style="padding-top: 10px;"><p>'+basePrice+'</p><p>'+saleBPrice+'</p><p>'+ctripPrice+'</p><p>'+y.totalQuotaCount+'/'+y.surplusQuotaCount+'</p></td>'
			});
			str += '<td style="padding-top: 10px; font-size: 13px;"><p style="color: #FF6000; padding-top: 5px;padding-bottom: 5px;"><a href="javascript:editPricePlan('+data.priceplanId+');">编辑产品</a></p><p style="color: #FF6000; padding-top: 5px;padding-bottom: 5px;"><a href="javascript:delPricePlan('+data.priceplanId+');">删除产品</a></p></td>';
		}
		return pricePlanStr + str;
	}

	$('.delRoom').on('click', function () {
		var roomTypeId = $(this).attr('val');
		var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 352,
            content: '<p>您确定要删除吗</p>',
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
            	$.ajax({
                    type: 'POST',
                    context : document.body,
                    contentType : 'application/json; charset=UTF-8',
                    url: '<%=basePath%>admin/delRoom',
                    data: roomTypeId,
                    dataType: 'json',
                    success: function(rs) {
                        $('.f_ui-loading').hide();
                        if (rs.result == 1) {
                            new Tip({ msg: "删除成功！",timer: 3000, type:1});
                            queryRoomTypeList();
                        } else {
                            new Tip({ msg: rs.message,timer: 3000, type:2});
                        }
                    },
                    error: function(xhr, type) {
                        $('.f_ui-loading').hide();
                        new Tip({ msg: '系统异常',timer: 3000, type:2});
                    }
                });
            },
            cancel: function () {

            }
        }).showModal();
	});

    //新增产品
    $('.addProduct').on('click', function () {
        var hotelId = $('input[name="hotelId"]').val();
        var roomTypeId = $(this).attr('val');
        $.ajax({
        	type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{hotelId:hotelId,roomTypeId:roomTypeId},
	        url : projectPath+'admin/toAddPricePlan',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '新增产品',
	                    content: data,
	                    width: 630,
	                    height:550,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var quotaType,saleBCurrency,saleCCurrency,baseCurrency,priceplanName,supplyCode,breakFastType;
	                    			quotaType = $('input[name="quotaType"]').val();
	                    			baseCurrency = $('input[name="baseCurrency"]').val();
	                    			saleBCurrency = $('input[name="saleBCurrency"]').val();
	                    			priceplanName = $('input[name="priceplanName"]').val();
	                    			supplyCode = $('input[name="supplyCode"]').val();
	                    			breakFastType = $('input[name="breakFastType"]').val();
	                    			if (!quotaType) {
										new Tip({msg: '请选择采购类型', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!baseCurrency) {
	                    				new Tip({msg: '请选择底价币种', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!saleBCurrency) {
	                    				new Tip({msg: '请选择同行价币种', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!priceplanName) {
	                    				new Tip({msg: '请输入价格计划名称', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!supplyCode) {
	                    				new Tip({msg: '请选择供应商', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!breakFastType) {
	                    				new Tip({msg: '请选择早餐', timer: 1000, type:2 });
										return false;
	                    			}
	                    			var da = {
	                    				hotelId:hotelId,
	                    				roomTypeId:roomTypeId,
	                    				quotaType:quotaType,
	                    				baseCurrency:baseCurrency,
	                    				saleBCurrency:saleBCurrency,
	                    				saleCCurrency:saleBCurrency,
	                    				priceplanName:priceplanName,
	                    				supplyCode:supplyCode,
	                    				breakFastType:breakFastType
	                    			};
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/addPricePlan',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '新增产品成功',timer: 1000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#addProductDialog');
	        		supplyAutocomplete(di);
	        		$('.form-list .row',di).children('.list').children('.select-box-value').click(function (event) {
	        		    if ($(this).siblings('.form-list-drop-box').css("display") == "none") {
	        		        $('.form-list-drop-box',di).hide();
	        		        $(this).siblings('.form-list-drop-box').show()
	        		    }
	        		    $('.form-list-drop-box',di).on('click', 'li', function () {
	        		        $(this).parent().parent('.form-list-drop-box').siblings('.select-box-value').val($(this).html());
	        		        $('.form-list-drop-box', di).hide();
	        		    })
	        		    event.stopPropagation();
	        		})
	        		//采购类型下拉框
	        	    $('#quotaTypeSelectBox li', di).on('click',function () {
	        	        $("#quotaType", di).val($(this).attr("value"));
	        	    });

	        	    $('#baseCurrencySelectBox li', di).on('click',function () {
	        	        $("#baseCurrency", di).val($(this).attr("value"));
	        	    });
	        	    
	        	    $('#saleBCurrencySelectBox li', di).on('click',function () {
	        	        $("#saleBCurrency", di).val($(this).attr("value"));
	        	    });
	        	    $('#breakfastSelectBox li', di).on('click',function () {
	        	    	$('#breakFastType',di).val($(this).attr("value"));
	        	        $("#priceplanName", di).val($(this).html());
	        	    });
	        	}
	        }
        });
    });
    
    function supplyAutocomplete(di) {
    	$.ajax({
    		type : 'POST',
    		dataType : 'json',
    		contentType : 'application/json; charset=UTF-8',
    		context : document.body,
    		url : projectPath + 'admin/supplyController/autocomplete',
    		success : function(data) {
    			if (data.result && data.result == 1) {
    			    $( "#supplyName", di).autocomplete({
    			        minLength: 0,
						source: data.obj,
    			        focus: function( event, ui ) {
    			            $( "#supplyName",di ).val( ui.item.label );
    			            return false;
    			        },
    			        select: function( event, ui ) {
    			            $( "#supplyName",di ).val( ui.item.label );
    			            $( "#supplyCode",di ).val( ui.item.value );
    			            if (ui.item && ui.item.settlementCurrency) {
	    			            $('#baseCurrencyInput',di).val(ui.item.settlementCurrency);
	    			            $('#baseCurrency',di).val(ui.item.settlementCurrency);
    			            } else {
    			            	$('#baseCurrencyInput',di).val('');
	    			            $('#baseCurrency',di).val('');
    			            }
    			            if (ui.item && ui.item.isMultipleCurrency != 1) {
    			            	$('#baseCurrencyInput',di).prop('disabled','disabled');
    			            } else {
    			            	$('#baseCurrencyInput',di).removeAttr('disabled');
    			            }
    			            return false;
    			        },
    			        change: function(event, ui) {
    			        	var labelValue = $( "#supplyName",di ).val();
    			        	if (!labelValue) {
    			        		$( "#supplyCode",di ).val( null );
    			        		$('#baseCurrencyInput',di).removeAttr('disabled');
    			            	$('#baseCurrencyInput',di).val('');
    			        	}
    			        	if (!ui.item) {
    			        		$('#baseCurrencyInput',di).removeAttr('disabled');
    			            	$('#baseCurrencyInput',di).val('');
    			        		$( "#supplyCode",di ).val( null );
    			        	}
    			        }
    			    });
    			    zindex += 1;
    			    $('.ui-autocomplete').css('z-index',zindex);
    			    $( "#supplyName",di ).focus(function () {
    			        $(this).autocomplete("search");
    			    });
    			} else {
    				new Tip({
    					msg : data.errorReason,
    					timer : 1000,
    					type : 2
    				});
    			}
    		}
    	});
    }
    
    //修改价格计划
    function editPricePlan(pricePlanId) {
    	if(!pricePlanId) {
    		return false;
    	}
    	$.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        data:{priceplanId:pricePlanId},
	        url : projectPath+'admin/toEditPricePlan',
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '编辑产品',
	                    content: data,
	                    width: 630,
	                    height:500,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var quotaType,saleBCurrency,saleCCurrency,baseCurrency,priceplanName,supplyCode,breakFastType;
	                    			quotaType = $('input[name="quotaType"]',di).val();
	                    			baseCurrency = $('input[name="baseCurrency"]',di).val();
	                    			saleBCurrency = $('input[name="saleBCurrency"]',di).val();
	                    			saleCCurrency = $('input[name="saleCCurrency"]',di).val();
	                    			priceplanName = $('input[name="priceplanName"]',di).val();
	                    			supplyCode = $('input[name="supplyCode"]').val();
	                    			breakFastType = $('input[name="breakFastType"]').val();
	                    			if (!quotaType) {
										new Tip({msg: '请选择采购类型', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!baseCurrency) {
	                    				new Tip({msg: '请选择底价币种', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!saleBCurrency) {
	                    				new Tip({msg: '请选择同行价币种', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!priceplanName) {
	                    				new Tip({msg: '请输入价格计划名称', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!supplyCode) {
	                    				new Tip({msg: '请选择供应商', timer: 1000, type:2 });
										return false;
	                    			}
	                    			if (!breakFastType) {
	                    				new Tip({msg: '请选择早餐', timer: 1000, type:2 });
										return false;
	                    			}
	                    			var da = {
	                    				priceplanId:pricePlanId,
	                    				quotaType:quotaType,
	                    				baseCurrency:baseCurrency,
	                    				saleBCurrency:saleBCurrency,
	                    				saleCCurrency:saleCCurrency,
	                    				priceplanName:priceplanName,
	                    				supplyCode:supplyCode,
	                    				breakFastType:breakFastType
	                    			};
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/editPricePlan',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '编辑产品成功',timer: 1000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#editPricePlanDialog');
	        		supplyAutocomplete(di);
	        		$('.form-list .row',di).children('.list').children('.select-box-value').click(function (event) {
	        		    if ($(this).siblings('.form-list-drop-box').css("display") == "none") {
	        		        $('.form-list-drop-box',di).hide();
	        		        $(this).siblings('.form-list-drop-box').show()
	        		    }
	        		    $('.form-list-drop-box',di).on('click', 'li', function () {
	        		        $(this).parent().parent('.form-list-drop-box').siblings('.select-box-value').val($(this).html());
	        		        $('.form-list-drop-box', di).hide();
	        		    })
	        		    event.stopPropagation();
	        		})
	        		//采购类型下拉框
	        	    $('#quotaTypeSelectBox li', di).on('click',function () {
	        	        $("#quotaType", di).val($(this).attr("value"));
	        	    });

	        	    $('#baseCurrencySelectBox li', di).on('click',function () {
	        	        $("#baseCurrency", di).val($(this).attr("value"));
	        	    });
	        	    
	        	    $('#saleBCurrencySelectBox li', di).on('click',function () {
	        	        $("#saleBCurrency", di).val($(this).attr("value"));
	        	    });
	        	    
	        	    $('#breakfastSelectBox li', di).on('click',function () {
	        	    	$('#breakFastType',di).val($(this).attr("value"));
	        	        $("#priceplanName", di).val($(this).html());
	        	    });
	        	}
	        }
    	});
    }
    
    //删除价格计划
    function delPricePlan(pricePlanId) {
    	if (!pricePlanId) {
    		return false;
    	}
    	var d = dialog({
            title: '提示',
            padding: '30x 20px',
            width: 352,
            content: '<p>您确定要删除吗</p>',
            skin: 'saas_comfirm edit-port-dialog tmc-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
            	var da = {
            		priceplanId:pricePlanId,
            		isActive:0
            	}
            	F.loading.show('mask');
				$.ajax({
					type : 'POST',
					dataType : 'json',
					contentType : 'application/json; charset=UTF-8',
					context : document.body,
					url : projectPath+'admin/setPricePlanActive',
					data:JSON.stringify(da),
					success : function(data) {
						if (data.result && data.result == 1) {
							new Tip({ msg: '删除产品成功',timer: 1000});
							queryRoomTypeList();
						} else {
							new Tip({msg : data.errorReason,timer : 3000,type : 2});
						}
						F.loading.remove();
					}
				});
            },
            cancel: function () {

            }
        }).showModal();
    }

	//开关房设置
    $('.setRoom').on('click', function () {
    	var roomTypeId = $(this).attr('val');
    	$.ajax({
    		type:'POST',
	        dataType : 'html',
	        context : document.body,
	        url : projectPath+'admin/toSetRoom?roomTypeId='+roomTypeId,
	        success : function(data) {
	        	if (data) {
	        		var d = dialog({
	                    title: '开关房设置',
	                    content: data,
	                    width: 300,
	                    height:100,
	                    button:[
	                    	{
	                    		value: '取消',
	                    		callback: function () {
	                    			
	                    		}
	                    	},
	                    	{
	                    		value: '确定',
	                    		callback: function () {
	                    			var isOpen = $('input[name="setRoom"]:checked',di).val();
	                    			var roomLimit = $('input[name="roomLimit"]',di).val();
	                    			var reg = /^[0-9]*$/;
	                    			if (roomLimit) {
										if (!reg.test(roomLimit)) {
											new Tip({msg : '请输入整数',timer : 3000,type : 2});
											return false;
										}
		                    		}
	                    			if (!roomTypeId) {
		                    			console.error('roomTypeId is null');
										return false;
		                    		}
	                    			var da = {
	    	                    		roomTypeId:roomTypeId,
	                    				isOpen:isOpen
	                    			};
	                    			if (isOpen == 1) {
										da.roomLimit = roomLimit;
		                    		}
	                    			F.loading.show('mask');
	                    			$.ajax({
	                    				type : 'POST',
	                    				dataType : 'json',
	                    				contentType : 'application/json; charset=UTF-8',
	                    				context : document.body,
	                    				url : projectPath+'admin/setRoom',
	                    				data:JSON.stringify(da),
	                    				success : function(data) {
	                    					if (data.result && data.result == 1) {
	                    						new Tip({ msg: '设置成功',timer: 1000});
	                    						queryRoomTypeList();
	                    					} else {
	                    						new Tip({msg : data.errorReason,timer : 3000,type : 2});
	                    						return false;
	                    					}
	                    					F.loading.remove();
	                    				}
	                    			});
	                    		},
	                    		autofocus: true
	                    	},
	                    ]
	                }).showModal();
	        		var di = $('#setRoomDialog');
	        		$('input[name="setRoom"]',di).on('click',function(){
						var val = $(this).val();
						if (val == 1) {
							$('#roomLimitTarget',di).show();
						} else {
							$('#roomLimitTarget',di).hide();
						}
		        	});
	        	}
	        }
    	});
    });

    function addPricePlanWithRoom(roomTypeId,roomTypeName){

        var hotelId = $("#project-id").val();
        var hotelName = $("#project").val();
        var param = "hotelId="+hotelId+"&hotelName="+hotelName+"&roomTypeId="+roomTypeId+"&roomTypeName="+roomTypeName;
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toAddPricePlan?'+param);

    }

    function queryRoomTypeList(){
    	var saleDate = $('input[name="saleDate"]').val();
    	if (saleDate) {
	    	timebar.showTime(new Date(saleDate));
	    	$("#dli1 input").val(saleDate);
    	}
        $('input[name="beginDate"]').val($("#dli1 input").val());
        var endDate = $("#dli7 input").val();
		var dt = new Date(endDate);
		var end = new Date(dt.getTime() + 24*60*60*1000);
        var ey = end.getFullYear();
        var em = end.getMonth();
        em = em + 1;
        var ed = end.getDate();
        if (em < 10) {
        	em = '0' + em;
        }
        if (ed < 10) {
        	ed = '0' + ed;
        }
        endDate = ey + '-' + em + '-' + ed;
        $('input[name="endDate"]').val(endDate);
        $("#roomForm").submit();
    }

    // 编辑酒店信息
    function editRoomInfo(roomTypeId) {
        $(window.parent.document).find(".product-manage").children().attr('src','<%=basePath%>admin/toEditRoom?roomTypeId='+roomTypeId);
    }
    
    function uuid() {
    	var s = [];
    	var hexDigits = "0123456789abcdef";
    	for (var i = 0; i < 36; i++) {
    		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    	}
    	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
    														// clock_seq_hi_and_reserved
    														// to 01
    	s[8] = s[13] = s[18] = s[23] = "-";

    	var uuid = s.join("");
    	return uuid;
    }
    
    function addDetail(thiz) {
    	var tr = $(thiz).parent().parent().parent(), channel = [];
    	var pricePlanId = $('input[name="pricePlanId"]',tr).val();
    	$('#del',tr).show();
    	$('input[name="standardPrice"]:checked').each(function() {
    		channel.push($(this).val());
    	});
    	var titles = $('.pricePlanId-'+pricePlanId, '#batchSetPriceDialog');
    	if (titles.length > 2) {
    		new Tip({ msg: '日期段最多只能添加3个',timer: 2000, type:2});
    		return false;
    	}
    	if (titles.length > 0) {
    		var td = $(titles[0]).find('td');
    		$(td[0]).prop('rowspan',titles.length+1);
    	}
    	var beginDate = $('input[name="beginDate"]',tr).val();
    	var endDate = $('input[name="endDate"]',tr).val();
    	var uid = uuid();
    	var trStr = '<tr class="pricePlanId-'+pricePlanId+'" id="'+uid+'">';
    	trStr += '<td align="left">';
    	trStr += '<input name="pricePlanId" type="hidden" value="'+pricePlanId+'" />';
    	trStr +=	'<input name="beginDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />--<input name="endDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />';
    	if ($('input[name="weekTitle"]',tr).prop('checked')) {
	    	trStr +=	' <label class="price_label"><input name="weekTitle" type="checkbox" checked value="all" onclick="checkWeekTitle(this);" />全</label>';
    	} else {
    		trStr +=	' <label class="price_label"><input name="weekTitle" type="checkbox" value="all" onclick="checkWeekTitle(this);" />全</label>';
    	}
    	$('input[name="week"]',tr).each(function(k,v){
    		var check = $(v).prop('checked');
    		var val = $(v).val()
    		if (val === '周一') {
    			if (check) {
	    			trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="mon" checked value="周一" onclick="checkWeek(this)" />一</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="mon" value="周一" onclick="checkWeek(this)" />一</label>';
    			}
    		} else if (val === '周二') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="tue" checked value="周二" onclick="checkWeek(this)" />二</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="tue" value="周二" onclick="checkWeek(this)" />二</label>';
    			}
    		} else if (val === '周三') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="wed" checked value="周三" onclick="checkWeek(this)" />三</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="wed" value="周三" onclick="checkWeek(this)" />三</label>';
    			}
    		} else if (val === '周四') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="thu" checked value="周四" onclick="checkWeek(this)" />四</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="thu" value="周四" onclick="checkWeek(this)" />四</label>';
    			}
    		} else if (val === '周五') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="fri" checked value="周五" onclick="checkWeek(this)" />五</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="fri" value="周五" onclick="checkWeek(this)" />五</label>';
    			}
    		} else if (val === '周六') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sat" checked value="周六" onclick="checkWeek(this)" />六</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sat" value="周六" onclick="checkWeek(this)" />六</label>';
    			}
    		} else if (val === '周日') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sun" checked value="周日" onclick="checkWeek(this)" />日</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sun" value="周日" onclick="checkWeek(this)" />日</label>';
    			}
    		}
    	});
    	trStr +=	' <span>';
    	trStr +=		' <img src="../images/u2096.png" id="add" onMouseOver="this.src=\'../images/u2096_mouseOver.png\'" onMouseOut="this.src=\'../images/u2096.png\'" onclick="addDetail(this);" />';
    	trStr +=		' <img src="../images/u1209.png" id="del" onMouseOver="this.src=\'../images/u1209_mouseOver.png\'" onMouseOut="this.src=\'../images/u1209.png\'" onclick="delDetail(this);" />';
    	trStr +=	'</span>';
    	trStr +='</td>';
    	trStr +='<td><input name="basePrice" type="text" class="number_input" style="width: 80%;" /></td>';
    	trStr +='<td><input name="groupBasePrice" type="text" class="number_input" style="width: 80%;" /></td>';
    	trStr +='<td><input name="groupSalePrice" type="text" class="number_input" style="width: 80%;" /></td>';
    	trStr +='<td class="b2bSale" style="display: none;">';
    	trStr +=	'<select id="saleBPriceSelect" name="saleBPriceSelect" class="price_select" style="width:50%">';
    	trStr +=		'<option value="add">加数值</option>';
    	trStr +=		'<option value="multiply">加百分比</option>';
    	trStr +=		'<option value="subtract">减数值</option>';
    	trStr +=		'<option value="equals">设置为</option>';
    	trStr +=	'</select>';
    	trStr +=	'<input name="saleBPrice" type="text" class="number_input" value="" style="width:45%" />';
    	trStr +='</td>';
    	trStr +='<td class="ctripSale" style="display: none;">';
    	trStr +=	'<select id="ctripSalePriceSelect" name="ctripSalePriceSelect" class="price_select" style="width:50%">';
    	trStr +=		'<option value="add">加数值</option>';
    	trStr +=		'<option value="multiply">加百分比</option>';
    	trStr +=		'<option value="subtract">减数值</option>';
    	trStr +=		'<option value="equals">设置为</option>';
    	trStr +=	'</select>';
    	trStr +=	'<input name="ctripSalePrice" type="text" class="number_input" value="" style="width:45%" />';
    	trStr +='</td></tr>';
    	tr.after(trStr);
    	$('input[name="beginDate"]','#'+uid).datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths:2,
			onSelect: function(dateText, inst){
				$('input[name="endDate"]','#'+uid).datepicker( "option", "minDate", dateText );
			}
		});
    	$('input[name="beginDate"]','#'+uid).datepicker('setDate', beginDate);
		$('input[name="endDate"]','#'+uid).datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths:2,
			onSelect: function(dateText, inst){
				$('input[name="beginDate"]','#'+uid).datepicker( "option", "maxDate", dateText );
			}
		});
		$('input[name="endDate"]','#'+uid).datepicker('setDate', endDate);
    	if (channel.length > 0) {
    		$.each(channel, function(k,v){
    			if (v === 'b2bSale') {
    				$('.b2bSale').show();
    			} else if (v === 'ctripSale') {
    				$('.ctripSale').show();
    			}
    		})
    	}
    }
    function addQuotaDetail(thiz) {
    	var tr = $(thiz).parent().parent().parent(), standardQuota = [];
    	var pricePlanId = $('input[name="pricePlanId"]',tr).val();
    	var quotaAccountId = $('input[name="quotaAccountId"]',tr).val();
    	var roomTypeId = $('input[name="roomTypeId"]',tr).val();
    	$('#del',tr).show();
    	$('input[name="standardQuota"]:checked').each(function() {
    		standardQuota.push($(this).val());
    	});
    	var titles = $('.pricePlanId-'+pricePlanId, '#batchSetQuotaDialog');
    	if (titles.length > 2) {
    		new Tip({ msg: '日期段最多只能添加3个',timer: 2000, type:2});
    		return false;
    	}
    	if (titles.length > 0) {
    		var td = $(titles[0]).find('td');
    		$(td[0]).prop('rowspan',titles.length+1);
    	}
    	var beginDate = $('input[name="beginDate"]',tr).val();
    	var endDate = $('input[name="endDate"]',tr).val();
    	var uid = uuid();
    	var trStr = '<tr class="pricePlanId-'+pricePlanId+'" id="'+uid+'">';
    	trStr += '<td align="left">';
    	trStr += '<input name="pricePlanId" type="hidden" value="'+pricePlanId+'" />';
    	trStr += '<input name="quotaAccountId" type="hidden" value="'+quotaAccountId+'" />';
    	trStr += '<input name="roomTypeId" type="hidden" value="'+roomTypeId+'" />';
    	trStr +=	'<input name="beginDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />--<input name="endDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />';
    	if ($('input[name="weekTitle"]',tr).prop('checked')) {
	    	trStr +=	' <label class="price_label"><input name="weekTitle" type="checkbox" checked value="all" onclick="checkWeekTitle(this);" />全</label>';
    	} else {
    		trStr +=	' <label class="price_label"><input name="weekTitle" type="checkbox" value="all" onclick="checkWeekTitle(this);" />全</label>';
    	}
    	$('input[name="week"]',tr).each(function(k,v){
    		var check = $(v).prop('checked');
    		var val = $(v).val()
    		if (val === '周一') {
    			if (check) {
	    			trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="mon" checked value="周一" onclick="checkWeek(this)" />一</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="mon" value="周一" onclick="checkWeek(this)" />一</label>';
    			}
    		} else if (val === '周二') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="tue" checked value="周二" onclick="checkWeek(this)" />二</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="tue" value="周二" onclick="checkWeek(this)" />二</label>';
    			}
    		} else if (val === '周三') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="wed" checked value="周三" onclick="checkWeek(this)" />三</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="wed" value="周三" onclick="checkWeek(this)" />三</label>';
    			}
    		} else if (val === '周四') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="thu" checked value="周四" onclick="checkWeek(this)" />四</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="thu" value="周四" onclick="checkWeek(this)" />四</label>';
    			}
    		} else if (val === '周五') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="fri" checked value="周五" onclick="checkWeek(this)" />五</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="fri" value="周五" onclick="checkWeek(this)" />五</label>';
    			}
    		} else if (val === '周六') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sat" checked value="周六" onclick="checkWeek(this)" />六</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sat" value="周六" onclick="checkWeek(this)" />六</label>';
    			}
    		} else if (val === '周日') {
    			if (check) {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sun" checked value="周日" onclick="checkWeek(this)" />日</label>';
    			} else {
    				trStr +=	' <label class="price_label"><input name="week" type="checkbox" class="sun" value="周日" onclick="checkWeek(this)" />日</label>';
    			}
    		}
    	});
    	trStr +=	' <span>';
    	trStr +=		' <img src="../images/u2096.png" id="add" onMouseOver="this.src=\'../images/u2096_mouseOver.png\'" onMouseOut="this.src=\'../images/u2096.png\'" onclick="addQuotaDetail(this);" />';
    	trStr +=		' <img src="../images/u1209.png" id="del" onMouseOver="this.src=\'../images/u1209_mouseOver.png\'" onMouseOut="this.src=\'../images/u1209.png\'" onclick="delQuotaDetail(this);" />';
    	trStr +=	'</span>';
    	trStr +='</td>';
    	trStr +='<td class="quotaCount" style="display: none;">';
    	trStr +=	'<select id="quotaCountSelect" name="quotaCountSelect" class="price_select" style="width:50%">';
    	trStr +=		'<option value="add">加数值</option>';
    	trStr +=		'<option value="subtract">减数值</option>';
    	trStr +=		'<option value="equals">设置为</option>';
    	trStr +=	'</select>';
    	trStr +=	'<input name="quotaCount" type="text" class="number_input" style="width:45%" />';
    	trStr +='</td>';
    	trStr +='<td class="quotaLimit" style="display: none;">';
    	trStr +=	'<select id="quotaLimitSelect" name="quotaLimitSelect" class="price_select" style="width: 90%;">';
    	trStr +=		'<option value="">不变</option>';
    	trStr +=		'<option value="hasNotOver">有房不可超</option>';
    	trStr +=		'<option value="hasOver">有房可超</option>';
    	trStr +=		'<option value="ask">待查</option>';
    	trStr +=		'<option value="noRoom">满房</option>';
    	trStr +=		'<option value="freeSale">FreeSale</option>';
    	trStr +=	'</select>';
    	trStr +='</td></tr>';
    	tr.after(trStr);
    	$('input[name="beginDate"]','#'+uid).datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths:2,
			onSelect: function(dateText, inst){
				$('input[name="endDate"]','#'+uid).datepicker( "option", "minDate", dateText );
			}
		});
    	$('input[name="beginDate"]','#'+uid).datepicker('setDate', beginDate);
		$('input[name="endDate"]','#'+uid).datepicker({
	        changeMonth: true,
	        changeYear: true,
	        numberOfMonths:2,
			onSelect: function(dateText, inst){
				$('input[name="beginDate"]','#'+uid).datepicker( "option", "maxDate", dateText );
			}
		});
		$('input[name="endDate"]','#'+uid).datepicker('setDate', endDate);
    	if (standardQuota.length > 0) {
    		$.each(standardQuota, function(k,v){
    			if (v === 'quotaCount') {
    				$('.quotaCount').show();
    			} else if (v === 'quotaLimit') {
    				$('.quotaLimit').show();
    			}
    		})
    	}
    }
    
    function delDetail(thiz) {
    	var row = $(thiz).parent().parent().parent();
    	var pricePlanId = $('input[name="pricePlanId"]',row).val();
    	var pricePlans = $('.pricePlanId-'+pricePlanId, '#batchSetPriceDialog');
    	var td = $(pricePlans[0]).find('td');
    	var text = $(td[0]).html();
    	row.remove();
    	pricePlans = $('.pricePlanId-'+pricePlanId, '#batchSetPriceDialog');
    	td = $(pricePlans[0]).find('td');
    	var rowspan = $(td[0]).attr('rowspan');
    	if (rowspan) {
	    	td = $(pricePlans[0]).find('td');
	    	$(td[0]).prop('rowspan',pricePlans.length);
    	} else {
    		$(pricePlans[0]).prepend('<td rowspan='+pricePlans.length+'>' + text + '</td>');
    	}
    	if (pricePlans.length == 1) {
    		$('#del',pricePlans[0]).hide();
    	}
    }
    
    function delQuotaDetail(thiz) {
    	var row = $(thiz).parent().parent().parent();
    	var pricePlanId = $('input[name="pricePlanId"]',row).val();
    	var pricePlans = $('.pricePlanId-'+pricePlanId, '#batchSetQuotaDialog');
    	var td = $(pricePlans[0]).find('td');
    	var text = $(td[0]).html();
    	row.remove();
    	pricePlans = $('.pricePlanId-'+pricePlanId, '#batchSetQuotaDialog');
    	td = $(pricePlans[0]).find('td');
    	var rowspan = $(td[0]).attr('rowspan');
    	if (rowspan) {
	    	td = $(pricePlans[0]).find('td');
	    	$(td[0]).prop('rowspan',pricePlans.length);
    	} else {
    		$(pricePlans[0]).prepend('<td rowspan='+pricePlans.length+'>' + text + '</td>');
    	}
    	if (pricePlans.length == 1) {
    		$('#del',pricePlans[0]).hide();
    	}
    }

    secondLimitStr($('.room-manage-wrap .list7'), '9');
</script>