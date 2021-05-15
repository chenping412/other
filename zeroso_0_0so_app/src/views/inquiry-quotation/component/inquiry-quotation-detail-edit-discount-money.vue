<template>
    <el-popover popper-class="popper-inquiry-detail-product-edit-price"
                v-model="popover"
                trigger="manual"
                placement="bottom-end"
                width="450">
        <el-button slot="reference" type="danger" size="mini" @click="popoverShow">设置优惠</el-button>
        <div class="popper-inquiry-detail-product-edit-price-content" v-loading="loading">

            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="85px">
                <el-form-item label="优惠金额" prop="discount_amount">
                    <InputNumber :value.sync="editPriceForm.discount_amount" :round="2" :minus="true" placeholder="无优惠输入0，当增加费用时可输入负数">
                        <template slot="append">{{'CNY' | isoCurrency}}</template>
                    </InputNumber>
                </el-form-item>
                <el-form-item label="优惠原因" prop="discount_reason">
                    <el-input type="textarea" :rows="8" v-model="editPriceForm.discount_reason" maxlength="1000" show-word-limit placeholder="优惠原因"></el-input>
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
        props: ['detailForm','queryId'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    "sheet_id": null,
                    "discount_amount": null,
                    "discount_reason": null,
                },
                editPriceFormRule: {
                    discount_amount: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value!==0) {
                                    callback(new Error('请输入采购价优惠金额！'));
                                }
                                else {
                                    callback();
                                }
                            }
                        }
                    ],
                    discount_reason: [
                        {required: true, message: '请输入优惠原因', trigger: 'blur'}
                    ],
                },


            }
        },
        created() {

        },
        methods: {
            popoverShow() {
                this.editPriceForm = {
                    "sheet_id": this.queryId,
                    "discount_amount": this.detailForm.procurement_price.additional_charges.discount_amount,
                    "discount_reason": null,
                };
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.$confirm('确定执行？执行前请确认是否给出采购价优惠！', '提示', {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action == 'confirm') {
                                    self.$http({
                                        url: self.$api.inquiry_v6_0_quotations + '/' + self.editPriceForm.sheet_id + '/discountAmount',
                                        type: 'PUT',
                                        requestBody: true,
                                        data: {
                                            "sheet_id": self.editPriceForm.sheet_id,
                                            "discount_amount": self.editPriceForm.discount_amount,
                                            "discount_reason": self.editPriceForm.discount_reason,
                                        },
                                        success: function (data) {
                                            self.loading = false;
                                            if (data.sheet_id) {
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
                                }
                            }
                        })
                    } else {
                        console.log('error submit!!');
                    }
                })

            },
        }
    }
</script>

<style lang="scss">
    .popper-inquiry-detail-product-edit-price-content {
        padding: 20px 20px 0;
    }
</style>
