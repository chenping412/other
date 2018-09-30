<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<html>
<head>
    <meta charset="utf-8"/>
    <title>权限示例</title>

    <link rel="stylesheet" href="<%=request.getContextPath()%>/css/ops-style.css">
    <script type="text/javascript" src="<%=basePath%>/js/jquery-1.8.3.min.js"></script>

</head>
<body>
<div class="top_container">

    <div class="main_container" align="center" >

            <table border="1" cellspacing="0" width="40%" >
                <colgroup>
                    <col width="40px;">
                    <col width="40px;%">
                </colgroup>
                <tr>
                    <td width="40px;">
                        <input type="checkbox" class="cheackBox" value="" >
                        角色编码</td>
                    <td width="40px;">角色名称 </td>
                </tr>
                <c:if test="${not empty roles}">
                    <c:forEach items="${roles}" var="role">
                        <tr >
                            <td width="40px;">
                                <input type="checkbox" value="${role.id}"
                                    <shiro:hasRole name="${role.roleCode}"> checked</shiro:hasRole> >
                                ${role.roleCode}</td>
                            <td width="40px;"> ${role.roleName}</td>
                        </tr>
                    </c:forEach>
                    <tr height="50px;">
                        <td colspan="2" align="center">
                            <div onclick="javascript:setUserRoles();">保存</div>
                        </td>
                    </tr>
                </c:if>

            </table>
        <input type="hidden" id="userId" name="userId" value="${userId}" />
    </div>
</div>

<script type="text/javascript">
    function setUserRoles() {
        var roleIds = new Array();
        $(".main_container input[type=checkbox]:checked").each(function(i){
            roleIds.push($(this).val());
        });

        if(roleIds.length == 0){
            roleIds.push(-1);
        }
        alert(roleIds.toString());

        $.ajax({
            type : "get",
            dataType : "json",
            contentType : "application/json",
            url :"<%=basePath%>admin/saveUserRoles/${userId}/" + roleIds.toString(),
            data:{

            },
            success:function(errorMessage) {
               // alert("角色分配操作成功");
            },
            error : function(errorMessage) {
              //  alert("角色分配操作失败");
            }
        });

    }
</script>

</body>
</html>
