<template>
    <div class="inline-block">
        <el-button type="danger" size="mini" @click="clickCancel()">下架</el-button>

        <el-dialog title="下架品牌" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" v-loading="loading">
            <div>
                <el-form :model="formData" :rules="formDataRule" ref="form" label-width="90px">
                    <el-form-item label="下架方式" prop="publish_state">
                        <el-radio-group v-model="formData.publish_state">
                            <el-radio label="offline_brand">仅品牌下架</el-radio>
                            <el-radio label="offline_brand_and_product">品牌+产品下架</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="下架原因" prop="reason">
                        <el-input type="textarea" rows="6" v-model="formData.reason"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">下 架</el-button>
                <el-button @click="dialogShow=false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['queryId'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                formData: {},
                formDataRule: {
                    publish_state: [
                        {required: true, message: '请选择下架方式！'}
                    ],
                },

            }
        },
        methods: {
            clickCancel() {
                this.dialogShow = true;
                this.formData = {
                    uid:this.queryId,
                    publish_state:'offline_brand',
                    reason:""
                }
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.$confirm('确认下架该品牌吗？', '提示', {
                            confirmButtonText: '确认下架',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.loading = true;
                                    self.$http({
                                        url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/offline',
                                        type: 'PUT',
                                        requestBody: true,
                                        data:self.formData,
                                        success (){
                                            self.loading = false;
                                            self.dialogShow = false;
                                            self.$message({
                                                showClose: true,
                                                message: '操作成功！',
                                                type: 'success'
                                            });
                                            self.$emit('update');
                                        }
                                    });
                                }
                            }
                        })
                    }
                });
            },

        },
    }
</script>