<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>银行对账单</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="control-search">
                <div class="control-fast-component">
                    <div class="item">
                        <el-select v-model="searchForm.bank_account_id" clearable @change="getListData">
                            <el-option label="全部账户" value=""></el-option>
                            <el-option v-for="option in selfBankAccountList" :label="option.bank_name" :value="option.id" :key="option.id"></el-option>
                        </el-select>
                    </div>
                    <div class="item">
                        <el-select v-model="searchForm.status" clearable @change="getListData">
                            <el-option label="全部状态" value=""></el-option>
                            <el-option label="打开" :value="true"></el-option>
                            <el-option label="关闭" :value="false"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="openDetail()">新建对账单</el-button>
                </div>
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
                <el-table-column prop="name" label="对账单名"></el-table-column>
                <el-table-column label="期号">
                    <template slot-scope="scope">
                        <span>{{scope.row.start_time | zerosoDateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="货币">
                    <template slot-scope="scope">
                        {{scope.row.currency}}
                    </template>
                </el-table-column>
                <el-table-column prop="start_balance" label="期初余额" align="right"></el-table-column>
                <el-table-column prop="end_balance" label="期末余额" align="right"></el-table-column>
                <el-table-column prop="reference_end_balance" label="参考余额" align="right"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status">打开</el-tag>
                        <el-tag type="danger" v-if="!scope.row.status">关闭</el-tag>
                    </template>
                </el-table-column>
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
                filter: {},

                searchForm:{
                    bank_account_id:'',
                    status:''
                },
                selfBankAccountList:[],
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
            this.getSelfBankAccountList();
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
                    url: self.$api.bank_bank_statement,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        bank_account_id:self.searchForm.bank_account_id || undefined,
                        status:self.searchForm.status === '' ? undefined : self.searchForm.status,
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


            getSelfBankAccountList() {
                let self = this;
                self.$http({
                    url: self.$api.bank_self_bank_account,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg.items) {
                            self.selfBankAccountList=data.msg.items;
                        }
                    }
                })
            },


        }
    }
</script>

<style>

</style>
