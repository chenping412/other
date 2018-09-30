<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ taglib prefix="c" uri="core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>平台运营-日历管理</title>
<link rel="stylesheet" href="<%=basePath%>css/zabuto_calendar.css">
<link rel="stylesheet" href="<%=basePath%>css/bootstrap.min.css">
</head>

<body>
<div id="my-calendar"></div>
</body>

</html>
<script src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script src="<%=basePath%>js/bootstrap.min.js"></script>
<script src="<%=basePath%>js/zabuto_calendar.js"></script>
<script>
$(document).ready(function () {
    $("#my-calendar").zabuto_calendar({
    	language: 'cn',
    	cell_border: true,
        today: true,
        weekstartson: 0,
        action: function () {
            return myDateFunction(this.id, false);
        },
        nav_icon: {
          prev: '<i class="fa fa-chevron-circle-left"><</i>',
          next: '<i class="fa fa-chevron-circle-right">></i>'
        },
        ajax: {
            url: "<%=basePath%>admin/calendarController/list",
            modal: true
        }
    });
});
function myDateFunction (id,flag) {
	var td = $('#'+id);
	var date = id.split('_')[3];
	if (td.hasClass('event')) {
		td.removeClass('event');
		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			url : '<%=basePath%>admin/calendarController/del',
			data : date,
			success : function(data) {}
		});
	} else {
		td.addClass('event');
		$.ajax({
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=UTF-8',
			context : document.body,
			url : '<%=basePath%>admin/calendarController/save',
			data : date,
			success : function(data) {}
		});
	}
}
</script>