<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>平台运营-用户管理-修改密码</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
    <style type="text/css">
        .form-list span {
            width: 70px;
        }
    </style>
</head>

<body>

<div class="edit-password-wrap">
    <div class="breadcrumb">
       <%-- <a class="return" href="./平台运营-用户管理.html"><i class="iconfont icon-Artboard5"></i>返回</a>--%>
        <span>当前位置：</span>
        <a href="javascript:;">用户管理</a>
        <span>></span>
        <a href="javascript:;">我的</a>
        <span>></span>
        <a href="javascript:;">修改密码</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>修改密码</h3>

            </div>
        </div>
        <div class="search-conent" style="display:block">
            <form id="changePasswordForm" action="changePassword" method="post" class="form-list">
                <input type="hidden" id="id" name="id" value="${id}">
                <input type="hidden" id="oldPassword" name="oldPassword" value="${password}">
                <ul class="row">
                    <li class="list"><span class="form-list-title">原密码：</span><input type="password" autocomplete="off" id="oldPassword01" name="oldPassword01" ><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list"><span class="form-list-title">新密码：</span><input type="password" id="password" name="password" ><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list"><span class="form-list-title">确认密码：</span><input type="password" id="confirmPassword" name="confirmPassword" datatype="s6-16" errormsg="两次输入的密码不一致"
                                                                                      class="error-reminder"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                </ul>
            </form>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="<%=basePath%>admin/queryUserList" class="cancel">取消</a><a href="javascript:changePassword();" class="save" >保存</a>
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
    function toSomeWhere() {
        $(this).addClass("sidebar-active")
        //$(this).href("<%=basePath%>admin/toPersonalProfile");
        $(window.parent.document).find(".user-data").children().attr('src', '<%=basePath%>admin/toPersonalProfile')
    }
    //    $('.error-reminder').blur('click',function(){
    //        //判断确认密码是否与上面密码一直，不一致就报错
    //        $('.error-reminder').css('border','1px solid #ff6000').siblings('.error-tip').show();
    //    })

    new validform('.form-list');

    function changePassword() {
        var oldPassword = $("#oldPassword").val();
        var oldPassword01 = $("#oldPassword01").val();
        var password = $("#password").val();
        var confirmPassword = $("#confirmPassword").val();

        if(null == oldPassword01 || '' == oldPassword01){
            new Tip({ msg: '请输入原始密码',timer: 1000,type: 2 });
            return;
        }
        if(oldPassword01 != oldPassword){
            new Tip({ msg: '原始密码不正确',timer: 1000,type: 2 });
            return;
        }

        if(null == password || '' == password){
            new Tip({ msg: '请输入新密码',timer: 1000,type: 2 });
            return;
        }
        if(password.trim() == oldPassword01.trim()){
            new Tip({ msg: '新密码与原密码一样',timer: 1000,type: 2 });
            return false;
        }
        if(null == confirmPassword || '' == confirmPassword){
            new Tip({ msg: '请输入确认密码',timer: 1000,type: 2 });
            return;
        }
        if(password.trim() != confirmPassword.trim()){
            new Tip({ msg: '确认密码跟新密码不一致',timer: 1000,type: 2 });
            return;
        }

        $.ajax({
            type:'POST',
            dataType : 'json',
            context : document.body,
            url : '<%=basePath%>admin/changePassword',
            data:{
                "id":$("#id").val(),
                "password":$("#password").val()
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

</script>