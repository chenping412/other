<template>
    <div>
        <el-dialog
                :title="correctProductTypeMap[correctProductType]"
                :visible.sync="correctProductDialogShow"
                width="1100px"
                top="80px"
                :close-on-click-modal="false"
                v-loading="loading">

            <el-form :model="correctProductForm" :rules="correctProductFormRule" ref="form" label-width="100px">
                <el-form-item label="原产品">
                    <span>{{correctProductForm.oldProduct.type_no}}</span>
                    <span>，{{correctProductForm.oldProduct.order_no}}</span>
                </el-form-item>
                <el-form-item label="关联产品"
                              :prop="correctProductType==='invalid'?null:'correctProductId'">
                    <SelectProductSingle
                            :productId.sync="correctProductForm.correctProductId"
                            :product.sync="correctProductForm.correctProduct"
                            :option="correctProductForm.correctProduct&&correctProductForm.correctProduct.id ? [correctProductForm.correctProduct] : null"
                            @change="correctProductChange"
                            :data="{brand_name: detailForm.brand ? detailForm.brand.name : undefined}"
                            placeholder="输入型号、订货号，请先检索，若无对应型号再新建产品">
                        <template slot="append">
                            <product-add-model :brand="detailForm.brand"
                                               @update="addProductCallback"></product-add-model>
                        </template>
                    </SelectProductSingle>
                </el-form-item>

                <div v-show="correctProductType!=='invalid' || correctProductForm.correctProductId">
                    <el-form-item label="供应商">
                        <el-select v-model="correctProductForm.supplier_id" @change="checkCorrectProductSupplierPrice">
                            <el-option
                                    v-for="item in supplierListData"
                                    :key="item.id"
                                    :label="item.company_info_with_follower.company_name"
                                    :value="item.company_info_with_follower.account_company_id">
                                <span>{{item.company_info_with_follower.company_name}}</span>
                                <el-tag size="mini" v-if="item.is_default">推荐</el-tag>
                            </el-option>
                        </el-select>
                        <p class="red" v-if="!supplierListData || supplierListData.length===0">该品牌未添加供应商</p>
                    </el-form-item>
                    <el-form-item label="价格">
                        <tiered-price-edit
                                :scopeRow.sync="correctProductForm"
                                :isEditPrice="true"
                                :showHeader="true"
                                :brandId="detailForm.brand ? detailForm.brand.id :null"
                                :supplierId="correctProductForm.supplier_id">
                        </tiered-price-edit>
                    </el-form-item>
                </div>

                <el-form-item label="备注" prop="comment_no">
                    <el-select class="margin-bottom-10"
                               v-model="correctProductForm.comment_no"
                               v-if="$store.state.productQuotationComment[correctProductForm.comment_type]"
                               @change="correctProductForm.comment=null">
                        <el-option
                                v-for="(item,$index) in $store.state.productQuotationComment[correctProductForm.comment_type].children"
                                :key="$index"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <el-input type="textarea" :rows="6"
                              v-model="correctProductForm.comment"
                              v-if="correctProductForm.comment_no===0"
                              placeholder="当选择其他时，需填写备注内容">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="correctProductType" type="success" @click="clickCorrect()">
                    {{correctProductTypeMap[correctProductType]}}
                </el-button>

                <el-button @click="correctProductDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import TieredPriceEdit from "./tieredPriceEdit";
    import ProductAddModel from "../../product/product/component/product-add-model";

    export default {
        components: {ProductAddModel, TieredPriceEdit},
        props: ['detailForm', 'supplierListData', 'currency', 'queryId','apiPath'],
        data() {
            let self = this;
            return {
                correctProductDialogShow: false,
                correctProductForm: {
                    oldProduct: {},
                    correctProductId: '',
                    correctProduct: {},
                    supplier_id: '',
                    price_list: [],

                    "comment": null,
                    "comment_no": null,
                    "comment_type": 1,
                },
                correctProductFormRule: {
                    correctProductId: [
                        {required: true, message: '请选择关联产品！'}
                    ],
                    comment_no: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value !== 0) {
                                    callback(new Error('请选择备注内容！'));
                                } else if (value === 0 && !self.correctProductForm.comment) {
                                    callback(new Error('请填写备注内容！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                },

                correctProductSupplierPriceList: [],

                correctProductType: null,
                correctProductTypeMap: {
                    invalid: "标记无效",
                    replaced: "标记替代",
                },

                loading: false,
            }
        },
        watch: {},
        created() {

        },
        methods: {
            init(param) {
                this.correctProductType = param.correctProductType;
                this.correctProductForm = {
                    oldProduct: param.row,
                    correctProductId: '',
                    correctProduct: {},
                    supplier_id: '',
                    price_list: [],
                    "comment": null,
                    "comment_no": null,
                    "comment_type": this.correctProductType === 'invalid' ? 1 : 3,  //1：无效；2：不报价；3：替代
                };
                if(!this.$store.state.productQuotationComment[this.correctProductForm.comment_type]){
                    this.correctProductForm.comment_no = 0;
                }
                this.correctProductDialogShow = true;
            },
            //保存
            clickCorrect() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if (self.correctProductForm.correctProductId && self.correctProductForm.correctProductId === self.correctProductForm.oldProduct.product_id) {
                            self.$message({
                                showClose: true,
                                message: '关联产品不能与原产品相同！',
                                type: 'error'
                            });
                            return
                        }
                        let price_list;
                        if (self.correctProductForm.price_list.length > 0) {
                            if (!self.correctProductForm.supplier_id) {
                                self.$message({
                                    showClose: true,
                                    message: '若为关联产品填写了价格，则必须先选择供应商！',
                                    type: 'error'
                                });
                                return
                            }
                            price_list = self.$parent.checkPriceRules(self.correctProductForm.price_list);
                            if (!price_list) return;
                            for (let i = 0; i < price_list.length; i++) {
                                if (price_list[i].unit_sellable === false) {
                                    self.$confirm('注意：当选择非独立销售时，务必要给该产品添加配件，否则将无法销售', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        callback: function (action) {
                                            if (action === 'confirm') {
                                                self.clickCorrectSubmit(price_list)
                                            }
                                        }
                                    });
                                    return;
                                }
                            }
                        }
                        self.clickCorrectSubmit(price_list);
                    }
                });
            },
            clickCorrectSubmit(price_list) {
                if (this.correctProductType === 'invalid') {
                    this.clickSaveMarkInvalidSubmit(price_list)
                } else {
                    this.clickSaveReplaceProductDateSubmit(price_list)
                }
            },
            //确认标记无效时，做二次确认提示
            clickSaveMarkInvalidSubmit(price_list) {
                let self = this;
                self.$confirm('标记无效，表示该产品真的是无效产品，请谨慎操作！若是暂时拿不到报价，请先移除该产品，而不是标记无效', '提示', {
                    confirmButtonText: '确认标记无效',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$parent.setProductValid(self.correctProductForm.oldProduct.product_id, false, {
                                "correct_product_id": self.correctProductForm.correctProductId,
                                price_list: price_list,
                                "currency": self.currency,
                                "supplier_id": self.correctProductForm.supplier_id || null,

                                "comment": self.correctProductForm.comment,
                                "comment_no": self.correctProductForm.comment_no,
                                "comment_type": self.correctProductForm.comment_type,
                            }, () => {
                                self.loading = false;
                                self.correctProductDialogShow = false;
                            });
                        }
                    }
                });
            },
            //替代产品保存
            clickSaveReplaceProductDateSubmit(price_list) {
                let self = this;
                self.$confirm('标记替代产品，确定吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.apiPath + '/' + self.queryId + '/products/' + self.correctProductForm.oldProduct.product_id + '/replaceProduct',
                                type: 'PUT',
                                requestBody: true,
                                data: {
                                    "replace_product_id": self.correctProductForm.correctProductId,
                                    price_list: price_list,
                                    "currency": self.currency,
                                    "supplier_id": self.correctProductForm.supplier_id || null,
                                    "sheet_id": self.queryId,

                                    "comment": self.correctProductForm.comment,
                                    "comment_no": self.correctProductForm.comment_no,
                                    "comment_type": self.correctProductForm.comment_type,
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.updatable) {
                                        self.$message({
                                            showClose: true,
                                            message: '保存成功！',
                                            type: 'success'
                                        });
                                        self.correctProductDialogShow = false;
                                        self.$emit('update');
                                    }
                                }
                            });
                        }
                    }
                })
            },


            //替代产品选中时触发
            correctProductChange(product) {
                let self = this;
                //获取数据之前，先重置变量，以免导致旧数据填充到新数据中
                self.correctProductForm.supplier_id = "";
                self.correctProductForm.price_list = [];
                self.correctProductSupplierPriceList = [];
                if (product.id) {
                    self.$http({
                        url: self.$api.product_product_manage_product + '/' + product.id + '/price',
                        type: 'GET',
                        success: function (data) {
                            if (data.msg && data.msg.length > 0) {
                                for (let i = 0; i < data.msg.length; i++) {
                                    for (let k = 0; k < data.msg[i].tiered_price_list.length; k++) {
                                        data.msg[i].tiered_price_list[k].discountPercent = data.msg[i].tiered_price_list[k].discount || data.msg[i].tiered_price_list[k].discount === 0 ? Number(data.msg[i].tiered_price_list[k].discount * 100) : null;
                                    }
                                }
                                self.correctProductSupplierPriceList = data.msg;
                            }
                        }
                    })
                }
            },
            checkCorrectProductSupplierPrice(supplier_id) {
                let price_list = [];
                for (let i = 0; i < this.correctProductSupplierPriceList.length; i++) {
                    if (this.correctProductSupplierPriceList[i].vendor_company_id === supplier_id) {
                        price_list = this.correctProductSupplierPriceList[i].tiered_price_list;
                        break;
                    }
                }
                this.correctProductForm.price_list = price_list;
            },

            addProductCallback(product) {
                this.correctProductForm.correctProductId = product.id;
                this.correctProductForm.correctProduct = product;
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>