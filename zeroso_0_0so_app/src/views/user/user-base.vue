<template>
    <div id="user-base" class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>个人中心</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info" style="min-height: 600px;">
                <div class="detail-base-title">
                    <h3 class="detail-status">基本信息</h3>
                </div>
                <el-form label-width="150px" style="padding: 20px;">
                    <el-form-item label="昵称：">
                        <span>{{userInfo.nick_name}}</span>
                    </el-form-item>
                    <el-form-item label="邮箱：">
                        <span>{{userInfo.email}}</span>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <span>{{userInfo.mobile}}</span>
                    </el-form-item>
                    <el-form-item label="密码：">
                        <a class="blue" href="javascript:;" @click="clickUpdataPassword()">修改密码</a>
                    </el-form-item>

                    <el-form-item label="时区：">
                        <el-select v-model="userTimezone" style="width: 250px;">
                            <el-option value="Asia/Shanghai" label="Asia/Shanghai （亚洲/上海）"></el-option>
                            <el-option value="Europe/Berlin" label="Europe/Berlin （欧洲/柏林）"></el-option>
                        </el-select>
                        <el-button class="margin-left-10" type="primary" @click="saveUpdateTimezone">修改时区</el-button>

                    </el-form-item>

                    <el-form-item label="是否接收短信通知：" v-if="$store.state.system==='B'">
                        <el-switch
                                v-model="receive_sms"
                                @change="saveUpdateTimezone"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="打开"
                                inactive-text="关闭">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </div>


        <el-dialog title="修改密码" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false">
            <el-form :model="formData" :rules="formDataRule" ref="updataForm" label-width="110px" size="small">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="formData.oldPassword" type="password" placeholder="原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pwd">
                    <el-input v-model="formData.pwd" type="password" placeholder="新密码，密码长度最少8位"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="pwd2">
                    <el-input v-model="formData.pwd2" type="password" placeholder="确认新密码"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="saveUpdataUser()">保 存</el-button>
                <el-button size="small" @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject:['getUserInfo'],
        data() {
            let self = this;
            return {
                dialogShow: false,
                formData: {
                    oldPassword: '',
                    pwd: '',
                    pwd2: ''
                },
                formDataRule: {
                    oldPassword: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    pwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 8, message: '密码长度最少8位', trigger: 'blur'}
                    ],
                    pwd2: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (value == '') {
                                    callback(new Error('请再次输入新密码'));
                                } else if (value != self.formData.pwd) {
                                    callback(new Error('您输入两次密码不一致，请重新输入'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ]
                },


                userTimezone: null,

                loading: false,


                receive_sms:true,

            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            },
        },
        created() {
            this.getMyInfo();
        },
        methods: {
            clickUpdataPassword: function () {
                this.dialogShow = true;
                if (this.$refs.updataForm) this.$refs.updataForm.clearValidate();
            },
            //修改密码
            saveUpdataUser: function () {
                let self = this;
                self.$refs.updataForm.validate(function (valid) {
                    if (valid) {
                        self.$http({
                            url: self.$api.self_my_password,
                            type: 'PUT',
                            requestBody: true,
                            data: {
                                old_password: self.formData.oldPassword,
                                new_password: self.formData.pwd,
                            },
                            success: function (data) {
                                if (data.err_code.length === 0) {
                                    self.$message({
                                        type: 'success',
                                        message: '修改密码成功！',
                                        showClose: 'true'
                                    });
                                    self.dialogShow = false;
                                    self.$utils.goToDingDingLoginPage();
                                }
                            }
                        })

                    } else {
                        console.log('error submit!!');
                    }
                });
            },


            getMyInfo: function () {
                let self = this;
                self.$http({
                    url: self.$api.partner_v5_self_my_info,
                    success(data) {
                        if(data.msg){
                            self.userTimezone = data.msg.timezone;
                            self.receive_sms = data.msg.receive_sms;
                        }
                    }
                })
            },

            //修改时区
            saveUpdateTimezone: function () {
                let self = this;
                self.$http({
                    url: self.$api.partner_v5_self_my_info,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        timezone: self.userTimezone,
                        receive_sms: self.receive_sms,
                    },
                    success: function (data) {
                        if (data.err_code.length === 0) {
                            self.$message({
                                type: 'success',
                                message: '修改成功！',
                                showClose: 'true'
                            });
                            self.getMyInfo();
                            self.getUserInfo();
                        }
                    }
                })
            },
        }
    }
</script>

<style>


</style>
