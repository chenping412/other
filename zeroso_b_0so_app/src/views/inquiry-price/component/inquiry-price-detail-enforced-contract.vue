<template>
    <div class="inline-block">
        <el-button type="warning"
                   :disabled="hasEditAction"
                   @click="clickEnforcedContract">执行合同
        </el-button>

        <el-dialog title="执行合同" :visible.sync="dialogShow" top="80px" width="1200px" :close-on-click-modal="false"
                   v-loading="loading">
            <div class="inquiry-enforced-contract-content">
                <div class="step">
                    <el-steps :active="stepActive" align-center finish-status="success">
                        <el-step title="付款提示" v-if="!hasNoSupplier"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </div>
                <div class="step-items">

                    <div class="book_money" v-show="stepActive===1" v-if="!hasNoSupplier">
                        <el-form label-width="150px"  v-if="supplierIs0soCompany">
                                <el-form-item label="当前付款比例：">
                                    <b>{{outboundMoneyRate*100 | zerosoRound(2)}}%</b>
                                </el-form-item>
                                <el-form-item label="预付金额：">
                                    <b>{{submitForm.money | isoCurrency(submitForm.currency)}}</b>
                                </el-form-item>
                                <el-form-item label="付款账户信息：">
                                    <b>
                                        开户行全称：中国工商银行股份有限公司深圳华联支行<br>
                                        开户名：零搜供应链（深圳）有限公司<br>
                                        银行账号：4000021609200502749
                                    </b>
                                </el-form-item>
                        </el-form>
                        <h3 v-else style="text-align: center;padding-top: 30px;">
                            付款金额：{{submitForm.money | isoCurrency(submitForm.currency)}}
                        </h3>
                    </div>

                    <div v-show="stepActive===2">
                        <h3 style="text-align: center;padding-top: 30px;">
                            操作成功！已成功执行合同，并创建订单，订单编号：
                            <a class="cursor-pointer blue margin-right-10"
                               v-for="item in createOrderData"
                               :key="item"
                               @click="goToOrderDetail(item)">
                                {{item}}
                            </a>
                        </h3>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">

                <el-button type="success" v-if="stepActive===1 || (hasNoSupplier && stepActive===0)" @click="clickSaveDate()">提 交</el-button>

                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import OrderUtils from "../../order/order-utils";

    export default {
        props: ['queryId', 'detailForm', 'supplierIs0soCompany','hasNoSupplier','hasNoCustomer','hasEditAction'],
        data() {
            return {
                loading: false,


                dialogShow: false,
                stepActive: 0,
                bankStatementLineList: [],

                procurementRmbTotalPrice: 0,
                outboundMoneyRate: 0,

                submitForm: {
                    bank_statement_line: {},
                    book_money: 0,
                    money: 0,
                    currency: 'CNY',
                    due_date: '',
                    comment: '',
                },
                submitFormRule: {
                    book_money: [
                        {required: true, message: '请输入记账金额！'}
                    ],
                    money: [
                        {required: true, message: '请输入申请金额！'}
                    ],
                    due_date: [
                        {required: true, message: '请选择付款日期！'}
                    ],
                },

                salesRmbTotalPrice:0,


                createOrderData: [],

            }
        },
        computed:{
            permissionsMap() {
                return this.$store.state.permissionsMap
            },
        },
        watch: {
            'submitForm.book_money'(val) {
                this.submitForm.money = val;
                this.outboundMoneyRate = val / this.procurementRmbTotalPrice;
            }
        },
        created() {

        },
        methods: {
            clickEnforcedContract() {
                let checkProductState = this.$parent.checkProductState();
                if(!checkProductState) return;

                this.dialogShow = true;
                this.stepActive = 1;
                if(!this.hasNoSupplier){
                    if(this.detailForm.supplier.delivery_mode==='DIRECT'){
                        this.setOutboundMoney(1);
                    }else {
                        this.setOutboundMoney(0.3);
                    }
                }
            },
            setOutboundMoney(rate) {
                this.outboundMoneyRate = rate;
                if (this.supplierIs0soCompany) {
                    this.procurementRmbTotalPrice = this.detailForm.procurement_price.grand_cny_price;
                }else {
                    this.procurementRmbTotalPrice = this.detailForm.procurement_price.grand_price;
                }
                this.submitForm.book_money = this.submitForm.money = (this.procurementRmbTotalPrice * this.outboundMoneyRate).myRound(2);
                this.submitForm.due_date = this.$moment().format('YYYY-MM-DD');
                this.submitForm.submitForm = this.detailForm.currency_unit.currency;
            },


            clickSaveDate() {
                let self = this;
                self.submitData();
            },

            submitData(){
                let self = this;
                let requestData = {
                    bank_statement_line_request: null,
                    outbound_request:null,
                };
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId + '/order',
                    type: 'POST',
                    requestBody: true,
                    data: requestData,
                    success: function (data) {
                        self.loading = false;
                        self.createOrderData = data.name;
                        self.stepActive = 2;
                        self.$emit('update');
                    }
                });
            },

            goToOrderDetail(contract_no) {
                OrderUtils.goToOrderDetail(contract_no,true)
            },

        },
    }
</script>

<style lang="scss">
    .inquiry-enforced-contract-content {
        line-height: normal;

        .step {
            width: 70%;
            margin: 0 auto;
            padding: 20px 0;
        }

        .step-items {
            min-height: 500px;

            .book_money {
                width: 50%;
                margin: 0 auto;
                padding-top: 10px;
            }
        }
    }
</style>