<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
<%@ taglib prefix="fmt" uri="fmt"%>
<div id="addProductDialog">
	<form id="addPricePlanForm" class="form-list" action="addPricePlan" method="post">
	    <ul class="row">
	        <li class="list drop-box"><span>酒店<i class="colorYellow"></i>：</span><span>${hotel.hotelName}</span>
	            <input type="hidden" id="hotelId" name="hotelId" value="${hotel.hotelId}" />
	        </li>
	        <li class="list drop-box"><span>供应商<i class="colorYellow"></i>：</span>
	        	<input type="text" placeholder="请选择供应商" name="supplyName" id="supplyName" value="${hotel.supplyName}" style="width:348px;" autocomplete="off" />
                <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
	            <input type="hidden" id="supplyCode" name="supplyCode" value="${hotel.supplyCode}" />
	        </li>
	        <li class="list drop-box"><span>房型<i class="colorYellow"></i>：</span><span>${room.roomName}</span>
	            <input type="hidden" id="roomTypeId" name="roomTypeId" value="${room.roomTypeId}" />
	        </li>
	        <li class="list drop-box"><span>采购类型<i class="colorYellow">*</i>：</span>
	            <input type="text" placeholder="请选择采购类型" readonly class="select-box-value">
	            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
	            <div class="form-list-drop-box" style="left: 153px">
	                <ul class="clearfix" id="quotaTypeSelectBox">
	                    <c:forEach items="${quotaTypeMap}" var="quotaTypeItem">
	                        <li value="${quotaTypeItem.key}">${quotaTypeItem.value}</li>
	                    </c:forEach>
	                </ul>
	            </div>
	        </li>
	        <li class="list drop-box"> <span>底价币种<i class="colorYellow">*</i>：</span>
	            <input type="text" id="baseCurrencyInput" placeholder="请选择币种" readonly class="select-box-value">
	            <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
	            <div class="form-list-drop-box" style="left: 153px">
	                <ul class="clearfix" id="baseCurrencySelectBox">
	                    <c:forEach items="${currencyMap}" var="currencyItem">
	                        <li value="${currencyItem.key}">${currencyItem.value}</li>
	                    </c:forEach>
	                </ul>
	            </div>
	        </li>
	        <li class="list drop-box"><span>同行价币种<i class="colorYellow">*</i>:</span>
	            <input type="text" placeholder="请选择币种" readonly class="select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i>
	            <i class="iconfont  icon-downTriangle"></i>
	            <div class="form-list-drop-box" style="left: 153px">
	                <ul class="clearfix" id="saleBCurrencySelectBox">
	                    <c:forEach items="${currencyMap}" var="currencyItem">
	                        <li value="${currencyItem.key}">${currencyItem.value}</li>
	                    </c:forEach>
	                </ul>
	            </div>
	        </li>
			<li class="list drop-box"><span>早餐<i class="colorYellow">*</i>:</span>
	            <input type="text" placeholder="请选择早餐" readonly class="select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i>
	            <i class="iconfont  icon-downTriangle"></i>
	            <div class="form-list-drop-box" style="left: 153px">
	                <ul class="clearfix" id="breakfastSelectBox">
	                	<li value="none">无早</li>
	                	<li value="one">单早</li>
	                	<li value="two">双早</li>
	                </ul>
	            </div>
 	        </li>
	        <li class="list"><span>价格计划名称<i class="colorYellow">*</i>：</span>
	            <input name="priceplanName" id="priceplanName" class="text w_140 c_666 select-box-value " placeholder="请输入价格计划名称" autocomplete="off" type="text" /><i class="empty iconfont icon-ArtboardCopy"></i>
	            <div class="form-list-drop-box" style="left: 153px">
	                <ul class="clearfix" id="prieplanNameSelectBox">
	                    <li value="无早">无早</li>
	                    <li value="单早">单早</li>
	                    <li value="双早">双早</li>
	                </ul>
	            </div>
	        </li>
	     </ul>
	    <input type="hidden" id="quotaType" name="quotaType" value="" />
	    <input type="hidden" id="saleBCurrency" name="saleBCurrency" value="" />
	    <input type="hidden" id="saleCCurrency" name="saleCCurrency" value="" />
	    <input type="hidden" id="baseCurrency" name="baseCurrency" value="" />
	    <input type="hidden" id="breakFastType" name="breakFastType" value="" />
	</form>
</div>