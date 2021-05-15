<template>
    <div class="clearfix inquiry-price-detail-product" v-loading="loading">

        <el-card>
            <div slot="header" class="clearfix">
                <h3 class="left">产品明细</h3>
                <div class="right" v-if="['DRAFT'].indexOf(detailForm.state)>-1">
                    <inquiry-price-create
                            class="right"
                            :disabled="!detailForm.new_pooled_products  || hasEditAction"
                            :sheetId="queryId"
                            :brandId="detailForm.brand.id"
                            @update="$emit('update')">
                        <el-badge :value="detailForm.new_pooled_products" :hidden="!detailForm.new_pooled_products">
                            <el-button type="primary" :disabled="!detailForm.new_pooled_products  || hasEditAction">
                                添加产品
                            </el-button>
                        </el-badge>
                    </inquiry-price-create>
                </div>
            </div>
            <div class="padding-bottom-10">
                <el-input style="width: 400px;" v-model="productKeyword" clearable
                          placeholder="输入型号/订货号关键词，不区分大小写，自动筛选"></el-input>

                <el-checkbox-group v-model="productHasNetPrice" class="inline-block margin-left-20">
                    <el-checkbox :label="true">已填价格</el-checkbox>
                    <el-checkbox :label="false">未填价格</el-checkbox>
                </el-checkbox-group>

                <el-button class="margin-left-20" type="primary" plain @click="clearFilter">清除筛选和排序</el-button>
            </div>
            <el-table :data="productListDataShow" ref="productTable" border :row-class-name="tableRowClassName">
                <el-table-column label="序号" width="100" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.$index+1}}</p>
                        <el-tag v-if="scope.row.is_quote" type="success" effect="dark">已提交报价</el-tag>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>
                        <p>型号</p>
                        <p>订货号</p>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.isEdit">
                            <p>
                                <el-input v-model="scope.row.type_no"></el-input>
                            </p>
                            <p>
                                <el-input v-model="scope.row.order_no"></el-input>
                            </p>
                        </div>
                        <div v-else>
                            <p>
                                <router-link class="blue" target="_blank"
                                             :to="'/product/product/detail?id='+scope.row.product_id">
                                    {{scope.row.type_no}}
                                </router-link>

                                <a v-if="scope.row.type_no"
                                   :title="'搜索'+detailForm.brand.name+' '+scope.row.type_no"
                                   class="icon-google-search"
                                   target="_blank"
                                   :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.type_no">
                                </a>
                            </p>
                            <p>
                                <router-link class="blue" target="_blank"
                                             :to="'/product/product/detail?id='+scope.row.product_id">
                                    {{scope.row.order_no}}
                                </router-link>

                                <a v-if="scope.row.order_no"
                                   :title="'搜索'+detailForm.brand.name+' '+scope.row.order_no"
                                   class="icon-google-search"
                                   target="_blank"
                                   :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.order_no">
                                </a>
                            </p>
                        </div>

                    </template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>
                        <p>参数</p>
                        <p>附件</p>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.isEdit" type="textarea" :rows="4"
                                  v-model="scope.row.parameters"></el-input>
                        <div class="margin-bottom-10" v-else>
                            <el-tooltip effect="light" placement="top">
                                <span class="nowrap">{{scope.row.parameters}}</span>
                                <pre slot="content" class="scroll" style="max-height: 500px;"
                                     v-html="scope.row.parameters"></pre>
                            </el-tooltip>
                        </div>

                        <div v-if="scope.row.inquiryFileList">
                            <FileListShow :fileList="scope.row.inquiryFileList"></FileListShow>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>
                        <span>询报价单号</span>
                        <el-tooltip placement="top">
                            <i class="el-icon-question"></i>
                            <div slot="content">当前型号对应的询报价单号，不包含状态：已取消、已签订合同、已执行合同</div>
                        </el-tooltip>
                    </template>
                    <template slot-scope="scope">
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
                            <p v-if="scope.row.inquiry_sheet_attachments[0] && scope.row.inquiry_sheet_attachments[0].create_time">
                                {{scope.row.inquiry_sheet_attachments[0].create_time | zerosoCompanyTime}}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>
                        <span>供应商</span>
                        <el-tooltip placement="top">
                            <i class="el-icon-question"></i>
                            <div slot="content">需要在品牌详情页添加供应商</div>
                        </el-tooltip>
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
                        <span v-else>{{supplierFilter(scope.row.supplier_id)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="760px">
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


                <el-table-column prop="valid" width="260px">
                    <template slot-scope="scope">
                        <template
                                v-if="detailForm.state==='DRAFT' || detailForm.state==='INQUIRY_SENT' || detailForm.state==='INQUIRY_PUSHED' || detailForm.state==='QUOTE_REFUSED'">
                            <template v-if="!scope.row.isEdit && !scope.row.isEditPrice">
                                <div v-if="detailForm.state==='DRAFT' || detailForm.state==='INQUIRY_SENT' || detailForm.state==='INQUIRY_PUSHED'">
                                    <el-button size="mini" type="primary"
                                               v-if="scope.row.valid && !scope.row.replaced"
                                               :disabled="hasEditAction || !productAllowChangeBaseInfo"
                                               @click="clickEditRow(scope.row)">编辑产品
                                    </el-button>
                                    <el-button size="mini"
                                               v-if="scope.row.valid && !scope.row.replaced"
                                               :disabled="hasEditAction"
                                               @click.native="removeProduct(scope.row)"
                                               title="若是产品暂时拿不到价格，可先移除，移除该产品后，该产品将回到询价池">移除
                                    </el-button>
                                </div>

                                <div v-if="detailForm.state==='INQUIRY_SENT' || detailForm.state==='INQUIRY_PUSHED' || detailForm.state==='QUOTE_REFUSED'">
                                    <div>
                                        <el-button size="mini" type="warning"
                                                   v-if="scope.row.valid && !scope.row.replaced"
                                                   :disabled="hasEditAction" @click="clickEditRowPrice(scope.row)">编辑价格
                                        </el-button>
                                        <el-button size="mini" type="danger"
                                                   v-if="!scope.row.is_quote"
                                                   :disabled="hasEditAction" @click="clickSubmitPriceToB(scope.row)">提交报价
                                        </el-button>
                                    </div>

                                    <div>
                                        <el-button size="mini"
                                                   v-if="scope.row.valid && !scope.row.replaced"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddCorrectProduct(scope.row,'invalid')">标无效
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="!scope.row.valid && !scope.row.replaced"
                                                   :disabled="hasEditAction"
                                                   @click.native="setProductValid(scope.row.product_id,true)">恢复有效
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="scope.row.valid"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddCorrectProduct(scope.row,'replaced')">标替代
                                        </el-button>
                                        <el-button size="mini"
                                                   v-if="scope.row.valid && !scope.row.replaced"
                                                   :disabled="hasEditAction"
                                                   @click.native="clickAddParts(scope.row)">添加配件
                                        </el-button>
                                    </div>
                                </div>


                            </template>
                            <template v-else>
                                <el-button size="mini" type="success" v-if="scope.row.isEdit"
                                           @click="saveProductData(scope.row)">保存产品
                                </el-button>

                                <el-button size="mini" type="success" v-if="scope.row.isEditPrice"
                                           @click="saveEditRowPriceData(scope.row)">保存价格
                                </el-button>

                                <el-button size="mini" plain @click="clickCancelEdit(scope.row)">取消编辑</el-button>
                            </template>

                        </template>

                        <div style="font-size: 12px;line-height:1.5em;" v-if="!scope.row.isEdit && !scope.row.isEditPrice">
                            <div v-if="!scope.row.valid">
                                <span>该产品无效{{scope.row.correct_list && scope.row.correct_list.length>0?'，关联产品为：':''}}</span>
                                <template v-if="scope.row.correct_list">
                                    <p v-for="(productItem,$index) in scope.row.correct_list" :key="$index">
                                        <router-link class="blue" target="_blank" :to="'/product/product/detail?id='+productItem.id">
                                            型号：{{productItem.product_name}}<br>
                                            订货号：{{productItem.product_order_no}}
                                        </router-link>
                                    </p>
                                </template>
                            </div>
                            <div v-if="scope.row.replaced">
                                <span>该产品被替代：</span>
                                <template v-if="scope.row.replace_list">
                                    <p v-for="(productItem,$index) in scope.row.replace_list" :key="$index">
                                        <router-link class="blue" target="_blank" :to="'/product/product/detail?id='+productItem.id">
                                            型号：{{productItem.product_name}}<br>
                                            订货号：{{productItem.product_order_no}}
                                        </router-link>
                                    </p>
                                </template>
                            </div>

                            <div v-if="scope.row.parts_list && scope.row.parts_list.length>0">
                                <inquiry-price-detail-product-show-parts :productLine="scope.row"></inquiry-price-detail-product-show-parts>
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

        </el-card>



        <inquiry-price-detail-product-correct
                ref="inquiryPriceDetailProductCorrect"
                :detailForm="detailForm"
                :supplierListData="supplierListData"
                :currency="currency"
                :queryId="queryId"
                :apiPath="$api.inquiry_v6_brand_inquiries_inquiries"
                @update="$emit('update')">
        </inquiry-price-detail-product-correct>

        <inquiry-price-detail-product-parts
                ref="inquiryPriceDetailProductParts"
                :detailForm="detailForm"
                :supplierListData="supplierListData"
                :currency="currency"
                :queryId="queryId"
                :apiPath="$api.inquiry_v6_brand_inquiries_inquiries"
                @update="$emit('update')">
        </inquiry-price-detail-product-parts>
    </div>
</template>

<script>


    import TieredPriceEdit from "./tieredPriceEdit";
    import InquiryPriceCreate from "../../inquiry-price-pool/component/inquiry-price-create";
    import InquiryPriceDetailProductCorrect from "./inquiry-price-detail-product-correct";
    import InquiryPriceDetailProductParts from "./inquiry-price-detail-product-parts";
    import InquiryPriceDetailProductShowParts from "./inquiry-price-detail-product-show-parts";
    import HostConfig from "../../../config/host-config";

    export default {
        components: {
            InquiryPriceDetailProductShowParts,
            InquiryPriceDetailProductParts,
            InquiryPriceDetailProductCorrect, InquiryPriceCreate, TieredPriceEdit},
        props: ['queryId', 'detailForm', 'hasEditAction', 'currency', 'supplierListData', 'supplierNormalSelectId'],
        data() {

            return {
                loading: false,

                productListData: [],

                productKeyword: '',
                productHasNetPrice: [],

            }
        },
        computed: {
            productListDataShow() {
                let arr = [];
                this.productListData.forEach((item) => {
                    if (
                            !this.productKeyword
                            || (this.productKeyword && item.type_no && item.type_no.toLowerCase().indexOf(this.productKeyword.toLowerCase()) > -1)
                            || (this.productKeyword && item.order_no && item.order_no.toLowerCase().indexOf(this.productKeyword.toLowerCase()) > -1)
                    ) {
                        if (this.productHasNetPrice.length === 1) {
                            if (this.productHasNetPrice[0]) {
                                if (item.price_list && item.price_list.length > 0) arr.push(item)
                            } else {
                                if (!item.price_list || item.price_list.length === 0) arr.push(item)
                            }
                        } else {
                            arr.push(item)
                        }
                    }
                });
                return arr
            },
            productAllowChangeBaseInfo() {
                return HostConfig.productAllowChangeBaseInfo.length===0 || HostConfig.productAllowChangeBaseInfo.indexOf(this.$store.state.userInfo.id) > -1
            },
        },
        watch: {
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
                        productListData[i].isEdit = false;
                        productListData[i].isEditPrice = false;
                        if (!productListData[i].supplier_id) productListData[i].supplier_id = null;

                        if (!productListData[i].price_list) {
                            productListData[i].price_list = [];
                            if (productListData[i].net_price) {
                                productListData[i].price_list.push({
                                    "discount": productListData[i].discount,
                                    "discountPercent": productListData[i].discount || productListData[i].discount === 0 ? Number(productListData[i].discount * 100) : null,
                                    "expire_time": productListData[i].expire_time || this.$moment().endOf('year').format('YYYY-MM-DD'),
                                    "min_qty": productListData[i].min_qty,
                                    "price": productListData[i].net_price,
                                    "shipment_period": productListData[i].shipment_period,
                                });
                                if (this.detailForm.supplier_company && this.detailForm.supplier_company.account_company_id) {
                                    productListData[i].supplier_id = this.detailForm.supplier_company.account_company_id;
                                }
                            }
                        }


                        for (let k = 0; k < productListData[i].price_list.length; k++) {
                            productListData[i].price_list[k].discountPercent = productListData[i].price_list[k].discount || productListData[i].price_list[k].discount === 0 ? Number(productListData[i].price_list[k].discount * 100) : null;
                        }

                        //遍历产品对应不同询报价单附件
                        productListData[i].inquiryFileList = [];
                        if (productListData[i].inquiry_sheet_attachments) {
                            let inquiry_sheet_attachments = productListData[i].inquiry_sheet_attachments;
                            for (let k = 0; k < inquiry_sheet_attachments.length; k++) {
                                if (inquiry_sheet_attachments[k].attachments && inquiry_sheet_attachments[k].attachments.file_id_list) {
                                    let file_id_list = inquiry_sheet_attachments[k].attachments.file_id_list;
                                    for (let m = 0; m < file_id_list.length; m++) {
                                        try {
                                            productListData[i].inquiryFileList.push(JSON.parse(file_id_list[m]));
                                        } catch (e) {
                                            console.log(e)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.productListData = productListData;
                } else {
                    this.productListData = [];
                }
            },

            //编辑产品信息
            clickEditRow(row) {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                row.isEdit = true;
                this.$emit('update:hasEditAction', true);
            },
            //保存产品信息
            saveProductData(row) {
                let self = this;
                if (!row.type_no) {
                    self.$message({
                        showClose: true,
                        message: '缺少型号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                        type: 'error'
                    });
                    return
                }
                if (!row.order_no) {
                    self.$message({
                        showClose: true,
                        message: '缺少订货号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + row.product_id + '/info',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        id: row.product_id,
                        "product_name": row.type_no || '',
                        "product_order_no": row.order_no || '',
                        "product_parameter": row.parameters || '',
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
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
                    url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId + '/products/' + row.product_id + '/price',
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
            //提交报价
            clickSubmitPriceToB(row){
                let self = this;
                if(row.price_list.length===0 && row.valid && !row.replaced){
                    self.$message({
                        showClose: true,
                        message: '提交报价之前，必须操作：填写价格、标记无效、标记替代！',
                        type: 'error'
                    });
                    return
                }
                self.$confirm('在提交报价之前，请确保<b class="red">供应商、面价、折扣</b>等都填写正确，如果有主配件，请确保主配件报价来自同一个供应商', '提示', {
                    confirmButtonText: '继续提交',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true,
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/products/' + row.product_id + '/quote',
                                type: 'PUT',
                                requestBody: true,
                                data:{
                                    sheet_id:self.queryId,
                                },
                                success () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '提交成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update');
                                }
                            })
                        }
                    }
                });
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
                        "source": "inquiry_sheet",
                    })
                }
                return price_list;
            },


            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.isEditPrice = false;
                this.$emit('update');
            },


            //更新某些字段
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
                    url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId + '/products/' + id + '/markValid',
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


            //移除该产品，回到询价池
            removeProduct(row) {
                let self = this;
                if (this.detailForm.products.length <= 1) {
                    self.$message({
                        showClose: true,
                        message: '不能全部移除，至少需要保留一个产品！',
                        type: 'error'
                    });
                    return
                }
                if (row.product_id) {
                    self.$http({
                        url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId + '/products/' + row.product_id,
                        type: 'DELETE',
                        requestBody: true,
                        data: {
                            "product_id": row.product_id,
                            "sheet_id": self.queryId
                        },
                        success: function () {
                            self.$emit('update');
                        }
                    })
                }
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


            clearFilter() {
                this.productKeyword = '';
                this.productHasNetPrice = [];
                this.$refs.productTable.clearSort();
            },

            tableRowClassName({row}) {
                if (!row.valid) {
                    return 'row-invalid';
                }
                if (row.replaced) {
                    return 'row-replaced';
                }
                return '';
            },

        }
    }
</script>

<style lang="scss">
    .row-invalid,
    .row-replaced {
        color: #999999;
        td {
            background-color: #dddddd !important;
        }
    }
</style>
