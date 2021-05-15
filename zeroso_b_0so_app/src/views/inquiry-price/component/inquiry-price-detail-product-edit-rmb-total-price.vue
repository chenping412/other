<template>
    <el-popover popper-class="popper-inquiry-detail-product-edit-price"
                v-model="popover"
                trigger="manual"
                placement="bottom-end"
                width="400">
        <i slot="reference" class="el-icon-edit el-icon-normal cursor-pointer" @click="popoverShow"></i>
        <div class="popper-inquiry-detail-product-edit-price-content" v-loading="loading">

            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="100px">
                <el-form-item label="含税单价">
                    {{editPriceForm.sale_cny_price_with_tariff | formatMoney(detailForm.currency_unit.currency) | inquiryPriceNormalText}}
                </el-form-item>
                <el-form-item label="含税总价" prop="total_cny_price_with_tariff">
                    <InputNumber :value.sync="editPriceForm.total_cny_price_with_tariff" :round="2">
                        <template slot="append">{{detailForm.currency_unit.currency | isoCurrency}}</template>
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
        props: ['productLine', 'detailForm','queryId'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    "sheet_id": null,
                    "product_id": null,
                    "sale_cny_price_with_tariff": null,
                    "total_cny_price_with_tariff": null,

                },
                editPriceFormRule: {
                    total_cny_price_with_tariff: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请输入含税总价！'));
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
        watch: {
            'editPriceForm.total_cny_price_with_tariff'() {
                this.editPriceForm.sale_cny_price_with_tariff = (Number(this.editPriceForm.total_cny_price_with_tariff) / this.productLine.prodcut_quotation.quantity).myRound(2);
            },
        },
        created() {

        },
        methods: {
            popoverShow() {
                this.editPriceForm = {
                    "sheet_id": this.queryId,
                    "product_id": this.productLine.product_id,
                    "sale_cny_price_with_tariff": this.productLine.prodcut_quotation.sales.cny_price_with_tariff,
                    "total_cny_price_with_tariff": this.productLine.prodcut_quotation.sales.total_cny_price_with_tariff,

                };
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.$http({
                            url: self.$api.inquiry_v6_quotations + '/' + self.editPriceForm.sheet_id + '/products/' + self.editPriceForm.product_id + '/price',
                            type: 'POST',
                            requestBody: true,
                            data: {
                                "sheet_id": self.editPriceForm.sheet_id,
                                "product_id": self.editPriceForm.product_id,
                                "sale_cny_price_with_tariff": self.editPriceForm.sale_cny_price_with_tariff,
                                "total_cny_price_with_tariff": self.editPriceForm.total_cny_price_with_tariff,
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
