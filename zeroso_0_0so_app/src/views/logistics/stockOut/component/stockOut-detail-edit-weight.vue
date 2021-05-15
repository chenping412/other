<template>
    <el-popover
            v-model="popover"
            trigger="manual"
            placement="bottom"
            width="400">
        <i slot="reference" class="el-icon-edit el-icon-normal cursor-pointer" @click="popoverShow"></i>
        <div class="padding-20" v-loading="loading">
            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="80px">
                <el-form-item label="额外重量" prop="extra_weight">
                    <InputNumber :value.sync="editPriceForm.extra_weight">
                        <template slot="append">kg</template>
                    </InputNumber>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="clickSaveEdit">提交</el-button>
                    <el-button size="mini" @click="popover=false">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-popover>
</template>

<script>

    export default {
        props: ['detailForm'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    extra_weight: null,
                    outgoing_transfer_id: null,
                },
                editPriceFormRule: {
                    extra_weight: [
                        {required: true, message: '额外重量', trigger: 'blur'}
                    ],
                },


            }
        },
        methods: {
            popoverShow() {
                this.editPriceForm = {
                    extra_weight: this.detailForm.extra_weight,
                    outgoing_transfer_id: this.detailForm.id,
                };
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.$http({
                            url: self.$api.order_outgoing_transfers + '/' + self.editPriceForm.outgoing_transfer_id + '/weight',
                            type: 'PUT',
                            requestBody: true,
                            data: self.editPriceForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.popover = false;
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
                })

            },
        }
    }
</script>

<style lang="scss">

</style>
