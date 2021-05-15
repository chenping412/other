<template>
    <div>
        <el-card class="margin-bottom-20" v-if="deliveryInfo.base_info">
            <el-tabs>
                <el-tab-pane label="物流日志"  v-if="deliveryInfo.base_info.primary_mail_no && invoiceDetail.status === 'sent'">
                    <ExpressLogs :expressNumbers="expressNumbers"></ExpressLogs>
                </el-tab-pane>
                <el-tab-pane label="快递信息">
                    <el-form label-width="180px">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="快递公司：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.delivery_company|logisticsV4DeliveryCompany}}
                            </span>
                                </el-form-item>
                                <el-form-item label="发货类型：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.delivery_type_id | deliveryTypes}}
                            </span>
                                </el-form-item>
                                <el-form-item label="包裹数量：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.package_total | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="物品名称：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.item_name | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="物流单号：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.primary_mail_no | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="快递单打印：">
                            <span class="form-border-bottom">
                                <PrintSfExpressTicket
                                        :delivery-info="deliveryInfo.base_info"
                                        :currentMailNo="deliveryInfo.base_info.primary_mail_no"
                                        :from-company-name="deliveryInfo.sender_address.company_name"
                                        :from-address="deliveryInfo.sender_address"
                                        :to-company-name="deliveryInfo.receiver_address.company_name"
                                        :to-address="deliveryInfo.receiver_address">
                                </PrintSfExpressTicket>
                            </span>
                                </el-form-item>

                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="月结账号：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.customer_pay_code | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="付款方式：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.payment_type | deliveryPaymentTypes}}
                            </span>
                                </el-form-item>
                                <el-form-item label="保 价：">
                            <span class="form-border-bottom">
                                {{deliveryInfo.base_info.insurance_price | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="子单号：">
                            <span class="form-border-bottom" v-if="deliveryInfo.base_info.secondary_mail_no">
                                <span class="margin-right-10" v-for="(mailNo,$index) in deliveryInfo.base_info.secondary_mail_no" :key="$index">
                                    <PrintSfExpressTicket
                                            :delivery-info="deliveryInfo.base_info"
                                            :currentMailNo="mailNo"
                                            :from-company-name="deliveryInfo.sender_address.company_name"
                                            :from-address="deliveryInfo.sender_address"
                                            :to-company-name="deliveryInfo.receiver_address.company_name"
                                            :to-address="deliveryInfo.receiver_address">
                                </PrintSfExpressTicket>
                                </span>
                            </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item>
                                    <el-tag type="warning" effect="dark" slot="label">发货公司</el-tag>
                                    <span class="form-border-bottom">
                                <router-link class="blue"
                                             v-if="invoiceDetail.supplier"
                                             :to="'/partner/detail?id='+invoiceDetail.supplier.account_company_id">
                                    {{invoiceDetail.supplier.company_name}}
                                </router-link>
                            </span>
                                </el-form-item>
                                <el-form-item label="发货人：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.sender_address?deliveryInfo.sender_address.name:null) | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="联系方式：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.sender_address?deliveryInfo.sender_address.phone:null) | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="所在地区：">
                            <span class="form-border-bottom">
                                <span v-if="deliveryInfo.sender_address">
                                    <span v-text="deliveryInfo.sender_address.country?deliveryInfo.sender_address.country+',':''"></span>
                                    <span v-text="deliveryInfo.sender_address.province?deliveryInfo.sender_address.province+',':''"></span>
                                    <span v-text="deliveryInfo.sender_address.city?deliveryInfo.sender_address.city+',':''"></span>
                                    <span v-text="deliveryInfo.sender_address.district?deliveryInfo.sender_address.district:''"></span>
                                </span>
                            </span>
                                </el-form-item>
                                <el-form-item label="详细地址：">
                            <span class="form-border-bottom">
                                <span v-if="deliveryInfo.sender_address">
                                    <span v-text="deliveryInfo.sender_address.district?deliveryInfo.sender_address.district+',':''"></span>
                                    <span v-text="deliveryInfo.sender_address.street?deliveryInfo.sender_address.street:''"></span>
                                </span>
                            </span>
                                </el-form-item>
                                <el-form-item label="邮编：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.sender_address?deliveryInfo.sender_address.zip:null) | defaultStr}}
                            </span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item>
                                    <el-tag type="warning" effect="dark" slot="label">收货公司</el-tag>
                                    <span class="form-border-bottom">
                                <router-link class="blue"
                                             v-if="invoiceDetail.customer"
                                             :to="'/partner/detail?id='+invoiceDetail.customer.account_company_id">
                                    {{invoiceDetail.customer.company_name}}
                                </router-link>
                            </span>
                                </el-form-item>
                                <el-form-item label="收件人：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.receiver_address?deliveryInfo.receiver_address.name:null) | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="联系方式：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.receiver_address?deliveryInfo.receiver_address.phone:null) | defaultStr}}
                            </span>
                                </el-form-item>
                                <el-form-item label="所在地区：">
                            <span class="form-border-bottom">
                                <span v-if="deliveryInfo.receiver_address">
                                    <span v-text="deliveryInfo.receiver_address.country?deliveryInfo.receiver_address.country+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.province?deliveryInfo.receiver_address.province+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.city?deliveryInfo.receiver_address.city+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.district?deliveryInfo.receiver_address.district:''"></span>
                                </span>
                            </span>
                                </el-form-item>
                                <el-form-item label="详细地址：">
                            <span class="form-border-bottom">
                                <span v-if="deliveryInfo.receiver_address">
                                    <span v-text="deliveryInfo.receiver_address.province?deliveryInfo.receiver_address.province+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.city?deliveryInfo.receiver_address.city+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.district?deliveryInfo.receiver_address.district+',':''"></span>
                                    <span v-text="deliveryInfo.receiver_address.street?deliveryInfo.receiver_address.street:''"></span>
                                </span>
                            </span>
                                </el-form-item>
                                <el-form-item label="邮编：">
                            <span class="form-border-bottom">
                                {{(deliveryInfo.receiver_address?deliveryInfo.receiver_address.zip:null) | defaultStr}}
                            </span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
            </el-tabs>



        </el-card>

    </div>
</template>

<script>
    export default {
        props: ['invoiceDetail'],
        data() {
            return {
                deliveryInfo:{},

                expressNumbers:[],
            }
        },
        watch:{
            invoiceDetail(){
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                this.deliveryInfo = this.invoiceDetail.delivery_info;
                this.getDeliveryLog();
            },
            getDeliveryLog() {
                let self=this;
                let result = [];
                if (self.deliveryInfo.base_info) {
                    result.push({expCode: self.deliveryInfo.base_info.delivery_request_code, expNo: self.deliveryInfo.base_info.primary_mail_no});
                    self.deliveryInfo.base_info.secondary_mail_no.forEach(function (item) {
                        result.push({expCode: self.deliveryInfo.base_info.delivery_request_code, expNo: item});
                    })
                }
                self.expressNumbers = result;
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>