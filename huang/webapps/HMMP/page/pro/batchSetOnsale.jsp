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
    <table id="onsale_table" class="table-list-content" style="border-spacing:0px 10px;" cellpadding="0" cellspacing="0" width="100%" border="0" align="center" >

        <colgroup>
            <col width="30%"></col>
            <col width="30%"></col>
            <col width="30%"></col>
        </colgroup>

        <tr>
            <th>房型</th>
            <th style="width: 120px">价格计划</th>
            <th>B2B</th>
            <th>携程</th>
            <%--<th>淘宝</th>--%>

        </tr>
        <c:forEach items="${pricePlanDTOList}" var="pricePlan">
            <tr name="onsaleTableTr" style="hover:border 1">
                <input style="width: 240px" type="hidden" name="pricePlanName" value="${pricePlan.priceplanName}"/>
                <input type="hidden" name="pricePlanId" value="${pricePlan.priceplanId}"/>

                <td>${pricePlan.roomTypeName}</td>
                <td>${pricePlan.priceplanName}</td>
                <td>
                    <select name="saleStateToB">
                        <option value="">--请选择--</option>
                        <option value="1">上架</option>
                        <option value="0">下架</option>
                    </select>
                </td>
                <td>
                    <select name="saleStateToCtrip">
                        <option value="">--请选择--</option>
                        <option value="1">上架</option>
                        <option value="0">下架</option>
                    </select>
                </td>

            </tr>
        </c:forEach>

    </table>

</div>


<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath%>js/jquery-ui.min.js"></script>
