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
    <title>平台运营-用户管理-新增用户</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

<div class="add-newuser-wrap">
    <div class="breadcrumb">
       <%-- <a class="return" href="javascript:;"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
        <span>当前位置：</span>
        <a href="javascript:;">用户管理</a>
        <span>></span>
        <a href="javascript:;">新增用户</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>1.新增用户</h3>
                <form id="addUserFrom" action="addUser" method="post" class="form-list">
                    <input type="hidden" id="department" name="department" value="" />
                    <ul class="row">
                        <li class="list"><span>用户姓名<i class="colorYellow">*</i> ：</span><input type="text" id="realName" name="realName" placeholder="请输入用户姓名"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>登录名<i class="colorYellow">*</i>  ：</span><input type="text" autocomplete="off" id="username" name="username" placeholder="请输入登录名"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>密码<i class="colorYellow">*</i> ：</span><input type="password" autocomplete="off" id="password" name="password"  placeholder="请输入密码"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>手机号码<i class="colorYellow">*</i> ：</span><input type="text" id="tel" name="tel" placeholder="请输入手机号码" datatype="m"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>QQ号码<i class="colorYellow">*</i> ：</span><input type="text" id="qq" name="qq" placeholder="请输入QQ号码"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list drop-box"><span>所属部门<i class="colorYellow">*</i> ：</span>
                            <input type="text" value="" readonly  class="input-effective needborder select-box-value" placeholder="请输入所属部门">
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
                        <li class="list"><span>职务描述</span><input type="text" id="description" name="description"  placeholder="请输入职务描述"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    </ul>
                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>2.角色设置</h3>
                <div class="check-role-box clearfix" id="roleBox">
                    <span>所属角色<i class="colorYellow">*</i> ：</span>
                    <form action="#" class="check-role-form clearfix">
                        <ul>
    <c:if test="${not empty roles}">
        <c:forEach items="${roles}" var="role">
                            <li>
                                <i class="iconfont icon-fuxuan1"></i>
                                <i class="iconfont icon-fuxuan"></i>
                                <input type="checkbox" data-roleId="${role.id}">
                                <span>${role.roleName}</span>
                            </li>
        </c:forEach>
    </c:if>
                            <li class="check-role-from-tools">
                                <i class="iconfont icon-Artboard4"></i>
                            </li>
                            <li class="check-role-from-tools">
                                <i class="iconfont icon-Refresh"></i>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="<%=basePath%>admin/queryUserList" class="cancel">取消</a>
                <a href="javascript:addUser();" class="save" >保存</a>
            </div>

        </div>
    </div>
    <!-- 设置弹出框的内容 -->
    <div id="addnew-role-dialog" style="display:none">
        <span>角色名称：</span><input type="text" id="roleName" name="roleName" value="" placeholder="必填，角色名称限10字"><i class="empty role-name iconfont icon-ArtboardCopy"></i>
        <span>角色编码：</span><input type="text" id="roleCode" name="roleCode" value="" placeholder="必填，角色名称限10字"><i class="empty role-code iconfont icon-ArtboardCopy"></i>
        <span>角色描述：</span><textarea name="roleDescription" id="roleDescription" placeholder="请输入" style="resize:none"></textarea><i class="empty role-des iconfont icon-ArtboardCopy"></i>
    </div>
</div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/common.js"></script>
<script>
    //2 切换选择框背景图
    $('.check-role-form ul li').children('input').on('click', function () {
        if ($(this)[0].checked == false) {
            $(this).siblings('.icon-fuxuan').hide().siblings('.icon-fuxuan1').show()
        } else {
            $(this).siblings('.icon-fuxuan').show().siblings('.icon-fuxuan1').hide()
        }
    })

    //3、点击出现弹出框
    $('.check-role-from-tools').find('.icon-Artboard4').on('click', function () {
        var d = dialog({
            title: '新增角色',
            padding: '',
            width: 310,
            content: $('#addnew-role-dialog'),
            skin: 'saas_comfirm edit-port-dialog addnew-user-dialog',
            cancelValue: '取消',
            okValue: '保存',
            ok: function () {
                var roleName = $("#roleName").val();
                var roleCode = $("#roleCode").val();
                var roleDescription = $("#roleDescription").val();

                if(null == roleName || '' == roleName){
                    new Tip({msg: "请输入角色名称", timer: 1000, type:2 });
                    return false;
                }
                if(null == roleCode || '' == roleCode){
                    new Tip({msg: "请输入角色编码", timer: 1000, type:2 });
                    return false;
                }

                $.ajax({
                    type:'POST',
                    dataType : 'json',
                    context : document.body,
                    url : '<%=basePath%>admin/addRoleInfo',
                    data:{
                        "roleName":roleName,
                        "roleCode":roleCode,
                        "description":roleDescription
                    },
                    success : function(data) {
                        if(data.success){
                            new Tip({ msg: data.msg,timer: 1000});
                            var roles = eval(data.roles);
                            var roleDivHtml = "<span>所属角色<i class='colorYellow'>*</i> ：</span>";
                            roleDivHtml += "<form action='#' class='check-role-form clearfix'>";
                            roleDivHtml += "   <ul>";
                            $.each(roles,function(i,item){
                                roleDivHtml += "   <li>"
                                roleDivHtml += "        <i class='iconfont icon-fuxuan1'></i>";
                                roleDivHtml += "        <i class='iconfont icon-fuxuan'></i>"
                                roleDivHtml += "        <input type='checkbox' data-roleId='"+roles[i].roleCode+"'>"
                                roleDivHtml += "        <span>" + roles[i].roleName + "</span>"
                                roleDivHtml += "   </li>"
                            });
                            roleDivHtml += "      <li class='check-role-from-tools'>"
                            roleDivHtml += "      <i class='iconfont icon-Artboard4'></i>"
                            roleDivHtml += "      </li>"
                            roleDivHtml += "      <li class='check-role-from-tools'>"
                            roleDivHtml += "          <i class='iconfont icon-Refresh'></i>"
                            roleDivHtml += "      </li>"
                            roleDivHtml += "   </ul>"
                            roleDivHtml += "</form>"
                            $("#roleBox").html(roleDivHtml);

                        }else{
                            new Tip({ msg: data.msg,timer: 1000, type:2});
                        }
                    }
                });
            },
            cancel: function () {}
        }).showModal();
        $('.ui-popup-backdrop').css('background-color', 'rgba(255,255,255,0.6)')
    })

    //弹窗报错样式
    $('#addnew-role-dialog input').blur(function () {
        console.log($(this).val())
        if ($(this).val = ' ') {
            $(this).css({
                'border': '1px solid #ff6000',
            });
            $(this).addClass('input-error')
        }
    });

    function buildSuccessTip()
    {
        return '<span class="valid-tip success"><i></i></span>';
    }

    function buildErrorTip(errorMsg)
    {
        return '<span class="valid-tip error"><i></i><b>' + errorMsg + '</b></span>';
    }

    function buildWrapDiv()
    {
        return '<span class="f_ui-valid-item" style="height:42px"></span>';
    }

