<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item to="list?filter=%257B%2522invoice_status%2522%253A%2522normal%2522%257D&order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D" v-if="invoiceType">
                        {{invoiceType === 'customer' ? '客户发票':'供应商发票'}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item :to="'detail?id='+queryId">发票详情</el-breadcrumb-item>
                    <el-breadcrumb-item>进口关税发票</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <el-form :model="detailForm" :rules="detailFormRule" ref="detailForm" label-width="160px">

                <div class="detail-base-info">
                    <div class="detail-base-title">
                        <div class="detail-status">
                            <h3 class="inline-block margin-right-20">进口关税发票</h3>
                        </div>
                        <div class="detail-control clearfix">
                            <div class="control-btns">
                                <template v-if="queryId && !isEdit">
                                   <el-button type="primary" @click="clickEdit">编辑</el-button>
                                   <el-button type="danger" @click="clickDeleteCustomInvoice">删除</el-button>
                                </template>
                                <template v-else>
                                    <el-button type="success" @click="clickSave()">保存</el-button>
                                    <el-button type="primary" plain @click="init()">取消</el-button>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="detail-base-body">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="海关缴费单号码：" prop="customer_tax_invoice_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.customer_tax_invoice_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_tax_invoice_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="填发日期：" prop="customer_invoice_date">
                                    <el-date-picker
                                            v-if="isEdit || !queryId"
                                            v-model="detailForm.customer_invoice_date"
                                            :clearable="false"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="日期">
                                    </el-date-picker>
                                    <span class="form-border-bottom" v-else>{{detailForm.customer_invoice_date | defaultStr}}</span>
                                </el-form-item>
                                <el-form-item label="收入机关：" prop="income_company">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.income_company"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.income_company | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="收款国库：" prop="income_bank_name">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.income_bank_name"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.income_bank_name | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="账号：" prop="income_bank_account">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.income_bank_account"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.income_bank_account | defaultStr}}
                                    </span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="增值税缴费单号码：" prop="vat_tax_invoice_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.vat_tax_invoice_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.vat_tax_invoice_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="关联发票：">
                                    <span class="form-border-bottom">
                                        <router-link class="blue" v-if="detailForm.invoice" :to="'detail?id='+detailForm.invoice.id">
                                            {{detailForm.invoice.name | defaultStr}}
                                        </router-link>
                                    </span>
                                </el-form-item>
                                <el-form-item label="缴款单位：" prop="payment_company">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.payment_company"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.payment_company | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="账号：" prop="payment_bank_account">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.payment_bank_account"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.payment_bank_account | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="开户行：" prop="payment_bank_name">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.payment_bank_name"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.payment_bank_name | defaultStr}}
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-divider></el-divider>

                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="报关汇率：" prop="customer_currency_rate">
                                    <InputNumber v-if="isEdit || !queryId" :value.sync="detailForm.customer_currency_rate"></InputNumber>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_currency_rate | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="申请单位编号：" prop="payment_company_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.payment_company_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.payment_company_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="合同(批文)号：" prop="contract_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.contract_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.contract_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="缴款期限：" prop="deadline_date">
                                    <el-date-picker
                                            v-if="isEdit || !queryId"
                                            v-model="detailForm.deadline_date"
                                            :clearable="false"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="日期">
                                    </el-date-picker>
                                    <span class="form-border-bottom" v-else>{{detailForm.deadline_date | defaultStr}}</span>
                                </el-form-item>
                                <el-form-item label="国际代码：" prop="international_code">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.international_code"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.international_code | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="备注：" prop="comment">
                                    <el-input type="textarea" :rows="5" v-if="isEdit || !queryId" v-model="detailForm.comment"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.comment | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="附件：">
                                    <FileListShow
                                            :show-delete="true"
                                            ref="fileListShow"
                                            :module_id="queryId"
                                            module_name="customer_invoice"
                                            subsystem="accounting">
                                    </FileListShow>
                                    <FileUpload
                                            v-if="queryId"
                                            :auto-upload="true"
                                            :module_id="queryId"
                                            module_name="customer_invoice"
                                            subsystem="accounting"
                                            @uploadSuccess="$refs.fileListShow.update()">
                                    </FileUpload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="原始货币：" prop="origin_currency">
                                    <el-select v-if="isEdit || !queryId" v-model="detailForm.origin_currency">
                                        <el-option
                                                v-for="item in $store.state.currency"
                                                :key="item.code"
                                                :value="item.code"
                                                :label="item.code">
                                        </el-option>
                                    </el-select>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.origin_currency | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="报关单编号：" prop="customer_doc_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.customer_doc_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.customer_doc_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="运输工具号：" prop="vehicle_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.vehicle_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.vehicle_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="提/装货单号：" prop="cargo_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.cargo_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.cargo_number | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="电子支付流水号：" prop="e_payment_number">
                                    <el-input v-if="isEdit || !queryId" v-model="detailForm.e_payment_number"></el-input>
                                    <span class="form-border-bottom" v-else>
                                        {{detailForm.e_payment_number | defaultStr}}
                                    </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-form>


            <el-card style="margin-bottom: 100px;" v-if="detailForm.customer_invoice_lines">
                <h3 slot="header">明细</h3>

                <el-form :model="detailForm" ref="customerInvoiceLinesForm" label-width="0">
                    <el-table :data="detailForm.customer_invoice_lines">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="对应发票项目ID">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId">
                                    <el-input v-model="scope.row.invoice_line_id" placeholder="对应发票项目ID"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.invoice_line_id | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="税号(海关编码)">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId" :prop="'customer_invoice_lines.'+scope.$index+'.customs_cn_code'" :rules="detailFormRule.customs_cn_code">
                                    <el-input v-model="scope.row.customs_cn_code" placeholder="税号(海关编码)"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_cn_code | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="货物名称">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId" :prop="'customer_invoice_lines.'+scope.$index+'.product_cn_name'" :rules="detailFormRule.product_cn_name">
                                    <el-input v-model="scope.row.product_cn_name" placeholder="货物名称"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.product_cn_name | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId" :prop="'customer_invoice_lines.'+scope.$index+'.quantity'" :rules="detailFormRule.quantity">
                                    <el-input v-model="scope.row.quantity" placeholder="数量"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.quantity | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="关税缴款总价">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId" :prop="'customer_invoice_lines.'+scope.$index+'.customer_untaxed_price'" :rules="detailFormRule.customer_untaxed_price">
                                    <el-input v-model="scope.row.customer_untaxed_price" placeholder="关税缴款总价"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customer_untaxed_price | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="关税(%)">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId">
                                    <el-input v-model="scope.row.customer_tax_rate" placeholder="关税(%)"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customer_tax_rate | percent | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="关税税额">
                            <template slot-scope="scope">
                                <span>{{scope.row.customer_tax_price | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="增值税缴款总价">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId" :prop="'customer_invoice_lines.'+scope.$index+'.vat_untaxed_price'" :rules="detailFormRule.vat_untaxed_price">
                                    <el-input v-model="scope.row.vat_untaxed_price" placeholder="增值税缴款总价"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.vat_untaxed_price | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="增值税(%)">
                            <template slot-scope="scope">
                                <el-form-item v-if="isEdit || !queryId">
                                    <el-input v-model="scope.row.vat_rate" placeholder="增值税(%)"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.vat_rate | percent | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="增值税额">
                            <template slot-scope="scope">
                                <span>{{scope.row.vat_tax_price | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                            </template>
                        </el-table-column>


                        <el-table-column label="操作" width="120px">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" v-if="isEdit || !queryId" @click="delLine(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="padding-10 clearfix">
                        <h3 class="left">
                            <span class="margin-right-20">关税缴费单合计： {{detailForm.customer_total | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                            <span class="margin-left-20">增值税缴费单合计： {{detailForm.vat_total | isoCurrency(detailForm.current_currency) | defaultStr}}</span>
                        </h3>

                        <div class="right">
                            <el-button
                                    style="margin-left: 100px;margin-right: 40px;" type="primary"
                                    size="mini"
                                    v-if="isEdit || !queryId"
                                    @click="addLine()">添加
                            </el-button>
                        </div>
                    </div>
                </el-form>
            </el-card>
        </div>

    </div>
</template>

<script>

    export default {
        components: {
        },
        data() {
            return {
                queryId: null,
                isEdit: false,
                invoiceType:null,
                isCreate:false,
                customerCurrencyRate:null,

                detailForm: {},
                detailFormRule: {
                    customer_tax_invoice_number: [
                        {required: true, message: '请输入海关缴费单号码！'}
                    ],customer_invoice_date: [
                        {required: true, message: '请输入填发日期！'}
                    ],income_company: [
                        {required: true, message: '请输入收入机关！'}
                    ],income_bank_name: [
                        {required: true, message: '请输入收款国库！'}
                    ],income_bank_account: [
                        {required: true, message: '请输入账号！'}
                    ],vat_tax_invoice_number: [
                        {required: true, message: '请输入增值税缴费单号码！'}
                    ],deadline_date: [
                        {required: true, message: '请输入缴款期限！'}
                    ],customs_cn_code: [
                        {required: true, message: '请输入税号(海关编码)！'}
                    ],product_cn_name: [
                        {required: true, message: '请输入货物名称！'}
                    ],quantity: [
                        {required: true, message: '请输入数量！'}
                    ],customer_untaxed_price: [
                        {required: true, message: '请输入关税缴款总价！'}
                    ],vat_untaxed_price: [
                        {required: true, message: '请输入增值税缴款总价！'}
                    ],
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
                this.invoiceType = this.$route.params.invoiceType;
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;

                    self.isCreate = self.$route.query.isCreate;
                    if(self.isCreate){
                        self.customerCurrencyRate = self.$route.query.customerCurrencyRate;
                        self.getCustomerInvoiceTemplate();
                    }else {
                        self.getDetailData();
                    }
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit=false;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/customer_invoice',
                    success: function (data) {
                        self.loading = false;
                        self.detailForm = data.msg;
                    }
                })
            },

            getCustomerInvoiceTemplate() {
                let self = this;
                self.isEdit=true;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/customer_invoice/template',
                    data:{
                        customer_currency_rate:self.customerCurrencyRate
                    },
                    success: function (data) {
                        self.loading = false;
                        self.detailForm = data.msg;
                    }
                })
            },


            clickEdit(){
                this.isEdit=true;
            },
            addLine() {
                if(this.detailForm.customer_invoice_lines) {
                    this.detailForm.customer_invoice_lines.push({})
                }
            },
            delLine(index) {
                if(this.detailForm.customer_invoice_lines){
                    this.detailForm.customer_invoice_lines.splice(index, 1)
                }
            },
            clickSave() {
                let self = this;
                self.$refs.detailForm.validate(function (valid) {
                    if (valid) {
                        self.$refs.customerInvoiceLinesForm.validate(function (valid1) {
                            if (valid1) {
                                self.loading = true;
                                self.$http({
                                    url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/customer_invoice',
                                    type: 'PUT',
                                    requestBody:true,
                                    data: self.detailForm,
                                    success: function (data) {
                                        self.loading = false;
                                        if (data.err_code.length === 0 && data.msg) {
                                            self.isEdit=false;
                                            self.$message({
                                                showClose: true,
                                                message: '保存成功！',
                                                type: 'success'
                                            });
                                            self.getDetailData();
                                        }
                                    }
                                })
                            }else {
                                self.$message({
                                    type: 'error',
                                    message: '发票明细中，有必填选项未填！',
                                    showClose: 'true'
                                });
                            }
                        });
                    }else {
                        self.$message({
                            type: 'error',
                            message: '发票基本信息中，有必填选项未填！',
                            showClose: 'true'
                        });
                    }
                });
            },

            clickDeleteCustomInvoice() {
                let self = this;
                self.$confirm('确定删除吗？该操作不可逆', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/customer_invoice',
                                type: 'DELETE',
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '删除成功！',
                                        type: 'success'
                                    });
                                    self.$router.push({
                                        path: 'detail?id='+ self.queryId,
                                    });
                                }
                            })
                        }
                    }
                })
            },


        }
    }
</script>

<style lang="scss">

</style>
