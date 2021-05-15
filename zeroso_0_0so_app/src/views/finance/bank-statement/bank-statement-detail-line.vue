<template>
    <el-card class="bank-statement-detail-line">
        <div slot="header" class="clearfix">
            <div class="left">
                <el-select v-model="searchForm.is_pay" :disabled="isEdit" @change="getBankStatementLine">
                    <el-option label="全部收支" value=""></el-option>
                    <el-option label="收入" :value="false"></el-option>
                    <el-option label="支出" :value="true"></el-option>
                </el-select>
                <el-select class="margin-left-10" v-model="searchForm.reconsiled" :disabled="isEdit"
                           @change="getBankStatementLine">
                    <el-option label="全部状态" value=""></el-option>
                    <el-option
                            v-for="item in $store.state.bankStatementLineReconsiled"
                            :label="item.label"
                            :value="item.code"
                            :key="item.code"></el-option>
                </el-select>
            </div>
            <div class="right">
                <div v-if="!isEdit">
                    <el-button type="primary" v-if="status" @click="clickEdit()">编辑</el-button>
                </div>
                <div v-if="isEdit">
                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                </div>
            </div>
        </div>

        <el-table v-if="!isEdit" :data="bankStatementLine" @row-click="openDetail" :row-class-name="tableRowClassName" border v-loading="loading">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.is_reconsiled ? '已核销' : '未核销'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="partner_company_name" label="合作伙伴"></el-table-column>
            <el-table-column label="收入" align="right">
                <template slot-scope="scope">
                    <span>{{(scope.row.money>=0 ? scope.row.money : '') | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="支出" prop="money" align="right">
                <template slot-scope="scope" v-if="scope.row.money<0">
                    <span>{{(scope.row.money ? -scope.row.money : '') | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="left_money" label="待关联金额" align="right">
                <template slot-scope="scope">
                    <span>{{scope.row.left_money | zerosoAbs}}</span>
                </template>
            </el-table-column>
            <el-table-column label="交易日期">
                <template slot-scope="scope">
                    <span>{{scope.row.transaction_date}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="附言"></el-table-column>
            <el-table-column prop="note" label="摘要"></el-table-column>
        </el-table>
        <div v-if="isEdit">
            <table class="table">
                <thead>
                <tr>
                    <th width="50px">序号</th>
                    <th>合作伙伴</th>
                    <th>收入</th>
                    <th>支出</th>
                    <th>交易日期</th>
                    <th>对方户名</th>
                    <th>附言</th>
                    <th>摘要</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody class="el-input--small">
                <tr v-for="(row,$index) in bankStatementLine" :key="$index">
                    <td>{{$index+1}}</td>
                    <td>
                        <SelectPartnerCompanyOnly
                                :partnerId.sync="row.partner_company_id"
                                :partner.sync="row.partner_company"
                                :option="row.partner_company_id ? [row.partner_company] : null"
                                @change="partnerChange(row)"
                        ></SelectPartnerCompanyOnly>
                    </td>
                    <td>
                        <input class="el-input__inner" v-model="row.income" type="number" :disabled="!!row.expenditure"
                               @input="moneyChange(row)"/>
                    </td>
                    <td>
                        <input class="el-input__inner" v-model="row.expenditure" type="number" :disabled="!!row.income"
                               @input="moneyChange(row)"/>
                    </td>
                    <td>
                        <el-date-picker
                                v-model="row.transaction_date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="交易日期" style="width: 100%;">
                        </el-date-picker>
                    </td>
                    <td>
                        <input class="el-input__inner" v-model="row.partner_bank_account_name"/>
                    </td>
                    <td>
                        <input class="el-input__inner" v-model="row.comment"/>
                    </td>
                    <td>
                        <input class="el-input__inner" v-model="row.note"/>
                    </td>
                    <td>
                        <button class="el-button el-button--danger el-button--mini" v-if="isEdit && !row.id"
                                @click="clickDeleteAdd(row)">删除
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>


            <div class="padding-top-10">
                <el-button type="primary" @click="clickAdd">添 加</el-button>
            </div>
        </div>


    </el-card>
</template>

<script>


    export default {
        components: {},
        props: ['queryId', 'bankStatementLineMoney', 'status','statementLineId'],
        data() {
            return {
                isEdit: false,

                searchForm: {
                    is_pay: '',
                    reconsiled: '',
                },
                bankStatementLine: [],


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
                this.getBankStatementLine();
            },

            getBankStatementLine() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_line,
                    data: {
                        bank_statement_id: self.queryId,
                        is_pay: self.searchForm.is_pay === '' ? undefined : self.searchForm.is_pay,
                        reconsiled: self.searchForm.reconsiled === '' ? undefined : self.searchForm.reconsiled,
                        is_reconsiled: self.searchForm.reconsiled === '' ? undefined : self.searchForm.reconsiled === 'yes',
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            for (let i = 0; i < data.msg.items.length; i++) {
                                if (data.msg.items[i].money >= 0) {
                                    data.msg.items[i].income = data.msg.items[i].money
                                } else {
                                    data.msg.items[i].expenditure = -data.msg.items[i].money
                                }
                            }
                            self.bankStatementLine = data.msg.items;
                        } else {
                            self.bankStatementLine = [];
                        }
                        self.computedMoney();
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            clickAdd() {
                this.bankStatementLine.push({
                    bank_statement_id: this.queryId,
                    transaction_date: this.$utils.getDate(),
                })
                this.computedMoney();
            },
            //点击保存
            clickSaveDate() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement_line + '/multi',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        items: self.bankStatementLine
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.clickCancelEdit();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getBankStatementLine()
            },
            clickDeleteAdd(item) {
                this.bankStatementLine.splice(this.bankStatementLine.indexOf(item), 1);
                this.computedMoney();
            },


            partnerChange(row) {
                row.partner_bank_account_name = row.partner_company.company_name;
                row.partner_company_name = row.partner_company.company_name;
            },
            moneyChange(row) {
                if (row.income) {
                    row.money = row.income;
                } else if (row.expenditure) {
                    row.money = -(row.expenditure * 1);
                } else {
                    row.money = '';
                }
                this.computedMoney();
            },
            computedMoney() {
                let m = 0;
                this.bankStatementLine.forEach((item) => {
                    if (item.money) {
                        m += item.money * 1
                    }
                })
                console.log(m)
                this.$emit('update:bankStatementLineMoney', m);
            },

            openDetail(row) {
                this.$router.push({
                    path: '/finance/bank-statement-line/no_reconciled/detail',
                    query: {
                        id: row.id,
                        bank_statement_id: row.bank_statement_id,
                    }
                });
            },


            tableRowClassName({row}){
                return this.statementLineId == row.id ? 'table-active' : null;
            }
        }
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";

    .bank-statement-detail-line {
        .table-active{
            td{
                background: #f2b4b4 !important;
            }
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;

            th {
                background-color: $color-background;
            }

            th, td {
                border: 1px solid $color-border;
                padding: 8px 10px;

                .el-input__inner:disabled {
                    background-color: #F5F7FA;
                    border-color: #E4E7ED;
                    color: #C0C4CC;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
