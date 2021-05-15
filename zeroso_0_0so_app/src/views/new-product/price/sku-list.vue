<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心 / 商品管理 / 价格列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    ref="controlSearch"
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="type" label="型号">
                        <template slot-scope="scope" v-if="scope.row.catalog_product">
                            {{scope.row.catalog_product.type}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="article_number" label="订货号">
                        <template slot-scope="scope" v-if="scope.row.catalog_product">
                            {{scope.row.catalog_product.article_number}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="short_description" label="产品描述">
                        <template slot-scope="scope" v-if="scope.row.catalog_product">
                            {{scope.row.catalog_product.short_description}}
                        </template>
                    </el-table-column>
                    <el-table-column width="900px">
                        <template v-slot:header>
                            <table class="tiered-price-edit-table">
                                <thead>
                                <tr>
                                    <th>最小起订量</th>
                                    <th>价格</th>
                                    <th>折扣</th>
                                    <th>折扣系列</th>
                                    <th>货期</th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <table class="tiered-price-edit-table" v-if="scope.row.sku_list">
                                <tbody>
                                <tr v-for="item in scope.row.sku_list" :key="item.id">
                                    <td>{{item.min_qty}}</td>
                                    <td>{{item.currency | isoCurrency}}{{item.price}}</td>
                                    <td>{{item.discount | tenthsToPercent}}</td>
                                    <td>
                                        <div v-if="item.discount_series">
                                            <span>{{item.discount_series.name}}</span>
                                            <span>({{item.discount_series.discount | tenthsToPercent}})</span>
                                        </div>
                                    </td>
                                    <td>{{item.shipment_period}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.create_time | zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "brand_uid",
                        "type": "new_brand",
                        "translate": "品牌",
                    }, {
                        "field_name": "name_order_no",
                        "type": "string",
                        "translate": "型号或订货号",
                    },{
                        "field_name": "supplier_id",
                        "type": "partner",
                        "translate": "供应商",
                    },
                ],
                allowFilterFieldsMore: [],

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

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
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_price_product_catalog_list,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        ...self.$utils.formatSearchFilterV6(self.filter),
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            openDetail(row) {
                this.$router.push({
                    path: '/new-product/product/detail',
                    query: {
                        id:row.uid
                    }
                });
            },

        }
    }
</script>

<style>

</style>
