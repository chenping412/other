<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>应付款项</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="accounting_payment_need_outbound" :allowFilterFieldsUrl="$api.bank_payment_need_outbound" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <prepaid-add @update="init"></prepaid-add>
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
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <el-tag :type=" scope.row.relation_type==='order' ? 'warning' : scope.row.relation_type==='manual' ? 'danger' : null">{{scope.row.relation_type | paymentType}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="单据号"></el-table-column>
                <el-table-column label="收款方">
                    <template slot-scope="scope">
                        {{(scope.row.partner ? scope.row.partner.company_name : '') | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="跟进人">
                    <template slot-scope="scope">
                        {{(scope.row.follower ? scope.row.follower.name : '') | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="待付金额" align="right">
                    <template slot-scope="scope">
                        {{scope.row.money | zerosoAbs | isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column prop="due_date" label="截止日期"></el-table-column>
                <el-table-column prop="state" label="状态">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.state | zerosoBillActionState}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        </div>

    </div>
</template>

<script>

    import PrepaidAdd from "./prepaid-add";
    export default {
        components: {PrepaidAdd},
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
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment_need_outbound,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "accounting_payment_need_outbound"
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items.relations) {
                            self.listData = data.msg.items.relations;
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
