<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>仓库 / 快递签收</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="openDetail()">创建快递签收</el-button>
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
                <el-table-column label="运单号/trackId" prop="delivery_mail_no"></el-table-column>
                <el-table-column label="包裹重量/packWeight" prop="buy_weight"></el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="供应商/supplier" field_name="partner_company"></ButtonSort>
                    </template>
                    <template slot-scope="scope" v-if="scope.row.partner_company">
                        <p>{{scope.row.partner_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="寄件人/sender" prop="sender_name"></el-table-column>
                <el-table-column label="备注/note" prop="content"></el-table-column>
                <el-table-column label="收货公司/receiving company">
                    <template slot-scope="scope" v-if="scope.row.receive_company">
                        <p>{{scope.row.receive_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="时间/time">
                    <template slot-scope="scope">
                        <p>{{scope.row.create_time | zerosoCompanyTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态/status">
                    <template slot-scope="scope">
                        {{scope.row.status | logisticsV4PackgeState}}
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
                listApi: this.$api.order_delivery_packages + '/search',
                filterKey:'logistics_delivery_packages',
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
                        key: this.filterKey
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

<style>

</style>
