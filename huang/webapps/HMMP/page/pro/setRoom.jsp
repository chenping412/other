<%@ page language="java" pageEncoding="utf-8" %>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="core"%>
<%@ taglib prefix="fmt" uri="fmt"%>
<div id="setRoomDialog">
	<p style="height: 30px; margin-left: 30px;">
		<span>开关房设置：</span>
		<input type="radio" name="setRoom" value="1" style="width: 30px; height: auto; margin-left: 20px;" <c:if test="${not empty room.isOpen && room.isOpen == 1}">checked</c:if> />开房
		<input type="radio" name="setRoom" value="0" style="width: 30px; height: auto;" <c:if test="${empty room.isOpen || room.isOpen == 0}">checked</c:if> />关房
	</p>
	
	<p style="height: 30px; margin-left: 30px;<c:if test="${empty room.isOpen || room.isOpen == 0}">display: none;</c:if>" id="roomLimitTarget">
		<span>预定最大间数：</span>
		<input type="text" name="roomLimit" style="width: 100px; height: 22px; margin-left: 20px;" value="${room.roomLimit}" />
	</p>
	
</div>