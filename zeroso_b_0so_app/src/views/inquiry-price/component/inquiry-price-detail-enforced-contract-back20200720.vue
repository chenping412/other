<template>
    <div class="inline-block">
        <el-button type="warning" v-if="detailForm.inquiry_quote_state==='CONTRACT_SIGNED'"
                   @click="clickEnforcedContract">执行合同
        </el-button>

        <el-dialog title="执行合同" :visible.sync="dialogShow" top="80px" width="1200px" :close-on-click-modal="false"
                   v-loading="loading">
            <div class="inquiry-enforced-contract-content">
                <div class="step">
                    <el-steps :active="stepActive" align-center finish-status="success">
                        <el-step title="绑定银行流水" v-if="!hasNoCustomer"></el-step>
                        <el-step title="申请付款" v-if="!hasNoSupplier"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </div>
                <div class="step-items">
                    <div v-show="stepActive===0" v-if="!hasNoCustomer">
                        <el-table ref="multipleTable" :data="bankStatementLineList" highlight-current-row
                                  @current-change="handleCurrentChange" border height="500px" v-loading="loading">
                            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                            <el-table-column label="记账金额">
                                <template slot-scope="scope">
                                    <InputNumber :value.sync="scope.row.book_money_input" :max="scope.row.left_money"
                                                 @input.native="scope.row.money_input=scope.row.book_money_input"></InputNumber>
                                </template>
                            </el-table-column>
                            <el-table-column label="关联金额">
                                <template slot-scope="scope">
                                    <InputNumber :value.sync="scope.row.money_input" :max="scope.row.left_money" :disabled="true"
                                                 @input.native="scope.row.book_money_input=scope.row.money_input"></InputNumber>
                                </template>
                            </el-table-column>
                            <el-table-column label="未关联金额">
                                <template slot-scope="scope">
                                    <span class="margin-right-10">{{scope.row.currency}}</span>
                                    <span>{{scope.row.left_money | isoCurrency(scope.row.currency)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="收到金额">
                                <template slot-scope="scope">
                                    <span class="margin-right-10">{{scope.row.currency}}</span>
                                    <span>{{scope.row.money | isoCurrency(scope.row.currency)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="comment" label="备注">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.comment"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="partner_bank_account_name" label="银行账户"></el-table-column>
                            <el-table-column prop="transaction_date" label="日期"></el-table-column>
                            <el-table-column width="60">
                                <template slot-scope="scope">
                                    <div>
                                        <i class="el-icon-circle-check el-icon-normal green" v-if="submitForm.bank_statement_line.id === scope.row.id"></i>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="book_money" v-show="stepActive===1" v-if="!hasNoSupplier">
                        <el-form :model="submitForm" :rules="submitFormRule" ref="submitForm" label-width="85px">
                            <el-form-item label="记账金额" prop="book_money">
                                <InputNumber :value.sync="submitForm.book_money" :max="procurementRmbTotalPrice" :disabled="supplierIs0soCompany"
                                             placeholder="请输入记账金额！">
                                    <template slot="append">
                                        {{submitForm.currency | isoCurrency}}
                                    </template>
                                </InputNumber>
                            </el-form-item>
                            <el-form-item label="申请金额" prop="money">
                                <InputNumber :value.sync="submitForm.money" :max="procurementRmbTotalPrice" :disabled="true"
                                             placeholder="请输入申请金额！">
                                    <template slot="append">
                                        {{submitForm.currency | isoCurrency}}
                                    </template>
                                </InputNumber>
                            </el-form-item>
                            <el-form-item>
                                <span class="margin-right-20">当前付款比例：{{outboundMoneyRate*100 | zerosoRound(2)}}%</span>
<!--                                <el-button size="mini" type="primary" @click="setOutboundMoney(0.3)" v-if="detailForm.supplier && detailForm.supplier.delivery_mode!=='DIRECT'">30%付款</el-button>-->
<!--                                <el-button size="mini" type="primary" @click="setOutboundMoney(1)" v-if="detailForm.supplier && detailForm.supplier.delivery_mode!=='DIRECT'">全额付款</el-button>-->
                            </el-form-item>

                            <el-form-item label="付款日期" prop="due_date">
                                <el-date-picker
                                        v-model="submitForm.due_date"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择付款日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="备注" prop="comment">
                                <el-input type="textarea" :rows="5" v-model="submitForm.comment"
                                          placeholder="请输入备注"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div v-show="stepActive===2">
                        <h3 style="text-align: center;padding-top: 30px;">
                            操作成功！已成功执行合同，并创建订单，订单编号：
                            <a class="blue" target="_blank"
                               :href="createOrderData.orderId ? '#/order/order/processing/detail?id='+createOrderData.orderId : undefined">{{createOrderData.orderName}}</a>
                        </h3>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="stepActive===0 && !hasNoSupplier" @click="clickNextStep()">下一步
                </el-button>

                <el-button type="primary" v-if="stepActive===1 && !hasNoCustomer" @click="clickPrevStep()">上一步</el-button>
                <el-button type="success" v-if="stepActive===1 || (hasNoSupplier && stepActive===0)" @click="clickSaveDate()">保 存</el-button>

                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['queryId', 'detailForm', 'supplierIs0soCompany','hasNoSupplier','hasNoCustomer'],
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


                createOrderData: {
                    orderId: '',
                    orderName: '',
                },

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
                this.dialogShow = true;
                if(!this.hasNoCustomer){
                    this.stepActive = 0;
                    this.getBankStatementLineList();
                }else {
                    this.stepActive = 1;
                }

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
            //获取列表
            getBankStatementLineList() {
                let self = this;
                if(self.supplierIs0soCompany){
                    self.salesRmbTotalPrice = self.detailForm.sales_price.grand_cny_price
                }else {
                    self.salesRmbTotalPrice = self.detailForm.sales_price.grand_price
                }
                
                self.loading = true;
                self.bankStatementLineList = [];
                self.$http({
                    url: self.$api.bank_bank_statement_line_v4 + '/need_inbound',
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: 1,
                        per_page: 1000,
                        filter: [
                            ["partner_company", "=",
                                {
                                    account_company_id: self.detailForm.customer.company.account_company_id,
                                    company_name: self.detailForm.customer.company.company_name
                                }
                            ]
                        ],
                        key: "accounting_statement_need_inbound",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items) {
                            let bankStatementLineList = [];
                            data.msg.items.forEach((item) => {
                                if (item.money > 0 && item.left_money * 1 > 0) {
                                    if(Number(item.money) <= self.salesRmbTotalPrice){
                                        item.money_input = item.book_money_input = item.left_money <= item.money ? item.left_money : item.money;
                                    }else {
                                        item.money_input = item.book_money_input = self.salesRmbTotalPrice;
                                    }
                                    bankStatementLineList.push(item);
                                }
                            });
                            self.bankStatementLineList = bankStatementLineList;
                        }
                    }
                })
            },
            handleCurrentChange(val) {
                this.submitForm.bank_statement_line = val || {};
            },


            clickPrevStep() {
                this.stepActive = 0;
            },
            clickNextStep() {
                if(this.submitForm.bank_statement_line.id && this.submitForm.bank_statement_line.book_money_input > this.salesRmbTotalPrice){
                    this.$message({
                        showClose: true,
                        message: '绑定银行流水记账金额不能大于销售人民币总价！',
                        type: 'error'
                    });
                    return
                }
                if(!this.hasNoSupplier){
                    this.stepActive = 1;
                }else {
                    this.stepActive = 2;
                }
            },

            clickSaveDate() {
                let self = this;
                if(!self.hasNoSupplier){
                    self.$refs.submitForm.validate(function (valid) {
                        if (valid) {
                            self.submitData();
                        } else {
                            console.log('error submit!!');
                        }
                    });
                }else if(!self.hasNoCustomer){
                    if(this.submitForm.bank_statement_line.id && this.submitForm.bank_statement_line.book_money_input > this.salesRmbTotalPrice){
                        this.$message({
                            showClose: true,
                            message: '绑定银行流水记账金额不能大于销售人民币总价！',
                            type: 'error'
                        });
                        return
                    }
                    self.submitData();
                }
            },

            submitData(){
                let self = this;
                if(this.submitForm.bank_statement_line.id && !this.permissionsMap['AccountingNeed'] && !this.permissionsMap['SaleCrudPaymentRelationNeed']){
                    this.$message({
                        showClose: true,
                        message: '该账号在当前公司中无关联银行流水权限，请联系公司管理员！',
                        type: 'error'
                    });
                    return
                }
                if(!this.permissionsMap['AccountingNeed'] && !this.permissionsMap['ZerosoAccountApplyPaymentNeed']){
                    this.$message({
                        showClose: true,
                        message: '该账号在当前公司中无申请付款权限，请联系公司管理员！',
                        type: 'error'
                    });
                    return
                }



                let order_products = [];
                if (self.detailForm.products) {
                    self.detailForm.products.forEach((product) => {
                        if (!product.mark_as_deleted && product.product_quote_state!=='INVALID' && product.product_quote_state !== 'REPLACED') {
                            order_products.push({
                                "product_id": product.product_id,
                                "product_name": product.product_name,
                                "product_order_no": product.product_order_no,
                                "forecast_import_tariff": 0,
                                "shipment_period": product.prodcut_quotation.shipment_period ? product.prodcut_quotation.shipment_period * 1 : undefined,
                                "qty": product.prodcut_quotation.quantity,
                                "purchase_taxed_price_unit": Number((self.supplierIs0soCompany ? product.prodcut_quotation.procurement.total_cny_price_with_tariff : product.prodcut_quotation.procurement.total_price_with_tariff) / product.prodcut_quotation.quantity).myRound(2),
                                "sale_taxed_price_unit": Number((self.supplierIs0soCompany ? product.prodcut_quotation.sales.total_cny_price_with_tariff : product.prodcut_quotation.sales.total_price_with_tariff) / product.prodcut_quotation.quantity).myRound(2),
                            })
                        }
                    })
                }
                let requestData = {
                    order_request: {
                        "base_info": {
                            brand_name: self.detailForm.brand.name,
                            inquiry_priority: "middle",
                        },
                        "node_info": {
                            "purchase": self.hasNoSupplier ? null : {
                                delivery_mode: self.detailForm.supplier.delivery_mode,
                                ...(self.detailForm.supplier && self.detailForm.supplier.company ? self.detailForm.supplier.company : {}),
                                ...(self.detailForm.supplier && self.detailForm.supplier.user ? self.detailForm.supplier.user : {}),
                            },
                            "my": {
                                delivery_mode: self.detailForm.customer.delivery_mode,
                                account_user_id: self.$store.state.currentCompany.user_id,
                                ...self.$store.state.currentCompany,
                            },
                            "customer": self.hasNoCustomer ? null : {
                                ...(self.detailForm.customer && self.detailForm.customer.company ? self.detailForm.customer.company : {}),
                                ...(self.detailForm.customer && self.detailForm.customer.user ? self.detailForm.customer.user : {}),
                            }
                        },
                        "order_products": order_products
                    },
                    bank_statement_line_request: self.hasNoCustomer || !self.submitForm.bank_statement_line.id ? null : {
                        account_company_id: self.$store.state.currentCompany.account_company_id,
                        bank_statement_line_id: self.submitForm.bank_statement_line.id,
                        book_money: self.submitForm.bank_statement_line.book_money_input,
                        money: self.submitForm.bank_statement_line.money_input,

                        currency: self.submitForm.bank_statement_line.currency,
                        comment: self.submitForm.bank_statement_line.comment,
                        transaction_date: self.submitForm.bank_statement_line.transaction_date,
                        partner_bank_account_name: self.submitForm.bank_statement_line.partner_bank_account_name,
                        partner_company_id: self.detailForm.customer.company.account_company_id,
                        module: "order",
                    },
                    outbound_request: self.hasNoSupplier ? null : {
                        due_date: self.submitForm.due_date,
                        book_money: self.submitForm.book_money * -1,
                        money: self.submitForm.money * -1,
                        currency: self.submitForm.currency,
                        comment: self.submitForm.comment,
                        partner_company_id: self.supplierIs0soCompany ? 39567 : self.detailForm.supplier.company.account_company_id, //申请付款对象公司，如果当前供应商是零搜集团，则指定为 39567  零搜供应链（深圳）有限公司
                        account_company_id: self.$store.state.currentCompany.account_company_id,
                        payment_type: "outbound",
                        module: "order",
                    },

                };
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId + '/order',
                    type: 'POST',
                    requestBody: true,
                    data: requestData,
                    success: function (data) {
                        self.loading = false;
                        if (data.id) {
                            self.createOrderData = {
                                orderId: data.id,
                                orderName: data.name,
                            };
                            self.stepActive = 2;
                            self.$emit('update');
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
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