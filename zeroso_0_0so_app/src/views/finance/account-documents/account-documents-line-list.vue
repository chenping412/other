<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>会计凭证列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="accounting_account_move_line" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="exportDocumentLine()">导出凭证</el-button>
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
                <el-table-column>
                    <template v-slot:header>
                        <ButtonSort label="日期" field_name="invoice_date"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.date}}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>
                        <ButtonSort label="凭证号" field_name="voucher_number"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.voucher_number}}
                    </template>
                </el-table-column>
                <el-table-column label="摘要" prop="comment"></el-table-column>
                <el-table-column label="科目" width="240px">
                    <template slot-scope="scope" v-if="scope.row.account">
                        {{scope.row.account.code}} {{scope.row.account.name}}
                    </template>
                </el-table-column>
                <el-table-column label="辅助科目" prop="assistant_account" width="240px"></el-table-column>
                <el-table-column label="产品名称" width="280px">
                    <template slot-scope="scope" v-if="scope.row.product">
                        {{scope.row.product.brand_name}}, {{scope.row.product.product_name}}, {{scope.row.product.product_order_no}}
                    </template>
                </el-table-column>
                <el-table-column label="产品数量" prop="product_qty"></el-table-column>
                <el-table-column label="业务员">
                    <template slot-scope="scope" v-if="scope.row.in_charge_user">
                        {{scope.row.in_charge_user.name}}
                    </template>
                </el-table-column>
                <el-table-column label="借方金额" prop="debit"></el-table-column>
                <el-table-column label="贷方金额" prop="credit"></el-table-column>

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
                listApi:this.$api.bank_v4_account_move_line + '/search',

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

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
                        key: "accounting_account_move_line"
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

            exportDocumentLine() {
                let self = this;
                let q = window.encodeURIComponent(JSON.stringify({
                    page: self.pageNum,
                    per_page: self.pageSize,
                    filter: self.$utils.formatSearchFilter(self.filter),
                    order_by: self.order_by,
                    key: "accounting_account_move_line"
                }));
                let url = self.$api.bank_v4_account_move_line_export_excel;
                url = `${url}?q=${q}&current_company_id=${self.$store.state.currentCompany.account_company_id}&current_user_id=${self.$store.state.currentCompany.user_id}`;
                window.open(url);
            },

            openDetail(row) {
                let query = {
                    id : row && row.account_move_id ? row.account_move_id : undefined,
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
