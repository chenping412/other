<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>设置</el-breadcrumb-item>
                    <el-breadcrumb-item>订单设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <h3 slot="header">订单设置</h3>
                <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="150px" style="width: 700px;">
                    <el-form-item label="供应商运费：">
                        <div v-if="!isEdit">
                            <span class="margin-right-10">{{detailForm.supplier_freight}}</span>
                            <span>{{detailForm.supplier_freight_currency}}</span>
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.supplier_freight"></InputNumber>
                            <el-select class="width-120" v-model="detailForm.supplier_freight_currency">
                                <el-option
                                        v-for="item in $store.state.currency"
                                        :key="item.code"
                                        :label="item.code"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="发货运费：">
                        <div v-if="!isEdit">
                            <span class="margin-right-10">{{detailForm.customer_freight}}</span>
                            <span>{{detailForm.customer_freight_currency}}</span>
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.customer_freight"></InputNumber>
                            <el-select class="width-120" v-model="detailForm.customer_freight_currency">
                                <el-option
                                        v-for="item in $store.state.currency"
                                        :key="item.code"
                                        :label="item.code"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="仓库操作费：">
                        <div v-if="!isEdit">
                            <span class="margin-right-10">{{detailForm.warehouse_fee}}</span>
                            <span>{{detailForm.warehouse_currency}}</span>
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.warehouse_fee"></InputNumber>
                            <el-select class="width-120" v-model="detailForm.warehouse_currency">
                                <el-option
                                        v-for="item in $store.state.currency"
                                        :key="item.code"
                                        :label="item.code"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="清关费：">
                        <div v-if="!isEdit">
                            <span class="margin-right-10">{{detailForm.customs_clearance_fee}}</span>
                            <span>{{detailForm.customs_clearance_currency}}</span>
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.customs_clearance_fee"></InputNumber>
                            <el-select class="width-120" v-model="detailForm.customs_clearance_currency">
                                <el-option
                                        v-for="item in $store.state.currency"
                                        :key="item.code"
                                        :label="item.code"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="保险费：">
                        <div v-if="!isEdit">
                            {{detailForm.insurance_rate}}%
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.insurance_rate">
                                <template slot="append">%</template>
                            </InputNumber>
                        </div>
                    </el-form-item>
                    <el-form-item label="换汇费：">
                        <div v-if="!isEdit">
                            {{detailForm.currency_exchange_rate}}%
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.currency_exchange_rate">
                                <template slot="append">%</template>
                            </InputNumber>
                        </div>
                    </el-form-item>
                    <el-form-item label="服务费：">
                        <div v-if="!isEdit">
                            {{detailForm.service_rate}}%
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.service_rate">
                                <template slot="append">%</template>
                            </InputNumber>
                        </div>
                    </el-form-item>
                    <el-form-item label="预付全款优惠率：">
                        <div v-if="!isEdit">
                            {{detailForm.prepayment_discount_rate}}%
                        </div>
                        <div v-else>
                            <InputNumber class="width-200" :value.sync="detailForm.prepayment_discount_rate">
                                <template slot="append">%</template>
                            </InputNumber>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <div v-if="!isEdit">
                            <el-button type="primary" @click="isEdit=true">编 辑</el-button>
                        </div>
                        <div v-else>
                            <el-button type="success" @click="clickSaveDate">保 存</el-button>
                            <el-button @click="isEdit=false">取 消</el-button>
                        </div>

                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>

</template>

<script>

    export default {
        data() {
            return {

                isEdit:false,

                detailForm: {},
                detailFormRule: {

                },

                loading: false,

            }
        },
        created() {
            this.getDetailData();
        },
        methods: {
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_settings_defaults_platform,
                    success: function (data) {
                        self.loading = false;
                        if(data.msg) self.detailForm = data.msg;
                    }
                })
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_v2_self_settings_defaults_platform,
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function () {
                                self.loading = false;
                                self.getDetailData();
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                            }
                        });
                    }
                });
            },

        }
    }
</script>

<style lang="scss">
    .width-200{
        width: 200px !important;
    }
    .width-120{
        width: 120px !important;
    }

</style>
