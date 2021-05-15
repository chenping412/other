<template>
    <el-card class="margin-bottom-20" v-loading="loading">
        <div class="clearfix" slot="header">
            <h3 class="left">明细</h3>
            <div class="right" v-if="queryId && canEditStatusList.indexOf(detailForm.status)>-1 && !detailForm.isRedInvoice">
                <el-button type="primary" v-if="!isEdit" @click="isEdit=true">编辑</el-button>
                <div v-else>
                    <el-button type="success" @click="clickSave()">保存</el-button>
                    <el-button type="primary" plain @click="init()">取消</el-button>
                </div>
            </div>
        </div>
        <el-table v-if="detailForm.invoice_lines" :data="detailForm.invoice_lines" border>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="货物或应用劳务名称">
                <template slot-scope="scope">
                    <el-input v-if="isEdit || !queryId" v-model="scope.row.product_type_name"></el-input>
                    <div v-else>
                        <p>{{scope.row.product_type_name | defaultStr}}</p>
                        <el-tag type="warning" v-if="scope.row.tax_code_status ==='ok'">{{scope.row.product_cn_tax_code
                            | defaultStr}}
                        </el-tag>
                        <el-tag type="danger" v-if="scope.row.tax_code_status !=='ok'">
                            {{scope.row.tax_code_status|zerosoTaxCodeStatus}}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="product_name" label="规格型号" width="300">
                <template slot-scope="scope">
                    <el-input type="textarea" v-if="isEdit || !queryId" v-model="scope.row.product_name"></el-input>
                    <div style="white-space: pre-wrap" v-else>{{scope.row.product_name}}</div>
                </template>
            </el-table-column>
            <el-table-column width="50">
                <template slot-scope="scope">
                    <i class="el-icon-copy-document el-icon-normal blue cursor-pointer clipboard-button"
                       :data-clipboard-text="scope.row.product_name" title="复制"></i>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="right">
                <template slot-scope="scope">
                    <InputNumber v-if="isEdit || !queryId" :value.sync="scope.row.quantity" :minus="true"></InputNumber>
                    <span v-else>{{scope.row.quantity}}</span>
                </template>
            </el-table-column>
            <el-table-column label="未税单价" align="right">
                <template slot-scope="scope">
                    <InputNumber v-if="isEdit || !queryId" :value.sync="scope.row.price" :minus="true"
                                 :disabled="detailForm.tax_method!=='on_untaxed'"></InputNumber>
                    <span v-else>{{scope.row.price | isoCurrency(detailForm.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="含税单价" align="right">
                <template slot-scope="scope">
                    <InputNumber v-if="isEdit || !queryId" :value.sync="scope.row.price_taxed" :minus="true"
                                 :disabled="!!queryId && detailForm.tax_method!=='on_taxed'"></InputNumber>
                    <span v-else>{{scope.row.price_taxed | isoCurrency(detailForm.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="未税总价" align="right">
                <template slot-scope="scope">
                    <span>{{scope.row.total_amount | isoCurrency(detailForm.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="含税总价" align="right">
                <template slot-scope="scope">
                    <span>{{scope.row.total_taxed_amount | isoCurrency(detailForm.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="税额" align="right">
                <template slot-scope="scope">
                    <span>{{scope.row.total_tax | isoCurrency(detailForm.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" v-if="!scope.row.id" @click="clickDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="clearfix">
            <div class="left padding-top-10">
                <el-button type="primary" v-if="isEdit || !queryId" @click="clickAdd()">新增</el-button>
            </div>
            <div class="right">
                <table class="table">
                    <tbody>
                    <tr>
                        <td></td>
                        <td>货币</td>
                        <td>{{detailForm.currency}}</td>
                    </tr>
                    <tr>
                        <td>+</td>
                        <td>附加费用(未税)</td>
                        <td>
                            <InputNumber v-if="isEdit || !queryId" :value.sync="detailForm.additional_fee">
                                <template slot="append">{{detailForm.currency}}</template>
                            </InputNumber>
                            <span v-else>{{detailForm.additional_fee | isoCurrency(detailForm.currency) | defaultStr}}</span>
                        </td>
                    </tr>

                    <tr v-if="$store.state.currentUser.european_union && $store.state.currentUser.european_union.indexOf(detailForm.supplier.country)>-1 && detailForm.tax_method==='on_untaxed'">
                        <td>-</td>
                        <td>全单减免</td>
                        <td>
                            <InputNumber v-if="isEdit || !queryId" :value.sync="detailForm.invoice_discount">
                                <template slot="append">{{detailForm.currency}}</template>
                            </InputNumber>
                            <span v-else>{{detailForm.invoice_discount | isoCurrency(detailForm.currency) | defaultStr}}</span>
                        </td>
                    </tr>

                    <tr>
                        <td class="border-bottom"></td>
                        <td class="border-bottom"></td>
                        <td class="border-bottom"></td>
                    </tr>

                    <tr>
                        <td>=</td>
                        <td>未税金额</td>
                        <td>{{detailForm.total | isoCurrency(detailForm.currency) | defaultStr}}</td>
                    </tr>
                    <tr>
                        <td>+</td>
                        <td>
                            <span v-if="isEdit || !queryId">税率</span>
                            <span v-else>税额<b>({{detailForm.tax_rate}}%)</b></span>
                        </td>
                        <td>
                            <InputNumber v-if="isEdit || !queryId" :value.sync="detailForm.tax_rate">
                                <template slot="append">%</template>
                            </InputNumber>
                            <span v-else>{{detailForm.total_tax | isoCurrency(detailForm.currency) | defaultStr}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>=</td>
                        <td>含税总额</td>
                        <td>{{detailForm.total_taxed | isoCurrency(detailForm.currency) | defaultStr}}</td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <div style="text-align: center;" v-if="queryId">
            <el-button type="primary" v-if="stateButton.action" @click="updateAction(stateButton.action)">
                {{stateButton.name}}
            </el-button>

            <el-button type="warning" v-if="detailForm.status!=='draft' && detailForm.status!=='canceled'"
                       @click="updateAction('revert')">
                回退
            </el-button>
            <el-button type="warning" v-if="detailForm.status==='draft'" @click="updateAction('canceled')">
                取消
            </el-button>


            <el-button type="success"
                       v-if="isDisplayAccountMove && !detailForm.isHasRedInvoice"
                       @click="createAccountDocuments()">
                记账
            </el-button>

           <invoice-detail-edit-delivery-info
                   class="margin-left-10"
                   :invoiceDetail="invoiceDetail"
                   @update="$emit('updateInit')">
           </invoice-detail-edit-delivery-info>
        </div>

    </el-card>
</template>

<script>

    import InvoiceDetailEditDeliveryInfo from "./invoice-detail-edit-delivery-info";
    export default {
        components: {InvoiceDetailEditDeliveryInfo},
        props: ['detailForm', 'queryId'],
        data() {
            return {
                isEdit: false,
                invoiceDetail:{},

                canEditStatusList: ['draft', 'unconfirmed', 'confirmed'],

                stateButtonList: [
                    {displayList: ['draft'], name: '发送', action: 'unconfirmed'},
                    {displayList: ['unconfirmed'], name: '确认', action: 'confirmed'},
                    {displayList: ['confirmed'], name: '已开票', action: 'generated'},
                    {displayList: ['generated'], name: '已寄票', action: 'sent'},
                    {displayList: ['sent'], name: '确认签收', action: 'received'},
                    {displayList: ['received'], name: '已认证', action: 'verified'},
                ],
                stateButton: {},

                loading: false,
            }
        },
        computed:{
            isDisplayAccountMove(){
                return ['generated', 'sent', 'received', 'verified'].indexOf(this.detailForm.status) >= 0;
            },
        },
        watch: {
            'detailForm'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.invoiceDetail = JSON.parse(JSON.stringify(this.detailForm));
                this.isEdit = false;
                this.stateButton = {};
                this.stateButtonList.forEach((item) => {
                    if (item.displayList.indexOf(this.detailForm.status) > -1) {
                        this.stateButton = item;
                    }
                })
            },

            clickSave() {
                let self = this;
                let hasInvoiceLines = true;
                if (self.detailForm.invoice_lines.length > 0) {
                    for (let i = 0; i < self.detailForm.invoice_lines.length; i++) {
                        if (!self.detailForm.invoice_lines[i].quantity || (!self.detailForm.invoice_lines[i].price && !self.detailForm.invoice_lines[i].price_taxed)) {
                            hasInvoiceLines = false;
                        }
                    }
                } else {
                    self.$message({
                        type: 'error',
                        message: '至少需要填写一项明细！',
                        showClose: 'true'
                    });
                    return
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
                    url: self.$api.bank_invoices_v4 + '/' + self.queryId + '/invoice_line',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        invoice_id: self.queryId,
                        invoice_lines: self.detailForm.invoice_lines,
                        tax_rate: self.detailForm.tax_rate,
                        additional_fee: self.detailForm.additional_fee,
                        total: self.detailForm.total,
                        total_taxed: self.detailForm.total_taxed,
                        invoice_discount: self.detailForm.invoice_discount,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.isEdit = false;
                            self.$emit('updateInit');
                        }
                    }
                })
            },

            clickAdd() {
                this.detailForm.invoice_lines.push({})
            },
            clickDelete(row) {
                this.detailForm.invoice_lines.splice(this.detailForm.invoice_lines.indexOf(row), 1)
            },
            updateAction(actionStatus) {
                let self = this;
                if (actionStatus === 'canceled') {
                    this.$confirm('是否关闭该发票?', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateActionSubmit(actionStatus);
                            }
                        }
                    });
                    return false;
                }
                if (actionStatus === 'verified') {
                    this.$confirm('是否确认发票已验证？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback(action) {
                            if (action == 'confirm') {
                                self.updateActionSubmit(actionStatus);
                            }
                        }
                    });
                    return false;
                }
                self.updateActionSubmit(actionStatus);
            },
            updateActionSubmit(actionStatus) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoices + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        id: self.queryId,
                        name: actionStatus
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.$message({
                                type: 'success',
                                message: '操作成功！',
                                showClose: 'true'
                            });
                            self.$emit('updateInit');
                        } else {
                            self.$message({
                                type: 'error',
                                message: '撤销失败！',
                                showClose: 'true'
                            });
                        }
                    }
                })
            },


            //点击记账
            createAccountDocuments() {
                let self=this;
                self.$router.push({
                    path: "account-documents",
                    query: {
                        id: self.queryId,
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
