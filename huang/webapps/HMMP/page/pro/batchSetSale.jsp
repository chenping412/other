<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>

<div id="batchSetSaleDialog">
    <table cellpadding="0" cellspacing="0" width="100%" class="tb" >
        <colgroup>
            <col width="40%"></col>
            <col width="30%"></col>
            <col width="30%"></col>
        </colgroup>
        <tr>
            <th>房型/价格计划</th>
            <th>B2B</th>
            <th>携程</th>
        </tr>
        <c:if test="${not empty pricePlanList}">
        	<c:forEach items="${pricePlanList}" var="pricePlan">
	            <tr id="pricePlanId-${pricePlan.priceplanId}">
	                <td>
	                	<input name="pricePlanId" type="hidden" value="${pricePlan.priceplanId}" />
						${pricePlan.roomTypeName}/${pricePlan.priceplanName}
	                </td>
	                <td>
	                    <label class="f_ui-radio-c3"><input name="b2bOnsale-${pricePlan.priceplanId}" type="radio" value="" checked /><i></i>&nbsp;不变</label>
						<label class="f_ui-radio-c3"><input name="b2bOnsale-${pricePlan.priceplanId}" type="radio" value="1" /><i></i>&nbsp;上架</label>
						<label class="f_ui-radio-c3"><input name="b2bOnsale-${pricePlan.priceplanId}" type="radio" value="0" /><i></i>&nbsp;下架</label>
	                </td>
	                <td>
	                    <label class="f_ui-radio-c3"><input name="ctripOnsale-${pricePlan.priceplanId}" type="radio" value="" checked /><i></i>&nbsp;不变</label>
						<label class="f_ui-radio-c3"><input name="ctripOnsale-${pricePlan.priceplanId}" type="radio" value="1" /><i></i>&nbsp;上架</label>
						<label class="f_ui-radio-c3"><input name="ctripOnsale-${pricePlan.priceplanId}" type="radio" value="0" /><i></i>&nbsp;下架</label>
	                </td>
	            </tr>
        	</c:forEach>
        </c:if>
    </table>
</div>
