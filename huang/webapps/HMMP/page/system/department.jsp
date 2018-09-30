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
    <title>平台运营-部门管理-部门管理</title>
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
        <shiro:hasPermission name="member:dept:add">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <a href="<%=basePath%>admin/department/toAddDepartment" class="addbtn">新增部门</a>
            </div>
        </div>
        </shiro:hasPermission>
        <shiro:hasPermission name="member:dept:query">
        <div class="filter-bar ">
            <form id="queryDepartmentListForm" action="<%=basePath%>admin/department/listByPage" method="post" >
                <input type="hidden" id="totalCount" name="pgSupport.totalCount"
                       value="<c:choose><c:when test="${not empty pgSupport.totalCount}">${pgSupport.totalCount}</c:when><c:otherwise>0</c:otherwise></c:choose>">
                <input type="hidden" id="totalPage" name="pgSupport.totalPages"
                       value="<c:choose><c:when test="${not empty pgSupport.totalPages}">${pgSupport.totalPages}</c:when><c:otherwise>0</c:otherwise></c:choose>">

                <input type="hidden" id="currentPage" name="currentPage" value="<c:choose><c:when test='${empty deptQueryDTO.currentPage}'>1</c:when><c:otherwise>${deptQueryDTO.currentPage}</c:otherwise></c:choose>" />
                <input type="hidden" id="pageSize" name="pageSize" value="<c:choose><c:when test='${empty deptQueryDTO.pageSize}'>5</c:when><c:otherwise>${deptQueryDTO.pageSize}</c:otherwise></c:choose>" />

            <ul class="clearfix">
                <li class="filter-bar-list">
                    <span class="filter-bar-list-title">部门名称:</span><input id="deptName" name="deptName" value="${deptQueryDTO.deptName}" type="text" value="" placeholder="请输入部门名称查询">
                    <i class="empty iconfont icon-ArtboardCopy"></i>
                </li>
                <li><a class="search-btn" href="javascript:queryDepartmentList();"><i class="iconfont icon-search"></i></a></li>
            </ul>
            </form>
        </div>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="table-list">
            <div class="table-list-header">
                <ul class="clearfix">
                    <li class="list1" style="width: 100px">序号</li>
                    <li class="list2" style="width: 150px">部门编号</li>
                    <li class="list3" style="width: 250px">部门名称</li>
                    <li class="list4" style="width: 250px">上级部门</li>
                    <li class="list10">操作</li>
                </ul>
            </div>
            <div class="table-list-content clearfix">
    <c:if test="${not empty pgSupport}">
        <c:forEach items="${pgSupport.recordList}" var="dept" varStatus="status">
                <ul class="row clearfix">
                    <li class="list1" style="width: 100px">${status.index + 1}</li>
                    <li class="list2" style="width: 150px"class="">${dept.deptNo}</li>
                    <li class="list3" style="width: 250px">${dept.deptName}</li>
                    <li class="list4" style="width: 250px">
                        <c:if test="${not empty dept.parentDeptName}" >${dept.parentDeptName}</c:if>
                        <c:if test="${ empty dept.parentDeptName}" >----</c:if>
                    </li>
                    <li class="list10" style="color: #FF6000;">
                        <div class="table-list-content-tools">
                            <ul class="clearfix">
                                <shiro:hasPermission name="member:dept:edit">
                                    <li><a href="<%=basePath%>admin/department/toEditDepartment/${dept.id}">编辑</a><span>|</span></li>
                                </shiro:hasPermission>
                                <shiro:hasPermission name="member:dept:delete">
                                    <li><a href="javascript:deleteDepartment('${dept.id}');" class="delete">删除</a></li>
                                </shiro:hasPermission>
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
//    limitStr($('.user-manage-wrap .list6')); //部门管理页面
//    limitStr($('.user-manage-wrap .list8'));
//    limitStr($('.user-manage-wrap .list7'));


    //5、点击删除按钮出现弹出框
    function deleteDepartment(id) {
        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: '确定要删除该部门吗？',
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '保存',
            ok: function () {
                $.ajax({
                    type:'POST',
                    dataType : 'json',
                    context : document.body,
                    url : '<%=basePath%>admin/department/deleteDepartment',
                    data:{
                        "id":id
                    },
                    success : function(data) {
                        if(data.success){
                            new Tip({ msg: data.msg,timer: 1000});
                            $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/department/listByPage');
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
                queryDepartmentList();

                //手动选中按钮
                this.selectPage(n);
                return false;
            }
        });
    });

    function queryDepartmentList() {
        $("#queryDepartmentListForm").submit();
    }

</script>