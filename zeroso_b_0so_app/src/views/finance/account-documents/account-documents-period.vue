<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>会计凭证区间</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <account-documents-period-add-year class="margin-right-10" ref="periodAddYear"
                                                       @update="getListData"></account-documents-period-add-year>

                    <account-documents-period-add-month
                            class="margin-right-10"
                            ref="periodAddMonth"
                            :accountFiscalyearId="accountFiscalyearId"
                            :accountFiscalyearIdList="accountFiscalyearIdList"
                            @update="getListData">
                    </account-documents-period-add-month>


                    <el-button type="primary" @click="clickCreateDocuments">新建凭证</el-button>
                </div>
                <div class="right">
                    <el-select v-model="accountFiscalyearId" @change="getListData">
                        <el-option
                                v-for="(item,$index) in accountFiscalyearIdList"
                                :key="$index"
                                :value="item.id"
                                :label="item.fiscalyear_name">
                        </el-option>
                    </el-select>
                    <el-button @click="clickEditYear">编辑</el-button>
                </div>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="年度会计区间">
                    <template slot-scope="scope" v-if="scope.row.account_fiscalyear">
                        {{scope.row.account_fiscalyear.fiscalyear_name}}
                    </template>
                </el-table-column>
                <el-table-column label="月度会计区间" prop="account_period_name"></el-table-column>
                <el-table-column label="区间范围">
                    <template slot-scope="scope">
                        {{scope.row.date_start}}
                        至
                        {{scope.row.date_end}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.status ? '打开' : '关闭'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400px">
                    <template slot-scope="scope">
                        {{scope.row.date}}
                        <el-button type="primary" size="mini" v-if="scope.row.status" plain
                                   @click.native.stop="clickEditMonth(scope.row)">编辑
                        </el-button>
                        <el-button type="primary" size="mini" v-if="!scope.row.status" plain
                                   @click.native.stop="checkAction(scope.row.id,'OPEN')">打开
                        </el-button>
                        <el-button type="danger" size="mini" v-if="scope.row.status" plain
                                   @click.native.stop="checkAction(scope.row.id,'CLOSE',scope.row.account_period_name)">
                            关闭
                        </el-button>

                        <account-documents-period-third-party :accountPeriodId="scope.row.id"
                                                              :accountPeriodName="scope.row.account_period_name"></account-documents-period-third-party>

                    </template>
                </el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>
    import AccountDocumentsPeriodAddYear from "./component/account-documents-period-add-year";
    import AccountDocumentsPeriodAddMonth from "./component/account-documents-period-add-month";
    import AccountDocumentsPeriodThirdParty from "./component/account-documents-period-third-party";

    export default {
        components: {AccountDocumentsPeriodThirdParty, AccountDocumentsPeriodAddMonth, AccountDocumentsPeriodAddYear},
        data() {
            return {
                accountFiscalyearId: null,
                accountFiscalyearIdList: [],

                listData: [],


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
                this.getAccountFiscalyearIdList();
            },
            //获取列表
            getAccountFiscalyearIdList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_account_fiscalyear,
                    success: function (data) {
                        self.loading = false;
                        self.accountFiscalyearIdList = data.msg.items;
                        if (self.accountFiscalyearIdList.length > 0) {
                            self.accountFiscalyearId = null;
                            let now = new Date().getTime();

                            self.accountFiscalyearIdList.forEach((item) => {
                                if (item.date_start && item.date_end) {
                                    let startTime = new Date(item.date_start).getTime();
                                    let endTime = new Date(item.date_end).getTime();
                                    if (now >= startTime && now <= endTime) {
                                        self.accountFiscalyearId = item.id;
                                    }
                                }
                            });
                            if (!self.accountFiscalyearId) {
                                self.accountFiscalyearId = self.accountFiscalyearIdList[self.accountFiscalyearIdList.length - 1].id;
                            }
                            self.getListData();
                        }
                    }
                })
            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account_period,
                    type: 'GET',
                    data: {
                        account_fiscalyear_id: self.accountFiscalyearId
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.listData = data.msg.items;
                        } else {
                            self.listData = [];
                        }
                    }
                })
            },


            checkAction(id, actionName, account_period_name) {
                let self = this;
                if (actionName === 'CLOSE') {
                    self.$confirm(account_period_name + '区间内凭证需要全部记账，并生成凭证号才能关闭，且本操作无法回退是否继续？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (action) {
                            if (action == 'confirm') {
                                self.actionUpdate(id, actionName)
                            }
                        }
                    });

                } else {
                    self.actionUpdate(id, actionName)
                }
            },
            actionUpdate(id, actionName) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account_period + '/' + id + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        account_period_id: id,
                        action: actionName
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getListData();
                    }
                });
            },

            clickEditYear() {
                let yearItem = {};
                this.accountFiscalyearIdList.forEach((item) => {
                    if (item.id === this.accountFiscalyearId) {
                        yearItem = item;
                    }
                });
                this.$refs.periodAddYear.edit(yearItem)
            },
            clickEditMonth(row) {
                this.$refs.periodAddMonth.edit(row)
            },


            openDetail(row) {
                this.$router.push({
                    path: '/finance/account-documents/list',
                    query: {
                        order_by: encodeURIComponent(JSON.stringify({
                            "field_name": "invoice_date", "by": "desc"
                        })),
                        filter: encodeURIComponent(JSON.stringify([
                            "&",
                            ["invoice_date", '>=', row.date_start],
                            ["invoice_date", '<=', row.date_end]
                        ])),
                    }
                });
            },

            clickCreateDocuments() {
                this.$router.push({
                    path: '/finance/account-documents/detail',
                });
            },

        }
    }
</script>

<style>

</style>
