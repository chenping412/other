<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item
                            :to="parentQuery ? 'list?'+parentQuery : 'list?filter=%257B%2522invoice_status%2522%253A%2522normal%2522%257D&order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D'"
                            v-if="invoiceType">
                        {{invoiceType === 'customer' ? '客户发票':'供应商发票'}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>发票详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <el-form :model="detailForm" :rules="detailFormRule" ref="detailForm" label-width="160px">

                <div class="detail-base-info">
                    <div class="detail-base-title">
                        <div class="detail-status" v-if="queryId">
                            <h3 class="inline-block margin-right-20">
                                <span>发票号：</span>
                                <span :class="{'red':detailForm.isRedInvoice}" class="big-size">{{detailForm.invoice_number}}</span>
                            </h3>
                            <el-tag type="danger" effect="dark" v-if="detailForm.is_hot">催</el-tag>
                            <el-tag :type="detailForm.status ==='received'?'success'
                                    :detailForm.status ==='canceled' || detailForm.status ==='draft'?'info'
                                    :null">
                                {{detailForm.status | zerosoInvoiceStatus}}
                            </el-tag>
                            <el-tag>{{detailForm.is_reconsiled ? '已核销' : '未核销'}}</el-tag>
                            <el-tag>{{detailForm.is_paid| zerosoPaidState}}</el-tag>
                            <el-tag type="danger" effect="dark" v-if="detailForm.isHasRedInvoice">冲红</el-tag>

                            <email-message-count-button
                                    class="margin-left-20"
                                    :module_id="queryId"
                                    module_name="invoice"
                                    subsystem="accounting">
                            </email-message-count-button>
                        </div>
                        <div class="detail-control clearfix">
                            <div class="control-btns">
                                <template v-if="queryId">
                                    <SelectEmailTemplate
                                            class="margin-right-10"
                                            :invoiceData="detailForm"
                                            :accountCompanyId="$store.state.currentCompany.account_company_id"
                                            :module_id="queryId"
                                            module_name="invoice"
                                            subsystem="accounting"
                                            profession_type="to_customer_invoice">
                                    </SelectEmailTemplate>

                                    <SelectReportTemplate
                                            class="margin-right-10"
                                            :reportData="detailForm"
                                            :accountCompanyId="$store.state.currentCompany.account_company_id"
                                            module_name="invoice"
                                            subsystem="accounting"
                                            :profession_type="detailForm.invoice_style+'_invoice'">
                                    </SelectReportTemplate>

                                    <el-button type="warning" v-if="detailForm.is_paid !== 'is_paid'"
                                               @click="adminPaidSet()">设置已支付
                                    </el-button>
                                    <el-button type="danger"
                                               v-if="!detailForm.isHasRedInvoice && !detailForm.isRedInvoice && detailForm.status === 'verified'"
                                               @click="createRedInvoice()">冲红发票
                                    </el-button>
                                    <el-button type="danger"
                                               @click="setAction(detailForm.is_hot?'unset_hot':'set_hot')">
                                        {{detailForm.is_hot?'取消催开':'催开'}}
                                    </el-button>
                                    <el-button v-if="detailForm.invoice_style === 'customer'"
                                               class="btn btn-primary btn-sm pull-right ml10 " @click="exportXML()">
                                        导出XML
                                    </el-button>
                                    <el-button type="primary"
                                               v-if="!isEdit && canEditStatusList.indexOf(detailForm.status)>-1"
                                               @click="clickEdit">编辑
                                    </el-button>

                                    <el-button type="success" v-if="isEdit" @click="clickSave()">保存</el-button>
                                    <el-button type="primary" v-if="isEdit" plain @click="getDetailData()">取消
                                    </el-button>
                                </template>
                                <el-button v-else type="success" @click="clickCreatSubmit()">创建</el-button>
                            </div>
                            <DetailPagination v-if="queryId" :apiKey="'accounting_'+invoiceType+'_invoice'"
                                              :listApi="listApi"></DetailPagination>
                        </div>
                    </div>
                    <div class="detail-base-body">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="发票号：" prop="invoice_number" v-if="isEdit || !queryId">
                                    <el-input v-model="detailForm.invoice_number"></el-input>
                                </el-form-item>

                                <el-form-item label="凭证号：">
                                    <div class="form-border-bottom">
                                        <router-link class="blue"
                                                     v-if="detailForm.invoice_style && detailForm[detailForm.invoice_style+'_account_move'] && detailForm[detailForm.invoice_style+'_account_move'].id"
                                                     :to="'/finance/account-documents/detail?id='+detailForm[detailForm.invoice_style+'_account_move'].id">
                                            {{detailForm[detailForm.invoice_style+'_account_move'].voucher_number}}
                                        </router-link>
                                        <span v-else>{{'' | defaultStr}}</span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="海关汇率："
                                              v-if="detailForm.customer.country !== detailForm.supplier.country">
                                    <div class="form-border-bottom">
                                        {{detailForm.customer_currency_rate | defaultStr}}
                                    </div>
                                </el-form-item>
                                <el-form-item label="发票日期：" prop="invoice_date">
                                    <el-date-picker
                                            v-if="isEdit || !queryId"
                                            v-model="detailForm.invoice_date"
                                            :clearable="false"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="付款日期">
                                    </el-date-picker>
                                    <span class="form-border-bottom"
                                          v-else>{{detailForm.invoice_date | defaultStr}}</span>
                                </el-form-item>
                                <el-form-item label="计税方式：">
                                    <el-select v-if="isEdit || !queryId" v-model="detailForm.tax_method">
                                        <el-option value="on_untaxed" label="未税计价"></el-option>
                                        <el-option value="on_taxed" label="含税计价"></el-option>
                                    </el-select>
                                    <span class="form-border-bottom"
                                          v-else>{{detailForm.tax_method | zerosoTaxType}}</span>
                                </el-form-item>
                                <el-form-item label="备注：">
                                    <el-input v-if="isEdit || !queryId" type="textarea" :rows="4"
                                              v-model="detailForm.notes"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.notes | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="付款条款：">
                                    <el-input v-if="isEdit || !queryId" type="textarea" :rows="4"
                                              v-model="detailForm.clause"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.clause | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="附件：">
                                    <FileListShow
                                            :show-delete="true"
                                            ref="fileListShow"
                                            :updateFileList.sync="invoiceFileList"
                                            :module_id="queryId"
                                            module_name="invoice"
                                            subsystem="accounting">
                                    </FileListShow>
                                    <FileUpload
                                            v-if="queryId"
                                            :auto-upload="true"
                                            :isOnlyOne="true"
                                            :fileNamePrefix="fileNamePrefix"
                                            :module_id="queryId"
                                            module_name="invoice"
                                            subsystem="accounting"
                                            @uploadSuccess="uploadSuccess">
                                    </FileUpload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="货币：" prop="currency">
                                    <el-select v-if="isEdit || !queryId" v-model="detailForm.currency">
                                        <el-option
                                                v-for="item in $store.state.currency"
                                                :key="item.code"
                                                :value="item.code"
                                                :label="item.code">
                                        </el-option>
                                    </el-select>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.currency | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="关联单据：">
                                    <div class="form-border-bottom">
                                        <template v-if="detailForm.reference && detailForm.reference.length>0">
                                            <span
                                                    class="blue margin-right-20 cursor-pointer"
                                                    v-for="(item,$index) in detailForm.reference"
                                                    :key="$index"
                                                    @click="goToOrderDetail(item)">
                                            {{item.name}}
                                        </span>
                                        </template>

                                    </div>
                                </el-form-item>
                                <el-form-item label="原始发票：" v-if="detailForm.invoice_type_name==='red'">
                                    <span class="form-border-bottom">
                                        <b class="blue cursor-pointer"
                                           @click="goToInvoiceDetail(detailForm.common_invoice.id)">
                                            {{detailForm.common_invoice.name}}
                                        </b>
                                    </span>
                                </el-form-item>
                                <el-form-item label="进口缴款书："
                                              v-if="detailForm.customer.country !== detailForm.supplier.country">
                                    <span class="form-border-bottom" v-if="detailForm.customer_invoice">
                                        <router-link class="blue" :to="'custom-invoice?id='+queryId">
                                            {{detailForm.customer_invoice.customer_tax_invoice_number}}
                                        </router-link>
                                    </span>
                                    <el-button v-else type="primary" size="mini" @click="clickCreateCustomerInvoice">
                                        生成
                                    </el-button>
                                </el-form-item>
                                <el-form-item label="红字发票：" v-if="detailForm.invoice_type_name==='common'">
                                    <span class="form-border-bottom">
                                        <b class="red cursor-pointer"
                                           v-if="detailForm.red_invoice"
                                           @click="goToInvoiceDetail(detailForm.red_invoice.id)">
                                            {{detailForm.red_invoice.name}}
                                        </b>
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="" prop="customer_company_id">
                                    <template slot="label">
                                        <el-tag type="warning" effect="dark">买方公司：</el-tag>
                                    </template>

                                    <SelectPartnerCompanyOnly
                                            v-if="isEdit || !queryId"
                                            :partnerId.sync="detailForm.customer_company_id"
                                            :partner="detailForm.customer"
                                            :option="detailForm.customer_company_id ? [detailForm.customer] : null"
                                            @change="customerCompanyIdChange">
                                    </SelectPartnerCompanyOnly>
                                    <h4 v-if="detailForm.customer && !isEdit">
                                        <router-link :to="'/partner/detail?id='+detailForm.customer.account_company_id">
                                            {{detailForm.customer.company_name}}
                                            <CompanyType :type="detailForm.customer.company_type"></CompanyType>
                                        </router-link>
                                    </h4>
                                </el-form-item>
                                <el-form-item label="买方代表：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.customer_user_name"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_user_name | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="寄票地址：">
                                    <span class="form-border-bottom">
                                        {{detailForm.customer_company_invoice_address | zerosoInvoiceAddress |defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="纳税人识别号：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.customer_company_tax_info.company_tax_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_company_tax_info.company_tax_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="地址，电话：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.customer_company_tax_info.company_address_tel"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_company_tax_info.company_address_tel | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="开户行及账户：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.customer_company_tax_info.company_tax_bank"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_company_tax_info.company_tax_bank | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="客户编码：" v-if="$store.state.currentCompany.country === 'DE'">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.customer_company_tax_info.de_code"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_company_tax_info.de_code | defaultStr}}
                                    </span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="" prop="supplier_company_id">
                                    <template slot="label">
                                        <el-tag type="warning" effect="dark">卖方公司：</el-tag>
                                    </template>

                                    <SelectPartnerCompanyOnly
                                            v-if="isEdit || !queryId"
                                            :partnerId.sync="detailForm.supplier_company_id"
                                            :partner="detailForm.supplier"
                                            :option="detailForm.supplier_company_id ? [detailForm.supplier] : null"
                                            @change="supplierCompanyIdChange">
                                    </SelectPartnerCompanyOnly>
                                    <h4 v-if="detailForm.supplier && !isEdit">
                                        <router-link :to="'/partner/detail?id='+detailForm.supplier.account_company_id">
                                            {{detailForm.supplier.company_name}}
                                            <CompanyType :type="detailForm.supplier.company_type"></CompanyType>
                                        </router-link>
                                    </h4>
                                </el-form-item>
                                <el-form-item label="卖方代表：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.supplier_user_name"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.supplier_user_name | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="寄票地址：">
                                    <span class="form-border-bottom">
                                        {{detailForm.supplier_company_invoice_address | zerosoInvoiceAddress |defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="纳税人识别号：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.supplier_company_tax_info.company_tax_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.supplier_company_tax_info.company_tax_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="地址，电话：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.supplier_company_tax_info.company_address_tel"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.supplier_company_tax_info.company_address_tel | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="开户行及账户：">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.supplier_company_tax_info.company_tax_bank"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.supplier_company_tax_info.company_tax_bank | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="供应商编码：" v-if="$store.state.currentCompany.country === 'DE'">
                                    <el-input v-if="isEdit || !queryId"
                                              v-model="detailForm.supplier_company_tax_info.de_code"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.supplier_company_tax_info.de_code | defaultStr}}
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>


                <invoice-detail-line :detailForm="detailForm" :queryId="queryId" @updateInit="init()"></invoice-detail-line>


                <invoice-detail-inbound
                        v-if="queryId && detailForm.id && detailForm.invoice_style === 'customer' && !detailForm.isRedInvoice && !detailForm.isHasRedInvoice"
                        type="invoice" :invoiceDetail="detailForm"
                        :account-company="detailForm.supplier"
                        :partner-company="detailForm.customer">
                </invoice-detail-inbound>


                <invoice-detail-outbound
                        v-if="queryId && detailForm.id && detailForm.invoice_style === 'supplier' && !detailForm.isRedInvoice && !detailForm.isHasRedInvoice"
                        type="invoice" :invoiceDetail="detailForm"
                        :account-company="detailForm.customer"
                        :partner-company="detailForm.supplier">
                </invoice-detail-outbound>


                <invoice-detail-delivery-info v-if="detailForm.delivery_info" :invoiceDetail="detailForm"></invoice-detail-delivery-info>

            </el-form>
        </div>

    </div>
</template>

<script>

    import InvoiceDetailInbound from "./component/invoice-detail-inbound";
    import InvoiceDetailOutbound from "./component/invoice-detail-outbound";
    import OrderUtils from './../../order/order-utils.js'
    import InvoiceDetailLine from "./component/invoice-detail-line";
    import EmailMessageCountButton from "../../related-message/email-message-count-button";
    import InvoiceDetailDeliveryInfo from "./component/invoice-detail-delivery-info";

    export default {
        components: {
            InvoiceDetailDeliveryInfo,
            EmailMessageCountButton,
            InvoiceDetailLine,
            InvoiceDetailOutbound,
            InvoiceDetailInbound
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                invoiceType: '',
                listApi: '',

                canEditStatusList: ['draft', 'unconfirmed', 'confirmed'],

                detailForm: {
                    customer_account_move: {},
                    supplier_account_move: {},
                    red_invoice: {},
                    common_invoice: {},
                    customer: {},
                    customer_company_tax_info: {},
                    supplier: {},
                    supplier_company_tax_info: {},
                    partner: {},
                    reference: [],
                    invoice_lines: [],
                },
                detailFormRule: {
                    invoice_number: [
                        {required: true, message: '请输入发票号！', trigger: 'change'}
                    ],
                    currency: [
                        {required: true, message: '请选择货币！', trigger: 'change'}
                    ],
                    invoice_date: [
                        {required: true, message: '请选择发票日期！', trigger: 'change'}
                    ],
                    customer_company_id: [
                        {required: true, message: '请选择买方公司！', trigger: 'change'}
                    ],
                    supplier_company_id: [
                        {required: true, message: '请选择卖方公司！', trigger: 'change'}
                    ],
                },

                invoiceFileList: [],

                fileNamePrefix:null,

                loading: false,
            }
        },
        watch: {
            invoiceFileList() {
                this.detailForm.fileList = this.invoiceFileList;
            },
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

                this.invoiceType = this.$route.params.invoiceType;
                if (this.invoiceType === 'customer') {
                    this.listApi = this.$api.bank_customer_invoice_search;
                } else if (this.invoiceType === 'supplier') {
                    this.listApi = this.$api.bank_supplier_invoice_search;
                }

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = null;
                    self.detailForm = {
                        currency: self.$store.state.currentUser.account_company.currency || 'CNY',
                        tax_method: 'on_taxed',
                        invoice_date: self.$moment().format('YYYY-MM-DD'),
                        customer_account_move: {},
                        supplier_account_move: {},
                        red_invoice: {},
                        common_invoice: {},
                        customer: {},
                        customer_company_tax_info: {},
                        supplier: {},
                        supplier_company_tax_info: {},
                        partner: {},
                        reference: [],
                        invoice_lines: [],
                        tax_rate: 0,
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoices + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {

                            if (!data.msg.customer_account_move) data.msg.customer_account_move = {};
                            if (!data.msg.supplier_account_move) data.msg.supplier_account_move = {};
                            if (!data.msg.red_invoice) data.msg.red_invoice = {};
                            if (!data.msg.common_invoice) data.msg.common_invoice = {};
                            if (!data.msg.customer) data.msg.customer = {};
                            if (!data.msg.customer_company_tax_info) data.msg.customer_company_tax_info = {};
                            if (!data.msg.supplier) data.msg.supplier = {};
                            if (!data.msg.supplier_company_tax_info) data.msg.supplier_company_tax_info = {};
                            if (!data.msg.partner) data.msg.partner = {};

                            data.msg.isRedInvoice = data.msg.invoice_type_name === 'red';
                            data.msg.isHasRedInvoice = !!(data.msg.invoice_type_name === 'common' && data.msg.red_invoice && data.msg.red_invoice.id);

                            if (!data.msg.fileList) data.msg.fileList = self.invoiceFileList;
                            self.detailForm = data.msg;

                            self.fileNamePrefix = self.detailForm.invoice_number + '-' + self.detailForm.invoice_date + '-' + self.$moment().format('YYYYMMDD') + '-'
                        }
                    }
                })
            },


            clickEdit() {
                this.isEdit = true;
                if (!this.detailForm.invoice_date) this.detailForm.invoice_date = this.$utils.getDate();
            },
            clickSave() {
                let self = this;
                self.$refs.detailForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_invoices_v4 + '/' + self.queryId + '/invoice_info',
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.err_code.length === 0 && data.msg) {
                                    self.isEdit = false;
                                    self.getDetailData();
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
            //创建发票提交数据
            clickCreatSubmit() {
                let self = this;
                self.$refs.detailForm.validate(function (valid) {
                    if (valid) {
                        let hasInvoiceLines = true;
                        if (self.detailForm.invoice_lines.length > 0) {
                            for (let i = 0; i < self.detailForm.invoice_lines.length; i++) {
                                if (!self.detailForm.invoice_lines[i].quantity || (!self.detailForm.invoice_lines[i].price && !self.detailForm.invoice_lines[i].price_taxed)) {
                                    hasInvoiceLines = false;
                                }
                            }
                        }
                        if (!hasInvoiceLines) {
                            self.$message({
                                type: 'error',
                                message: '明细中必须填写数量和单价！',
                                showClose: 'true'
                            });
                            return
                        }
                        if (!self.detailForm.tax_rate && self.detailForm.tax_rate !== 0) {
                            self.$message({
                                type: 'error',
                                message: '请输入发票税率！',
                                showClose: 'true'
                            });
                            return
                        }


                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_invoice,
                            type: 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.err_code.length === 0 && data.msg && data.msg.id) {
                                    let query = JSON.parse(JSON.stringify(self.$route.query));
                                    query.id = data.msg.id;
                                    self.$router.push({
                                        path: 'detail',
                                        query: query
                                    });
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                    }
                });
            },


            customerCompanyIdChange(company) {
                let self = this;
                if (!company || !company.account_company_id) return false
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + company.account_company_id,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            let currentPartner = data.msg;
                            self.detailForm.customer_company_name = currentPartner.name;
                            self.detailForm.customer_company_tax_info = {
                                company_tax_number: currentPartner.taxpayer_code,
                                company_address_tel: `${currentPartner.invoice_address || ''}  ${currentPartner.invoice_phone || ''}`,
                                company_tax_bank: `${currentPartner.bank_name || ''}  ${currentPartner.bank_account || ''}`,
                                de_code: currentPartner.de_supplier_code
                            };
                        }
                    }
                })
            },


            supplierCompanyIdChange(company) {
                let self = this;
                if (!company || !company.account_company_id) return false
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + company.account_company_id,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            let currentPartner = data.msg;
                            self.detailForm.supplier_company_name = currentPartner.name;
                            self.detailForm.supplier_company_tax_info = {
                                company_tax_number: currentPartner.taxpayer_code,
                                company_address_tel: `${currentPartner.invoice_address || ''}  ${currentPartner.invoice_phone || ''}`,
                                company_tax_bank: `${currentPartner.bank_name || ''}  ${currentPartner.bank_account || ''}`,
                                de_code: currentPartner.de_supplier_code
                            };
                        }
                    }
                })
            },
            goToOrderDetail(item) {
                if(item.module_name==='internal_transfer'){
                    this.$router.push({
                        path:'/logistics/stockOut/detail',
                        query:{
                            id:item.module_id
                        }
                    })
                }else if(item.module_name==='order'){
                    OrderUtils.goToOrderDetail(item.module_id)
                }

            },
            uploadSuccess() {
                this.$refs.fileListShow.update();
            },


            createRedInvoice() {
                let self = this;
                self.$confirm('一旦确认，则无法取消冲红操作，请谨慎处理。确认冲红这张发票吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/generate_red_invoice',
                                type: 'POST',
                                requestBody: true,
                                data: {
                                    invoice_id: self.queryId,
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg && data.msg.new_id) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功！',
                                            showClose: 'true'
                                        });
                                        self.goToInvoiceDetail(data.msg.new_id);
                                    } else {
                                        self.$message({
                                            type: 'error',
                                            message: '操作失败！',
                                            showClose: 'true'
                                        });
                                    }
                                }
                            })

                        }
                    }
                })
            },
            goToInvoiceDetail(id) {
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.id = id;
                this.$router.push({
                    path: this.$route.path,
                    query: query,
                })
            },

            adminPaidSet() {
                let self = this;
                self.$confirm('此操作不可逆，是否确认操作？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/admin_action',
                                type: 'PUT',
                                requestBody: true,
                                data: {
                                    invoice_id: self.queryId,
                                    name: "set_paid"
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功！',
                                            showClose: 'true'
                                        });
                                        self.getDetailData();
                                    } else {
                                        self.$message({
                                            type: 'error',
                                            message: '操作失败！',
                                            showClose: 'true'
                                        });
                                    }
                                }
                            })

                        }
                    }
                })
            },

            setAction(action) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoices + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        id: self.queryId,
                        name: action
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                type: 'success',
                                message: '操作成功！',
                                showClose: 'true'
                            });
                            self.getDetailData();
                        } else {
                            self.$message({
                                type: 'error',
                                message: '操作失败！',
                                showClose: 'true'
                            });
                        }
                    }
                })
            },


            clickCreateCustomerInvoice() {
                let self = this;
                self.$prompt('海关汇率', '生成海关发票', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'number',
                    inputValidator(value) {
                        if (!value && value !== 0) {
                            return '请填写海关汇率！'
                        } else {
                            let arr = value.toString().split('.');
                            if(arr.length>1 && arr[1].length>4){
                                return '海关汇率最多填写4位小数！'
                            }else {
                                return true
                            }
                        }
                    }
                }).then(({value}) => {
                    self.$router.push({
                        path: "custom-invoice",
                        query: {
                            id: self.queryId,
                            isCreate: true,
                            customerCurrencyRate: value
                        }
                    });
                }).catch(() => {

                });
            },


            exportXML() {
                this.$utils.createInvoiceXML([this.queryId]);
            },

        }
    }
</script>

<style lang="scss" scoped>
    .table {
        border-collapse: collapse;

        th, td {
            text-align: left;
            padding: 5px 20px;
        }

        td:last-child {
            text-align: right;
        }

        .border-bottom {
            border-bottom: 1px solid #666666;
        }
    }
</style>
