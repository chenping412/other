<template>
    <div class="inline-block">
        <el-button type="primary" @click="add">新建黑白名单</el-button>

        <el-dialog title="新建黑白名单" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="100px">
                <el-form-item label="邮箱地址" prop="email_address">
                    <el-input v-model="addForm.email_address"></el-input>
                </el-form-item>
                <el-form-item label="名单类型">
                    <el-radio v-model="addForm.is_black" :label="true">黑名单</el-radio>
                    <el-radio v-model="addForm.is_black" :label="false">白名单</el-radio>
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
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {

                },
                addFormRule: {
                    email_address: [
                        {required: true, validator: function (rule, value, callback) {
                            if (!value) {
                                callback(new Error('请输入邮箱地址'));
                            } else if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))) {
                                callback(new Error('邮箱格式不正确'));
                            } else {
                                callback();
                            }
                        }}
                    ],
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            add(){
                this.addForm ={
                    email_address:'',
                    is_black:false,
                };
                this.dialogShow=true;
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {

                        self.loading = true;
                        self.$http({
                            url: self.$api.message_mail_address_white_black_v4,
                            type:'POST',
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