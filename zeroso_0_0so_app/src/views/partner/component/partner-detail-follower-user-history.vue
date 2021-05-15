<template>
    <div class="brand-detail-history inline-block">
        <i class="el-icon-s-unfold" @click="init"></i>

        <el-dialog title="跟进人变更记录" :visible.sync="dialogShow" width="90%" top="30px" :close-on-click-modal="false" v-loading="loading">
            <div class="clearfix">
                <h3 class="left">{{name}}</h3>
                <el-pagination
                        class="right"
                        @current-change="tablePageNumChange"
                        @size-change="tablePageSizeChange"
                        :page-size="pageSize"
                        :current-page="pageNum"
                        :total="totalCount"
                        :page-sizes="$store.state.paginationPageSizes"
                        :layout="$store.state.paginationLayOut"
                        :pager-count="5"
                        background>
                </el-pagination>
            </div>
            <el-table :data="listData" border height="600px">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="operation_time" label="操作时间">
                    <template slot-scope="scope">
                        {{scope.row.operation_time | zerosoTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.operator_user">{{scope.row.operator_user.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="原跟进人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.origin_follower_user">{{scope.row.origin_follower_user.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="新跟进人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.new_follower_user">{{scope.row.new_follower_user.name}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['queryId','name'],
        data() {
            return {
                loading:false,
                dialogShow:false,

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,
            }
        },
        created() {

        },
        methods: {
            init() {
                this.dialogShow = true;
                this.pageNum = 1;
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_v5 + '/' + self.queryId + '/history',
                    type: 'GET',
                    data: {
                        account_company_id: self.queryId,
                        page: self.pageNum,
                        per_page: self.pageSize,
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
            tablePageSizeChange(val) {
                this.pageSize = val;
                this.getListData()
            },
            tablePageNumChange(val) {
                this.pageNum = val;
                this.getListData()
            },
        },
    }
</script>

<style lang="scss">
    .brand-detail-history {
        .el-icon-s-unfold{
            font-size: 30px;
            vertical-align: middle;
            cursor: pointer;
        }
    }
</style>