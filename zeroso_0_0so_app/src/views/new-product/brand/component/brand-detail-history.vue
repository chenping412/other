<template>
    <div class="brand-detail-history">

        <i class="el-icon-s-unfold" style="font-size: 30px;" @click="init"></i>

        <el-dialog :title="'品牌名:'+name" :visible.sync="dialogShow" width="90%" top="30px" :close-on-click-modal="false" v-loading="loading">
            <div class="clearfix">
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
                        <span v-if="scope.row.operator">{{scope.row.operator.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{scope.row.operation_type | brandLevelTagOptType}}
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="从">
                    <template slot-scope="scope">
                        <BrandLever :state="scope.row.from_state"></BrandLever>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="到">
                    <template slot-scope="scope">
                        <BrandLever :state="scope.row.to_state"></BrandLever>
                    </template>
                </el-table-column>
                <el-table-column label="原分级开始时间">
                    <template slot-scope="scope">
                        {{scope.row.origin_state_start_time | zerosoTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="新分级开始时间">
                    <template slot-scope="scope">
                        {{scope.row.new_state_start_time | zerosoTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注" width="300px"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['state','name'],
        data() {
            return {
                queryId: '',

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
                let self = this;
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getListData();
                }
                this.dialogShow = true;
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId + '/state/get_history',
                    type: 'GET',
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        // q: {"key":"product_brand"}
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
        .brand-lever{
            cursor: pointer;
        }
        .el-icon-s-unfold{
            font-size: 30px;
            vertical-align: middle;
            cursor: pointer;
        }
    }
</style>