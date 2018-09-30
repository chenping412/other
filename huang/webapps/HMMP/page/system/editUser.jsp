<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>平台运营-用户管理-个人资料</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

<div class="edit-user-data-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">用户管理</a>
        <span>></span>
        <span>></span>
        <a href="javascript:;">编辑用户</a>
    </div>
    <div class="main-content">
        <div class="search-conent" style="display:block">
            <form id="editUserForm" action="editUser" method="post" class="form-list">
                <input type="hidden" id="id" name="id" value="${user.id}" >
                <input type="hidden" id="currentUserRoleIds" name="currentUserRoleIds" value="${userRoleIds}" >
                <input type="hidden" id="department" name="department" value="${user.department}"/>
                <!-- 得到所属部门名称，下面显示用 -->
                <c:forEach items="${departmentList}" var="deptItem">
                    <c:if test="${deptItem.id eq user.department}">
                        <c:set var="departmentName" value="${deptItem.deptName}"></c:set>
                    </c:if>
                </c:forEach>
                <ul class="row">
                    <li class="list"><span>用户姓名<i class="colorYellow">*</i> ：</span><input type="text" value="${user.realName}" readonly class="needborder"></li>
                    <li class="list"><span>登录名<i class="colorYellow">*</i> ：</span><input type="text" value="${user.username}" readonly class="needborder"></li>
                    <%--<li class="list"><span>所属部门<i class="colorYellow">*</i> ：</span><input type="text" value="${user.department}" readonly class="needborder"></li>--%>
                    <li class="list drop-box"><span>所属部门<i class="colorYellow">*</i> ：</span>
                        <input type="text" value="${departmentName}" readonly  class="input-effective needborder select-box-value" placeholder="请输入所属部门">
                        </i><i class="iconfont  icon-downTriangle"></i>
                        <div class="form-list-drop-box" id="departmentBox">
                            <ul class="clearfix">
                                <li>请选择所属部门</li>
                                <c:forEach items="${departmentList}" var="deptItem">
                                    <li value="${deptItem.id}">${deptItem.deptName}</li>
                                </c:forEach>
                            </ul>
                        </div>
                    </li>

                    <li class="list need-edit"><span>手机号码<i class="colorYellow">*</i> ：</span><input type="text" id="tel" name="tel" value="${user.tel}" datatype="m"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list need-edit"><span>QQ号码<i class="colorYellow">*</i> ：</span><input type="text" id="qq" name="qq" value="${user.qq}"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list need-edit big-input-edit"><span>职务描述：</span><textarea name="description" id="description" >${user.description}</textarea><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list">
                        <span>所属角色：</span>
                        <ul class="check-role-list clearfix">
                            <c:if test="${not empty roles}" >
                                <c:forEach items="${roles}" var="role">
                                <li id="roleLi" data-roleId="${role.id}">
                                    <i class="iconfont icon-fuxuan1"></i>
                                    <i class="iconfont icon-fuxuan"></i>
                                    <input type="checkbox" >
                                    <span>${role.roleName}</span>
                                </li>
                                </c:forEach>
                            </c:if>
                        </ul>
                    </li>
                </ul>
            </form>

        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="<%=basePath%>admin/queryUserList" class="cancel">返回</a><a href="javascript:editUser();" class="save" >保存</a>
            </div>

        </div>
    </div>
</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script>
    $(function () {
        var currentUserRoleIds = $("#currentUserRoleIds").val();
        var jsDatas= eval(currentUserRoleIds);

       for ( var i = 0; i < jsDatas.length; i++) {
           $(".check-role-list").find("input[type='checkbox']").each(function(){
                if($(this).parent().data('roleid') == jsDatas[i]){
                    $(this).trigger("click");
                }
            });
        }
    });

    function editUser() {
        var department = $("#department").val();
        var tel = $("#tel").val();
        var qq = $("#qq").val();

        if (null == department || '' == department) {
            new Tip({msg: '请选择所属部门', timer: 1000, type: 2});
            return;
        }

        if (null == tel || '' == tel || !(/^1[34578]\d{9}$/).test(tel)) {
            new Tip({msg: '请输入正确的手机号码', timer: 1000, type: 2});
            return;
        }

        if (null == qq || '' == qq) {
            new Tip({msg: '请输入QQ号码', timer: 1000, type: 2});
            return;
        }

        if (qq.length < 5 || qq.length > 20 || !(/^\d{5,20}$/).test(qq)) {
            new Tip({msg: 'QQ长度必须5-20位的数字', timer: 1000, type: 2});
            return;
        }

        var roleIds = new Array();
        $(".check-role-list").find("input[type='checkbox']:checked").each(function () {
            roleIds.push($(this).parent('li').data('roleid'));
        })

        if (roleIds.length < 1) {
            new Tip({msg: '请选择用户角色', timer: 1000, type: 2});
            return;
        }

        $.ajax({
            type: 'POST',
            dataType: 'json',
            context: document.body,
            url: '<%=basePath%>admin/editUser',
            data: {
                "id": $("#id").val(),
                "department": department,
                "tel": tel,
                "qq": qq,
                "description": $("#description").val(),
                "roleIds": roleIds.toString()
            },
            success: function (data) {
                if (data.success) {
                    new Tip({msg: data.msg, timer: 1000});
                    $(window.parent.document).find(".user-data").children().attr('src', '<%=basePath%>admin/queryUserList');
                } else {
                    new Tip({msg: data.msg, timer: 1000, type: 2});
                }
            }
        });
    }

    $('#departmentBox').on('click', 'li', function () {
        $("#department").val($(this).attr("value"));
    });
</script>
