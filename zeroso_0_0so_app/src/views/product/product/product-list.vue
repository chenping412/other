<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="product_product" :allow-filter-fields-url="$api.product_common_search_product" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="openDetail()">新增产品</el-button>
                </div>
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
                <el-table-column prop="name" label="品牌">
                    <template slot-scope="scope" v-if="scope.row.brand">
                        <span>{{scope.row.brand.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="product_name" label="型号"></el-table-column>
                <el-table-column prop="product_order_no" label="订货号"></el-table-column>
                <el-table-column prop="country" label="海关编码">
                    <template slot-scope="scope" v-if="scope.row.product_customs_info">
                        <span>{{scope.row.product_customs_info.customs_cn_code}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="品名">
                    <template slot-scope="scope" v-if="scope.row.product_trade_name">
                        <span>{{scope.row.product_trade_name.product_cn_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <ProductState :state="scope.row.state"></ProductState>
                        <ProductType :type="scope.row.type"></ProductType>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="来源">
                    <template slot-scope="scope">
                        <ProductDetailSource :source="scope.row.source"></ProductDetailSource>
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

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                listDataSelection: [],

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
                if(self.getListHttpRequest) self.getListHttpRequest.abort();
                self.loading = true;
                self.getListHttpRequest = self.$http({
                    url: self.$api.product_common_search_product,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "product_product"
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
                let query = {
                    id : row && row.id ? row.id : undefined,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },
        }
    }
</script>

<style>

</style>
