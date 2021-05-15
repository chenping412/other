<template>
    <el-popover popper-class="popper-inquiry-detail-product-edit-price"
                v-model="popover"
                trigger="manual"
                placement="bottom-end"
                width="400">
        <i slot="reference" class="el-icon-edit el-icon-normal cursor-pointer" @click="popoverShow"></i>
        <div class="popper-inquiry-detail-product-edit-price-content" v-loading="loading">

            <el-form :model="editPriceForm" :rules="editPriceFormRule" ref="editPriceForm" label-width="100px">
                <el-form-item label="手填未税单价" prop="price">
                    <InputNumber :value.sync="editPriceForm.price" :round="2">
                        <template slot="append">{{detailForm.currency_unit.currency | isoCurrency}}</template>
                    </InputNumber>
                </el-form-item>
                <el-form-item label="关税">
                    <span>{{editPriceForm.tariff | percent | inquiryPriceNormalText}}</span>
                    <span class="red" v-if="editPriceForm.extra_import_tariff"> + {{editPriceForm.extra_import_tariff | percent}}</span>
                </el-form-item>
                <el-form-item label="含税总价">{{editPriceForm.total_price_with_tariff |
                    formatMoney(detailForm.currency_unit.currency) | inquiryPriceNormalText}}
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
        props: ['productLine', 'detailForm'],
        data() {
            return {
                loading: false,
                popover: false,

                editPriceForm: {
                    price: '',
                    tariff: '',
                    extra_import_tariff: '',
                    total_price_with_tariff: '',
                },
                editPriceFormRule: {
                    price: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请输入未税单价！'));
                                }
                                        // else if (Number(value) < self.minSalesPrice) {
                                        //     callback(new Error('不能低于零搜统一销售价格！'));
                                // }
                                else {
                                    callback();
                                }
                            }
                        }
                    ],
                },

                minSalesPrice: 0,

            }
        },
        watch: {
            'editPriceForm.price'() {
                if (this.editPriceForm.tariff || this.editPriceForm.tariff===0) {
                    this.editPriceForm.total_price_with_tariff = (Number(this.editPriceForm.price) * (1 + (this.editPriceForm.tariff + (this.editPriceForm.extra_import_tariff || 0)) / 100) * this.productLine.prodcut_quotation.quantity).myRound(2);
                }
            },
        },
        created() {

        },
        methods: {
            popoverShow() {
                this.editPriceForm = {
                    price: this.productLine.prodcut_quotation.sales.price,
                    tariff: this.productLine.prodcut_quotation.sales.tariff,
                    extra_import_tariff: this.productLine.prodcut_quotation.sales.extra_import_tariff,
                    total_price_with_tariff: this.productLine.prodcut_quotation.sales.total_price_with_tariff,
                };
                this.minSalesPrice = Number(this.productLine.prodcut_quotation.sales.price);
                this.popover = true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                self.$refs.editPriceForm.validate((valid) => {
                    if (valid) {
                        self.popover = false;
                        let productLine = JSON.parse(JSON.stringify(self.productLine));
                        productLine.prodcut_quotation.sales = self.editPriceForm;
                        self.$emit('saveProductLine', productLine)
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
