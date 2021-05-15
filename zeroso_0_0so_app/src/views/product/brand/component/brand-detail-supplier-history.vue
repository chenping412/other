<template>
    <div class="brand-detail-history inline-block">
        <el-button  plain @click="init">查看历史操作记录</el-button>

        <el-dialog title="跟进人变更记录" :visible.sync="dialogShow" width="90%" top="30px" :close-on-click-modal="false" v-loading="loading">
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
            <el-table :data="listData" border size="mini" height="650px">
                <el-table-column type="index" label="序号" width="55"></el-table-column>
                <el-table-column prop="operation_time" label="操作时间" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.operation_time | zerosoTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="150px">
                    <template slot-scope="scope" v-if="scope.row.operator">
                        <span>{{scope.row.operator.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="供应商名称">
                    <template slot-scope="scope" v-if="scope.row.account_company">
                        {{scope.row.account_company.company_name}}
                    </template>
                </el-table-column>
                <el-table-column label="操作类型" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.operation_type | operationType | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="操作前数据">
                    <template slot-scope="scope" v-if="scope.row.operation_type!=='add' && scope.row.origin_data">
                        <div>查价方式：{{scope.row.origin_data.quick_quotate | brandSupplierPriceType}}</div>
                        <div>推荐：{{scope.row.origin_data.is_default ? '是' : '否'}}</div>
                        <div>备注：{{scope.row.origin_data.comment}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作后数据">
                    <template slot-scope="scope" v-if="scope.row.operation_type!=='delete' && scope.row.new_data">
                        <div>查价方式：{{scope.row.new_data.quick_quotate | brandSupplierPriceType}}</div>
                        <div>推荐：{{scope.row.new_data.is_default ? '是' : '否'}}</div>
                        <div>备注：{{scope.row.new_data.comment}}</div>
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
        props: ['queryId'],
        filters:{
            operationType(value){
                let map={
                    add:'添加',
                    delete:'删除',
                    update:'编辑',
                    recommend:'推荐',
                };
                return map[value] || value;
            },
        },
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
                    url: self.$api.product_brand_v5 + '/' + self.queryId + '/suppliers/get_history',
                    type: 'GET',
                    data: {
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