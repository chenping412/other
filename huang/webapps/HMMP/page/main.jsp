<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>酒店分销管理平台</title>
    <link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
	<link rel="stylesheet" href="<%=basePath%>css/style.css">
    <link rel="stylesheet" href="<%=basePath%>css/index.css">
    <link rel="stylesheet" href="<%=basePath%>css/font/iconfont.css">
<style>
.saas_pop .ui-dialog-close {
    background: url(../images/ico.png) no-repeat 7px 6px;
}
body{
	overflow-x:hidden;
	overflow-y:hidden;
}
</style>
</head>
<body>
    <div class="welcome-image">
        <img src="<%=basePath%>images/welcome.png" alt="">
        <h3>欢迎你</h3>
        <p>${loginUser.realName}</p>
    </div>

    <div class="platform-header">
        <ul class="tab">
            <li>酒店分销管理平台</li>
            <li class="tab-active">首页</li>
            <shiro:hasPermission name="product">
            <li>产品管理</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="order">
            <li>订单管理</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="finance">
            <li>财务报表</li>
            </shiro:hasPermission>
            <%--<li>供应商管理</li>--%>
            <%--<li>客户管理</li>--%>
            <shiro:hasPermission name="member">
            <li>基础资料</li>
            </shiro:hasPermission>
            <li class="user-info">
                <i class="user-icon iconfont icon-avatar"></i>
                <div class="personal-info">
                    <i class="iconfont icon-triangle-top"></i>
                    <span>欢迎您</span>
                    <span>${loginUser.realName}</span>
                    <a href="<%=basePath%>admin/logout">退出登录</a>
                </div>
            </li>
        </ul>
    </div>
    <!-- 侧边栏 -->
    <div class="platform-sidebar">

        <!-- 基础资料-->
        <div class="sidebar-wrap user-data-sidebar">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i> 我的</li>
            <shiro:hasPermission name="member:profile">
                <li class="list sidebar-active">个人资料</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="member:changePassword">
                <li class="list">修改密码</li>
            </shiro:hasPermission>
            </ul>

            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>公司管理</li>
            <shiro:hasPermission name="member:dept">
                 <li class="list">部门管理</li> <%-- one-list 这是原来的那个样式，控制只有一个菜单的--%>
            </shiro:hasPermission>
            <shiro:hasPermission name="member:employee">
                <li class="list">员工管理</li> <%-- one-list 这是原来的那个样式，控制只有一个菜单的--%>
            </shiro:hasPermission>

            <shiro:hasPermission name="member:role">
                <li class="list">角色管理</li><%-- one-list 这是原来的那个样式，控制只有一个菜单的--%>
            </shiro:hasPermission>
            	<li class="list">日历管理</li>
            </ul>

            <shiro:hasPermission name="member:supplier">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>供应商管理</li>
                <li class="list">我的供应商</li>
            </ul>
            </shiro:hasPermission>

            <shiro:hasPermission name="member:agent">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>客户管理</li>
                <li class="list">我的客户</li>
            </ul>
            </shiro:hasPermission>
            <shiro:hasPermission name="product:hotel">
            	<ul class="sidebar-search">
            	<li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>酒店信息</li>
                <li class="list">我的酒店</li>
                </ul>
            </shiro:hasPermission>
			<shiro:hasPermission name="finance:exchange">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>汇率管理</li>
                <li class="list sidebar-active">汇率设置</li>
            </ul>
            </shiro:hasPermission>
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>银行账号管理</li>
                <li class="list sidebar-active">我的银行账号</li>
            </ul>
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>区间报价信息管理</li>
                <li class="list sidebar-active">区间报价信息</li>
            </ul>

        </div>

        <!--产品管理 -->
        <div class="sidebar-wrap product-manage-sidebar">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i> 库存管理</li>
                <shiro:hasPermission name="product:hotel">
                <li class="list">我的酒店</li>
                </shiro:hasPermission>
