<template>
    <el-dialog
            :title="'数据统计' + (dataType==='brand'?'-品牌':dataType==='partner'?'-供应商':'')"
            :visible.sync="dialogShow"
            fullscreen
            :close-on-click-modal="false"
            v-loading="loading"
            custom-class="order-data-statistics-model">

        <div class="stat-control">
            <div class="item">
                <span>业务伙伴：</span>
                <SelectPartnerCompanyOnly
                        class="item-input"
                        size="mini"
                        :partnerId.sync="partnerId"
                        :partner.sync="partnerData"
                        :option="partnerId ? [partnerData] : null">
                </SelectPartnerCompanyOnly>
            </div>
            <div class="item">
                <span>品牌：</span>
                <SelectBrand
                        class="item-input"
                        size="mini"
                        :brandId.sync="brandId"
                        :brand.sync="brandData"
                        :option="brandId ? [brandData] : null">
                </SelectBrand>
            </div>
            <div class="item">
                <span>产品：</span>
                <SelectProductSingle
                        class="item-input"
                        size="mini"
                        :disabled="!brandId"
                        :productId.sync="productId"
                        :product.sync="productData"
                        :option="productId ? [productData] : null"
                        :data="brandId ? {brand_name:brandData.name} : null">
                </SelectProductSingle>
            </div>
            <div class="item">
                <span>区间：</span>
                <el-select v-model="period" class="item-input" size="mini">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="一年内" value="one_year"></el-option>
                    <el-option label="as_brand_calc_time" value="加最后统计时间" v-if="isCalcTime"></el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button size="mini" type="primary" @click="selectSearch">搜索</el-button>
            </div>
        </div>

        <el-row :gutter="20" class="border-bottom margin-bottom-10">
            <el-col :span="6">
                <h4 class="small-title">
                    <span>Top供应商</span>
                </h4>
                <el-tabs v-model="supplier_order_type" type="card">
                    <el-tab-pane v-for="item in order_type_list" :key="item.code" :label="item.label"
                                 :name="item.code"></el-tab-pane>
                </el-tabs>
                <el-table :data="supplierList" size="mini" height="190px" v-loading="supplierLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="公司名称">
                        <template slot-scope="scope">
                            {{scope.row.account_company ? scope.row.account_company.company_name : null}}
                        </template>
                    </el-table-column>
                    <el-table-column label="次数" prop="total" width="80px"></el-table-column>
                    <el-table-column width="50px">
                        <template slot-scope="scope" v-if="scope.row.account_company">
                            <router-link target="_blank"
                                         :to="'/partner/detail?id='+scope.row.account_company.account_company_id">
                                <i class="el-icon-tickets"> </i>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="6">
                <h4 class="small-title">
                    <span>Top客户</span>
                </h4>
                <el-tabs v-model="customer_order_type" type="card">
                    <el-tab-pane v-for="item in order_type_list" :key="item.code" :label="item.label"
                                 :name="item.code"></el-tab-pane>
                </el-tabs>
                <el-table :data="customerList" size="mini" height="190px" v-loading="customerLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="公司名称">
                        <template slot-scope="scope">
                            {{scope.row.account_company ? scope.row.account_company.company_name : null}}
                        </template>
                    </el-table-column>
                    <el-table-column label="次数" prop="total" width="80px"></el-table-column>
                    <el-table-column width="50px">
                        <template slot-scope="scope" v-if="scope.row.account_company">
                            <router-link target="_blank"
                                         :to="'/partner/detail?id='+scope.row.account_company.account_company_id">
                                <i class="el-icon-tickets"> </i>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="6">
                <h4 class="small-title">
                    <span>Top品牌</span>
                </h4>
                <el-tabs v-model="brand_order_type" type="card">
                    <el-tab-pane v-for="item in order_type_list" :key="item.code" :label="item.label"
                                 :name="item.code"></el-tab-pane>
                </el-tabs>
                <el-table :data="brandList" size="mini" height="190px" v-loading="brandLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="品牌名称">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.name}}</span>
                            <BrandLever class="right" :state="scope.row.brand.state" size="mini"></BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column label="次数" prop="total" width="80px"></el-table-column>
                    <el-table-column width="50px">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <router-link target="_blank" :to="'/product/brand/detail?id='+scope.row.brand.id">
                                <i class="el-icon-tickets"> </i>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="6">
                <h4 class="small-title">Top产品</h4>
                <el-tabs v-model="product_order_type" type="card">
                    <el-tab-pane v-for="item in order_type_list" :key="item.code" :label="item.label"
                                 :name="item.code"></el-tab-pane>
                </el-tabs>
                <el-table :data="productList" size="mini" height="190px" v-loading="productLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.product">
                            {{scope.row.product.product_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.product">
                            {{scope.row.product.product_order_no}}
                        </template>
                    </el-table-column>
                    <el-table-column label="次数" prop="total" width="80px"></el-table-column>
                    <el-table-column width="50px">
                        <template slot-scope="scope" v-if="scope.row.product">
                            <router-link target="_blank"
                                         :to="'/product/product/detail?id='+scope.row.product.product_id">
                                <i class="el-icon-tickets"> </i>
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>


        <el-row>
            <el-col :span="4">
                <h4 class="small-title">统计信息</h4>
                <OrderDataStatisticsBase
                        v-if="statisticsBaseUrl"
                        :baseUrl="statisticsBaseUrl">
                </OrderDataStatisticsBase>
            </el-col>
            <el-col :span="20">
                <h4 class="small-title">
                    <span>订单记录</span>

                    <el-pagination
                            class="right"
                            @current-change="getOrderList"
                            @size-change="getOrderList"
                            :page-size.sync="pageSize"
                            :current-page.sync="pageNum"
                            :total="totalCount"
                            :page-sizes="$store.state.paginationPageSizes"
                            :layout="$store.state.paginationLayOut"
                            :pager-count="5"
                            background>
                    </el-pagination>
                </h4>
                <el-tabs v-model="order_order_type" type="card">
                    <el-tab-pane v-for="item in order_type_list" :key="item.code" :label="item.label"
                                 :name="item.code"></el-tab-pane>
                </el-tabs>
                <el-table :data="orderList" @row-click="goToOrderDetail" size="mini" height="450px"
                          v-if="!orderLoading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="状态" width="65" v-if="order_order_type!=='perform'">
                        <template slot-scope="scope">
                            <el-tag type="warning" effect="dark" size="mini"
                                    v-if="scope.row.order_base_state==='request_cancelled'">申取
                            </el-tag>
                            <el-tag type="danger" effect="dark" size="mini"
                                    v-if="scope.row.order_base_state==='cancelled'">取
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="报价时间" v-if="order_order_type!=='no_quote'">
                        <template slot-scope="scope">
                            {{scope.row.quoted_time|zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="成单时间" v-if="order_order_type==='perform'">
                        <template slot-scope="scope">
                            {{scope.row.perform_time|zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="询价时间">
                        <template slot-scope="scope">
                            {{scope.row.create_time|zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌">
                        <template slot-scope="scope">
                            {{scope.row.brand ? scope.row.brand.name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="型号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.product ? scope.row.product.product_name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.product ? scope.row.product.product_order_no : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.supplier ? scope.row.supplier.company_name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="客户" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.customer ? scope.row.customer.company_name : ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售订单状态">
                        <template slot-scope="scope">
                            {{scope.row.sale_state|zerosoOrderStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="采购价">
                        <template slot-scope="scope">
                            {{scope.row.supplier_price_unit|isoCurrency(scope.row.supplier_currency)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售价">
                        <template slot-scope="scope">
                            {{scope.row.customer_price_unit|isoCurrency(scope.row.customer_currency)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" prop="qty" width="60px"></el-table-column>
                    <el-table-column label="销售员" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.salesman ? scope.row.salesman.name : ''}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

    </el-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialogShow: false,

                dataType: null,

                partnerData: {},
                partnerId: null,
                brandData: {},
                brandId: null,
                productData: {},
                productId: null,

                period: 'all',

                order_type_list: [
                    {
                        label: '询价',
                        code: 'no_quote'
                    }, {
                        label: '报价',
                        code: 'quoted'
                    }, {
                        label: '成单',
                        code: 'perform'
                    },
                ],

                requestData: {
                    period: 'all',
                },

                statisticsBaseUrl: null,

                supplier_order_type: 'no_quote',
                supplierList: [],
                supplierLoading: false,

                customer_order_type: 'no_quote',
                customerList: [],
                customerLoading: false,

                brand_order_type: 'no_quote',
                brandList: [],
                brandLoading: false,

                product_order_type: 'no_quote',
                productList: [],
                productLoading: false,

                order_order_type: 'no_quote',
                orderList: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,
                orderLoading: false,

                loading: false,

            }
        },
        computed: {
            isCalcTime() {
                return !!(this.brandId && !this.productId);
            },
        },
        watch: {
            isCalcTime(val){
                if (!val) this.period = 'all';
            },
            supplier_order_type: 'getSupplierList',
            customer_order_type: 'getCustomerList',
            brand_order_type: 'getBrandList',
            product_order_type: 'getProductList',
            order_order_type: 'getOrderList',
        },
        created() {

        },
        methods: {
            init(param) {
                this.dataType = param.dataType;

                this.brandData = param.brandData || {};
                this.brandId = param.brandData ? param.brandData.id : null;
                this.partnerData = param.partnerData || {};
                this.partnerId = param.partnerData ? param.partnerData.account_company_id : null;
                this.productData = {};
                this.productId = null;
                this.period = 'all';

                this.supplier_order_type = 'no_quote';
                this.supplierList = [];

                this.customer_order_type = 'no_quote';
                this.customerList = [];

                this.brand_order_type = 'no_quote';
                this.brandList = [];

                this.product_order_type = 'no_quote';
                this.productList = [];

                this.order_order_type = 'no_quote';
                this.orderList = [];

                this.dialogShow = true;

                this.selectSearch();
            },

            selectSearch() {
                this.requestData = {
                    brand_id: this.brandId || undefined,
                    partner_id: this.partnerId || undefined,
                    product_id: this.productId || undefined,
                    period: this.period,
                };
                let url = this.$api.order_v4_order_order_report + '/report_data?period=' + this.period;
                if (this.brandId) url += '&brand_id=' + this.brandId;
                if (this.partnerId) url += '&partner_id=' + this.partnerId;
                if (this.productId) url += '&product_id=' + this.productId;
                this.statisticsBaseUrl = url;

                this.getSupplierList();
                this.getCustomerList();
                this.getBrandList();
                this.getProductList();

                this.pageNum = 1;
                this.getOrderList();
            },
            getSupplierList() {
                let self = this;
                self.supplierLoading = true;
                self.$http({
                    url: self.$api.order_v4_order_order_report + '/recommend_supplier',
                    data: {
                        order_type: self.supplier_order_type,
                        page: 1,
                        per_page: 50,
                        ...self.requestData
                    },
                    success: function (data) {
                        self.supplierLoading = false;
                        if (data.msg && data.msg.items) {
                            self.supplierList = data.msg.items;
                        }
                    }, error() {
                        self.supplierLoading = false;
                    }
                })
            },
            getCustomerList() {
                let self = this;
                self.customerLoading = true;
                self.$http({
                    url: self.$api.order_v4_order_order_report + '/recommend_customer',
                    data: {
                        order_type: self.customer_order_type,
                        page: 1,
                        per_page: 50,
                        ...self.requestData
                    },
                    success: function (data) {
                        self.customerLoading = false;
                        if (data.msg && data.msg.items) {
                            self.customerList = data.msg.items;
                        }
                    }, error() {
                        self.customerLoading = false;
                    }
                })
            },
            getBrandList() {
                let self = this;
                self.brandLoading = true;
                self.$http({
                    url: self.$api.order_v4_order_order_report + '/recommend_brand',
                    data: {
                        order_type: self.brand_order_type,
                        page: 1,
                        per_page: 50,
                        ...self.requestData
                    },
                    success: function (data) {
                        self.brandLoading = false;
                        if (data.msg && data.msg.items) {
                            self.brandList = data.msg.items;
                        }
                    }, error() {
                        self.brandLoading = false;
                    }
                })
            },
            getProductList() {
                let self = this;
                self.productLoading = true;
                self.$http({
                    url: self.$api.order_v4_order_order_report + '/recommend_product',
                    data: {
                        order_type: self.product_order_type,
                        page: 1,
                        per_page: 50,
                        ...self.requestData
                    },
                    success: function (data) {
                        self.productLoading = false;
                        if (data.msg && data.msg.items) {
                            self.productList = data.msg.items;
                        }
                    }, error() {
                        self.productLoading = false;
                    }
                })
            },
            getOrderList() {
                let self = this;
                self.orderLoading = true;
                self.$http({
                    url: self.$api.order_v4_order_order_report + '/report_detail',
                    data: {
                        order_type: self.order_order_type,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        ...self.requestData
                    },
                    success: function (data) {
                        self.orderLoading = false;
                        if (data.msg && data.msg.items) {
                            self.orderList = data.msg.items;
                            self.totalCount = data.msg.total
                        } else {
                            self.orderList = [];
                            self.totalCount = 0;
                        }
                    }, error() {
                        self.orderLoading = false;
                    }
                })
            },
            goToOrderDetail(row) {
                let routeData = this.$router.resolve({
                    path: '/order/order/all/detail',
                    query: {
                        id: row.order_id
                    }
                });
                window.open(routeData.href, '_blank');
            },


        },
    }
</script>

<style lang="scss">
    @import "../../assets/css/config";

    .order-data-statistics-model {
        .el-dialog__header {
            border-bottom: 1px solid $color-border;
            padding: 10px 20px;
        }

        .stat-control {
            padding: 10px;
            border-bottom: 1px solid $color-border;

            .item {
                display: inline-block;
                margin-right: 40px;

                .item-input {
                    display: inline-block;
                    max-width: 200px;
                }
            }
        }

        .small-title {
            padding: 8px 0;
        }

        .el-tabs__header {
            margin-bottom: 5px;
        }

        .el-tabs__item {
            height: 26px;
            line-height: 26px;
            font-size: 12px;
        }

        .el-table--mini th, .el-table--mini td {
            padding: 3px 0;
            font-size: 12px;

            .el-icon-tickets {
                font-size: 14px;
            }
        }
    }
</style>