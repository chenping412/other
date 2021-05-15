<template>
    <div class="inquiry-price-detail-product" v-loading="loading">

        <el-card>
            <div slot="header" class="clearfix">
                <h3 class="left">产品明细</h3>
                <div class="right">
                    <inquiry-quotation-detail-product-update-all-price
                            v-if="isZerosoCreated && queryId && !isAlreadySignedContract && detailForm.inquiry_quote_state!=='CANCELED'"
                            :queryId="queryId"
                            @update="$emit('update')">
                    </inquiry-quotation-detail-product-update-all-price>
                </div>
            </div>

            <el-table :data="productListData" :row-class-name="tableRowClassName" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号/订货号/参数">
                        <template slot-scope="scope">
                            <div>
                                <p>
                                    <router-link :to="'/product/product/detail?id='+scope.row.product_id"
                                                 target="_blank" class="blue">{{scope.row.product_name | defaultStr}}
                                    </router-link>
                                    <a v-if="scope.row.product_name"
                                       :title="'搜索'+detailForm.brand.name+' '+scope.row.product_name"
                                       class="icon-google-search"
                                       target="_blank"
                                       :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.product_name">
                                    </a>
                                </p>
                                <p>
                                    <router-link :to="'/product/product/detail?id='+scope.row.product_id"
                                                 target="_blank" class="blue">{{scope.row.product_order_no |
                                        defaultStr}}
                                    </router-link>
                                    <a v-if="scope.row.product_order_no"
                                       :title="'搜索'+detailForm.brand.name+' '+scope.row.product_order_no"
                                       class="icon-google-search"
                                       target="_blank"
                                       :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.product_order_no">
                                    </a>
                                </p>
                                <p>
                                    <el-tooltip effect="light" placement="top">
                                        <span class="nowrap">{{scope.row.product_parameter}}</span>
                                        <pre slot="content" class="scroll" style="max-height: 500px;" v-html="scope.row.product_parameter"></pre>
                                    </el-tooltip>
                                </p>
                                <inquiry-quotation-detail-product-name-update
                                        :key="scope.row.id"
                                        :row="scope.row"
                                        @update="$emit('update')">
                                </inquiry-quotation-detail-product-name-update>
                                <el-tag type="danger" effect="dark" v-if="scope.row.mark_as_deleted">已删除</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="净重/毛重/关税">
                        <template slot-scope="scope">
                            <p>{{(scope.row.net_weight && scope.row.net_weight!=='0' ? scope.row.net_weight+'kg' : null) | defaultStr}}</p>
                            <p>
                                <span v-if="(!scope.row.gross_weight||scope.row.gross_weight==='0') && scope.row.estimated_weight">预估：{{scope.row.estimated_weight | defaultStr}}kg</span>
                                <span v-else>{{(scope.row.gross_weight && scope.row.gross_weight!=='0' ? scope.row.gross_weight+'kg' : null) | defaultStr}}</span>
                            </p>
                            <p>
                                <span v-if="!scope.row.product_customs_info.tariff_rate && scope.row.product_customs_info.tariff_rate!==0 && (scope.row.forecast_import_tariff||scope.row.forecast_import_tariff===0)">预估关税：{{scope.row.forecast_import_tariff | percent}}</span>
                                <span v-else>{{scope.row.product_customs_info.tariff_rate | percent | inquiryPriceNormalText}}</span>

                                <span class="red" v-if="scope.row.extra_import_tariff"> + {{scope.row.extra_import_tariff | percent}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="货期/数量" width="110px">
                        <template slot-scope="scope">
                            <div>
                                <span>{{scope.row.prodcut_quotation.shipment_period===38 ? '预估货期：' : '货期：'}}</span>
                                <span>{{(scope.row.prodcut_quotation.shipment_period || '') | defaultStr}}</span>
                            </div>
                            <p>数量：{{scope.row.prodcut_quotation.quantity | defaultStr}}</p>
                            <p class="red" v-if="scope.row.productMinQty && scope.row.prodcut_quotation.quantity<scope.row.productMinQty">
                                最低起订量：{{scope.row.productMinQty}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="未税单价/含税单价/含税总价" min-width="130px">
                        <template slot-scope="scope">
                            <div class="right">
                                <inquiry-quotation-detail-product-show-tiered-price
                                        v-if="scope.row.prodcut_quotation.quote_supplier_id"
                                        :isAlreadyExpenseApproved="isAlreadyExpenseApproved"
                                        :queryId="queryId"
                                        :productLine="scope.row"
                                        :productMinQty.sync="scope.row.productMinQty"
                                        :priceDescription.sync="scope.row.priceDescription"
                                        :detailForm="detailForm">
                                </inquiry-quotation-detail-product-show-tiered-price>

                                <inquiry-quotation-detail-edit-product
                                        v-if="isZerosoCreated && !isAlreadySignedContract"
                                        :queryId="queryId"
                                        :productListData="productListData"
                                        :productLine="scope.row"
                                        @update="$emit('update')">
                                </inquiry-quotation-detail-edit-product>
                            </div>


                            <p :class="{'red':scope.row.prodcut_quotation.procurement.price}">
                                {{scope.row.prodcut_quotation.procurement.price | formatMoney('EUR') | inquiryPriceNormalText}}
                            </p>
                            <p>{{scope.row.prodcut_quotation.procurement.cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}</p>
                            <p>{{scope.row.prodcut_quotation.procurement.total_cny_price_with_tariff | formatMoney('CNY') | inquiryPriceNormalText}}</p>

                            <div>
                                <p v-if="scope.row.priceDescription">报价备注：{{scope.row.priceDescription}}</p>

                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='QUOTE_REFUSED'">该产品不报价,请删除该产品！</el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='CCC'">该产品为3C产品,请删除该产品！</el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='EXPIRE'">该产品 供应商报价 已过期,请删除或更新价格！</el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.product_quote_state==='PARTS'">该产品为非独立销售产品，请添加相关主配件！</el-tag>
                            </div>
                            <div class="padding-top-10">
                                <FileListShow
                                        :fileList.sync="scope.row.file_id_list">
                                </FileListShow>

                                <inquiry-quotation-detail-product-file-update
                                        :queryId="queryId"
                                        :productId="scope.row.product_id"
                                        :file_id_list="scope.row.file_id_list"
                                        :index="scope.$index + 1"
                                        :brandName="detailForm.brand ? detailForm.brand.name : ''"
                                        @update="$emit('update')">
                                </inquiry-quotation-detail-product-file-update>
                            </div>
                        </template>
                    </el-table-column>


                    <template v-if="isAllowQuotation">
                        <el-table-column label="报价供应商">
                            <template slot="header">
                                <div>报价供应商</div>
                                <div>同型号未报价单号</div>
                            </template>
                            <template slot-scope="scope">
                                <div v-if="scope.row.isEditPrice">
                                    <el-select v-model="scope.row.supplier_id">
                                        <el-option
                                                v-for="item in supplierListData"
                                                :key="item.id"
                                                :label="item.company_info_with_follower.company_name"
                                                :value="item.company_info_with_follower.account_company_id">
                                            <span>{{item.company_info_with_follower.company_name}}</span>
                                            <el-tag size="mini" v-if="item.is_default">品牌推荐</el-tag>
                                        </el-option>
                                    </el-select>
                                    <p class="red" v-if="(!supplierListData || supplierListData.length===0)">该品牌未添加供应商</p>
                                </div>
                                <div v-else>{{supplierFilter(scope.row.supplier_id)}}</div>

                                <div v-if="scope.row.inquiry_sheet_attachments && scope.row.inquiry_sheet_attachments.length>0">
                                    <span v-for="(item,$index) in scope.row.inquiry_sheet_attachments" :key="$index">
                                        <router-link
                                                class="blue margin-right-5"
                                                target="_blank"
                                                v-if="item.inquiry_quotation_sheet_id"
                                                :to="'/inquiry-quotation/all/detail?id='+item.inquiry_quotation_sheet_id">
                                            {{item.inquiry_quotation_sheet_id}}
                                        </router-link>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="720px">
                            <template v-slot:header>
                                <table class="tiered-price-edit-table">
                                    <thead>
                                    <tr>
                                        <th>最小起订量</th>
                                        <th>面价(欧元)</th>
                                        <th class="col-discount">
                                            <div>
                                                优惠折扣(%)
                                            </div>
                                            <div>
                                                折扣系列(选一项)
                                            </div>
                                        </th>
                                        <th>独立销售</th>
                                        <th>货期(天)</th>
                                        <th>有效期</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                </table>
                            </template>
                            <template slot-scope="scope">
                                <tiered-price-edit
                                        :ref="'tieredPriceEdit'+scope.row.id"
                                        :isEditPrice.sync="scope.row.isEditPrice"
                                        :scopeRow.sync="scope.row"
                                        :brandId="detailForm.brand ? detailForm.brand.id :null"
                                        :supplierId="scope.row.supplier_id">
                                </tiered-price-edit>
                            </template>
                        </el-table-column>
                    </template>


                    <el-table-column width="260px">
                        <template slot-scope="scope">
                            <div v-if="isAllowQuotation && ['INQUIRY_SENT','INQUIRY_PUSHED'].indexOf(detailForm.inquriy_state)>-1">
                                <template v-if="!scope.row.isEditPrice">
                                    <div v-if="scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED'">
                                        <el-button size="mini" type="warning"
                                                   :disabled="hasEditAction" @click="clickEditRowPrice(scope.row)">编辑价格
                                        </el-button>
                                        <el-button size="mini" type="danger"
                                                   :disabled="hasEditAction" @click="clickMarkRefusedQuote(scope.row)">标记不报价
                                        </el-button>
                                    </div>

                                    <div>
                                        <el-button size="mini"
                                                   v-if="scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED'"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddCorrectProduct(scope.row,'invalid')">标无效
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="scope.row.product_quote_state==='INVALID' && scope.row.product_quote_state!=='REPLACED'"
                                                   :disabled="hasEditAction"
                                                   @click.native="setProductValid(scope.row.product_id,true)">恢复有效
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="scope.row.product_quote_state!=='INVALID'"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddCorrectProduct(scope.row,'replaced')">标替代
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="scope.row.product_quote_state!=='INVALID' && scope.row.product_quote_state!=='REPLACED'"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddParts(scope.row)">添加配件
                                        </el-button>
                                    </div>
                                </template>
                                <template v-else>
                                    <el-button size="mini" type="success" v-if="scope.row.isEditPrice"
                                               @click="saveEditRowPriceData(scope.row)">保存价格
                                    </el-button>
                                    <el-button size="mini" plain @click="clickCancelEdit(scope.row)">取消编辑</el-button>

                                </template>
                            </div>

                            <div  v-if="!scope.row.isEditPrice">
                                <div v-if="scope.row.product_quote_state==='INVALID'">
                                    <span>该产品无效</span>
                                    <div v-if="scope.row.correct_list && scope.row.correct_list.length>0">
                                        <inquiry-quotation-detail-product-show-correct
                                                typeName="正确产品"
                                                :row="scope.row"
                                                :productList="scope.row.correct_list">
                                        </inquiry-quotation-detail-product-show-correct>
                                    </div>
                                </div>
                                <div v-if="scope.row.product_quote_state==='REPLACED'">
                                    <span>该产品被替代</span>
                                    <div v-if="scope.row.replace_list && scope.row.replace_list.length>0">
                                        <inquiry-quotation-detail-product-show-correct
                                                typeName="替代产品"
                                                :row="scope.row"
                                                :productList="scope.row.replace_list">
                                        </inquiry-quotation-detail-product-show-correct>
                                    </div>
                                </div>

                                <div v-if="scope.row.main_parts && scope.row.main_parts.length>0">
                                    <inquiry-quotation-detail-product-show-correct
                                            typeName="主件"
                                            :row="scope.row"
                                            :productList="scope.row.main_parts">
                                    </inquiry-quotation-detail-product-show-correct>
                                </div>
                                <div v-if="scope.row.parts_list && scope.row.parts_list.length>0">
                                    <inquiry-quotation-detail-product-show-correct
                                            typeName="配件"
                                            :isRowspan="true"
                                            :row="scope.row"
                                            :productList="scope.row.parts_list">
                                    </inquiry-quotation-detail-product-show-correct>
                                </div>

                                <p v-if="scope.row.quotation_comment">
                                    备注：
                                    {{scope.row.quotation_comment.comment_no |
                                    productQuotationComment(scope.row.quotation_comment.comment_type,scope.row.quotation_comment.comment)}}
                                </p>
                            </div>


                        </template>
                    </el-table-column>
                </el-table>

            <inquiry-quotation-detail-add-product
                    class="margin-top-10"
                    v-if="isZerosoCreated && !isAlreadySignedContract"
                    :queryId="queryId"
                    :detailForm="detailForm"
                    @update="$emit('update')">
            </inquiry-quotation-detail-add-product>
        </el-card>


        <inquiry-price-detail-product-correct
                ref="inquiryPriceDetailProductCorrect"
                :detailForm="detailForm"
                :supplierListData="supplierListData"
                :currency="currency"
                :queryId="queryId"
                :apiPath="$api.inquiry_v6_0_quotations"
                @update="$emit('update')">
        </inquiry-price-detail-product-correct>

        <inquiry-price-detail-product-parts
                ref="inquiryPriceDetailProductParts"
                :detailForm="detailForm"
                :supplierListData="supplierListData"
                :currency="currency"
                :queryId="queryId"
                :apiPath="$api.inquiry_v6_0_quotations"
                @update="$emit('update')">
        </inquiry-price-detail-product-parts>

        <inquiry-price-detail-refused-quote
                ref="refusedQuote"
                @refusedQuoteSubmit="markRefusedQuoteSubmit">
        </inquiry-price-detail-refused-quote>
    </div>
</template>

<script>


    import InquiryQuotationDetailProductShowTieredPrice from "./inquiry-quotation-detail-product-show-tiered-price";
    import InquiryQuotationDetailProductShowCorrect from "./inquiry-quotation-detail-product-show-correct";
    import TieredPriceEdit from "../../inquiry-price/component/tieredPriceEdit";
    import InquiryPriceDetailProductCorrect from "../../inquiry-price/component/inquiry-price-detail-product-correct";
    import InquiryPriceDetailProductParts from "../../inquiry-price/component/inquiry-price-detail-product-parts";
    import InquiryPriceDetailRefusedQuote from "../../inquiry-price/component/inquiry-price-detail-refused-quote";
    import InquiryQuotationDetailProductFileUpdate from "./inquiry-quotation-detail-product-file-update";
    import InquiryQuotationDetailProductNameUpdate from "./inquiry-quotation-detail-product-name-update";
    import InquiryQuotationDetailEditProduct from "./inquiry-quotation-detail-edit-product";
    import InquiryQuotationDetailAddProduct from "./inquiry-quotation-detail-add-product";
    import InquiryQuotationDetailProductUpdateAllPrice from "./inquiry-quotation-detail-product-update-all-price";
    export default {
        components: {
            InquiryQuotationDetailProductUpdateAllPrice,
            InquiryQuotationDetailAddProduct,
            InquiryQuotationDetailEditProduct,
            InquiryQuotationDetailProductNameUpdate,
            InquiryQuotationDetailProductFileUpdate,
            InquiryPriceDetailRefusedQuote,
            InquiryPriceDetailProductParts,
            InquiryPriceDetailProductCorrect,
            TieredPriceEdit,
            InquiryQuotationDetailProductShowCorrect, InquiryQuotationDetailProductShowTieredPrice},
        props: ['queryId', 'detailForm', 'isAlreadyExpenseApproved', 'isAlreadySignedContract', 'hasEditAction','supplierListData','isAllowQuotation','currency','isZerosoCreated'],
        data() {
            return {
                loading: false,

                productListData: [],

            }
        },
        watch: {
            queryId() {
                this.init()
            },
            detailForm() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.detailForm && this.detailForm.products) {
                    let productListData = JSON.parse(JSON.stringify(this.detailForm.products));
                    for (let i = 0; i < productListData.length; i++) {
                        productListData[i].isEditPrice = false;
                        if (!productListData[i].supplier_id) productListData[i].supplier_id = null;
                        if (!productListData[i].price_list) {
                            productListData[i].price_list = [];
                        }
                        for (let k = 0; k < productListData[i].price_list.length; k++) {
                            productListData[i].price_list[k].discountPercent = productListData[i].price_list[k].discount || productListData[i].price_list[k].discount === 0 ? Number(productListData[i].price_list[k].discount * 100) : null;
                            productListData[i].supplier_id = productListData[i].price_list[k].vendor_company_id;
                        }
                    }
                    this.productListData = productListData;
                } else {
                    this.productListData = [];
                }
            },

            //编辑价格
            clickEditRowPrice(row) {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                row.isEditPrice = true;
                if (row.price_list.length === 0) {
                    this.$refs['tieredPriceEdit' + row.id].clickAddPriceList(row.price_list);
                }
                if (!row.supplier_id && this.detailForm.supplier_company && this.detailForm.supplier_company.account_company_id) {
                    row.supplier_id = this.detailForm.supplier_company.account_company_id;
                }
                this.$emit('update:hasEditAction', true);
            },
            //保存价格
            saveEditRowPriceData(row) {
                let self = this;
                if (!row.supplier_id) {
                    self.$message({
                        showClose: true,
                        message: '请选择供应商！',
                        type: 'error'
                    });
                    return
                }
                if (!row.price_list || row.price_list.length === 0) {
                    self.$message({
                        showClose: true,
                        message: '请填写价格！',
                        type: 'error'
                    });
                    return
                }

                let price_list = self.checkPriceRules(row.price_list);
                if (!price_list) return;
                for(let i=0;i<price_list.length;i++){
                    if(price_list[i].unit_sellable===false){
                        self.$confirm('注意：当选择非独立销售时，务必要给该产品添加配件，否则将无法销售', '提示', {
                            confirmButtonText: '继续提交',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.saveEditRowPriceDataSubmit(row,price_list)
                                }
                            }
                        });
                        return;
                    }
                }
                self.saveEditRowPriceDataSubmit(row,price_list)
            },
            saveEditRowPriceDataSubmit(row,price_list){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/' + row.product_id + '/price',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        price_list: price_list,
                        "currency": self.currency,
                        "product_id": row.product_id,
                        "supplier_id": row.supplier_id,
                        "sheet_id": self.queryId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.updatable) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.$emit('update');
                        }
                    }
                })
            },


            checkPriceRules(list) {
                let self = this;
                let price_list = [];
                for (let i = 0; i < list.length; i++) {
                    let priceItem = list[i];

                    if (!priceItem.min_qty && priceItem.min_qty !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写最小起订量，,最小填1',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.price && priceItem.price !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写面价！',
                            type: 'error'
                        });
                        return false
                    } else if (priceItem.price === '0' || priceItem.price === 0) {
                        self.$message({
                            showClose: true,
                            message: '面价必须大于0！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.discountPercent && priceItem.discountPercent !== 0 && !priceItem.discount_serie_id) {
                        self.$message({
                            showClose: true,
                            message: '优惠折扣 与 折扣系列，至少需要选填一项！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.shipment_period && priceItem.shipment_period !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写货期！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.expire_time) {
                        self.$message({
                            showClose: true,
                            message: '请填写有效期！',
                            type: 'error'
                        });
                        return false
                    }
                    price_list.push({
                        ...priceItem,
                        "discount": Number((priceItem.discountPercent / 100).toFixed(4)),
                        "source": "quote_sheet",
                    })
                }
                return price_list;
            },


            //取消编辑
            clickCancelEdit() {
                this.isEditPrice = false;
                this.$emit('update');
            },

            //单行标记不报价
            clickMarkRefusedQuote(row){
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                self.$refs.refusedQuote.init({
                    product:row,
                    requestData:{
                        "product_id": row.product_id,
                        "sheet_id": self.queryId,
                    }
                })
            },
            //不报价数据提交
            markRefusedQuoteSubmit(requestData){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/' + requestData.product_id + '/refusedQuote',
                    type: 'PUT',
                    requestBody: true,
                    data: requestData,
                    success () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.$emit('update');
                    }
                });
            },


            //标记无效，恢复有效
            setProductValid(id, valid, data,callback) {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/' + id + '/markValid',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        "product_id": id,
                        "sheet_id": self.queryId,
                        "valid": valid,
                        ...data
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.updatable) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.$emit('update');
                            if(callback) callback();
                        }
                    },error(){
                        if(callback) callback();
                    }
                });
            },


            //关联正确型号的操作，标记无效、标记替代等
            clickAddCorrectProduct(row,correctProductType) {
                if (this.$store.state.currentCompany.account_company_id !== 9428) {
                    this.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                this.$refs.inquiryPriceDetailProductCorrect.init({
                    row:row,
                    correctProductType:correctProductType
                })
            },
            //添加配件
            clickAddParts(row) {
                if (this.$store.state.currentCompany.account_company_id !== 9428) {
                    this.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                this.$refs.inquiryPriceDetailProductParts.init(row)
            },


            supplierFilter(val) {
                let str = '';
                for (let i = 0; i < this.supplierListData.length; i++) {
                    if (this.supplierListData[i].company_info_with_follower.account_company_id === val) {
                        str = this.supplierListData[i].company_info_with_follower.company_name;
                    }
                }
                return str || val;
            },
            tableRowClassName({row}) {
                if (row.product_quote_state === 'INVALID') {
                    return 'row-invalid';
                } else if (row.mark_as_deleted) {
                    return 'row-invalid';
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
        margin-bottom: 20px;

        .table {
            border-collapse: collapse;
            width: 100%;

            th, td {
                width: 25%;
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
                width: 25%;
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
            }
        }
    }

</style>
