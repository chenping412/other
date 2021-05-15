<template>
    <div class="price-detail-product" v-loading="loading">
        <div class="clearfix padding-bottom-10">
            <div class="search clearfix left">
                <el-input class="item" v-model="searchForm.type" clearable placeholder="型号"></el-input>
                <el-input class="item" v-model="searchForm.article_number" clearable placeholder="订货号"></el-input>
                <el-select class="item"
                           v-model="searchForm.product_series_id"
                           clearable
                           @change="getListData"
                           placeholder="产品系列">
                    <el-option v-for="item in productSeriesList"
                               :key="item.id"
                               :value="item.id"
                               :label="item.name">
                    </el-option>
                </el-select>

                <el-button class="left" type="primary" @click="getListData">查询</el-button>
                <el-button class="left" type="primary" @click="clickReset()">重置</el-button>
            </div>
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
            <el-table-column prop="type" label="型号"></el-table-column>
            <el-table-column prop="article_number" label="订货号"></el-table-column>
            <el-table-column prop="short_description" label="产品描述" width="200px"></el-table-column>
            <el-table-column label="产品系列">
                <template slot-scope="scope" v-if="scope.row.product_series">
                    {{scope.row.product_series.name}}
                </template>
            </el-table-column>
            <el-table-column prop="gross_weight" label="毛重/kg"></el-table-column>
            <el-table-column prop="net_weight" label="净重/kg"></el-table-column>
            <el-table-column prop="length" label="长/mm"></el-table-column>
            <el-table-column prop="width" label="宽/mm"></el-table-column>
            <el-table-column prop="height" label="高/mm"></el-table-column>
            <el-table-column prop="origin_of_country" label="原产国"></el-table-column>
            <el-table-column prop="ean" label="EAN"></el-table-column>
            <el-table-column prop="upc" label="UPC"></el-table-column>
            <el-table-column label="出口国海关编码">
                <template slot-scope="scope" v-if="scope.row.export_customs_info && scope.row.export_customs_info.hs_base">
                    {{scope.row.export_customs_info.hs_base.hs_code | defaultStr}}
                </template>
            </el-table-column>
            <el-table-column label="扩展信息" show-overflow-tooltip>
                <template slot-scope="scope" v-if="scope.row.additional_info">
                    {{scope.row.additional_info}}
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

                productSeriesList:[],
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
                    this.getProductSeriesListData()
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
                    url: self.$api.new_product_catalog_product_catalog + '/' + self.queryId + '/product/list',
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


            getProductSeriesListData() {
                let self = this;
                self.productSeriesList = [];
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/series',
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.productSeriesList = data.msg;
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
