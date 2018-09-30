<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<div id="batchSetQuotaDialog">
	<div class="price_title">
		<ul>
			<li class="list">
				<span>调整内容：</span>
				<label class="price_label"><input name="standardQuota" type="checkbox" value="quotaCount" />&nbsp;可售数量</label>
				<label class="price_label"><input name="standardQuota" type="checkbox" value="quotaLimit" />&nbsp;超售受限制</label>
			</li>
		</ul>
	</div>
	<table cellpadding="0" cellspacing="0" width="100%" class="tb">
		<colgroup>
			<col width="18%">
			<col width="48%">
			<col class="quotaCount" width="16%">
			<col class="quotaLimit" width="16%">
		</colgroup>
		<tr>
			<th>房型/价格计划</th>
			<th>适用日期和星期</th>
			<th class="quotaCount">可售数量</th>
			<th class="quotaLimit">超售限制</th>
		</tr>
		<tr class="title">
			<th id="titleRowspan" style="font-size: 16px;">统一调</th>
			<td align="left">
				<input name="beginDateAll" type="text" class="date_input" style="width: 75px;" autocomplete="off" />--<input name="endDateAll" type="text" class="date_input" style="width: 75px;" autocomplete="off" />
				<label class="price_label"><input name="weekTitleAll" type="checkbox" value="all" onclick="checkTitleAll(this,'batchSetQuotaDialog');" />全</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周一" class="monAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />一</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周二" class="tueAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />二</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周三" class="wedAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />三</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周四" class="thuAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />四</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周五" class="friAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />五</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周六" class="satAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />六</label>
				<label class="price_label"><input name="weekAll" type="checkbox" value="周日" class="sunAll" onclick="checkWeekAll(this,'batchSetQuotaDialog');" />日</label>
			</td>
			<td class="quotaCount">
				<select id="quotaCountSelectAll" name="quotaCountSelectAll" class="price_select" style="width:50%">
					<option value="add">加数值</option>
					<option value="subtract">减数值</option>
					<option value="equals">设置为</option>
				</select>
				<input name="quotaCountAll" type="text" class="number_input" style="width:45%" />
			</td>
			<td class="quotaLimit">
				<select id="quotaLimitSelectAll" name="quotaLimitSelectAll" class="price_select" style="width: 90%;">
					<option value="">不变</option>
					<option value="hasNotOver">有房不可超</option>
					<option value="hasOver">有房可超</option>
					<option value="ask">待查</option>
					<option value="noRoom">满房</option>
					<option value="freeSale">FreeSale</option>
				</select>
			</td>
		</tr>
		<c:if test="${not empty pricePlanList}">
			<c:forEach items="${pricePlanList}" var="pricePlan">
				<tr class="pricePlanId-${pricePlan.priceplanId}">
					<td>
						${pricePlan.roomTypeName}/${pricePlan.priceplanName}
					</td>
					<td align="left">
						<input name="pricePlanId" type="hidden" value="${pricePlan.priceplanId}" />
						<input name="quotaAccountId" type="hidden" value="${pricePlan.accountId}" />
						<input name="roomTypeId" type="hidden" value="${pricePlan.roomTypeId}" />
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
							<img src="../images/u2096.png" id="add" onMouseOver="this.src='../images/u2096_mouseOver.png'" onMouseOut="this.src='../images/u2096.png'" onclick="addQuotaDetail(this);" />
							<img src="../images/u1209.png" style="display: none;" id="del" onMouseOver="this.src='../images/u1209_mouseOver.png'" onMouseOut="this.src='../images/u1209.png'" onclick="delQuotaDetail(this);" />
						</span>
					</td>
					<td class="quotaCount">
						<select id="quotaCountSelect" name="quotaCountSelect" class="price_select" style="width:50%">
							<option value="add">加数值</option>
							<option value="subtract">减数值</option>
							<option value="equals">设置为</option>
						</select>
						<input name="quotaCount" type="text" class="number_input" style="width:45%" />
					</td>
					<td class="quotaLimit">
						<select id="quotaLimitSelect" name="quotaLimitSelect" class="price_select" style="width: 90%;">
							<option value="">不变</option>
							<option value="hasNotOver">有房不可超</option>
							<option value="hasOver">有房可超</option>
							<option value="ask">待查</option>
							<option value="noRoom">满房</option>
							<option value="freeSale">FreeSale</option>
						</select>
					</td>
				</tr>
			</c:forEach>
		</c:if>
	</table>
</div>