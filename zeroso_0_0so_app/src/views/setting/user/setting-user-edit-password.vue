<template>
    <div class="partner-add">
        <el-dialog :title="'重置 '+addForm.nick_name+' 的密码'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="100px">
                <el-form-item label="重置密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="再次确认" prop="password2">
                    <el-input type="password" v-model="addForm.password2"></el-input>
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
        props:['title'],
        data() {
            let self=this;
            return {
                loading:false,
                dialogShow:false,
                addForm: {

                },
                addFormRule: {
                    password: [
                        {required: true, message: '请输入重置密码！'}
                    ],password2: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请再次输入密码'));
                                } else if (value != self.addForm.password) {
                                    callback(new Error('您输入两次密码不一致，请重新输入'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ]
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            add(){
                this.addForm ={};
                this.dialogShow=true;
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
            },
            edit(item){
                item.password=null;
                item.password2=null;
                this.addForm = JSON.parse(JSON.stringify(item));
                this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {

                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_v5_login_user +  '/'+self.addForm.id  + '/password',
                            type:'PUT',
                            requestBody:true,
                            data: {
                                login_user_id: self.addForm.id,
                                password: self.addForm.password
                            },
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