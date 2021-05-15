<template>
    <div class="inline-block">
        <el-button type="danger" @click="clickCancel">取消</el-button>

        <el-dialog title="取消" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="cancelParams" :rules="cancelParamsRule" ref="form" label-width="100px">
                <!--<el-form-item label="订单报价情况" prop="order_cancel_state">
                    <el-select v-model="cancelParams.order_cancel_state" @change="changeState">
                        <el-option
                                v-for="(item,$index) in orderCancelReason.order_cancel_state"
                                :key="$index"
                                :value="item.key"
                                :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户后续安排" prop="customer_next_action">
                    <el-select v-model="cancelParams.customer_next_action">
                        <el-option
                                v-for="(item,$index) in orderCancelReason.customer_next_action"
                                :key="$index"
                                :value="item.key"
                                :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="取消原因" prop="cancel_reason">
                    <el-select v-model="cancelParams.cancel_reason" @change="changeReason">
                        <el-option
                                v-for="(item,$index) in cancelReason"
                                :key="$index"
                                :value="item.key"
                                :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sub_cancel_reason" v-if="selectCancelReasonItem.sub_reason">
                    <el-select v-model="cancelParams.sub_cancel_reason">
                        <el-option
                                v-for="(item,$index) in selectCancelReasonItem.sub_reason"
                                :key="$index"
                                :value="item.key"
                                :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sub_cancel_reason_2" v-if="selectCancelReasonItem.sub_reason_2">
                    <el-select v-model="cancelParams.sub_cancel_reason_2">
                        <el-option
                                v-for="(item,$index) in selectCancelReasonItem.sub_reason_2"
                                :key="$index"
                                :value="item.key"
                                :label="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="other_reason_comment" v-if="cancelParams.cancel_reason === 'other'">
                    <el-input type="textarea" :rows="4"
                            v-model="cancelParams.other_reason_comment">
                    </el-input>
                </el-form-item>-->

                <el-form-item label="取消原因" prop="comment">
                    <el-input type="textarea" :rows="8" v-model="cancelParams.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">确 定</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['detailForm'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                cancelParams: {},
                cancelParamsRule: {
                    order_cancel_state: [
                        {required: true, message: '请选择订单报价情况！'}
                    ], customer_next_action: [
                        {required: true, message: '请选择客户后续安排！'}
                    ], cancel_reason: [
                        {required: true, message: '请选择取消原因！'}
                    ],sub_cancel_reason: [
                        {required: true, message: '请选择！'}
                    ],sub_cancel_reason_2: [
                        {required: true, message: '请选择！'}
                    ],other_reason_comment: [
                        {required: true, message: '请填写其他原因！'}
                    ],comment: [
                        {required: true, message: '请输入取消原因！'}
                    ],
                },

                selectCancelReasonItem:{},
            }
        },
        computed: {
            orderCancelReason() {
                return this.$store.state.currentUser && this.$store.state.currentUser.static_resource ? this.$store.state.currentUser.static_resource.order_cancel_reason : {}
            },
            cancelReason() {
                let arr = [];
                if (this.cancelParams.order_cancel_state === 'quoted') {
                    arr = this.orderCancelReason.cancel_reason
                } else if (this.cancelParams.order_cancel_state === 'no_quote') {
                    arr = this.orderCancelReason.cancel_reason_no_quote
                }
                return arr;
            }
        },
        created() {
        },
        methods: {
            clickCancel() {
                this.cancelParams = {
                    order_cancel_state: "quoted",
                    customer_next_action: "unknown",
                    cancel_reason: "other",
                    sub_cancel_reason: null,
                    sub_cancel_reason_2: null,
                    other_reason_comment: "other",
                    comment: null,
                };
                this.dialogShow = true;
            },

            //切换取消状态
            changeState() {
                this.cancelParams.cancel_reason = null;
                this.cancelParams.sub_cancel_reason = null;
                this.cancelParams.sub_cancel_reason_2 = null;
                this.cancelParams.other_reason_comment = null;
            },
            //切换取消原因
            changeReason(key) {
                this.cancelParams.sub_cancel_reason = null;
                this.cancelParams.sub_cancel_reason_2 = null;
                this.cancelParams.other_reason_comment = null;

                this.selectCancelReasonItem ={};
                this.cancelReason.forEach((item)=>{
                    if(item.key === key){
                        this.selectCancelReasonItem = item;
                    }
                })
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let order_node_id = null;
                        if (self.detailForm.order_nodes) {
                            self.detailForm.order_nodes.forEach((node) => {
                                if(node.account_company_id === self.$store.state.currentCompany.account_company_id){
                                    order_node_id = node.id;
                                }
                            });
                        }
                        if (order_node_id) {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_order_orders + '/' + self.detailForm.id + '/order_cancel_action',
                                type: 'PUT',
                                requestBody: true,
                                data: {
                                    name: 'cancel',
                                    order_id: self.detailForm.id,
                                    order_node_id: order_node_id,
                                    ...self.cancelParams
                                },
                                success () {
                                    self.loading = false;
                                    self.dialogShow = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update');
                                }
                            });
                        }
                    }
                });
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>