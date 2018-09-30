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
    <title>平台运营-角色管理</title>
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

<div class="role-manage-wrap">
    <div class="breadcrumb">
    </div>
    <div class="main-content">
        <shiro:hasPermission name="member:role:add">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <a href="<%=basePath%>admin/toAddRoleInfo" class="addbtn">新增角色</a>
            </div>
        </div>
        </shiro:hasPermission>
        <shiro:hasPermission name="member:role:query">
        <form id="queryRoleInfoListForm" action="queryRoleInfoList" method="post">
            <div class="filter-bar">
                <ul class="clearfix">
                    <li class="filter-bar-list">
                        <span class="filter-bar-list-title">角色名称:</span><input type="text" id="roleName" name="roleName" value="${roleName}" placeholder="请输入角色名称">
                        <i class="empty iconfont icon-ArtboardCopy"></i>
                    </li>
                    <li><a class="search-btn" href="javascript:queryRoleInfoList();"><i class="iconfont icon-search"></i></a></li>
                </ul>

            </div>
        </form>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list1" style="width:105px;">序号</li>
                    <li class="list2" style="width:190px;">角色名称</li>
                    <li class="list3" style="width:190px;">角色编码</li>
                    <li class="list4" style="width:240px;">角色描述</li>
                    <li class="list5" style="width:195px;">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
    <c:if test="${not empty roles}">
        <c:forEach items="${roles}" var="role" varStatus="status">
                <ul class="row clearfix" style="width: 80%">
                    <li class="list1" style="width:105px;">${status.index + 1}</li>
                    <li class="list2" style="width:190px;" class="">${role.roleName}</li>
                    <li class="list3" style="width:190px;">${role.roleCode}</li>
                    <li class="list4" style="width:240px;"><c:if test="${not empty role.description}">${role.description}</c:if><c:if test="${ empty role.description}">----</c:if></li>
                    <li class="list5" style="width:195px;color: #FF6000;">
                        <div class="table-list-content-tools">
                            <ul class="clearfix">
                                <shiro:hasPermission name="member:role:edit">
                                <li><a href="<%=basePath%>admin/toEditRoleInfo/${role.id}" class="edit-bth">编辑</a><span>|</span></li>
                                </shiro:hasPermission>
                                <shiro:hasPermission name="member:role:delete">
                                <li><a href="javascript:deleteRoleInfo('${role.id}');" class="delete">删除</a></li>
                                </shiro:hasPermission>
                            </ul>
                        </div>
                    </li>
                </ul>
        </c:forEach>
    </c:if>
            </div>
            <div class="table-list-footer clearfix">
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
    //限定字数
   // limitStr('.list4');

    //5、点击删除按钮出现弹出框
    function deleteRoleInfo(roleId) {
        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: '确定要删除该角色吗？',
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    context: document.body,
                    url: '<%=basePath%>admin/deleteRoleInfo/' + roleId ,
                    data: {},
                    success: function (data) {
                        new Tip({msg: data.msg, timer: 1000});
                        if (data.success) {
                            $(window.parent.document).find(".user-data").children().attr('src', '<%=basePath%>admin/queryRoleInfoList');
                        }
                    }
                });

            },
            cancel: function () {

            }

        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    }


    //初始化分页
    //init
    $(function () {
        var currentPage = $("#currentPage").val();
        var totalPage = $("#totalPage").val();
        var totalRecords = $("#totalCount").val();

        //生成分页
        //有些参数是可选的，比如lang，若不传有默认值
        new Pager({
            pno: currentPage,
            //总页码
            total: totalPage,
            //总数据条数
            totalRecords: totalRecords,
            isShowTotalRecords: true,
            isGoPage: true,
            mode: 'click', //默认值是link，可选link或者click

            click: function (n) {
                $("#currentPage").val(n);
                queryRoleInfoList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });
    });

    function queryRoleInfoList() {
        $("#queryRoleInfoListForm").submit();
    }

</script>
