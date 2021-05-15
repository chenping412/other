<template>
    <div class="inline-block margin-left-10">
        <el-button type="primary" plain @click="edit">超级状态修改</el-button>

        <el-dialog title="超级状态修改" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="150px">
                <el-form-item label="联系人状态" prop="status">
                    <el-select v-model="addForm.status">
                        <el-option
                                v-for="item in $store.state.partnerUserStatus"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示状态" prop="visibility">
                    <el-select v-model="addForm.visibility">
                        <el-option
                                v-for="item in $store.state.partnerUserAction"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
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
        props:['queryId','selectUserForm'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    status:'',
                    visibility:'',
                },
                addFormRule: {
                    status: [
                        {required: true, message: '请选择联系人状态！'}
                    ],visibility: [
                        {required: true, message: '请选择显示状态！'}
                    ],
                },
            }
        },
        watch: {},
        created() {

        },
        methods: {
            edit(){
                this.addForm={
                    status:this.selectUserForm.status,
                    visibility:this.selectUserForm.visibility,
                }
                this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_v5 + '/' + self.queryId + '/partner_users' + '/' + self.selectUserForm.id + '/admin_status_action',
                            type:'PUT',
                            requestBody:true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow=false;
                                    self.$emit('update');
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

</style>