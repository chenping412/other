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

        <%--<colgroup>--%>
            <%--<col width="20%"></col>--%>
            <%--<col width="8%"></col>--%>
            <%--<col width="8%"></col>--%>

            <%--<col width="8%"></col>--%>
            <%--<col width="8%"></col>--%>
            <%--<col width="6%"></col>--%>

            <%--<col width="8%"></col>--%>
            <%--<col width="8%"></col>--%>
            <%--<col width="6%"></col>--%>

            <%--<col width="8%"></col>--%>
            <%--<col width="8%"></col>--%>
            <%--<col width="6%"></col>--%>
        <%--</colgroup>--%>

        <tr>
            <th style="width: 120px">价格计划名称</th>

            <th>开始日期</th>
            <th>结束日期</th>

            <th>适用星期</th>
            <th>底价</th>
            <th>币种</th>

            <th>同行价</th>
            <th>币种</th>

            <th>携程</th>
            <th>币种</th>

            <th>淘宝</th>
            <th>币种</th>

            <th>直客</th>
            <th>币种</th>
        </tr>
        <c:forEach items="${pricePlanDTOList}" var="pricePlan">
            <tr name="priceTableTr" style="hover:border 1">
                <input style="width: 240px" type="hidden" name="pricePlanName" value="${pricePlan.priceplanName}"/>
                <input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}"/>
                <input type="hidden" name="hotelId" value="${pricePlan.hotelId}"/>
                <input type="hidden" name="roomTypeId" value="${pricePlan.roomTypeId}"/>
                <input type="hidden" name="baseCurrency" value="${pricePlan.baseCurrency}"/>
                <input type="hidden" name="saleBCurrency" value="${pricePlan.saleBCurrency}"/>
                <input type="hidden" name="saleCCurrency" value="${pricePlan.saleCCurrency}"/>
                <input type="hidden" name="sameSalePrice" value="true"/>

                <td>${pricePlan.priceplanName}</td>
                <td><input style="width: 68px" type="text" name="beginDate"  class="beginDate"/></td>
                <td><input  style="width: 68px" type="text" name="endDate" class="endDate"/></td>


                <td><input style="width: 68px"  type="text" name="basePriceWeekday"/></td>
                <td><input  style="width: 68px" type="text" name="basePriceWeekend"/></td>
                <td>${pricePlan.baseCurrency}</td>

                <td><input style="width: 68px"  type="text" name="toBPriceWeekday"/></td>
                <td><input  style="width: 68px" type="text" name="toBPriceWeekend"/></td>
                <td>${pricePlan.saleBCurrency}</td>

                <td><input  style="width: 68px" type="text" name="toCPriceWeekday"/></td>
                <td><input  style="width: 68px" type="text" name="toCPriceWeekend"/></td>
                <td>${pricePlan.saleCCurrency}</td>
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
