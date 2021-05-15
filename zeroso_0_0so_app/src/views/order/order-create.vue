<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="'list'">订单</el-breadcrumb-item>
                    <el-breadcrumb-item>创建订单</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span>添加订单</span>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <el-button type="success" @click="clickSaveDate">提交</el-button>
                            <el-button @click="$router.back()">取消</el-button>
                        </div>
                    </div>
                </div>

                <div class="detail-base-body">
                    <el-form ref="detailForm" :model="detailForm" :rules="detailFormRule" label-width="120px">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="品牌" prop="base_info.brand_name">
                                    <AutoCompleteBrand
                                            ref="AutoCompleteBrand"
                                            :brandName.sync="detailForm.base_info.brand_name"
                                            @select="brandSelect"
                                            style="width: 100%;">
                                    </AutoCompleteBrand>
                                </el-form-item>
                                <el-form-item label="采购公司" prop="node_info.purchase.account_company_id">
                                    <SelectPartner
                                            :partner.sync="detailForm.node_info.purchase"
                                            @change="$refs.detailForm.validate()"
                                            placeholder="请输入采购公司信息">
                                        <template slot="append">
                                            <el-button type="primary" @click="clickAddPartner">新增</el-button>
                                        </template>
                                    </SelectPartner>
                                </el-form-item>
                                <el-form-item label="我">
                                    <SelectPartner
                                            :partner.sync="detailForm.node_info.my"
                                            :option="[detailForm.node_info.my]"
                                            :disabled="true">
                                    </SelectPartner>
                                </el-form-item>
                                <el-form-item label="客户" prop="node_info.customer.account_company_id">
                                    <SelectPartner
                                            :partner.sync="detailForm.node_info.customer"
                                            :autoGetNormal="true"
                                            @change="$refs.detailForm.validate()"
                                            placeholder="请输入客户公司名称">
                                        <template slot="append">
                                            <el-button type="primary" @click="clickAddPartner">新增</el-button>
                                        </template>
                                    </SelectPartner>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="询价优先级" prop="base_info.inquiry_priority">
                                    <el-select v-model="detailForm.base_info.inquiry_priority">
                                        <el-option
                                                v-for="(item,$index) in $store.state.orderInquiryPriority"
                                                :key="$index"
                                                :value="item.code"
                                                :label="item.label">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="询价单号">
                                    <el-input v-model="detailForm.base_info.offer_num" placeholder="请输入询价单号"></el-input>
                                </el-form-item>
                                <el-form-item label="客户备注">
                                    <el-input v-model="detailForm.base_info.customer_comment" placeholder="请输入客户备注"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>

            <order-detail-product
                    ref="orderDetailProduct"
                    :isCreate="true"
                    :orderData.sync="detailForm">
            </order-detail-product>

        </div>
    </div>
</template>

<script>
    import OrderDetailProduct from "./component/order-detail-product";

    export default {
        components: {
            OrderDetailProduct,
        },
        data() {
            let self=this;
            return {
                detailForm: {},
                detailFormRule: {
                    "base_info.brand_name": [
                        {required: true, message: '请输入品牌！'}
                    ],
                    "node_info.purchase.account_company_id": [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && !self.detailForm.node_info.customer.account_company_id) {
                                    callback(new Error('采购公司和客户至少需要输入一项'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    "node_info.customer.account_company_id": [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && !self.detailForm.node_info.purchase.account_company_id) {
                                    callback(new Error('采购公司和客户至少需要输入一项'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    "base_info.inquiry_priority": [
                        {required: true, message: '请选择询价优先级！'}
                    ],
                },

                loading: false,
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                let myCompany = JSON.parse(JSON.stringify(this.$store.state.currentCompany));
                myCompany.account_user_id = myCompany.user_id;
                this.detailForm = {
                    "base_info": {
                        "brand_name": null,
                        "customer_comment": '',
                        "offer_num": '',
                        "inquiry_priority": 'middle',
                    },
                    "node_info": {
                        "purchase": {},
                        "my": myCompany,
                        "customer": {}
                    },
                    "order_products": [],
                    view_control:{},
                }
            },
            //保存信息
            clickSaveDate() {
                let self = this;
                self.$refs.detailForm.validate(function (valid) {
                    if (valid) {
                        let orderDetailProducts = self.$refs.orderDetailProduct.origin_orders[0].order_products;
                        let submitData = {
                            base_info: self.detailForm.base_info,
                            node_info: JSON.parse(JSON.stringify(self.detailForm.node_info)),
                            order_products: [],
                        };
                        if(submitData.node_info.purchase && !submitData.node_info.purchase.account_company_id) submitData.node_info.purchase = undefined;
                        if(submitData.node_info.customer && !submitData.node_info.customer.account_company_id) submitData.node_info.customer = undefined;

                        for (let i = 0; i < orderDetailProducts.length; i++) {
                            let row = orderDetailProducts[i];

                            if (!row.validate) {
                                self.$message({
                                    showClose: true,
                                    message: '请选择产品型号或订货号',
                                    type: 'error'
                                });
                                return
                            }
                            if (!row.qty && row.qty !== 0) {
                                self.$message({
                                    showClose: true,
                                    message: '请填写数量',
                                    type: 'error'
                                });
                                return
                            }

                            row.product.id = row.id;
                            row.product.is_active = row.is_active;
                            row.product.comment = row.comment;
                            row.product.forecast_import_tariff = row.forecast_import_tariff;
                            row.product.qty = row.qty;
                            if (row.order_lines && row.order_lines[0]) {
                                row.product.shipment_period = row.order_lines[0].shipment_period;
                                row.product.price_unit = row.order_lines[0].price_unit;
                                row.product.price_taxed_unit = row.order_lines[0].price_taxed_unit;
                            }
                            submitData.order_products.push({
                                product_id: row.product.product_id,
                                product_name: row.product.product_name,
                                product_order_no: row.product.product_order_no,
                                product_parameters: row.product.product_parameter,
                                comment: row.comment,
                                weight: row.product.gross_weight,
                                net_weight: row.product.net_weight,
                                forecast_import_tariff: row.forecast_import_tariff,
                                qty: row.qty,
                            });
                        }
                        self.loading = true;
                        self.$http({
                            url: self.$api.order_order_orders,
                            type: 'POST',
                            requestBody: true,
                            data: submitData,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    let query = JSON.parse(JSON.stringify(self.$route.query));
                                    query.id = data.msg.id;
                                    self.$router.push({
                                        path: 'detail',
                                        query: query
                                    });
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: data.errorMsg + '',
                                        type: 'error'
                                    });
                                }
                            }
                        });

                    }
                });
            },

            brandSelect(item) {
                this.detailForm.brand = JSON.parse(JSON.stringify(item));
                this.$refs.orderDetailProduct.init();
            },


            clickAddPartner() {
                window.open('#/partner/list?showAdd=true')
            },

        }
    }
</script>

<style lang="scss">


</style>
