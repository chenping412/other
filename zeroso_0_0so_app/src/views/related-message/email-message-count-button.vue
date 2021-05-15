<template>
    <div class="email-message-count-button" v-loading="loading">
        <el-badge :value="countDetail.unread_mail"
                  :hidden="!countDetail.unread_mail || countDetail.unread_mail==0"
                  v-if="!hideEmail">
            <el-button type="warning" plain size="mini" @click="goToEmail">邮件 {{countDetail.mail || ''}}</el-button>
        </el-badge>
        <el-badge :value="countDetail.unread_message"
                  :hidden="!countDetail.unread_message || countDetail.unread_message==0"
                  v-if="!hideMessage"
                  class="margin-left-10">
            <el-button type="warning" plain size="mini" @click="goToMessage">{{messageTitle || '消息'}} {{countDetail.message || ''}}
            </el-button>
        </el-badge>
    </div>
</template>

<script>
    export default {
        props: ['module_id', 'module_name', 'subsystem', 'brandId', 'orderDetail', 'inquiryData', 'quoteInquiryData', 'hideEmail', 'hideMessage','messageTitle'],
        data() {
            return {
                countDetail: {},
                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
            module_id() {
                this.init()
            },
            orderDetail() {
                this.init()
            },
            inquiryData() {
                this.init()
            },
            quoteInquiryData() {
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                if (this.module_id && this.module_name && this.subsystem) {
                    if (this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.getMessageCount();
                    }, 200);
                }
            },
            getMessageCount(callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_v3_mail_order_detail_message_count,
                    data: {
                        module_id: self.module_id.toString(),
                        module_name: self.module_name,
                        subsystem: self.subsystem,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.countDetail = data.msg;
                            if(callback) callback(self.countDetail);
                        }
                    }
                })
            },

            goToEmail() {
                let href;
                if (this.orderDetail) {
                    href = '#/related/email-list?data=' +
                            encodeURIComponent(encodeURIComponent(JSON.stringify({
                                "orderName": this.orderDetail.name,
                                "brand": {
                                    "id": this.orderDetail.brand.id,
                                    "name": this.orderDetail.brand.name,
                                    "state": this.orderDetail.brand.state
                                },
                                "supplier_company": this.orderDetail.order_nodes[0].account_company.company_type !== 'internal' ? {
                                    account_company_id:this.orderDetail.order_nodes[0].account_company.account_company_id,
                                    company_name:this.orderDetail.order_nodes[0].account_company.company_name,
                                    company_type:this.orderDetail.order_nodes[0].account_company.company_type,
                                    state:this.orderDetail.order_nodes[0].account_company.state,
                                } : {},
                                "customer_company": this.orderDetail.order_nodes[this.orderDetail.order_nodes.length - 1].account_company.company_type !== 'internal' ? {
                                    account_company_id:this.orderDetail.order_nodes[this.orderDetail.order_nodes.length - 1].account_company.account_company_id,
                                    company_name:this.orderDetail.order_nodes[this.orderDetail.order_nodes.length - 1].account_company.company_name,
                                    company_type:this.orderDetail.order_nodes[this.orderDetail.order_nodes.length - 1].account_company.company_type,
                                    state:this.orderDetail.order_nodes[this.orderDetail.order_nodes.length - 1].account_company.state,
                                } : {},

                            })))
                            + '&module_id=' + this.module_id
                            + '&module_name=' + this.module_name
                            + '&subsystem=' + this.subsystem
                } else if (this.inquiryData) {
                    href = '#/related/email-list?data=' +
                            encodeURIComponent(encodeURIComponent(JSON.stringify({
                                "inquiryName": this.inquiryData.id,
                                "brand": {
                                    "id": this.inquiryData.brand.id,
                                    "name": this.inquiryData.brand.name,
                                    "agency_state": this.inquiryData.brand.agency_state
                                },
                                "supplier_company": {
                                    account_company_id:this.inquiryData.supplier_company.account_company_id,
                                    company_name:this.inquiryData.supplier_company.company_name,
                                    company_type:this.inquiryData.supplier_company.company_type,
                                    state:this.inquiryData.supplier_company.state,
                                },
                            })))
                            + '&module_id=' + this.module_id
                            + '&module_name=' + this.module_name
                            + '&subsystem=' + this.subsystem
                }  else if (this.quoteInquiryData) {
                    href = '#/related/email-list?data=' +
                            encodeURIComponent(encodeURIComponent(JSON.stringify({
                                "quoteInquiryName": this.quoteInquiryData.id,
                                "brand": {
                                    "id": this.quoteInquiryData.brand.id,
                                    "name": this.quoteInquiryData.brand.name,
                                    "agency_state": this.quoteInquiryData.brand.agency_state
                                },
                                "supplier_company": {
                                    account_company_id:this.quoteInquiryData.inquiry_supplier_company.account_company_id,
                                    company_name:this.quoteInquiryData.inquiry_supplier_company.company_name,
                                    company_type:this.quoteInquiryData.inquiry_supplier_company.company_type,
                                    state:this.quoteInquiryData.inquiry_supplier_company.state,
                                },
                            })))
                            + '&module_id=' + this.module_id
                            + '&module_name=' + this.module_name
                            + '&subsystem=' + this.subsystem
                } else {
                    href = '#/related/email-list' +
                            '?module_id=' + this.module_id
                            + '&module_name=' + this.module_name
                            + '&subsystem=' + this.subsystem

                }
                if (href) window.open(href);
            },
            goToMessage() {
                let href;
                if (this.orderDetail) {
                    href = '#/related/message?orderName=' + this.orderDetail.name;
                } else {
                    href = '#/related/message' +
                            '?module_id=' + this.module_id
                            + '&module_name=' + this.module_name
                            + '&subsystem=' + this.subsystem;
                    if (this.quoteInquiryData) {
                        href += '&inquiryQuotationId=' + this.quoteInquiryData.id
                    }
                    if (this.inquiryData) {
                        href += '&inquiryId=' + this.inquiryData.id
                    }
                }
                if (this.brandId) {
                    href += '&brandId=' + this.brandId
                }
                if (href) window.open(href);
            },
        },
    }
</script>

<style lang="scss" scoped>
.email-message-count-button{
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
}
</style>