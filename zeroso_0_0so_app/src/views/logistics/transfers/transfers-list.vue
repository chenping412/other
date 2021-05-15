<template>
    <div class="flex-box-column stockIn-list">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>库存 / 现货调拨</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">

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
                <el-table-column label="订单号" prop="name"></el-table-column>
                <el-table-column label="品牌/brand">
                    <template slot-scope="scope" v-if="scope.row.brand">
                        <p>{{scope.row.brand.name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="销售公司">
                    <template slot-scope="scope" v-if="scope.row.sale">
                        <p>{{scope.row.sale.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="客户">
                    <template slot-scope="scope" v-if="scope.row.customer">
                        <p>{{scope.row.customer.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="报关类型">
                    <template slot-scope="scope" v-if="scope.row.logistics_custom_type">
                        <el-tag type="warning" effect="dark">{{scope.row.logistics_custom_type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.request_state | logisticsV4RequestState}}
                    </template>
                </el-table-column>


            </el-table>
        </div>
        </div>

    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {
                listApi: this.$api.order_request_transfers + '/search',
                filterKey:'logistics_request_transfers',
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
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {

                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.listApi,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        key: self.filterKey,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items) {
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

<style lang="scss">

</style>
