<template>
    <div class="flex-box-column" v-loading.fullscreen="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item v-if="!bank_statement_id" :to="parentQuery ? 'list?'+parentQuery : 'list'">{{state === 'need_inbound'?'收款记录':'未核销流水'}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="bank_statement_id">
                        <b class="cursor-pointer" @click="openBankStatement">银行对账单 / 对账单详情</b>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>流水详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span class="margin-right-10">{{bankStatementLine.partner_bank_account_name}}</span>
                        <span class="margin-right-10" v-text="bankStatementLine.money<0?'支出':'收入'"> </span>
                        <span class="margin-right-10">{{bankStatementLine.money |zerosoAbs | isoCurrency((bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : ''))}}</span>

                        <el-tag>{{bankStatementLine.is_reconsiled ? '已核销' : '未核销'}}</el-tag>

                        <el-button type="warning" class="margin-left-20" v-if="bankStatementLine.bank_statement_id" @click="openBankStatement">对账单详情</el-button>

                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">

                        </div>
                        <DetailPagination
                                :apiKey="'accounting_statement_'+state"
                                :listApi=" bank_statement_id ? null : $api.bank_bank_statement_line_v4 + '/'+state"
                                :listData="bank_statement_id ? bankStatementLineList : null">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="125px">
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="编号：">
                                <span class="form-border-bottom">{{(bankStatementLine.bank_statement ? bankStatementLine.bank_statement.name : '') | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="银行名称：">
                                <span class="form-border-bottom">
                                    {{(bankStatementLine.bank_statement&&bankStatementLine.bank_statement.bank_account ? bankStatementLine.bank_statement.bank_account.bank_name : '') | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="合作伙伴：">
                                <div class="form-border-bottom">
                                    <span class="margin-right-20">{{bankStatementLine.partner_company_name | defaultStr}}</span>
                                    <bank-statement-line-detail-edit-partner v-if="$store.state.permissionsMap['AccountingNeed']" :bankStatementLine="bankStatementLine" @update="init"></bank-statement-line-detail-edit-partner>
                                </div>
                            </el-form-item>
                            <el-form-item label="金额：">
                                <span class="form-border-bottom">
                                    {{bankStatementLine.money | zerosoAbs | isoCurrency((bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : '')) | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="摘要：">
                                <span class="form-border-bottom">
                                    {{bankStatementLine.note | defaultStr}}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="交易日期：">
                                <span class="form-border-bottom">{{bankStatementLine.transaction_date}}</span>
                            </el-form-item>
                            <el-form-item label="货币：">
                                <span class="form-border-bottom">{{(bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : '') | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="对方户名：">
                                <span class="form-border-bottom">{{bankStatementLine.partner_bank_account_name | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="未关联金额：">
                                <span class="form-border-bottom">
                                    {{bankStatementLine.left_money | zerosoAbs | isoCurrency((bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : '')) | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="附言：">
                                <span class="form-border-bottom">{{bankStatementLine.comment | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
            </div>


            <el-card class="margin-bottom-20" v-if="orders.length>0">
                <div slot="header" class="clearfix">
                    <h3 class="left">可核销单据</h3>
                </div>
                <el-table :data="orders" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="name" label="可核销单据">
                        <template slot-scope="scope">
                            <router-link
                                    class="blue" target="_blank"
                                    v-if="scope.row.type==='order'"
                                    :to="'/order/order/all/receipt?id='+scope.row.id+'&accountCompanyId='+scope.row.account_company.account_company_id+'&partnerCompanyId='+bankStatementLine.partner_company_id">
                                {{scope.row.name}}
                            </router-link>
                            <router-link
                                    class="blue" target="_blank"
                                    v-if="scope.row.type==='invoice'"
                                    :to="'/finance/invoice/customer/detail?id='+scope.row.id+'&invoice_type=customer'">
                                {{scope.row.name}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进人">
                        <template slot-scope="scope">
                            {{(scope.row.account_user ? scope.row.account_user.name : '') | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌">
                        <template slot-scope="scope">
                            {{(scope.row.brand ? scope.row.brand.name : '') | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="总金额" align="right">
                        <template slot-scope="scope">
                            {{scope.row.total_amount | isoCurrency((bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : '')) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="未付金额" align="right">
                        <template slot-scope="scope">
                            {{scope.row.need_pay_amount | isoCurrency((bankStatementLine.bank_statement ? bankStatementLine.bank_statement.currency : '')) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="成交时间">
                        <template slot-scope="scope">
                            {{scope.row.perform_time | zerosoTimeFormat}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <account-documents-move
                    v-if="accountMove &&
                    (
                        (bankStatementLine.left_money === '0.00' || bankStatementLine.money<0)
                        || $store.state.permissionsMap['AdminNeed']
                        || $store.state.permissionsMap['AccountingNeed']
                        || $store.state.permissionsMap['BookMoneyAdminNeed']
                    )"
                    :accountMove="accountMove"
                    :type="Number(bankStatementLine.money) > 0 ? 'bankStatementInbound' : 'bankStatementOutbound'"
                    @update="init">
            </account-documents-move>
        </div>

    </div>
</template>

<script>


    import AccountDocumentsMove from "../account-documents/component/account-documents-move";
    import BankStatementLineDetailEditPartner from "./component/bank-statement-line-detail-edit-partner";
    export default {
        components: {
            BankStatementLineDetailEditPartner,
            AccountDocumentsMove
        },
        data() {
            return {
                queryId: '',
                state: '',
                isEdit: false,
                parentQuery: '',
                bank_statement_id:null,
                bankStatementLineList:[],

                detailForm: {},
                bankStatementLine: {},
                orders:[],
                accountMove: {},

                detailFormRule: {
                    bank_account_id: [
                        {required: true, message: '请选择银行名称！'}
                    ],
                },

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                this.state = this.$route.params.state;

                if (self.$route.query.bank_statement_id && self.$route.query.bank_statement_id !== 'undefined' && self.$route.query.bank_statement_id !== 'null') {
                    self.bank_statement_id = self.$route.query.bank_statement_id;
                    self.getBankStatementLine();
                }
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                    self.bankStatementLine = {};
                    self.orders = [];
                    self.accountMove = {};
                }

            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_line_v4 + '/' + self.queryId + '/account_move',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            self.bankStatementLine = self.detailForm.bank_statement_line || {};
                            self.orders = self.detailForm.orders || [];
                            self.accountMove = self.detailForm.account_move || {};
                        }
                    },
                    error(data){
                        if(data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40001)>-1){
                            self.$router.back();
                        }
                    }
                })
            },

            getBankStatementLine() {
                let self = this;
                self.bankStatementLineList = [];
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_line,
                    data: {
                        bank_statement_id:self.bank_statement_id
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.bankStatementLineList = data.msg.items;
                        }
                    }
                })
            },

            openBankStatement() {
                this.$router.push({
                    path: '/finance/bank-statement/detail',
                    query: {
                        id:this.bankStatementLine.bank_statement_id,
                        statementLineId:this.queryId
                    }
                });
            },
        }
    }
</script>

<style lang="scss">


</style>
