<template>
    <el-popover v-model="popover"
                trigger="manual"
                placement="top"
                width="480">
        <el-button slot="reference" type="danger" size="mini" @click="popoverShow">自定义</el-button>
        <div class="popper-inquiry-detail-product-edit-price-content" v-loading="loading">
            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="0">
                <p>自定义供应商提货费：</p>
                <el-form-item prop="supply_take_delivery_fee">
                    <InputNumber :value.sync="editPriceForm.supply_take_delivery_fee" :round="2" placeholder="不能输入负数">
                        <template slot="append">{{'EUR' | isoCurrency}}</template>
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
        props: ['detailForm','queryId'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    "sheet_id": null,
                    "supply_take_delivery_fee": null,
                },
                editPriceFormRule: {
                    supply_take_delivery_fee: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value!==0) {
                                    callback(new Error('请输入自定义供应商提货费，至少需输入0！'));
                                }
                                else {
                                    callback();
                                }
                            }
                        }
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
                    "supply_take_delivery_fee": this.detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee,
                };
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.$confirm('确定调整自定义供应商提货费吗？', '提示', {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.$http({
                                        url: self.$api.inquiry_v6_0_quotations + '/' + self.editPriceForm.sheet_id + '/supplyTakeDeliveryFee',
                                        type: 'PUT',
                                        requestBody: true,
                                        data: {
                                            "sheet_id": self.editPriceForm.sheet_id,
                                            "supply_take_delivery_fee": self.editPriceForm.supply_take_delivery_fee || 0,
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
