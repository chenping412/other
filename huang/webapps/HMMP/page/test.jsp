<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>权限示例</title>
    </head>
    <body>
        <h2>Hello, <shiro:principal type="com.travel.system.entity.User" property="realName"/>登录成功</h2>

        <shiro:hasPermission name="user_add">
            <div>
                <input type="button" value="新增用户"/>
            </div>
            <br>
        </shiro:hasPermission>

        <div>
            <a href="javasrcipt:void(0);">点我看详情</a>
        </div>
        <br>

        <shiro:hasRole name="product_manager">
        <div>
            <textarea rows="10" style="width: 300px;" placeholder="描述信息"></textarea>
        </div>
        </shiro:hasRole>

        <div class="top_container">
            <div class="header_container">

            </div>
            <div class="main_container">
                <div class="left_container">

                </div>
                <div class="right_container">
                    
                </div>
            </div>
        </div>
    </body>
</html>
