<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[orderState]}}</el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <span class="el-breadcrumb__inner is-link" @click="goToOrder">
                            {{orderDetail.name ? '订单详情：'+orderDetail.name :''}}
                        </span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>收付款</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">

            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20">
                            订单号：
                            <span class="blue cursor-pointer" @click="goToOrder">
                                {{orderDetail.name}}
                            </span>
                        </span>

                        <el-tag :type="currentNodeState.invoice_state == 'no_invoice' ? 'info' : 'warning'" >{{currentNodeState.invoice_state|zerosoOrderInvoiceState}}</el-tag>
                        <el-tag :type="currentNodeState.inbound_state == 'no_receipt' ? 'info' : 'warning'" >{{currentNodeState.inbound_state|zerosoOrderReceiptState}}</el-tag>
                        <el-tag :type="currentNodeState.outbound_state == 'no_receipt' ? 'info' : 'warning'">{{currentNodeState.outbound_state|zerosoOrderPaymentState}}</el-tag>
                    </h3>
                </div>
            </div>



            <div v-if="paymentType === 'inbound' && orderDetail.id">
                <invoice-detail-inbound type="order" :orderDetail="orderDetail" :account-company="accountCompany" :partner-company="partnerCompany"></invoice-detail-inbound>
                <invoice-detail-outbound type="order" :orderDetail="orderDetail" :account-company="partnerCompany" :partner-company="accountCompany"></invoice-detail-outbound>
            </div>

            <div v-if="paymentType === 'outbound' && orderDetail.id">
                <invoice-detail-outbound type="order" :orderDetail="orderDetail" :account-company="partnerCompany" :partner-company="accountCompany"></invoice-detail-outbound>
                <invoice-detail-inbound type="order" :orderDetail="orderDetail" :account-company="accountCompany" :partner-company="partnerCompany"></invoice-detail-inbound>
            </div>

        </div>


    </div>
</template>

<script>


    import InvoiceDetailInbound from "../../finance/invoice/component/invoice-detail-inbound";
    import InvoiceDetailOutbound from "../../finance/invoice/component/invoice-detail-outbound";
    export default {
        components: {
            InvoiceDetailOutbound,
            InvoiceDetailInbound

        },
        data() {
            return {
                queryId: '',
                parentQuery: '',

                orderState:'',
                breadNameList:{
                    in_quote:'下单',
                    processing:'执行中订单',
                    done:'已完结订单',
                    cancelled:'已取消订单',
                    all:'全部订单',
                },
                accountCompanyId:'',

                orderDetail: {},

                paymentType:'',
                accountCompany:{},
                partnerCompany:{},

                currentNodeState: {},


                outboundData:[],
                inboundData:[],

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
                this.orderState = this.$route.params.orderState;
                self.parentQuery = self.$route.query.parentQuery;

                self.accountCompanyId = self.$route.query.accountCompanyId;
                self.partnerCompanyId = self.$route.query.partnerCompanyId;

                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.orderDetail = {};
                }

            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.orderDetail = data.msg;
                            self.orderDetail.order_nodes.forEach((item)=>{
                                if(item.account_company_id==self.accountCompanyId){
                                    self.accountCompany=item.account_company;
                                }
                                if(item.account_company_id==self.partnerCompanyId){
                                    self.partnerCompany=item.account_company;
                                }
                            });
                            self.orderDetail.order_node_states.forEach((item)=>{
                                if(item.account_company_id==self.accountCompanyId){
                                    self.currentNodeState=item;
                                }
                            });


                            self.paymentType = self.$store.state.currentCompany.account_company_id == self.accountCompanyId ? 'inbound' : 'outbound';
                        }
                    }
                })
            },


            getOutboundList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment_order + '/outbound',
                    data:{
                        order_name: self.orderDetail.name,
                        account_company_id: self.partnerCompany.account_company_id,
                        partner_company_id: self.accountCompany.account_company_id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.outboundData = data.msg;
                        }
                    }
                })
            },
            getInboundList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment_order + '/inbound',
                    data:{
                        order_name: self.orderDetail.name,
                        account_company_id: self.accountCompany.account_company_id,
                        partner_company_id: self.partnerCompany.account_company_id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.inboundData = data.msg;
                        }
                    }
                })
            },

            goToOrder(){
              this.$router.push({
                  path:'detail',
                  query:{
                      id:this.queryId,
                      parentQuery:this.parentQuery || undefined
                  }
              })
            },


        }
    }
</script>

<style lang="scss">

</style>
