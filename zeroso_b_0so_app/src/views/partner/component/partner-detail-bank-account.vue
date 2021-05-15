<template>
    <div class="partner-detail-partner-addresses clearfix" v-loading="loading">

        <div class="clearfix">
            <el-form class="padding-top-20" style="width: 40%" :model="financeForm" :rules="financeFormRule" ref="financeForm" label-width="150px">
                <el-form-item label="纳税人识别号：" prop="taxpayer_code">
                    <el-input v-if="financeEdit" v-model="financeForm.taxpayer_code"></el-input>
                    <span v-else class="form-border-bottom">{{financeForm.taxpayer_code | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="开户行：" prop="bank_name">
                    <el-input v-if="financeEdit" v-model="financeForm.bank_name"></el-input>
                    <span v-else class="form-border-bottom">{{financeForm.bank_name | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="帐号：" prop="bank_account">
                    <el-input v-if="financeEdit" v-model="financeForm.bank_account"></el-input>
                    <span v-else class="form-border-bottom">{{financeForm.bank_account | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="电话：" prop="invoice_phone">
                    <el-input v-if="financeEdit" v-model="financeForm.invoice_phone"></el-input>
                    <span v-else class="form-border-bottom">{{financeForm.invoice_phone | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="地址：" prop="invoice_address">
                    <el-input v-if="financeEdit" v-model="financeForm.invoice_address"></el-input>
                    <span v-else class="form-border-bottom">{{financeForm.invoice_address | defaultStr}}</span>
                </el-form-item>
                <el-form-item>
                    <div v-if="!financeEdit">
                        <el-button type="primary" @click="financeEdit=true">编辑</el-button>
                    </div>
                    <div v-if="financeEdit">
                        <el-button type="success" @click="clickSaveEditFinanceForm()">保存</el-button>
                        <el-button type="primary" plain @click="clickCancelEditFinanceForm()">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div class="bot">
            <el-divider></el-divider>
            <h4 class="padding-bottom-10">银行账户</h4>
            <el-table :data="listData" border>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="bank_code" label="开户行"></el-table-column>
                <el-table-column prop="bank_name" label="开户行全称"></el-table-column>
                <el-table-column prop="account_name" label="开户名"></el-table-column>
                <el-table-column prop="account_number" label="账号"></el-table-column>
                <el-table-column label="国家">
                    <template slot-scope="scope">
                        {{scope.row.country | country}}
                    </template>
                </el-table-column>
                <el-table-column label="iban">
                    <template slot-scope="scope">
                        <i class="el-icon-check" style="font-size: 20px;" v-if="scope.row.is_iban"></i>
                        <i class="el-icon-close" style="font-size: 20px;" v-if="!scope.row.is_iban"></i>
                    </template>
                </el-table-column>
                <el-table-column label="主账号">
                    <template slot-scope="scope">
                        <i class="el-icon-check" style="font-size: 20px;" v-if="scope.row.is_primary"></i>
                        <i class="el-icon-close" style="font-size: 20px;" v-if="!scope.row.is_primary"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="bank_type" label="类型">
                    <template slot-scope="scope">
                        {{scope.row.bank_type | bankType}}
                    </template>
                </el-table-column>
                <el-table-column label="货币">
                    <template slot-scope="scope">
                        {{scope.row.currency | currency}}
                    </template>
                </el-table-column>
                <el-table-column prop="bic_code" label="SWIFT"></el-table-column>
                <el-table-column prop="address" label="银行地址"></el-table-column>
                <el-table-column width="150px">
                    <template slot-scope="scope">
                        <ButtonEdit type="primary" size="mini" @click="clickEdit(scope.row)">编辑</ButtonEdit>
                        <ButtonDelete type="danger" size="mini" @click="clickDelete(scope.row.id)">删除</ButtonDelete>
                    </template>
                </el-table-column>
            </el-table>
            <div class="padding-top-10">
                <el-button type="primary" @click="clickAdd()">新增银行账户</el-button>
            </div>


            <el-dialog title="银行账户操作" :visible.sync="dialogShow" width="700px" top="50px" :close-on-click-modal="false"
                       v-loading="loading">
                <el-form class="clearfix" :model="addForm" :rules="addFormRule" ref="form" label-width="110px" v-if="dialogShow">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行" prop="bank_code" v-if="companyCountryIsCN">
                        <el-select v-model="addForm.bank_code" filterable>
                            <el-option
                                    v-for="item in $store.state.bank_codes"
                                    :key="item"
                                    :value="item"
                                    :label="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开户行全称" prop="bank_name">
                        <el-input v-model="addForm.bank_name"></el-input>
                    </el-form-item>
                    <el-form-item label="开户名" prop="account_name">
                        <el-input v-model="addForm.account_name"></el-input>
                    </el-form-item>
                    <el-form-item label="账号" prop="account_number">
                        <el-input v-model="addForm.account_number"></el-input>
                    </el-form-item>
                    <el-form-item label="国家" prop="country">
                        <el-select v-model="addForm.country">
                            <el-option
                                    v-for="item in $store.state.country"
                                    :key="item.code2"
                                    :value="item.code2"
                                    :label="item.chinese_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="iban">
                        <el-checkbox v-model="addForm.is_iban">iban</el-checkbox>
                    </el-form-item>
                    <el-form-item label="主账号">
                        <el-checkbox v-model="addForm.is_primary">主账号</el-checkbox>
                    </el-form-item>
                    <el-form-item label="类型" prop="bank_type">
                        <el-select v-model="addForm.bank_type">
                            <el-option
                                    v-for="item in $store.state.bankType"
                                    :key="item.code"
                                    :value="item.code"
                                    :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="货币" prop="currency">
                        <el-select v-model="addForm.currency">
                            <el-option
                                    v-for="item in $store.state.currency"
                                    :key="item.code"
                                    :value="item.code"
                                    :label="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="SWIFT" :prop="!companyCountryIsCN ? 'bic_code' : null">
                        <el-input v-model="addForm.bic_code"></el-input>
                    </el-form-item>
                    <el-form-item label="银行地址">
                        <el-input v-model="addForm.address"></el-input>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                    <el-button @click="dialogShow = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['queryId','companyDetail'],
        data() {
            return {
                loading: false,

                financeEdit:false,
                financeForm:{},
                financeFormRule: {
                    name: [
                        {required: true, message: '请输入名称！'}
                    ],
                },

                listData: [],

                dialogShow: false,
                addForm: {},
                addFormRule: {
                    name: [
                        {required: true, message: '请输入名称！'}
                    ],
                    bank_code: [
                        {required: true, message: '请选择开户行！'}
                    ],
                    bank_name: [
                        {required: true, message: '请输入开户行全称！'}
                    ],account_name: [
                        {required: true, message: '请输入开户名！'}
                    ],account_number: [
                        {required: true, message: '请输入账号！'}
                    ],country: [
                        {required: true, message: '请选择国家！'}
                    ],bank_type: [
                        {required: true, message: '请选择类型！'}
                    ],currency: [
                        {required: true, message: '请选择货币！'}
                    ],bic_code: [
                        {required: true, message: '非中国银行账户必须填写SWIFT！'}
                    ],
                },

                companyCountryIsCN:true,

            }
        },
        watch: {
            queryId () {
                this.init()
            },
            companyDetail(){
                this.companyDetailInit();
            },
            dialogShow(val){
                if(!val){
                    this.$refs.form.clearValidate()
                }
            },
            'addForm.country'(){
                this.companyCountryIsCN = this.addForm.country && this.addForm.country==='CN';
            }
        },
        created() {
            this.init();
            this.companyDetailInit();
        },
        methods: {
            companyDetailInit(){
                this.financeForm = this.companyDetail || {};
            },

            //取消编辑财务信息
            clickCancelEditFinanceForm(){
                this.financeEdit = false;
                this.$emit('updateDetail');
            },
            //保存财务信息
            clickSaveEditFinanceForm(){
                let self = this;
                self.$refs.financeForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_detail + '/' + self.queryId+'/finance',
                            type: 'PUT',
                            requestBody: true,
                            data: self.financeForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.financeEdit = false;
                                    self.$emit('updateDetail');
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },



            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account_partner + '/' + self.queryId,
                    data:{
                        page:1,
                        per_page:1000
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        }
                    }
                })
            },
            //新建
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    company_id: this.queryId,
                    account_company_id: this.queryId,
                    account_name:this.financeForm.name,
                    country:this.financeForm.country,
                    currency:this.companyCountryIsCN ? 'CNY' : 'EUR',
                    bank_type:'public',
                }
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(item));
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.bank_account_update+'/'+self.addForm.id : self.$api.bank_account_partner + '/' + self.queryId,
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && (data.msg.updated || data.msg.id)) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    self.getListData();
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
            //删除
            clickDelete(id){
                let self = this;
                self.$confirm('确认删除该银行账户吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_account_update + '/' + id,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg && data.msg.deleted) {
                                        self.$message({
                                            showClose: true,
                                            message: '删除成功！',
                                            type: 'success'
                                        });
                                        self.dialogShow = false;
                                        self.getListData();
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '操作失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .partner-detail-partner-addresses {
        padding-bottom: 100px;
    }

</style>
