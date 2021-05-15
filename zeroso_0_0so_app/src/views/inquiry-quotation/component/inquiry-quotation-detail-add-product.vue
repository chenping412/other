<template>
    <div>
        <el-button type="primary" @click="clickShowAdd">新增产品</el-button>
        <el-dialog title="新增产品" :visible.sync="addProductShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addProductForm" :rules="addProductFormRule"
                     ref="addProductForm" label-width="100px">
                <el-form-item label="型号" prop="product_name">
                    <AutoCompleteProduct
                            :productId.sync="addProductForm.product_id"
                            :productName.sync="addProductForm.product_name"
                            :productOrderNo.sync="addProductForm.product_order_no"
                            :product.sync="addProductForm.product"
                            :data="{brand_name: detailForm.brand.name}"
                            @select="productSelect(addProductForm)"
                            @blur="productBlur($event,addProductForm)"
                            :notSearch="!detailForm.brand || !detailForm.brand.id"
                            valueKey="product_name">
                    </AutoCompleteProduct>
                </el-form-item>
                <el-form-item label="订货号" prop="product_order_no">
                    <AutoCompleteProduct
                            :productId.sync="addProductForm.product_id"
                            :productName.sync="addProductForm.product_name"
                            :productOrderNo.sync="addProductForm.product_order_no"
                            :product.sync="addProductForm.product"
                            :data="{brand_name: detailForm.brand.name}"
                            @select="productSelect(addProductForm)"
                            @blur="productBlur($event,addProductForm)"
                            :notSearch="!detailForm.brand || !detailForm.brand.id"
                            valueKey="product_order_no">
                    </AutoCompleteProduct>
                </el-form-item>
                <el-form-item label="数量" prop="prodcut_quotation.quantity">
                    <InputNumber
                            :value.sync="addProductForm.prodcut_quotation.quantity"
                            :integer="true"
                            :min="1"
                            placeholder="数量">
                    </InputNumber>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickSaveData()">提 交</el-button>
                <el-button @click="addProductShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        props: ['queryId','detailForm'],
        data() {
            let self=this;
            return {
                productItemTemplate: {
                    "brand_id": null,
                    "product_id": undefined,
                    "comment": "",
                    "origin_of_country": "",
                    "product_customs_info": {
                        "cn_description": null,
                        "code": null,
                        "tariff_rate": null,
                    },
                    "estimated_tariff": null,
                    "gross_weight": "",
                    "net_weight": "",
                    "extra_import_tariff": null,
                    "product_order_no": "",
                    "product_parameter": "",
                    "state": null,
                    "prodcut_quotation": {
                        "procurement": {
                            "price": null,
                            "tariff": null,
                            "extra_import_tariff": null,
                            "total_price_with_tariff": null,
                        },
                        "quantity": 1,
                        "sales": {
                            "price": null,
                            "tariff": null,
                            "extra_import_tariff": null,
                            "total_price_with_tariff": null,
                        },
                        "shipment_period": 0
                    },
                    "product_trade_name": {
                        "chinese_name": "",
                        "english_name": ""
                    },
                    "product_name": "",
                    "attachments": {
                        "file_id_list": []
                    },
                },
                addProductForm:{},
                addProductFormRule: {
                    product_name: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.addProductForm.product_name) {
                                    callback(new Error('请输入型号，若产品只有订货号，则此项填写订货号'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    product_order_no: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.addProductForm.product_order_no) {
                                    callback(new Error('请输入订货号，若产品只有型号，则此项填写型号'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    'prodcut_quotation.quantity': [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value || value == '0' || value == 0) {
                                    callback(new Error('请输入数量'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },
                addProductShow: false,


                loading: false,


            }
        },
        created() {
            this.addProductForm= JSON.parse(JSON.stringify(this.productItemTemplate));
        },
        methods: {
            clickShowAdd(){
                this.addProductShow=true;
                this.addProductForm= JSON.parse(JSON.stringify(this.productItemTemplate));
                this.addProductForm.brand_id=  this.detailForm.brand.id;
            },

            clickSaveData() {
                let self = this;
                self.$refs.addProductForm.validate(function (valid) {
                    if (valid) {
                        for(let i=0;i<self.detailForm.products.length;i++){
                            if(self.detailForm.products[i].product_id === self.addProductForm.product_id){
                                self.$message({
                                    showClose: true,
                                    message: '已经添加有相同产品，不可重复添加！',
                                    type: 'error'
                                });
                                return
                            }
                        }
                        self.loading = true;
                        self.$http({
                            url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products',
                            type: 'POST',
                            requestBody: true,
                            data: {
                                product_item: self.addProductForm
                            },
                            success: function (data) {
                                self.loading = false;
                                if (data.sheet_id) {
                                    self.addProductShow = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
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
                });
            },



            productSelect(row) {
                let product = row.product;
                if (product) {
                    row.product_id = product.id;
                    row.product_name = product.product_name;
                    row.product_order_no = product.product_order_no;
                    row.product_parameter = product.product_parameter;
                    row.state = product.state;
                    row.source = product.source;
                    row.product_trade_name.chinese_name = '';
                    row.product_trade_name.english_name = '';
                    row.comment = product.product_cn_customs_description;
                    row.net_weight = product.net_weight;
                    row.gross_weight = product.gross_weight;
                    row.product_customs_info.code = '';
                    row.product_customs_info.tariff_rate = '';
                    row.extra_import_tariff = product.extra_import_tariff;
                    row.origin_of_country = product.origin_of_country;
                    if (product.is_verify) row.is_verify = product.is_verify;
                    if (product.quotation_comment) row.quotation_comment = {
                        comment: product.quotation_comment.comment,
                        comment_no: product.quotation_comment.comment_no,
                        comment_type: product.quotation_comment.comment_type,
                    };

                    if (product.product_trade_name) {
                        row.product_trade_name.chinese_name = product.product_trade_name.product_cn_name;
                        row.product_trade_name.english_name = product.product_trade_name.product_en_name;
                    }
                    if (product.product_customs_info_id) {
                        row.product_customs_info.code = product.product_customs_info.customs_cn_code;
                        row.product_customs_info.tariff_rate = product.product_customs_info.import_cn_tariffs;
                    }

                    let thisProductHasNumber = 0;
                    this.productListData.forEach((item) => {
                        if (item.product_id === product.product_id) {
                            thisProductHasNumber++;
                        }
                    });

                    if (product.is_valid === 0 || product.is_replaced === 1 || product.is_3C === 1 || thisProductHasNumber > 1) {
                        let errorMsg = '';
                        if (thisProductHasNumber > 1) {
                            errorMsg = '已添加有相同产品，不可重复添加！'
                        } else if (product.is_replaced === 1) {
                            if (product.replace_list && product.replace_list.length>0) {
                                errorMsg = '该产品已经被替代，请选择替代产品：';
                                product.replace_list.forEach((item)=>{
                                    errorMsg += '<p>型号：' + item.product_name + '，' + '订货号：' + item.product_order_no + '</p>'
                                });
                            } else {
                                errorMsg = '该产品已经被替代，不能选择！'
                            }
                        } else if (product.is_valid === 0) {
                            if (product.correct_list && product.correct_list.length>0) {
                                errorMsg = '该产品无效，请选择正确产品：';
                                product.correct_list.forEach((item)=>{
                                    errorMsg += '<p>型号：' + item.product_name + '，' + '订货号：' + item.product_order_no + '</p>'
                                });
                            } else {
                                errorMsg = '该产品无效，不能选择！'
                            }
                        } else if (product.is_3C === 1) {
                            errorMsg = '不能选择3C产品！'
                        }
                        this.$message({
                            showClose: true,
                            message: '<div style="line-height: 1.6em;">'+errorMsg+'</div>',
                            dangerouslyUseHTMLString:true,
                            type: 'error'
                        });
                        this.$nextTick(()=>{
                            row.product = null;
                            row.product_id = null;
                            row.product_name = '';
                            row.product_order_no = '';
                            row.product_parameter = '';
                            row.product_trade_name.chinese_name = '';
                            row.product_trade_name.english_name = '';
                            row.comment = '';
                            row.net_weight = '';
                            row.gross_weight = '';
                            row.product_customs_info.code = '';
                            row.product_customs_info.tariff_rate = '';
                            row.extra_import_tariff = '';
                            row.origin_of_country = '';
                            row.quotation_comment = null;
                        });
                        return
                    }
                } else {
                    row.product = null;
                    row.product_id = null;
                    row.product_trade_name.chinese_name = '';
                    row.product_trade_name.english_name = '';
                    row.comment = '';
                    row.net_weight = '';
                    row.gross_weight = '';
                    row.product_customs_info.code = '';
                    row.product_customs_info.tariff_rate = '';
                    row.extra_import_tariff = '';
                    row.origin_of_country = '';
                    row.quotation_comment = null;
                }

            },
            //当离开输入框时，自动判断是否已经在检索结果中存在该型号，防止用户只输入不选择，而导致不会自动计算价格；
            productBlur(selectOption, row) {
                if (selectOption && selectOption.length) {
                    for (let i = 0; i < selectOption.length; i++) {
                        if (selectOption[i].product_name.replace(/ /g,'') === row.product_name.replace(/ /g,'') && selectOption[i].product_order_no.replace(/ /g,'') === row.product_order_no.replace(/ /g,'')) {
                            row.product = selectOption[i];
                            this.productSelect(row);
                            break
                        }
                    }
                }
            },
        }
    }
</script>
