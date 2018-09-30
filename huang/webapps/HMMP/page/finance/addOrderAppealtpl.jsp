<%@ page language="java" pageEncoding="utf-8"%>
<div>
	<form id="addOrderAppealFrom" method="post" class="order-appeal">
		<ul class="row">
			<li class="list"><span>订单编号<i class="colorYellow"></i> ：
			</span><input type="text" id="orderCode" name="orderCode"
				placeholder="请输订单编号" value="${orderCode}" readonly="readonly" /><i
				class="empty iconfont icon-ArtboardCopy"></i></li>
			<li class="list"><span>申诉理由<i class="colorYellow">*</i> ：
			</span><input type="text" autocomplete="off" id="applyReason"
				name="applyReason" placeholder="请输入申诉理由"><i
				class="empty iconfont icon-ArtboardCopy"></i></li>
			<li class="list"><span>备注 ：</span>
			<textarea id="mark" name="mark" placeholder="请输入备注" datatype="m"
					maxlength="200"></textarea><i
				class="empty iconfont icon-ArtboardCopy"></i></li>
			<li class="list"><span></span><i
				class="empty iconfont icon-ArtboardCopy"></i></li>
		</ul>
	</form>
</div>