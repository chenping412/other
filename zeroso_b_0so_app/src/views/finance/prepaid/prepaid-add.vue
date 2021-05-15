<template>
    <div class="partner-add">
        <el-button type="primary" @click="add">{{title || '新建付款'}}</el-button>

        <el-dialog :title="title || '新建付款'" :visible.sync="dialogShow" width="900px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款公司或个人" prop="account_company_id">
                            <SelectPartner
                                    :companyId.sync="addForm.account_company_id"
                                    :partnerId.sync="addForm.account_user_id"
                                    :option="addForm.partner?[addForm.partner]:null">
                            </SelectPartner>
                        </el-form-item>
                        <el-form-item label="待付金额" prop="money">
                            <InputNumber :value.sync="addForm.money"></InputNumber>
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
                        <el-form-item label="备注" prop="note">
                            <el-input type="textarea" rows="4" v-model="addForm.note"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="跟进人">
                            {{$store.state.currentCompany.name}}
                        </el-form-item>
                        <el-form-item label="截止日期" prop="due_date">
                            <el-date-picker
                                    v-model="addForm.due_date"
                                    :clearable="false"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="截止日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="附言" prop="comment">
                            <el-input type="textarea" rows="4" v-model="addForm.comment"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['title', 'editForm'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {},
                addFormRule: {
                    account_company_id: [
                        {required: true, message: '请选择收款公司！'}
                    ], money: [
                        {required: true, message: '请输入待付金额！'}
                    ], currency: [
                        {required: true, message: '请选择货币！'}
                    ], due_date: [
                        {required: true, message: '请选择截止日期！'}
                    ],
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            add() {
                if (this.editForm) {
                    this.addForm = {
                        id: this.editForm.id,
                        account_company_id: this.editForm.partner.account_company_id,
                        account_user_id: this.editForm.partner.account_user_id,
                        partner: this.editForm.partner,
                        money: this.editForm.money && Number(this.editForm.money) < 0 ? Number(this.editForm.money) * -1 : '',
                        currency: this.editForm.currency,
                        note: this.editForm.note,
                        due_date: this.editForm.due_date,
                        comment: this.editForm.comment,
                    };
                } else {
                    this.addForm = {
                        account_company_id: null,
                        account_user_id: null,
                        money: '',
                        currency: 'CNY',
                        note: '',
                        due_date: this.$moment().format('YYYY-MM-DD'),
                        comment: '',
                    };
                }

                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },
            edit(item) {
                this.addForm = JSON.parse(JSON.stringify(item));
                this.dialogShow = true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_payment_manual_outbound + (self.addForm.id ? '/' + self.addForm.id : ''),
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    if (!self.addForm.id && data.msg.id) {
                                        let query = {
                                            id: data.msg.id
                                        };
                                        if (self.$route.fullPath.split('?')[1]) query.parentQuery = self.$route.fullPath.split('?')[1];
                                        self.$router.push({
                                            path: '/finance/prepaid/detail',
                                            query: query
                                        });
                                    } else {
                                        self.$emit('update');
                                    }
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
        },
    }
</script>

<style lang="scss" scoped>
    .partner-add {
        display: inline-block;
    }
</style>