<%--                 <shiro:hasPermission name="product:hotel:product:query"> --%>
<!--                 <li class="list">我的产品</li> -->
<%--                 </shiro:hasPermission> --%>
                <shiro:hasPermission name="product:controlRoom">
                <li class="list">珠海每日控房</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="product:controlRoom">
                <li class="list">港澳每日控房</li>
                </shiro:hasPermission>
                <li class="list">动态报价</li>
                <li class="list">区间报价</li>
            </ul>

            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i> 代理通管理</li>
                <%--<shiro:hasPermission name="product:hotel">--%>
                    <li class="list">酒店映射</li>
                    <li class="list">售卖房型映射</li>
                    <li class="list">报价同步开关</li>
                <%--</shiro:hasPermission>--%>
            </ul>

            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>报表</li>
                <shiro:hasPermission name="product:quotaExport">
                <li class="list">配额报表</li>
                </shiro:hasPermission>
            </ul>
        </div>

        <!--订单管理 -->
        <div class="sidebar-wrap order-manage-sidebar">
            <ul class="sidebar-search">
                <shiro:hasPermission name="order">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>订单管理</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="order:list">
                <li class="list">我的订单</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="order:add">
                <li class="list">手工录单</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="order:appeal">
                <li class="list">订单申诉</li>
                </shiro:hasPermission>
                <li class="list">查房</li>
            </ul>
        </div>

        <!--财务报表 -->
        <div class="sidebar-wrap finance-manage-sidebar">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>财务结算</li>
                <shiro:hasPermission name="finance:supplier:bill">
                <li class="list sidebar-active">供应商出账销账</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="finance:supplier:billLog">
                <li class="list">供应商销账记录</li>
                </shiro:hasPermission>

                <shiro:hasPermission name="finance:supplier:rebateBill">
                <li class="list">供应商返佣出账销账</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="finance:supplier:rebateBillLog">
                <li class="list">供应商返佣销账记录</li>
                </shiro:hasPermission>

                <shiro:hasPermission name="finance:agent:bill">
                <li class="list">客户出账销账</li>
                </shiro:hasPermission>
                <shiro:hasPermission name="finance:agent:billLog">
                <li class="list">客户销账记录</li>
                </shiro:hasPermission>
            </ul>
            <shiro:hasPermission name="finance:orderAppeal">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>申诉管理</li>
                <li class="list sidebar-active">订单申诉</li>
            </ul>
            </shiro:hasPermission>
            <shiro:hasPermission name="finance:orderLock">
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>订单解锁</li>
                <li class="list sidebar-active">订单解锁</li>
            </ul>
            </shiro:hasPermission>
            <ul class="sidebar-search">
                <li class="titie"><i class="iconfont  icon-downTriangle"></i><i class="iconfont  icon-arrow-left-copy"></i>财务报表</li>
                <li class="list sidebar-active">应收报表</li>
                <li class="list">应收毛利报表</li>
                <li class="list">应付报表</li>
                <li class="list">珠海毛利日报表</li>
                <li class="list">港澳毛利日报表</li>
            </ul>
        </div>
    </div>

    <!--产品管理内容显示区-->
    <div class="platform-content product-manage">
        <iframe src="javascript:;" frameborder="0" width="100%" height="100%"></iframe>
    </div>

    <!--订单管理内容显示区-->
    <div class="platform-content order-manage">
            <iframe src="javascript:;"  id="orderiframe" name="orderiframe" frameborder="0" width="100%" height="100%"></iframe>
    </div>

    <!--财务报表内容显示区-->
    <div class="platform-content finance-manage">
		<iframe src="javascript:;" frameborder="0" width="100%" height="100%"></iframe>
    </div>


    <!--供应商管理内容显示区-->
    <div class="platform-content supply-manage">
        <iframe src="javascript:;"  frameborder="0" width="100%" height="100%"></iframe>
    </div>

    <!--客户管理内容显示区-->
    <div class="platform-content agent-manage">
        <iframe src="javascript:;" frameborder="0" width="100%" height="100%"></iframe>
    </div>

    <!--员工管理内容显示区域-->
    <div class="platform-content user-data">
        <iframe src="javascript:;" frameborder="0" width="100%" height="100%"></iframe>
    </div>

</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/main.min.js"></script>
<script src="<%=basePath%>js/index.js?ver=1"></script>


