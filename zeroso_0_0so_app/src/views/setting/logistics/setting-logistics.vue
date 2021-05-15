<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>设置</el-breadcrumb-item>
                    <el-breadcrumb-item>物流设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <h3 slot="header">物流设置</h3>
                <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="150px" style="width: 500px;">
                    <el-form-item label="月结卡号：">
                        <span v-if="!isEdit">{{detailForm.customer_pay_code}}</span>
                        <el-input v-else v-model="detailForm.customer_pay_code"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div v-if="!isEdit">
                            <el-button type="primary" @click="isEdit=true">编 辑</el-button>
                        </div>
                        <div v-else>
                            <el-button type="success" @click="clickSaveDate">保 存</el-button>
                            <el-button @click="isEdit=false">取 消</el-button>
                        </div>

                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>

</template>

<script>

    export default {
        data() {
            return {

                isEdit:false,

                detailForm: {},
                detailFormRule: {

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
                    url: self.$api.partner_self_defaults_third_delivery,
                    success: function (data) {
                        self.loading = false;
                        if(data.msg) self.detailForm = data.msg;
                    }
                })
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_self_defaults_third_delivery,
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function () {
                                self.loading = false;
                                self.isEdit = false;
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
