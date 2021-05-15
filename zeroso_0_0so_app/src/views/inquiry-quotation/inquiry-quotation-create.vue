<template>
    <div class="flex-box-column inquiry-price-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">询报价单</el-breadcrumb-item>
                    <el-breadcrumb-item>创建询报价单</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-control">
                        <div class="control-btns">
                            <el-button type="success" @click="clickSaveDate()">保存</el-button>
                            <el-button type="primary" plain @click="$router.back()">取消</el-button>
                        </div>
                    </div>
                </div>

                <div class="detail-base-body clearfix">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="9">
                            <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="160px">
                                <el-form-item label="品牌名" prop="brandName">
                                        <AutoCompleteBrand
                                                ref="AutoCompleteBrand"
                                                :brandId="detailForm.brand.id"
                                                :brandName.sync="detailForm.brandName"
                                                @select="brandSelect"
                                                style="width: 50%">
                                        </AutoCompleteBrand>
                                        <span class="right">
                                            <BrandLever :state="detailForm.brand.state"> </BrandLever>
                                            <span class="margin-left-20" v-if="detailForm.brand.country">国家：{{detailForm.brand.country | country}}</span>
                                        </span>
                                </el-form-item>
                                <el-form-item label="联营公司" class="has-no-required-icon" prop="reseller.company.account_company_id">
                                    <SelectPartner
                                            :companyId="detailForm.reseller.company.account_company_id"
                                            :partnerId="detailForm.reseller.user.account_user_id"
                                            :option="detailForm.reseller.company.account_company_id ? [{
                                                account_user_id:detailForm.reseller.user.account_user_id,
                                                name:detailForm.reseller.user.name,
                                                company_name:detailForm.reseller.company.company_name,
                                                account_company_id:detailForm.reseller.company.account_company_id,
                                            }] : null"
                                            @change="resellerChange">
                                        <template slot="append">
                                            <el-button type="primary" @click="clickAddPartner">新增</el-button>
                                        </template>
                                    </SelectPartner>
                                </el-form-item>
                                <el-form-item label="零搜发货方式">
                                    <el-select v-model="detailForm.reseller.delivery_mode">
                                        <el-option v-for="item in $store.state.inquiryDeliveryMode"
                                                   :key="item.code"
                                                   :value="item.code"
                                                   :label="item.label">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="币种">
                                    <span class="form-border-bottom">
                                        {{detailForm.currency_unit.currency}}
                                    </span>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>



                <inquiry-quotation-create-product
                        ref="inquiryPriceDetailProduct"
                        :detailForm="detailForm">
                </inquiry-quotation-create-product>



            </div>
        </div>




    </div>
</template>

