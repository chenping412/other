<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">应付款项</el-breadcrumb-item>
                    <el-breadcrumb-item>应付款项详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <el-form label-width="160px">

                <div class="detail-base-info">
                    <div class="detail-base-title">
                        <h3 class="detail-status">
                            <span class="inline-block margin-right-20">
                                <span>单据号：</span>
                                <span class="blue cursor-pointer" style="font-size: 26px;" @click="goToVoucher">{{detailForm.name}}</span>
                            </span>
                            <el-tag>{{detailForm.state|zerosoBillActionState}}</el-tag>

                            <el-tag :type="detailForm.relation_type==='order' ? 'warning' : detailForm.relation_type==='manual' ? 'danger' : null">
                                {{detailForm.relation_type | paymentType}}
                            </el-tag>

                            <email-message-count-button
                                    class="margin-left-20"
                                    :module_id="queryId"
                                    module_name="bank_statement_relation"
                                    subsystem="accounting">
                            </email-message-count-button>
                        </h3>
                        <div class="detail-control clearfix">
                            <div class="control-btns"
                                 v-if="detailForm.relation_type==='manual' && detailForm.state === 'draft'">

                                <prepaid-add @update="init" :editForm="detailForm" title="编辑"></prepaid-add>
                                <el-button class="margin-left-10" @click="clickDeletePrepaid">撤销</el-button>

                            </div>
                            <DetailPagination apiKey="accounting_payment_need_outbound"
                                              :listApi="$api.bank_payment_need_outbound"></DetailPagination>
                        </div>
                    </div>
                    <div class="detail-base-body">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="收款方：">
                                    <span class="form-border-bottom">
                                        <router-link class="blue" v-if="detailForm.partner"
                                                     :to="'/partner/detail?id='+detailForm.partner.account_company_id">
                                            {{detailForm.partner.company_name}}
                                        </router-link>
                                    </span>
                                </el-form-item>
                                <el-form-item label="待付金额：">
                                    <span class="form-border-bottom">
                                        {{detailForm.money|zerosoAbs|isoCurrency(detailForm.currency)}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="货币：">
                                    <span class="form-border-bottom">
                                        {{detailForm.currency | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="实际转账日期：">
                                    <span class="form-border-bottom">
                                        {{detailForm.transaction_date | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="附件：">
                                    <FileListShow
                                            ref="prepaidFileListShow"
                                            :showDelete="true"
                                            :module_id="queryId"
                                            module_name="bank_statement_relation"
                                            subsystem="accounting">
                                    </FileListShow>
                                    <FileUpload
                                            @uploadSuccess="$refs.prepaidFileListShow.update()"
                                            :auto-upload="true"
                                            :module_id="queryId"
                                            module_name="bank_statement_relation"
                                            subsystem="accounting">
                                    </FileUpload>
                                </el-form-item>
                                <el-form-item style="padding-top: 10px;">
                                    <el-button type="danger" v-if="detailForm.state==='verifyed'"
                                               @click="clickBankPayOnline">
                                        {{detailForm.self_bank && detailForm.self_bank.is_bank_online_pay ?
                                        '银行在线支付':'已提交支付'}}
                                    </el-button>
                                    <template v-for="item in actionsMap[detailForm.state]">
                                        <el-button :key="item"
                                                   :type=" item==='revert' || item==='canceled' ? null : 'success'"
                                                   v-if="actionsMap[detailForm.state]"
                                                   @click="clickUpdateState(item)">{{item | zerosoBillActionState}}
                                        </el-button>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="跟进人：">
                                    <span class="form-border-bottom">
                                        {{detailForm.follower.name | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="截止日期：">
                                    <span class="form-border-bottom">
                                        {{detailForm.due_date | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="附言：">
                                    <span class="form-border-bottom">
                                        {{detailForm.comment | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <span class="form-border-bottom">
                                        {{detailForm.note | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="关联流水："
                                              v-if="detailForm.bank_statement_line_id && detailForm.bank_statement_line">
                                    <span class="form-border-bottom">
                                        <router-link
                                                :to="'/finance/bank-statement-line/need_inbound/detail?id='+detailForm.bank_statement_line_id">
                                            {{detailForm.bank_statement_line.money | isoCurrency(detailForm.currency)}}
                                        </router-link>
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>

                <el-card class="margin-bottom-20">
                    <div slot="header" class="clearfix">
                        <h3 class="left">
                            <span class="margin-right-20">收款账户信息</span>
                            <el-tag type="warning">{{detailForm.partner_bank.is_e_pay_complete?'信息完整':'信息不全'}}</el-tag>
                        </h3>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="账户名称：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.account_name | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="开户行全称：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.bank_name | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="账户类型：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.bank_type | bankType}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="开户行：">
                                <span class="form-border-bottom">
                                        {{detailForm.partner_bank.bank_code | defaultStr}}
                                    </span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="账号：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.account_number | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="货币：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.currency | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="是否iban：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.is_iban | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="Swift Code：">
                                    <span class="form-border-bottom">
                                        {{detailForm.partner_bank.bic_code | defaultStr}}
                                    </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card class="margin-bottom-20">
                    <div slot="header" class="clearfix">
                        <h3 class="left">
                            <span class="margin-right-20">付款账户信息</span>
                            <el-tag type="warning">{{detailForm.self_bank.is_e_pay_complete?'信息完整':'信息不全'}}</el-tag>
                        </h3>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="账户名称：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.account_name | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="是否支持在线付款：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.is_bank_online_pay?'是':'否'}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="开户行全称：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.bank_name | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="开户行：">
                                <span class="form-border-bottom">
                                        {{detailForm.self_bank.bank_code | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="账户余额：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.bank_money|isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="应付款总额：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.need_pay_total|isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="7日资金缺口：">
                                    <span class="form-border-bottom"
                                          :class="{'green':detailForm.self_bank.funding_gap7 >=0,'red':detailForm.self_bank.funding_gap7<0}">
                                        {{detailForm.self_bank.funding_gap7 |isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="账号：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.account_number | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="货币：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.currency | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="是否iban：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.is_iban | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="Swift Code：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.bic_code | defaultStr}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="授信额度：">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.credit_line|isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="资金缺口："
                                          :class="{'green':detailForm.self_bank.funding_gap  >=0,'red':detailForm.self_bank.funding_gap <0}">
                                    <span class="form-border-bottom">
                                        {{detailForm.self_bank.funding_gap |isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="14日资金缺口：">
                                    <span class="form-border-bottom"
                                          :class="{'green':detailForm.self_bank.funding_gap14  >=0,'red':detailForm.self_bank.funding_gap14 <0}">
                                        {{detailForm.self_bank.funding_gap14 |isoCurrency(detailForm.self_bank.currency)}}
                                    </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card class="margin-bottom-20">
                    <div slot="header" class="clearfix">
                        <h3 class="left">
                            <span class="margin-right-20">操作记录</span>
                        </h3>
                    </div>
                    <div class="padding-left-20">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>事件</th>
                                <th>时间</th>
                                <th>操作人</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="log in logList" :key="log">
                                <td>{{log | zerosoBillActionState}}</td>
                                <td>{{detailForm.operation_logs[log+'_datetime'] | zerosoTimeFormat}}</td>
                                <td v-if="detailForm.operation_logs[log+'_user_id']">
                                    {{detailForm.operation_logs[log+'_user_id'].name}}
                                </td>
                            </tr>
                            </tbody>
                        </table>


                    </div>
                </el-card>
            </el-form>
        </div>

    </div>
</template>

<script>

    import PrepaidAdd from "./prepaid-add";
    import EmailMessageCountButton from "../../related-email-message/email-message-count-button";
    import OrderUtils from "../../order/order-utils";

    export default {
        components: {EmailMessageCountButton, PrepaidAdd},
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {
                    partner: {},
                    follower: {},
                    operation_logs: {},
                    self_bank: {},
                    partner_bank: {},
                },
                detailFormRule: {
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
                    ],
                },

                logList: [
                    'create',
                    'verifyed',
                    'payed',
                    'pending',
                    'failed',
                    'acknowlaged',
                    'reconsiled',
                    'revert',
                    'canceled'
                ],

                actionsMap: {
                    draft: ['verifyed', 'canceled'],
                    failed: ['revert'],
                    verifyed: ['acknowlaged', 'revert'],
                    payed: ['acknowlaged', 'revert'],
                    pending: ['acknowlaged'],
                },

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        partner: {},
                        follower: {},
                        operation_logs: {},
                        self_bank: {},
                        partner_bank: {},
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_relation + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (!data.msg.partner) data.msg.partner = {};
                            if (!data.msg.follower) data.msg.follower = {};
                            if (!data.msg.operation_logs) data.msg.operation_logs = {};
                            if (!data.msg.self_bank) data.msg.self_bank = {};
                            if (!data.msg.partner_bank) data.msg.partner_bank = {};

                            self.detailForm = data.msg;
                        }
                    },
                    error(data) {
                        if (data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40001) > -1) {
                            self.$router.back();
                        }
                    }
                })
            },

            clickUpdateState(state) {
                let self = this;
                if (state === 'acknowlaged') {
                    this.$confirm('强制完成付款是特殊权限是否确认？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateState(state)
                            }
                        }
                    })
                } else if (state === 'pending') {
                    this.$confirm((self.detailForm.self_bank && self.detailForm.self_bank.is_bank_online_pay) ? '系统已对接银行，该状态应该由系统自动操作，无需手工处理，请谨慎操作!' : '请核对银行流水确认银行支付成功，确认后表示该笔款项已经通过银行付款成功!', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateState(state)
                            }
                        }
                    })
                } else if (state === 'canceled') {
                    this.$confirm('取消后将无法继续操作，是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateState(state)
                            }
                        }
                    })
                } else {
                    self.updateState(state)
                }
            },
            clickBankPayOnline() {
                let self = this;
                if (self.detailForm.self_bank && self.detailForm.self_bank.is_bank_online_pay) {
                    this.$confirm('付款数据将直接发送到银行执行支付，请谨慎操作!', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateState('payed')
                            }
                        }
                    })
                } else {
                    self.updateState('payed');
                }
            },
            //更新付款状态
            updateState(state) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_relation + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        name: state,
                        id: self.queryId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.getDetailData();
                        }
                    }
                })
            },


            //撤销直接付款
            clickDeletePrepaid() {
                let self = this;
                self.$confirm('确定撤销吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback(action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_payment_manual_outbound + '/' + self.queryId,
                                type: 'DELETE',
                                requestBody: true,
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '操作成功！',
                                            type: 'success'
                                        });
                                        self.$router.push(self.parentQuery ? 'list?' + self.parentQuery : 'list');
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '操作失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            })
                        }
                    }
                });
            },


            goToVoucher() {
                if(this.detailForm.relation_type==='order'){
                    OrderUtils.goToOrderDetail(this.detailForm.module_id)
                }else if(this.detailForm.relation_type==='invoice'){
                    this.$router.push({
                        path:'/finance/invoice/supplier/detail',
                        query:{
                            id:this.detailForm.module_id,
                        }
                    })
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
    .table {
        th, td {
            text-align: left;
            padding: 0 10px;
        }
    }
</style>
