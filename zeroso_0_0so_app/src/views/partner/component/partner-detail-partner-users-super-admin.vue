<template>
    <div>
        <el-button type="primary" plain @click="edit">超级管理员编辑</el-button>

        <el-dialog :title="actionDialogTitle || '超级管理员编辑'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" append-to-body  v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="100px">
                <el-form-item label="移动到公司ID" prop="new_company_id">
                    <InputNumber :value.sync="addForm.new_company_id"></InputNumber>
                </el-form-item>
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
        props:['queryId','userId','actionDialogTitle'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    new_company_id:'',
                },
                addFormRule: {
                    new_company_id: [
                        {required: true, message: '请输入移动到公司ID'}
                    ],
                },
            }
        },
        watch: {},
        created() {

        },
        methods: {

            edit(){
                let self = this;
                self.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {

                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_v5 + '/' + self.queryId + '/partner_users' + '/' + self.userId + '/change_company_id',
                            type:'PUT',
                            requestBody:true,
                            data: self.addForm,
                            success: function () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.dialogShow=false;
                                self.$emit('update');
                            }
                        });
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>