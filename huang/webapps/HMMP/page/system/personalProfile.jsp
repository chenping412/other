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
    <title>平台运营-用户管理-个人资料</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

<div class="user-data-wrap">
    <div class="breadcrumb">
        <span>当前位置：</span>
        <a href="javascript:;">用户管理</a>
        <span>></span>
        <a href="javascript:;">我的</a>
        <span>></span>
        <a href="javascript:;">个人资料</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>个人资料<a href="javascript:;" class="user-data-edit">修改</a></h3>

            </div>
        </div>
        <div class="search-conent" style="display:block">
            <form id="editPersonalProfileForm" action="editPersonalProfile" method="post" class="form-list">
                <input type="hidden" id="id" name="id" value="${loginUser.id}">
                <ul class="row">
                    <li class="list"><span>用户姓名：</span><input class="need-readonly" type="text" value="${loginUser.realName}" readonly></li>
                    <li class="list"><span>登录名：</span><input class="need-readonly" type="text" value="${loginUser.username}" readonly></li>
                    <li class="list"><span>所属部门：</span><input class="need-readonly" type="text" value="${loginUser.department}" readonly></li>
                    <li class="list need-edit"><span>QQ号码：</span><input type="text" id="qq" name="qq" placeholder="请输入QQ号码" value="${loginUser.qq}" readonly><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list need-edit"><span>手机号码：</span><input type="text" id="tel" name="tel" placeholder="请输入手机号码" value="${loginUser.tel}" readonly ><i class="empty iconfont icon-ArtboardCopy"></i></li>
                    <li class="list need-edit big-input-edit"><span>职务描述：</span><textarea name="description" id="description" placeholder="请输入职务描述" readonly>${loginUser.description}</textarea><i class="empty iconfont icon-ArtboardCopy"></i></li>
                </ul>
            </form>

        </div>
        <div class="baseline"></div>
        <div class="search-footer" >
            <div style="float:right">
                <a href="<%=basePath%>admin/toPersonalProfile" class="cancel">取消</a><a href="javascript:editPersonalProfile();" class="save">保存</a>
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
    new validform('.form-list');

    function editPersonalProfile() {
        var qq = $("#qq").val();
        var tel = $("#tel").val();
        var description = $("#description").val();

        if(null == tel || '' == tel || !(/^1[34578]\d{9}$/).test(tel)){
            new Tip({ msg: '请输入正确的手机号码',timer: 1000,type: 2 });
            return;
        }

        if(null == qq || '' == qq){
            new Tip({ msg: '请输入QQ号码',timer: 1000,type: 2 });
            return;
        }

        if(qq.length < 5 || qq.length > 20 || !(/^\d{5,20}$/).test(qq)){
            new Tip({ msg: 'QQ长度必须5-20位的数字',timer: 1000,type: 2 });
            return;
        }

        $.ajax({
            type:'POST',
            dataType : 'json',
            context : document.body,
            url : '<%=basePath%>admin/editLoginUser',
            data:{
                "id":$("#id").val(),
                "tel":tel,
                "qq":qq,
                "description":$("#description").val()
            },
            success : function(data) {
                if(data.success){
                    new Tip({ msg: data.msg,timer: 1000});
                    $(window.parent.document).find(".user-data").children().attr('src','<%=basePath%>admin/toPersonalProfile');
                }else{
                    new Tip({ msg: data.msg,timer: 1000, type:2});
                }
            }
        });

    }

</script>
