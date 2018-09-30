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
    <title>平台运营-角色管理-新增角色</title>
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

<div class="add-role-wrap">
    <div class="breadcrumb">
        <%--<a class="return" href="./平台运营-角色管理.html"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
        <span>当前位置：</span>
        <a href="javascript:;">用户管理</a>
        <span>></span>
        <a href="javascript:;">角色管理</a>
        <span>></span>
        <a href="javascript:;">新增角色</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>1.新增角色</h3>
                <form action="#" class="form-list">
                    <ul class="row">
                        <li class="list"><span>角色名称：</span><input type="text" id="roleName" name="roleName" placeholder="请输入角色名称"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>角色编码：</span><input type="text" id="roleCode" name="roleCode" placeholder="请输入角色编码"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>角色描述：</span><input type="text" id="description" name="description" placeholder="请输入角色描述"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    </ul>
                </form>
            </div>
        </div>
        <div class="baseline"></div>
        <shiro:hasPermission name="member:role:edit:setPermission">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>2.设置权限</h3>
                <div class="select-tree clearfix">
                    <div class="select-tree-left">
                    <c:if test="${not empty firstLevelResourceList}">
                        <ul>
                        <c:forEach items="${firstLevelResourceList}" var="firstLevelResource" varStatus="status">
                            <li class="select-tree-first-layer" data-layer="f${firstLevelResource.id}">
                                <div class="select-tree-box select-tree-box-first">
                                    <i class="iconfont icon-Artboard4 icon-show iconSH"></i>
                                    <i class="iconfont icon-a1 icon-hide iconSH"></i>
                                    <i class="checkbox-icon iconfont icon-fuxuan1 icon-check-false"></i>
                                    <i class="checkbox-icon iconfont icon-fuxuan icon-checked"></i>
                                    <input type="checkbox" class="check-all">
                                    <span>${firstLevelResource.resourceName}</span>
                                    <i class="iconfont icon-ArtboardCopresourceNamey icon-del"></i>
                                </div>
                            <c:if test="${not empty secondLevelResourceList}">
                                <ul>
                                <c:forEach items="${secondLevelResourceList}" var="secondLevelResource">
                                    <c:if test="${secondLevelResource.pid == firstLevelResource.id}" >
                                    <li  class="select-tree-second-layer" data-layer="s${secondLevelResource.id}">
                                        <div class="select-tree-box">
                                            <i class="iconfont icon-Artboard4 icon-show iconSH" ></i>
                                            <i class="iconfont icon-a1 icon-hide iconSH"></i>
                                            <i class="checkbox-icon iconfont icon-fuxuan1"></i>
                                            <i class="checkbox-icon iconfont icon-fuxuan"></i>
                                            <input type="checkbox" class="check-second-floor">
                                            <span>${secondLevelResource.resourceName}</span>
                                            <i class="iconfont icon-ArtboardCopy icon-del"></i>
                                        </div>

                                    <c:if test="${not empty thirdLevelResourceList}">
                                        <ul>
                                        <c:forEach items="${thirdLevelResourceList}" var="thirdLevelResource" varStatus="status">
                                            <c:if test="${thirdLevelResource.pid == secondLevelResource.id}" >
                                            <li class="select-tree-third-layer" data-layer="t${thirdLevelResource.id}">
                                                <div class="select-tree-box">
                                                    <i class="iconfont icon-Artboard4 icon-show iconSH"></i>
                                                    <i class="iconfont icon-a1 icon-hide iconSH"></i>
                                                    <i class="checkbox-icon iconfont icon-fuxuan1"></i>
                                                    <i class="checkbox-icon iconfont icon-fuxuan"></i>
                                                    <input type="checkbox" class="check-third-floor">
                                                    <span>${thirdLevelResource.resourceName}</span>
                                                    <i class="iconfont icon-ArtboardCopy icon-del"></i>
                                                </div>
                                            </li>
                                           </c:if>
                                            </c:forEach>
                                            </ul>
                                        </c:if>
                                    </li>
                                    </c:if>
                                </c:forEach>
                                </ul>
                            </c:if>
                            </li>
                       </c:forEach>
                        </ul>
                     </c:if>
                    </div>
                    <div class="select-tree-right">
                        <div class="placeholder-style">
                            <img src="<%=basePath%>images/return.png" alt="">
                            <p>该角色暂无任何权限</p>
                            <span>请在左边选择权限</span>
                        </div>
                        <ul>
                            <div class="title"><span>已选择角色权限</span> <a href="javascript:;" class="clear-all">清空所有</a> </div>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
        </shiro:hasPermission>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="javascript:;" class="cancel">取消</a>
                <a href="javascript:;" class="save" onClick="addRoleInfo();">保存</a>
            </div>
        </div>
    </div>
</div>
</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<!-- <script src="./js/template.js"></script> -->
<script src="<%=basePath%>js/common.js"></script>


<script>
    //点击取消按钮出现弹窗

    $('.search-footer').find('.cancel').on('click', function () {
        var d = dialog({
            title: '提示',
            padding: '30px 20px',
            width: 310,
            content: '您还未完成角色创建，确定要放弃新增角色吗？',
            skin: 'saas_comfirm edit-port-dialog',
            cancelValue: '取消',
            okValue: '确定',
            ok: function () {
                $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/queryRoleInfoList');
            },
            cancel: function () {

            }

        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    });

    $('.select-tree .select-tree-right ul').append($('.select-tree .select-tree-left ul').html());

    function addRoleInfo() {
        var resourceIds = new Array();

        $('.select-tree-left').find('.select-tree-first-layer').find("input[class='check-all']:checked").each(function(){
            console.log('#' + $(this).parent().parent('li').data('layer').substr(1));
            resourceIds.push($(this).parent().parent('li').data('layer').substr(1));
        });
        $('.select-tree-left').find('.select-tree-second-layer').find("input[class='check-second-floor']:checked").each(function(){
            resourceIds.push($(this).parent().parent('li').data('layer').substr(1));
        });
        $('.select-tree-left').find('.select-tree-third-layer').find("input[class='check-third-floor']:checked").each(function(){
            resourceIds.push($(this).parent().parent('li').data('layer').substr(1));
        });

        var roleName = $("#roleName").val();
        var roleCode = $("#roleCode").val();
        var description = $("#description").val();
        if(null == roleName || '' == roleName){
            new Tip({msg: "请输入角色名称", timer: 1000, type:2 });
            return;
        }
        if(null == roleCode || '' == roleCode){
            new Tip({msg: "请输入角色编码", timer: 1000, type:2 });
            return;
        }

        $.ajax({
            type:'POST',
            dataType : 'json',
            context : document.body,
            url : '<%=basePath%>admin/addRoleInfo',
            data:{
                "roleName":roleName,
                "roleCode":roleCode,
                "description":description,
                "resourceIds":resourceIds.toString()
            },
            success : function(data) {
                if(data.success){
                    new Tip({ msg: data.msg,timer: 1000});
                    $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/queryRoleInfoList');
                }else{
                    new Tip({ msg: data.msg,timer: 1000, type:2});
                }
            }
        });
    }
</script>
