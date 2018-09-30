<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div>
	<form id="ctripOperateForm" class="order-confirm">
		<ul class="row">
			<li class="list">
				<span>操作类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="ctripOperate" value="ctrip_accept" checked /><i></i> &nbsp;接受</label>
					<label class="f_ui-radio-c3"><input type="radio" name="ctripOperate" value="ctrip_refuse" /><i></i> &nbsp;拒绝</label>
					<label class="f_ui-radio-c3"><input type="radio" name="ctripOperate" value="ctrip_change_confirm_no" /><i></i> &nbsp;更改确认号</label>
					<label class="f_ui-radio-c3"><input type="radio" name="ctripOperate" value="ctrip_accept_cancel" /><i></i> &nbsp;接受取消</label>
					<label class="f_ui-radio-c3"><input type="radio" name="ctripOperate" value="ctrip_refuse_cancel" /><i></i> &nbsp;拒绝取消</label>
			</li>
			<div id="ctrip_accept">
				<li class="list">
					<span>确认方式：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmTypeRadio" value="1" checked /><i></i> &nbsp;按入住姓名</label>
					<label class="f_ui-radio-c3"><input type="radio" name="confirmTypeRadio" value="2" /><i></i> &nbsp;按确认号</label>
				</li>
				<li class="list" id="confirm_no" style="display: none;">
					<span>确认号：<i class="c_f00">*</i>&nbsp;</span><input name="confirmNo" id="confirmNo" type="text" value="" placeholder="请输入确认号" />
				</li>
			</div>
			<div id="ctrip_refuse" style="display: none;">
				<li class="list" style="width:460px;">
					<span>拒绝类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseTypeRadio" value="1" checked /><i></i> &nbsp;满房封首日</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseTypeRadio" value="2" /><i></i> &nbsp;满房封订单入住日</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseTypeRadio" value="3" /><i></i> &nbsp;房价不对</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseTypeRadio" value="4" /><i></i> &nbsp;其他原因</label>
				</li>
				<li style="width:460px;">
					<span style="height: 114px; line-height:114px; vertical-align: middle;">拒绝原因：</span>
					<span style="height: 114px; line-height:114px; vertical-align: middle;"><textarea name="refuseReason" placeholder="请输入拒绝原因" style="width: 300px; height:114px;"></textarea></span>
				</li>
			</div>
			<div id="ctrip_change_confirm_no" style="display: none;">
				<li class="list">
					<span>确认号：<i class="c_f00">*</i>&nbsp;</span><input name="changeConfirmNo" id="changeConfirmNo" type="text" value="" placeholder="请输入确认号" /><i class="empty iconfont icon-ArtboardCopy"></i>
				</li>
			</div>
			<div id="ctrip_refuse_cancel" style="display: none;">
				<li class="list" style="width:460px;">
					<span>拒绝类型：</span>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseCancelTypeRadio" value="1" checked /><i></i> &nbsp;满房封首日</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseCancelTypeRadio" value="2" /><i></i> &nbsp;满房封订单入住日</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseCancelTypeRadio" value="3" /><i></i> &nbsp;房价不对</label>
					<label class="f_ui-radio-c3"><input type="radio" name="refuseCancelTypeRadio" value="4" /><i></i> &nbsp;其他原因</label>
				</li>
				<li style="width:460px; height:114px;">
					<span style="height: 114px; line-height:114px; vertical-align: middle;">拒绝原因：</span>
					<span style="height: 114px; line-height:114px; vertical-align: middle;"><textarea name="refuseCancelReason" placeholder="请输入拒绝原因" style="width: 300px; height:114px;"></textarea></span>
				</li>
			</div>
		</ul>
	</form>
</div>