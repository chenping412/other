<%--
  Created by IntelliJ IDEA.
  User: Vinney
  Date: 2018/4/17
  Time: 16:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<div id="different">
    <table id="price_table" class="table-list-content" style="border-spacing:0px 10px;" cellpadding="0" cellspacing="0" width="100%" border="0" align="center" >

        <colgroup>
            <col width="20%"></col>
            <col width="20%"></col>
            <col width="15%"></col>
            <col width="15%"></col>
            <col width="15%"></col>
            <col width="15%"></col>
        </colgroup>

        <tr>
            <th>房型</th>
            <th>价格计划</th>
            <th>开始日期</th>
            <th>结束日期</th>
            <th>房态</th>
            <th>在售配额增加</th>
        </tr>
        <c:forEach items="${pricePlanDTOList}" var="pricePlan">
            <tr name="quotaTableTr" style="hover:border 1">
                <input style="width: 240px" type="hidden" name="pricePlanName" value="${pricePlan.priceplanName}"/>
                <input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}"/>
                <input type="hidden" name="hotelId" value="${pricePlan.hotelId}"/>
                <input type="hidden" name="roomTypeId" value="${pricePlan.roomTypeId}"/>

                <td>${pricePlan.roomTypeName}</td>
                <td>${pricePlan.priceplanName}</td>
                <td><input style="width: 68px" type="text" name="beginDate"  class="beginDate"/></td>
                <td><input  style="width: 68px" type="text" name="endDate" class="endDate"/></td>

                <td>
                    <select name="roomState">
                        <option value="">--请选择--</option>
                        <option value="hasNotOver">有房不可超</option>
                        <option value="hasOver">有房可超</option>
                        <option value="ask">待查</option>
                        <option value="noRoom">满房</option>
                        <option value="freeSale">FreeSale</option>
                    </select>
                </td>
                <td><input  style="width: 68px" type="text" name="quotaNum"/></td>
            </tr>
        </c:forEach>

    </table>

</div>


<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
<script src="<%=basePath%>js/localdate.js"></script>
