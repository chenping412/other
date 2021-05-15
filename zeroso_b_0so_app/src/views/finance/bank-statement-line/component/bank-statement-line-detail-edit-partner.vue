<template>
    <el-popover
            v-model="popover"
            trigger="manual"
            placement="bottom"
            width="400">
        <i slot="reference" class="el-icon-edit el-icon-normal cursor-pointer" @click="popoverShow"></i>
        <div class="padding-20" v-loading="loading">
            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="80px">
                <el-form-item label="合作伙伴" prop="partner_company_id">
                    <SelectPartnerCompanyOnly
                            :partnerId.sync="editPriceForm.partner_company_id"
                            :partner.sync="editPriceForm.partner_company"
                            :option="editPriceForm.partner_company_id ? [editPriceForm.partner_company] : null">
                    </SelectPartnerCompanyOnly>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="clickSaveEdit">提交</el-button>
                    <el-button size="mini" @click="popover=false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-popover>
</template>

<script>

    export default {
        props: ['bankStatementLine'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    id: null,
                    partner_company_id: null,
                    partner_company: null,
                },
                editPriceFormRule: {
                    partner_company_id: [
                        {required: true, message: '请选择合作伙伴！', trigger: 'blur'}
                    ],
                },


            }
        },
        methods: {
            popoverShow() {
                this.editPriceForm = {
                    id: this.bankStatementLine.id,
                    partner_company_id: this.bankStatementLine.partner_company_id,
                    partner_company: this.bankStatementLine.partner_company,
                };
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.$http({
                            url: self.$api.bank_bank_statement_line_v4 + '/' + self.editPriceForm.id,
                            type: 'PUT',
                            requestBody: true,
                            data: {
                                id: self.editPriceForm.id,
                                partner_company_id: self.editPriceForm.partner_company_id,
                                partner_company_name: self.editPriceForm.partner_company.company_name,
                            },
                            success: function () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.popover = false;
                                self.$emit('update');
                            }
                        });

                    } else {
                        console.log('error submit!!');
                    }
                })

            },
        }
    }
</script>

<style lang="scss">

</style>
