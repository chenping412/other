<template>
    <div class="inquiry-price-detail-product">

        <el-card>
            <div slot="header" class="clearfix">
                <h3 class="left">产品明细</h3>
                <div class="right">
                    <el-button type="primary" @click="clickAdd()">新增产品</el-button>
                </div>
            </div>

            <el-form :model="editRowForm" label-width="0">
                <el-table :data="productListData" row-key="id" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号">
                        <template slot-scope="scope">
                                <AutoCompleteProduct
                                        :disabled="scope.row.id"
                                        :productId.sync="scope.row.product_id"
                                        :productName.sync="scope.row.product_name"
                                        :productOrderNo.sync="scope.row.product_order_no"
                                        :product.sync="scope.row.product"
                                        :data="{brand_name: detailForm.brand.name}"
                                        @select="productSelect(scope.row)"
                                        @blur="productBlur($event,scope.row)"
                                        :notSearch="!detailForm.brand || !detailForm.brand.id"
                                        valueKey="product_name">
                                </AutoCompleteProduct>
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号">
                        <template slot-scope="scope">
                                <AutoCompleteProduct
                                        :disabled="scope.row.id"
                                        :productId.sync="scope.row.product_id"
                                        :productName.sync="scope.row.product_name"
                                        :productOrderNo.sync="scope.row.product_order_no"
                                        :product.sync="scope.row.product"
                                        :data="{brand_name: detailForm.brand.name}"
                                        @select="productSelect(scope.row)"
                                        @blur="productBlur($event,scope.row)"
                                        :notSearch="!detailForm.brand || !detailForm.brand.id"
                                        valueKey="product_order_no">
                                </AutoCompleteProduct>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数">
                        <template slot-scope="scope">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        v-model="scope.row.product_parameter"
                                        placeholder="参数">
                                </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="净重/毛重">
                        <template slot-scope="scope">
                            <p>{{(scope.row.net_weight && scope.row.net_weight!=='0' ? scope.row.net_weight+'kg' : null) | defaultStr}}</p>
                            <p>
                                <span v-if="(!scope.row.gross_weight||scope.row.gross_weight==='0') && scope.row.estimated_weight">{{scope.row.estimated_weight | defaultStr}}kg</span>
                                <span v-else>{{(scope.row.gross_weight && scope.row.gross_weight!=='0' ? scope.row.gross_weight+'kg' : null) | defaultStr}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="关税">
                        <template slot-scope="scope">
                            <p>
                                <span v-if="!scope.row.product_customs_info.tariff_rate && scope.row.product_customs_info.tariff_rate!==0 && (scope.row.forecast_import_tariff||scope.row.forecast_import_tariff===0)">{{scope.row.forecast_import_tariff | percent}}</span>
                                <span v-else>{{scope.row.product_customs_info.tariff_rate | percent | inquiryPriceNormalText}}</span>
                                <span class="red" v-if="scope.row.extra_import_tariff"> + {{scope.row.extra_import_tariff | percent}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" align="right">
                        <template slot-scope="scope">
                                <InputNumber
                                        :value.sync="scope.row.prodcut_quotation.quantity"
                                        :integer="true"
                                        :min="1"
                                        placeholder="数量">
                                </InputNumber>
                        </template>
                    </el-table-column>
                    <el-table-column width="200px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="warning" plain
                                       @click="clickDeleteRow(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="padding-top-10">
                    <el-button type="primary" @click="clickAdd()">新增产品</el-button>
                </div>
            </el-form>
        </el-card>

    </div>
</template>

<script>

    export default {
        components: {},
        props: [
            'detailForm',
        ],
        data() {
            return {

                productListData: [],

                editRowForm: {},

                productItemTemplate: {
                    "brand_id": 0,
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
                }


            }
        },
        watch: {

        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.productListData = [];
                this.clickAdd();
            },

            clickAdd() {
                this.editRowForm = JSON.parse(JSON.stringify(this.productItemTemplate));
                this.editRowForm.brand_id = this.detailForm.brand.id;
                this.productListData.push(this.editRowForm);
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

            //删除行，不提交到服务器
            clickDeleteRow($index) {
                this.productListData.splice($index, 1);
            },


        }
    }
</script>

<style lang="scss">

</style>
