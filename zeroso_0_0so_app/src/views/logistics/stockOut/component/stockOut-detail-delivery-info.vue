<template>
    <div>
        <el-card class="margin-bottom-20" v-if="detailForm.delivery_info">
            <h3 slot="header">快递信息</h3>
            <el-form label-width="180px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="快递公司：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.delivery_company|logisticsV4DeliveryCompany}}
                            </span>
                        </el-form-item>
                        <el-form-item label="快递类型：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.delivery_type_id | deliveryTypes}}
                            </span>
                        </el-form-item>
                        <el-form-item label="包裹数量：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.package_total | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="物流单号：">
                            <span class="form-border-bottom">
                                <PrintSfExpressTicket
                                        :delivery-info="detailForm.delivery_info"
                                        :currentMailNo="detailForm.delivery_info.primary_mail_no"
                                        :from-company-name="detailForm.sale_company?detailForm.sale_company.company_name:detailForm.belong_to_company?detailForm.belong_to_company.company_name:null"
                                        :from-address="detailForm.from_address"
                                        :to-company-name="detailForm.send_to_company.company_name"
                                        :to-address="detailForm.to_address">
                                </PrintSfExpressTicket>
                            </span>
                        </el-form-item>

                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="月结账号：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.customer_pay_code | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="付款方式：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.payment_type | deliveryPaymentTypes}}
                            </span>
                        </el-form-item>
                        <el-form-item label="保 价：">
                            <span class="form-border-bottom">
                                {{detailForm.delivery_info.insurance_price | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="物流子单号：">
                            <span class="form-border-bottom" v-if="detailForm.delivery_info.secondary_mail_no">
                                <span class="margin-right-10" v-for="(mailNo,$index) in detailForm.delivery_info.secondary_mail_no" :key="$index">
                                    <PrintSfExpressTicket
                                            :delivery-info="detailForm.delivery_info"
                                            :currentMailNo="mailNo"
                                            :from-company-name="detailForm.sale_company?detailForm.sale_company.company_name:detailForm.belong_to_company?detailForm.belong_to_company.company_name:null"
                                            :from-address="detailForm.from_address"
                                            :to-company-name="detailForm.send_to_company.company_name"
                                            :to-address="detailForm.to_address">
                                </PrintSfExpressTicket>
                                </span>
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card class="margin-bottom-20" v-if="detailForm.delivery_info && detailForm.state === 'cargo_send'">
            <h3 slot="header">物流日志</h3>

            <el-tag type="warning" v-if="detailForm.delivery_info.primary_mail_no">{{detailForm.delivery_info.primary_mail_no}}</el-tag>
        </el-card>

    </div>
</template>

<script>
    export default {
        props: ['detailForm'],
        data() {
            return {


            }
        },
        created() {

        },
        methods: {

        },
    }
</script>

<style lang="scss" scoped>

</style>