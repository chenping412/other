<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item to="list?filter=%257B%2522invoice_status%2522%253A%2522normal%2522%257D&order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D" v-if="invoiceType">
                        {{invoiceType === 'customer' ? '客户发票':'供应商发票'}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item :to="'detail?id='+queryId">发票详情</el-breadcrumb-item>
                    <el-breadcrumb-item>发票记账</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <el-form label-width="160px">
                <div class="detail-base-info">
                    <div class="detail-base-title">
                        <div class="detail-status">
                            <h3 class="inline-block margin-right-20">发票信息</h3>
                        </div>
                    </div>
                    <div class="detail-base-body">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="发票号：">
                                    <span class="form-border-bottom">
                                        <router-link class="blue" :to="'detail?id='+invoiceDetail.id">
                                            {{invoiceDetail.invoice_number | defaultStr}}
                                        </router-link>
                                    </span>
                                </el-form-item>
                                <el-form-item label="发票日期：">
                                    <span class="form-border-bottom">{{invoiceDetail.invoice_date | defaultStr}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="未税金额：">
                                    <span class="form-border-bottom">
                                        {{invoiceDetail.total | isoCurrency(invoiceDetail.currency) | defaultStr}}
                                    </span>
                                </el-form-item>
                                <el-form-item label="总额：">
                                    <span class="form-border-bottom">{{invoiceDetail.total_taxed | isoCurrency(invoiceDetail.currency) | defaultStr}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </div>
                </div>
            </el-form>

            <account-documents-move
                    :accountMove="accountMove"
                    type="invoice"
                    @update="init">
            </account-documents-move>
        </div>

    </div>
</template>

<script>

    import AccountDocumentsMove from "../../account-documents/component/account-documents-move";
    export default {
        components: {
            AccountDocumentsMove
        },
        data() {
            return {
                queryId: null,
                isEdit: false,
                invoiceType:null,

                invoiceDetail: {},
                accountMove:{},

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
                    self.getDetailData();
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit=false;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_invoice_v4 + '/' + self.queryId + '/account_move',
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            if(data.msg.invoice) {
                                self.invoiceDetail = data.msg.invoice;
                            }
                            if(data.msg.account_move) {
                                self.accountMove = data.msg.account_move;
                            }
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">

</style>
