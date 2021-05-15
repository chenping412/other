<template>
    <div>
        <el-dialog
                title="添加主配件"
                :visible.sync="correctProductDialogShow"
                width="1100px"
                top="80px"
                :close-on-click-modal="false"
                v-loading="loading">

            <el-form :model="correctProductForm" :rules="correctProductFormRule" ref="form" label-width="100px">
                <el-form-item>
                    <template slot="label">
                        <el-tag class="cursor-pointer"
                                :type="masterDeviceIndex===-1 ? 'warning' : 'info'"
                                effect="dark"
                                @click="masterDeviceIndex=-1">
                            {{masterDeviceIndex===-1 ? '主件' : '配件'}}
                        </el-tag>
                    </template>
                    <template slot="default">
                        <span>{{correctProductForm.oldProduct.type_no}}</span>
                        <span>，{{correctProductForm.oldProduct.order_no}}</span>
                    </template>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="correctProductForm.supplier_id" @change="checkAllSupplie"
                               placeholder="选择供应商">
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

                <div v-for="(partsItem,$index) in correctProductForm.parts_list" :key="$index">
                    <el-form-item>
                        <template slot="label">
                            <div>
                                <el-tag class="cursor-pointer"
                                        :type="masterDeviceIndex===$index ? 'warning' : 'info'"
                                        effect="dark"
                                        @click="masterDeviceIndex=$index">
                                    {{masterDeviceIndex===$index ? '主件' : '配件'}}
                                </el-tag>
                            </div>
                            <span class="el-icon-remove-outline el-icon-normal red cursor-pointer margin-right-5"
                                  @click="clickDeleteParts($index)">
                            </span>
                        </template>
                        <div slot="default">
                            <div class="margin-bottom-10">
                                <SelectProductSingle
                                        :productId.sync="partsItem.correctProductId"
                                        :product.sync="partsItem.correctProduct"
                                        :option="partsItem.correctProduct&&partsItem.correctProduct.id ? [partsItem.correctProduct] : null"
                                        @change="correctProductChange($event,partsItem)"
                                        :data="{brand_name: detailForm.brand ? detailForm.brand.name : undefined}">
                                    <template slot="append">
                                        <product-add-model :brand="detailForm.brand" @update="addProductCallback($event,partsItem)"></product-add-model>
                                    </template>
                                </SelectProductSingle>
                            </div>
                            <div class="margin-bottom-10">
                                <tiered-price-edit
                                        :scopeRow.sync="partsItem"
                                        :isEditPrice="true"
                                        :showHeader="true"
                                        :brandId="detailForm.brand ? detailForm.brand.id :null"
                                        :supplierId="correctProductForm.supplier_id">
                                </tiered-price-edit>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" @click="clickAddParts()">新增配件</el-button>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickCorrect()">保 存</el-button>
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
            return {
                correctProductDialogShow: false,
                correctProductForm: {
                    oldProduct: {},
                    supplier_id: '',
                    main_parts_id:'',
                    parts_list: []
                },
                correctProductFormRule: {
                    correctProductId: [
                        {required: true, message: '请选择配件！'}
                    ],
                },


                masterDeviceIndex: -1,

                loading: false,
            }
        },
        watch: {},
        created() {

        },
        methods: {
            init(row) {
                this.masterDeviceIndex=-1;

                let parts_list = [];
                if(row.parts_list && row.parts_list.length>0){
                    row.parts_list.forEach((item,$index)=>{
                        parts_list.push({
                            correctProductId: item.id,
                            correctProduct: JSON.parse(JSON.stringify(item)),
                            price_list: [],
                        });
                        if(row.main_parts_id && item.id === row.main_parts_id){
                            this.masterDeviceIndex=$index;
                        }
                    })
                }else {
                    parts_list = [{
                        correctProductId: '',
                        correctProduct: {},
                        price_list: [],
                    }]
                }
                this.correctProductForm = {
                    oldProduct: row,
                    supplier_id: row.supplier_id,
                    main_parts_id:row.main_parts_id,
                    parts_list: parts_list
                };
                this.correctProductDialogShow = true;

                if(this.correctProductForm.parts_list && this.correctProductForm.parts_list.length>0){
                    this.correctProductForm.parts_list.forEach((partsItem)=>{
                        if(partsItem.correctProductId){
                            this.correctProductChange(partsItem.correctProduct,partsItem);
                        }
                    })
                }
            },
            clickAddParts() {
                this.correctProductForm.parts_list.push({
                    correctProductId: '',
                    correctProduct: {},
                    price_list: [],
                })
            },
            clickDeleteParts($index) {
                this.correctProductForm.parts_list.splice($index, 1);
            },
            //添加配件保存
            clickCorrect() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(self.correctProductForm.parts_list.length===0){
                            self.$message({
                                showClose: true,
                                message: '未添加配件！',
                                type: 'error'
                            });
                            return
                        }
                        for(let m=0;m<self.correctProductForm.parts_list.length;m++){
                            let partsItem = self.correctProductForm.parts_list[m];
                            if (!partsItem.correctProductId) {
                                self.$message({
                                    showClose: true,
                                    message: '请选择关联产品！',
                                    type: 'error'
                                });
                                return
                            }else if (partsItem.correctProductId === self.correctProductForm.oldProduct.product_id) {
                                self.$message({
                                    showClose: true,
                                    message: '关联产品不能与原产品相同！',
                                    type: 'error'
                                });
                                return
                            }
                            let price_list;
                            if (partsItem.price_list.length > 0) {
                                if (!self.correctProductForm.supplier_id) {
                                    self.$message({
                                        showClose: true,
                                        message: '若为关联产品填写了价格，则必须先选择供应商！',
                                        type: 'error'
                                    });
                                    return
                                }
                                price_list = self.$parent.checkPriceRules(partsItem.price_list);
                                if (!price_list) return;
                                for (let i = 0; i < price_list.length; i++) {
                                    if (price_list[i].unit_sellable === false) {
                                        self.$confirm('注意：当选择非独立销售时，务必要给该产品添加配件，否则将无法销售', '提示', {
                                            confirmButtonText: '继续提交',
                                            cancelButtonText: '取消',
                                            type: 'warning',
                                            callback: function (action) {
                                                if (action === 'confirm') {
                                                    self.clickSaveAddPartsSubmit()
                                                }
                                            }
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                        self.clickSaveAddPartsSubmit();
                    }
                });
            },

            //添加配件保存
            clickSaveAddPartsSubmit() {
                let self = this;
                self.$confirm('添加配件，确定吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            let parts_list=[];
                            for(let m=0;m<self.correctProductForm.parts_list.length;m++) {
                                let partsItem = self.correctProductForm.parts_list[m];
                                let price_list = self.$parent.checkPriceRules(partsItem.price_list);
                                if (!price_list) return;
                                parts_list.push({
                                    parts_product_id: partsItem.correctProductId,
                                    price_list: price_list,
                                })
                            }
                            //需要额外把当前型号，添加到parts_list里面，提交上去，不需要携带价格
                            parts_list.push({
                                parts_product_id: self.correctProductForm.oldProduct.product_id,
                                price_list: [],
                            });
                            let requestData={
                                sheet_id: self.queryId,
                                currency: self.currency,
                                supplier_id: self.correctProductForm.supplier_id || undefined,
                                main_parts_id:self.masterDeviceIndex===-1 ? self.correctProductForm.oldProduct.product_id : parts_list[self.masterDeviceIndex].parts_product_id,
                                parts_list: parts_list
                            };

                            self.loading = true;
                            self.$http({
                                url: self.apiPath + '/' + self.queryId + '/products/' + self.correctProductForm.oldProduct.product_id + '/addParts',
                                type: 'PUT',
                                requestBody: true,
                                data: requestData,
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
            correctProductChange(product,partsItem) {
                let self = this;
                partsItem.price_list = [];
                partsItem.correctProductSupplierPriceList = [];
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
                                partsItem.correctProductSupplierPriceList = data.msg;
                                self.checkCorrectProductSupplierPrice(partsItem);
                            }
                        }
                    })
                }
            },
            checkCorrectProductSupplierPrice(partsItem) {
                if(this.correctProductForm.supplier_id && partsItem.correctProductSupplierPriceList){
                    let price_list = [];
                    for (let i = 0; i < partsItem.correctProductSupplierPriceList.length; i++) {
                        if (partsItem.correctProductSupplierPriceList[i].vendor_company_id === this.correctProductForm.supplier_id) {
                            price_list = partsItem.correctProductSupplierPriceList[i].tiered_price_list;
                            break;
                        }
                    }
                    partsItem.price_list = price_list;
                }
            },
            checkAllSupplie() {
                if(this.correctProductForm.parts_list.length>0){
                    for(let i=0;i<this.correctProductForm.parts_list.length;i++){
                        this.checkCorrectProductSupplierPrice(this.correctProductForm.parts_list[i]);
                    }
                    this.correctProductForm = JSON.parse(JSON.stringify(this.correctProductForm))
                }
            },

            addProductCallback(product,partsItem){
                partsItem.correctProductId = product.id;
                partsItem.correctProduct = product;
            }

        },
    }
</script>

<style lang="scss">

</style>