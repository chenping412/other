<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div>
	<form id="orderConfirm" class="order-confirm">
		<ul class="row">
			<li class="list">
				<span>类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="confirm" text="订单确认" checked /><i></i> &nbsp;订单确认</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="pay" text="订单支付" /><i></i> &nbsp;订单支付</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="refund" text="订单退款" /><i></i> &nbsp;订单退款</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmType" value="noshow" text="noshow" /><i></i> &nbsp;noshow</label>
			</li>
			<li class="list">
				<span>发件人：</span><input name="from" id="from" type="text" value="${dept.emailUsername}" /><i class="empty iconfont icon-ArtboardCopy"></i>
			</li>
			<li class="list">
				<span>收件人：</span><input name="to" id="to" type="text" value="${agent.email}" /><i class="empty iconfont icon-ArtboardCopy"></i>
			</li>
			<li class="list">
				<span>主题：</span><input name="subject" id="subject" type="text" value="" /><i class="empty iconfont icon-ArtboardCopy"></i>
			</li>
		</ul>
	</form>
</div>