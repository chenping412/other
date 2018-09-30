<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div>
	<form id="sendOrder" class="order-confirm">

		<ul class="row">
			<li class="list">
				<span>类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="booking" text="预订单" checked /><i></i> &nbsp;预订单</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="edit" text="修改单" /><i></i> &nbsp;修改单</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="cancel" text="取消单" /><i></i> &nbsp;取消单</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="other" text="other" /><i></i> &nbsp;其他</label>
			</li>
			<div id="sendContent">
				<li class="list">
					<span>发件人：</span><input name="from" id="from" readonly type="text" value="${dept.emailUsername}" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
				<li class="list">
					<span>收件人：</span><input name="to" id="to" type="text" value="${supply.email}" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
				<li class="list">
					<span>主题：</span><input name="subject" id="subject" type="text" value="" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
			</div>
		</ul>
	</form>
</div>