<template>
    <div style="width: 500px;" v-loading="loading">
        <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="100px" label-position="left">
            <h2 class="padding-20">第三方接入设置</h2>
            <el-form-item label="第三方名称" required>
                <el-select v-model="detailForm.third_config_type">
                    <el-option label="精斗云" value="jdy"></el-option>
                </el-select>
            </el-form-item>

            <div style="border:1px solid #dddddd;padding:20px;margin-bottom:10px;">
                <el-form-item label="用户名" prop="user_name">
                    <el-input v-model="detailForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="detailForm.password"></el-input>
                </el-form-item>
                <el-form-item label="主帐套ID" prop="account_id">
                    <el-input v-model="detailForm.account_id"></el-input>
                </el-form-item>
                <el-form-item label="子帐套ID" prop="db_id">
                    <el-input v-model="detailForm.db_id"></el-input>
                </el-form-item>
                <el-form-item label="client_id" prop="client_id" required>
                    <el-input v-model="detailForm.client_id"></el-input>
                </el-form-item>
                <el-form-item label="client_secret" prop="client_secret" required>
                    <el-input v-model="detailForm.client_secret"></el-input>
                </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" @click="clickSaveDate">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        data() {
            return {

                detailForm: {
                    account_id: null,
                    client_id: null,
                    client_secret: null,
                    db_id: null,
                    password: null,
                    third_config_type: "jdy",
                    user_name: null,
                },
                detailFormRule: {
                    user_name: [
                        {required: true, message: '请输入用户名！'}
                    ], password: [
                        {required: true, message: '请输入密码！'}
                    ], account_id: [
                        {required: true, message: '请输入主帐套ID！'}
                    ], db_id: [
                        {required: true, message: '请输入子帐套ID！'}
                    ],
                },

                loading: false,

            }
        },
        created() {
            this.getDetailData();
        },
        methods: {
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_config_third_info,
                    success: function (data) {
                        self.loading = false;
                        self.detailForm = data.msg;
                    }
                })
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_v4_config_third_info,
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function () {
                                self.loading = false;
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

        }
    }
</script>

<style lang="scss">


</style>
