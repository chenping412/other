<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>科目设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">科目设置</h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!isEdit">
                                <el-button type="primary" @click="clickEdit()">编辑</el-button>
                            </div>
                            <div v-if="isEdit">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="width: 800px;">
                    <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                             label-width="170px">

                        <div v-for="(item,$index) in formItemConfig" :key="$index">
                            <h3 style="padding:10px 0 10px 50px;">{{item.title}}</h3>
                            <template v-if="item.fields">
                                <el-form-item
                                        v-for="(field,fieldIndex) in item.fields"
                                        :key="fieldIndex"
                                        :label="field.name"
                                        :prop="field.key">
                                    <SelectAccount
                                            v-if="isEdit"
                                            :accountId.sync="detailForm[field.key]"
                                            :option="accountList">
                                    </SelectAccount>
                                    <span v-else class="form-border-bottom">{{detailForm[field.key] | subjectAccount | defaultStr}}</span>
                                </el-form-item>
                            </template>
                        </div>


                    </el-form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    let settingApp;
    export default {
        data() {
            return {

                formItemConfig: [
                    {
                        title: '资金科目',
                        fields: [
                            {
                                name: '银行科目',
                                key: 'bank_account_id'
                            },
                        ]
                    },
                    {
                        title: '往来科目',
                        fields: [
                            {
                                name: '预收科目',
                                key: 'advance_from_customers_account_id'
                            },
                            {
                                name: '预付科目',
                                key: 'advance_from_suppliers_account_id'
                            },
                            {
                                name: '应收科目',
                                key: 'receivable_account_id'
                            },
                            {
                                name: '应付科目',
                                key: 'payable_account_id'
                            },
                            {
                                name: '应付账款-海关关税',
                                key: 'payable_custom_tax_account_id'
                            },
                        ]
                    },
                    {
                        title: '损益科目',
                        fields: [
                            {
                                name: '成本科目',
                                key: 'cost_of_sales_account_id'
                            },
                            {
                                name: '收入科目',
                                key: 'sales_revenue_account_id'
                            },
                        ]
                    },
                    {
                        title: '税率科目',
                        fields: [
                            {
                                name: '进项税科目',
                                key: 'input_tax_account_id'
                            },
                            {
                                name: '销项税科目',
                                key: 'output_tax_account_id'
                            },

                        ]
                    },
                    {
                        title: '物流科目',
                        fields: [
                            {
                                name: '库存商品',
                                key: 'in_stock_account_id'
                            },
                            {
                                name: '库存商品-关税',
                                key: 'in_stock_tax_account_id'
                            },
                        ]
                    },
                    {
                        title: '费用类',
                        fields: [
                            {
                                name: '费用科目',
                                key: 'expense_account_id'
                            },
                            {
                                name: '费用税科目',
                                key: 'expense_tax_account_id'
                            },
                        ]
                    }
                ],

                isEdit: false,

                detailForm: {},
                detailFormRule: {
                    customer_type: [
                        {required: true, message: '请选择客户性质！'}
                    ],
                },

                accountList: [],

                loading: false,


            }
        },
        filters:{
            subjectAccount(value){
                let str=null;
                settingApp.accountList.forEach((item)=>{
                    if(item.id === value){
                        str = item.code + ' ' + item.name;
                    }
                });
                return str || value;
            }
        },
        beforeCreate() {
            settingApp = this;
        },
        created() {
            this.getAccountList();

            this.getDetailData();
        },
        methods: {
            getAccountList() {
                let self = this;
                self.$http({
                    url: self.$api.bank_account,
                    success: function (data) {
                        if (data.msg) {
                            self.accountList = data.msg.items;
                        }
                    }
                });
            },

            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_settings_defaults_accounting,
                    success: function (data) {
                        self.loading = false;
                        self.detailForm = data.msg;
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_v2_self_settings_defaults_accounting,
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function () {
                                self.loading = false;
                                self.isEdit = false;
                                self.getDetailData();
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                            }
                        });
                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },

        }
    }
</script>

<style lang="scss">


</style>
