<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
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
    <title>平台运营-用户管理</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>
<style>
    .edit-port-dialog {
        height: 195px;
    }
</style>

<body>

<div class="user-manage-wrap">
    <div class="breadcrumb">
        <div class="section-content">
        </div>
    </div>
    <div class="main-content">
        <shiro:hasPermission name="member:employee:add">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <a href="<%=basePath%>admin/toAddUser" class="addbtn">新增员工</a>
            </div>
        </div>
        </shiro:hasPermission>
        <shiro:hasPermission name="member:employee:query">
        <div class="filter-bar ">
            <form id="queryUserListForm" action="queryUserList" method="post" >
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="pageNo" value="<c:choose><c:when test='${empty user.pageNo}'>1</c:when><c:otherwise>${user.pageNo}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty user.pageSize}'>5</c:when><c:otherwise>${user.pageSize}</c:otherwise></c:choose>" />
                <input type="hidden" id="roleCode" name="roleCode" value="${user.roleCode}" >

            <ul class="clearfix">
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">员工姓名:</span><input id="realName" name="realName" value="${user.realName}" type="text" value="" placeholder="请输入员工姓名">
                    <i class="empty iconfont icon-ArtboardCopy"></i>
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">登录名:</span><input type="text" id="username" name="username" value="${user.username}" placeholder="请输入登录名">
                    <i class="empty iconfont icon-ArtboardCopy"></i>
                </li>
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">所属角色:</span>
                    <input type="text" id="roleName" name="roleName" readonly <c:if test="${ empty user.roleCode}"> value="不限" </c:if><c:if test="${ not empty user.roleCode}"> value="${user.roleName}"</c:if>>
                    <c:if test="${not empty allRoleList}" >
                    <i class="iconfont  icon-downTriangle"></i>
                    <div class="filter-bar-drop-box" id="roleBox">
                        <ul class="clearfix">
                            <li class="clearfix" value="all">不限</li>
                            <c:forEach items="${allRoleList}" var="role">
                            <li class="clearfix" value="${role.roleCode}">${role.roleName}</li>
                            </c:forEach>
                        </ul>
                    </div>
                    </c:if>
                </li>
                <li><a class="search-btn" href="javascript:queryUserList();"><i class="iconfont icon-search"></i></a></li>
            </ul>
            </form>
        </div>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list1">序号</li>
                    <li class="list2">员工姓名</li>
                    <li class="list3">登录名</li>
                    <li class="list4">联系电话</li>
                    <li class="list5">QQ</li>
                    <li class="list7">角色</li>
                    <li class="list8">职务描述</li>
                    <li class="list9">是否有效</li>
                    <li class="list10">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
    <c:if test="${not empty pgSupport}">
        <c:forEach items="${pgSupport.recordList}" var="user" varStatus="status">
                <ul class="row clearfix">
                    <li class="list1">${status.index + 1}</li>
                    <li class="list2" class="">${user.realName}</li>
                    <li class="list3">${user.username}</li>
                    <li class="list4">
                        <c:if test="${not empty user.tel}" >${user.tel}</c:if>
                        <c:if test="${ empty user.tel}" >----</c:if>
                    </li>
                    <li class="list5">
                        <c:if test="${not empty user.qq}" >${user.qq}</c:if>
                        <c:if test="${ empty user.qq}" >----</c:if>
                    </li>
                    <li class="list7"><c:if test="${not empty user.roleNames}" >${user.roleNames}</c:if><c:if test="${ empty user.roleNames}" >----</c:if></li>
                    <li class="list8"><c:if test="${not empty user.description}" >${user.description}</c:if><c:if test="${ empty user.description}" >----</c:if></li>
                    <li class="list9">
                        <shiro:hasPermission name="member:employee:inactive">
                        <i class="iconfont icon-a" onclick="javascript:invalidUser('${user.id}', ${user.isActive});" <c:if test="${1 != user.isActive}" > style="display: none;" </c:if> ></i>
                        <i class="iconfont icon-Artboard2"  onclick="javascript:invalidUser('${user.id}',${user.isActive});" <c:if test="${1 != user.isActive}" > style="display: block;" </c:if> ></i>
                        </shiro:hasPermission>
                        <shiro:lacksPermission name="member:employee:inactive">
                            <i class="iconfont icon-a" onclick="javascript:void(0);" <c:if test="${1 != user.isActive}" > style="display: none;" </c:if> ></i>
                            <i class="iconfont icon-Artboard2"  onclick="javascript:void(0);" <c:if test="${1 != user.isActive}" > style="display: block;" </c:if> ></i>
                        </shiro:lacksPermission>
                    </li>
                    <li class="list10" style="color: #FF6000;">
                        <div class="table-list-content-tools">
                            <ul class="clearfix">
                                <shiro:hasPermission name="member:employee:edit"><li><a href="<%=basePath%>admin/toEditUser/${user.id}">编辑</a><span>|</span></li></shiro:hasPermission>
                                <shiro:hasPermission name="member:employee:resetPassword"><li><a href="javascript:resetPassword('${user.id}')">重置密码</a><span>|</span></li></shiro:hasPermission>
                                <shiro:hasPermission name="member:employee:delete"><li><a href="javascript:deleteUser('${user.id}');" class="delete">删除</a></li></shiro:hasPermission>
                            </ul>
                        </div>
                    </li>
                </ul>
        </c:forEach>
    </c:if>
            </div>
            <div class="table-list-footer ">
                <div class="main_kkpager m_t10 ">
                    <div id="kkpager" class="page_turning"></div>
                </div>
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
    //4、限定字数
    limitStr($('.user-manage-wrap .list6')); //员工管理页面
    limitStr($('.user-manage-wrap .list8'));
    limitStr($('.user-manage-wrap .list7'));

    function invalidUser(userId, isActive) {
        var msg = '确定要锁定该员工吗？';
        var toIsActive = 0;
        if(0 == isActive){
            msg = '确定要恢复该员工吗？';
            toIsActive=1;
        }

        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: msg,
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '保存',
            ok: function () {
                $.ajax({
                    type:'POST',
                    dataType : 'json',
                    context : document.body,
                    url : '<%=basePath%>admin/invalidUser',
                    data:{
                        "userId":userId,
                        "isActive":toIsActive
                    },
                    success : function(data) {
                        if(data.success){
                            if(0== isActive){
                                $(this).css('display', 'none').siblings('.icon-a').css('display', 'block');
                            }else{
                                $(this).css('display', 'none').siblings('.icon-Artboard2').css('display', 'block');
                            }
                            $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/queryUserList');
                        }else{
                            new Tip({ msg: data.msg,timer: 1000, type:2});
                        }
                    }
                });
            },
            cancel: function () {

            }

        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    }


    function resetPassword(userId) {
        var msg = '确定要该员工的密码重置为666666吗？';

        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: msg,
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                $.ajax({
                    type:'POST',
                    dataType : 'json',
                    context : document.body,
                    url : '<%=basePath%>admin/resetPassword',
                    data:{
                        "userId":userId
                    },
                    success : function(data) {
                        if (data.success) {
                            new Tip({msg: data.msg, timer: 1000, type: 1});
                        } else {
                            new Tip({msg: data.msg, timer: 1000, type: 2});
                        }
                    }
                });
            },
            cancel: function () {

            }

        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    }


    //5、点击删除按钮出现弹出框
    //$('.table-list-content-tools').find('.delete').on('click', function () {
    function deleteUser(id) {
        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: '确定要删除该员工吗？',
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '保存',
            ok: function () {
                $.ajax({
                    type:'POST',
                    dataType : 'json',
                    context : document.body,
                    url : '<%=basePath%>admin/deleteUser',
                    data:{
                        "id":id
                    },
                    success : function(data) {
                        if(data.success){
                            new Tip({ msg: data.msg,timer: 1000});
                            $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/queryUserList');
                        }else{
                            new Tip({ msg: data.msg,timer: 1000, type:2});
                        }
                    }
                });
            },
            cancel: function () {

            }

        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    }
   // })


    //初始化分页
    //init
    $(function () {
        var pageNo = $("#currentPage").val();
        var totalPage = $("#totalPage").val();
        var totalRecords = $("#totalCount").val();

        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        new Pager({
            pno: pageNo,
            //总页码
            total: totalPage,
            //总数据条数
            totalRecords: totalRecords,
            isShowTotalRecords: true,
            isGoPage: true,
            mode: 'click', //默认值是link，可选link或者click

            click: function (n) {
                $("#currentPage").val(n);
                queryUserList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });
    });

    function queryUserList() {
        $("#queryUserListForm").submit();
    }

    $('#roleBox').on('click', 'li', function () {
        if('不限' != $(this).html()){
            $("#roleCode").val($(this).attr('value'))
        }else{
            $("#roleCode").val(null)
        }
    });
</script>