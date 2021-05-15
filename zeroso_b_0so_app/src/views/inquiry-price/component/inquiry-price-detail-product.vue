<template>
    <div class="inquiry-price-detail-product" v-loading="loading">

        <el-card>
            <div slot="header" class="clearfix">
                <h3 class="left">产品明细</h3>
                <div class="right">
                    <inquiry-price-detail-product-update-all-price
                            v-if="queryId && supplierIs0soCompany && !isAlreadySignedContract && detailForm.inquiry_quote_state!=='CANCELED'"
                            class="margin-right-20"
                            :productListData="productListData"
                            :hasEditAction="hasEditAction"
                            @getComputedPrice="getComputedPrice"
                            @clickSaveDate="clickSaveDate"
                            @update="$emit('update')">
                    </inquiry-price-detail-product-update-all-price>


                    <el-button type="primary" :disabled="queryId && hasEditAction" @click="clickAdd()"
                               v-if="!isAlreadySignedContract && detailForm.inquiry_quote_state!=='CANCELED'">新增产品
                    </el-button>
                </div>
            </div>

            <el-form :model="editRowForm" :rules="queryId ? editRowFormRule : null" ref="editRowForm" label-width="0">
                <el-table :data="productListData" :row-class-name="tableRowClassName" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号" width="200">
                        <template slot-scope="scope">
                            <div v-if="(scope.row.isEdit&&!scope.row.id) || !queryId">
                                <el-form-item prop="product_name">
                                    <AutoCompleteProduct
                                            v-if="!detailForm.brand.all_products_included"
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
                                    <SelectProductSingle
                                            v-if="detailForm.brand.all_products_included"
                                            :disabled="scope.row.id"
                                            :product.sync="scope.row.product"
                                            :productId.sync="scope.row.product_id"
                                            :option="scope.row.product ? [scope.row.product] : null"
                                            :data="{brand_name: detailForm.brand.name}"
                                            :isProductChangeInt="true"
                                            :isSelectAllProductInfo="true"
                                            :labelOnlyShowProductName="true"
                                            @change="productSelect(scope.row)">
                                    </SelectProductSingle>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <p>{{scope.row.product_name | defaultStr}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号" width="200">
                        <template slot-scope="scope">
                            <div v-if="(scope.row.isEdit&&!scope.row.id) || !queryId">
                                <el-form-item prop="product_order_no">
                                    <AutoCompleteProduct
                                            v-if="!detailForm.brand.all_products_included"
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
                                    <SelectProductSingle
                                            v-if="detailForm.brand.all_products_included"
                                            :disabled="scope.row.id"
                                            :product.sync="scope.row.product"
                                            :productId.sync="scope.row.product_id"
                                            :option="scope.row.product ? [scope.row.product] : null"
                                            :data="{brand_name: detailForm.brand.name}"
                                            :isProductChangeInt="true"
                                            :isSelectAllProductInfo="true"
                                            :labelOnlyShowProductOrderNo="true"
                                            @change="productSelect(scope.row)">
                                    </SelectProductSingle>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <p>{{scope.row.product_order_no | defaultStr}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isEdit || !queryId">
                                <el-form-item>
                                    <el-input type="textarea"
                                              :rows="4"
                                              v-model="scope.row.product_parameter"
                                              :disabled="scope.row.state==='official_product'"
                                              placeholder="参数">
                                    </el-input>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <el-tooltip effect="light" placement="top">
                                    <span class="nowrap">{{scope.row.product_parameter}}</span>
                                    <pre slot="content" class="scroll" style="max-height: 500px;" v-html="scope.row.product_parameter"></pre>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="净重/毛重">
                        <template slot-scope="scope">
                            <p>{{scope.row.net_weight | defaultStr}}kg</p>
                            <p>{{scope.row.gross_weight | defaultStr}}kg</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="货期/天" align="right">
                        <template slot-scope="scope">
                            <el-form-item v-if="scope.row.isEdit || !queryId">
                                <InputNumber :value.sync="scope.row.prodcut_quotation.shipment_period" :integer="true"
                                             :disabled="supplierIs0soCompany || supplierIsInternalButNotOsoCompany"
                                             placeholder="货期"></InputNumber>
                            </el-form-item>
                            <p v-else>{{scope.row.prodcut_quotation.shipment_period | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" align="right" min-width="125px">
                        <template slot-scope="scope">
                            <el-form-item prop="prodcut_quotation.quantity" v-if="scope.row.isEdit || !queryId">
                                <InputNumber :value.sync="scope.row.prodcut_quotation.quantity" :integer="true" :min="1"
                                             :disabled="customerIsInternal"
                                             placeholder="数量" @change="quantityChange(scope.row)"></InputNumber>
                            </el-form-item>
                            <div v-else>数量：{{scope.row.prodcut_quotation.quantity | defaultStr}}</div>

                            <div class="red"
                               v-if="scope.row.productMinQty && scope.row.prodcut_quotation.quantity<scope.row.productMinQty">
                                <span class="inline-block">最低起订量：</span><span class="inline-block">{{scope.row.productMinQty}}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column width="420">
                        <template v-slot:header>
                            <table class="table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>{{!supplierIs0soCompany || isAlreadyExpenseApproved ? '含税单价' : '未税单价'}}</th>
                                    <th>含税总价</th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <table class="table">
                                <tbody>
                                <tr>
                                    <td>
                                        <span>采购价</span>
                                        <inquiry-price-detail-product-show-tiered-price
                                                v-if="supplierIs0soCompany && scope.row.prodcut_quotation.quote_supplier_id && scope.row.id"
                                                :isAlreadyExpenseApproved="isAlreadyExpenseApproved"
                                                :queryId="queryId"
                                                :productLine="scope.row"
                                                :productMinQty.sync="scope.row.productMinQty"
                                                :detailForm="detailForm">
                                        </inquiry-price-detail-product-show-tiered-price>
                                    </td>
                                    <td>
                                        <InputNumber v-if="(scope.row.isEdit || !queryId) && !supplierIs0soCompany"
                                                     :value.sync="scope.row.prodcut_quotation.procurement.price"
                                                     :disabled="hasNoSupplier || supplierIsInternalButNotOsoCompany"
                                                     @change="priceComputed(scope.row)"></InputNumber>
                                        <span v-else>
                                            <span v-if="supplierIs0soCompany && isAlreadyExpenseApproved">
                                                {{scope.row.prodcut_quotation.procurement.cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}
                                            </span>
                                            <span v-else>{{scope.row.prodcut_quotation.procurement.price | formatMoney(supplierIs0soCompany ? 'EUR' : 'CNY') | inquiryPriceNormalText}}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <span v-if="supplierIs0soCompany && isAlreadyExpenseApproved">
                                            {{scope.row.prodcut_quotation.procurement.total_cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}
                                        </span>
                                        <span v-else>{{scope.row.prodcut_quotation.procurement.total_price_with_tariff | formatMoney(supplierIs0soCompany ? 'EUR' : 'CNY') | inquiryPriceNormalText}}</span>
                                    </td>
                                </tr>
                                <tr v-if="menuHasPartner">
                                    <td>销售价</td>
                                    <td>
                                        <InputNumber v-if="(scope.row.isEdit || !queryId) && !supplierIs0soCompany"
                                                     :value.sync="scope.row.prodcut_quotation.sales.price"
                                                     :disabled="hasNoCustomer"
                                                     @change="priceComputed(scope.row)"></InputNumber>
                                        <div v-else>
                                            <span v-if="supplierIs0soCompany && isAlreadyExpenseApproved">
                                                {{scope.row.prodcut_quotation.sales.cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}
                                            </span>
                                            <span v-else>
                                                {{scope.row.prodcut_quotation.sales.price | formatMoney(supplierIs0soCompany ? 'EUR' : 'CNY') | inquiryPriceNormalText}}
                                            </span>

                                            <inquiry-price-detail-product-edit-price
                                                    v-if="queryId && !scope.row.isEdit && supplierIs0soCompany && scope.row.prodcut_quotation.sales.price
                                                    && !scope.row.mark_as_deleted && scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED' && detailForm.inquiry_quote_state!=='CANCELED'
                                                    && !isAlreadyExpenseApproved && !hasNoCustomer"
                                                    :productLine="scope.row"
                                                    :detailForm="detailForm"
                                                    @saveProductLine="clickSaveDate">
                                            </inquiry-price-detail-product-edit-price>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="supplierIs0soCompany && isAlreadyExpenseApproved">
                                            <span>{{scope.row.prodcut_quotation.sales.total_cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}</span>

                                            <inquiry-price-detail-product-edit-rmb-total-price
                                                    v-if="queryId && !scope.row.isEdit && !scope.row.mark_as_deleted && scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED' && detailForm.inquiry_quote_state!=='CANCELED'
                                                    && !isAlreadySignedContract && !hasNoCustomer"
                                                    :queryId="queryId"
                                                    :productLine="scope.row"
                                                    :detailForm="detailForm"
                                                    @update="$emit('update')">
                                            </inquiry-price-detail-product-edit-rmb-total-price>
                                        </div>
                                        <span v-else>{{scope.row.prodcut_quotation.sales.total_price_with_tariff | formatMoney(supplierIs0soCompany ? 'EUR' : 'CNY') | inquiryPriceNormalText}}</span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div>
                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='QUOTE_REFUSED'">该产品不报价,请修改或删除该产品！</el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.mark_as_ccc">该产品为3C产品,请修改或删除该产品！</el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='EXPIRE'">该产品 供应商报价 已过期,请删除或更新价格！</el-tag>
                            </div>
                            <div class="padding-top-10">
                                <FileListShow
                                        :fileList.sync="scope.row.file_id_list"
                                        :showDelete="scope.row.isEdit || !queryId">
                                </FileListShow>
                                <FileUpload
                                        v-if="scope.row.isEdit || !queryId"
                                        :autoUpload="true"
                                        :updateFileList.sync="scope.row.file_id_list"
                                        :show-file-list="false"
                                        :fileNamePrefix="detailForm.brand ? detailForm.brand.name+'-'+(scope.$index+1)+'-' : null"
                                        :accept="['image/gif','image/jpeg','image/png']"
                                        module_id="0"
                                        module_name="order_line"
                                        subsystem="inquiry"
                                        ref="order_line">
                                </FileUpload>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="200px">
                        <template slot-scope="scope">
                            <div v-if="scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED' && detailForm.inquiry_quote_state!=='CANCELED'">
                                <div v-if="!isAlreadySignedContract && queryId">
                                    <div v-if="!scope.row.mark_as_deleted">
                                        <div v-if="scope.row.isEdit">
                                            <el-button size="mini" type="success" @click="clickSaveDate(scope.row)">保存
                                            </el-button>
                                            <el-button size="mini" type="primary" plain
                                                       @click="clickCancelEdit(scope.row)">取消
                                            </el-button>
                                        </div>
                                        <div v-else>
                                            <el-button size="mini" type="primary" :disabled="hasEditAction"
                                                       v-if="!scope.row.mark_as_ccc && scope.row.product_quote_state!=='QUOTE_REFUSED'"
                                                       @click="clickEdit(scope.row)">编辑
                                            </el-button>
                                            <el-button size="mini" type="warning" plain :disabled="hasEditAction"
                                                       @click="clickDelete(scope.row.product_id,true)">删除
                                            </el-button>
                                            <el-button size="mini"
                                                       v-if="supplierIs0soCompany && !scope.row.mark_as_ccc && scope.row.product_quote_state!=='QUOTE_REFUSED'"
                                                       :disabled="hasEditAction"
                                                       title="如果产品报价不正常，或者询报价单状态不正常，可以使用该操作，重新获取产品价格"
                                                       @click="updatePrice(scope.row)">更新价格
                                            </el-button>
                                        </div>
                                    </div>
                                    <el-button size="mini" type="success" plain
                                               v-if="scope.row.mark_as_deleted && !scope.row.mark_as_ccc && scope.row.product_quote_state!=='QUOTE_REFUSED'"
                                               :disabled="hasEditAction" @click="clickDelete(scope.row.product_id)">恢复
                                    </el-button>
                                </div>
                                <el-button size="mini" type="warning" plain v-if="!queryId"
                                           @click="clickDeleteRow(scope.$index)">删除
                                </el-button>
                            </div>

                            <div v-if="scope.row.product_quote_state==='INVALID' || scope.row.product_quote_state==='REPLACED'">
                                <p>
                                    被标记为：{{scope.row.product_quote_state==='INVALID'?'无效产品':'被替代产品'}}
                                </p>
                                <template v-if="scope.row.replace_product">
                                    <p>正确型号为：</p>
                                    <p>
                                        型号：
                                        <router-link style="color: #409EFF;" target="_blank" :to="'/product/product/detail?id='+scope.row.replace_product.product_id">
                                            {{scope.row.replace_product.type_no}}
                                        </router-link>
                                    </p>
                                    <p>
                                        订货号：
                                        <router-link style="color: #409EFF;" target="_blank" :to="'/product/product/detail?id='+scope.row.replace_product.product_id">
                                            {{scope.row.replace_product.order_no}}
                                        </router-link>
                                    </p>
                                    <p>
                                        <el-button size="mini" plain @click="clickAddReplaceProduct(scope.row.replace_product,scope.row)">
                                            添加正确型号
                                        </el-button>
                                    </p>

                                </template>
                            </div>

                            <p v-if="scope.row.quotation_comment && (scope.row.product_quote_state==='QUOTE_REFUSED' || scope.row.product_quote_state==='INVALID')">
                                备注：{{scope.row.quotation_comment.comment_type | productQuotationCommentType}}，
                                {{scope.row.quotation_comment.comment_no |
                                productQuotationComment(scope.row.quotation_comment.comment_type,scope.row.quotation_comment.comment)}}
                            </p>
                        </template>

                    </el-table-column>
                </el-table>

                <div class="padding-top-10">
                    <el-button type="primary" @click="clickAdd()"
                               v-if="!isAlreadySignedContract">新增产品
                    </el-button>

                    <span class="margin-left-20" v-if="detailForm.brand.all_products_included">
                        注意：此品牌产品信息完整，只能从产品下拉列表中选择，不允许新建新型号。若确实需要新建，请联系零搜客服解决!
                    </span>
                </div>
            </el-form>
        </el-card>

    </div>
</template>

<script>

    import InquiryPriceDetailProductEditPrice from "./inquiry-price-detail-product-edit-price";
    import InquiryPriceDetailProductEditRmbTotalPrice from "./inquiry-price-detail-product-edit-rmb-total-price";
    import InquiryPriceDetailProductShowTieredPrice from "./inquiry-price-detail-product-show-tiered-price";
    import InquiryPriceDetailProductUpdateAllPrice from "./inquiry-price-detail-product-update-all-price";

    export default {
        components: {
            InquiryPriceDetailProductUpdateAllPrice,
            InquiryPriceDetailProductShowTieredPrice,
            InquiryPriceDetailProductEditRmbTotalPrice, InquiryPriceDetailProductEditPrice
        },
        props: [
            'queryId', 'detailForm', 'isAlreadyExpenseApproved', 'isAlreadySignedContract', 'supplierIs0soCompany',
            'hasEditAction', 'hasNoCustomer', 'hasNoSupplier', 'supplierIsInternalButNotOsoCompany', 'customerIsInternal', 'menuHasPartner'
        ],
        data() {
            let self = this;
            return {
                loading: false,

                productListData: [],

                editRowForm: {},
                editRowFormRule: {
                    product_name: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.editRowForm.product_name) {
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
                                if (!self.editRowForm.product_order_no) {
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

                productItemTemplate: {
                    file_id_list: [],

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
            queryId() {
                this.init()
            },
            detailForm() {
                this.init()
            },
            hasNoSupplier(val) {
                if (val) {
                    let productListData = JSON.parse(JSON.stringify(this.productListData));
                    for (let i = 0; i < productListData.length; i++) {
                        let row = productListData[i];
                        row.prodcut_quotation.procurement.price = null;
                        row.prodcut_quotation.procurement.tariff = null;
                        row.prodcut_quotation.procurement.extra_import_tariff = null;
                        row.prodcut_quotation.procurement.total_price_with_tariff = null;
                    }
                    this.productListData = productListData;
                }
            },
            hasNoCustomer(val) {
                if (val) {
                    let productListData = JSON.parse(JSON.stringify(this.productListData));
                    for (let i = 0; i < productListData.length; i++) {
                        let row = productListData[i];
                        row.prodcut_quotation.sales.price = null;
                        row.prodcut_quotation.sales.tariff = null;
                        row.prodcut_quotation.sales.extra_import_tariff = null;
                        row.prodcut_quotation.sales.total_price_with_tariff = null;
                    }
                    this.productListData = productListData;
                }
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (!this.queryId) {
                    this.productListData = [];
                    this.clickAdd();
                } else if (this.detailForm.products) {
                    this.productListData = this.detailForm.products;
                } else {
                    this.productListData = [];
                }
            },

            //新建
            clickAdd() {
                if (this.queryId) {
                    for (let i = 0; i < this.productListData.length; i++) {
                        if (this.productListData[i].isEdit) {
                            this.$message({
                                showClose: true,
                                message: '新增行之前，请先保存正在修改行！',
                                type: 'warning'
                            });
                            return
                        }
                    }
                }
                this.editRowForm = JSON.parse(JSON.stringify(this.productItemTemplate));
                this.editRowForm.isEdit = true;
                this.editRowForm.brand_id = this.detailForm.brand.id;
                if (this.hasNoSupplier) {
                    this.editRowForm.prodcut_quotation.procurement = {
                        "price": null,
                        "tariff": null,
                        "extra_import_tariff": null,
                        "total_price_with_tariff": null,
                    }
                }
                if (this.hasNoCustomer) {
                    this.editRowForm.prodcut_quotation.sales = {
                        "price": null,
                        "tariff": null,
                        "extra_import_tariff": null,
                        "total_price_with_tariff": null,
                    }
                }

                this.productListData.push(this.editRowForm);
                this.$emit('update:hasEditAction', true)
            },
            //编辑
            clickEdit(row) {
                for (let i = 0; i < this.productListData.length; i++) {
                    if (this.productListData[i].isEdit) {
                        this.$message({
                            showClose: true,
                            message: '只允许同时修改一行信息，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                this.editRowForm = row;
                this.editRowForm.brand_id = this.detailForm.brand.id;
                row.isEdit = true;
                this.$emit('update:hasEditAction', true)
            },
            //取消编辑
            clickCancelEdit(row) {
                row.isEdit = false;
                this.$emit('update');
                this.editRowForm = {};
            },

            productSelect(row) {
                let product = row.product;
                if (product) {
                    row.product_id = product.id;
                    row.product_name = product.product_name;
                    row.product_order_no = product.product_order_no;
                    row.product_parameter = product.product_parameter;
                    row.state = product.state;
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
                        comment_no: product.quotation_comment.commentNo,
                        comment_type: product.quotation_comment.commentType,
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

                    if ((product.state && (product.state === 'no_such_product' || product.state === 'replaced_product'))
                            || product.is_valid === 0 || product.is_replaced === 1 || product.is_3C === 1
                            || thisProductHasNumber > 1) {
                        let errorMsg = '';
                        if (thisProductHasNumber > 1) {
                            errorMsg = '已添加有相同产品，不可重复添加！'
                        } else if (product.is_replaced === 1) {
                            if (product.correct_product) {
                                errorMsg = '该产品已经被替代，请选择替代产品：' + (product.correct_product.product_name ? '型号 ' + product.correct_product.product_name : '')
                                        + '，' + (product.correct_product.product_order_no ? '订货号 ' + product.correct_product.product_order_no : '')
                            } else {
                                errorMsg = '该产品已经被替代，不能选择！'
                            }
                        } else if (product.is_valid === 0) {
                            errorMsg = '不能选择无效产品！'
                        } else if (product.is_3C === 1) {
                            errorMsg = '不能选择3C产品！'
                        } else {
                            errorMsg = '不能选择的产品状态：无此产品、被替代产品！'
                        }
                        this.$message({
                            showClose: true,
                            message: errorMsg,
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


                this.quantityChange(row);
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


            quantityChange(row) {
                if (this.supplierIs0soCompany) {
                    if (row.product_id && row.prodcut_quotation.quantity) {
                        this.getComputedPrice(row)
                    } else {
                        row.prodcut_quotation.procurement.price = null;
                        row.prodcut_quotation.procurement.tariff = null;
                        row.prodcut_quotation.procurement.extra_import_tariff = null;
                        row.prodcut_quotation.procurement.total_price_with_tariff = null;
                        row.prodcut_quotation.sales.price = null;
                        row.prodcut_quotation.sales.tariff = null;
                        row.prodcut_quotation.sales.extra_import_tariff = null;
                        row.prodcut_quotation.sales.total_price_with_tariff = null;
                    }
                } else {
                    this.setPriceTariff(row);
                }
            },

            //获取计算出的价格
            getComputedPrice(row, callback) {
                let self = this;
                if (self.queryId) {
                    self.$http({
                        url: self.$api.inquiry_v6_quotations + '/' + self.queryId + '/products/' + row.product_id + '/price',
                        data: {
                            productQuantity: row.prodcut_quotation.quantity,
                        },
                        success: function (data) {
                            row.prodcut_quotation.procurement.cny_price_with_tariff = null;
                            row.prodcut_quotation.procurement.total_cny_price_with_tariff = null;
                            row.prodcut_quotation.sales.cny_price_with_tariff = null;
                            row.prodcut_quotation.sales.total_cny_price_with_tariff = null;
                            if (data.procurement) {
                                row.prodcut_quotation.procurement.price = data.procurement.selling_price;
                                row.prodcut_quotation.procurement.tariff = data.procurement.selling_tariff;
                                row.prodcut_quotation.procurement.extra_import_tariff = data.procurement.extra_import_tariff;
                                row.prodcut_quotation.procurement.total_price_with_tariff = data.procurement.selling_amounts_with_tariff;
                            }
                            if (data.sales && !self.hasNoCustomer) {
                                row.prodcut_quotation.sales.price = data.sales.selling_price;
                                row.prodcut_quotation.sales.tariff = data.sales.selling_tariff;
                                row.prodcut_quotation.sales.extra_import_tariff = data.sales.extra_import_tariff;
                                row.prodcut_quotation.sales.total_price_with_tariff = data.sales.selling_amounts_with_tariff;
                            } else {
                                row.prodcut_quotation.sales.price = null;
                                row.prodcut_quotation.sales.tariff = null;
                                row.prodcut_quotation.sales.extra_import_tariff = null;
                                row.prodcut_quotation.sales.total_price_with_tariff = null;
                            }
                            if (data.shipment_period) row.prodcut_quotation.shipment_period = data.shipment_period;
                            if (data.quote_supplier_id) row.prodcut_quotation.quote_supplier_id = data.quote_supplier_id;
                            if (data.min_qty) row.prodcut_quotation.min_qty = data.min_qty;

                            if (callback) callback();
                        }
                    })
                }
            },

            //供应商为非零搜集团，设置关税，并计算含关税总价
            setPriceTariff(row) {
                row.prodcut_quotation.procurement.tariff = null;
                row.prodcut_quotation.procurement.extra_import_tariff = null;
                row.prodcut_quotation.sales.tariff = null;
                row.prodcut_quotation.sales.extra_import_tariff = null;
                this.priceComputed(row)
            },
            priceComputed(row) {
                row.prodcut_quotation.procurement.total_price_with_tariff = this.hasNoSupplier ? null : (row.prodcut_quotation.procurement.price * row.prodcut_quotation.quantity).myRound(2);
                row.prodcut_quotation.sales.total_price_with_tariff = this.hasNoCustomer ? null : (row.prodcut_quotation.sales.price * row.prodcut_quotation.quantity).myRound(2);
            },

            //更新产品价格
            updatePrice(row) {
                let self = this;
                self.$confirm('确认更新价格吗？更新价格，将按照该产品最新报价重新进行计算，不可恢复！', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.getComputedPrice(row, () => {
                                self.clickSaveDate(row);
                            })
                        }
                    }
                })

            },

            //父组件使用函数，不可删除
            supplierChange() {
                for (let i = 0; i < this.productListData.length; i++) {
                    let row = this.productListData[i];
                    if (this.detailForm.supplier.company.account_company_id && this.$store.state.zerosoCompany[this.detailForm.supplier.company.account_company_id] && row.product_id) {
                        this.getComputedPrice(row)
                    } else {
                        this.setPriceTariff(row);
                    }
                }
            },

            clickSaveDate(row,callback,hideMessageTip) {
                let self = this;
                self.$refs.editRowForm.validate(function (valid) {
                    if (valid) {
                        if(!hideMessageTip) self.loading = true;
                        let product_item = JSON.parse(JSON.stringify(row));
                        if(!product_item.attachments)product_item.attachments={};
                        product_item.attachments.file_id_list = [];
                        for (let i = 0; i < product_item.file_id_list.length; i++) {
                            product_item.attachments.file_id_list.push(JSON.stringify(product_item.file_id_list[i]));
                        }
                        product_item.file_id_list = undefined;
                        product_item.isEdit = undefined;
                        self.$http({
                            url: row.id ? self.$api.inquiry_v6_quotations + '/' + self.queryId + '/products/' + row.product_id : self.$api.inquiry_v6_quotations + '/' + self.queryId + '/products',
                            type: row.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: {
                                product_item: product_item
                            },
                            success: function (data) {
                                if(!hideMessageTip){
                                    self.loading = false;
                                    if (data.sheet_id) {
                                        self.$message({
                                            showClose: true,
                                            message: '保存成功！',
                                            type: 'success'
                                        });
                                        row.isEdit = false;
                                        self.$emit('update');
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '保存失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                                if(callback) callback();
                            },error(){
                                if(callback) callback();
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },

            //删除
            clickDelete(product_id, isDelete) {
                let self = this;
                if (isDelete) {
                    let m = 0;
                    for (let i = 0; i < self.productListData.length; i++) {
                        if (!self.productListData[i].mark_as_deleted && self.productListData[i].product_quote_state !== 'INVALID' && self.productListData[i].product_quote_state !== 'REPLACED') {
                            m++
                        }
                    }
                    if (m <= 1) {
                        self.$message({
                            showClose: true,
                            message: '至少需要保留一个产品！',
                            type: 'error'
                        });
                        return
                    }

                }
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId + '/products/' + product_id,
                    type: 'DELETE',
                    success: function (data) {
                        self.loading = false;
                        if (data.sheet_id) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.$emit('update');
                        } else {
                            self.$message({
                                showClose: true,
                                message: '操作失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },

            //删除行，不提交到服务器
            clickDeleteRow($index) {
                this.productListData.splice($index, 1);
            },

            //快速添加正确型号至产品行中
            clickAddReplaceProduct(replace_product,row) {
                let self = this;
                self.$confirm('确认将该正确型号添加至当前询报价单吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            let addRow = JSON.parse(JSON.stringify(self.productItemTemplate));
                            addRow.brand_id = self.detailForm.brand.id;
                            if (self.hasNoSupplier) {
                                addRow.prodcut_quotation.procurement = {
                                    "price": null,
                                    "tariff": null,
                                    "extra_import_tariff": null,
                                    "total_price_with_tariff": null,
                                }
                            }
                            if (self.hasNoCustomer) {
                                addRow.prodcut_quotation.sales = {
                                    "price": null,
                                    "tariff": null,
                                    "extra_import_tariff": null,
                                    "total_price_with_tariff": null,
                                }
                            }
                            addRow.product_id = replace_product.product_id;
                            addRow.product_name = replace_product.type_no;
                            addRow.product_order_no = replace_product.order_no;
                            addRow.prodcut_quotation.quantity = row.prodcut_quotation.quantity;
                            for(let i=0;i<self.productListData.length;i++){
                                if (self.productListData[i].product_id === addRow.product_id) {
                                    self.$message({
                                        showClose: true,
                                        message: '已添加有相同产品，不可重复添加！',
                                        type: 'error'
                                    });
                                    return
                                }
                            }
                            self.getComputedPrice(addRow,()=>{
                                self.clickSaveDate(addRow);
                            });
                        }
                    }
                })

            },


            tableRowClassName({row}) {
                if (row.product_quote_state === 'INVALID') {
                    return 'row-invalid';
                } else if (row.mark_as_deleted) {
                    return 'row-delete';
                } else if (row.product_quote_state === 'REPLACED') {
                    return 'row-replaced';
                }
                return '';
            },
        }
    }
</script>

<style lang="scss">
    .inquiry-price-detail-product {
        margin-bottom: 100px;

        .table {
            border-collapse: collapse;
            width: 100%;

            th, td {
                width: 36%;
                text-align: right;
                padding: 4px 10px;
            }

            th {
                border: none;
            }

            td {
                background-color: #ffffff !important;
                border: 1px solid #dddddd;
            }

            th:first-child,
            td:first-child {
                text-align: center;
                width: 28%;
            }
        }

        .row-delete {
            color: #CCCCCC;
        }

        .row-invalid,
        .row-replaced {
            color: #999999;
            td {
                background-color: #dddddd !important;
                a {
                    color: #999999;
                }
            }
        }
    }

</style>
