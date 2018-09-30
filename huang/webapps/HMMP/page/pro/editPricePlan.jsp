<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<div id="editPricePlanDialog">
	<form id="editPricePlanForm" class="form-list" action="editPricePlan" method="post">
	    <ul class="row">
	            <input type="hidden" name="priceplanId" placeholder="请输入价格计划ID" value="${pricePlanDTO.priceplanId}" readonly="true"><i class="empty iconfont icon-ArtboardCopy"></i>
	        <li class="list drop-box"><span>酒店<i class="colorYellow">*</i>：</span><span>${pricePlanDTO.hotelName}</span>
	            <input type="hidden" id="hotelId" name="hotelId" value="${pricePlanDTO.hotelId}" />
	        </li>
	        <li class="list drop-box"><span>供应商<i class="colorYellow"></i>：</span>
	        	<input type="text" placeholder="请选择供应商" name="supplyName" id="supplyName" value="${pricePlanDTO.supplyName}" style="width:348px;" autocomplete="off" />
                <i class="empty iconfont icon-ArtboardCopy"></i><i class="iconfont  icon-downTriangle"></i>
	            <input type="hidden" id="supplyCode" name="supplyCode" value="${pricePlanDTO.supplyCode}" />
	        </li>
	        <li class="list drop-box"><span>房型<i class="colorYellow">*</i>：</span><span>${pricePlanDTO.roomTypeName}</span>
	            <input type="hidden" id="roomTypeId" name="roomTypeId" value="${pricePlanDTO.roomTypeId}" />
	        </li>
	        <li class="list drop-box"><span>采购类型<i class="colorYellow">*</i>：</span>
	            <input type="text" placeholder="请选择采购类型" value="${pricePlanDTO.quotaTypeName}" class="input-effective select-box-value">
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
	            <input type="text" placeholder="请选择币种" disabled value="${pricePlanDTO.baseCurrency}"  class="input-effective select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i>
	        </li>
	
	        <li class="list drop-box"><span>同行价币种<i class="colorYellow">*</i>:</span>
	            <input type="text" placeholder="请选择币种"  disabled  value="${pricePlanDTO.saleBCurrency}" class="input-effective select-box-value"><i class="empty iconfont icon-ArtboardCopy"></i>
	        </li>
	        <li class="list drop-box"><span>早餐<i class="colorYellow">*</i>:</span>
	            <input type="text" placeholder="请选择早餐" readonly class="select-box-value" value="${pricePlanDTO.breakFastTypeText}"><i class="empty iconfont icon-ArtboardCopy"></i>
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
	            <input name="priceplanName" id="priceplanName" class="text w_140 c_666 " placeholder="请输入价格计划名称" autocomplete="off" type="text" value="${pricePlanDTO.priceplanName}"><i class="empty iconfont icon-ArtboardCopy"></i>
	        </li>
	     </ul>
	
	    <input type="hidden" id="quotaType" name="quotaType" value="${pricePlanDTO.quotaType}" />
	    <input type="hidden" id="saleBCurrency" name="saleBCurrency" value="${pricePlanDTO.saleBCurrency}" />
	    <input type="hidden" id="saleCCurrency" name="saleCCurrency" value="${pricePlanDTO.saleCCurrency}" />
	    <input type="hidden" id="baseCurrency" name="baseCurrency" value="${pricePlanDTO.baseCurrency}" />
	    <input type="hidden" id="breakFastType" name="breakFastType" value="${pricePlanDTO.breakFastType}" />
	</form>
</div>
