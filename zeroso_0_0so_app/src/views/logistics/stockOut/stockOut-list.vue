<template>
    <div class="flex-box-column stockIn-list">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>库存 / 出库单列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">
                    <box-add class="margin-right-10" title="新建箱" v-if="$store.state.permissionsMap['StockBoxManageNeed']"></box-add>
                    <pallets-add class="margin-right-10" title="新建托盘"></pallets-add>
                    <stock-out-add title="新建出库单"></stock-out-add>
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
                <el-table-column label="出库单号" prop="outgoing_transfer_name"></el-table-column>
                <el-table-column label="发货仓库">
                    <template slot-scope="scope" v-if="scope.row.belong_to_company">
                        <p>{{scope.row.belong_to_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="销售公司">
                    <template slot-scope="scope" v-if="scope.row.sale_company">
                        <p>{{scope.row.sale_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="下一节点">
                    <template slot-scope="scope" v-if="scope.row.send_to_company">
                        <p>{{scope.row.send_to_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state | logisticsV4StockOutState}}
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

    import StockOutAdd from "./component/stockOut-add";
    import BoxAdd from "../box/box-add";
    import PalletsAdd from "../pallets/pallets-add";
    export default {
        components: {PalletsAdd, BoxAdd, StockOutAdd},
        data() {
            return {
                listApi: this.$api.order_outgoing_transfers + '/search',
                filterKey:'logistics_outgoing_transfers',
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
