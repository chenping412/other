<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>{{state === 'need_inbound'?'收款记录':'未核销流水'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="'accounting_statement_'+state" :allowFilterFieldsUrl="$api.bank_bank_statement_line_v4 + '/'+this.state" :company_only="true" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="合作伙伴">
                    <template slot-scope="scope" v-if="scope.row.partner_company">
                        <span>{{scope.row.partner_company.company_name | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="partner_bank_account_name" label="对方户名"></el-table-column>
                <el-table-column label="跟进人" width="140">
                    <template slot-scope="scope">
                        {{(scope.row.follower ? scope.row.follower.name : '') | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="收入" align="right" width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.money>=0">{{scope.row.currency | isoCurrency}}</span>
                        <span>{{(scope.row.money>=0 ? scope.row.money : '') | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支出" prop="money" align="right" width="140">
                    <template slot-scope="scope" v-if="scope.row.money<0">
                        <span>{{scope.row.currency | isoCurrency}}</span>
                        <span>{{scope.row.money ? -scope.row.money : ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="left_money" label="未关联金额" align="right" width="140">
                    <template slot-scope="scope">
                        <span>{{scope.row.left_money | isoCurrency(scope.row.currency)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="附言"></el-table-column>
                <el-table-column prop="note" label="摘要"></el-table-column>
                <el-table-column prop="transaction_date" label="交易日期" width="150"></el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    export default {
        components: {

        },
        data() {
            return {
                state:'',

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
                this.state = this.$route.params.state;

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
                    url: self.$api.bank_bank_statement_line_v4 + '/'+this.state,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "accounting_statement_"+this.state
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
                if( this.state==='no_reconciled'){
                    query.noReconciled="true";
                    query.pagerBy= "id";
                }
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
