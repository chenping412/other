<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<div id="batchSetPriceDialog">
<!-- 	<div class="price_title"> -->
<!-- 		<ul> -->
<!-- 			<li class="list"> -->
<!-- 				<span>改价基准：</span> -->
<!-- 				<label class="f_ui-radio-c3"><input name="standard" type="radio" value="base" checked /><i></i>&nbsp;底价</label> -->
<!-- 				<label class="f_ui-radio-c3"><input name="standard" type="radio" value="b2bSale" /><i></i>&nbsp;同行售价</label> -->
<!-- 				<label class="f_ui-radio-c3"><input name="standard" type="radio" value="ctripSale" /><i></i>&nbsp;携程售价</label> -->
<!-- 				<label class="f_ui-radio-c3"><input name="standard" type="radio" value="noneBase" /><i></i>&nbsp;无基本价</label> -->
<!-- 			</li> -->
<!-- 		</ul> -->
<!-- 	</div> -->
	<div class="price_title">
		<ul>
			<li class="list">
				<span>调整价格：</span>
<!-- 				<label class="price_label"><input name="standardPrice" type="checkbox" value="base" />&nbsp;底价</label> -->
				<label class="price_label"><input name="standardPrice" type="checkbox" value="b2bSale" />&nbsp;同行售价</label>
				<label class="price_label"><input name="standardPrice" type="checkbox" value="ctripSale" />&nbsp;携程售价</label>
			</li>
		</ul>
	</div>
	<table cellpadding="0" cellspacing="0" width="100%" class="tb">
		<colgroup>
			<col width="13%">
			<col width="42%">
			<col width="6%">
			<col width="6%">
			<col width="6%">
			<col class="b2bSale" width="13%">
			<col class="ctripSale" width="13%">
		</colgroup>
		<tr>
			<td>房型/价格计划</td>
			<td>适用日期和星期</td>
			<td>散房底价</td>
			<td>团房底价</td>
			<td>团房售价</td>
			<td class="b2bSale">同行售价</td>
			<td class="ctripSale">携程售价</td>
		</tr>
		<tr class="title">
			<th id="titleRowspan" style="font-size: 16px;">统一调</th>
			<td align="left">
				<input name="beginDateAll" type="text" class="date_input" style="width: 75px;" autocomplete="off" />--<input name="endDateAll" type="text" class="date_input" style="width: 75px;" autocomplete="off" />
				<label class="price_label"><input name="weekTitleAll" type="checkbox" value="all" onclick="checkTitleAll(this,'batchSetPriceDialog');" />全</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周一" class="monAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />一</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周二" class="tueAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />二</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周三" class="wedAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />三</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周四" class="thuAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />四</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周五" class="friAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />五</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周六" class="satAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />六</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周日" class="sunAll" onclick="checkWeekAll(this,'batchSetPriceDialog');" />日</label>
			</td>
			<td><input name="basePriceAll" type="text" class="number_input" style="width: 80%;" /></td>
			<td><input name="groupBasePriceAll" type="text" class="number_input" style="width: 80%;" /></td>
			<td><input name="groupSalePriceAll" type="text" class="number_input" style="width: 80%;" /></td>
			<td class="b2bSale">
				<select id="saleBPriceSelectAll" name="saleBPriceSelectAll" class="price_select" style="width:50%">
					<option value="add">加数值</option>
					<option value="multiply">加百分比</option>
					<option value="subtract">减数值</option>
					<option value="equals">设置为</option>
				</select>
				<input name="saleBPriceAll" type="text" class="number_input" value="" style="width:45%" />
			</td>
			<td class="ctripSale">
				<select id="ctripSalePriceSelectAll" name="ctripSalePriceSelectAll" class="price_select" style="width:50%">
					<option value="add">加数值</option>
					<option value="multiply">加百分比</option>
					<option value="subtract">减数值</option>
					<option value="equals">设置为</option>
				</select>
				<input name="ctripSalePriceAll" type="text" class="number_input" value="" style="width:45%" />
			</td>
		</tr>
		<c:if test="${not empty pricePlanList}">
			<c:forEach items="${pricePlanList}" var="pricePlan">
				<tr class="pricePlanId-${pricePlan.priceplanId}">
					<td>
						<input name="pricePlanId" type="hidden" value="${pricePlan.priceplanId}" />
						${pricePlan.roomTypeName}/${pricePlan.priceplanName}
					</td>
					<td align="left">
						<input name="beginDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />--<input name="endDate" type="text" class="date_input" style="width: 75px;" autocomplete="off" />
						<label class="price_label"><input name="weekTitle" type="checkbox" value="all" onclick="checkWeekTitle(this);" />全</label>
						<label class="price_label"><input name="week" type="checkbox" class="mon" value="周一" onclick="checkWeek(this);" />一</label>
						<label class="price_label"><input name="week" type="checkbox" class="tue" value="周二" onclick="checkWeek(this);" />二</label>
						<label class="price_label"><input name="week" type="checkbox" class="wed" value="周三" onclick="checkWeek(this);" />三</label>
						<label class="price_label"><input name="week" type="checkbox" class="thu" value="周四" onclick="checkWeek(this);" />四</label>
						<label class="price_label"><input name="week" type="checkbox" class="fri" value="周五" onclick="checkWeek(this);" />五</label>
						<label class="price_label"><input name="week" type="checkbox" class="sat" value="周六" onclick="checkWeek(this);" />六</label>
						<label class="price_label"><input name="week" type="checkbox" class="sun" value="周日" onclick="checkWeek(this);" />日</label>
						<span>
							<img src="../images/u2096.png" id="add" onMouseOver="this.src='../images/u2096_mouseOver.png'" onMouseOut="this.src='../images/u2096.png'" onclick="addDetail(this);" />
							<img src="../images/u1209.png" style="display: none;" id="del" onMouseOver="this.src='../images/u1209_mouseOver.png'" onMouseOut="this.src='../images/u1209.png'" onclick="delDetail(this);" />
						</span>
					</td>
					<td><input name="basePrice" type="text" class="number_input" style="width: 80%;" /></td>
					<td><input name="groupBasePrice" type="text" class="number_input" style="width: 80%;" /></td>
					<td><input name="groupSalePrice" type="text" class="number_input" style="width: 80%;" /></td>
					<td class="b2bSale">
						<select id="saleBPriceSelect" name="saleBPriceSelect" class="price_select" style="width:50%">
							<option value="add">加数值</option>
							<option value="multiply">加百分比</option>
							<option value="subtract">减数值</option>
							<option value="equals">设置为</option>
						</select>
						<input name="saleBPrice" type="text" class="number_input" value="" style="width:45%" />
					</td>
					<td class="ctripSale">
						<select id="ctripSalePriceSelect" name="ctripSalePriceSelect" class="price_select" style="width:50%">
							<option value="add">加数值</option>
							<option value="multiply">加百分比</option>
							<option value="subtract">减数值</option>
							<option value="equals">设置为</option>
						</select>
						<input name="ctripSalePrice" type="text" class="number_input" value="" style="width:45%" />
					</td>
				</tr>
			</c:forEach>
		</c:if>
	</table>
</div>