<script>
    import Vue from 'vue'
    import InquiryQuotationCreateProduct from "./component/inquiry-quotation-create-product";
    export default {
        name: "inquiry-quotation-create",
        components: {
            InquiryQuotationCreateProduct

        },
        data() {
            let self=this;
            return {
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    brandName: [
                        {required: true, message: '请输入品牌！'}
                    ],
                    'reseller.company.account_company_id': [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.detailForm.reseller.company.account_company_id) {
                                    callback(new Error('请选择联营公司！'));
                                } else if (self.$store.state.zerosoCompany[self.detailForm.reseller.company.account_company_id]) {
                                    callback(new Error('不能选择零搜集团内部公司！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],

                },

                loading: false,

            }
        },
        computed: {

        },
        watch: {

        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                self.detailForm = {
                    brandName: '',
                    "brand": {
                        "agency_state": "",
                        "country": "",
                        "id": "",
                        "name": "",
                        "state": "",
                        "all_products_included": ""
                    },
                    "reseller": {
                        "company": {
                            "account_company_id": "",
                            "company_name": "",
                            "company_type": ""
                        },
                        "delivery_mode": "DIRECT",
                        "user": {
                            "account_user_id": "",
                            "name": ""
                        }
                    },
                    "customer": {
                        "company": {
                            "account_company_id": "",
                            "company_name": "",
                            "company_type": ""
                        },
                        "delivery_mode": "DIRECT",
                        "inquiry_input": {
                            "customer_attachments": {
                                "attached_contract": "",
                                "attached_quote_sheet": ""
                            },
                            "customer_inquiry_no": "",
                            "customer_remarks": ""
                        },
                        "user": {
                            "account_user_id": "",
                            "name": ""
                        }
                    },
                    "currency_unit": {
                        "currency": "EUR",
                        "exchange_rate": ""
                    },
                    "procurement_price": {
                        "additional_charges": {
                            "extra_charges": {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            },
                            "optional_service_fees": {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            },
                            "product_item_based_fees": {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            },
                            "product_weight_based_fees": {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        },
                        "grand_price": null,
                        "total_products_price": null,
                    },
                    "sales_price": {
                        "additional_charges": {
                            "extra_charges": {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            },
                            "optional_service_fees": {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            },
                            "product_item_based_fees": {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            },
                            "product_weight_based_fees": {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        },
                        "grand_price": null,
                        "total_products_price": null,
                    },
                };
                this.brandLeverFilter = Vue.filter('brandLever');
                this.parentQuery = this.$route.query.parentQuery;

                //创建询报价单，默认选择
                self.detailForm.reseller.delivery_mode = "DEMOSTIC";
                self.detailForm.customer.delivery_mode = "DEMOSTIC";
            },

            //保存信息
            clickSaveDate() {
                let self = this;

                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let requestDataForm = JSON.parse(JSON.stringify(self.detailForm));

                        let productListData = self.$refs.inquiryPriceDetailProduct.productListData;
                        if (productListData.length === 0) {
                            self.$message({
                                showClose: true,
                                message: '至少必须添加1个产品信息！',
                                type: 'error'
                            });
                            return
                        }
                        for (let i = 0; i < productListData.length; i++) {
                            if (!productListData[i].product_name) {
                                self.$message({
                                    showClose: true,
                                    message: '部分产品信息不完整：缺少型号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                                    type: 'error'
                                });
                                return
                            }
                            if (!productListData[i].product_order_no) {
                                self.$message({
                                    showClose: true,
                                    message: '部分产品信息不完整：缺少订货号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                                    type: 'error'
                                });
                                return
                            }
                            if (!productListData[i].prodcut_quotation.quantity || productListData[i].prodcut_quotation.quantity === '0') {
                                self.$message({
                                    showClose: true,
                                    message: '部分产品信息不完整：缺少数量！',
                                    type: 'error'
                                });
                                return
                            }
                        }
                        requestDataForm.products = JSON.parse(JSON.stringify(productListData));
                        self.loading = true;
                        self.$http({
                            url: self.$api.inquiry_v6_0_quotations ,
                            type: 'POST' ,
                            requestBody: true,
                            data: requestDataForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.sheet_id) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    let query = JSON.parse(JSON.stringify(self.$route.query));
                                    query.id = data.sheet_id;
                                    self.$router.push({
                                        path: 'detail',
                                        query: query
                                    });
                                }
                            }
                        });

                    }
                });
            },







            brandSelect(item) {
                this.detailForm.brand = {
                    id: item.id,
                    name: item.name,
                    country: item.country,
                    state: item.state,
                    all_products_included: item.all_products_included,
                    agency_state: !item.state ? 'NONE' : item.state === 'agency' ? 'EXCLUSIVE' : 'ORDINARY',
                };
                //“非欧品牌”，“暂不报价” “失效品牌”，“错误品牌” 做特殊提示
                if (item.state && (
                        (['non_eu', 'unquote'].indexOf(item.state) > -1 && (!this.$store.state.settingsDefaults.partner || this.$store.state.settingsDefaults.partner.customer_type!=="ERP" || this.supplierIs0soCompany))
                        || ['inactive', 'invalid'].indexOf(item.state) > -1)) {
                    if (['inactive', 'invalid'].indexOf(item.state) > -1 && item.correct_brand) {
                        this.$confirm(
                                '<p>该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b>，是否选择正确品牌？</p>' +
                                '<p>备注：'+(item.last_history&&item.last_history.comment?item.last_history.comment:'')+'</p>'+
                                '<p>正确品牌：<b>'+item.correct_brand.name+'</b></p>',
                                '提示', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: '选择正确品牌',
                                    cancelButtonText: '取消',
                                    type: 'error'
                                }).then(() => {
                            this.detailForm.brand = {
                                id: item.correct_brand.id,
                                name: item.correct_brand.name,
                                country: item.correct_brand.country,
                                state: item.correct_brand.state,
                                all_products_included: item.correct_brand.all_products_included,
                                agency_state: !item.correct_brand.state ? 'NONE' : item.correct_brand.state === 'agency' ? 'EXCLUSIVE' : 'ORDINARY',
                            };
                            this.$nextTick(() => {
                                this.detailForm.brandName = item.correct_brand.name;
                                this.$refs.inquiryPriceDetailProduct.init();
                            })
                        }).catch(() => {
                            this.detailForm.brand = {
                                id: '',
                                name: '',
                                country: '',
                                state: '',
                                all_products_included: '',
                                agency_state: '',
                            };
                            this.$nextTick(() => {
                                this.detailForm.brandName = '';
                                this.$refs.inquiryPriceDetailProduct.init();
                            })
                        });
                    } else {
                        if (
                                item.state
                                && ['non_eu', 'unquote'].indexOf(item.state) > -1
                                && this.$store.state.settingsDefaults.partner
                                && this.$store.state.settingsDefaults.partner.customer_type==="ERP"
                                && this.supplierIs0soCompany
                        ) {
                            this.$message({
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                message: '<p style="margin-bottom: 5px;">该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b></p>' +
                                        '<p>注意：当品牌为“暂不报价”、“非欧品牌”时，不支持向零搜科技询价，请更换为其他供应商，或更换其他品牌！</p>',
                                type: 'error'
                            });
                        }else {
                            this.$message({
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                duration:5000,
                                message: '<p STYLE="margin-bottom: 5px;">该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b>，不支持询价，请选择其他品牌！</p>' +
                                        '<p>备注：'+(item.last_history&&item.last_history.comment?item.last_history.comment:'')+'</p>',
                                type: 'error'
                            });
                        }
                        this.detailForm.brand = {
                            id: '',
                            name: '',
                            country: '',
                            state: '',
                            all_products_included: '',
                            agency_state: '',
                        };
                        this.$nextTick(() => {
                            this.detailForm.brandName = '';
                            this.$refs.inquiryPriceDetailProduct.init();
                        })
                    }
                }
                this.$refs.inquiryPriceDetailProduct.init();
            },


            resellerChange(value, item) {
                this.detailForm.reseller.company = {
                    "account_company_id": item.account_company_id,
                    "company_name": item.company_name,
                    "company_type": item.company_type,
                };
                this.detailForm.reseller.user = {
                    "account_user_id": item.account_user_id,
                    "name": item.name,
                };
                this.$refs.form.validateField(['reseller.company.account_company_id']);
            },



            clickAddPartner() {
                window.open('#/partner/list?showAdd=true')
            },
        }
    }
</script>

<style scoped>

</style>