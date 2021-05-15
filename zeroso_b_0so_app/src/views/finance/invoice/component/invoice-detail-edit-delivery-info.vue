<template>
    <div class="inline-block" style="text-align: left;">
        <el-button v-if="!$slots.default" @click="clickEdit">编辑快递信息</el-button>
        <slot></slot>

        <el-dialog title="快递下单" :visible.sync="dialogShow" width="1000px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="deliveryForm" :rules="deliveryFormRule" ref="form" label-width="120px">
                <el-form-item label="发票信息:" v-if="batchSendInvoiceUrl">
                    <template v-if="deliveryForm.invoices">
                        <el-tag v-for="(item,$index) in deliveryForm.invoices" :key="$index">{{item.name}}</el-tag>
                    </template>

                </el-form-item>
                <el-form-item label="收货公司:" v-if="!batchSendInvoiceUrl">
                    <span class="form-border-bottom">{{sendToCompany.company_name}}</span>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="快递公司:">
                            <el-select v-model="deliveryForm.base_info.delivery_company"
                                       @change="changeDeliveryCompany">
                                <el-option
                                        v-for="(item,$index) in $store.state.deliveryCompanies"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快递母单号:">
                            <InputNumber :value.sync="deliveryForm.base_info.primary_mail_no"
                                         :disabled="deliveryForm.is_delivery_made" :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="快递子单号:" v-if="deliveryForm.base_info.delivery_company==='sf_express'">
                            <div v-if="deliveryForm.base_info.secondary_mail_no">
                                <p v-for="(item,$index) in deliveryForm.base_info.secondary_mail_no" :key="$index">
                                    <InputNumber :value.sync="deliveryForm.base_info.secondary_mail_no[$index]"
                                                 :disabled="deliveryForm.is_delivery_made" :integer="true"
                                                 style="width: 200px"></InputNumber>
                                    <el-button size="mini" :disabled="deliveryForm.is_delivery_made"
                                               @click="deleteSecondaryMailNo($index)">删除
                                    </el-button>
                                </p>
                                <el-button size="mini" type="primary" :disabled="deliveryForm.is_delivery_made"
                                           @click="addSecondaryMailNo">添加
                                </el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="月结账号:" v-if="deliveryForm.base_info.delivery_company==='sf_express'">
                            <InputNumber :value.sync="deliveryForm.base_info.customer_pay_code"
                                         :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="快递类型:">
                            <el-select v-model="deliveryForm.base_info.delivery_type_id">
                                <el-option
                                        v-for="(item,$index) in deliveryTypes"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="保价金额:">
                            <InputNumber :value.sync="deliveryForm.base_info.insurance_price"></InputNumber>
                        </el-form-item>
                        <el-form-item label="包裹数量:" prop="base_info.package_total"
                                      :rules="deliveryFormRule.package_total">
                            <InputNumber :value.sync="deliveryForm.base_info.package_total" :min="1"
                                         :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="物品名称:"
                                      v-if="deliveryForm.base_info.delivery_company!=='sf_express'"
                                      prop="base_info.item_name"
                                      :rules="deliveryFormRule.item_name">
                            <el-input v-model="deliveryForm.base_info.item_name"></el-input>
                        </el-form-item>
                        <el-form-item label="支付类型:" v-if="deliveryForm.base_info.delivery_company==='sf_express'">
                            <el-select v-model="deliveryForm.base_info.payment_type">
                                <el-option
                                        v-for="(item,$index) in $store.state.deliveryPaymentTypes"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider></el-divider>

                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <el-tag type="warning">发货地址</el-tag>
                        </el-form-item>
                        <el-form-item label="发货公司:">
                            <el-input v-model="deliveryForm.sender_address.company_name"></el-input>
                        </el-form-item>
                        <el-form-item label="发件人:" prop="sender_address.name"
                                      :rules="deliveryFormRule.sender_address_name">
                            <el-input v-model="deliveryForm.sender_address.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式:" prop="sender_address.phone" :rules="deliveryFormRule.phone">
                            <el-input v-model="deliveryForm.sender_address.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="国 家:">
                            <el-input v-model="deliveryForm.sender_address.country"></el-input>
                        </el-form-item>
                        <el-form-item label="省:" prop="sender_address.province" :rules="deliveryFormRule.province">
                            <el-input v-model="deliveryForm.sender_address.province"></el-input>
                        </el-form-item>
                        <el-form-item label="市:" prop="sender_address.city" :rules="deliveryFormRule.city">
                            <el-input v-model="deliveryForm.sender_address.city"></el-input>
                        </el-form-item>
                        <el-form-item label="区:">
                            <el-input v-model="deliveryForm.sender_address.district"></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址:" prop="sender_address.street" :rules="deliveryFormRule.street">
                            <el-input v-model="deliveryForm.sender_address.street"></el-input>
                        </el-form-item>
                        <el-form-item label="邮编:">
                            <el-input v-model="deliveryForm.sender_address.zip"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-tag type="warning">收货地址</el-tag>
                        </el-form-item>
                        <el-form-item label="收货公司:">
                            <el-input v-model="deliveryForm.receiver_address.company_name"></el-input>
                        </el-form-item>
                        <el-form-item label="收件人:" prop="receiver_address.name"
                                      :rules="deliveryFormRule.receiver_address_name">
                            <el-input v-model="deliveryForm.receiver_address.name"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式:" prop="receiver_address.phone" :rules="deliveryFormRule.phone">
                            <el-input v-model="deliveryForm.receiver_address.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="国 家:">
                            <el-input v-model="deliveryForm.receiver_address.country"></el-input>
                        </el-form-item>
                        <el-form-item label="省:" prop="receiver_address.province" :rules="deliveryFormRule.province">
                            <el-input v-model="deliveryForm.receiver_address.province"></el-input>
                        </el-form-item>
                        <el-form-item label="市:" prop="receiver_address.city" :rules="deliveryFormRule.city">
                            <el-input v-model="deliveryForm.receiver_address.city"></el-input>
                        </el-form-item>
                        <el-form-item label="区:">
                            <el-input v-model="deliveryForm.receiver_address.district"></el-input>
                        </el-form-item>
                        <el-form-item label="详细地址:" prop="receiver_address.street" :rules="deliveryFormRule.street">
                            <el-input v-model="deliveryForm.receiver_address.street"></el-input>
                        </el-form-item>
                        <el-form-item label="邮编:">
                            <el-input v-model="deliveryForm.receiver_address.zip"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="deliveryForm.is_delivery_made && !batchSendInvoiceUrl"
                           @click="clickSaveDate('POST')">再次下单
                </el-button>
                <el-button type="primary" v-if="!deliveryForm.is_delivery_made || batchSendInvoiceUrl"
                           @click="clickSaveDate('POST')">下 单
                </el-button>
                <el-button type="primary" v-if="!deliveryForm.is_delivery_made && !batchSendInvoiceUrl"
                           @click="clickSaveDate('PUT')">保 存
                </el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="确认准备寄出的发票" :visible.sync="invoicesFormShow" width="500px" :close-on-click-modal="false">
            <el-form label-width="100px">
                <el-form-item label="相关发票">
                    <el-tag v-for="(item,$index) in invoicesForm.invoices" :key="$index">{{item.name}}</el-tag>
                </el-form-item>
                <el-form-item label="快递单号">
                    <PrintSfExpressTicket
                            v-if="invoicesForm.delivery_info"
                            :delivery-info="invoicesForm.delivery_info.base_info"
                            :currentMailNo="invoicesForm.delivery_info.base_info.primary_mail_no"
                            :from-company-name="invoicesForm.delivery_info.sender_address.company_name"
                            :from-address="invoicesForm.delivery_info.sender_address"
                            :to-company-name="invoicesForm.delivery_info.receiver_address.company_name"
                            :to-address="invoicesForm.delivery_info.receiver_address">
                    </PrintSfExpressTicket>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmInvoiceMarkAsSend()">标记所有发票为已寄票</el-button>
                <el-button @click="invoicesFormShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['invoiceDetail'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                deliveryForm: {
                    id: null,
                    base_info: {},
                    receiver_address: {},
                    sender_address: {},
                },
                deliveryFormRule: {
                    package_total: [
                        {required: true, message: '请输入包裹数量！'}
                    ], item_name: [
                        {required: true, message: '请输入物品名称！'}
                    ], sender_address_name: [
                        {required: true, message: '请输入发件人！'}
                    ],
                    phone: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请输入联系方式！'));
                                } else if (!/^[0-9\-]+$/.test(value)) {
                                    callback(new Error('联系方式格式不正确'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    province: [
                        {required: true, message: '请输入省！'}
                    ], city: [
                        {required: true, message: '请输入市！'}
                    ], street: [
                        {required: true, message: '请输入详细地址！'}
                    ], receiver_address_name: [
                        {required: true, message: '请输入收件人！'}
                    ],
                },

                batchSendInvoiceUrl: null,

                sendToCompany: {},


                invoicesFormShow: false,
                invoicesForm: {},

                normalCustomerPayCode:'7550216196',

            }
        },
        computed: {
            deliveryTypes() {
                let arr = [];
                this.$store.state.deliveryCompanies.forEach((item) => {
                    if (item.code === this.deliveryForm.base_info.delivery_company) {
                        arr = item.deliveryTypes
                    }
                });
                return arr;
            }
        },
        watch: {
            'invoiceDetail'() {
                this.init()
            },
        },
        created() {
            this.init();
            this.getDefaultsThirdDelivery();
        },
        methods: {
            init() {
                this.deliveryForm = {
                    id: null,
                    base_info: {},
                    receiver_address: {},
                    sender_address: {},
                }
            },
            clickEdit() {
                let self = this;
                this.batchSendInvoiceUrl = null;
                self.sendToCompany = JSON.parse(JSON.stringify(self.invoiceDetail.customer));
                if (this.invoiceDetail.delivery_info) {
                    this.deliveryForm = JSON.parse(JSON.stringify(self.invoiceDetail.delivery_info));
                    this.deliveryForm.id = self.invoiceDetail.id;
                } else {
                    this.deliveryForm = {
                        id: self.invoiceDetail.id,
                        base_info: {
                            delivery_company: 'sf_express',
                            delivery_type_id: '1',
                            payment_type: 'sender_pay',
                            package_total: 1,
                            secondary_mail_no: [],
                            item_name: '发票'
                        },
                        receiver_address: self.invoiceDetail.customer_company_invoice_address ? JSON.parse(JSON.stringify(self.invoiceDetail.customer_company_invoice_address)) : {},
                        sender_address: self.invoiceDetail.supplier_company_invoice_address ? JSON.parse(JSON.stringify(self.invoiceDetail.supplier_company_invoice_address)) : {},
                    };
                    this.deliveryForm.sender_address.company_name = self.invoiceDetail.supplier_company_name;
                    this.deliveryForm.receiver_address.company_name = self.invoiceDetail.customer_company_name;
                }

                this.editInit()
            },

            showEdit(param) {
                this.deliveryForm = param.delivery_info;
                this.batchSendInvoiceUrl = param.batchSendInvoiceUrl;
                this.editInit()
            },
            editInit() {
                if(!this.deliveryForm.base_info.customer_pay_code){
                    this.deliveryForm.base_info.customer_pay_code = this.$store.state.currentCompany.account_company_id === 260 ? '' : this.normalCustomerPayCode;
                }
                if (!this.deliveryForm.base_info.secondary_mail_no) this.deliveryForm.base_info.secondary_mail_no = [];

                let keyList = ['company_name', 'name', 'phone', 'country', 'province', 'city', 'district', 'street', 'zip'];
                keyList.forEach((item) => {
                    if (!this.deliveryForm.sender_address[item]) this.deliveryForm.sender_address[item] = '';
                    if (!this.deliveryForm.receiver_address[item]) this.deliveryForm.receiver_address[item] = '';
                });
                this.deliveryForm = JSON.parse(JSON.stringify(this.deliveryForm));
                this.dialogShow = true;
            },

            getDefaultsThirdDelivery() {
                let self = this;
                self.$http({
                    url: self.$api.partner_self_defaults_third_delivery,
                    success(result) {
                        if (result && result.msg && result.msg.customer_pay_code) {
                            self.normalCustomerPayCode = result.msg.customer_pay_code
                        }
                    }
                });
            },


            clickSaveDate(httpType) {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        let requestData = self.$utils.formatRemoveNullKey(self.deliveryForm);
                        self.$http({
                            url: self.batchSendInvoiceUrl || self.$api.bank_invoices + '/' + self.invoiceDetail.id + '/make_delivery',
                            type: httpType,
                            requestBody: true,
                            data: requestData,
                            success(data) {
                                self.loading = false;
                                self.dialogShow = false;

                                if (self.batchSendInvoiceUrl && data.msg) {
                                    self.invoicesForm = data.msg;
                                    self.invoicesFormShow = true;
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update')
                                }
                            }
                        });
                    }
                });
            },

            confirmInvoiceMarkAsSend() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.batchSendInvoiceUrl,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        invoice_ids: self.deliveryForm.invoice_ids
                    },
                    success() {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.invoicesFormShow = false;
                        self.$emit('update')
                    }
                })
            },


            addSecondaryMailNo() {
                if (!this.deliveryForm.base_info.secondary_mail_no) this.deliveryForm.base_info.secondary_mail_no = [];
                this.deliveryForm.base_info.secondary_mail_no.push('');
            },
            deleteSecondaryMailNo($index) {
                this.deliveryForm.base_info.secondary_mail_no.splice($index, 1);
            },

            changeDeliveryCompany() {
                let self = this;
                if (self.deliveryForm.base_info.delivery_company === 'sf_express') {
                    self.deliveryForm.base_info.delivery_type_id = '1';
                    self.deliveryForm.base_info.payment_type = 'sender_pay';
                    if(!this.deliveryForm.base_info.customer_pay_code) {
                        self.deliveryForm.base_info.customer_pay_code = self.$store.state.currentCompany.account_company_id === 260 ? '' : this.normalCustomerPayCode;
                    }
                } else {
                    self.deliveryForm.base_info.delivery_type_id = '0';
                }
            }


        },
    }
</script>

<style lang="scss" scoped>

</style>