//    function validate(condition, errorMsg, elem)
//    {
//        if(condition){
//            elem.wrap(buildWrapDiv);
//            elem.after(buildErrorTip(errorMsg));
//            return false;
//        } else {
//            if (elem.next(".valid-tip"))
//            {
//                // 判断是否存在
//                elem.unwrap();
//                elem.next(".valid-tip").remove();
//            }
//            return true;
//        }
//    }

    new validform('.form-list');

    function addUser(){
        var roleIds = new Array();
        $('.check-role-form ul li').children('.icon-fuxuan').each(function(){
            if($(this).css("display") != "none"){
                roleIds.push($(this).siblings('input').data('roleid'));
              //  roleIds.push($('.check-role-form ul li').children('input').data('roleid'));
            }
        });

        var realName = $("#realName").val();
        var username = $("#username").val();
        var password = $("#password").val();
        var tel = $("#tel").val();
        var qq = $("#qq").val();
        var department = $("#department").val();
        var description = $("#description").val();

        console.log('#' + department +'#');

        if(null == realName || '' ==  realName){
            new Tip({ msg: '请输入用户姓名',timer: 1000,type: 2 });
            return;
        }

        if(realName.length < 2 || realName.length > 4){
            new Tip({ msg: '用户姓名长度必须2-4位',timer: 1000,type: 2 });
            return;
        }

        if(null == username || '' == username){
            new Tip({ msg: '请输入登录名',timer: 1000,type: 2 });
            return;
        }

        if(username.length < 5 || username.length > 16){
            new Tip({ msg: '登录名长度必须5-16位',timer: 1000,type: 2 });
            return;
        }

        if(null == password || '' == password){
            new Tip({ msg: '请输入密码',timer: 1000,type: 2 });
            return;
        }

        if(password.length < 5 || password.length > 16){
            new Tip({ msg: '密码长度必须5-16位',timer: 1000,type: 2 });
            return;
        }

        if(null == tel || '' == tel){
            new Tip({ msg: '请输入手机号码',timer: 1000,type: 2 });
            return;
        }

        if(null == qq || '' == qq){
            new Tip({ msg: '请输入QQ号码',timer: 1000,type: 2 });
            return;
        }

        if(qq.length < 5 || qq.length > 20 || !/^\d{5,20}$/.test(qq)){
            new Tip({ msg: 'QQ长度必须5-20位的数字',timer: 1000,type: 2 });
            return;
        }

        if (null == department || '' == department) {
            new Tip({msg: '请选择所属部门', timer: 1000, type: 2});
            return;
        }

        // 读取框架自动校验出的错误提示
        if ($(".error", $("#addUserFrom")).length > 0)
        {
            new Tip({ msg: $(".error", $("#addUserFrom")).text(),timer: 1000,type: 2 });
            return;
        }

        if(roleIds.length < 1){
            new Tip({ msg: '请选择用户角色',timer: 1000,type: 2 });
            return;
        }

        $.ajax({
            type:'POST',
            dataType : 'json',
            context : document.body,
            url : '<%=basePath%>admin/addUser',
            data:{
                "realName":realName,
                "username":username,
                "password":password,
                "tel":tel,
                "qq":qq,
                "department":department,
                "description":description,
                "roleIds":roleIds.toString()
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
    }

    $('#departmentBox').on('click', 'li', function () {
        $("#department").val($(this).attr("value"));
    });
</script>