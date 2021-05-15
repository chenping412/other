<template>
    <div class="inline-block margin-left-10">
        <el-button type="primary" plain @click="edit">管理员编辑</el-button>

        <el-dialog title="管理员编辑" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="150px">
                <el-form-item label="关联账号" prop="login_user_id">
                    <SelectLoginUser
                            :userId.sync="addForm.login_user_id"
                            :user="addForm.login_user"
                            :option="addForm.login_user_id ? [addForm.login_user]:null"
                    ></SelectLoginUser>
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
        props:['queryId','userId'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    login_user_id:'',
                },
                addFormRule: {

                },
            }
        },
        watch: {},
        created() {

        },
        methods: {

            edit(){
                let self = this;
                self.$http({
                    url: self.$api.partner_companies_v5 + '/' + self.queryId + '/partner_users' + '/' + self.userId + '/admin',
                    success: function (data) {
                        self.dialogShow=true;
                        if (data.err_code.length === 0 && data.msg && data.msg.login_user) {
                            self.addForm.login_user = data.msg.login_user;
                            self.addForm.login_user_id = data.msg.login_user.id;
                        }
                    }
                })
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {

                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_v5 + '/' + self.queryId + '/partner_users' + '/' + self.userId + '/admin',
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