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
    <title>平台运营-部门管理-新增部门</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
    <link rel="stylesheet" href="<%=basePath%>css/page.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
</head>

<body>

<div class="add-newuser-wrap">
    <div class="breadcrumb">
       <%-- <a class="return" href="javascript:;"><i class="iconfont icon-Artboard5"></i>返回</a>&nbsp;--%>
        <span>当前位置：</span>
        <a href="javascript:;">部门管理</a>
        <span>></span>
        <a href="javascript:;">新增部门</a>
    </div>
    <div class="main-content">
        <div class="section-wrap section-wrap-function">
            <div class="section-content">
                <h3>1.新增部门</h3>
                <form id="addDepartmentFrom" action="addDepartment" method="post" class="form-list">
                    <ul class="row">
                        <input type="hidden" id="parent" name="parent" value="" />
                        <input type="hidden" id="parentName" name="parentName" value="" />
                        <li class="list"><span>部门编号<i class="colorYellow">*</i> ：</span><input type="text" id="deptNo" name="deptNo" placeholder="请输入部门编号"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>部门名称<i class="colorYellow">*</i>  ：</span><input type="text" autocomplete="off" id="deptName" name="deptName" placeholder="请输入部门名称"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list drop-box"><span>上级部门<i class="colorYellow">*</i> ：</span>
                            <input type="text" value="" readonly  class="input-effective needborder select-box-value" placeholder="请选择上级部门">
                            <i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" id="parentDeptBox">
                                <ul class="clearfix">
                                    <li>请选择上级部门</li>
                                    <c:forEach items="${departmentList}" var="deptItem">
                                        <li value="${deptItem.id}">${deptItem.deptName}</li>
                                    </c:forEach>
                                </ul>
                            </div>
                        </li>
                        <li class="list"><span>部门描述  ：</span><input type="text" autocomplete="off" id="description" name="description" placeholder="请输入部门描述"><i class="empty iconfont icon-ArtboardCopy"></i></li>

                        <li class="list"><span>邮箱账号  ：</span><input type="text" onblur="selectEmailHost()" autocomplete="off" id="emailUsername" name="emailUsername" placeholder="请输入邮箱账号"><i class="empty iconfont icon-ArtboardCopy"></i></li>
                        <li class="list"><span>邮箱密码  ：</span><input type="password" autocomplete="off" id="emailPassword" name="emailPassword" placeholder="请输入邮箱密码"><i class="empty iconfont icon-ArtboardCopy"></i></li>

                        <li class="list drop-box"><span>服务器：</span>
                            <input type="text" value="" id="emailHost" class="input-effective needborder select-box-value" name="emailHost">
                            <i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" id="emailHostBox">
                                <ul class="clearfix">
                                    <li value="smtp.qq.com">smtp.qq.com</li>
                                    <li value="smtp.163.com">smtp.163.com</li>
                                    <li value="smtp.126.com">smtp.126.com</li>
                                    <li value="smtp.exmail.qq.com">smtp.exmail.qq.com</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list drop-box"><span>端口：</span>
                            <input type="text" value="" id="emailPort" class="input-effective needborder select-box-value" name="emailPort">
                            <i class="iconfont  icon-downTriangle"></i>
                            <div class="form-list-drop-box" id="emailPortBox">
                                <ul class="clearfix">
                                    <li value="465">465</li>
                                    <li value="587">587</li>
                                </ul>
                            </div>
                        </li>

                    </ul>
                </form>

            </div>
        </div>
        <div class="baseline"></div>
        <div class="search-footer">
            <div style="float:right">
                <a href="<%=basePath%>admin/department/listByPage" class="cancel">取消</a>
                <a href="javascript:addDepartment();" class="save" >保存</a>
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

    function addDepartment(){

        var deptNo = $("#deptNo").val();
        var deptName = $("#deptName").val();
        var parent = $("#parent").val();
        var description = $("#description").val();

        var emailUsername = $("#emailUsername").val();
        var emailPassword = $("#emailPassword").val();
        var emailHost = $("#emailHost").val();
        var emailPort = $("#emailPort").val();

        if(null == deptNo || '' ==  deptNo){
            new Tip({ msg: '请输入部门编号',timer: 1000,type: 2 });
            return;
        }

        if(null == deptName || '' ==  deptName){
            new Tip({ msg: '请输入部门名称',timer: 1000,type: 2 });
            return;
        }

        // 读取框架自动校验出的错误提示
        if ($(".error", $("#addDepartmentFrom")).length > 0)
        {
            new Tip({ msg: $(".error", $("#addDepartmentFrom")).text(),timer: 1000,type: 2 });
            return;
        }

        $.ajax({
            type:'POST',
            dataType : 'json',
            context : document.body,
            url : '<%=basePath%>admin/department/addDepartment',
            data:{
                "deptNo":deptNo,
                "deptName":deptName,
                "parent":parent,
                "description":description,
                "emailUsername":emailUsername,
                "emailPassword":emailPassword,
                "emailHost":emailHost,
                "emailPort":emailPort
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
    }

    $('#parentDeptBox').on('click', 'li', function () {
        $("#parentName").val($(this).html() == '请选择上级部门' ? '' : $(this).html());
        $("#parent").val($(this).attr("value"));
    });

    //根据邮箱账号，自动选择发件服务器和端口号
    function selectEmailHost() {
        var emailUsername = $("#emailUsername").val();
        var emailHost = "";
        var emailPort = "";
        if (emailUsername){
            if (emailUsername.indexOf("@qq.com") != -1){
                emailHost = "smtp.qq.com";
                emailPort= "465";
            }else if (emailUsername.indexOf("@163.com") != -1){
                emailHost= "smtp.163.com";
                emailPort= "25";
            }else if (emailUsername.indexOf("@126.com") != -1){
                emailHost= "smtp.126.com";
                emailPort= "25";
            } else{
                emailPort = "25";
            }

            $("#emailHost").val(emailHost);
            $("#emailPort").val(emailPort);
        }
    }
</script>