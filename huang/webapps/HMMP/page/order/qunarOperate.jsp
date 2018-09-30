<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div>
	<form id="qunarOperateForm" class="order-confirm">
		<ul class="row">
			<li class="list" style="width:460px;">
				<span>操作类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="qunarOperate" value="qunar_have_room_and_accept" checked /><i></i> &nbsp;有房并接受</label>
					<label class="f_ui-radio-c3"><input type="radio" name="qunarOperate" value="qunar_no_room" /><i></i> &nbsp;无房</label>
					<label class="f_ui-radio-c3"><input type="radio" name="qunarOperate" value="qunar_apply_unsubscribe" /><i></i> &nbsp;申请退订</label>
					<label class="f_ui-radio-c3"><input type="radio" name="qunarOperate" value="qunar_accept_unsubscribe" /><i></i> &nbsp;同意退订</label>
					<label class="f_ui-radio-c3"><input type="radio" name="qunarOperate" value="qunar_refuse_unsubscribe" /><i></i> &nbsp;拒绝退订</label>
			</li>
			<div id="qunar_have_room_and_accept">
				<li class="list">
					<span>确认方式：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmTypeRadio" value="1" checked /><i></i> &nbsp;按入住姓名</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmTypeRadio" value="2" /><i></i> &nbsp;按确认号</label>
				</li>
				<li class="list" id="confirm_no" style="display: none;">
					<span>确认号：<i class="c_f00">*</i>&nbsp;</span><input name="confirmNo" id="confirmNo" type="text" value="" placeholder="请输入确认号" />
				</li>
			</div>
			<div id="qunar_no_room" style="display: none;">
				<li class="list" style="width:460px;">
					<span>拒绝类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="noRoomRadio" value="1" checked /><i></i> &nbsp;满房</label>
					<label class="f_ui-radio-c3"><input type="radio" name="noRoomRadio" value="2" /><i></i> &nbsp;房价不对</label>
					<label class="f_ui-radio-c3"><input type="radio" name="noRoomRadio" value="3" /><i></i> &nbsp;其他原因</label>
				</li>
				<li style="width:460px;">
					<span style="height: 114px; line-height:114px; vertical-align: middle;">拒绝原因：</span>
					<span style="height: 114px; line-height:114px; vertical-align: middle;"><textarea name="noRoomReason" placeholder="请输入拒绝原因" style="width: 300px; height:114px;"></textarea></span>
				</li>
			</div>
			<div id="qunar_apply_unsubscribe" style="display: none;">
				<li class="list">
					<span>退款金额：<i class="c_f00">*</i>&nbsp;</span><input name="unsubscribeAmount" id="unsubscribeAmount" type="text" value="" placeholder="请输入退款金额" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
			</div>
			<div id="qunar_accept_unsubscribe" style="display: none;">
				<li class="list">
					<span>退款金额：<i class="c_f00">*</i>&nbsp;</span><input name="acceptUnsubscribeAmount" id="acceptUnsubscribeAmount" type="text" value="" placeholder="请输入退款金额" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
			</div>
			<div id="qunar_refuse_unsubscribe" style="display: none;">
				<li class="list" style="width:460px;">
					<span>拒绝类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseUnsubscribeRadio" value="1" checked /><i></i> &nbsp;满房</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseUnsubscribeRadio" value="2" /><i></i> &nbsp;房价不对</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseUnsubscribeRadio" value="3" /><i></i> &nbsp;其他原因</label>
				</li>
				<li style="width:460px; height:114px;">
					<span style="height: 114px; line-height:114px; vertical-align: middle;">拒绝原因：</span>
					<span style="height: 114px; line-height:114px; vertical-align: middle;"><textarea name="refuseUnsubscribeReason" placeholder="请输入拒绝原因" style="width: 300px; height:114px;"></textarea></span>
				</li>
			</div>
		</ul>
	</form>
</div>