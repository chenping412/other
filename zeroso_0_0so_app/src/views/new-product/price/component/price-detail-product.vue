<template>
    <div class="price-detail-product" v-loading="loading">
        <div class="clearfix padding-bottom-10">
            <!--<div class="search clearfix left">
                <el-input class="item" v-model="searchForm.type" clearable placeholder="型号"></el-input>
                <el-input class="item" v-model="searchForm.article_number" clearable placeholder="订货号"></el-input>
                <el-button class="left" type="primary" @click="getListData">查询</el-button>
                <el-button class="left" type="primary" @click="clickReset()">重置</el-button>
            </div>-->
            <div class="right">
                <el-pagination
                        @current-change="getListData"
                        @size-change="getListData"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNum"
                        :total="totalCount"
                        :layout="$store.state.paginationLayOut"
                        :pager-count="5"
                        background>
                </el-pagination>
            </div>
        </div>
        <el-table :data="listData" border @row-click="openDetail">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="type" label="型号">
                <template slot-scope="scope">
                    {{scope.row.catalog_product.type}}
                </template>
            </el-table-column>
            <el-table-column prop="article_number" label="订货号">
                <template slot-scope="scope">
                    {{scope.row.catalog_product.article_number}}
                </template>
            </el-table-column>
            <el-table-column prop="short_description" label="产品描述">
                <template slot-scope="scope">
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

        </el-table>

    </div>
</template>

<script>

    export default {
        props: ['queryId','brandUid'],
        data() {
            return {
                loading: false,

                searchForm:{
                    type:null,
                    article_number:null,
                    product_series_id:null,
                },
                listData: [],
                pageSize: 50,
                pageNum: 1,
                totalCount: 0,

            }
        },
        watch: {
            queryId() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            clickReset(){
                this.searchForm={
                    type:null,
                    article_number:null,
                    product_series_id:null,
                };
                this.getListData();
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_price_product_catalog + '/' + self.queryId + '/sku/list',
                    type:"POST",
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        type:self.searchForm.type || undefined,
                        article_number:self.searchForm.article_number || undefined,
                        product_series_id:self.searchForm.product_series_id || undefined,
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
                        id:row.catalog_product_uid
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
.price-detail-product{
    .search{
        .item{
            width: 200px;
            float: left;
            margin-right: 20px;
        }
    }
}
</style>
