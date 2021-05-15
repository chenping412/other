<template>
    <div style="width: 500px;" v-loading="loading">
        <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="100px">
            <h2 class="padding-20">基本设置</h2>
            <el-form-item label="本位币">
                <el-select v-model="detailForm.currency">
                    <el-option
                            v-for="item in $store.state.currency"
                            :key="item.code"
                            :label="item.label"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
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

                detailForm: {},
                detailFormRule: {
                    currency: [
                        {required: true, message: '请选择本位币！'}
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
                    url: self.$api.bank_v4_config_basic_info,
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
                            url: self.$api.bank_v4_config_basic_info,
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
