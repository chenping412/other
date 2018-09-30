<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<div id="roomDialog" class="section-wrap section-wrap-function">
	<div class="section-content">
		<form id="addRoomForm" class="form-list" action="addRoom" method="post">
			<ul class="row">
				<li class="list drop-box"><span>酒店<i class="colorYellow"></i>：
				</span><label>${hotel.hotelName}</label><i class="empty iconfont icon-ArtboardCopy"></i> <input type="hidden"
					id="hotelId" name="hotelId" value="${hotel.hotelId}" /></li>
				<li class="list"><span>房型名称<i class="colorYellow">*</i>：
				</span><input name="roomName" id="roomName" class="text w_140 c_666 "
					placeholder="请输入房型名称" autocomplete="off" type="text"><i
					class="empty iconfont icon-ArtboardCopy"></i></li>
				<li class="list" style="height: 150px;">
					<span style="height: 150px; line-height: 150px;">床型:</span>
					<ul class="dowebok" id="bedSelectBox" style="width: 385px; height: 150px; float: right;">
						<c:forEach items="${bedTypeMap}" var="bedTypeItem">
							<li style="display: inline-block;"><input type="checkbox" name="bedType" value="${bedTypeItem.key}" data-labelauty="${bedTypeItem.value}"></li>
						</c:forEach>
					</ul>
				</li>
				<li class="list">
					<span style="vertical-align: middle;">关房设置：</span>
					<input type="radio" name="setRoom" value="1" style="width: 30px; height: auto;" checked />开房
					<input type="radio" name="setRoom" value="0" style="width: 30px; height: auto;" />关房
				</li>
				<li class="list" id="roomLimitTarget">
					<span>预定最大间数：</span>
					<input type="text" name="roomLimit" class="text w_140 c_666" />
				</li>
				<li class="list" style="height: 80px;">
					<span style="vertical-align: middle;">房型描述：</span>
					<textarea name="descp" id="descp" style="vertical-align: middle;" placeholder="对床型尺寸、楼层的等描述信息" autocomplete="off" type="text"></textarea>
				</li>
			</ul>
		</form>
	</div>
</div>